export type UVLevel = "none" | "low" | "moderate" | "high" | "very_high" | "extreme";

export interface UVDataPoint {
  hour: number;
  uvIndex: number;
  level: UVLevel;
}
