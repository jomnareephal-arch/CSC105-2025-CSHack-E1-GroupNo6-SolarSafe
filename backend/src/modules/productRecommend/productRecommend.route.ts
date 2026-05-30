import { Router } from "express";
import { getProductRecommendationsController } from "./productRecommend.controller";

const productRecommendRouter = Router();

productRecommendRouter.get("/", getProductRecommendationsController);

export default productRecommendRouter;