import { ListOrdered } from 'lucide-react'
import { ESTIMATE_LABEL } from '../data/demoData'
import type { ScoredZone } from '../types'
import HotspotCard from './HotspotCard'

interface Props {
  hotspots: ScoredZone[] // exactly three, ranked
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function HotspotRanking({ hotspots, selectedId, onSelect }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm" aria-labelledby="hotspots-heading">
      <h2 id="hotspots-heading" className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <ListOrdered size={20} className="text-navy-700" aria-hidden />
        Priority Hotspots
      </h2>
      <p className="mb-3 text-xs text-slate-600">
        Ranked by flood risk, residents exposed and critical assets · {ESTIMATE_LABEL}
      </p>
      <ol className="space-y-3">
        {hotspots.map((sz, i) => (
          <HotspotCard key={sz.zone.id} rank={i + 1} sz={sz} selected={sz.zone.id === selectedId} onSelect={onSelect} />
        ))}
      </ol>
    </section>
  )
}
