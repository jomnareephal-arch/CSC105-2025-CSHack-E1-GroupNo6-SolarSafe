import { useCallback, useEffect, useMemo, useState } from "react";

import { getProducts } from "../apis/productRecommend.api";
import CategoryTabs, { CATEGORY_TABS } from "../components/CategoryTabs";
import DailyTipCard from "../components/DailyTipCard";
import FilterSidebar, { PRICE_RANGE_OPTIONS } from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import type { Product, ProductCategory, ProductFilter } from "../types/productRecommend.type";

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

interface ProductRecommendPageProps {
  selectedProducts: Map<ProductCategory, Product>;
  onSelectProduct: (product: Product) => void;
  initialCategory?: ProductCategory;
  returnToCalculate?: boolean;
  onDone?: () => void;
}

export default function ProductRecommendPage({
  selectedProducts,
  onSelectProduct,
  initialCategory,
  returnToCalculate = false,
  onDone,
}: ProductRecommendPageProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [filter, setFilter]           = useState<ProductFilter>({
    ...DEFAULT_FILTER,
    category: initialCategory ?? "hats",
  });

  useEffect(() => {
    if (initialCategory) {
      setFilter((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

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

  const handleSelect = useCallback((product: Product) => {
    onSelectProduct(product);
  }, [onSelectProduct]);

  const selectedInCurrentCategory = selectedProducts.get(filter.category);

  return (
    <div className="min-h-full p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Product Recommendation
        </h1>
        {returnToCalculate && onDone && (
          <button
            onClick={onDone}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition-all active:scale-95"
            style={{ backgroundColor: "#E68C52" }}
          >
            ← Back to Calculate
          </button>
        )}
      </div>

      {/* Selection summary bar */}
      {selectedProducts.size > 0 && (
        <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
            Selected Items
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const sel = selectedProducts.get(tab.value);
              return (
                <div
                  key={tab.value}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: sel ? "#fff7ed" : "#f3f4f6",
                    border: sel ? "1px solid #fb923c" : "1px solid #e5e7eb",
                    color: sel ? "#c2410c" : "#9ca3af",
                  }}
                >
                  <span>{tab.label}:</span>
                  {sel ? (
                    <span className="font-semibold line-clamp-1 max-w-[120px]">{sel.name}</span>
                  ) : (
                    <span className="italic">Not selected</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category tabs */}
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

          {/* All selected products */}
          {selectedProducts.size > 0 && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
                All Selections
              </p>
              <ul className="flex flex-col gap-2">
                {CATEGORY_TABS.map((tab) => {
                  const sel = selectedProducts.get(tab.value);
                  return (
                    <li key={tab.value} className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-gray-400">{tab.label}</span>
                      {sel ? (
                        <>
                          <span className="text-xs text-gray-700 font-medium line-clamp-1">{sel.name}</span>
                          <span className="text-xs text-orange-600 font-bold">{sel.price} ฿</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not selected</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Right column — product grid */}
        <div className="flex-1 min-w-0">
          {!loading && (
            <p className="mb-3 text-xs text-gray-500">
              Showing {visibleProducts.length} item{visibleProducts.length !== 1 ? "s" : ""}
              {selectedInCurrentCategory && (
                <span className="ml-2 text-orange-600 font-medium">
                  · Selected: {selectedInCurrentCategory.name}
                </span>
              )}
            </p>
          )}
          <ProductGrid
            products={visibleProducts}
            selectedProductId={selectedInCurrentCategory?.id}
            onSelect={handleSelect}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
