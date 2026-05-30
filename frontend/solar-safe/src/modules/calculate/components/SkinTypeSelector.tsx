import type { SkinType } from '../types/calculate.types'

const SKIN_TYPES: { value: SkinType; label: string; desc: string; color: string }[] = [
  { value: 'I',   label: 'Type I (Very fair)',          desc: 'Light, pale white',      color: '#f5e6d3' },
  { value: 'II',  label: 'Type II (Fair)',              desc: 'White, fair',            color: '#e8c9a0' },
  { value: 'III', label: 'Type III (Medium)',           desc: 'Medium white to olive',  color: '#d4a574' },
  { value: 'IV',  label: 'Type IV (Olive)',             desc: 'Olive, mid brown',       color: '#b8864e' },
  { value: 'V',   label: 'Type V (Brown)',              desc: 'Brown, dark',            color: '#8b5e3c' },
  { value: 'VI',  label: 'Type VI (Dark brown/black)',  desc: 'Very dark brown, black', color: '#4a2c17' },
]

const panelCls = 'bg-amber-50/70 backdrop-blur-sm border-2 border-amber-300/60 rounded-2xl'
const activeBorder = 'border-amber-800 shadow-[0_0_0_2px_rgba(120,53,15,0.18)]'
const inactiveBorder = 'border-amber-200 hover:border-amber-500'

interface Props {
  value: SkinType | null
  onChange: (v: SkinType) => void
}

export default function SkinTypeSelector({ value, onChange }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow">
        1. Select Your Skin Type
      </p>
      {SKIN_TYPES.map(st => (
        <button
          key={st.value}
          onClick={() => onChange(st.value)}
          className={`${panelCls} flex items-center gap-3 px-3 py-2 rounded-xl border-2 text-left w-full transition-all bg-white/50
            ${value === st.value ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
        >
          <span className="w-7 h-7 rounded-lg shrink-0 border border-black/10" style={{ background: st.color }} />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-amber-950">{st.label}</span>
            <span className="text-xs text-amber-700">{st.desc}</span>
          </span>
        </button>
      ))}
    </section>
  )
}
