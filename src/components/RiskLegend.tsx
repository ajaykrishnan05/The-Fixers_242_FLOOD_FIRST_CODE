import { RISK_COLORS, RISK_ORDER } from '../lib/risk'

export default function RiskLegend() {
  return (
    <div className="rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-xs shadow-md" aria-label="Risk legend">
      <p className="mb-1 font-bold text-slate-900">Inundation risk</p>
      <ul className="space-y-0.5">
        {[...RISK_ORDER].reverse().map((s) => (
          <li key={s} className="flex items-center gap-2 text-slate-800">
            <span
              className="inline-block h-3 w-5 rounded-sm border"
              style={{ background: RISK_COLORS[s].fill, borderColor: RISK_COLORS[s].stroke, opacity: 0.9 }}
            />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
