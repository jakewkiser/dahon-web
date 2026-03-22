# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `client/` directory:

```bash
npm run dev       # Start dev server on port 5173
npm run build     # Type-check + Vite production build
npm run preview   # Preview production build
npm run test      # Run tests with coverage (Vitest)
```

To run a single test file:
```bash
npx vitest run src/__tests__/basic.test.tsx
```

## Architecture Overview

**Stack**: React 18 + TypeScript + Vite, Firebase (Auth/Firestore/Storage), Tailwind CSS, Framer Motion, React Router v6.

**App**: Dahon is a plant-care assistant. Users add plants, log care events (water/fertilize/sunlight), and get next-care reminders. An AI search interface helps find plants from a local database of 100+ curated species.

### Directory Structure (`client/src/`)

| Path | Purpose |
|---|---|
| `lib/firebase.ts` | All Firestore operations + `Plant`/`CareLog` types |
| `lib/auth.tsx` | `AuthProvider` context — `user`, `signInEmail()`, `signInGoogle()`, `signOut()` |
| `lib/theme.tsx` | `ThemeProvider` context — light/dark, persisted to localStorage |
| `lib/schedule.ts` | `computeNextCareFromLogs()` — next watering/fertilizing due date logic |
| `lib/search.ts` | `localSearch()` — fuzzy search over local plant JSON, no API call |
| `lib/useIdleSignOut.ts` | Auto sign-out after 3 min idle with 60s warning |
| `routing/router.tsx` | Route definitions + `Guard` component (redirects to `/signin` if unauth) |
| `data/plants_local.json` | 100+ curated plants with care guides and image refs |
| `components/ui/` | Reusable dumb components (Button, Input, Card, Topbar) |
| `pages/` | Route-level smart components with data fetching |
| `styles/tokens.css` | CSS custom properties: `--surface`, `--ink`, `--accent`, `--tint-*` |

### State Management

Context API only — no Redux/Zustand. Two global contexts: `AuthProvider` (Firebase auth state) and `ThemeProvider` (light/dark). Pages use local `useState` for forms and async state.

### Data Layer

`lib/firebase.ts` exposes typed functions for all Firestore operations:
- Plants: `listPlants(userId)`, `addPlant()`, `updatePlant()`, `deletePlant()`
- Care logs (subcollection): `addCareLog(plantId, log)`, `listCareLogs(plantId, limit?)`
- Photos: `uploadFileAndGetURL(file, path)` — conditional on `HAS_STORAGE` flag

Firestore timestamps are converted to milliseconds by `mapPlant()`.

### Theming & Styling

Design uses glass-morphism (backdrop blur + semi-transparent borders). Colors are CSS variables defined in `tokens.css`, consumed by Tailwind via `tailwind.config.ts`. Dark mode is class-based (`document.documentElement.classList`).

### Care Schedule Logic

`computeNextCareFromLogs(plant, logs)` calculates next watering (default: every 7 days) and fertilizing (default: every 30 days) due dates, returning labels like "overdue by X days", "today", "in X days". Dashboard uses these labels to determine badge colors (red=overdue, yellow=today, teal=upcoming).

### Plant Guide Linking

User plants store `guideRefId`/`guideRefName`/`guideRefSpecies` to reference canonical entries in `plants_local.json`. `localSearch()` scores matches by: starts-with (3pts) > includes (1pt), then sorts by name length.

## Environment Variables

Configured in `client/.env.local`:
```
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
VITE_ALGOLIA_APP_ID, VITE_ALGOLIA_API_KEY, VITE_ALGOLIA_INDEX  # optional
VITE_FEEDBACK_URL, VITE_APP_VERSION, VITE_RELEASE_DATE           # optional
```

## Deployment

Deployed to Vercel (`vercel.json` present). Firebase security rules in `firestore.rules` and `storage.rules` at repo root.
