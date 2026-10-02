export type ScenarioId = 'normal' | 'moderate' | 'heavy' | 'extreme'
export type RiskStatus = 'Low' | 'Watch' | 'High' | 'Severe'
export type Confidence = 'Low' | 'Medium' | 'High'
export type AssetType = 'hospital' | 'school' | 'shelter' | 'underpass' | 'bus_stand' | 'canal'
export type ActionCategory =
  | 'pump-dispatch'
  | 'drain-clearing'
  | 'barricade'
  | 'facility-notification'
  | 'rescue-prepositioning'
  | 'resident-warning'

export interface PolygonGeometry {
  type: 'Polygon'
  /** GeoJSON order: [longitude, latitude] */
  coordinates: number[][][]
}

export interface Zone {
  id: string
  name: string
  nameTa: string
  geometry: PolygonGeometry
  center: { lat: number; lng: number }
  elevationRisk: number
  drainageRisk: number
  historicalFloodRisk: number
  populationExposure: number
  populationScore: number
  criticalAssetName: string
  criticalAssetType: AssetType
  criticalAssetWeight: number
  landmark: string
  landmarkTa: string
  baseConfidence: Confidence
  actionCategory: ActionCategory
  driverNotes: { elevation: string; drainage: string; history: string }
  rankNote: string
}

export interface Scenario {
  id: ScenarioId
  label: string
  rainfallFactor: number
  description: string
}

export interface RiskDriver {
  key: 'rainfall' | 'elevation' | 'drainage' | 'history'
  label: string
  /** Points contributed to the 0–100 risk score. */
  points: number
  maxPoints: number
  detail: string
}

export interface ScoredZone {
  zone: Zone
  riskScore: number
  status: RiskStatus
  priorityScore: number
  onset: string
  confidence: Confidence
  drivers: RiskDriver[]
}

export interface MapAsset {
  id: string
  name: string
  type: AssetType
  position: { lat: number; lng: number }
}
