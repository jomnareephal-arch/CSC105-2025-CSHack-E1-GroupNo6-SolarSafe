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

  const reason = avoidHigh
    ? `Low UV periods are ideal for outdoor activities. (UV ${best.uvIndex})`
    : `The time with just the right amount of sunlight is ideal for... "${name}" (UV ${best.uvIndex})`;

  return { start, end, reason };
}
