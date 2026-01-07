'use client';

import { DashboardCard } from './DashboardGrid';

function getCurrentWeek(): { label: string; date: string; isToday: boolean }[] {
  const today = new Date();
  const day = today.getDay(); // 0 Sun - 6 Sat
  // We want Mon-Sun: compute Monday as start
  const diffToMon = (day + 6) % 7; // days since Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMon);
  const days: { label: string; date: string; isToday: boolean }[] = [];
  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const isToday = d.toDateString() === today.toDateString();
    days.push({ label: labels[i], date: iso, isToday });
  }
  return days;
}

export default function WeeklyCalendar() {
  const week = getCurrentWeek();
  return (
    <DashboardCard>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">This Week</h3>
          <span className="text-xs text-neutral-600">Mon–Sun</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {week.map((d) => (
            <div
              key={d.date}
              className={`text-center px-2 py-3 rounded border ${d.isToday ? 'border-blue-600 bg-blue-950/40 text-white' : 'border-neutral-800 bg-neutral-900 text-neutral-300'}`}
            >
              <div className="text-xs">{d.label}</div>
              <div className="text-sm font-medium">{new Date(d.date).getDate()}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
