'use client';

import { useEffect, useState } from 'react';
import BootScreen from '@/app/components/BootScreen';
import DashboardShell from '@/app/components/DashboardShell';

const BOOT_DELAY_MS = 1300; // brief loading pause before showing the dashboard shell

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), BOOT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) return <BootScreen />;

  return <DashboardShell />;
}
