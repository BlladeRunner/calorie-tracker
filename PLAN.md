# NutriTrack — Project Plan

## What We Built

A single-page calorie tracker with three ways to log food:

1. **Quick-add** — 30 common foods in a searchable grid. Click to add instantly.
2. **AI text lookup** — Describe what you ate in plain English. Gemini identifies foods and estimates macros.
3. **AI photo lookup** — Upload a meal photo. Gemini analyzes the image and identifies all visible foods.

Supporting features:
- **Meal categories** — Breakfast, Lunch, Dinner, Snack. Auto-selected by time of day, grouped in the food log.
- **Daily calorie goal** — 2000 kcal target with a color-coded progress bar (green/amber/red).
- **Macro breakdown** — Protein, carbs, and fat tracked with visual progress bars.
- **Persistent storage** — JSON file database. Custom foods from AI get auto-assigned IDs (10001+).
- **Loading states** — Skeleton UI while data loads, spinners during AI analysis.

## What We Improved

| Area | Before | After |
|------|--------|-------|
| Color palette | Gray + orange (tutorial look) | Slate + emerald (professional) |
| Layout | max-w-2xl, loose spacing | max-w-lg, tight mobile-first |
| Header | Plain h1 "Calorie Tracker" | Branded "NutriTrack" with date |
| Summary | Four flat stat cards | Calorie progress bar + macro bars |
| Food log | Flat list, no grouping | Grouped by meal with subtotals |
| Add food | Separate sections stacked | Unified card with meal selector |
| Loading | "Loading..." text | Animated skeleton matching layout |
| Empty state | Plain gray text | Icon + guidance message |
| Quick-add | Large pills with orange hover | Dense pills with emerald palette |
| AI lookup | Orange buttons, text labels | Icon tabs, enter-to-submit, + buttons |
| Interactions | Basic | Hover-reveal delete, green flash on add |

## Future Roadmap

### Near-term
- **Deploy to Vercel** — Add `GEMINI_API_KEY` to environment variables, push, done
- **Adjustable serving sizes** — Slider or number input per log entry
- **Custom calorie goal** — Let users set their own daily target
- **Date picker** — View and edit past days' logs

### Medium-term
- **Food history charts** — Weekly/monthly calorie and macro trends using Recharts or Chart.js
- **Dark mode** — Respect system preference, add toggle
- **Export to CSV** — Download log data for spreadsheet analysis
- **User preferences** — Persist settings (goal, theme, default meal) in the JSON store

### Long-term
- **Barcode scanning** — Use device camera + Open Food Facts API for packaged food lookup
- **Multi-user support** — Optional accounts with cloud sync
- **Meal planning** — Suggest meals to hit remaining macro targets
- **Wearable integration** — Sync with Apple Health / Google Fit calorie burn data
