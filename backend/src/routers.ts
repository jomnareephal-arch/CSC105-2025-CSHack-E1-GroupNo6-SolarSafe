import { Router } from "express";
import plannerRouter from "./modules/planner/routers/planner.router";

const router = Router();

router.use("/planner", plannerRouter);

export default router;
