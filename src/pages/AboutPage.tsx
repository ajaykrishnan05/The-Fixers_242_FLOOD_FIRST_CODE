import { CheckCircle2, CloudRain, Radio, Smartphone } from 'lucide-react'
import { PILOT_LOCATION } from '../data/demoData'

const roadmap = [
  { phase: 'Phase 2', title: 'Official IMD weather/nowcast integration', icon: CloudRain },
  { phase: 'Phase 3', title: 'Live rain-gauge and water-level sensor integration', icon: Radio },
  { phase: 'Phase 4', title: 'Field-worker validation reports and authorized public-alert delivery', icon: Smartphone },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-900">About FloodFirst</h1>
        <p className="mt-2 text-lg text-slate-800">
          FloodFirst helps disaster-control teams move from broad rainfall alerts to local, prioritized action before
          people are trapped.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-slate-900">The pilot</h2>
        <p className="text-slate-800">
          This demo is set in the <strong>{PILOT_LOCATION}</strong>. It is built for a ward-level disaster-control
          officer who needs one answer: which local hotspot needs the first response action in the next 1–3 hours.
        </p>
        <ul className="mt-3 space-y-1.5 text-slate-800">
          {['Hyperlocal inundation-risk map', 'Top-three hotspot ranking', 'Action recommendation card with bilingual resident alert'].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Roadmap</h2>
        <ol className="space-y-3">
          {roadmap.map(({ phase, title, icon: Icon }) => (
            <li key={phase} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">{phase}</p>
                <p className="font-semibold text-slate-900">{title}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 text-sm font-semibold text-slate-900">
        DEMO MODE — NOT AN OFFICIAL WARNING. All data shown is embedded mock data.
      </p>
    </div>
  )
}
