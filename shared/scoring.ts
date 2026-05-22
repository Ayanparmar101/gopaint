export const SCORE_SAMPLE_SIZE = 96;

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function describeScore(score: number): string {
  if (score >= 90) {
    return 'Tiny masterpiece';
  }

  if (score >= 75) {
    return 'Super close';
  }

  if (score >= 55) {
    return 'Good match';
  }

  if (score >= 30) {
    return 'Nice try';
  }

  return 'Keep painting';
}