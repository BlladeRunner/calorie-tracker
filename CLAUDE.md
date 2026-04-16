# NutriTrack — Daily Calorie Tracker

A polished, single-page calorie tracking web app with AI-powered food recognition. No accounts, no login — search for foods, describe what you ate, or snap a photo of your meal.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires `GEMINI_API_KEY` in `.env`.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Framework | Next.js 14 (App Router)                 |
| Language  | TypeScript                              |
| Styling   | Tailwind CSS (slate + emerald palette)  |
| Storage   | JSON file (`data/food-log.json`)        |
| AI        | Google Gemini 2.5 Flash Lite            |
| Runtime   | Node.js                                 |

## How It Works

- **Three ways to add food:** quick-add from 30 common foods, describe food in text (AI), or upload a meal photo (AI)
- **Meal categories:** Breakfast, Lunch, Dinner, Snack — auto-selected by time of day
- **Daily calorie goal:** 2000 kcal with color-coded progress bar (green/amber/red)
- **Macro tracking:** Protein, carbs, and fat with visual progress bars
- AI-identified foods are saved as custom foods (IDs 10001+) in `data/food-log.json`
- Data persists across refreshes and restarts

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page (client component)
│   ├── globals.css               # Tailwind + custom utilities
│   └── api/
│       ├── foods/route.ts        # GET /api/foods?q=search
│       ├── log/route.ts          # GET/POST/DELETE /api/log
│       └── ai/
│           ├── text/route.ts     # POST /api/ai/text
│           ├── image/route.ts    # POST /api/ai/image
│           └── log/route.ts      # POST /api/ai/log
├── components/
│   ├── DailySummary.tsx          # Calorie goal + macro bars
│   ├── FoodSearch.tsx            # Search bar + quick-add grid
│   ├── AIFoodLookup.tsx          # AI text + image food lookup
│   └── FoodLog.tsx               # Meal-grouped food log
├── db/
│   ├── foods.ts                  # Food database (30 items)
│   └── store.ts                  # JSON file read/write + custom foods
└── lib/
    ├── types.ts                  # Shared types (Meal, LogEntryWithFood)
    └── gemini.ts                 # Gemini AI client + response parser
```

## API Endpoints

| Method | Endpoint          | Description                      |
|--------|-------------------|----------------------------------|
| GET    | `/api/foods?q=`   | Search foods by name             |
| GET    | `/api/log?date=`  | Get log entries for a date       |
| POST   | `/api/log`        | Add food to log (with meal)      |
| DELETE | `/api/log?id=`    | Remove a log entry               |
| POST   | `/api/ai/text`    | AI nutrition lookup from text    |
| POST   | `/api/ai/image`   | AI nutrition lookup from photo   |
| POST   | `/api/ai/log`     | Save AI food + create log entry  |

### POST /api/log body

```json
{ "foodId": 1, "servings": 1, "date": "2026-04-16", "meal": "lunch" }
```

### POST /api/ai/text body

```json
{ "description": "grilled chicken with rice and salad" }
```

### POST /api/ai/image body

Multipart form data with field `image` (JPEG, PNG, WebP, or HEIC, max 5MB).

### POST /api/ai/log body

```json
{ "food": { "name": "Grilled Chicken", "calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "servingSize": "100g" }, "servings": 1, "date": "2026-04-16", "meal": "dinner" }
```

## Development

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build
- `npm run start` — Run production build

## Next Steps

- Deploy to Vercel (add `GEMINI_API_KEY` to environment variables)
- Food history charts (weekly/monthly calorie trends)
- User preferences (custom calorie goal, dark mode)
- Barcode scanning for packaged foods
- Adjustable serving sizes per log entry
- Export log data to CSV
