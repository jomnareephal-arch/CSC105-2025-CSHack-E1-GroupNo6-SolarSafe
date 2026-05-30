import { useState } from "react";
import type { Product, RatingStandard } from "../types/productRecommend.type";

function formatRating(product: Product): string {
  const { standard, value, plus } = product.rating;
  return `${standard} ${value}${plus ? "+" : ""}`;
}

const BADGE_COLOR: Record<RatingStandard, string> = {
  SPF: "#f97316",
  UPF: "#f97316",
  UV:  "#f97316",
};

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (added) return;
    setAdded(true);
    onAdd(product);
  };

  return (
    <div
      className="flex flex-col rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md
                 p-2 sm:p-3"
      style={{ border: "1px solid #f0ece8" }}
    >
      {/* Image + badge */}
      <div
        className="relative mb-2 sm:mb-3 overflow-hidden rounded-xl"
        style={{ backgroundColor: "#f7f4f1" }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
        {/* Badge — smaller on mobile */}
        <span
          className="absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5
                     text-[10px] font-semibold text-white
                     sm:right-2 sm:top-2 sm:px-2 sm:text-[11px]"
          style={{ backgroundColor: BADGE_COLOR[product.rating.standard] }}
        >
          {formatRating(product)}
        </span>
      </div>

      {/* Name — clamp to 2 lines, scales with card width */}
      <p
        className="mb-2 line-clamp-2 leading-snug text-gray-700
                   text-xs sm:text-sm font-medium"
      >
        {product.name}
      </p>

      {/* Price + Add button */}
      <div className="mt-auto flex items-center justify-between">
        <span
          className="font-bold text-base sm:text-lg"
          style={{ color: "#5F2900" }}
        >
          {product.price} ฿
        </span>

        <button
          type="button"
          onClick={handleAdd}
          disabled={added}
          aria-label={`Add ${product.name} to loadout`}
          className="flex items-center justify-center rounded-full text-white shadow transition-all active:scale-95
                     h-8 w-8 text-lg sm:h-9 sm:w-9 sm:text-xl"
          style={{
            backgroundColor: added ? "#c8b0a0" : "#E68C52",
            cursor: added ? "default" : "pointer",
          }}
        >
          {added ? "✓" : "+"}
        </button>
      </div>
    </div>
  );
}
