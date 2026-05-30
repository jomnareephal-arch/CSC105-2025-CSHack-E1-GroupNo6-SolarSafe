import type { UVLevel, UVDataPoint } from "../../types";

// ─── Sample UV data (matching the screenshot) ─────────────────────────────────
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

/** Generate 24-hour UV data for a given date */
export function generateUVData(dateStr: string): UVDataPoint[] {
  // TODO: replace with real UV API call using dateStr
  void dateStr;
  return Array.from({ length: 24 }, (_, hour) => {
    const uvIndex = SAMPLE_UV_BY_HOUR[hour] ?? 0;
    return { hour, uvIndex, level: getUVLevel(uvIndex) };
  });
}

/** Recommend protective equipment based on max UV index */
export function recommendEquipment(maxUV: number): {
  level: string;
  items: string[];
  warning?: string;
} {
  if (maxUV <= 2)  return { level: "none",      items: [] };
  if (maxUV <= 26) return { level: "low",       items: ["Sunglasses", "Hat"] };
  if (maxUV <= 35) return {
    level: "moderate",
    items: ["Wide-brimmed hat", "UV400 sunglasses", "Long-sleeved UV protection shirt", "Sunscreen SPF 30+"],
  };
  if (maxUV <= 49) return {
    level: "high",
    items: ["UV-protective clothing", "wide-brimmed hat", "UV400 sunglasses", "SPF 50+ sunscreen", "UV-protective umbrella"],
  };
  return {
    level: "very_high",
    items: ["UV-protective clothing", "wide-brimmed hat", "UV400 sunglasses", "SPF 50+ sunscreen", "UV-protective umbrella"],
    warning: "UV levels are very high. It is recommended to avoid outdoor activities during this time."
  };
}
