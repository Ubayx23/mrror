import { getLastSevenDaysSummary } from '@/app/utils/storage';
import { DashboardCard } from './DashboardGrid';

export default function ProofLedger() {
  const summary = getLastSevenDaysSummary();
  const kept = summary.reduce((a, d) => a + d.kept, 0);
  const broken = summary.reduce((a, d) => a + d.broken, 0);
  const pending = summary.reduce((a, d) => a + d.pending, 0);

  return (
    <DashboardCard>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-white">Proof Ledger</h3>
            <p className="text-xs text-neutral-500">Your track record, not your intentions</p>
          </div>
          <div className="text-xs text-neutral-600">Last 7 days</div>
        </div>

        {/* Radial visualization (stacked, centered, compact) */}
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-[180px] w-full mx-auto">
          <div
            className="w-28 h-28 rounded-full"
            style={{
              background: `conic-gradient(
                #22c55e 0 ${kept + broken + pending === 0 ? 0 : (kept/(kept+broken+pending))*360}deg,
                #ef4444 ${kept + broken + pending === 0 ? 0 : (kept/(kept+broken+pending))*360}deg ${kept + broken + pending === 0 ? 0 : ((kept+broken)/(kept+broken+pending))*360}deg,
                #eab308 ${kept + broken + pending === 0 ? 0 : ((kept+broken)/(kept+broken+pending))*360}deg 360deg
              )`
            }}
          >
            {/* No inner circle to avoid extra visual element */}
          </div>
          </div>
          <div className="space-y-1 text-xs text-center">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-white font-medium">{kept}</span><span className="text-neutral-500">kept</span></div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span><span className="text-white font-medium">{broken}</span><span className="text-neutral-500">broken</span></div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span><span className="text-white font-medium">{pending}</span><span className="text-neutral-500">pending</span></div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
