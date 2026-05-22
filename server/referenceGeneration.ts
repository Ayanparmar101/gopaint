import { type RoundDefinition } from '../shared/game';
import { buildEasyImagePrompt, generateSessionRounds } from '../shared/reference';
import { generateOpenRouterImage } from './openrouter';
import { referenceToDataUrl } from './referenceImage';

function withReferenceImage(round: RoundDefinition, imageDataUrl: string, generationSource: 'openrouter' | 'fallback'): RoundDefinition {
  return {
    ...round,
    reference: {
      ...round.reference,
      imageDataUrl,
      generationModel: generationSource === 'openrouter' ? 'x-ai/grok-imagine-image-quality' : 'local-fallback',
      generationSource,
    },
  };
}

export async function prepareSessionRounds(seed: number): Promise<RoundDefinition[]> {
  const baseRounds = generateSessionRounds(seed);

  return Promise.all(baseRounds.map(async (round) => {
    const prompt = buildEasyImagePrompt(round);
    const generatedImage = await generateOpenRouterImage(prompt, {
      model: 'x-ai/grok-imagine-image-quality',
      aspectRatio: '1:1',
      imageSize: '1K',
      timeoutMs: 30_000,
    });

    if (generatedImage) {
      return withReferenceImage(round, generatedImage, 'openrouter');
    }

    console.warn(`[reference] Falling back to local rasterizer for "${round.reference.title}"`);
    return withReferenceImage(round, referenceToDataUrl(round.reference), 'fallback');
  }));
}
