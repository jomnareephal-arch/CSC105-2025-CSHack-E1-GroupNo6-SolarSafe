export type UVLevel = "none" | "low" | "moderate" | "high" | "very_high" | "extreme";

export interface UVDataPoint {
  hour: number;      // 0-23
  uvIndex: number;
  level: UVLevel;
}

export interface Activity {
  id: string;
  name: string;
  dayId: string;
  recommendedStart?: number; // hour 0-23
  recommendedEnd?: number;   // hour 0-23
  reason?: string;
  createdAt: string;
}

export interface Day {
  id: string;        // YYYY-MM-DD
  date: string;
  uvData: UVDataPoint[];
  activities: Activity[];
}

export interface ProtectiveEquipment {
  maxUV: number;
  level: string;
  items: string[];
  warning?: string;
}
