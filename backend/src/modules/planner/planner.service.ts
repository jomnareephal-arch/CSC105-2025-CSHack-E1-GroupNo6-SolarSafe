import type { UVDataPoint } from "../../types";

/** Classify activity name to determine preferred UV window */
function classifyActivity(name: string): { preferLow: boolean; avoidHigh: boolean } {
  const n = name.toLowerCase();
  const needsSun  = ["dry", "laundry"].some((k) => n.includes(k));
  const avoidSun  = [
    "run", "exercise", "jog",
    "garden", "walk",
    "bike", "cycle", "play",
    
  ].some((k) => n.includes(k));

  void needsSun; // reserved for future smarter scoring
  return { preferLow: avoidSun, avoidHigh: avoidSun };
}

function timeOfDay(hour: number): string {
  if (hour <= 7)  return "early morning";
  if (hour <= 11) return "morning";
  if (hour <= 13) return "midday";
  if (hour <= 16) return "afternoon";
  return "evening";
}

export function generateReason(
  name: string,
  hour: number,
  uvIndex: number,
  level: string,
  preferLow: boolean
): string {
  const tod = timeOfDay(hour);

  if (preferLow) {
    // Outdoor / physical activity — wants lowest UV
    if (level === "none" || level === "low") {
      return `UV ${uvIndex} in the ${tod} is low — the safest window for ${name}. Wear a hat and sunglasses.`;
    }
    if (level === "moderate") {
      return `UV ${uvIndex} is the lowest available slot for ${name}. Apply SPF 30+ before heading out.`;
    }
    if (level === "high") {
      return `UV ${uvIndex} is high — the best slot remaining for ${name}. Use SPF 50+, hat, and limit your time outside.`;
    }
    // very_high or extreme — last resort
    return `UV ${uvIndex} is intense — the only available slot. Use full protection for ${name} and keep it as brief as possible.`;
  } else {
    // General activity — wants moderate, comfortable light
    if (level === "none" || level === "low") {
      return `The ${tod} has gentle UV ${uvIndex} — comfortable conditions for ${name}.`;
    }
    if (level === "moderate") {
      return `UV ${uvIndex} in the ${tod} offers balanced daylight — a suitable time for ${name}.`;
    }
    if (level === "high") {
      return `UV ${uvIndex} is elevated at this hour. Keep ${name} brief or stay in shaded areas.`;
    }
    // very_high or extreme
    return `UV ${uvIndex} is high — apply full sun protection before ${name} and minimize time outdoors.`;
  }
}

function scoreHour(point: UVDataPoint, preferLow: boolean): number {
  if (preferLow) return point.uvIndex;          // lower UV = better
  return Math.abs(point.uvIndex - 28);          // closer to moderate = better
}

/** Pick the best 1–2 hour window for an activity */
export function scheduleActivity(
  name: string,
  uvData: UVDataPoint[],
  usedHours: Set<number>
): { start: number; end: number; reason: string } {
  const { preferLow, avoidHigh } = classifyActivity(name);
  const daylight = uvData.filter((d) => d.uvIndex > 0);

  let candidates = daylight.filter((d) => !usedHours.has(d.hour));

  if (avoidHigh) {
    const safe = candidates.filter(
      (d) => d.level === "low" || d.level === "moderate"
    );
    if (safe.length > 0) candidates = safe;
  }

  if (candidates.length === 0) candidates = daylight;

  candidates.sort((a, b) => scoreHour(a, preferLow) - scoreHour(b, preferLow));

  const best = candidates[0]!;
  const start = best.hour;
  const nextFree =
    uvData.find((d) => d.hour === start + 1 && d.uvIndex > 0) &&
    !usedHours.has(start + 1);
  const end = nextFree ? start + 2 : start + 1;

  usedHours.add(start);
  if (end === start + 2) usedHours.add(start + 1);

  const reason = generateReason(name, best.hour, best.uvIndex, best.level, preferLow);

  return { start, end, reason };
}