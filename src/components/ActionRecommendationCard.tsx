import { useEffect, useState } from 'react'
import { BellRing, CheckCircle2, Clock, Languages, MapPin, RotateCcw, ShieldAlert, Siren, Users } from 'lucide-react'
import { ESTIMATE_LABEL } from '../data/demoData'
import { actionDeadline, recommendActions } from '../lib/actions'
import { englishAlert, tamilAlert } from '../lib/alerts'
import { getScenario } from '../lib/scoring'
import type { ScenarioId, ScoredZone } from '../types'
import RiskBadge from './RiskBadge'

interface Props {
  sz: ScoredZone | null
  scenario: ScenarioId
  preparedAt: string | null
  onPrepare: () => void
  onClearPrepared: () => void
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function ActionRecommendationCard({ sz, scenario, preparedAt, onPrepare, onClearPrepared }: Props) {
  const [generated, setGenerated] = useState(false)
  const zoneId = sz?.zone.id

  // A fresh zone or scenario starts with the alert hidden again.
  useEffect(() => setGenerated(false), [zoneId, scenario])

  if (!sz) {
    return (
      <section
        className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center text-slate-600"
        aria-live="polite"
      >
        <MapPin className="mx-auto mb-2 text-slate-400" size={28} aria-hidden />
        <p className="font-semibold text-slate-800">No hotspot selected</p>
        <p className="text-sm">Click a zone on the map or a Priority Hotspot to see the recommended response.</p>
      </section>
    )
  }

  const { zone } = sz
  const actions = recommendActions(sz)
  const monitorOnly = sz.status === 'Low'
  const showAlert = generated || preparedAt !== null
  const scenarioLabel = getScenario(scenario).label
  const headerTone =
    sz.status === 'Severe' ? 'bg-red-600' : sz.status === 'High' ? 'bg-orange-600' : sz.status === 'Watch' ? 'bg-yellow-500 !text-slate-900' : 'bg-green-700'

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md" aria-labelledby="action-heading" aria-live="polite">
      <div className={`flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-white ${headerTone}`}>
        <h2 id="action-heading" className="flex items-center gap-2 text-lg font-extrabold sm:text-xl">
          <Siren size={22} aria-hidden />
          {monitorOnly ? 'Monitor — no action required yet' : `Action required within ${actionDeadline(sz)}`}
        </h2>
        <span className="rounded bg-black/20 px-2 py-0.5 text-xs font-semibold">{ESTIMATE_LABEL}</span>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Selected zone · {scenarioLabel}</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{zone.name}</h3>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-slate-600">Risk</dt>
              <dd className="mt-0.5">
                <RiskBadge status={sz.status} score={sz.riskScore} />
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Expected onset</dt>
              <dd className="font-bold text-slate-900">{sz.onset}</dd>
            </div>
            <div>
              <dt className="text-slate-600">Confidence</dt>
              <dd className="font-bold text-slate-900">{sz.confidence}</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
              <ShieldAlert size={18} className="text-orange-600" aria-hidden /> Why this is at risk
            </h4>
            <ul className="space-y-2 text-sm text-slate-800">
              {[...sz.drivers]
                .sort((a, b) => (a.key === 'rainfall' ? -1 : b.key === 'rainfall' ? 1 : b.points - a.points))
                .map((d) => (
                  <li key={d.key} className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy-700" aria-hidden />
                    <span>
                      <strong>{d.label}:</strong> {d.detail}{' '}
                      <span className="whitespace-nowrap text-slate-600">
                        (+{Math.round(d.points)}/{d.maxPoints} pts)
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
              <Users size={18} className="text-sky-700" aria-hidden /> People and assets at risk
            </h4>
            <ul className="space-y-2 text-sm text-slate-800">
              <li>
                <strong>{zone.populationExposure.toLocaleString('en-IN')}</strong> residents in the zone
              </li>
              <li>
                Critical asset: <strong>{zone.criticalAssetName}</strong>
              </li>
              <li>
                Access route to protect: <strong>{zone.landmark}</strong>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <Clock size={14} aria-hidden /> Priority score {sz.priorityScore}/100
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-bold text-slate-900">Recommended response</h4>
          <ol className="grid gap-3 md:grid-cols-3">
            {actions.map((a, i) => (
              <li key={a.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-bold text-slate-900">{a.title}</p>
                <p className="mt-1 text-sm text-slate-700">{a.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setGenerated(true)}
              disabled={showAlert}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-navy-700 disabled:cursor-default disabled:opacity-60"
            >
              <Languages size={16} aria-hidden /> Generate Resident Alert
            </button>
            {showAlert && preparedAt === null && (
              <button
                type="button"
                onClick={onPrepare}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-emerald-800"
              >
                <BellRing size={16} aria-hidden /> Mark Alert Prepared
              </button>
            )}
          </div>

          {showAlert && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Simulated resident alert — not sent through any notification service
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <article className="rounded-lg border border-slate-300 bg-white p-3">
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-600">English</h5>
                  <p className="text-sm leading-relaxed text-slate-900">{englishAlert(zone)}</p>
                </article>
                <article className="rounded-lg border border-slate-300 bg-white p-3" lang="ta">
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-600">தமிழ் (Tamil)</h5>
                  <p className="text-sm leading-relaxed text-slate-900">{tamilAlert(zone)}</p>
                </article>
              </div>
            </div>
          )}

          {preparedAt !== null && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 p-3" role="status">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={28} className="shrink-0 text-emerald-700" aria-hidden />
                <div>
                  <p className="font-extrabold text-emerald-900">Alert prepared for local dissemination</p>
                  <p className="text-xs text-emerald-900/80">
                    {zone.name} · {scenarioLabel} {formatTime(preparedAt) && `· saved ${formatTime(preparedAt)}`} · saved on this device only
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearPrepared}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 underline-offset-2 hover:underline"
              >
                <RotateCcw size={12} aria-hidden /> Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
