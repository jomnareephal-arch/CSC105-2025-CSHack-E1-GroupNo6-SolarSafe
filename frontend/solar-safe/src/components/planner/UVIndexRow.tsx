import type { UVHour } from "../../api/plannerApi";

function uvBoxStyle(level: string): string {
  switch (level) {
    case "low":      return "bg-yellow-200 text-yellow-900";
    case "moderate": return "bg-orange-300 text-orange-900";
    case "high":     return "bg-red-400 text-white";
    case "vhigh":    return "bg-red-700 text-white";
    default:         return "bg-yellow-200 text-yellow-900";
  }
}

interface Props {
  uvData: UVHour[];
}

export default function UVIndexRow({ uvData }: Props) {
  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3 text-xs font-medium text-amber-800">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-300" />
          Low (20-26)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-orange-300 border border-orange-400" />
          Moderate (27–35)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-400 border border-red-500" />
          High (36–49)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-700 border border-red-800" />
          Very High (50+)
        </span>
      </div>

      {/* UV boxes */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5" style={{ minWidth: "max-content" }}>
          {uvData.map((h) => (
            <div
              key={h.hour}
              className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 w-[68px] font-bold shadow-sm ${uvBoxStyle(h.level)}`}
            >
              <span className="text-xs font-semibold opacity-80 mb-0.5">
                {String(h.hour).padStart(2, "0")}:00
              </span>
              <span className="text-xl leading-tight font-bold">
                {h.uv > 0 ? h.uv : "–"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
