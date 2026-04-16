# 2026-04-16 — Gemini AI Nutrition Analysis Routes

## What was added

Two new backend API routes that use Google Gemini 2.5 Flash Lite to analyze food and return structured nutrition data:

- **POST /api/ai/text** — Accepts a text description (e.g. "grilled chicken with rice and salad"), returns identified foods with calories and macros.
- **POST /api/ai/image** — Accepts an uploaded meal photo (JPEG/PNG/WebP/HEIC, max 5MB), returns the same structured nutrition data.

A shared utility at `src/lib/gemini.ts` handles the Gemini client, system prompt, and response parsing for both routes.

## New dependency

- `@google/generative-ai` — Google's official SDK for the Gemini API.

## Decisions and rationale

### Model choice: gemini-2.5-flash-lite

Selected for speed and cost efficiency. Nutrition estimation doesn't need the full reasoning capability of larger models — fast approximate answers are fine since the user can always adjust.

### `responseMimeType: "application/json"`

The Gemini API supports constraining output to valid JSON at the API level. This is far more reliable than asking for JSON in the prompt alone, which can produce markdown-wrapped or conversational responses. The `parseAIResponse` function still handles markdown fences as a safety net.

### `AIFood` type (Food without id)

AI-identified foods don't exist in the hardcoded food database, so they have no `id`. Using `Omit<Food, "id">` keeps the type system honest and makes the boundary clear. The frontend integration (next step) will need to handle this distinction.

### Lazy singleton model instance

The `GenerativeModel` is created once and reused across requests. This avoids re-initializing the SDK on every API call while keeping the module stateless until first use.

### System instruction vs. user prompt

The nutrition analysis prompt is placed in `systemInstruction` (not repeated in each user message). This keeps the per-request payload small and lets Gemini cache the instruction across calls.

### Input validation

- Text: max 500 characters, must be non-empty string.
- Image: MIME type whitelist (jpeg, png, webp, heic), max 5MB file size.
- No rate limiting for now — can be added at the middleware level (`src/middleware.ts` matching `/api/ai/*`) if needed.

## What's NOT included (deferred to frontend integration)

- No frontend UI changes — routes are backend-only, ready to be wired up.
- No mechanism to save AI-identified foods to the daily log yet — that requires frontend work and potentially a way to assign temporary IDs or store custom foods.
- No rate limiting or usage tracking.

## How to test

```bash
# Text analysis
curl -X POST http://localhost:3000/api/ai/text \
  -H "Content-Type: application/json" \
  -d '{"description":"grilled chicken with rice and salad"}'

# Image analysis
curl -X POST http://localhost:3000/api/ai/image \
  -F "image=@photo.jpg"
```

Both return: `{ "foods": [{ "name", "calories", "protein", "carbs", "fat", "servingSize" }, ...] }`
