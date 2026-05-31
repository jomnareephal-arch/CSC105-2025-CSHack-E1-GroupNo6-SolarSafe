export type SkinType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'
export type ProtectionItemType = 'hat' | 'sunscreen' | 'sunglasses' | 'umbrella' | 'uvJacket'
export type TimeSlot =
  | '06:00' | '07:00' | '08:00' | '09:00' | '10:00' | '11:00'
  | '12:00' | '13:00' | '14:00' | '15:00' | '16:00' | '17:00'
  | '18:00'

export interface SunscreenComponent  { type: 'sunscreen';  spf: number }
export interface UvJacketComponent   { type: 'uvJacket';   upf: number }
export interface HatComponent        { type: 'hat';        hat_factor: number }
export interface UmbrellaComponent   { type: 'umbrella';   umbrella_factor: number }
export interface SunglassesComponent { type: 'sunglasses'; glass_factor: number }

export type ProtectionComponent =
  | SunscreenComponent
  | UvJacketComponent
  | HatComponent
  | UmbrellaComponent
  | SunglassesComponent

export interface ProtectionConfigItem {
  type: ProtectionItemType
  label: string
  icon: string
  field: string
}

export interface CalcResult {
  id: number
  safeOutdoorMinutes: number
}

export interface CalculationPayload {
  skinType: SkinType
  outdoorTime: TimeSlot
  protectionComponents: ProtectionComponent[]
}
