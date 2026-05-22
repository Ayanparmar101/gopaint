import { GAME_ROUND_COUNT, GAME_ROUND_MS, type Point, type ReferenceModel, type RoundDefinition, type ShapeSpec } from './game';

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function polygon(points: Point[], fill: string): ShapeSpec {
  return { kind: 'polygon', points, fill };
}

function circle(cx: number, cy: number, r: number, fill: string): ShapeSpec {
  return { kind: 'circle', cx, cy, r, fill };
}

function rect(x: number, y: number, width: number, height: number, fill: string): ShapeSpec {
  return { kind: 'rect', x, y, width, height, fill };
}

function starPoints(cx: number, cy: number, outerRadius: number, innerRadius: number, points: number): Point[] {
  const result: Point[] = [];
  const step = Math.PI / points;
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + index * step;
    result.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }
  return result;
}

function makeRocketTheme(rng: Rng): ReferenceModel {
  const bodyColor = pick(rng, ['#ff6b6b', '#f97316', '#ef4444']);
  const accent = pick(rng, ['#38bdf8', '#22c55e', '#facc15']);
  const starColor = pick(rng, ['#f8fafc', '#fde68a', '#c4b5fd']);
  const flameColor = pick(rng, ['#fb7185', '#f59e0b', '#f97316']);

  return {
    title: 'Rocket',
    prompt: 'A simple rocket: a tall rectangle body with a triangle on top and a triangle flame below',
    instructions: 'Draw one tall rectangle, a small triangle on top, and a small triangle below. Use the palette colors.',
    background: '#f8f9ff',
    accent,
    palette: [bodyColor, accent, starColor, flameColor],
    shapes: [
      circle(18, 20, 7, '#f8fafc'),
      circle(72, 20, 3.5, starColor),
      circle(80, 36, 2.8, starColor),
      circle(28, 74, 2.8, starColor),
      polygon(starPoints(14, 63, 5, 2.2, 5), starColor),
      rect(39, 26, 22, 30, bodyColor),
      polygon(
        [
          { x: 50, y: 14 },
          { x: 40, y: 26 },
          { x: 60, y: 26 },
        ],
        accent,
      ),
      polygon(
        [
          { x: 39, y: 34 },
          { x: 30, y: 44 },
          { x: 39, y: 46 },
        ],
        accent,
      ),
      polygon(
        [
          { x: 61, y: 34 },
          { x: 61, y: 46 },
          { x: 70, y: 44 },
        ],
        accent,
      ),
      circle(50, 37, 4.3, '#93c5fd'),
      polygon(
        [
          { x: 41, y: 56 },
          { x: 50, y: 72 },
          { x: 59, y: 56 },
        ],
        flameColor,
      ),
      polygon(
        [
          { x: 44, y: 56 },
          { x: 50, y: 82 },
          { x: 56, y: 56 },
        ],
        '#fca5a5',
      ),
    ],
  };
}

function makeFishTheme(rng: Rng): ReferenceModel {
  const bodyColor = pick(rng, ['#38bdf8', '#22c55e', '#fb7185']);
  const finColor = pick(rng, ['#f97316', '#facc15', '#8b5cf6']);
  const bubbleColor = pick(rng, ['#e0f2fe', '#f8fafc', '#cffafe']);
  const tailShift = Math.round((rng() - 0.5) * 5);

  return {
    title: 'Fish',
    prompt: 'A simple fish: one big oval body with a triangle tail and one small circle eye',
    instructions: 'Draw one big oval, a triangle tail on the right, and a small circle for an eye.',
    background: '#eff4ff',
    accent: finColor,
    palette: [bodyColor, finColor, bubbleColor],
    shapes: [
      circle(27, 44, 18, bodyColor),
      polygon(
        [
          { x: 43, y: 44 },
          { x: 61, y: 30 + tailShift },
          { x: 61, y: 58 - tailShift },
        ],
        finColor,
      ),
      polygon(
        [
          { x: 24, y: 31 },
          { x: 33, y: 20 },
          { x: 36, y: 34 },
        ],
        finColor,
      ),
      polygon(
        [
          { x: 24, y: 57 },
          { x: 33, y: 68 },
          { x: 36, y: 54 },
        ],
        finColor,
      ),
      circle(20, 38, 2.6, '#f8fafc'),
      circle(60, 20, 3.3, bubbleColor),
      circle(69, 29, 2.2, bubbleColor),
      circle(78, 41, 1.9, bubbleColor),
      polygon(
        [
          { x: 16, y: 42 },
          { x: 24, y: 39 },
          { x: 24, y: 45 },
        ],
        '#f8fafc',
      ),
      rect(20, 45, 8, 1.8, '#f8fafc'),
      rect(18, 50, 4, 1.8, '#f8fafc'),
      circle(55, 44, 1.4, '#1e293b'),
    ],
  };
}

