import { CloudRain, Layers, Scale, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { SCENARIOS } from '../data/demoData'
import { PRIORITY_WEIGHTS, RISK_WEIGHTS } from '../lib/scoring'

const DISCLAIMER =
  'This is a hackathon decision-support prototype. It is not an official weather or evacuation warning. Production deployment requires validation with local authorities, official meteorological data, live drainage/water-level observations, and field verification.'

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
        {icon}
        {title}
      </h2>
      <div className="space-y-3 text-slate-800">{children}</div>
    </section>
  )
}

function Formula({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-navy-900 p-4 font-mono text-sm leading-relaxed text-sky-100">
      {children}
    </pre>
  )
}

export default function MethodologyPage() {
  const r = RISK_WEIGHTS
  const p = PRIORITY_WEIGHTS
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Methodology</h1>
        <p className="mt-1 text-slate-700">
          How FloodFirst turns a rainfall scenario into a ranked list of local hotspots. Every number on the dashboard
          comes from the transparent, deterministic formulas below — no AI calls, no hidden randomness.
        </p>
      </div>

      <Section icon={<Layers size={20} className="text-sky-700" aria-hidden />} title="What the score means">
        <p>
          The score is a <strong>relative inundation-risk estimate</strong> for each demo zone. It is{' '}
          <strong>not an exact water-depth prediction</strong>. It tells the officer which zones are more likely to
          waterlog first, so limited teams can be sent where they matter most.
        </p>
      </Section>

      <Section icon={<CloudRain size={20} className="text-sky-700" aria-hidden />} title="Step 1 — Inundation risk (0–100)">
        <p>Risk combines four inputs, each scaled 0–1:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Rainfall forecast</strong> (scenario factor, weight {r.rainfall * 100}%)
          </li>
          <li>
            <strong>Low elevation</strong> — how low the zone sits compared with its surroundings ({r.elevation * 100}%)
          </li>
          <li>
            <strong>Drainage proximity</strong> — closeness to, and condition of, canals and storm drains ({r.drainage * 100}%)
          </li>
          <li>
            <strong>Historical waterlogging</strong> — how often the zone flooded in the past ({r.history * 100}%)
          </li>
        </ul>
        <Formula>{`risk = 100 × (
  ${r.rainfall.toFixed(2)} × rainfallFactor
+ ${r.elevation.toFixed(2)} × elevationRisk
+ ${r.drainage.toFixed(2)} × drainageRisk
+ ${r.history.toFixed(2)} × historicalFloodRisk
)`}</Formula>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-1 text-left font-semibold">Rainfall factor by scenario</caption>
            <thead className="border-b border-slate-300 text-slate-600">
              <tr>
                <th className="py-1 pr-4">Scenario</th>
                <th className="py-1">Rainfall factor</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIOS.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-1 pr-4 font-medium">{s.label}</td>
                  <td className="py-1 tabular-nums">{s.rainfallFactor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-1 text-left font-semibold">Risk score → status, onset and confidence</caption>
            <thead className="border-b border-slate-300 text-slate-600">
              <tr>
                <th className="py-1 pr-4">Score</th>
                <th className="py-1 pr-4">Status</th>
                <th className="py-1 pr-4">Expected onset</th>
                <th className="py-1">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0–24', 'Low (green)', 'Monitor', 'Low'],
                ['25–49', 'Watch (yellow)', 'Within 1–3 hours', 'Medium'],
                ['50–74', 'High (orange)', 'Within 1–3 hours', 'Medium / High'],
                ['75–100', 'Severe (red)', 'Within 1 hour', 'High'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-slate-100">
                  {row.map((c, i) => (
                    <td key={i} className="py-1 pr-4">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={<Scale size={20} className="text-sky-700" aria-hidden />} title="Step 2 — Priority score (0–100)">
        <p>
          Risk alone does not decide who gets help first. Priority adds <strong>population exposure</strong> and{' '}
          <strong>critical-asset importance</strong> (hospital, school, shelter, underpass…) so response goes where harm
          would be greatest. The three highest-priority zones become the Priority Hotspots.
        </p>
        <Formula>{`priority = 100 × (
  ${p.risk.toFixed(2)} × normalizedFloodRisk   // risk ÷ 100
+ ${p.population.toFixed(2)} × populationScore
+ ${p.asset.toFixed(2)} × criticalAssetWeight
)`}</Formula>
      </Section>

      <Section icon={<TriangleAlert size={20} className="text-amber-600" aria-hidden />} title="Limits and disclaimer">
        <p>
          Zone boundaries, populations, asset weights and scores are illustrative demo values for the Gummidipundi Ward
          Cluster. No live weather, drainage or sensor data is used. The map uses public OpenStreetMap tiles only.
        </p>
        <p className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 font-semibold text-slate-900">{DISCLAIMER}</p>
      </Section>
    </div>
  )
}
