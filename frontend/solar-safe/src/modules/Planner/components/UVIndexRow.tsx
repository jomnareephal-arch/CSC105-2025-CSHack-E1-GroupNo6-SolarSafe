import type { UVHour } from "../apis/plannerApi";

function uvBoxColors(uv: number): { bg: string; color: string } {
  if (uv === 0)  return { bg: "#22C55E", color: "#fff" };
  if (uv <= 10)  return { bg: "#22C55E", color: "#fff" };
  if (uv <= 20)  return { bg: "#EAB308", color: "#fff" };
  if (uv <= 30)  return { bg: "#F97316", color: "#fff" };
  if (uv <= 40)  return { bg: "#EF4444", color: "#fff" };
  return           { bg: "#9333EA", color: "#fff" };
}

const LEGEND = [
  { label: "0–10 Low",        bg: "#22C55E", border: "#16A34A" },
  { label: "11–20 Moderate",  bg: "#EAB308", border: "#CA8A04" },
  { label: "21–30 High",      bg: "#F97316", border: "#EA580C" },
  { label: "31–40 Very High", bg: "#EF4444", border: "#DC2626" },
  { label: "41+ Extreme",     bg: "#9333EA", border: "#7E22CE" },
];

interface Props {
  uvData: UVHour[];
  selectedHour: number | null;
  onSelectHour: (hour: number | null) => void;
}

export default function UVIndexRow({ uvData, selectedHour, onSelectHour }: Props) {
  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: l.bg, border: `1px solid ${l.border}` }} />
            {l.label}
          </span>
        ))}
      </div>

      {/*
        pt-3 pb-4: vertical breathing room so scale(1.15) doesn't get clipped by overflow-x-auto.
        overflow-x-auto clips at the padding edge, so padding accommodates the transform.
        Custom scrollbar: taller track (h-2) with amber colouring.
      */}
      <div
        className={[
          "overflow-x-auto pt-3 pb-4",
          "[&::-webkit-scrollbar]:h-2",
          "[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-amber-100",
          "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-400",
          "[&::-webkit-scrollbar-thumb:hover]:bg-amber-600",
        ].join(" ")}
      >
        <div className="flex gap-1 md:gap-1.5" style={{ minWidth: "max-content" }}>
          {uvData.map((h) => {
            const { bg, color } = uvBoxColors(h.uv);
            const isSelected  = h.hour === selectedHour;
            const isClickable = h.uv > 0;

            return (
              <button
                key={h.hour}
                type="button"
                disabled={!isClickable}
                onClick={() => onSelectHour(isSelected ? null : h.hour)}
                className="flex flex-col items-center justify-center rounded-xl py-2 px-1 w-[52px] md:w-[68px] transition-transform duration-150 relative"
                style={{
                  backgroundColor: bg,
                  color,
                  cursor: isClickable ? "pointer" : "default",
                  transform: isSelected ? "scale(1.15)" : "scale(1)",
                  // box-shadow ring: white inner gap + dark outer ring.
                  // Unlike outline, box-shadow is painted inside the overflow padding so it won't clip.
                  boxShadow: isSelected
                    ? `0 0 0 2.5px #fff, 0 0 0 5px #1a1a1a, 0 4px 12px rgba(0,0,0,0.25)`
                    : "0 1px 3px rgba(0,0,0,0.10)",
                  zIndex: isSelected ? 10 : 1,
                }}
              >
                <span className="text-[10px] md:text-xs font-semibold opacity-80 mb-0.5">
                  {String(h.hour).padStart(2, "0")}:00
                </span>
                <span className="text-base md:text-xl font-bold leading-tight">
                  {h.uv > 0 ? h.uv : "—"}
                </span>
                {isSelected && (
                  <span className="text-[9px] font-black mt-0.5">▲</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected hour status */}
      {selectedHour !== null && (() => {
        const h = uvData.find((d) => d.hour === selectedHour);
        if (!h) return null;
        const { bg, color } = uvBoxColors(h.uv);
        return (
          <p className="mt-1 text-xs font-semibold text-amber-800">
            Start time:{" "}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold text-[11px]"
              style={{ backgroundColor: bg, color }}
            >
              {String(h.hour).padStart(2, "0")}:00 · UV {h.uv}
            </span>
            <button
              onClick={() => onSelectHour(null)}
              className="ml-2 text-amber-400 hover:text-amber-700 transition-colors"
            >
              ✕ clear
            </button>
          </p>
        );
      })()}
    </div>
  );
}
