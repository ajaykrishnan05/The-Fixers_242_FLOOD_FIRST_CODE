import type { AssetType, MapAsset, Scenario } from '../types'
import { ZONES } from './zones'

export { ZONES }

export const MAP_CENTER = { lat: 13.4075, lng: 80.109 }
/** South-west / north-east corners framing all 12 zones. */
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [13.3945, 80.0906],
  [13.4195, 80.1274],
]

export const PILOT_LOCATION = 'Gummidipundi Ward Cluster, Tamil Nadu, India'
export const FORECAST_WINDOW = 'Next 1–3 hours'
export const ESTIMATE_LABEL = 'Demo decision-support estimate'

export const SCENARIOS: Scenario[] = [
  { id: 'normal', label: 'Normal Rain', rainfallFactor: 0.15, description: 'Light, routine rainfall' },
  { id: 'moderate', label: 'Moderate Rain', rainfallFactor: 0.4, description: 'Steady rain, drains under load' },
  { id: 'heavy', label: 'Heavy Rain', rainfallFactor: 0.75, description: 'Intense spell, waterlogging likely' },
  { id: 'extreme', label: 'Extreme Rain', rainfallFactor: 1.0, description: 'Cloudburst-level intensity' },
]

export const DEFAULT_SCENARIO = 'moderate' as const

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  hospital: 'Government Hospital / PHC',
  school: 'Government School',
  shelter: 'Emergency Shelter',
  underpass: 'Railway Underpass',
  bus_stand: 'Bus Stand Junction',
  canal: 'Drainage Canal',
}

/** Where each zone's critical asset sits, nudged slightly off the zone centre. */
const OFFSETS: Record<string, { lat: number; lng: number }> = {
  'canal-side-settlement': { lat: 0.0012, lng: -0.0014 },
  'government-hospital-access-road': { lat: 0.0010, lng: 0.0012 },
  'railway-underpass': { lat: -0.0010, lng: 0.0010 },
}

export const MAP_ASSETS: MapAsset[] = ZONES.map((z) => {
  const o = OFFSETS[z.id] ?? { lat: 0.0008, lng: 0.0008 }
  return {
    id: `asset-${z.id}`,
    name: z.criticalAssetName,
    type: z.criticalAssetType,
    position: { lat: z.center.lat + o.lat, lng: z.center.lng + o.lng },
  }
})

/** Illustrative canal alignment (lat, lng) running north–south through the east-centre of the cluster. */
export const CANAL_LINE: [number, number][] = [
  [13.4195, 80.1128],
  [13.4150, 80.1142],
  [13.4108, 80.1128],
  [13.4072, 80.1146],
  [13.4030, 80.1136],
  [13.3990, 80.1126],
  [13.3945, 80.1134],
]
