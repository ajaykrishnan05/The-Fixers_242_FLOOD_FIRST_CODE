import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { Crosshair } from 'lucide-react'
import { ASSET_TYPE_LABELS, CANAL_LINE, MAP_ASSETS, MAP_BOUNDS } from '../data/demoData'
import { RISK_COLORS } from '../lib/risk'
import { topDrivers } from '../lib/scoring'
import type { ScoredZone } from '../types'
import { leafletAssetIcon } from './assetIcons'
import RiskBadge from './RiskBadge'
import RiskLegend from './RiskLegend'

export interface FocusRequest {
  zoneId: string
  nonce: number
}

interface Props {
  scored: ScoredZone[]
  selectedId: string | null
  onSelect: (id: string) => void
  focus: FocusRequest | null
}

const toLatLngs = (sz: ScoredZone): L.LatLngTuple[] =>
  sz.zone.geometry.coordinates[0].map(([lng, lat]) => [lat, lng] as L.LatLngTuple)

function MapController({ scored, focus }: { scored: ScoredZone[]; focus: FocusRequest | null }) {
  const map = useMap()
  const scoredRef = useRef(scored)
  scoredRef.current = scored

  useEffect(() => {
    if (!focus) return
    const sz = scoredRef.current.find((s) => s.zone.id === focus.zoneId)
    if (sz) map.flyToBounds(L.latLngBounds(toLatLngs(sz)), { padding: [60, 60], maxZoom: 16, duration: 0.8 })
  }, [focus, map])

  useEffect(() => {
    const el = map.getContainer()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(el)
    return () => ro.disconnect()
  }, [map])

  return null
}

function ResetViewButton() {
  const map = useMap()
  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'none' }}>
      <div className="leaflet-control" style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          onClick={() => map.flyToBounds(MAP_BOUNDS, { padding: [24, 24], duration: 0.8 })}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md hover:bg-slate-50"
        >
          <Crosshair size={14} aria-hidden /> Reset view
        </button>
      </div>
    </div>
  )
}

function ZonePolygon({
  sz,
  selected,
  onSelect,
}: {
  sz: ScoredZone
  selected: boolean
  onSelect: (id: string) => void
}) {
  const ref = useRef<L.Polygon>(null)
  const colors = RISK_COLORS[sz.status]

  useEffect(() => {
    if (selected) ref.current?.bringToFront()
  }, [selected])

  return (
    <Polygon
      ref={ref}
      positions={toLatLngs(sz)}
      pathOptions={{
        color: selected ? '#0b1736' : colors.stroke,
        weight: selected ? 4 : 1.5,
        fillColor: colors.fill,
        fillOpacity: selected ? 0.72 : 0.5,
      }}
      eventHandlers={{
        click: () => onSelect(sz.zone.id),
        mouseover: (e) => {
          if (!selected) (e.target as L.Polygon).setStyle({ fillOpacity: 0.68, weight: 2.5 })
        },
        mouseout: (e) => {
          if (!selected) (e.target as L.Polygon).setStyle({ fillOpacity: 0.5, weight: 1.5 })
        },
      }}
    >
      <Tooltip sticky direction="top">
        <strong>{sz.zone.name}</strong> · {sz.status} ({sz.riskScore})
      </Tooltip>
      <Popup minWidth={240} maxWidth={300}>
        <div className="space-y-2 text-sm text-slate-800">
          <h3 className="text-base font-bold leading-tight text-slate-900">{sz.zone.name}</h3>
          <RiskBadge status={sz.status} score={sz.riskScore} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt className="text-slate-600">Expected onset</dt>
            <dd className="font-semibold">{sz.onset}</dd>
            <dt className="text-slate-600">Confidence</dt>
            <dd className="font-semibold">{sz.confidence}</dd>
          </dl>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Top risk drivers</p>
            <ul className="ml-4 list-disc">
              {topDrivers(sz.drivers).map((d) => (
                <li key={d.key}>
                  {d.label} <span className="text-slate-600">(+{Math.round(d.points)})</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs italic text-slate-600">Demo decision-support estimate</p>
        </div>
      </Popup>
    </Polygon>
  )
}

export default function FloodRiskMap({ scored, selectedId, onSelect, focus }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-slate-200 shadow-sm">
      <MapContainer
        bounds={MAP_BOUNDS}
        boundsOptions={{ padding: [24, 24] }}
        scrollWheelZoom
        className="h-[420px] w-full sm:h-[520px] lg:h-[560px]"
        aria-label="Inundation-risk map of Gummidipundi ward cluster"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapController scored={scored} focus={focus} />
        <ResetViewButton />

        {scored.map((sz) => (
          <ZonePolygon key={sz.zone.id} sz={sz} selected={sz.zone.id === selectedId} onSelect={onSelect} />
        ))}

        <Polyline positions={CANAL_LINE} pathOptions={{ color: '#0369a1', weight: 4, opacity: 0.85, dashArray: '2 8', lineCap: 'round' }} interactive={false} />

        {MAP_ASSETS.map((a) => (
          <Marker key={a.id} position={[a.position.lat, a.position.lng]} icon={leafletAssetIcon(a.type)} keyboard={false}>
            <Tooltip direction="top" offset={[0, -10]}>
              <strong>{a.name}</strong>
              <br />
              {ASSET_TYPE_LABELS[a.type]}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-6 left-3 z-[500]">
        <RiskLegend />
      </div>
      <div className="pointer-events-none absolute left-3 top-24 z-[500] rounded-md bg-navy-900/90 px-2.5 py-1 text-xs font-semibold text-white shadow">
        Demo decision-support estimate
      </div>
    </div>
  )
}
