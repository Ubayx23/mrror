# MRROR - Daily Accountability System

A terminal-inspired daily reflection app that tracks mission integrity, focus metrics, and time wasted through a systematic interrogation flow.

---

## PROJECT OVERVIEW

**Name**: mrror  
**Type**: Next.js 16 Web Application  
**Purpose**: Daily accountability system with terminal/CRT aesthetic that collects psychological metrics, calculates system integrity, and maintains streak tracking.  
**Storage**: Client-side only (localStorage)  
**Flow**: Boot → Daily Interrogation (5 questions) → Dashboard

---

## CORE CONCEPT

MRROR is a **military/system diagnostic-themed** accountability tool that treats the user's mind as a system that requires daily auditing. Users complete a 5-question interrogation flow once per day to assess:
- Mission honor (did you keep yesterday's promise?)
- Time wasted (hours lost to distraction)
- Excuse logging (what rationalization won?)
- Focus/control metrics (0-10 ratings on 3 dimensions)
- Tomorrow's prime objective (what's the mission?)

The app calculates **System Integrity** (0-100%) and **Rot Index** (time waste percentage) from these inputs and displays them in a terminal-style dashboard.

---

## TECH STACK

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router |
| **React** | 19.2.3 | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **ESLint** | 9.x | Code linting |

**No backend**: All data stored in browser's localStorage.

---

## FILE STRUCTURE & RESPONSIBILITY

```
/workspaces/mrror/
│
├── app/
│   ├── page.tsx                    [MAIN ORCHESTRATOR]
│   │   └─ Manages flow state, collects form data, saves records
│   │
│   ├── layout.tsx                  [ROOT LAYOUT]
│   │   └─ HTML structure, metadata, globals.css
│   │
│   ├── globals.css                 [GLOBAL STYLES]
│   │   └─ Tailwind base, custom animations, terminal colors
│   │
│   ├── components/
│   │   ├── BootScreen.tsx          [ENTRY POINT]
│   │   │   └─ Animated terminal boot sequence
│   │   │
│   │   ├── Q1_MissionHonor.tsx     [QUESTION 1]
│   │   │   └─ Binary choice: Did you honor yesterday's mission?
│   │   │
│   │   ├── Q2_TimeWasted.tsx       [QUESTION 2]
│   │   │   └─ Slider input: Hours wasted (0-16)
│   │   │
│   │   ├── Q3_ExcuseLog.tsx        [QUESTION 3]
│   │   │   └─ Text input: What excuse won when discipline failed?
│   │   │
│   │   ├── Q4_FocusControl.tsx     [QUESTION 4]
│   │   │   └─ 3 sliders: Impulse control, focus, emotional stability
│   │   │
│   │   ├── Q5_PrimeObjective.tsx   [QUESTION 5]
│   │   │   └─ Text input + time window: Today's objective
│   │   │
│   │   ├── Dashboard.tsx           [RESULTS DISPLAY]
│   │   │   └─ Shows today's metrics + 7-day averages
│   │   │
│   │   ├── TerminalLayout.tsx      [UNUSED/DEPRECATED?]
│   │   ├── StatusBar.tsx           [UNUSED/DEPRECATED?]
│   │   ├── DailyDiagnostic.tsx     [UNUSED/DEPRECATED?]
│   │   ├── TomorrowDirective.tsx   [UNUSED/DEPRECATED?]
│   │   └── MissionDebrief.tsx      [UNUSED/DEPRECATED?]
│   │
│   └── utils/
│       ├── storage.ts              [DATA LAYER]
│       │   └─ localStorage CRUD, record interfaces
│       │
│       └── SystemMetrics.ts        [CALCULATIONS]
│           └─ Streak, integrity %, rot index, focus ratio
│
├── public/                          [STATIC ASSETS]
│
├── package.json                     [DEPENDENCIES]
├── tsconfig.json                    [TYPESCRIPT CONFIG]
├── next.config.ts                   [NEXT.JS CONFIG]
├── eslint.config.mjs                [LINTING CONFIG]
├── postcss.config.mjs               [CSS PROCESSING]
└── tailwind.config.ts               [STYLING CONFIG - MAY NOT EXIST]
```

---

## DATA ARCHITECTURE

### DailyRecord Interface (storage.ts)
```typescript
interface DailyRecord {
  timestamp: string;              // ISO datetime
  missionSuccess: boolean;        // Q1 answer
  timeWasted: number;             // Q2 answer (0-16 hours)
  excuseLog: string;              // Q3 answer
  impulseControl: number;         // Q4 answer (0-10)
  focusConsistency: number;       // Q4 answer (0-10)
  emotionalStability: number;     // Q4 answer (0-10)
  systemIntegrity: number;        // Calculated: avg of Q4 metrics × 10
  rotIndex: number;               // Calculated: (timeWasted / 16) × 100
  tomorrowObjective: string;      // Q5 answer
  executionWindow: string;        // Q5 answer (Morning/Afternoon/Evening)
}
```

### Storage Functions (storage.ts)
- `getAllRecords()` - Returns all records from localStorage
- `saveRecord(record)` - Prepends new record to array
- `getLatestRecord()` - Returns most recent record
- `hasRecordToday()` - Checks if user already submitted today
- `getRecordsByDays(n)` - Returns records from last N days

### Metric Calculations (SystemMetrics.ts)
- `calculateSystemIntegrity()` - Avg of 3 Q4 ratings × 10 → 0-100%
- `calculateRotIndex()` - (timeWasted / 16) × 100 → 0-100%
- `calculateStreak()` - Consecutive days with records
- `getAverageIntegrity(days)` - Average system integrity over N days
- `getAverageRotIndex(days)` - Average rot index over N days
- `calculateFocusRatio()` - focusConsistency / timeWasted

