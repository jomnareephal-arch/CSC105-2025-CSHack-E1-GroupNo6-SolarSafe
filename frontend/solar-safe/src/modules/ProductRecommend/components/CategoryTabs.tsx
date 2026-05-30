import type { CategoryTab, ProductCategory } from "../types/productRecommend.type";

export const CATEGORY_TABS: CategoryTab[] = [
  { value: "hats",       label: "Hats" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "sunscreen",  label: "Sunscreen" },
  { value: "umbrella",   label: "Umbrella" },
  { value: "uv-jacket",  label: "UV jacket" },
];

interface CategoryTabsProps {
  active: ProductCategory;
  onChange: (category: ProductCategory) => void;
  categories?: CategoryTab[];
}

export default function CategoryTabs({
  active,
  onChange,
  categories = CATEGORY_TABS,
}: CategoryTabsProps) {
  return (
    // flex row — each button flex-1 so all tabs share width equally (matches mockup)
    <nav className="flex gap-3 w-full">
      {categories.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-pressed={isActive}
            className={[
              "flex-1 rounded-xl border py-3 text-sm font-medium shadow-sm transition-all",
              isActive
                ? "border-orange-300 bg-white font-semibold text-orange-500 shadow-md"
                : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:text-orange-400",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
