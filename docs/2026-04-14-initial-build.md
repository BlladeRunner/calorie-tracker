
# Decision Log: Initial Build — 2026-04-14

## What Was Built

A single-page calorie tracker web app with:
- Search bar to find foods from a built-in database of 30 common foods
- Quick-add button grid for one-tap food logging
- Daily food log showing entries with macro breakdowns
- Summary banner with total calories, protein, carbs, and fat
- Persistent storage via JSON file on the server

## Technical Choices

### Next.js 14 with App Router
**Why:** Provides both the React frontend and API routes in one project. The App Router is the current standard for new Next.js projects. Server-side API routes let us do file I/O for storage without needing a separate backend.

### TypeScript
**Why:** Type safety across the full stack — the same `Food` and `LogEntry` types are shared between API routes and UI components. Catches bugs at compile time.

### Tailwind CSS
**Why:** Utility-first CSS means rapid UI development without writing custom stylesheets. Works out of the box with Next.js. Responsive design with minimal effort.

### JSON File Storage (instead of SQLite)
**Why:** The original plan was SQLite via `better-sqlite3`, but this requires native C++ compilation (node-gyp + Visual Studio Build Tools), which was not available on the build machine. A JSON file store:
- Zero native dependencies
- Trivially simple read/write
- Easily inspectable (just open the file)
- More than sufficient for a single-user local app
- **Trade-off:** No concurrent write safety, no query language. Acceptable for this use case.

### Static Food Database (TypeScript array)
**Why:** 30 common foods are defined directly in code rather than a separate database. This means:
- No seed script or migration step needed
- Type-safe food data with IDE autocomplete
- Easy to add more foods by editing one file
- **Trade-off:** Adding foods requires a code change. Future work will add custom food entry via the UI.

### Client-Side Page (`"use client"`)
**Why:** The main page needs interactivity (search, add, delete, live updates). Making it a client component with `useEffect`/`useState` keeps the code simple — one component tree that fetches from API routes and re-renders on changes.

## What's Not Included (and Why)

| Feature | Reason for exclusion |
|---------|---------------------|
| User auth/accounts | Explicit requirement: single-user, no login |
| Date picker | MVP scope — shows today only |
| Custom food entry | Planned for next iteration |
| Adjustable servings | Planned for next iteration |
| Calorie goals | Planned for next iteration |
| Gemini API integration | `.env` has the key ready; planned for photo-based food recognition |

## Architecture Notes

- **Data flow:** UI components → `fetch()` → Next.js API routes → JSON file store
- **State management:** React `useState` + re-fetch pattern. No external state library needed at this scale.
- **Food data:** Imported directly in API routes from `src/db/foods.ts`. No database lookup required.
- **File structure:** Follows Next.js App Router conventions. Components are separated by responsibility (summary, search, log).
