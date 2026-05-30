import { prisma } from "../../db";
import type { GetProductRecommendationsQuery } from "./productRecommend.schema";

export const getProductRecommendations = async (
  filters: GetProductRecommendationsQuery
) => {
  const where: any = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.minProtectionScore !== undefined) {
    where.protectionScore = {
      gte: filters.minProtectionScore,
    };
  }

  if (filters.priceRange) {
    if (filters.priceRange === "under100") {
      where.price = {
        lt: 100,
      };
    }

    if (filters.priceRange === "100to300") {
      where.price = {
        gte: 100,
        lte: 300,
      };
    }

    if (filters.priceRange === "above300") {
      where.price = {
        gt: 300,
      };
    }
  }

  return prisma.product.findMany({
    where,
    orderBy: {
      id: "asc",
    },
  });
};