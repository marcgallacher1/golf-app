# Golf Caddy PWA — Project Brief

## What This Is
A mobile-first golf tracking app with AI caddy advice. Built as a PWA so it can be added to the iPhone home screen via Safari — no App Store required.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS v3
- Supabase (auth + Postgres + Edge Functions)
- Anthropic Claude API (via Supabase Edge Function only — never client-side)
- Deployed to Vercel

## Project Structure
```
golf-caddy/
├── public/
│   ├── manifest.json
│   └── icons/ (192x192, 512x512)
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── FAB.tsx
│   │   │   └── StatCard.tsx
│   │   ├── logging/
│   │   │   ├── ShotLogger.tsx
│   │   │   └── HoleSummary.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── RecentRounds.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   └── HandicapDisplay.tsx
│   │   ├── round/
│   │   │   ├── ActiveRound.tsx
│   │   │   ├── NewRoundForm.tsx
│   │   │   └── RoundSummary.tsx
│   │   └── caddy/
│   │       ├── CaddyAdvice.tsx
│   │       └── PreRoundBriefing.tsx
│   ├── hooks/
│   │   ├── useRound.ts
│   │   ├── useStats.ts
│   │   └── useSupabase.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── handicap.ts
│   │   └── statsCalculator.ts
│   ├── types/
│   │   └── index.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Play.tsx
│   │   ├── History.tsx
│   │   └── Profile.tsx
│   └── App.tsx
├── supabase/
│   └── functions/
│       └── caddy-advice/
│           └── index.ts
└── vite.config.ts
```

## Database Schema (Supabase/Postgres)
Enable Row Level Security on all tables — users can only access their own data.

```sql
create table profiles (
  id uuid references auth.users primary key,
  username text,
  home_course text,
  created_at timestamp default now()
);

create table rounds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  course_name text not null,
  date date not null,
  tees text,
  course_par integer default 72,
  total_score integer,
  completed boolean default false,
  notes text,
  created_at timestamp default now()
);

create table holes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid references rounds(id) on delete cascade,
  hole_number integer not null check (hole_number between 1 and 18),
  par integer not null check (par between 3 and 5),
  score integer,
  putts integer,
  fairway_hit boolean,
  green_in_regulation boolean,
  penalties integer default 0,
  created_at timestamp default now()
);
```

## Core Types
```typescript
// src/types/index.ts

export type Round = {
  id: string
  user_id: string
  course_name: string
  date: string
  tees: string
  course_par: number
  total_score: number | null
  completed: boolean
  notes: string | null
  holes?: Hole[]
}

export type Hole = {
  id: string
  round_id: string
  hole_number: number
  par: number
  score: number | null
  putts: number | null
  fairway_hit: boolean | null
  green_in_regulation: boolean | null
  penalties: number
}

export type PlayerStats = {
  handicapIndex: number
  scoringAverage: number
  fairwayPct: number
  girPct: number
  avgPutts: number
  roundsPlayed: number
  trend: 'improving' | 'declining' | 'stable'
  weakestHoles: string
  bestHoles: string
}
```

## Core Features

### 1. Auth
- Supabase email/password auth
- Sign up, sign in, sign out
- Auth context provider wrapping the whole app
- Redirect unauthenticated users to login

### 2. New Round Flow
- Form: course name, date (default today), tees, course par
- Creates round in Supabase, navigates to Play page

### 3. Active Round — Play Page (most important)
On-course experience. Must be fast and mobile-first. Tinder-swipe level of friction removal.

- Shows current hole (1–18) with par
- **FAB** (Floating Action Button) — large, bottom-right, one-thumb tappable
- Tapping FAB opens a **BottomSheet** sliding up from the bottom
- BottomSheet contains hole logger:
  - Score (+ / - buttons, no keyboard)
  - Putts (+ / - buttons)
  - Fairway hit (Yes / No / N/A for par 3s) — tap buttons
  - Green in regulation (Yes / No) — tap buttons
  - Penalties (+ / - buttons, starts at 0)
  - "Save & Next Hole" button
- After hole 18: "Complete Round" button
- **Target: entire logging interaction under 10 seconds**
- No keyboards unless absolutely necessary

### 4. Dashboard
- Handicap index (World Handicap System)
- Scoring average (last 20 rounds)
- Fairway % across all rounds
- GIR % across all rounds
- Average putts per round
- Last 5 rounds list with scores
- "Start New Round" CTA

