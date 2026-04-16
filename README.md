# NutriTrack — Daily Calorie Tracker

A single-page calorie tracking web app with AI-powered food recognition. No accounts, no login — search for foods, describe what you ate, or snap a photo of your meal.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash_Lite-4285F4?logo=google)

## Features

- **Quick-add** from 30 common foods
- **AI text lookup** — describe what you ate and get instant nutrition info
- **AI photo recognition** — snap a picture of your meal
- **Meal categories** — Breakfast, Lunch, Dinner, Snack (auto-selected by time of day)
- **Daily calorie goal** — 2000 kcal with color-coded progress bar (green/amber/red)
- **Macro tracking** — protein, carbs, and fat with visual progress bars
- **Persistent storage** — data saved to a local JSON file, survives refreshes and restarts

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Google Gemini API key](https://ai.google.dev/)

### Installation

```bash
git clone https://github.com/your-username/calorie-tracker.git
cd calorie-tracker
npm install
```

### Configuration

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Framework | Next.js 14 (App Router)                |
| Language  | TypeScript                             |
| Styling   | Tailwind CSS (slate + emerald palette) |
| Storage   | JSON file (`data/food-log.json`)       |
| AI        | Google Gemini 2.5 Flash Lite           |
| Runtime   | Node.js                                |

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

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/api/foods?q=`  | Search foods by name            |
| GET    | `/api/log?date=` | Get log entries for a date      |
| POST   | `/api/log`       | Add food to log (with meal)     |
| DELETE | `/api/log?id=`   | Remove a log entry              |
| POST   | `/api/ai/text`   | AI nutrition lookup from text   |
| POST   | `/api/ai/image`  | AI nutrition lookup from photo  |
| POST   | `/api/ai/log`    | Save AI food + create log entry |

## Scripts

| Command         | Description                  |
|-----------------|------------------------------|
| `npm run dev`   | Start dev server on port 3000 |
| `npm run build` | Production build             |
| `npm run start` | Run production build         |
| `npm run lint`  | Run ESLint                   |

## License

This project is for personal use.

🔙 [Back to Portfolio](https://github.com/BlladeRunner)