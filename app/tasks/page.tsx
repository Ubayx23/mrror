'use client';

import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import DashboardGrid from '@/app/components/DashboardGrid';
import IntentTasksPanel from '@/app/components/IntentTasksPanel';

export default function IntentTasksPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar minutesToday={0} />
      <IconRail currentPage="home" />
      <DashboardGrid>
        <IntentTasksPanel />
      </DashboardGrid>
    </div>
  );
}