---

## USER FLOW (FlowStep State Machine)

```
'boot' → 'q1' → 'q2' → 'q3' → 'q4' → 'q5' → 'dashboard'
   ↓       ↓      ↓      ↓      ↓      ↓         ↓
 Boot   Honor  Waste  Excuse Focus  Objective Results
Screen   Y/N   Hours   Log   Sliders  + Time   Display
```

**State Logic** (page.tsx):
- On mount: Check `hasRecordToday()`
  - If YES → start at 'dashboard'
  - If NO → start at 'boot'
- Each component calls `onComplete` callback with its data
- Data accumulates in `formData` state object
- Q5 triggers final record save + transition to dashboard

---

## VISUAL DESIGN SYSTEM

### Theme: Terminal/CRT Military System
**Color Palette** (from globals.css):
- Primary: `#00E0FF` (cyan) - terminal text
- Danger: `#FF3B3B` (red) - warnings, failures
- Background: `#0A0A0A` (near-black)
- Secondary BG: `#1B1F23` (steel gray)
- Subtext: `#9CA3AF` (muted gray)

### Animations & Effects:
- **Typewriter effect** - Questions type character-by-character
- **CRT scanlines** - Repeating horizontal lines overlay
- **Glow effects** - Text shadows on cyan/red elements
- **Flicker** - Red warning text animation
- **Glitch** - Error state distortion
- **Cursor blink** - Animated `▮` cursor during typing

### Component Patterns:
- All question screens: Full-screen, centered content
- Typewriter reveal → UI elements fade in
- Selected options glow with colored borders
- Submit triggers processing messages → next screen

---

## KEY FEATURES

### ✅ Implemented
1. **Boot Sequence** - Terminal-style initialization
2. **5-Question Flow** - Binary, slider, text inputs
3. **System Integrity Calculation** - Derived from focus metrics
4. **Rot Index Calculation** - Time waste percentage
5. **Streak Tracking** - Consecutive daily submissions
6. **Dashboard Display** - Today's metrics + 7-day averages
7. **localStorage Persistence** - All data client-side
8. **One-submission-per-day** - Blocks repeat submissions
9. **Responsive Design** - Mobile-friendly
10. **CRT/Terminal Aesthetic** - Complete visual theme

### 🚧 Potential Unused Components
- `TerminalLayout.tsx`
- `StatusBar.tsx`
- `DailyDiagnostic.tsx`
- `TomorrowDirective.tsx`
- `MissionDebrief.tsx`

*(These exist in the codebase but may not be imported/used in current flow)*

---

## CURRENT STATE

### What Works:
- Complete interrogation flow from boot to dashboard
- All calculations (integrity, rot index, streak, averages)
- Data persistence via localStorage
- Daily submission blocking
- Responsive terminal UI with animations

### Known Issues/Questions:
- Several component files appear unused (see above)
- No data export/import functionality
- No history view (can only see today's record on dashboard)
- No way to edit past records
- No data visualization (charts/graphs)
- No reminders/notifications system

---

## DEVELOPMENT COMMANDS

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## HOW TO USE (User Perspective)

1. Visit site → See boot screen animation
2. Answer 5 questions about yesterday:
   - Did you honor your mission?
   - How many hours wasted?
   - What excuse won?
   - Rate your focus/control (3 sliders)
   - Set today's objective + time window
3. View dashboard with:
   - System integrity percentage
   - Current streak
   - Time wasted
   - Rot index
   - 7-day averages
4. Return tomorrow to submit next day's reflection

**Limitation**: Can only submit once per day (blocks re-entry until next calendar day).

---

## EXTENSION IDEAS (Not Implemented)

- Historical record viewer/calendar
- Data export (JSON/CSV)
- Charts/graphs for trends
- Multi-objective support
- Reminder notifications
- Streak recovery mechanism
- Anonymous data comparison
- Mobile app version
- Data encryption

---

## CONFIGURATION FILES

- `next.config.ts` - Next.js settings
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.mjs` - Linting rules
- `postcss.config.mjs` - CSS post-processing
- `package.json` - Dependencies & scripts
- `next-env.d.ts` - Next.js TypeScript declarations

---

## SUMMARY FOR AI CONTEXT

**In one sentence**: MRROR is a Next.js + TypeScript daily accountability app with a terminal aesthetic that guides users through a 5-question reflection flow, calculates system integrity and rot index metrics, and displays results in a CRT-styled dashboard while maintaining streak tracking via localStorage.

**Feed this to another model to understand**:
- The project is a **single-page app** with a **state machine flow**
- Data lives **only in browser** (no backend)
- Visual design is **military/terminal/CRT themed**
- Core mechanic: **daily interrogation → metrics → dashboard**
- All calculations happen in **SystemMetrics.ts**
- All storage happens in **storage.ts**
- **page.tsx orchestrates everything**
- **localStorage** - Data persistence

## Project Structure

- `app/page.tsx` - Main application component with comprehensive comments
- `app/layout.tsx` - Root layout and metadata
- `app/globals.css` - Global styles and Tailwind setup

## Learning Resources

The code is extensively commented to help you understand:
- React hooks (`useState`, `useEffect`)
- localStorage API usage
- Form handling in React
- TypeScript interfaces
- Tailwind CSS responsive design
- Next.js client components

## License

Open source - feel free to use and modify as needed. 
