import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db";
import { generateUVData, recommendEquipment } from "../uv/uv.service";
import { scheduleActivity } from "./planner.service";
import type { UVDataPoint } from "../../types";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const DayIdSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "dayId must be YYYY-MM-DD");

const AddActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

const UpdateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getOrCreateDay(dayId: string) {
  let day = await prisma.day.findUnique({
    where: { id: dayId },
    include: {
      uvData:     { orderBy: { hour: "asc" } },
      activities: { orderBy: { recommendedStart: "asc" } },
    },
  });

  if (!day) {
    const uvPoints = generateUVData(dayId);
    day = await prisma.day.create({
      data: {
        id: dayId,
        date: dayId,
        uvData: { create: uvPoints.map(({ hour, uvIndex, level }) => ({ hour, uvIndex, level })) },
      },
      include: {
        uvData:     { orderBy: { hour: "asc" } },
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

function buildUsedHours(
  activities: { id?: string; recommendedStart: number | null; recommendedEnd: number | null }[],
  excludeId?: string
): Set<number> {
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

// ─── GET /api/days/:dayId ─────────────────────────────────────────────────────
router.get("/:dayId", async (req, res) => {
  const parse = DayIdSchema.safeParse(req.params.dayId);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues[0]?.message });

  try {
    const day = await getOrCreateDay(parse.data);
    return res.json(day);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load day" });
  }
});

// ─── POST /api/days/:dayId/activities ─────────────────────────────────────────
router.post("/:dayId/activities", async (req, res) => {
  const parseId   = DayIdSchema.safeParse(req.params.dayId);
  const parseBody = AddActivitySchema.safeParse(req.body);
  if (!parseId.success)   return res.status(400).json({ error: parseId.error.issues[0]?.message });
  if (!parseBody.success) return res.status(400).json({ error: parseBody.error.issues[0]?.message });

  try {
    const day      = await getOrCreateDay(parseId.data);
    const usedHours = buildUsedHours(day.activities);
    const uvPoints  = toUVPoints(day.uvData);

    const { start, end, reason } = scheduleActivity(parseBody.data.name.trim(), uvPoints, usedHours);

    const activity = await prisma.activity.create({
      data: {
        name: parseBody.data.name.trim(),
        dayId: parseId.data,
        recommendedStart: start,
        recommendedEnd:   end,
        reason,
      },
    });

    const updatedDay = await prisma.day.findUnique({
      where: { id: parseId.data },
      include: {
        uvData:     { orderBy: { hour: "asc" } },
        activities: { orderBy: { recommendedStart: "asc" } },
      },
    });

    return res.status(201).json({ activity, day: updatedDay });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add activity" });
  }
});

// ─── PATCH /api/days/:dayId/activities/:activityId ────────────────────────────
router.patch("/:dayId/activities/:activityId", async (req, res) => {
  const parseId   = DayIdSchema.safeParse(req.params.dayId);
  const parseBody = UpdateActivitySchema.safeParse(req.body);
  if (!parseId.success)   return res.status(400).json({ error: parseId.error.issues[0]?.message });
  if (!parseBody.success) return res.status(400).json({ error: parseBody.error.issues[0]?.message });

  try {
    const day       = await getOrCreateDay(parseId.data);
    const usedHours = buildUsedHours(day.activities, req.params.activityId);
    const uvPoints  = toUVPoints(day.uvData);

    const { start, end, reason } = scheduleActivity(parseBody.data.name.trim(), uvPoints, usedHours);

    const updated = await prisma.activity.update({
      where: { id: req.params.activityId },
      data:  { name: parseBody.data.name.trim(), recommendedStart: start, recommendedEnd: end, reason },
    });

    return res.json(updated);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025")
      return res.status(404).json({ error: "Activity not found" });
    console.error(err);
    return res.status(500).json({ error: "Failed to update activity" });
  }
});

// ─── DELETE /api/days/:dayId/activities/:activityId ───────────────────────────
router.delete("/:dayId/activities/:activityId", async (req, res) => {
  const parseId = DayIdSchema.safeParse(req.params.dayId);
  if (!parseId.success) return res.status(400).json({ error: parseId.error.issues[0]?.message });

  try {
    await prisma.activity.delete({ where: { id: req.params.activityId } });

    const updatedDay = await prisma.day.findUnique({
      where: { id: parseId.data },
      include: {
        uvData:     { orderBy: { hour: "asc" } },
        activities: { orderBy: { recommendedStart: "asc" } },
      },
    });

    return res.json({ success: true, day: updatedDay });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025")
      return res.status(404).json({ error: "Activity not found" });
    console.error(err);
    return res.status(500).json({ error: "Failed to delete activity" });
  }
});

// ─── GET /api/days/:dayId/equipment ──────────────────────────────────────────
router.get("/:dayId/equipment", async (req, res) => {
  const parseId = DayIdSchema.safeParse(req.params.dayId);
  if (!parseId.success) return res.status(400).json({ error: parseId.error.issues[0]?.message });

  try {
    const day = await getOrCreateDay(parseId.data);

    if (day.activities.length === 0)
      return res.json({ maxUV: 0, level: "none", items: [], warning: undefined });

    let maxUV = 0;
    for (const activity of day.activities) {
      const start = activity.recommendedStart;
      if (start === null || start === undefined) continue;
      const end = activity.recommendedEnd ?? start + 1;
      for (let h = start; h < end; h++) {
        const point = day.uvData.find((d: { hour: number; uvIndex: number }) => d.hour === h);
        if (point && point.uvIndex > maxUV) maxUV = point.uvIndex;
      }
    }

    const { level, items, warning } = recommendEquipment(maxUV);
    return res.json({ maxUV, level, items, warning });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get equipment" });
  }
});

export default router;