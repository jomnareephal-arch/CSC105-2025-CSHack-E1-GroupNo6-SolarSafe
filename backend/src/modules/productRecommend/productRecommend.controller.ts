import type { Request, Response } from "express";
import { getProductRecommendationsQuerySchema } from "./productRecommend.schema";
import { getProductRecommendations } from "./productRecommend.service";

export const getProductRecommendationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const filters = getProductRecommendationsQuerySchema.parse(req.query);

    const products = await getProductRecommendations(filters);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product recommendation query",
      error,
    });
  }
};