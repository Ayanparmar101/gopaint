# GoPaint

Browser-based multiplayer painting game for kids.

## What it does

- One host creates a private room with a short join code.
- Players copy the same generated reference painting on their own canvas.
- The server scores each submission out of 100 using image similarity against the generated target.
- Scores accumulate across three rounds to pick a winner.

## AI References

Set `OPENROUTER_API_KEY` in your environment to enable generated reference paintings. The server uses the OpenRouter image model `x-ai/grok-imagine-image-quality` to create simple kid-friendly pictures before each match starts.

If the key is missing or the request fails, the game falls back to a local deterministic drawing so the room still works.

## Local run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open the web app on the Vite port shown in the terminal, then create a room in one tab and join it from another tab.

## Scripts

- `npm run dev` starts the web client and realtime server together.
- `npm run dev:web` starts only the Vite client.
- `npm run dev:server` starts only the Socket.IO server.
- `npm run check` runs TypeScript without emitting files.

## Notes

- The scoring system compares the drawn canvas to the actual reference image with foreground overlap, composition, color, and edge similarity.
- The room state is in memory, so restarting the server clears active matches.
