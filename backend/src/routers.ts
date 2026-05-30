import { Router } from "express";
import productRecommendRouter from "./modules/productRecommend/productRecommend.route.js";
import calculationRouter from './modules/calculate/calculate.router.js'
import configRouter from './modules/calculate/config.router.js'
import plannerRouter from "./modules/planner/routers/planner.router.js";
import authRouter from './modules/auth/auth.route.js'
import adminRouter from './modules/admin/admin.route.js'
import { prisma } from "./db.js";

const router = Router();

router.use("/planner", plannerRouter);
router.use('/auth', authRouter)
router.use('/calculation', calculationRouter)
router.use('/config', configRouter)

router.use("/product-recommendations", productRecommendRouter);
router.use("/admin", adminRouter);

// ── In-memory loadout store ───────────────────────────────────────────────────
// { [userId]: productId[] }
const loadouts: Record<string, number[]> = {};

/** GET /api/loadout/:userId */
router.get("/loadout/:userId", async (req, res) => {
  const { userId } = req.params;
  const ids = loadouts[userId] ?? [];
  if (ids.length === 0) {
    res.json({ loadout: [] });
    return;
  }
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  res.json({ loadout: products });
});

/** POST /api/loadout/:userId  body: { productId: number } */
router.post("/loadout/:userId", async (req, res) => {
  const { userId } = req.params;
  const productId = Number(req.body?.productId);
  if (!productId || isNaN(productId)) {
    res.status(400).json({ error: "productId (number) is required" });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (!loadouts[userId]) loadouts[userId] = [];
  if (loadouts[userId].includes(productId)) {
    res.status(409).json({ error: "Already in loadout" });
    return;
  }

  loadouts[userId].push(productId);
  const all = await prisma.product.findMany({ where: { id: { in: loadouts[userId] } } });
  res.status(201).json({ loadout: all });
});

/** DELETE /api/loadout/:userId/:productId */
router.delete("/loadout/:userId/:productId", async (req, res) => {
  const { userId } = req.params;
  const productId = Number(req.params.productId);

  if (!loadouts[userId]?.includes(productId)) {
    res.status(404).json({ error: "Product not in loadout" });
    return;
  }

  loadouts[userId] = loadouts[userId].filter((id) => id !== productId);
  const all = await prisma.product.findMany({ where: { id: { in: loadouts[userId] } } });
  res.json({ loadout: all });
});

export default router;
