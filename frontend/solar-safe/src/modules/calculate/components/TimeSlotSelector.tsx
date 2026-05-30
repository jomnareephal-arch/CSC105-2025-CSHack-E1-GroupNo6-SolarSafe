import type { TimeSlot } from '../types/calculate.types'

const TIME_SLOTS: TimeSlot[] = [
  '06:00','07:00','08:00','09:00','10:00','11:00',
  '12:00','13:00','14:00','15:00','16:00','17:00',
]

const panelCls = 'bg-amber-50/70 backdrop-blur-sm border-2 border-amber-300/60 rounded-2xl'
const activeBorder = 'border-amber-800 shadow-[0_0_0_2px_rgba(120,53,15,0.18)]'

interface Props {
  value: TimeSlot | null
  onChange: (v: TimeSlot) => void
}

export default function TimeSlotSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow mb-1">
        2. Select Time
      </p>
      <div className={`${panelCls} p-2 max-h-48 overflow-y-auto flex flex-col gap-1
                      [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-amber-500 [&::-webkit-scrollbar-thumb]:rounded-full`}>
        {TIME_SLOTS.map(slot => (
          <button
            key={slot}
            onClick={() => onChange(slot)}
            className={`px-4 py-2 rounded-xl border-2 text-base font-semibold text-amber-950 transition-all bg-white/50
              ${value === slot ? activeBorder + ' bg-amber-100/80' : 'border-transparent hover:bg-amber-100/60'}`}
          >
            {slot} – {String(parseInt(slot) + 1).padStart(2, '0')}:59
          </button>
        ))}
      </div>
    </div>
  )
}
