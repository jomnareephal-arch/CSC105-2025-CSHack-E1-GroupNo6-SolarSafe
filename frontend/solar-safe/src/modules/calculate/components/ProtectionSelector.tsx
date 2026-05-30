import type { ProtectionItemType, ProtectionConfigItem } from '../types/calculate.types'

const panelCls = 'bg-amber-50/70 backdrop-blur-sm border-2 border-amber-300/60 rounded-2xl'
const activeBorder = 'border-amber-800 shadow-[0_0_0_2px_rgba(120,53,15,0.18)]'
const inactiveBorder = 'border-amber-200 hover:border-amber-500'

interface Props {
  config: ProtectionConfigItem[]
  selectedValues: Map<ProtectionItemType, number>
  noneSelected: boolean
  onToggle: (type: ProtectionItemType) => void
  onSelectNone: () => void
}

export default function ProtectionSelector({ config, selectedValues, noneSelected, onToggle, onSelectNone }: Props) {
  return (
    <div>
      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow mb-1">
        3. Choose Protection
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onSelectNone}
          className={`${panelCls} flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all bg-white/50
            ${noneSelected ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
        >
          <span className="text-3xl">🚫</span>
          <span className="text-xs font-bold text-amber-800">None</span>
        </button>
        {config.map(item => (
          <button
            key={item.type}
            onClick={() => onToggle(item.type as ProtectionItemType)}
            className={`${panelCls} flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all bg-white/50
              ${selectedValues.has(item.type) ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-xs font-bold text-amber-900">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
