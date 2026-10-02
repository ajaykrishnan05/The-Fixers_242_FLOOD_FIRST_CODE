import { SCENARIOS, ZONES } from '../data/demoData'
import type { Confidence, RiskDriver, RiskStatus, ScenarioId, ScoredZone, Zone } from '../types'

export const RISK_WEIGHTS = { rainfall: 0.4, elevation: 0.2, drainage: 0.2, history: 0.2 } as const
export const PRIORITY_WEIGHTS = { risk: 0.5, population: 0.3, asset: 0.2 } as const

export function getScenario(id: ScenarioId) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[1]
}

/** Risk score (0–100) — deterministic, no randomness. */
export function riskScore(zone: Zone, rainfallFactor: number): number {
  return Math.round(
    100 *
      (RISK_WEIGHTS.rainfall * rainfallFactor +
        RISK_WEIGHTS.elevation * zone.elevationRisk +
        RISK_WEIGHTS.drainage * zone.drainageRisk +
        RISK_WEIGHTS.history * zone.historicalFloodRisk),
  )
}

/** Priority score (0–100). Uses the rounded risk score so displayed numbers stay consistent. */
export function priorityScore(zone: Zone, risk: number): number {
  return Math.round(
    100 *
      (PRIORITY_WEIGHTS.risk * (risk / 100) +
        PRIORITY_WEIGHTS.population * zone.populationScore +
        PRIORITY_WEIGHTS.asset * zone.criticalAssetWeight),
  )
}

export function riskStatus(score: number): RiskStatus {
  if (score >= 75) return 'Severe'
  if (score >= 50) return 'High'
  if (score >= 25) return 'Watch'
  return 'Low'
}

export function onsetFor(status: RiskStatus): string {
  switch (status) {
    case 'Severe':
      return 'Within 1 hour'
    case 'High':
    case 'Watch':
      return 'Within 1–3 hours'
    default:
      return 'Monitor'
  }
}

export function confidenceFor(status: RiskStatus, base: Confidence): Confidence {
  switch (status) {
    case 'Severe':
      return 'High'
    case 'High':
      return base === 'High' ? 'High' : 'Medium'
    case 'Watch':
      return 'Medium'
    default:
      return 'Low'
  }
}

function level(v: number): string {
  return v >= 0.7 ? 'high' : v >= 0.45 ? 'moderate' : 'low'
}

export function buildDrivers(zone: Zone, rainfallFactor: number, scenarioLabel: string): RiskDriver[] {
  const rainLevel = rainfallFactor >= 0.75 ? 'intense' : rainfallFactor >= 0.4 ? 'steady' : 'light'
  return [
    {
      key: 'rainfall',
      label: 'Rainfall forecast',
      points: 100 * RISK_WEIGHTS.rainfall * rainfallFactor,
      maxPoints: 100 * RISK_WEIGHTS.rainfall,
      detail: `${scenarioLabel} scenario — ${rainLevel} rainfall expected in the next 1–3 hours`,
    },
    {
      key: 'elevation',
      label: 'Low elevation',
      points: 100 * RISK_WEIGHTS.elevation * zone.elevationRisk,
      maxPoints: 100 * RISK_WEIGHTS.elevation,
      detail: `${zone.driverNotes.elevation} (${level(zone.elevationRisk)} terrain risk)`,
    },
    {
      key: 'drainage',
      label: 'Drainage proximity',
      points: 100 * RISK_WEIGHTS.drainage * zone.drainageRisk,
      maxPoints: 100 * RISK_WEIGHTS.drainage,
      detail: `${zone.driverNotes.drainage} (${level(zone.drainageRisk)} drainage risk)`,
    },
    {
      key: 'history',
      label: 'Historical waterlogging',
      points: 100 * RISK_WEIGHTS.history * zone.historicalFloodRisk,
      maxPoints: 100 * RISK_WEIGHTS.history,
      detail: `${zone.driverNotes.history} (${level(zone.historicalFloodRisk)} history)`,
    },
  ]
}

export function scoreZone(zone: Zone, scenarioId: ScenarioId): ScoredZone {
  const scenario = getScenario(scenarioId)
  const risk = riskScore(zone, scenario.rainfallFactor)
  const status = riskStatus(risk)
  return {
    zone,
    riskScore: risk,
    status,
    priorityScore: priorityScore(zone, risk),
    onset: onsetFor(status),
    confidence: confidenceFor(status, zone.baseConfidence),
    drivers: buildDrivers(zone, scenario.rainfallFactor, scenario.label),
  }
}

export function scoreAllZones(scenarioId: ScenarioId): ScoredZone[] {
  return ZONES.map((z) => scoreZone(z, scenarioId))
}

/** Highest priority first; risk score then name break ties so ordering is stable. */
export function rankZones(scored: ScoredZone[]): ScoredZone[] {
  return [...scored].sort(
    (a, b) =>
      b.priorityScore - a.priorityScore ||
      b.riskScore - a.riskScore ||
      a.zone.name.localeCompare(b.zone.name),
  )
}

export function topHotspots(scored: ScoredZone[]): ScoredZone[] {
  return rankZones(scored).slice(0, 3)
}

/** Top-N drivers by points contributed. */
export function topDrivers(drivers: RiskDriver[], n = 3): RiskDriver[] {
  return [...drivers].sort((a, b) => b.points - a.points).slice(0, n)
}
