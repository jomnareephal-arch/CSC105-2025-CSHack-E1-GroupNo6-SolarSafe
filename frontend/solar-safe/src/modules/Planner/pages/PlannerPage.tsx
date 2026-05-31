import { useState, useEffect, useRef } from "react";
import { plannerApi, type UVHour, type Activity, type ProtectiveEquipment } from "../apis/plannerApi";
import UVIndexRow from "../components/UVIndexRow";
import ScheduleList from "../components/ScheduleList";
import EquipmentPanel from "../components/EquipmentPanel";

const SAMPLE_UV: UVHour[] = [
  { hour: 0,  uv: 0,  level: "night" }, { hour: 1,  uv: 0,  level: "night" },
  { hour: 2,  uv: 0,  level: "night" }, { hour: 3,  uv: 0,  level: "night" },
  { hour: 4,  uv: 0,  level: "night" }, { hour: 5,  uv: 0,  level: "night" },
  { hour: 6,  uv: 20, level: "low"   }, { hour: 7,  uv: 23, level: "low"   },
  { hour: 8,  uv: 26, level: "low"   }, { hour: 9,  uv: 30, level: "moderate" },
  { hour: 10, uv: 34, level: "moderate" }, { hour: 11, uv: 37, level: "high" },
  { hour: 12, uv: 52, level: "vhigh" }, { hour: 13, uv: 50, level: "vhigh" },
  { hour: 14, uv: 47, level: "high"  }, { hour: 15, uv: 36, level: "high"  },
  { hour: 16, uv: 29, level: "moderate" }, { hour: 17, uv: 25, level: "low" },
  { hour: 18, uv: 0,  level: "night" }, { hour: 19, uv: 0,  level: "night" },
  { hour: 20, uv: 0,  level: "night" }, { hour: 21, uv: 0,  level: "night" },
  { hour: 22, uv: 0,  level: "night" }, { hour: 23, uv: 0,  level: "night" },
];

const DURATIONS: { value: 15 | 30 | 60; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hr"   },
];

export default function PlannerPage() {
  const [uvData,        setUvData]        = useState<UVHour[]>(SAMPLE_UV);
  const [activities,    setActivities]    = useState<Activity[]>([]);
  const [equipment,     setEquipment]     = useState<ProtectiveEquipment | null>(null);
  const [activityName,  setActivityName]  = useState("");
  const [selectedHour,  setSelectedHour]  = useState<number | null>(null);
  const [duration,      setDuration]      = useState<15 | 30 | 60>(60);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchUV = () => {
    plannerApi.getUVToday().then((d) => setUvData(d.uvData)).catch(() => {});
  };

  useEffect(() => {
    fetchUV();
    plannerApi.getActivities().then((d) => {
      setActivities(d.activities);
      setEquipment(d.equipment);
    }).catch(() => {});

    const onVisible = () => { if (document.visibilityState === "visible") fetchUV(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const handleAdd = async () => {
    const name = activityName.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const result = await plannerApi.addActivity(
        name,
        selectedHour ?? undefined,
        duration
      );
      setActivities((prev) =>
        [...prev, result.activity].sort((a, b) => a.startHour - b.startHour)
      );
      setEquipment(result.equipment);
      setActivityName("");
      setSelectedHour(null);
      inputRef.current?.focus();
    } catch {
      setError("Failed to add activity. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await plannerApi.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setEquipment(result.equipment);
    } catch {
      setError("Failed to delete activity.");
    }
  };

  const handleUpdate = async (id: string, name: string) => {
    try {
      const result = await plannerApi.updateActivity(id, name);
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? result.activity : a)).sort((a, b) => a.startHour - b.startHour)
      );
      setEquipment(result.equipment);
    } catch {
      setError("Failed to update activity.");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-amber-950 mb-5 md:mb-6">Planner</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
          <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ── Add activity ──────────────────────────────────────────── */}
      <section className="mb-5">
        <div className="flex gap-2 md:gap-3 mb-3">
          <input
            ref={inputRef}
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Activity name..."
            className="flex-1 min-w-0 bg-white/80 border-2 border-amber-400 rounded-2xl px-4 py-2.5 text-amber-900 placeholder:text-orange-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !activityName.trim()}
            className="bg-amber-100 hover:bg-amber-400 disabled:opacity-40 text-amber-800 font-bold rounded-2xl px-5 py-2.5 border-2 border-amber-500 shadow text-sm whitespace-nowrap transition-all active:scale-95"
          >
            {loading ? "…" : "+ Add"}
          </button>
        </div>

        {/* Duration pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-700">Duration:</span>
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDuration(d.value)}
              className="text-xs font-bold px-3 py-1 rounded-full border-2 transition-all"
              style={
                duration === d.value
                  ? { backgroundColor: "#92400e", borderColor: "#92400e", color: "#fff" }
                  : { backgroundColor: "transparent", borderColor: "#d97706", color: "#92400e" }
              }
            >
              {d.label}
            </button>
          ))}
          {selectedHour === null && (
            <span className="ml-1 text-[11px] text-amber-500 italic">
              (click a time slot below to set start, or auto-schedule)
            </span>
          )}
        </div>
      </section>

      {/* ── UV Index ──────────────────────────────────────────────── */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-amber-900 mb-2 tracking-wide uppercase">UV Index — Today</h2>
        <UVIndexRow
          uvData={uvData}
          selectedHour={selectedHour}
          onSelectHour={setSelectedHour}
        />
      </section>

      {/* ── Schedule ──────────────────────────────────────────────── */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-amber-900 mb-2 uppercase tracking-wide">Schedule</h2>
        <div className="bg-white/50 border border-amber-300 rounded-2xl px-3 md:px-5 py-4 min-h-[140px] shadow-sm">
          <ScheduleList activities={activities} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
      </section>

      {/* ── Equipment ─────────────────────────────────────────────── */}
      <section className="pb-8">
        <h2 className="text-sm font-bold text-amber-900 mb-2 uppercase tracking-wide">Recommended Equipment</h2>
        <div className="bg-white/50 border border-amber-300 rounded-2xl px-3 md:px-5 py-4 min-h-[120px] shadow-sm">
          <EquipmentPanel equipment={equipment} hasActivities={activities.length > 0} activities={activities} />
        </div>
      </section>
    </div>
  );
}
