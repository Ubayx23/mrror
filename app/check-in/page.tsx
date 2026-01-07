'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/app/components/DashboardGrid';
import { isDailyCheckInComplete, setDailyCheckIn, getYesterdayMessage } from '@/app/utils/storage';

export default function CheckInPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isDailyCheckInComplete()) {
      router.replace('/');
      return;
    }
    setMessage(getYesterdayMessage());
  }, [router]);

  const submit = useCallback((kept: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    setDailyCheckIn(kept, message.trim());
    router.replace('/');
  }, [message, router, submitting]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <DashboardCard>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Daily Check-In</h1>
              <p className="text-neutral-400">This check-in is required before entering your day.</p>
            </div>

            <div className="space-y-3">
              <p className="text-lg font-medium">Did you act accordingly like the person you want to become?</p>
              <textarea
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to yourself. You will see it tomorrow."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={submitting}
                onClick={() => submit(true)}
                className="py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 font-semibold"
              >
                Yes — Kept
              </button>
              <button
                disabled={submitting}
                onClick={() => submit(false)}
                className="py-3 rounded-lg bg-red-700 hover:bg-red-800 disabled:opacity-60 font-semibold"
              >
                No — Broken
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Calm, mandatory, and honest. You can enter the dashboard after submitting.
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
