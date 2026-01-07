# mrror

**A calm, intentional daily system.** Dark-mode workspace for deep work, journaling, goal tracking, and daily reflection. Everything persists locally—no servers, no cloud.

---

## Overview

Mrror helps you move through your day with intention. Track daily commitments, journal your thinking, manage long-term goals, and build consistent habits—all in one place.

**Core flows:**
1. **Home** — Daily promise system + fire streak tracker
2. **Journal** — 3-column entry system with formatting toolbar
3. **Calendar** — Per-day task management
4. **Goals** — Long-term vision with outcomes and actions
5. **Check-in** — Daily promise setup (redirects if incomplete)

---

## Feature Map

### Daily Promise (Home)
- Set one meaningful promise for today
- Track completion, failure, or defer
- See last 7 days of commitment history
- **Fire streak** — Consecutive days you've opened the app
- Proof ledger showing historical promises

### Journal
- **3-column layout**: Categories (sidebar) → Entry list → Full editor
- **Categories**: Work, Personal, Events, Education, Social
- **Formatting toolbar**: Slash commands (`/`) for Bold, Italic, Headline, Quote, List, Highlight, Underline
- **Auto-save** — 600ms debounce on title and body
- **Date-based** — Organize entries by day (YYYY-MM-DD)
- **Entry deletion** — Delete from list or editor header

### Calendar
- **Per-day tasks** — Create, complete, delete tasks for any date
- **Task completion tracking** — Mark tasks done/incomplete
- **Weekly view** — Visual status rings (blue=selected, neutral=today, emerald=complete, red=incomplete)
- **Category filtering** — Filter by Work/Personal/Events/etc.

### Goals
- **Time horizons**: 90-day, 1-year, 3-year, 5-year
- **Outcomes** — Define what success looks like
- **Actions** — Repeatable steps toward goal
- **"Use for Today"** — Mark an action to prefill as today's Daily Promise
- **Full CRUD** — Create, edit, delete goals at any time

### Check-in (Daily Gating)
- Appears on first load if daily promise not yet set
- Ensures intentional start to each day
- Redirects to promise creation flow

---

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 16.1.1 | App Router, client-side only |
| React | 19.2.3 | UI framework |
| TypeScript | 5.x | Type safety throughout |
| Tailwind CSS | 4.x | Utility-first styling |

**Client-only architecture** — All state lives in browser via localStorage. No backend required.

---

## Project Structure

```
app/
├── components/          # UI components
│   ├── TopBar.tsx      # System bar (fire streak, timer)
│   ├── IconRail.tsx    # Left vertical navigation
│   ├── HomeScreen.tsx  # Home page orchestrator
│   ├── ProofLedger.tsx # 7-day promise history
│   └── [others]        # Feature-specific components
├── utils/              # State management & data
│   ├── storage.ts      # Daily Promise CRUD + fire streak
│   ├── calendar.ts     # Per-day tasks
│   ├── journal.ts      # Journal entries
│   ├── goals.ts        # Long-term goals
│   ├── sessions.ts     # Session tracking
│   └── SystemMetrics.ts # Metrics calculations
├── page.tsx            # Home page route
├── layout.tsx          # Root layout
├── journal/page.tsx    # Journal full page
├── calendar/page.tsx   # Calendar full page
├── goals/page.tsx      # Goals full page
├── check-in/page.tsx   # Daily promise setup
└── globals.css         # Global styles
```

---

## Data Structures

All persisted in localStorage:

**Daily Promises** (`mrror-promises-v1`):
```json
[
  {
    "id": "uuid",
    "title": "Build the feature",
    "state": "pending|completed|failed",
    "createdAt": "2025-01-07T08:00:00Z",
    "completedAt": "2025-01-07T17:00:00Z"
  }
]
```

**Calendar Tasks** (`mrror-calendar-tasks-v1`):
```json
[
  {
    "id": "uuid",
    "date": "2025-01-07",
    "title": "Task name",
    "completedAt": "2025-01-07T14:30:00Z",
    "createdAt": "2025-01-07T09:00:00Z"
  }
]
```

**Journal Entries** (`mrror-journal-entries-v1`):
```json
[
  {
    "id": "uuid",
    "date": "2025-01-07",
    "title": "Entry title",
    "bodyHtml": "<p>HTML content</p>",
    "category": "Work|Personal|Events|Education|Social",
    "createdAt": "2025-01-07T10:00:00Z",
    "updatedAt": "2025-01-07T10:05:00Z"
  }
]
```

**Goals** (`mrror-goals-v1`):
```json
[
  {
    "id": "uuid",
    "title": "Ship the product",
    "timeHorizon": "90-day|1-year|3-year|5-year",
    "outcomes": [
      { "id": "uuid", "text": "Achieve X metric" }
    ],
    "actions": [
      {
        "id": "uuid",
        "title": "Build feature",
        "description": "Optional details",
        "useForToday": false
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-07T10:00:00Z"
  }
]
```

**Fire Streak** (`mrror-open-days-v1`):
```json
[
  {
    "date": "2025-01-07",
    "opened": true
  }
]
```

---

## Key Utilities

**storage.ts** — Daily Promise management
- `getTodayPromise()` — Get today's promise (or null)
- `createPromise(title)` — Create new promise
- `completePromise(id)` — Mark as done
- `failPromise(id)` — Mark as failed
- `getLastSevenDaysPromises()` — Historical view
- `getFireStreak()` — Get consecutive open days
- `markOpenedToday()` — Track daily open
- `isDailyCheckInComplete()` — Gate check (redirects if false)

**calendar.ts** — Per-day task management
- `getTasksForDate(date)` — Get tasks for YYYY-MM-DD
- `addTaskForDate(date, title)` — Create task
- `toggleTaskCompletion(id)` — Mark complete/incomplete
- `deleteTask(id)` — Remove task
- `getCompletedCountForDate(date)` — Progress tracking
- `getTodayDate()` — Local YYYY-MM-DD format

**journal.ts** — Journal entry CRUD
- `getEntries()` — Get all entries
- `createEntry(title, bodyHtml, category)` — Create
- `updateEntry(id, updates)` — Modify entry
- `deleteEntry(id)` — Remove entry
- `getTodayDate()` — Current date in local timezone

**goals.ts** — Goal management
- `createGoal(title, timeHorizon)` — Create goal
- `addOutcome(goalId, text)` — Add outcome
- `addAction(goalId, title, description)` — Add action
- `setActionAsPromise(goalId, actionId)` — Mark for today
- `deleteGoal(id)`, `removeOutcome(id)`, `removeAction(id)` — Deletions

---

## Navigation

**IconRail** (`app/components/IconRail.tsx`):
- `◆` Home — Daily promise + fire streak
- `📅` Calendar — Per-day task view
- `◈` Journal — Full-page entry editor
- `◇` Goals — Long-term vision & actions
- `◉` Projects — Coming soon

---

## Design Philosophy

- **Dark mode default** — Neutral-950 background, emerald-600 accents
- **Calm UI** — No gamification, no animations, subtle rings and borders
- **Client-first** — All state local, no network dependencies
- **Intentional** — Every feature serves focus and reflection
- **Accessible** — Clear type hierarchy, proper contrast, keyboard navigation

---

## Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

**Environment:** Runs in browser only. All data persists to localStorage.

---

## Contributing Notes

- Keep components in `app/components/`
- Utilities go in `app/utils/`
- New routes as `app/[route]/page.tsx`
- Use `getTodayDate()` for date consistency (local YYYY-MM-DD)
- All storage keys end with `-v1` for versioning
- Guard localStorage access: `if (typeof window !== 'undefined')`

---

## License

MIT


