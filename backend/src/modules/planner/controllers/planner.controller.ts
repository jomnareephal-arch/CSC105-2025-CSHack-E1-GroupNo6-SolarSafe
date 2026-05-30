import type { Request, Response, NextFunction } from "express";
import { AddActivitySchema, UpdateActivitySchema } from "../schemas/planner.schema";
import {
  todayId,
  getOrCreateDay,
  formatActivity,
  buildEquipment,
  mapUVLevel,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../models/planner.model";

export async function getUVToday(_req: Request, res: Response, next: NextFunction) {
  try {
    const day = await getOrCreateDay(todayId());
    const uvData = day.uvData.map((d) => ({
      hour: d.hour,
      uv: d.uvIndex,
      level: mapUVLevel(d.level, d.uvIndex),
    }));
    res.json({ uvData });
  } catch (err) {
    next(err);
  }
}

export async function getActivities(_req: Request, res: Response, next: NextFunction) {
  try {
    const day = await getOrCreateDay(todayId());
    const activities = day.activities.map((a) => formatActivity(a, day.uvData));
    const equipment = buildEquipment(day);
    const maxUV = activities.reduce((m, a) => Math.max(m, a.peakUV), 0);
    res.json({ activities, maxUV, equipment });
  } catch (err) {
    next(err);
  }
}

export async function addActivity(req: Request, res: Response, next: NextFunction) {
  const parsed = AddActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message });
    return;
  }
  try {
    const result = await createActivity(todayId(), parsed.data.name.trim());
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function editActivity(req: Request, res: Response, next: NextFunction) {
  const parsed = UpdateActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message });
    return;
  }
  try {
    const result = await updateActivity(todayId(), req.params["id"] as string, parsed.data.name.trim());
    res.json(result);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025") {
      res.status(404).json({ error: "Activity not found" });
      return;
    }
    next(err);
  }
}

export async function removeActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await deleteActivity(todayId(), req.params["id"] as string);
    res.json({ success: true, ...result });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025") {
      res.status(404).json({ error: "Activity not found" });
      return;
    }
    next(err);
  }
}