import { z } from "zod";

export const AddActivitySchema = z.object({
  name:            z.string().min(1, "Activity name is required").max(200),
  startHour:       z.number().int().min(0).max(23).optional(),
  durationMinutes: z.number().int().refine(v => [15, 30, 60].includes(v), "Must be 15, 30, or 60").optional(),
});

export const UpdateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

export type AddActivityInput = z.infer<typeof AddActivitySchema>;
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;