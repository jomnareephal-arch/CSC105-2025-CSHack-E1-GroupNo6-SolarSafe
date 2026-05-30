import { useState, useEffect, useRef } from "react";
import { plannerApi, type UVHour, type Activity, type ProtectiveEquipment } from "../api/plannerApi";
import UVIndexRow from "../components/planner/UVIndexRow";
import ScheduleList from "../components/planner/ScheduleList";
import EquipmentPanel from "../components/planner/EquipmentPanel";

export default function PlannerPage() {
  const [uvData, setUvData] = useState<UVHour[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [equipment, setEquipment] = useState<ProtectiveEquipment | null>(null);
  const [activityName, setActivityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    plannerApi.getUVToday().then((d) => setUvData(d.uvData)).catch(console.error);
    plannerApi
      .getActivities()
      .then((d) => {
        setActivities(d.activities);
        setEquipment(d.equipment);
      })
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    const name = activityName.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const result = await plannerApi.addActivity(name);
      setActivities((prev) =>
        [...prev, result.activity].sort((a, b) => a.startHour - b.startHour)
      );
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
        prev
          .map((a) => (a.id === id ? result.activity : a))
          .sort((a, b) => a.startHour - b.startHour)
      );
      setEquipment(result.equipment);
    } catch {
      setError("Failed to update activity.");
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-10">
      {/* Header */}
      <h1 className="font-display text-4xl md:text-5xl font-bold text-amber-950 mb-7">
        Planner
      </h1>

      {/* Error toast */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
          <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Add Activity */}
      <section className="mb-7">
        <h2 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          Add activity name
        </h2>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Activity name..."
            className="flex-1 bg-white/80 border-2 border-amber-400 rounded-2xl px-5 py-3 text-amber-900 placeholder:text-amber-300 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !activityName.trim()}
            className="bg-amber-100 hover:bg-amber-200 disabled:bg-amber-50 disabled:text-amber-300 text-amber-800 font-bold rounded-2xl px-7 py-3 border-2 border-amber-300 shadow transition-all active:scale-95 whitespace-nowrap"
          >
            {loading ? "..." : "+ Add"}
          </button>
        </div>
      </section>

      {/* UV Index */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-amber-900 mb-3 tracking-wide">
          UV INDEX — TODAY
        </h2>
        {uvData.length > 0 ? (
          <UVIndexRow uvData={uvData} />
        ) : (
          <p className="text-amber-400 text-sm">Loading UV data...</p>
        )}
      </section>

      {/* Schedule Activity */}
      <section className="mb-6">
        <h2 className="font-bold text-amber-900 text-base mb-3">Schedule Activity</h2>
        <div className="bg-white/50 border border-amber-300 rounded-2xl px-5 py-4 min-h-[160px] shadow-sm">
          <ScheduleList
            activities={activities}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      </section>

      {/* Recommended Protective Equipment */}
      <section>
        <h2 className="font-bold text-amber-900 text-base mb-3">Recommended protective equipment</h2>
        <div className="bg-white/50 border border-amber-300 rounded-2xl px-5 py-4 min-h-[140px] shadow-sm">
          <EquipmentPanel equipment={equipment} hasActivities={activities.length > 0} />
        </div>
      </section>
    </div>
  );
}
