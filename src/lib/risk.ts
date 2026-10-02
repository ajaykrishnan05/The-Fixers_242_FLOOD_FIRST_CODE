import type { RiskStatus } from '../types'

export const RISK_ORDER: RiskStatus[] = ['Low', 'Watch', 'High', 'Severe']

export const RISK_COLORS: Record<RiskStatus, { fill: string; stroke: string; label: string }> = {
  Low: { fill: '#22c55e', stroke: '#15803d', label: 'Low' },
  Watch: { fill: '#facc15', stroke: '#a16207', label: 'Watch' },
  High: { fill: '#f97316', stroke: '#c2410c', label: 'High' },
  Severe: { fill: '#dc2626', stroke: '#991b1b', label: 'Severe' },
}

// Literal class strings so Tailwind can detect them.
export const RISK_BADGE_CLASSES: Record<RiskStatus, string> = {
  Low: 'bg-green-100 text-green-900 ring-green-600/40',
  Watch: 'bg-yellow-100 text-yellow-900 ring-yellow-600/50',
  High: 'bg-orange-100 text-orange-900 ring-orange-600/50',
  Severe: 'bg-red-600 text-white ring-red-800/60',
}

export const RISK_DOT_CLASSES: Record<RiskStatus, string> = {
  Low: 'bg-green-500',
  Watch: 'bg-yellow-400',
  High: 'bg-orange-500',
  Severe: 'bg-red-600',
}

export const RISK_BAR_CLASSES: Record<RiskStatus, string> = {
  Low: 'bg-green-500',
  Watch: 'bg-yellow-400',
  High: 'bg-orange-500',
  Severe: 'bg-red-600',
}
