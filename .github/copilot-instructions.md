# Copilot Instructions for mrror

These instructions help AI coding agents work productively in this codebase. Keep edits precise, prefer minimal diffs, and follow existing patterns.

## Architecture Overview
- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript 5; Tailwind CSS v4 for styling.
- **Client-only:** All state is browser-side; persistence via `localStorage` and session gating via `sessionStorage`.
- **Routes:**
  - Home: [app/page.tsx](app/page.tsx) → renders [HomeScreen.tsx](app/components/HomeScreen.tsx).
  - Calendar: [app/calendar/page.tsx](app/calendar/page.tsx) → per-day tasks UI.
- **Layout:** [DashboardGrid.tsx](app/components/DashboardGrid.tsx) provides a 2-column card layout (`DashboardCard`). [TopBar.tsx](app/components/TopBar.tsx) and [IconRail.tsx](app/components/IconRail.tsx) compose the shell.

## State & Data
- **Daily Promise System:** In [app/utils/storage.ts](app/utils/storage.ts).
  - Types: `DailyPromise`, `PromiseState`.
  - APIs: `getTodayPromise()`, `createPromise()`, `completePromise()`, `failPromise()`.
  - History helpers: `getLastSevenDaysPromises()`, `getLastSevenDaysSummary()`.
  - Gate: `isDailyCheckInComplete()` enforces daily check-in (redirect handled in `HomeScreen`).
  - Streak: `markOpenedToday()` and `getFireStreak()` track consecutive open days.
- **Calendar Tasks:** In [app/utils/calendar.ts](app/utils/calendar.ts).
  - Types: `DayTask` with `completedAt` and `createdAt`.
  - APIs: `getTasksForDate(date)`, `addTaskForDate(date, title)`, `toggleTaskCompletion(id)`, `deleteTask(id)`.
  - Helpers: `getTodayDate()`, `hasTasksForDate(date)`, `getCompletedCountForDate(date)`.
- **Session/Intent:** See [app/utils/sessions.ts](app/utils/sessions.ts) and [app/utils/intent.ts](app/utils/intent.ts) for legacy/aux data.

## UI Patterns
- **Client components:** Most files begin with `"use client"`. Keep browser-only APIs guarded with `typeof window !== 'undefined'` when used in initializers.
- **Cards & Grid:** Use `DashboardCard` within `DashboardGrid` for consistent spacing and borders.
- **Tailwind style:** Neutral palette (e.g., `bg-neutral-950`) with subtle rings/borders. Prefer calm UI — minimal shadows/animations.
- **Calendar status:** Weekly pills show status via ring color: blue (selected), neutral (today), emerald (all tasks complete), red (incomplete).
- **Proof Ledger:** Keep [ProofLedger.tsx](app/components/ProofLedger.tsx) in Home; productivity chart removed.

## Navigation & Routing
- **IconRail:** Controls primary navigation; `currentPage` values: `"home"`, `"calendar"`.
- **HomeScreen redirects:** On mount, redirects to `/check-in` if `isDailyCheckInComplete()` is false; also calls `markOpenedToday()`.

## Storage Conventions
- **Keys:**
  - Promises: `mrror-promises-v1`
  - Calendar tasks: `mrror-calendar-tasks-v1`
  - Check-ins: `mrror-checkins-v1`
  - Open days streak: `mrror-open-days-v1`
- **Serialization:** JSON arrays; new entries are prepended for "latest-first" views.
- **Date format:** Always `YYYY-MM-DD` for day-level data.

## Development Workflow
- **Commands:**
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Start: `npm start`
  - Lint: `npm run lint`
- **Client-only guard:** When reading `localStorage`/`sessionStorage`, ensure checks in lazy initializers or effects to avoid SSR errors.
- **Minimal diffs:** Modify only the relevant components; avoid reformatting unrelated code.

## Making Changes Safely
- Prefer updating utilities rather than duplicating logic in components.
- For new day-level features, use `getTodayDate()` and store under a new `*-v1` localStorage key.
- Keep UI aligned with existing minimal aesthetic: neutral tones, subtle rings, small text sizes.
- When adding new routes, place under `app/<route>/page.tsx` and compose with `DashboardGrid`/`DashboardCard`.

## Examples
- **Add a task to a specific day:** Use `addTaskForDate(date, title)` from [calendar.ts](app/utils/calendar.ts) and refresh the list via `getTasksForDate(date)`.
- **Mark a daily promise complete:** Call `completePromise()` from [storage.ts](app/utils/storage.ts) and reflect status in `HomeScreen`.

If any of these sections feel incomplete or unclear, tell me which areas to expand (e.g., Proof Ledger data flow, check-in route behavior, or calendar status logic), and I’ll refine this document. 