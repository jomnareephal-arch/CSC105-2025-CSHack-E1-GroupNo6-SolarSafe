import type { ProtectiveEquipment } from "../../api/plannerApi";

const EQUIPMENT_ICONS: Record<string, string> = {
  "Sunglasses": "🕶️",
"Hat": "🧢",
"Wide-brimmed hat": "👒",
"Long-sleeved UV protection shirt": "👕",
"Sunscreen SPF 30+": "🧴",
"Sunscreen SPF 50+": "🧴",
"UV protection clothing": "👗",
"UV umbrella": "☂️",
"All types of protective equipment": "🛡️",
"No special equipment needed": "✅",
};

interface Props {
  equipment: ProtectiveEquipment | null;
  hasActivities: boolean;
}

export default function EquipmentPanel({ equipment, hasActivities }: Props) {
  if (!hasActivities || !equipment) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-sm text-gray-400">Recommendations will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-amber-900">ระดับ UV สูงสุด:</span>
        <span className="bg-amber-600 text-white text-xs font-bold rounded-full px-3 py-0.5">
          {equipment.level}
        </span>
      </div>

      {equipment.warning && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <p className="text-sm text-red-700 font-semibold">{equipment.warning}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {equipment.items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1.5 bg-white/70 border border-amber-200 rounded-xl px-3 py-2 shadow-sm"
          >
            <span className="text-lg">{EQUIPMENT_ICONS[item] ?? "🔸"}</span>
            <span className="text-sm font-semibold text-amber-900">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
