import axios from "axios";
import type { UVHour, Activity, ProtectiveEquipment } from "../types";

export type { UVHour, Activity, ProtectiveEquipment };

const api = axios.create({ baseURL: '/api' });

export const plannerApi = {
  getUVToday: () =>
    api.get<{ uvData: UVHour[] }>("/planner/uv-today").then((r) => r.data),

  getActivities: () =>
    api
      .get<{ activities: Activity[]; maxUV: number; equipment: ProtectiveEquipment }>(
        "/planner/activities"
      )
      .then((r) => r.data),

  addActivity: (name: string) =>
    api
      .post<{ activity: Activity; equipment: ProtectiveEquipment }>("/planner/activities", { name })
      .then((r) => r.data),

  deleteActivity: (id: string) =>
    api
      .delete<{ success: boolean; equipment: ProtectiveEquipment }>(`/planner/activities/${id}`)
      .then((r) => r.data),

  updateActivity: (id: string, name: string) =>
    api
      .patch<{ activity: Activity; equipment: ProtectiveEquipment }>(`/planner/activities/${id}`, {
        name,
      })
      .then((r) => r.data),
};
