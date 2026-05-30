import { useCallback, useEffect, useMemo, useState } from "react";

import { getProducts } from "../apis/productRecommend.api";
import CategoryTabs from "../components/CategoryTabs";
import DailyTipCard from "../components/DailyTipCard";
import FilterSidebar, { PRICE_RANGE_OPTIONS } from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import type { LoadoutItem, Product, ProductFilter } from "../types/productRecommend.type";

const DEFAULT_FILTER: ProductFilter = {
  category: "hats",
  priceRanges: [],
  minProtectionScore: 50,
};

function applyFilters(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filter.priceRanges.length > 0) {
      const inRange = filter.priceRanges.some((id) => {
        const opt = PRICE_RANGE_OPTIONS.find((o) => o.id === id)!;
        if (opt.max === null) return p.price >= opt.min;
        return p.price >= opt.min && p.price < opt.max;
      });
      if (!inRange) return false;
    }
    if (p.protectionScore < filter.minProtectionScore) return false;
    return true;
  });
}

export default function ProductRecommendPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [filter, setFilter]           = useState<ProductFilter>(DEFAULT_FILTER);
  const [loadout, setLoadout]         = useState<LoadoutItem[]>([]);

  // Fetch when category changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProducts(filter.category)
      .then((products) => { if (!cancelled) setAllProducts(products); })
      .catch(() => { if (!cancelled) setError("Failed to load products. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [filter.category]);

  // Instant client-side filter (price + score)
  const visibleProducts = useMemo(
    () => applyFilters(allProducts, filter),
    [allProducts, filter]
  );

  const handleCategoryChange = useCallback(
    (category: ProductFilter["category"]) =>
      setFilter((prev) => ({ ...prev, category })),
    []
  );

  const handleFilterChange = useCallback(
    (next: ProductFilter) => setFilter(next),
    []
  );

  // Add to loadout — increment qty if already present
  const handleAdd = useCallback((product: Product) => {
    setLoadout((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  return (
    <div className="min-h-full p-6">
      {/* Page title */}
      <h1 className="mb-5 text-3xl font-bold text-gray-800">
        Product Recommendation
      </h1>

      {/* Category tabs — flex-1 fills full width */}
      <div className="mb-5">
        <CategoryTabs active={filter.category} onChange={handleCategoryChange} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Sidebar + grid */}
      <div className="flex gap-5 items-start">
        {/* Left column */}
        <div className="w-52 shrink-0 flex flex-col gap-4">
          <FilterSidebar filter={filter} onChange={handleFilterChange} />
          <DailyTipCard />

          {/* Loadout preview (Member 2 will own the full version) */}
          {loadout.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white/90 p-3 shadow-sm">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Protection Loadout ({loadout.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <ul className="flex flex-col gap-1">
                {loadout.map((item) => (
                  <li key={item.product.id} className="flex items-center justify-between text-xs text-gray-700">
                    <span className="line-clamp-1 flex-1">{item.product.name}</span>
                    <span className="ml-1 rounded-full bg-orange-100 px-1.5 py-0.5 text-orange-600">
                      x{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column — product grid */}
        <div className="flex-1 min-w-0">
          {!loading && (
            <p className="mb-3 text-xs text-gray-500">
              Showing {visibleProducts.length} item{visibleProducts.length !== 1 ? "s" : ""}
            </p>
          )}
          <ProductGrid products={visibleProducts} onAdd={handleAdd} loading={loading} />
        </div>
      </div>
    </div>
  );
}
