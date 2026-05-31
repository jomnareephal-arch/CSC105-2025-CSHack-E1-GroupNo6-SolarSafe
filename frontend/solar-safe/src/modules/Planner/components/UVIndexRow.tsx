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
            const { bg, color } = uvBoxColors(h.uv);
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