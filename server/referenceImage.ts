import { PNG } from 'pngjs';

import { type ReferenceModel } from '../shared/game';
import { rasterizeReference } from './referenceRaster';

export function referenceToDataUrl(reference: ReferenceModel, size = 512): string {
  const raster = rasterizeReference(reference, size);
  const png = new PNG({ width: size, height: size });
  png.data = Buffer.from(raster);
  const buffer = PNG.sync.write(png);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

export function imageDataUrlFromReference(reference: ReferenceModel, size = 512): string {
  if (reference.imageDataUrl) {
    return reference.imageDataUrl;
  }

  return referenceToDataUrl(reference, size);
}
