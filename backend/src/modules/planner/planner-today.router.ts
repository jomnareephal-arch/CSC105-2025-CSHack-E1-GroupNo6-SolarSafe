import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db";
import { generateUVData, recommendEquipment } from "../uv/uv.service";
import { scheduleActivity } from "./planner.service";
import type { UVDataPoint } from "../../types";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const AddActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

const UpdateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayId(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getOrCreateDay(dayId: string) {
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

  return day;
}

function toUVPoints(uvData: { hour: number; uvIndex: number; level: string }[]): UVDataPoint[] {
  return uvData.map((d) => ({
    hour: d.hour,
    uvIndex: d.uvIndex,
    level: d.level as UVDataPoint["level"],
  }));
}

/** Map backend UV level to frontend level string */
function mapLevel(level: string, uvIndex: number): "night" | "low" | "moderate" | "high" | "vhigh" {
  if (uvIndex === 0 || level === "none") return "night";
  if (level === "low") return "low";
  if (level === "moderate") return "moderate";
  if (level === "high") return "high";
  return "vhigh"; // very_high | extreme
}

/** Compute peak UV for an activity's time window */
function peakUVForActivity(
  uvData: { hour: number; uvIndex: number }[],
  start: number | null,
  end: number | null
): number {
  if (start === null || start === undefined) return 0;
  const endHour = end ?? start + 1;
  let peak = 0;
  for (let h = start; h < endHour; h++) {
    const pt = uvData.find((d) => d.hour === h);
    if (pt && pt.uvIndex > peak) peak = pt.uvIndex;
  }
  return peak;
}

function formatActivity(
  act: {
    id: string;
    name: string;
    recommendedStart: number | null;
    recommendedEnd: number | null;
    reason: string | null;
  },
  uvData: { hour: number; uvIndex: number }[]
) {
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

function buildUsedHours(
  activities: { id?: string; recommendedStart: number | null; recommendedEnd: number | null }[],
  excludeId?: string
): Set<number> {
  const used = new Set<number>();
  for (const a of activities) {
    if ((a as { id?: string }).id === excludeId) continue;
    if (a.recommendedStart !== null && a.recommendedStart !== undefined) {
      const end = a.recommendedEnd ?? a.recommendedStart + 1;
      for (let h = a.recommendedStart; h < end; h++) used.add(h);
    }
  }
  return used;
}

function buildEquipmentFromDay(
  day: {
    activities: { recommendedStart: number | null; recommendedEnd: number | null }[];
    uvData: { hour: number; uvIndex: number }[];
  }
) {
  if (day.activities.length === 0) {
    return { level: "none", items: [], warning: undefined };
  }
  let maxUV = 0;
  for (const act of day.activities) {
    const peak = peakUVForActivity(day.uvData, act.recommendedStart, act.recommendedEnd);
    if (peak > maxUV) maxUV = peak;
  }
  return recommendEquipment(maxUV);
}

// ─── GET /api/planner/uv-today ────────────────────────────────────────────────
router.get("/uv-today", async (_req, res) => {
  try {
    const day = await getOrCreateDay(todayId());
    const uvData = day.uvData.map((d: { hour: number; uvIndex: number; level: string }) => ({
      hour: d.hour,
      uv: d.uvIndex,
      level: mapLevel(d.level, d.uvIndex),
    }));
    return res.json({ uvData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load UV data" });
  }
});

// ─── GET /api/planner/activities ──────────────────────────────────────────────
router.get("/activities", async (_req, res) => {
  try {
    const day = await getOrCreateDay(todayId());
    const activities = day.activities.map((a: Parameters<typeof formatActivity>[0]) => formatActivity(a, day.uvData));
    const equipment = buildEquipmentFromDay(day);
    const maxUV = activities.reduce((m: number, a: { peakUV: number }) => Math.max(m, a.peakUV), 0);
    return res.json({ activities, maxUV, equipment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load activities" });
  }
});

// ─── POST /api/planner/activities ─────────────────────────────────────────────
router.post("/activities", async (req, res) => {
  const parseBody = AddActivitySchema.safeParse(req.body);
  if (!parseBody.success)
    return res.status(400).json({ error: parseBody.error.issues[0]?.message });

  try {
    const dayId = todayId();
    const day = await getOrCreateDay(dayId);
    const usedHours = buildUsedHours(day.activities);
    const uvPoints = toUVPoints(day.uvData);

    const { start, end, reason } = scheduleActivity(
      parseBody.data.name.trim(),
      uvPoints,
      usedHours
    );

    const created = await prisma.activity.create({
      data: {
        name: parseBody.data.name.trim(),
        dayId,
        recommendedStart: start,
        recommendedEnd: end,
        reason,
      },
    });

    const updatedDay = await prisma.day.findUnique({
      where: { id: dayId },
      include: {
        uvData: { orderBy: { hour: "asc" } },
        activities: { orderBy: { recommendedStart: "asc" } },
      },
    });

    const equipment = buildEquipmentFromDay(updatedDay!);
    const activity = formatActivity(created, day.uvData);

    return res.status(201).json({ activity, equipment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add activity" });
  }
});

// ─── PATCH /api/planner/activities/:id ────────────────────────────────────────
router.patch("/activities/:id", async (req, res) => {
  const parseBody = UpdateActivitySchema.safeParse(req.body);
  if (!parseBody.success)
    return res.status(400).json({ error: parseBody.error.issues[0]?.message });

  try {
    const dayId = todayId();
    const day = await getOrCreateDay(dayId);
    const usedHours = buildUsedHours(day.activities, req.params.id);
    const uvPoints = toUVPoints(day.uvData);

    const { start, end, reason } = scheduleActivity(
      parseBody.data.name.trim(),
      uvPoints,
      usedHours
    );

    const updated = await prisma.activity.update({
      where: { id: req.params.id },
      data: { name: parseBody.data.name.trim(), recommendedStart: start, recommendedEnd: end, reason },
    });

    const updatedDay = await prisma.day.findUnique({
      where: { id: dayId },
      include: {
        uvData: { orderBy: { hour: "asc" } },
        activities: { orderBy: { recommendedStart: "asc" } },
      },
    });

    const equipment = buildEquipmentFromDay(updatedDay!);
    const activity = formatActivity(updated, day.uvData);

    return res.json({ activity, equipment });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025")
      return res.status(404).json({ error: "Activity not found" });
    console.error(err);
    return res.status(500).json({ error: "Failed to update activity" });
  }
});

// ─── DELETE /api/planner/activities/:id ───────────────────────────────────────
router.delete("/activities/:id", async (req, res) => {
  try {
    const dayId = todayId();
    await prisma.activity.delete({ where: { id: req.params.id } });

    const updatedDay = await prisma.day.findUnique({
      where: { id: dayId },
      include: {
        uvData: { orderBy: { hour: "asc" } },
        activities: { orderBy: { recommendedStart: "asc" } },
      },
    });

    const equipment = buildEquipmentFromDay(updatedDay!);
    return res.json({ success: true, equipment });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025")
      return res.status(404).json({ error: "Activity not found" });
    console.error(err);
    return res.status(500).json({ error: "Failed to delete activity" });
  }
});

export default router;
