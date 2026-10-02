import { CloudRain, Clock, RefreshCw } from 'lucide-react'
import { FORECAST_WINDOW, SCENARIOS } from '../data/demoData'
import type { ScenarioId } from '../types'

interface Props {
  value: ScenarioId
  onChange: (id: ScenarioId) => void
}

export default function ScenarioSelector({ value, onChange }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-labelledby="scenario-heading">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <h2 id="scenario-heading" className="flex items-center gap-2 text-base font-bold text-slate-900">
          <CloudRain size={18} className="text-sky-700" aria-hidden />
          Rainfall scenario
        </h2>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700">
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw size={14} aria-hidden /> Last updated: <strong>Just now</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden /> Forecast window: <strong>{FORECAST_WINDOW}</strong>
          </span>
        </p>
      </div>
      <div role="radiogroup" aria-labelledby="scenario-heading" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SCENARIOS.map((s) => {
          const active = s.id === value
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(s.id)}
              className={`rounded-lg border-2 px-3 py-2.5 text-left transition-colors ${
                active
                  ? 'border-navy-900 bg-navy-900 text-white shadow'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="block text-sm font-bold sm:text-base">{s.label}</span>
              <span className={`block text-xs ${active ? 'text-slate-300' : 'text-slate-600'}`}>{s.description}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
