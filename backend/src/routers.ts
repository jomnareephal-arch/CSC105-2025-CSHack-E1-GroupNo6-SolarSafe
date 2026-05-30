import { Router } from "express";
import plannerRouter from "./modules/planner/planner.router";

const router = Router();

router.use("/days", plannerRouter);

export default router;
