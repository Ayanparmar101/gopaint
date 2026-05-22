import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

import { clampScore } from '../shared/scoring';
import { SCORE_SAMPLE_SIZE, type ReferenceModel, type ScoreBreakdown, type SubmissionSummary } from '../shared/game';
import { imageDataUrlFromReference } from './referenceImage';

type RGB = [number, number, number];

type DecodedImage = {
  width: number;
  height: number;
  data: Buffer;
};

type ImageFeatures = {
  pixels: Uint8ClampedArray;
  mask: Uint8Array;
  dilatedMask: Uint8Array;
  edgeMap: Float32Array;
  foregroundCount: number;
  centroidX: number;
  centroidY: number;
  histogram: Float64Array;
};

const HISTOGRAM_BINS = 8;
const DILATE_RADIUS = 3;

function parseDataUrl(dataUrl: string): Buffer {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid canvas payload.');
  }

  return Buffer.from(dataUrl.slice(commaIndex + 1), 'base64');
}

function decodeImageDataUrl(dataUrl: string): DecodedImage {
  const raw = parseDataUrl(dataUrl);

  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
    return jpeg.decode(raw);
  }

  return PNG.sync.read(raw);
}

function sampleImage(img: DecodedImage, size = SCORE_SAMPLE_SIZE): Uint8ClampedArray {
  const sampled = new Uint8ClampedArray(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    const sourceY = Math.min(img.height - 1, Math.floor(((y + 0.5) / size) * img.height));

    for (let x = 0; x < size; x += 1) {
      const sourceX = Math.min(img.width - 1, Math.floor(((x + 0.5) / size) * img.width));
      const sourceIndex = (sourceY * img.width + sourceX) * 4;
      const targetIndex = (y * size + x) * 4;

      sampled[targetIndex] = img.data[sourceIndex];
      sampled[targetIndex + 1] = img.data[sourceIndex + 1];
      sampled[targetIndex + 2] = img.data[sourceIndex + 2];
      sampled[targetIndex + 3] = img.data[sourceIndex + 3];
    }
  }

  return sampled;
}

function estimateBackgroundColor(pixels: Uint8ClampedArray, size: number): RGB {
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let sampleCount = 0;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (x !== 0 && y !== 0 && x !== size - 1 && y !== size - 1) {
        continue;
      }

      const index = (y * size + x) * 4;
      totalRed += pixels[index];
      totalGreen += pixels[index + 1];
      totalBlue += pixels[index + 2];
      sampleCount += 1;
    }
  }

  if (sampleCount === 0) {
    return [255, 255, 255];
  }

  return [
    Math.round(totalRed / sampleCount),
    Math.round(totalGreen / sampleCount),
    Math.round(totalBlue / sampleCount),
  ];
}

function isForegroundPixel(pixels: Uint8ClampedArray, index: number, background: RGB): boolean {
  const alpha = pixels[index + 3];
  if (alpha < 12) {
    return false;
  }

  const redDelta = pixels[index] - background[0];
  const greenDelta = pixels[index + 1] - background[1];
  const blueDelta = pixels[index + 2] - background[2];
  const distance = Math.sqrt(redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta);

  return distance > 28;
}

function dilateMask(mask: Uint8Array, size: number, radius: number): Uint8Array {
  const dilated = new Uint8Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (mask[y * size + x] !== 1) {
        continue;
      }

      const minY = Math.max(0, y - radius);
      const maxY = Math.min(size - 1, y + radius);
      const minX = Math.max(0, x - radius);
      const maxX = Math.min(size - 1, x + radius);

      for (let dy = minY; dy <= maxY; dy += 1) {
        for (let dx = minX; dx <= maxX; dx += 1) {
          dilated[dy * size + dx] = 1;
        }
      }
    }
  }
  return dilated;
}

function luminance(red: number, green: number, blue: number): number {
  return 0.299 * red + 0.587 * green + 0.114 * blue;
}

function computeEdgeMap(pixels: Uint8ClampedArray, size: number, threshold = 0.12): Float32Array {
  const grey = new Float32Array(size * size);

  for (let index = 0; index < size * size; index += 1) {
    const sourceIndex = index * 4;
    grey[index] = luminance(pixels[sourceIndex], pixels[sourceIndex + 1], pixels[sourceIndex + 2]);
  }

  const edges = new Float32Array(size * size);

  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < size - 1; x += 1) {
      const center = y * size + x;
      const gx =
        -grey[center - size - 1] - 2 * grey[center - 1] - grey[center + size - 1]
        + grey[center - size + 1] + 2 * grey[center + 1] + grey[center + size + 1];
      const gy =
        -grey[center - size - 1] - 2 * grey[center - size] - grey[center - size + 1]
        + grey[center + size - 1] + 2 * grey[center + size] + grey[center + size + 1];

      const magnitude = Math.hypot(gx, gy) / 1020;
      edges[center] = magnitude >= threshold ? magnitude : 0;
    }
  }

  return edges;
}

