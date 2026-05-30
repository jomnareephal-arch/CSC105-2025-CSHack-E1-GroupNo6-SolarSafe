import { z } from "zod";

export const productCategorySchema = z.enum([
  "hats",
  "sunglasses",
  "sunscreen",
  "umbrella",
  "uv-jacket",
]);

export const priceRangeSchema = z.enum([
  "under100",
  "100to300",
  "above300",
]);

export const getProductRecommendationsQuerySchema = z.object({
  category: productCategorySchema.optional(),
  priceRange: priceRangeSchema.optional(),
  minProtectionScore: z.coerce.number().min(0).max(100).optional(),
});

export type GetProductRecommendationsQuery = z.infer<
  typeof getProductRecommendationsQuerySchema
>;