# mrror

Phase 2: a lean home workspace. Boot screen → welcome header → actionable surface with a focus timer and a local task list. No streaks, metrics, or onboarding questions.

---

## What You See

- Brief boot/loading view (~1–2s) with “Initializing mrror…”.
- Home header: “Welcome back” plus a short reminder of why this exists.
- Focus timer (25 minutes by default): start, pause, reset. One timer at a time.
- Tasks: add, mark complete, delete. Flat list only. Stored in localStorage.
- Sidebar placeholders for Notes, Journal, Goals, Learning (coming soon).

## What Is Gone Forever

- The interrogation/question flow (Q1–Q5) and state machine routing.
- Metrics dashboards, streaks, charts, and CRT theming.
- Any notion of onboarding questions or gamified flows.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | App Router web app |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| ESLint | 9.x | Linting |

No backend; everything runs client-side. Data is per-browser via localStorage.

---

## Key Files

- [app/page.tsx](app/page.tsx) — Boot delay, then renders the home workspace.
- [app/components/BootScreen.tsx](app/components/BootScreen.tsx) — Minimal loader.
- [app/components/DashboardShell.tsx](app/components/DashboardShell.tsx) — Layout for header, timer, tasks, and placeholders.
- [app/components/FocusTimer.tsx](app/components/FocusTimer.tsx) — Start/pause/reset focus timer (25m default).
- [app/components/TasksPanel.tsx](app/components/TasksPanel.tsx) — LocalStorage task list (add/complete/delete).
- [app/layout.tsx](app/layout.tsx) — Root layout and metadata.
- [app/globals.css](app/globals.css) — Neutral base styling.
- [app/utils/storage.ts](app/utils/storage.ts) and [app/utils/SystemMetrics.ts](app/utils/SystemMetrics.ts) — Legacy utilities kept but unused.

Legacy components still present but unused: [app/components/DailyDiagnostic.tsx](app/components/DailyDiagnostic.tsx), [app/components/MissionDebrief.tsx](app/components/MissionDebrief.tsx), [app/components/StatusBar.tsx](app/components/StatusBar.tsx), [app/components/TomorrowDirective.tsx](app/components/TomorrowDirective.tsx).

---

## Development

```bash
npm install      # install deps
npm run dev      # start dev server
npm run build    # production build
npm start        # start production server
npm run lint     # lint
```

---

## Notes for Future Work

- Keep UI calm and minimal; add features only when they serve daily use.
- If data structures evolve, refactor cleanly and retire unused utilities.
- Upcoming ideas: flesh out Notes/Journal/Goals/Learning once core workflow feels solid.

---

## One-Line Context for AI

Mrror is now a minimalist Next.js home workspace with a short boot screen, a welcome header, a 25-minute focus timer, and a localStorage-backed flat task list; legacy interrogation/metrics code is removed or dormant.
