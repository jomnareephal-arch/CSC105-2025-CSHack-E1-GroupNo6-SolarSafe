import { useState } from "react";
import type { Activity } from "../apis/plannerApi";

interface Props {
  activities: Activity[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
}

function uvBadgeBg(uv: number): { bg: string; color: string } {
  if (uv === 0)  return { bg: "#dcfce7", color: "#166534" };
  if (uv <= 26)  return { bg: "#fef9c3", color: "#713f12" };
  if (uv <= 35)  return { bg: "#ffedd5", color: "#7c2d12" };
  if (uv <= 49)  return { bg: "#fee2e2", color: "#b91c1c" };
  return { bg: "#7f1d1d", color: "#fff" };
}

export default function ScheduleList({ activities, onDelete, onUpdate }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-amber-400">
        <svg className="w-10 h-10 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.5} />
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.5} />
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.5} />
          <line x1="8" y1="14" x2="16" y2="14" strokeWidth={1.5} />
        </svg>
        <p className="text-sm font-semibold text-amber-600">No activities yet — add one above</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {activities.map((act) => {
        const badge = uvBadgeBg(act.peakUV);
        return (
          <div key={act.id}
            className="bg-white/60 rounded-2xl px-3 md:px-4 py-3 border border-amber-100 shadow-sm"
          >
            <div className="flex items-start gap-2 md:gap-3">
              {/* Time badge */}
              <div className="flex-shrink-0 bg-amber-600 text-white rounded-xl px-2 md:px-3 py-2 text-center min-w-[54px] md:min-w-[68px]">
                <div className="text-[11px] font-bold">{String(act.startHour).padStart(2, "0")}:00</div>
                <div className="text-[10px] opacity-70">–</div>
                <div className="text-[11px] font-bold">{String(act.endHour).padStart(2, "0")}:00</div>
              </div>

              {/* Name + reason */}
              <div className="flex-1 min-w-0">
                {editId === act.id ? (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <input
                      className="flex-1 min-w-0 border border-amber-300 rounded-lg px-2 py-1 text-sm font-semibold text-amber-900 bg-white outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { onUpdate(act.id, editName); setEditId(null); }
                        if (e.key === "Escape") setEditId(null);
                      }}
                      autoFocus
                    />
                    <button onClick={() => { onUpdate(act.id, editName); setEditId(null); }}
                      className="text-xs bg-amber-500 text-white rounded-lg px-3 py-1 font-bold whitespace-nowrap">Save</button>
                    <button onClick={() => setEditId(null)}
                      className="text-xs bg-gray-200 text-gray-700 rounded-lg px-2 py-1 whitespace-nowrap">Cancel</button>
                  </div>
                ) : (
                  <p className="font-bold text-amber-900 truncate text-base md:text-lg">{act.name}</p>
                )}
                <p className="text-sm text-amber-600 mt-0.5 line-clamp-2">{act.reason}</p>
              </div>

              {/* UV badge + actions */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
                  style={{ background: badge.bg, color: badge.color }}>
                  UV {act.peakUV}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditId(act.id); setEditName(act.name); }}
                    className="text-amber-400 hover:text-amber-600 p-0.5" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => onDelete(act.id)}
                    className="text-red-300 hover:text-red-500 p-0.5" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
