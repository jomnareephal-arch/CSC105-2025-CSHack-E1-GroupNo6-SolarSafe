import { prisma } from "../../db.js";
import type { GetProductRecommendationsQuery } from "./productRecommend.schema.js";

export const getProductRecommendations = async (
  filters: GetProductRecommendationsQuery
) => {
  const where: Record<string, unknown> = { active: 1 };

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.minProtectionScore !== undefined) {
    where.protectionScore = { gte: filters.minProtectionScore };
  }

  if (filters.priceRange === "under100") {
    where.price = { lt: 100 };
  } else if (filters.priceRange === "100to300") {
    where.price = { gte: 100, lte: 300 };
  } else if (filters.priceRange === "above300") {
    where.price = { gt: 300 };
  }

  return prisma.product.findMany({ where, orderBy: { id: "asc" } });
};
