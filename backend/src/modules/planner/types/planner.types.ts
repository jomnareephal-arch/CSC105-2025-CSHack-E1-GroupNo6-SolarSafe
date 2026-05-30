export interface ActivityRow {
  id: string;
  name: string;
  recommendedStart: number | null;
  recommendedEnd: number | null;
  reason: string | null;
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
  reason: string;
  peakUV: number;
}

export interface EquipmentResponse {
  level: string;
  items: string[];
  warning?: string;
}