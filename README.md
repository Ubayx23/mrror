# mrror

**A calm, intentional focus workspace.** Dark mode dashboard for deep work sessions with integrated task management, live journaling, and daily habit tracking.

---

## What You See

**Clean command center layout:**
- **Top bar** — App status, active timer, daily progress
- **Left rail** — Icon navigation (Home active, others coming soon)
- **Main dashboard** — Time-based greeting + focused workspace

**Vertical hierarchy:**
1. **Focus session** — Timer + Journal (side by side, equal importance)
2. **Reflection row** — Today's Summary + Daily Habits (side by side)

---

## Core Features

### Focus Timer
- Preset durations: **15, 25, 45, 60 minutes** (one-click)
- Custom duration input (1-120 minutes)
- Start/Pause/Reset/Done controls
- Progress bar visualization
- Must bind to a task before starting

### Task Management
- Create, select, and delete tasks
- Clean list view with inline controls
- Task selection required for timer
- Stored locally per-browser

### Journal
- Live auto-save (500ms debounce)
- Always visible thinking space
- Equal visual importance to timer
- Positioned for active use during work

### Daily Habits
- Track 1-3 daily habits
- Simple toggle (done / not done)
- 7-day visual indicator (dots)
- Auto-rotates history at midnight
- Stored locally

### Today's Summary
- Minutes focused (earned, not estimated)
- Sessions completed
- Unique tasks worked on
- Resets at local midnight

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | App Router web app |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

Client-side only. All data persists via localStorage.

---

## Key Files

**Layout Components:**
- [TopBar.tsx](app/components/TopBar.tsx) — System bar with timer status
- [IconRail.tsx](app/components/IconRail.tsx) — Vertical left navigation
- [DashboardGrid.tsx](app/components/DashboardGrid.tsx) — Card-based main content

**Feature Components:**
- [HomeScreen.tsx](app/components/HomeScreen.tsx) — Main orchestrator
- [ActiveTaskCardV2.tsx](app/components/ActiveTaskCardV2.tsx) — Compact timer card
- [InlineTaskSelectorV2.tsx](app/components/InlineTaskSelectorV2.tsx) — Task picker with presets + custom input
- [NotesPanel.tsx](app/components/NotesPanel.tsx) — Live journal with auto-save
- [StatsCard.tsx](app/components/StatsCard.tsx) — Today's summary (minutes, sessions, tasks)
- [HabitsCard.tsx](app/components/HabitsCard.tsx) — Daily habit tracker with 7-day history

**Utilities:**
- [sessions.ts](app/utils/sessions.ts) — Session tracking, daily calculations
- [intent.ts](app/utils/intent.ts) — Journal intent storage (legacy)

**Entry Point:**
- [page.tsx](app/page.tsx) — Renders HomeScreen after boot

---

## Development

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm start        # start production server
npm run lint     # lint code
```

---

## Data Structures

All data stored in localStorage:

**Tasks** (`mrror-tasks-v1`):
```json
[
  { "id": "uuid", "title": "Task name" }
]
```

**Sessions** (`mrror-sessions-v1`):
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

**Journal** (`mrror-notes-v1`):
```
Plain text string, auto-saved every 500ms
```

**Habits** (`mrror-habits-v1`):
```json
[
  {
    "id": "uuid",
    "name": "Habit name",
    "history": [true, false, true, false, false, true, false]
  }
]
```

**Habit History Marker** (`mrror-habit-history-v1`):
```
Last check date (string) - triggers daily rotation
```

---

## Design Philosophy

- **Dark mode default** — Neutral-950 background, emerald accent
- **Calm, not loud** — No gamification, no animations, soft shadows
- **Intentional spacing** — Every element has purpose and place
- **Thinking while working** — Journal is active workspace, not afterthought
- **Earned progress** — Minutes = completed sessions only, resets at midnight

---

## Layout Grid

```
┌─────────────────────────────────────────┐
│  Greeting (Good morning/afternoon/evening)│
│  Date (Monday, January 6)               │
├──────────────────┬──────────────────────┤
│  Timer Card      │  Journal Panel       │
│  (compact)       │  (thinking space)    │
├──────────────────┼──────────────────────┤
│  Today's Summary │  Daily Habits        │
│  (reflection)    │  (reflection)        │
└──────────────────┴──────────────────────┘
```

Responsive: 3-column grid on desktop, stacks on mobile.

---

## Roadmap

**Phase 5 (Potential):**
- Build out Tasks, Journal, Goals, Projects tabs
- Session history view
- Weekly/monthly retrospectives
- Export/backup functionality

---

## One-Line Context

Mrror is a calm, dark-mode focus workspace where you set a task, run a timer, journal your thoughts, and track daily habits—all stored locally, all intentionally designed.

