import { DEFAULT_SCENARIO, SCENARIOS } from '../data/demoData'
import type { ScenarioId } from '../types'

const SCENARIO_KEY = 'floodfirst.scenario'
const PREPARED_KEY = 'floodfirst.preparedAlerts'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable (private mode etc.) — app still works in-session */
  }
}

export function loadScenario(): ScenarioId {
  const v = read(SCENARIO_KEY)
  return SCENARIOS.some((s) => s.id === v) ? (v as ScenarioId) : DEFAULT_SCENARIO
}

export function saveScenario(id: ScenarioId) {
  write(SCENARIO_KEY, id)
}

/** Map of "scenario:zoneId" → ISO timestamp the alert was marked prepared. */
export type PreparedAlerts = Record<string, string>

export const preparedKey = (scenario: ScenarioId, zoneId: string) => `${scenario}:${zoneId}`

export function loadPrepared(): PreparedAlerts {
  const raw = read(PREPARED_KEY)
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const out: PreparedAlerts = {}
      for (const [k, v] of Object.entries(parsed)) if (typeof v === 'string') out[k] = v
      return out
    }
  } catch {
    /* ignore corrupt data */
  }
  return {}
}

export function savePrepared(p: PreparedAlerts) {
  write(PREPARED_KEY, JSON.stringify(p))
}
