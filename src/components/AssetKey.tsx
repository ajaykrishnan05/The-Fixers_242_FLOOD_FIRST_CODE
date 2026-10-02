import { ASSET_TYPE_LABELS } from '../data/demoData'
import type { AssetType } from '../types'
import { AssetGlyph } from './assetIcons'

const TYPES = Object.keys(ASSET_TYPE_LABELS) as AssetType[]

export default function AssetKey() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700" aria-label="Asset marker key">
      {TYPES.map((t) => (
        <li key={t} className="inline-flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-white">
            <AssetGlyph type={t} size={11} />
          </span>
          {ASSET_TYPE_LABELS[t]}
        </li>
      ))}
    </ul>
  )
}
