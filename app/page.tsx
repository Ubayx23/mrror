'use client';

import { useEffect, useState } from 'react';
import BootScreen from '@/app/components/BootScreen';
import HomeScreen from '@/app/components/HomeScreen';

const BOOT_DELAY_MS = 1300;

export default function Home() {
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window === 'undefined') return true;
    // Check if we've already booted in this session
    const hasBooted = sessionStorage.getItem('mrror-booted');
    return !hasBooted;
  });

  useEffect(() => {
    if (isBooting) {
      const timer = setTimeout(() => {
        setIsBooting(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('mrror-booted', 'true');
        }
      }, BOOT_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  if (isBooting) return <BootScreen />;

  return <HomeScreen />;
}
