import { prisma } from "../../../db";
import { generateUVData, recommendEquipment } from "../../uv/models/uv.model";
import { scheduleActivity } from "../planner.service";
import type { UVDataPoint } from "../../uv/types/uv.types";
import type { ActivityRow, UVRow, DayWithData, ActivityResponse, EquipmentResponse } from "../types/planner.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function todayId(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getOrCreateDay(dayId: string): Promise<DayWithData> {
  let day = await prisma.day.findUnique({
    where: { id: dayId },
    include: {
      uvData: { orderBy: { hour: "asc" } },
      activities: { orderBy: { recommendedStart: "asc" } },
    },
  });

  if (!day) {
    const uvPoints = generateUVData(dayId);
    day = await prisma.day.create({
      data: {
        id: dayId,
        date: dayId,
        uvData: {
          create: uvPoints.map(({ hour, uvIndex, level }) => ({ hour, uvIndex, level })),
        },
      },
      include: {
        uvData: { orderBy: { hour: "asc" } },
        activities: { orderBy: { recommendedStart: "asc" } },
      },
    });
  }

  return day as DayWithData;
}

export function toUVPoints(uvData: UVRow[]): UVDataPoint[] {
  return uvData.map((d) => ({
    hour: d.hour,
    uvIndex: d.uvIndex,
    level: d.level as UVDataPoint["level"],
  }));
}

export function mapUVLevel(level: string, uvIndex: number): "night" | "low" | "moderate" | "high" | "vhigh" {
  if (uvIndex === 0 || level === "none") return "night";
  if (level === "low") return "low";
  if (level === "moderate") return "moderate";
  if (level === "high") return "high";
  return "vhigh";
}

export function peakUVForActivity(uvData: UVRow[], start: number | null, end: number | null): number {
  if (start === null || start === undefined) return 0;
  const endHour = end ?? start + 1;
  let peak = 0;
  for (let h = start; h < endHour; h++) {
    const pt = uvData.find((d) => d.hour === h);
    if (pt && pt.uvIndex > peak) peak = pt.uvIndex;
  }
  return peak;
}

export function formatActivity(act: ActivityRow, uvData: UVRow[]): ActivityResponse {
  const startHour = act.recommendedStart ?? 0;
  const endHour = act.recommendedEnd ?? startHour + 1;
  return {
    id: act.id,
    name: act.name,
    startHour,
    endHour,
    reason: act.reason ?? "",
    peakUV: peakUVForActivity(uvData, act.recommendedStart, act.recommendedEnd),
  };
}

export function buildUsedHours(activities: ActivityRow[], excludeId?: string): Set<number> {
  const used = new Set<number>();
  for (const a of activities) {
    if (a.id === excludeId) continue;
    if (a.recommendedStart !== null && a.recommendedStart !== undefined) {
      const end = a.recommendedEnd ?? a.recommendedStart + 1;
      for (let h = a.recommendedStart; h < end; h++) used.add(h);
    }
  }
  return used;
}

export function buildEquipment(day: DayWithData): EquipmentResponse {
  if (day.activities.length === 0) return { level: "none", items: [] };
  let maxUV = 0;
  for (const act of day.activities) {
    const peak = peakUVForActivity(day.uvData, act.recommendedStart, act.recommendedEnd);
    if (peak > maxUV) maxUV = peak;
  }
  return recommendEquipment(maxUV);
}

// ─── DB operations ────────────────────────────────────────────────────────────

export async function createActivity(dayId: string, name: string, excludeId?: string) {
  const day = await getOrCreateDay(dayId);
  const usedHours = buildUsedHours(day.activities, excludeId);
  const uvPoints = toUVPoints(day.uvData);
  const { start, end, reason } = scheduleActivity(name, uvPoints, usedHours);

  const created = await prisma.activity.create({
    data: { name, dayId, recommendedStart: start, recommendedEnd: end, reason },
  });

  const updatedDay = await getOrCreateDay(dayId);
  return { activity: formatActivity(created, day.uvData), equipment: buildEquipment(updatedDay) };
}

export async function updateActivity(dayId: string, activityId: string, name: string) {
  const day = await getOrCreateDay(dayId);
  const usedHours = buildUsedHours(day.activities, activityId);
  const uvPoints = toUVPoints(day.uvData);
  const { start, end, reason } = scheduleActivity(name, uvPoints, usedHours);

  const updated = await prisma.activity.update({
    where: { id: activityId },
    data: { name, recommendedStart: start, recommendedEnd: end, reason },
  });

  const updatedDay = await getOrCreateDay(dayId);
  return { activity: formatActivity(updated, day.uvData), equipment: buildEquipment(updatedDay) };
}

export async function deleteActivity(dayId: string, activityId: string) {
  await prisma.activity.delete({ where: { id: activityId } });
  const updatedDay = await getOrCreateDay(dayId);
  return { equipment: buildEquipment(updatedDay) };
}