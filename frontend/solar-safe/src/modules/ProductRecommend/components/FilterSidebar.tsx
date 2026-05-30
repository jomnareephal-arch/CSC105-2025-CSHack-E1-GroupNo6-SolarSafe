import type { PriceRangeId, PriceRangeOption, ProductFilter } from "../types/productRecommend.type";

export const PRICE_RANGE_OPTIONS: PriceRangeOption[] = [
  { id: "under-100", label: "Under 100 Baht", min: 0,   max: 100 },
  { id: "100-300",   label: "100 - 300 Baht",  min: 100, max: 300 },
  { id: "above-300", label: "Above 300 Baht",  min: 300, max: null },
];

const SCORE_MIN  = 50;
const SCORE_MAX  = 120;
const SCORE_STEP = 10;

// Slider with a floating circle showing the current value above the thumb.
// Steps of 10, range 50-120, no tick marks.
function ScoreSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const pct = ((value - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;

  // Position the circle so its center tracks the thumb.
  // Thumb is ~18px wide; effective travel = trackWidth - 18px.
  // left = pct% of (trackWidth - 28px) + some offset so it doesn't clip edges.
  const circleLeft = `clamp(0px, calc(${pct / 100} * (100% - 28px) + 5px), calc(100% - 28px))`;

  return (
    <div className="relative">
      {/* Value circle floating above the thumb */}
      <div className="relative h-7">
        <div
          className="absolute top-0 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md"
          style={{ left: circleLeft, backgroundColor: "#E68C52" }}
        >
          {value}
        </div>
      </div>

      {/* Range bar */}
      <input
        type="range"
        min={SCORE_MIN}
        max={SCORE_MAX}
        step={SCORE_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "#E68C52" }}
        aria-label="Minimum protection score"
      />

      {/* Edge labels */}
      <div className="mt-0.5 flex justify-between text-[10px] uppercase text-gray-400">
        <span>BASIC</span>
        <span>MAX</span>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => void;
}

export default function FilterSidebar({ filter, onChange }: FilterSidebarProps) {
  const togglePriceRange = (id: PriceRangeId) => {
    const next = filter.priceRanges.includes(id)
      ? filter.priceRanges.filter((p) => p !== id)
      : [...filter.priceRanges, id];
    onChange({ ...filter, priceRanges: next });
  };

  const handleScore = (raw: number) => {
    const snapped = Math.round((raw - SCORE_MIN) / SCORE_STEP) * SCORE_STEP + SCORE_MIN;
    onChange({
      ...filter,
      minProtectionScore: Math.min(Math.max(snapped, SCORE_MIN), SCORE_MAX),
    });
  };

  return (
    <aside className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Header */}
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <svg className="h-3.5 w-3.5" style={{ color: "#E68C52" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
        Filter
      </h2>

      {/* Price Range */}
      <section className="mb-5">
        <h3 className="mb-2 text-xs font-semibold text-gray-600">Price Range</h3>
        <div className="flex flex-col gap-1.5">
          {PRICE_RANGE_OPTIONS.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={filter.priceRanges.includes(option.id)}
                onChange={() => togglePriceRange(option.id)}
                className="h-3.5 w-3.5 rounded border-gray-300"
                style={{ accentColor: "#E68C52" }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      {/* Protection Score */}
      <section>
        <h3 className="mb-3 text-xs font-semibold text-gray-600">Protection Score</h3>
        <ScoreSlider value={filter.minProtectionScore} onChange={handleScore} />
      </section>
    </aside>
  );
}
