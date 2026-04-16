# 2026-04-16 — AI Food Lookup Frontend

## What was added

A new `AIFoodLookup` component (`src/components/AIFoodLookup.tsx`) that gives users two AI-powered ways to add food, alongside the existing quick-add grid:

- **Text lookup** — Type a description like "grilled chicken with rice and salad", click Analyze, and Gemini returns identified foods with nutrition data.
- **Photo lookup** — Upload or take a photo of a meal. Gemini analyzes the image and identifies all visible foods with estimated macros.

Both modes show results in a list where users can add individual items (or all at once) to the daily log.

## Supporting backend changes

### Custom food storage (`src/db/store.ts`)

AI-identified foods don't exist in the hardcoded `FOODS[]` array, so they need somewhere to live. The JSON store now has:

- `customFoods: Food[]` — persists AI-identified foods with auto-assigned IDs starting at 10001
- `nextCustomFoodId: number` — auto-increment counter
- `addCustomFood(food)` — saves a food and returns it with an assigned ID
- `findFoodById(id)` — looks up from both `FOODS` and `customFoods`

IDs start at 10001 to avoid collisions with the 30 hardcoded foods (IDs 1-30). This is simpler than a UUID-based system and keeps the existing `foodId: number` log format unchanged.

### New endpoint: `POST /api/ai/log` (`src/app/api/ai/log/route.ts`)

Accepts `{ food: AIFood, servings, date }`. Saves the food to `customFoods` and creates a log entry in one call. This avoids the frontend needing two round-trips and keeps custom-food persistence as a backend detail.

### Updated `GET /api/log` and `POST /api/log`

Both now use `findFoodById()` instead of `FOODS.find()`, so log entries that reference custom food IDs (10001+) resolve correctly.

## Decisions and rationale

### Single component with tab switching

Text and image lookup share the same results UI and add-to-log flow, so they're in one component with a tab toggle rather than two separate components. Reduces duplication and keeps the page layout simple.

### Results removed after adding

When a user clicks "+ Add" on a result, it briefly flashes green then disappears from the list. This makes it clear which items have been added and prevents accidental double-adds. An "Add all" link is shown when multiple items are found.

### No deduplication of custom foods

If a user analyzes "chicken breast" via AI multiple times, each generates a separate custom food entry. This is acceptable for a single-user local app — the store stays simple and each entry may have slightly different calorie estimates anyway.

### Image preview before analysis

When a photo is selected, a thumbnail preview is shown so the user can confirm they picked the right image before hitting Analyze. The preview uses `URL.createObjectURL` (no upload until the user clicks Analyze).

## What's NOT included

- No drag-and-drop for image upload (click/tap only)
- No camera capture UI (relies on browser's native file picker, which on mobile offers camera access)
- No rate limiting on AI calls
- No editing of AI-estimated values before adding to log

## How to test

1. `npm run dev` and open http://localhost:3000
2. Quick-add: click any food in the grid — should work as before
3. Text lookup: type "a bowl of pasta with tomato sauce", click Analyze — should show results, click "+ Add" on each
4. Photo lookup: switch to "Upload Photo" tab, upload a meal photo, click "Analyze Photo" — should identify foods
5. Check Today's Log updates and DailySummary totals include AI-added foods
6. Refresh the page — all entries should persist
