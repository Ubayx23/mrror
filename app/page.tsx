'use client';

import { useEffect, useState } from 'react';
import BootScreen from '@/app/components/BootScreen';
import HomeScreen from '@/app/components/HomeScreen';

const BOOT_DELAY_MS = 1300;

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), BOOT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) return <BootScreen />;

  return <HomeScreen />;
}
