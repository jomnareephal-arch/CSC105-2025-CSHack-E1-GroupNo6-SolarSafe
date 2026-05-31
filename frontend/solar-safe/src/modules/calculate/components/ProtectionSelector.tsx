import type { ProtectionItemType, ProtectionConfigItem } from '../types/calculate.types'
import type { Product, ProductCategory } from '../../ProductRecommend/types/productRecommend.type'

const PROT_TO_CATEGORY: Record<ProtectionItemType, ProductCategory> = {
  hat:        'hats',
  sunscreen:  'sunscreen',
  sunglasses: 'sunglasses',
  umbrella:   'umbrella',
  uvJacket:   'uv-jacket',
}

const panelCls = 'bg-amber-50/70 backdrop-blur-sm border-2 border-amber-300/60 rounded-xl'
const activeBorder = 'border-amber-800 shadow-[0_0_0_2px_rgba(120,53,15,0.18)]'
const inactiveBorder = 'border-amber-200 hover:border-amber-500'

interface Props {
  config: ProtectionConfigItem[]
  selectedProducts: Map<ProductCategory, Product>
  noneSelected: boolean
  onChoose: (type: ProtectionItemType) => void
  onSelectNone: () => void
}

export default function ProtectionSelector({ config, selectedProducts, noneSelected, onChoose, onSelectNone }: Props) {
  return (
    <div>
      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow mb-2">
        3. Choose Protection
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* None button */}
        <button
          onClick={onSelectNone}
          className={`${panelCls} flex flex-col items-center justify-center gap-1 py-3 border-2 transition-all bg-white/50
            ${noneSelected ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
        >
          <span className="text-3xl">🚫</span>
          <span className="text-xs font-bold text-amber-800">None</span>
        </button>

        {/* Protection items */}
        {config.map(item => {
          const category = PROT_TO_CATEGORY[item.type as ProtectionItemType]
          const selected = selectedProducts.get(category)
          const isActive = !!selected

          return (
            <button
              key={item.type}
              onClick={() => onChoose(item.type as ProtectionItemType)}
              className={`${panelCls} flex flex-col items-center justify-center gap-1 py-3 border-2 transition-all bg-white/50 active:scale-95
                ${isActive ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-xs font-bold text-amber-900">{item.label}</span>
              {isActive ? (
                <span className="text-[10px] text-green-700 font-semibold px-1 text-center line-clamp-1 leading-tight">
                  ✓ {selected!.rating.standard} {selected!.rating.value}{selected!.rating.plus ? '+' : ''}
                </span>
              ) : (
                <span className="text-[10px] text-gray-400 italic">Tap to choose</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { PROT_TO_CATEGORY }
