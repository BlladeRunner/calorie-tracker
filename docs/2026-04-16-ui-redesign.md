# 2026-04-16 — Professional UI Redesign

## What was improved

Three rounds of review and improvement transformed the app from a tutorial-quality prototype into a polished product.

### Round 1 — Structure & Features

**Meal categories.** Added `meal` field (breakfast/lunch/dinner/snack) to `LogEntry`. Auto-selects based on time of day. Food log entries are now grouped by meal with per-group calorie subtotals.

**Daily calorie goal.** 2000 kcal default with a color-coded progress bar: green under 75%, amber at 75-100%, red when over. Shows remaining or over-budget calories.

**Macro breakdown.** Protein, carbs, and fat each get a visual progress bar with targets (150g P, 250g C, 65g F). Color-coded: blue/amber/rose.

**Header.** Branded "NutriTrack" header with date, replacing the plain "Calorie Tracker" h1.

### Round 2 — Visual Polish

**Color palette.** Shifted from gray/orange to slate/emerald — more professional, less tutorial. Emerald as the primary action color, slate for neutrals, color-coded macros (blue protein, amber carbs, rose fat).

**Typography.** Tighter tracking on headings, tabular-nums for calorie values, uppercase tracking for section labels. Smaller, denser text hierarchy.

**Spacing and layout.** Max-width reduced from 2xl to lg for a more focused mobile-first layout. Consistent rounded-2xl for major cards, rounded-xl for inner elements. Tighter gaps between elements.

**Cards.** All sections now use white cards with consistent `border-slate-200/60` and `shadow-sm`. Food log entries grouped inside a single card per meal with dividers instead of individual floating cards.

### Round 3 — Details & Micro-interactions

**Loading skeleton.** Replaced the plain "Loading..." text with a pulsing skeleton that mirrors the actual page layout (summary card, add-food section, log entries).

**Empty state.** Added an icon-based empty state with a plus icon and helpful guidance text instead of plain gray text.

**Delete button.** Fades in on hover (desktop) to reduce visual noise. Always visible on mobile for touch targets.

**AI results.** Circular add/checkmark buttons instead of text buttons. Results appear in a shared card with dividers. "Add all" link for multi-item results.

**Enter to submit.** Text AI lookup now supports Enter to analyze.

**Search icon.** Search input has a magnifying glass icon prefix for immediate clarity.

**Quick-add pills.** Smaller, denser pills with emerald hover instead of orange. Better for the 30-item grid.

## Decisions and rationale

### Emerald over orange

Orange felt like a tutorial accent. Emerald is more neutral and professional, signals "health/wellness" without being clinical, and pairs well with the red/amber calorie warning states.

### Max-width lg instead of 2xl

The app is a single-column tool. 2xl (672px) left too much whitespace on desktop and made the layout feel empty. lg (512px) gives a tighter, more app-like feel similar to mobile health apps.

### Meal auto-selection

Rather than making users pick a meal every time, the app guesses based on time of day (breakfast before 11am, lunch 11-3, dinner 3-8, snack after 8). The selector is always visible so they can override.

### Skeleton loading

A skeleton that matches the page layout makes the loading state feel instant. The previous "Loading..." text created a layout shift when data arrived.

## Files changed

| File | Change |
|------|--------|
| `src/lib/types.ts` | Added `Meal` type and `MEALS` constant with icons |
| `src/db/store.ts` | Added `meal` field to `LogEntry`, updated `addLogEntry` |
| `src/app/api/log/route.ts` | Accepts `meal` parameter |
| `src/app/api/ai/log/route.ts` | Accepts `meal` parameter |
| `src/app/globals.css` | Added scrollbar-hide utility, antialiasing |
| `src/app/layout.tsx` | Updated title to "NutriTrack", slate background |
| `src/app/page.tsx` | Full redesign: header, meal selector, skeleton loading |
| `src/components/DailySummary.tsx` | Calorie goal bar + macro progress bars |
| `src/components/FoodSearch.tsx` | Search icon, emerald palette, density pass |
| `src/components/AIFoodLookup.tsx` | Icon tabs, enter-to-submit, circular add buttons |
| `src/components/FoodLog.tsx` | Meal grouping, card-style entries, hover delete |