### 5. AI Caddy
Two modes — both via Supabase Edge Function (never expose API key client-side):

**Pre-round briefing** — user taps "Get Game Plan" before teeing off. Sends stats → Claude → short tactical briefing (what to focus on, where they lose shots).

**Post-round analysis** — auto-triggered on round completion. Sends full round data + historical stats → Claude → 4–6 sentence analysis (what went well, what cost shots, one thing to work on).

Prompt architecture:
```javascript
const buildCaddyPrompt = (userStats, todayRound, question) => `
You are an experienced golf caddy and coach. 
Here is the player's profile based on their last 20 rounds:

PLAYER STATS:
- Handicap index: ${userStats.handicap}
- Fairways hit: ${userStats.fairwayPct}%
- Greens in regulation: ${userStats.girPct}%  
- Avg putts per round: ${userStats.avgPutts}
- Scoring average: ${userStats.scoringAvg}
- Weakest holes (by avg over par): ${userStats.weakestHoles}
- Recent trend: ${userStats.trend} (improving/declining/stable)

TODAY'S ROUND:
- Course: ${todayRound.course}, Par ${todayRound.par}
- Holes completed: ${todayRound.holesPlayed}
- Current score: ${todayRound.currentScore} (${todayRound.vspar} vs par)
- Notable so far: ${todayRound.notes}

QUESTION: ${question}

Give specific, actionable advice in 3-4 sentences. 
Be direct, like a caddy talking between shots — not a textbook.
`
```

AI trigger points:
- Post-round full analysis (automatic at hole 18 completion)
- Mid-round check-in (tap at the turn, after hole 9)
- Pre-round game plan (before tee off, based on course + weaknesses)
- Weekly trend report (background, shown on dashboard)

### 6. Round History
- List of all completed rounds
- Tap to see hole-by-hole breakdown
- Score shown as total and vs par (e.g. 84 / +12)

## Handicap Calculation
Implement World Handicap System in `src/lib/handicap.ts`:

```typescript
// Score differential = (113 / slope_rating) * (adjusted_gross_score - course_rating)
// Use slope = 113, course_rating = par if not provided

// Handicap index = average of best 8 differentials from last 20 rounds
// Fewer rounds lookup:
// 3 rounds: lowest 1 | 4-6: lowest 2 | 7-8: lowest 3
// 9-11: lowest 4 | 12-14: lowest 5 | 15-16: lowest 6
// 17-18: lowest 7 | 19+: lowest 8

export function calculateHandicapIndex(rounds: Round[]): number
```

## Supabase Edge Function
```typescript
// supabase/functions/caddy-advice/index.ts
// Receives: { stats: PlayerStats, round?: Round, mode: 'pre-round' | 'post-round' }
// Calls Anthropic API with structured prompt
// Returns: { advice: string }
// ANTHROPIC_API_KEY stored as Supabase secret — never in client code
```

## PWA Config
```json
// public/manifest.json
{
  "name": "Golf Caddy",
  "short_name": "Caddy",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#16a34a",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
Register a service worker in `main.tsx` for basic offline caching.

## Design Guidelines
- **Mobile-first** — design for 390px width (iPhone 14)
- **Dark theme** — background `#0f172a` (slate-900), cards `#1e293b` (slate-800)
- **Green accent** — `#16a34a` (green-600) for CTAs and active states
- Bottom navigation bar: 4 tabs — Home, Play, History, Profile
- FAB minimum 56px — tappable without looking
- No horizontal scrolling anywhere
- BottomSheet animates up smoothly via CSS transition (no library)
- All tap targets minimum 44px height (Apple HIG)

## Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Supabase Edge Function secret (set via Supabase dashboard):
```
ANTHROPIC_API_KEY=
```

## Build Order
1. Scaffold Vite + React + TypeScript + Tailwind
2. Supabase client + auth
3. Database tables with RLS policies
4. Auth pages (login, signup)
5. **Play page + hole logging flow — core, get this right first**
6. Dashboard with stats calculation
7. Handicap calculation
8. Supabase Edge Function for AI caddy
9. Pre-round and post-round AI advice UI
10. PWA manifest + service worker
11. Round History page
12. Final mobile polish pass

## Hosting
- Vercel — connect GitHub repo, auto-deploys on push, free tier
- URL like `golf-caddy.vercel.app` → add to iPhone home screen via Safari share sheet → "Add to Home Screen"
- Launches fullscreen (no Safari chrome) once manifest.json is configured
