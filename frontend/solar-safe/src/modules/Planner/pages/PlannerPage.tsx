import { useState, useEffect, useRef } from "react";
import { plannerApi, type UVHour, type Activity, type ProtectiveEquipment } from "../apis/plannerApi";
import UVIndexRow from "../components/UVIndexRow";
import ScheduleList from "../components/ScheduleList";
import EquipmentPanel from "../components/EquipmentPanel";

const SAMPLE_UV: UVHour[] = [
  { hour: 0, uv: 0, level: "night" }, { hour: 1, uv: 0, level: "night" },
  { hour: 2, uv: 0, level: "night" }, { hour: 3, uv: 0, level: "night" },
  { hour: 4, uv: 0, level: "night" }, { hour: 5, uv: 0, level: "night" },
  { hour: 6, uv: 20, level: "low" },  { hour: 7, uv: 23, level: "low" },
  { hour: 8, uv: 26, level: "low" },  { hour: 9, uv: 30, level: "moderate" },
  { hour: 10, uv: 34, level: "moderate" }, { hour: 11, uv: 37, level: "high" },
  { hour: 12, uv: 52, level: "vhigh" },    { hour: 13, uv: 50, level: "vhigh" },
  { hour: 14, uv: 47, level: "high" },     { hour: 15, uv: 36, level: "high" },
  { hour: 16, uv: 29, level: "moderate" }, { hour: 17, uv: 25, level: "low" },
  { hour: 18, uv: 0, level: "night" }, { hour: 19, uv: 0, level: "night" },
  { hour: 20, uv: 0, level: "night" }, { hour: 21, uv: 0, level: "night" },
  { hour: 22, uv: 0, level: "night" }, { hour: 23, uv: 0, level: "night" },
];

export default function PlannerPage() {
  const [uvData, setUvData] = useState<UVHour[]>(SAMPLE_UV);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [equipment, setEquipment] = useState<ProtectiveEquipment | null>(null);
  const [activityName, setActivityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    plannerApi.getUVToday().then((d) => setUvData(d.uvData)).catch(() => {});
    plannerApi.getActivities().then((d) => {
      setActivities(d.activities);
      setEquipment(d.equipment);
    }).catch(() => {});
  }, []);

  const handleAdd = async () => {
    const name = activityName.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const result = await plannerApi.addActivity(name);
      setActivities((prev) => [...prev, result.activity].sort((a, b) => a.startHour - b.startHour));
      setEquipment(result.equipment);
      setActivityName("");
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
    <div className="min-h-screen p-4 md:p-10">
      <h1 className="text-3xl md:text-5xl font-bold text-amber-950 mb-5 md:mb-7">Planner</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
          <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Add Activity */}
      <section className="mb-5 md:mb-7">
        <h2 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          Add activity name
        </h2>
        <div className="flex gap-2 md:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Activity name..."
            className="flex-1 min-w-0 bg-white/80 border-2 border-amber-400 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-amber-900 placeholder:text-amber-300 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !activityName.trim()}
            className="bg-amber-100 hover:bg-amber-200 disabled:opacity-40 text-amber-800 font-bold rounded-2xl px-4 md:px-7 py-2.5 md:py-3 border-2 border-amber-300 shadow text-sm md:text-base whitespace-nowrap transition-all active:scale-95"
          >
            {loading ? "..." : "+ Add"}
          </button>
        </div>
      </section>

      {/* UV Index */}
      <section className="mb-5 md:mb-8">
        <h2 className="text-sm md:text-base font-bold text-amber-900 mb-3 tracking-wide">UV INDEX — TODAY</h2>
        <UVIndexRow uvData={uvData} />
      </section>

      {/* Schedule Activity */}
      <section className="mb-5 md:mb-6">
        <h2 className="text-sm md:text-base font-bold text-amber-900 mb-3">Schedule Activity</h2>
        <div className="bg-white/50 border border-amber-300 rounded-2xl px-3 md:px-5 py-4 min-h-[160px] shadow-sm">
          <ScheduleList activities={activities} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
      </section>

      {/* Recommended Protective Equipment */}
      <section className="pb-8">
        <h2 className="text-sm md:text-base font-bold text-amber-900 mb-3">Recommended protective equipment</h2>
        <div className="bg-white/50 border border-amber-300 rounded-2xl px-3 md:px-5 py-4 min-h-[140px] shadow-sm">
          <EquipmentPanel equipment={equipment} hasActivities={activities.length > 0} />
        </div>
      </section>
    </div>
  );
}