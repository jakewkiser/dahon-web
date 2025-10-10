# Dahon-web

A modern, luminous plant-care assistant (React + TS + Vite + Tailwind) with Firebase Auth/Firestore and AI Search (Algolia with Fuse.js fallback).

## Quick Start
```bash
cd client
npm install
# create .env.local with Firebase and (optional) Algolia keys
npm run dev
```

### Environment
Create `client/.env.local`:
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Optional Algolia
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_API_KEY=
VITE_ALGOLIA_INDEX=plants
```

## Routes
- `/signin` — Email/Password or Google
- `/dashboard` — Plant list
- `/ai` — AI search (Algolia/Fuse)
- `/add` — Add a plant
- `/plant/:id` — Details
- `/settings` — Theme + sign out