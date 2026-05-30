import type { Product, ProductCategory } from "../types/productRecommend.type";

const ALL_PRODUCTS: Product[] = [
  {
    id: "hat-004",
    name: "Classic Wide-Brim Straw",
    category: "hats",
    price: 180,
    imageUrl: "/hat1.png",
    rating: { standard: "UPF", value: 80, plus: true },
    protectionScore: 100,
  },
];

export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 150));
  if (category) return ALL_PRODUCTS.filter((p) => p.category === category);
  return ALL_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product> {
  await new Promise((r) => setTimeout(r, 150));
  const product = ALL_PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Product not found: ${id}`);
  return product;
}
