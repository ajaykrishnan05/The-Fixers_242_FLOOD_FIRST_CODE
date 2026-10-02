import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { Bus, Hospital, House, School, TrainFront, Waves } from 'lucide-react'
import type { AssetType } from '../types'

const ICONS = { hospital: Hospital, school: School, shelter: House, underpass: TrainFront, bus_stand: Bus, canal: Waves }

export function AssetGlyph({ type, size = 14 }: { type: AssetType; size?: number }) {
  const Icon = ICONS[type]
  return <Icon size={size} strokeWidth={2.2} aria-hidden />
}

const cache = new Map<AssetType, L.DivIcon>()

export function leafletAssetIcon(type: AssetType): L.DivIcon {
  let icon = cache.get(type)
  if (!icon) {
    icon = L.divIcon({
      className: 'ff-asset-icon',
      html: `<span>${renderToStaticMarkup(<AssetGlyph type={type} />)}</span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -12],
    })
    cache.set(type, icon)
  }
  return icon
}
