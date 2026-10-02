import { ArrowRight, Building2, Clock, Users } from 'lucide-react'
import type { ScoredZone } from '../types'
import RiskBadge from './RiskBadge'

export const RANK_LABELS = ['Immediate action', 'High priority', 'Monitor / prepare'] as const

const RANK_STYLES = ['bg-red-600 text-white', 'bg-orange-500 text-white', 'bg-slate-700 text-white']

interface Props {
  rank: number // 1-based
  sz: ScoredZone
  selected: boolean
  onSelect: (id: string) => void
}

export default function HotspotCard({ rank, sz, selected, onSelect }: Props) {
  const { zone } = sz
  return (
    <li>
      <article
        className={`rounded-lg border-2 bg-white p-3 transition-all ${
          selected ? 'border-navy-900 shadow-lg ring-2 ring-navy-900/20' : 'border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md'
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(zone.id)}
          aria-pressed={selected}
          aria-label={`Rank ${rank}, ${RANK_LABELS[rank - 1]}: ${zone.name}. View action.`}
          className="block w-full text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <span className={`rounded px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide ${RANK_STYLES[rank - 1]}`}>
              #{rank} {RANK_LABELS[rank - 1]}
            </span>
            <RiskBadge status={sz.status} />
          </div>

          <h3 className="mt-2 text-base font-bold leading-snug text-slate-900">{zone.name}</h3>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-nums text-slate-900">{sz.priorityScore}</span>
            <span className="text-sm font-semibold text-slate-600">/100 priority</span>
          </div>

          <dl className="mt-2 space-y-1 text-sm text-slate-800">
            <div className="flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-slate-600" aria-hidden />
              <dt className="sr-only">Expected onset</dt>
              <dd>
                Onset: <strong>{sz.onset}</strong>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="shrink-0 text-slate-600" aria-hidden />
              <dt className="sr-only">Residents exposed</dt>
              <dd>
                <strong>{zone.populationExposure.toLocaleString('en-IN')}</strong> residents exposed
              </dd>
            </div>
            <div className="flex items-start gap-2">
              <Building2 size={14} className="mt-0.5 shrink-0 text-slate-600" aria-hidden />
              <dt className="sr-only">Critical asset at risk</dt>
              <dd>{zone.criticalAssetName}</dd>
            </div>
          </dl>

          <p className="mt-2 text-sm italic text-slate-700">“{zone.rankNote}”</p>

          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-navy-700">
            View action <ArrowRight size={15} aria-hidden />
          </span>
        </button>
      </article>
    </li>
  )
}
