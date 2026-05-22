const OPENROUTER_IMAGE_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const PRIMARY_MODEL = 'google/gemini-2.5-flash-image';

const FALLBACK_MODELS = [
  'x-ai/grok-imagine-image-quality',
] as const;

type OpenRouterImageOptions = {
  model?: string;
  aspectRatio?: string;
  imageSize?: string;
  timeoutMs?: number;
};

type OpenRouterImageResponse = {
  choices?: Array<{
    message?: {
      images?: Array<{
        image_url?: { url?: string };
        imageUrl?: { url?: string };
      }>;
    };
  }>;
  error?: { message?: string };
};

function extractImageUrl(response: OpenRouterImageResponse): string | null {
  const imageUrl = response.choices?.[0]?.message?.images?.[0]?.image_url?.url
    ?? response.choices?.[0]?.message?.images?.[0]?.imageUrl?.url;

  if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }

  return null;
}

async function tryGenerateImage(
  prompt: string,
  model: string,
  options: OpenRouterImageOptions,
  apiKey: string,
): Promise<string | null> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 30_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isTextAndImage = model.includes('gemini');

    const response = await fetch(OPENROUTER_IMAGE_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER?.trim() || 'http://localhost:5173',
        'X-OpenRouter-Title': process.env.OPENROUTER_APP_TITLE?.trim() || 'GoPaint',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        modalities: isTextAndImage ? ['image', 'text'] : ['image'],
        ...(isTextAndImage ? {} : {
          image_config: {
            aspect_ratio: options.aspectRatio || '1:1',
            image_size: options.imageSize || '1K',
          },
        }),
        stream: false,
      }),
    });

    const body = (await response.json()) as OpenRouterImageResponse;

    if (!response.ok) {
      const errorMsg = body?.error?.message ?? `HTTP ${response.status}`;
      console.error(`[openrouter] ${model} failed: ${errorMsg}`);
      return null;
    }

    const imageUrl = extractImageUrl(body);
    if (!imageUrl) {
      console.error(`[openrouter] ${model} returned no image in response`);
      return null;
    }

    console.log(`[openrouter] ${model} generated image successfully`);
    return imageUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[openrouter] ${model} threw: ${message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateOpenRouterImage(prompt: string, options: OpenRouterImageOptions = {}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[openrouter] No OPENROUTER_API_KEY set — skipping image generation');
    return null;
  }

  const modelsToTry = [
    options.model || PRIMARY_MODEL,
    ...FALLBACK_MODELS,
  ];

  for (const model of modelsToTry) {
    const result = await tryGenerateImage(prompt, model, options, apiKey);
    if (result) {
      return result;
    }
    console.warn(`[openrouter] ${model} failed, trying next model...`);
  }

  console.error('[openrouter] all models failed — falling back to local rasterizer');
  return null;
}
