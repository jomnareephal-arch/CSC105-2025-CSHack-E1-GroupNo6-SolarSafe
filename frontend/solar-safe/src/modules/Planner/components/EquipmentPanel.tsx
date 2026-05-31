import { useState, useEffect } from "react";
import type { Activity, ProtectiveEquipment } from "../apis/plannerApi";
import { getProducts } from "../../ProductRecommend/apis/productRecommend.api";
import type { Product, ProductCategory } from "../../ProductRecommend/types/productRecommend.type";

const ITEM_TO_CATEGORY: Record<string, ProductCategory> = {
  "Hat":                              "hats",
  "Wide-brimmed hat":                 "hats",
  "Sunglasses":                       "sunglasses",
  "Sunscreen SPF 30+":                "sunscreen",
  "Sunscreen SPF 50+":                "sunscreen",
  "Long-sleeved UV-protective shirt": "uv-jacket",
  "UV-protective clothing":           "uv-jacket",
  "UV-protective umbrella":           "umbrella",
};

const ALL_CATEGORIES: ProductCategory[] = ["hats", "sunglasses", "sunscreen", "umbrella", "uv-jacket"];

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  hats:        "Hat",
  sunglasses:  "Sunglasses",
  sunscreen:   "Sunscreen",
  umbrella:    "Umbrella",
  "uv-jacket": "UV Jacket",
};

const ITEM_ICON: Record<string, string> = {
  "Hat": "🧢",
  "Wide-brimmed hat": "👒",
  "Sunglasses": "🕶️",
  "Sunscreen SPF 30+": "🧴",
  "Sunscreen SPF 50+": "🧴",
  "Long-sleeved UV-protective shirt": "👕",
  "UV-protective clothing": "👗",
  "UV-protective umbrella": "☂️",
  "All types of protective equipment": "🛡️",
  "No special equipment needed": "✅",
};

const CATEGORY_ICON: Record<ProductCategory, string> = {
  hats:        "🧢",
  sunglasses:  "🕶️",
  sunscreen:   "🧴",
  umbrella:    "☂️",
  "uv-jacket": "🧥",
};

function uvMeta(uv: number): { label: string; bg: string; border: string; textColor: string; items: string[]; warning?: string } {
  if (uv <= 0)  return { label: "None",      bg: "#f1f5f9", border: "#cbd5e1", textColor: "#64748b", items: ["No special equipment needed"] };
  if (uv <= 10) return { label: "Low",       bg: "#dcfce7", border: "#86efac", textColor: "#15803d", items: ["Hat", "Sunglasses"] };
  if (uv <= 20) return { label: "Moderate",  bg: "#fef9c3", border: "#fde047", textColor: "#a16207", items: ["Sunscreen SPF 30+", "Hat", "Sunglasses"] };
  if (uv <= 30) return { label: "High",      bg: "#ffedd5", border: "#fdba74", textColor: "#c2410c", items: ["Sunscreen SPF 50+", "Hat", "Sunglasses", "Long-sleeved UV-protective shirt"] };
  if (uv <= 40) return { label: "Very High", bg: "#fee2e2", border: "#fca5a5", textColor: "#b91c1c", items: ["Sunscreen SPF 50+", "Wide-brimmed hat", "Sunglasses", "UV-protective umbrella", "UV-protective clothing"] };
  return              { label: "Extreme",    bg: "#f3e8ff", border: "#d8b4fe", textColor: "#7e22ce", items: ["All types of protective equipment"], warning: "Avoid outdoor activities. UV levels are extreme — use all types of protective equipment." };
}

interface Props {
  equipment: ProtectiveEquipment | null;
  hasActivities: boolean;
  activities: Activity[];
}

function ProductCard({ product, meta }: { product: Product; meta: ReturnType<typeof uvMeta> }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs min-w-0"
      style={{ background: meta.bg, borderColor: meta.border }}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/60"
        />
      ) : (
        <span className="text-base shrink-0">{CATEGORY_ICON[product.category] ?? "🔸"}</span>
      )}
      <div className="min-w-0">
        <p className="font-bold truncate leading-tight" style={{ color: meta.textColor }}>{product.name}</p>
        <p className="text-[10px] opacity-70 font-medium" style={{ color: meta.textColor }}>
          {product.rating.standard} {product.rating.value}{product.rating.plus ? "+" : ""} · {product.price.toLocaleString()} ฿
        </p>
      </div>
    </div>
  );
}

export default function EquipmentPanel({ hasActivities, activities }: Props) {
  const [bestByCategory, setBestByCategory] = useState<Map<ProductCategory, Product>>(new Map());

  useEffect(() => {
    getProducts()
      .then((products) => {
        const map = new Map<ProductCategory, Product>();
        for (const p of products) {
          const existing = map.get(p.category);
          if (!existing || p.protectionScore > existing.protectionScore) {
            map.set(p.category, p);
          }
        }
        setBestByCategory(map);
      })
      .catch(() => {});
  }, []);

  if (!hasActivities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-orange-300">
        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-sm font-semibold text-orange-300">Add activities to see recommendations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {activities.map((act) => {
        const meta = uvMeta(act.peakUV);

        // For "All types", expand to one product per category; otherwise map item → category
        const resolvedItems: { label: string; product: Product | null }[] =
          meta.items[0] === "All types of protective equipment"
            ? ALL_CATEGORIES.map((cat) => ({
                label: CATEGORY_LABEL[cat],
                product: bestByCategory.get(cat) ?? null,
              }))
            : meta.items.map((item) => {
                const cat = ITEM_TO_CATEGORY[item];
                return { label: item, product: cat ? (bestByCategory.get(cat) ?? null) : null };
              });

        return (
          <div key={act.id} className="bg-white border border-amber-100 rounded-2xl px-4 py-3 shadow-sm">
            {/* Activity header */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-amber-700 font-bold text-sm truncate">{act.name}</span>
                <span className="text-xs text-amber-500 whitespace-nowrap">
                  {String(act.startHour).padStart(2, "0")}:00 – {String(act.endHour).padStart(2, "0")}:00
                </span>
              </div>
              <span
                className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold border whitespace-nowrap"
                style={{ background: meta.bg, color: meta.textColor, borderColor: meta.border }}
              >
                UV {act.peakUV} · {meta.label}
              </span>
            </div>

            {meta.warning && (
              <div className="mb-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                <span>⚠️</span>
                <p className="text-xs font-semibold text-red-700">{meta.warning}</p>
              </div>
            )}

            {/* No equipment needed */}
            {meta.items[0] === "No special equipment needed" ? (
              <span
                className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold border"
                style={{ background: meta.bg, color: meta.textColor, borderColor: meta.border }}
              >
                <span className="text-sm">✅</span> No special equipment needed
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {resolvedItems.map(({ label, product }) =>
                  product ? (
                    <ProductCard key={label} product={product} meta={meta} />
                  ) : (
                    <span
                      key={label}
                      className="flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold border"
                      style={{ background: meta.bg, color: meta.textColor, borderColor: meta.border }}
                    >
                      <span className="text-sm">{ITEM_ICON[label] ?? "🔸"}</span>
                      {label}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
