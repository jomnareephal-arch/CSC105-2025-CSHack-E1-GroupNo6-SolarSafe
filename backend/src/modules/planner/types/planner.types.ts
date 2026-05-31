export interface ActivityRow {
  id: string;
  name: string;
  recommendedStart: number | null;
  recommendedEnd: number | null;
  reason: string | null;
  durationMinutes: number | null;
}

export interface UVRow {
  hour: number;
  uvIndex: number;
  level: string;
}

export interface DayWithData {
  activities: ActivityRow[];
  uvData: UVRow[];
}

export interface ActivityResponse {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
  durationMinutes: number;
  reason: string;
  peakUV: number;
}

export interface EquipmentResponse {
  level: string;
  items: string[];
  warning?: string;
}