function dilateEdgeMap(edgeMap: Float32Array, size: number, radius: number): Float32Array {
  const dilated = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (edgeMap[y * size + x] === 0) {
        continue;
      }

      const minY = Math.max(0, y - radius);
      const maxY = Math.min(size - 1, y + radius);
      const minX = Math.max(0, x - radius);
      const maxX = Math.min(size - 1, x + radius);

      for (let dy = minY; dy <= maxY; dy += 1) {
        for (let dx = minX; dx <= maxX; dx += 1) {
          dilated[dy * size + dx] = Math.max(dilated[dy * size + dx], edgeMap[y * size + x]);
        }
      }
    }
  }
  return dilated;
}

function buildColorHistogram(pixels: Uint8ClampedArray, mask: Uint8Array, size: number): Float64Array {
  const histogram = new Float64Array(HISTOGRAM_BINS * HISTOGRAM_BINS * HISTOGRAM_BINS);

  for (let index = 0; index < size * size; index += 1) {
    if (mask[index] !== 1) {
      continue;
    }

    const sourceIndex = index * 4;
    const redBin = Math.min(HISTOGRAM_BINS - 1, Math.floor((pixels[sourceIndex] / 256) * HISTOGRAM_BINS));
    const greenBin = Math.min(HISTOGRAM_BINS - 1, Math.floor((pixels[sourceIndex + 1] / 256) * HISTOGRAM_BINS));
    const blueBin = Math.min(HISTOGRAM_BINS - 1, Math.floor((pixels[sourceIndex + 2] / 256) * HISTOGRAM_BINS));

    const binIndex = redBin * HISTOGRAM_BINS * HISTOGRAM_BINS + greenBin * HISTOGRAM_BINS + blueBin;
    histogram[binIndex] += 1;
  }

  const total = histogram.reduce((sum, value) => sum + value, 0);
  if (total > 0) {
    for (let index = 0; index < histogram.length; index += 1) {
      histogram[index] /= total;
    }
  }

  return histogram;
}

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function extractFeatures(dataUrl: string): ImageFeatures {
  const img = decodeImageDataUrl(dataUrl);
  const sampled = sampleImage(img);
  const size = SCORE_SAMPLE_SIZE;
  const background = estimateBackgroundColor(sampled, size);
  const mask = new Uint8Array(size * size);

  let foregroundCount = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const pixelIndex = y * size + x;
      const sourceIndex = pixelIndex * 4;
      const painted = isForegroundPixel(sampled, sourceIndex, background);

      if (!painted) {
        continue;
      }

      mask[pixelIndex] = 1;
      foregroundCount += 1;
      centroidX += x;
      centroidY += y;
    }
  }

  const dilatedMask = dilateMask(mask, size, DILATE_RADIUS);
  const edgeMap = computeEdgeMap(sampled, size);
  const histogram = buildColorHistogram(sampled, mask, size);

  return {
    pixels: sampled,
    mask,
    dilatedMask,
    edgeMap,
    foregroundCount,
    centroidX: foregroundCount > 0 ? centroidX / foregroundCount : 0,
    centroidY: foregroundCount > 0 ? centroidY / foregroundCount : 0,
    histogram,
  };
}

function countNonZeroBins(histogram: Float64Array): number {
  let count = 0;
  for (let index = 0; index < histogram.length; index += 1) {
    if (histogram[index] > 0.001) {
      count += 1;
    }
  }
  return count;
}

