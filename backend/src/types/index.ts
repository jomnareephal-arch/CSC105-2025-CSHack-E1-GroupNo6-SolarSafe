export type SkinType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'
export type TimeSlot =
  | '06:00' | '07:00' | '08:00' | '09:00' | '10:00' | '11:00'
  | '12:00' | '13:00' | '14:00' | '15:00' | '16:00' | '17:00'
  | '18:00'

export type UVLevel = 'none' | 'low' | 'moderate' | 'high' | 'very_high' | 'extreme'

export interface UVDataPoint {
  hour: number
  uvIndex: number
  level: UVLevel
}

export interface Activity {
  id: string
  name: string
  dayId: string
  recommendedStart?: number
  recommendedEnd?: number
  reason?: string
  createdAt: string
}

export interface Day {
  id: string
  date: string
  uvData: UVDataPoint[]
  activities: Activity[]
}

export interface ProtectiveEquipment {
  maxUV: number
  level: string
  items: string[]
  warning?: string
}

export interface ProtectionComponent {
  type: string
  spf?: number
  upf?: number
  hat_factor?: number
  umbrella_factor?: number
  glass_factor?: number
}
