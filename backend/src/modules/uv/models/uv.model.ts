import type { UVDataPoint, UVLevel } from "../types/uv.types";

const SAMPLE_UV_BY_HOUR: Record<number, number> = {
  0: 0,  1: 0,  2: 0,  3: 0,  4: 0,  5: 0,
  6: 20, 7: 23, 8: 26, 9: 30, 10: 34,
  11: 37, 12: 52, 13: 50, 14: 47,
  15: 36, 16: 29, 17: 25,
  18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0,
};

export function getUVLevel(uvIndex: number): UVLevel {
  if (uvIndex === 0)  return "none";
  if (uvIndex <= 26)  return "low";
  if (uvIndex <= 35)  return "moderate";
  if (uvIndex <= 49)  return "high";
  if (uvIndex <= 70)  return "very_high";
  return "extreme";
}

export function generateUVData(dateStr: string): UVDataPoint[] {
  void dateStr; // TODO: replace with real UV API
  return Array.from({ length: 24 }, (_, hour) => {
    const uvIndex = SAMPLE_UV_BY_HOUR[hour] ?? 0;
    return { hour, uvIndex, level: getUVLevel(uvIndex) };
  });
}

export function recommendEquipment(maxUV: number): {
  level: string;
  items: string[];
  warning?: string;
} {
  if (maxUV <= 2)  return { level: "UV 0-2",   items: ["No special equipment needed"] };
  if (maxUV <= 26) return { level: "UV 20-26",  items: ["Sunglasses", "Hat"] };
  if (maxUV <= 35) return {
    level: "UV 27-35",
    items: ["Wide-brimmed hat", "Sunglasses", "Long-sleeved UV-protective shirt", "Sunscreen SPF 30+"],
  };
  if (maxUV <= 49) return {
    level: "UV 36-49",
    items: ["UV-protective clothing", "Wide-brimmed hat", "Sunglasses", "Sunscreen SPF 50+", "UV umbrella"],
  };
  return {
    level: "UV 50++",
    items: ["All types of protective equipment"],
    warning: "Avoid outdoor activities. UV levels are very high — use all types of protective equipment.",
  };
}
