export type UVLevel = "night" | "low" | "moderate" | "high" | "vhigh";

export interface UVHour {
  hour: number;
  uv: number;
  level: UVLevel;
}

export interface Activity {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
  reason: string;
  peakUV: number;
}

export interface ProtectiveEquipment {
  level: string;
  items: string[];
  warning?: string;
}