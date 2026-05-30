export interface ProtectionItemConfig {
  type: string
  label: string
  icon: string
  field: string
}

export const PROTECTION_CONFIG: ProtectionItemConfig[] = [
  { type: 'sunscreen',  label: 'Sunscreen',  icon: '🧴', field: 'spf'             },
  { type: 'uvJacket',   label: 'UV Jacket',  icon: '🧥', field: 'upf'             },
  { type: 'hat',        label: 'Hat',        icon: '🎩', field: 'hat_factor'      },
  { type: 'umbrella',   label: 'Umbrella',   icon: '☂️', field: 'umbrella_factor' },
  { type: 'sunglasses', label: 'Sunglasses', icon: '🕶️', field: 'glass_factor'   },
]