function makeHouseTheme(rng: Rng): ReferenceModel {
  const wall = pick(rng, ['#f59e0b', '#fb7185', '#f97316']);
  const roof = pick(rng, ['#8b5cf6', '#ef4444', '#14b8a6']);
  const trim = pick(rng, ['#fff7ed', '#f8fafc', '#ecfeff']);
  const tree = pick(rng, ['#16a34a', '#22c55e', '#15803d']);

  return {
    title: 'House',
    prompt: 'A simple house: a square for the house with a triangle roof on top',
    instructions: 'Draw one square with a triangle roof above it. No windows, no tree.',
    background: '#f8f9ff',
    accent: roof,
    palette: [wall, roof, trim, tree],
    shapes: [
      circle(18, 18, 8, '#fde68a'),
      rect(36, 38, 28, 26, wall),
      polygon(
        [
          { x: 32, y: 38 },
          { x: 50, y: 22 },
          { x: 68, y: 38 },
        ],
        roof,
      ),
      rect(46, 50, 7, 14, trim),
      rect(40, 44, 7, 7, trim),
      rect(53, 44, 7, 7, trim),
      rect(74, 48, 4, 16, '#92400e'),
      circle(82, 38, 8, tree),
      circle(90, 46, 6, tree),
      circle(71, 44, 5.5, tree),
    ],
  };
}

function makeRobotTheme(rng: Rng): ReferenceModel {
  const metal = pick(rng, ['#94a3b8', '#cbd5e1', '#a8b5c7']);
  const accent = pick(rng, ['#22d3ee', '#f97316', '#a855f7']);
  const eye = pick(rng, ['#0f172a', '#1e293b']);

  return {
    title: 'Robot',
    prompt: 'A simple robot: a square head on top of a rectangle body with two circle eyes',
    instructions: 'Draw one square head, a rectangle body below it, and two small circle eyes inside the head.',
    background: '#eff4ff',
    accent,
    palette: [metal, accent, eye],
    shapes: [
      rect(36, 18, 28, 22, accent),
      circle(50, 16, 3.5, accent),
      rect(32, 40, 36, 26, metal),
      rect(26, 44, 8, 8, metal),
      rect(66, 44, 8, 8, metal),
      rect(42, 66, 6, 11, metal),
      rect(52, 66, 6, 11, metal),
      circle(44, 29, 3.6, eye),
      circle(56, 29, 3.6, eye),
      rect(42, 56, 16, 2.4, eye),
      circle(50, 49, 4.8, '#38bdf8'),
    ],
  };
}

function makeCupcakeTheme(rng: Rng): ReferenceModel {
  const frosting = pick(rng, ['#fb7185', '#a78bfa', '#f472b6']);
  const cup = pick(rng, ['#f59e0b', '#f97316', '#ef4444']);
  const sprinkle = pick(rng, ['#f8fafc', '#fde68a', '#22d3ee']);

  const sprinkleShapes: ShapeSpec[] = Array.from({ length: 6 }, (_, index) => {
    return rect(34 + index * 5.5, 20 + (index % 2) * 4, 2.2, 2.2, sprinkle);
  });

  return {
    title: 'Cupcake',
    prompt: 'A simple cupcake: a triangle cup shape with a big circle frosting blob on top',
    instructions: 'Draw a triangle shape pointing down for the cup, and a big circle on top for the frosting.',
    background: '#fff7fb',
    accent: frosting,
    palette: [frosting, cup, sprinkle],
    shapes: [
      circle(48, 22, 8, frosting),
      circle(57, 22, 7, frosting),
      circle(40, 23, 6.5, frosting),
      polygon(
        [
          { x: 36, y: 30 },
          { x: 64, y: 30 },
          { x: 60, y: 63 },
          { x: 40, y: 63 },
        ],
        cup,
      ),
      ...sprinkleShapes,
      circle(50, 14, 3.2, '#fef3c7'),
    ],
  };
}

