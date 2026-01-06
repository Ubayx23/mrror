'use client';

// Minimal boot/loading screen shown for ~1–2 seconds on initial load.
export default function BootScreen() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center">
      <div className="flex items-center gap-3 text-base sm:text-lg font-medium tracking-tight" aria-live="polite">
        <span
          className="h-3 w-3 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <span>Initializing mrror…</span>
      </div>
    </div>
  );
}
