# mrror

Phase 3 (continued): intent-first execution surface. Boot → one-line journal prompt → active task + timer → progress. Top navigation links to Home (active), Tasks, Journal, Goals, Projects (placeholders).

---

## What You See

- Brief boot/loading view (~1–2s) with "Initializing mrror…".
- **Top navigation bar** with:
  - App name (left)
  - Links: Home (active), Tasks, Journal, Goals, Projects (others are "coming soon" placeholders)
  - Minutes focused today (right)
- **Home screen layout** (in order of importance):
  1. **Journal intent input** — "What are you working on right now, and why does it matter?" (one-liner, stores locally)
  2. **Active task card** — Task name, duration, timer with start/pause/done buttons
  3. **Progress indicator** — Minutes focused today (shown in top nav)
  4. **Task selector** — Modal for picking/creating a task and setting duration before starting

## Core Mechanics

- **Intent before execution** — User sets intention before starting any work.
- **One active task at a time** — Focus on one thing.
- **Task & duration binding** — No timer without a task and chosen duration.
- **Earned progress only** — Minutes today = completed sessions, reset at midnight.
- **Clean, calm design** — Black & white, minimal friction, professional feel.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | App Router web app |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| ESLint | 9.x | Linting |

Client-side only. localStorage for tasks, sessions, intent, state.

---

## Key Files

**New in Phase 3 (continued):**
- [app/components/TopNav.tsx](app/components/TopNav.tsx) — Navigation bar with links and daily progress.
- [app/components/JournalIntentInput.tsx](app/components/JournalIntentInput.tsx) — One-line intent prompt.
- [app/utils/intent.ts](app/utils/intent.ts) — Store and load journal intent locally.

**From Phase 3 (initial):**
- [app/components/HomeScreen.tsx](app/components/HomeScreen.tsx) — Refactored to use TopNav and JournalIntentInput.
- [app/components/ActiveTaskCard.tsx](app/components/ActiveTaskCard.tsx) — Centerpiece card with task + timer.
- [app/components/TaskSelector.tsx](app/components/TaskSelector.tsx) — Modal for picking/creating task + setting duration.
- [app/components/AllTasksList.tsx](app/components/AllTasksList.tsx) — Modal showing all tasks.
- [app/utils/sessions.ts](app/utils/sessions.ts) — Track completed focus sessions and calculate daily minutes.

**Existing (updated):**
- [app/page.tsx](app/page.tsx) — Renders HomeScreen after boot.

**Legacy (dormant):**
- [app/components/IconPanel.tsx](app/components/IconPanel.tsx), [app/components/DashboardShell.tsx](app/components/DashboardShell.tsx), [app/components/FocusTimer.tsx](app/components/FocusTimer.tsx), [app/components/TasksPanel.tsx](app/components/TasksPanel.tsx) — From Phase 2, no longer used.
- [app/utils/storage.ts](app/utils/storage.ts), [app/utils/SystemMetrics.ts](app/utils/SystemMetrics.ts) — Original utilities, not used.

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

## Data Structures

**Tasks** (localStorage key: `mrror-tasks-v1`):
```json
[
  { "id": "uuid", "title": "Task name" }
]
```

**Sessions** (localStorage key: `mrror-sessions-v1`):
```json
[
  {
    "id": "uuid",
    "taskId": "uuid",
    "taskName": "Task name",
    "durationSeconds": 1500,
    "completedAt": "2025-01-06T10:30:00Z"
  }
]
```

**Intent** (localStorage key: `mrror-intent-v1`):
```json
{
  "id": "uuid",
  "text": "Build the focus timer and make it feel good",
  "createdAt": "2025-01-06T10:30:00Z"
}
```

---

## Next (Phase 4 ideas)

- Build out Journal, Goals, Projects tabs with simple input/display.
- Session history and retrospectives (optional).
- Daily wrap-up prompt.
- Mobile app or PWA.

---

## One-Line Context for AI

Mrror is a minimal, intention-first execution surface: set your intent, pick a task, start the timer, watch the focus minutes accumulate—everything else is intentionally deferred.
