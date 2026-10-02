import type { ActionCategory, ScoredZone } from '../types'

export interface RecommendedAction {
  title: string
  detail: string
}

/**
 * Exactly three recommendations per zone. The zone's action category sets the
 * lead action; the other two come from a fixed support set so every zone gets
 * a concrete, checkable trio.
 */
export function recommendActions(sz: ScoredZone): [RecommendedAction, RecommendedAction, RecommendedAction] {
  const { zone, status } = sz
  const urgent = status === 'Severe' ? 'Immediately' : status === 'High' ? 'Within 1 hour' : 'Before rain peaks'
  const asset = zone.criticalAssetName

  const lib: Record<ActionCategory, RecommendedAction> = {
    'pump-dispatch': {
      title: 'Dispatch drainage / pump team',
      detail: `${urgent}: send a mobile pump unit to ${zone.landmark} and keep it on standby for de-watering.`,
    },
    'drain-clearing': {
      title: 'Inspect and clear nearby storm-water drain',
      detail: `${urgent}: clear silt and debris from drains and culverts around ${zone.landmark} to keep water moving.`,
    },
    barricade: {
      title: `Barricade ${zone.landmark}`,
      detail: `${urgent}: place barricades and a traffic marshal so vehicles do not enter if water rises.`,
    },
    'facility-notification': {
      title: 'Notify facility administration',
      detail: `Call the in-charge of ${asset} now so staff can plan for blocked access and move equipment or records to higher ground.`,
    },
    'rescue-prepositioning': {
      title: 'Pre-position rescue team',
      detail: `Station a rescue team with boats/ropes near ${zone.landmark} so they can reach residents quickly if the area is cut off.`,
    },
    'resident-warning': {
      title: 'Warn residents in affected streets',
      detail: `Send door-to-door and loudspeaker warnings for ${zone.landmark}; advise moving valuables and medicines to a safe height.`,
    },
  }

  const lead = lib[zone.actionCategory]
  const support: ActionCategory[] = [
    'drain-clearing',
    'resident-warning',
    'rescue-prepositioning',
    'facility-notification',
    'pump-dispatch',
    'barricade',
  ]
  const rest = support.filter((c) => c !== zone.actionCategory).slice(0, 2)
  return [lead, lib[rest[0]], lib[rest[1]]]
}

export function actionDeadline(sz: ScoredZone): string {
  switch (sz.status) {
    case 'Severe':
      return '1 hour'
    case 'High':
    case 'Watch':
      return '1–3 hours'
    default:
      return 'monitoring window'
  }
}