function makeCactusTheme(rng: Rng): ReferenceModel {
  const cactus = pick(rng, ['#22c55e', '#16a34a', '#4ade80']);
  const pot = pick(rng, ['#fb7185', '#f97316', '#ea580c']);
  const flower = pick(rng, ['#f472b6', '#fde68a', '#a78bfa']);

  return {
    title: 'Cactus',
    prompt: 'A simple cactus: one tall rectangle with two small rectangle arms and a trapezoid pot below',
    instructions: 'Draw a tall rectangle for the cactus body, two small rectangles for arms, and a trapezoid pot at the bottom.',
    background: '#f8f9ff',
    accent: cactus,
    palette: [cactus, pot, flower],
    shapes: [
      polygon(
        [
          { x: 42, y: 30 },
          { x: 58, y: 30 },
          { x: 58, y: 66 },
          { x: 42, y: 66 },
        ],
        cactus,
      ),
      polygon(
        [
          { x: 42, y: 40 },
          { x: 32, y: 40 },
          { x: 32, y: 54 },
          { x: 42, y: 54 },
        ],
        cactus,
      ),
      polygon(
        [
          { x: 58, y: 46 },
          { x: 68, y: 46 },
          { x: 68, y: 58 },
          { x: 58, y: 58 },
        ],
        cactus,
      ),
      polygon(
        [
          { x: 36, y: 66 },
          { x: 64, y: 66 },
          { x: 60, y: 78 },
          { x: 40, y: 78 },
        ],
        pot,
      ),
      circle(50, 24, 4.5, flower),
      circle(57, 22, 2.6, flower),
      circle(43, 22, 2.6, flower),
    ],
  };
}

function makeMoonTheme(rng: Rng): ReferenceModel {
  const moon = pick(rng, ['#fde68a', '#f8fafc', '#fef08a']);
  const cloud = pick(rng, ['#93c5fd', '#cbd5e1', '#e0f2fe']);
  const star = pick(rng, ['#f8fafc', '#fef3c7', '#fca5a5']);

  return {
    title: 'Moon',
    prompt: 'A simple crescent moon: one large circle overlapping a slightly smaller circle to make a crescent shape',
    instructions: 'Draw a big circle for the moon. That is all. No stars, no clouds.',
    background: '#eff4ff',
    accent: moon,
    palette: [moon, cloud, star],
    shapes: [
      circle(56, 34, 14, moon),
      circle(62, 30, 12, '#091b3b'),
      circle(22, 22, 5, cloud),
      circle(28, 24, 7, cloud),
      circle(36, 22, 6, cloud),
      circle(71, 58, 6, cloud),
      circle(77, 60, 8, cloud),
      circle(84, 58, 5.5, cloud),
      polygon(starPoints(14, 56, 4.2, 1.8, 5), star),
      polygon(starPoints(26, 74, 3.7, 1.5, 5), star),
      polygon(starPoints(83, 24, 4, 1.6, 5), star),
    ],
  };
}

const THEMES = [makeRocketTheme, makeFishTheme, makeHouseTheme, makeRobotTheme, makeCupcakeTheme, makeCactusTheme, makeMoonTheme] as const;

export function generateRoundDefinition(seed: number, index: number): RoundDefinition {
  const rng = mulberry32(seed);
  const themeFactory = pick(rng, THEMES);
  const theme = themeFactory(rng);

  return {
    id: `round-${index + 1}-${seed}`,
    index: index + 1,
    seed,
    prompt: theme.prompt,
    timeLimitMs: GAME_ROUND_MS,
    reference: theme,
  };
}

export function generateSessionRounds(roomSeed: number): RoundDefinition[] {
  return Array.from({ length: GAME_ROUND_COUNT }, (_, index) => generateRoundDefinition(roomSeed + index * 97, index));
}

export function buildEasyImagePrompt(round: RoundDefinition): string {
  const colors = round.reference.palette.join(', ');

  return [
    'Generate an extremely simple children\'s coloring-page style image that a 5 year old can copy by hand in 90 seconds.',
    'The image MUST contain ONLY 2-3 large basic shapes (circles, rectangles, triangles) with NO small details, NO tiny stars, NO tiny decorations, NO gradients, NO textures.',
    'Each shape must be at least 15% of the canvas size — big and bold.',
    'Style: thick black outlines (3-4px), completely flat solid fill colors, solid white background, no shading, no gradient, no text, no watermark.',
    'Composition: one large centered main shape covering at least 40% of the canvas, with at most ONE smaller supporting shape beside or below it.',
    'Do NOT add any extra decorative elements. Keep it minimal — the fewer shapes the better.',
    `Subject: ${round.prompt}`,
    `Use ONLY these colors (no other colors): ${colors}. The background must be pure white.`,
    'CRITICAL: This image will be shown to a young child who needs to reproduce it by painting on a blank canvas. Every shape must be large and simple enough to paint with a thick brush.',
    `Reference hint: ${round.reference.instructions}`,
  ].join(' ');
}