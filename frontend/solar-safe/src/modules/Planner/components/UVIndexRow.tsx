import type { UVHour } from "../apis/plannerApi";

function uvBoxColors(level: string): { bg: string; color: string } {
  switch (level) {
    case "night":    return { bg: "#bbf7d0", color: "#166534" };
    case "low":      return { bg: "#fef08a", color: "#713f12" };
    case "moderate": return { bg: "#fdba74", color: "#7c2d12" };
    case "high":     return { bg: "#f87171", color: "#fff" };
    case "vhigh":    return { bg: "#b91c1c", color: "#fff" };
    default:         return { bg: "#bbf7d0", color: "#166534" };
  }
}

const LEGEND = [
  { label: "Night (0)",        bg: "#bbf7d0", border: "#86efac" },
  { label: "Low (20-26)",      bg: "#fef08a", border: "#fde047" },
  { label: "Moderate (27-35)", bg: "#fdba74", border: "#fb923c" },
  { label: "High (36-49)",     bg: "#f87171", border: "#ef4444" },
  { label: "Very High (50+)",  bg: "#b91c1c", border: "#991b1b" },
];

interface Props {
  uvData: UVHour[];
}

export default function UVIndexRow({ uvData }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: l.bg, border: `1px solid ${l.border}` }} />
            {l.label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 md:gap-1.5" style={{ minWidth: "max-content" }}>
          {uvData.map((h) => {
            const { bg, color } = uvBoxColors(h.level);
            return (
              <div key={h.hour}
                className="flex flex-col items-center justify-center rounded-xl py-2 px-1 w-[52px] md:w-[68px] shadow-sm"
                style={{ backgroundColor: bg, color }}
              >
                <span className="text-[10px] md:text-xs font-semibold opacity-80 mb-0.5">
                  {String(h.hour).padStart(2, "0")}:00
                </span>
                <span className="text-base md:text-xl font-bold leading-tight">
                  {h.uv > 0 ? h.uv : "-"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}