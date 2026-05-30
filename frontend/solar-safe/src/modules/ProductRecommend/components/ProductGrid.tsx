import type { Product } from "../types/productRecommend.type";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
  loading?: boolean;
}

export default function ProductGrid({ products, onAdd, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/60" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 py-16 text-center text-gray-400">
        <p className="text-sm">No products match your filters.</p>
        <p className="text-xs mt-1">Try adjusting the price or protection level.</p>
      </div>
    );
  }

  return (
    // Responsive grid:
    // mobile  (<640px)  → 1 column
    // sm      (≥640px)  → 2 columns
    // lg      (≥1024px) → 3 columns
    // xl      (≥1280px) → 4 columns
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
