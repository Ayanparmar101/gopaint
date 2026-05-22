import { SCORE_SAMPLE_SIZE, type Point, type ReferenceModel, type ShapeSpec } from '../shared/game';

function parseColor(value: string): [number, number, number, number] {
  if (!value.startsWith('#')) {
    throw new Error(`Unsupported color format: ${value}`);
  }

  const hex = value.slice(1);
  const expanded = hex.length === 3
    ? hex
        .split('')
        .map((char) => char + char)
        .join('')
    : hex;

  const numeric = Number.parseInt(expanded, 16);
  return [
    (numeric >> 16) & 255,
    (numeric >> 8) & 255,
    numeric & 255,
    255,
  ];
}

function writePixel(buffer: Uint8ClampedArray, index: number, color: [number, number, number, number]): void {
  buffer[index] = color[0];
  buffer[index + 1] = color[1];
  buffer[index + 2] = color[2];
  buffer[index + 3] = color[3];
}

function isPointInsidePolygon(point: Point, vertices: Point[]): boolean {
  let isInside = false;

  for (let index = 0, previous = vertices.length - 1; index < vertices.length; previous = index, index += 1) {
    const current = vertices[index];
    const prior = vertices[previous];

    const intersects = current.y > point.y !== prior.y > point.y
      && point.x < ((prior.x - current.x) * (point.y - current.y)) / (prior.y - current.y) + current.x;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function fillCircle(buffer: Uint8ClampedArray, size: number, shape: Extract<ShapeSpec, { kind: 'circle' }>): void {
  const color = parseColor(shape.fill);
  const minX = Math.max(0, Math.floor((shape.cx - shape.r) * size / 100));
  const maxX = Math.min(size - 1, Math.ceil((shape.cx + shape.r) * size / 100));
  const minY = Math.max(0, Math.floor((shape.cy - shape.r) * size / 100));
  const maxY = Math.min(size - 1, Math.ceil((shape.cy + shape.r) * size / 100));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const worldX = ((x + 0.5) / size) * 100;
      const worldY = ((y + 0.5) / size) * 100;

      if (Math.hypot(worldX - shape.cx, worldY - shape.cy) <= shape.r) {
        writePixel(buffer, (y * size + x) * 4, color);
      }
    }
  }
}

function fillRect(buffer: Uint8ClampedArray, size: number, shape: Extract<ShapeSpec, { kind: 'rect' }>): void {
  const color = parseColor(shape.fill);
  const minX = Math.max(0, Math.floor(shape.x * size / 100));
  const maxX = Math.min(size - 1, Math.ceil((shape.x + shape.width) * size / 100));
  const minY = Math.max(0, Math.floor(shape.y * size / 100));
  const maxY = Math.min(size - 1, Math.ceil((shape.y + shape.height) * size / 100));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const worldX = ((x + 0.5) / size) * 100;
      const worldY = ((y + 0.5) / size) * 100;

      if (worldX >= shape.x && worldX <= shape.x + shape.width && worldY >= shape.y && worldY <= shape.y + shape.height) {
        writePixel(buffer, (y * size + x) * 4, color);
      }
    }
  }
}

function fillPolygon(buffer: Uint8ClampedArray, size: number, shape: Extract<ShapeSpec, { kind: 'polygon' }>): void {
  const color = parseColor(shape.fill);
  const minX = Math.max(0, Math.floor(Math.min(...shape.points.map((point) => point.x)) * size / 100));
  const maxX = Math.min(size - 1, Math.ceil(Math.max(...shape.points.map((point) => point.x)) * size / 100));
  const minY = Math.max(0, Math.floor(Math.min(...shape.points.map((point) => point.y)) * size / 100));
  const maxY = Math.min(size - 1, Math.ceil(Math.max(...shape.points.map((point) => point.y)) * size / 100));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const worldPoint = {
        x: ((x + 0.5) / size) * 100,
        y: ((y + 0.5) / size) * 100,
      };

      if (isPointInsidePolygon(worldPoint, shape.points)) {
        writePixel(buffer, (y * size + x) * 4, color);
      }
    }
  }
}

export function rasterizeReference(reference: ReferenceModel, size = SCORE_SAMPLE_SIZE): Uint8ClampedArray {
  const buffer = new Uint8ClampedArray(size * size * 4);
  const backgroundColor = parseColor(reference.background);

  for (let index = 0; index < buffer.length; index += 4) {
    writePixel(buffer, index, backgroundColor);
  }

  for (const shape of reference.shapes) {
    if (shape.kind === 'circle') {
      fillCircle(buffer, size, shape);
    } else if (shape.kind === 'rect') {
      fillRect(buffer, size, shape);
    } else if (shape.kind === 'polygon') {
      fillPolygon(buffer, size, shape);
    }
  }

  return buffer;
}