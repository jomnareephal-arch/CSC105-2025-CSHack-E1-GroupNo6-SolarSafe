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
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  return (
    <div
      className="flex flex-col rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md p-2 sm:p-3"
      style={{ border: isSelected ? "2px solid #E68C52" : "1px solid #f0ece8" }}
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
        <span
          className="absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5
                     text-[10px] font-semibold text-white
                     sm:right-2 sm:top-2 sm:px-2 sm:text-[11px]"
          style={{ backgroundColor: BADGE_COLOR[product.rating.standard] }}
        >
          {formatRating(product)}
        </span>
        {isSelected && (
          <div className="absolute top-1.5 left-1.5 rounded-full bg-green-500 text-white text-[10px] px-1.5 py-0.5 font-semibold">
            ✓ Selected
          </div>
        )}
      </div>

      {/* Name */}
      <p className="mb-2 line-clamp-2 leading-snug text-gray-700 text-xs sm:text-sm font-medium">
        {product.name}
      </p>

      {/* Price + Select button */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="font-bold text-base sm:text-lg" style={{ color: "#5F2900" }}>
          {product.price} ฿
        </span>

        <button
          type="button"
          onClick={() => onSelect(product)}
          className="rounded-full text-white text-xs font-semibold px-3 py-1.5 shadow transition-all active:scale-95"
          style={{ backgroundColor: isSelected ? "#7a9e6e" : "#E68C52", cursor: "pointer" }}
        >
          {isSelected ? "✓ Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