function computeKidScore(reference: ImageFeatures, submission: ImageFeatures, elapsedMs: number, limitMs: number): { score: number; breakdown: ScoreBreakdown } {
  const size = SCORE_SAMPLE_SIZE;
  const totalPixels = size * size;

  const refHasContent = reference.foregroundCount > 0;
  const subHasContent = submission.foregroundCount > 0;

  const speed = clampUnit(limitMs > 0 ? 1 - elapsedMs / limitMs : 0);

  if (!refHasContent) {
    return {
      score: 0,
      breakdown: { fill: 0, color: 0, structure: 0, speed, outside: 0 },
    };
  }

  if (!subHasContent) {
    return {
      score: 0,
      breakdown: { fill: 0, color: 0, structure: 0, speed, outside: 0 },
    };
  }

  const refDensity = reference.foregroundCount / totalPixels;
  const subDensity = submission.foregroundCount / totalPixels;
  const effortRatio = subDensity / Math.max(refDensity, 0.001);
  const subColorBins = countNonZeroBins(submission.histogram);

  const isScribble = submission.foregroundCount < 400
    || effortRatio < 0.25
    || (subColorBins < 3 && submission.foregroundCount < 1500);

  if (isScribble) {
    return {
      score: clampScore(speed * 5),
      breakdown: { fill: 0, color: 0, structure: 0, speed, outside: 0 },
    };
  }

  // --- 1. Local overlap with tolerance (35%) ---
  // How much of the submission's foreground falls within the reference's dilated area?
  let overlapInDilated = 0;
  let subForegroundInRefDilated = 0;
  for (let index = 0; index < totalPixels; index += 1) {
    if (submission.mask[index] === 1) {
      if (reference.dilatedMask[index] === 1) {
        subForegroundInRefDilated += 1;
      }
    }
    if (reference.mask[index] === 1 && submission.mask[index] === 1) {
      overlapInDilated += 1;
    }
  }

  const recall = reference.foregroundCount > 0 ? overlapInDilated / reference.foregroundCount : 0;
  const precision = submission.foregroundCount > 0 ? subForegroundInRefDilated / submission.foregroundCount : 0;
  const overlapScore = clampUnit(recall * 0.5 + precision * 0.5);

  // --- 2. Color accuracy in overlapping areas (25%) ---
  let colorDiffTotal = 0;
  let overlapPixelCount = 0;
  for (let index = 0; index < totalPixels; index += 1) {
    if (reference.mask[index] === 1 && submission.mask[index] === 1) {
      const sourceIndex = index * 4;
      const redDelta = reference.pixels[sourceIndex] - submission.pixels[sourceIndex];
      const greenDelta = reference.pixels[sourceIndex + 1] - submission.pixels[sourceIndex + 1];
      const blueDelta = reference.pixels[sourceIndex + 2] - submission.pixels[sourceIndex + 2];
      colorDiffTotal += Math.sqrt(redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta) / 441.6729559300637;
      overlapPixelCount += 1;
    }
  }
  const color = overlapPixelCount > 0 ? clampUnit(1 - colorDiffTotal / overlapPixelCount) : 0;

  // --- 3. Edge structure with dilation tolerance (20%) ---
  const refEdgesDilated = dilateEdgeMap(reference.edgeMap, size, 2);
  let edgeMatchCount = 0;
  let subEdgeCount = 0;
  for (let index = 0; index < totalPixels; index += 1) {
    if (submission.edgeMap[index] > 0) {
      subEdgeCount += 1;
      if (refEdgesDilated[index] > 0) {
        edgeMatchCount += 1;
      }
    }
  }
  const edgeRecall = reference.foregroundCount > 0 ? edgeMatchCount / Math.max(subEdgeCount, 1) : 0;
  const structure = clampUnit(edgeRecall);

  // --- 4. Coverage ratio (10%) ---
  const coverageRatio = effortRatio > 1 ? 1 : effortRatio;
  const coverage = clampUnit(coverageRatio);

  // --- 5. Centroid proximity (10%) ---
  const referenceCenterX = reference.centroidX / (size - 1);
  const referenceCenterY = reference.centroidY / (size - 1);
  const submissionCenterX = submission.centroidX / (size - 1);
  const submissionCenterY = submission.centroidY / (size - 1);
  const centroidDistance = Math.hypot(referenceCenterX - submissionCenterX, referenceCenterY - submissionCenterY);
  const position = clampUnit(1 - centroidDistance / Math.SQRT2);

  const weightedScore = overlapScore * 35 + color * 25 + structure * 20 + coverage * 10 + position * 10;

  return {
    score: clampScore(weightedScore),
    breakdown: {
      fill: clampUnit(overlapScore),
      color,
      structure: clampUnit(structure),
      speed,
      outside: 0,
    },
  };
}

export function scoreSubmission(reference: ReferenceModel, dataUrl: string, elapsedMs: number, limitMs: number): { score: number; breakdown: ScoreBreakdown } {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/') || !dataUrl.includes(',')) {
    throw new Error(`Invalid canvas data URL (expected data:image/..., got ${dataUrl ? dataUrl.slice(0, 40) + '...' : 'empty'})`);
  }

  const referenceImage = imageDataUrlFromReference(reference);
  const referenceFeatures = extractFeatures(referenceImage);
  const submissionFeatures = extractFeatures(dataUrl);

  return computeKidScore(referenceFeatures, submissionFeatures, elapsedMs, limitMs);
}

export function makeBlankSubmission(playerId: string, playerName: string): SubmissionSummary {
  return {
    playerId,
    playerName,
    score: 0,
    submittedAt: Date.now(),
    elapsedMs: 0,
    breakdown: {
      fill: 0,
      color: 0,
      structure: 0,
      speed: 0,
      outside: 0,
    },
  };
}
