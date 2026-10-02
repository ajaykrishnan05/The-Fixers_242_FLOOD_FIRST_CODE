import { RISK_BADGE_CLASSES } from '../lib/risk'
import type { RiskStatus } from '../types'

export default function RiskBadge({ status, score }: { status: RiskStatus; score?: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${RISK_BADGE_CLASSES[status]}`}
    >
      {status}
      {score !== undefined && <span className="font-semibold normal-case opacity-90">· {score}/100</span>}
    </span>
  )
}
