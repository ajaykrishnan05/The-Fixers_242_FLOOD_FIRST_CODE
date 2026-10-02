import { useCallback, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import ActionRecommendationCard from '../components/ActionRecommendationCard'
import AssetKey from '../components/AssetKey'
import FloodRiskMap, { type FocusRequest } from '../components/FloodRiskMap'
import HotspotRanking from '../components/HotspotRanking'
import HowItWorks from '../components/HowItWorks'
import ScenarioSelector from '../components/ScenarioSelector'
import { PILOT_LOCATION } from '../data/demoData'
import { scoreAllZones, topHotspots } from '../lib/scoring'
import {
  loadPrepared,
  loadScenario,
  preparedKey,
  savePrepared,
  saveScenario,
  type PreparedAlerts,
} from '../lib/storage'
import type { ScenarioId } from '../types'

export default function Dashboard() {
  const [scenario, setScenario] = useState<ScenarioId>(loadScenario)
  const [prepared, setPrepared] = useState<PreparedAlerts>(loadPrepared)
  // null = user has not chosen a zone yet, so the card follows the #1 hotspot.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focus, setFocus] = useState<FocusRequest | null>(null)

  const scored = useMemo(() => scoreAllZones(scenario), [scenario])
  const hotspots = useMemo(() => topHotspots(scored), [scored])
  const effectiveId = selectedId ?? hotspots[0]?.zone.id ?? null
  const selected = scored.find((s) => s.zone.id === effectiveId) ?? null
  const preparedAt = selected ? (prepared[preparedKey(scenario, selected.zone.id)] ?? null) : null

  const changeScenario = useCallback((id: ScenarioId) => {
    setScenario(id)
    saveScenario(id)
  }, [])

  const selectZone = useCallback((id: string) => setSelectedId(id), [])

  const selectHotspot = useCallback((id: string) => {
    setSelectedId(id)
    setFocus((f) => ({ zoneId: id, nonce: (f?.nonce ?? 0) + 1 }))
  }, [])

  const updatePrepared = (next: PreparedAlerts) => {
    setPrepared(next)
    savePrepared(next)
  }

  const markPrepared = () => {
    if (!selected) return
    updatePrepared({ ...prepared, [preparedKey(scenario, selected.zone.id)]: new Date().toISOString() })
  }

  const clearPrepared = () => {
    if (!selected) return
    const next = { ...prepared }
    delete next[preparedKey(scenario, selected.zone.id)]
    updatePrepared(next)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
          Which local hotspot needs the first response action in the next 1–3 hours?
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
          <MapPin size={14} aria-hidden /> {PILOT_LOCATION} · Ward-level disaster-control view
        </p>
      </div>

      <HowItWorks />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="lg:col-start-1 lg:row-start-1">
          <ScenarioSelector value={scenario} onChange={changeScenario} />
        </div>

        <div className="space-y-2 lg:col-start-1 lg:row-start-2">
          <FloodRiskMap scored={scored} selectedId={effectiveId} onSelect={selectZone} focus={focus} />
          <AssetKey />
        </div>

        <aside className="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
          <HotspotRanking hotspots={hotspots} selectedId={effectiveId} onSelect={selectHotspot} />
        </aside>

        <div className="lg:col-start-1 lg:row-start-3">
          <ActionRecommendationCard
            sz={selected}
            scenario={scenario}
            preparedAt={preparedAt}
            onPrepare={markPrepared}
            onClearPrepared={clearPrepared}
          />
        </div>
      </div>
    </div>
  )
}
