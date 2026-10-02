import { ArrowRight } from 'lucide-react'

const steps = ['Forecast rainfall + terrain + drain proximity + historical hotspots', 'inundation risk', 'priority hotspots', 'recommended response']

export default function HowItWorks() {
  return (
    <section
      className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-800"
      aria-label="How it works"
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <strong className="text-sky-900">How it works:</strong>
        {steps.map((s, i) => (
          <span key={s} className="inline-flex items-center gap-2">
            {s}
            {i < steps.length - 1 && <ArrowRight size={14} className="text-sky-700" aria-hidden />}
          </span>
        ))}
        .
      </p>
    </section>
  )
}
