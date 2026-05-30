import { z } from "zod";

export const AddActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

export const UpdateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(200),
});

export type AddActivityInput = z.infer<typeof AddActivitySchema>;
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;