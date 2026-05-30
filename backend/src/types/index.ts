export type SkinType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'
export type TimeSlot =
  | '06:00' | '07:00' | '08:00' | '09:00' | '10:00' | '11:00'
  | '12:00' | '13:00' | '14:00' | '15:00' | '16:00' | '17:00'

export interface ProtectionComponent {
  type: string
  spf?: number
  upf?: number
  hat_factor?: number
  umbrella_factor?: number
  glass_factor?: number
}
