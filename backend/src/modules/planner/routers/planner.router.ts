import { Router } from "express";
import {
  getUVToday,
  getActivities,
  addActivity,
  editActivity,
  removeActivity,
} from "../controllers/planner.controller";

const plannerRouter = Router();

plannerRouter.get("/uv-today",        getUVToday);
plannerRouter.get("/activities",      getActivities);
plannerRouter.post("/activities",     addActivity);
plannerRouter.patch("/activities/:id", editActivity);
plannerRouter.delete("/activities/:id", removeActivity);

export default plannerRouter;
