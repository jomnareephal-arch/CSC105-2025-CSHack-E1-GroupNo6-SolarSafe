import { useState, useEffect, useRef, useCallback } from 'react'
import backgroundImg from '../../assets/background.png'
import { fetchProtectionConfig, createCalculation, updateCalculation } from '../../api'

type SkinType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'
type ProtectionItemType = 'hat' | 'sunscreen' | 'sunglasses' | 'umbrella' | 'uvJacket'
type TimeSlot =
  | '06:00' | '07:00' | '08:00' | '09:00' | '10:00' | '11:00'
  | '12:00' | '13:00' | '14:00' | '15:00' | '16:00' | '17:00'

interface SunscreenComponent  { type: 'sunscreen';  spf: number }
interface UvJacketComponent   { type: 'uvJacket';   upf: number }
interface HatComponent        { type: 'hat';        hat_factor: number }
interface UmbrellaComponent   { type: 'umbrella';   umbrella_factor: number }
interface SunglassesComponent { type: 'sunglasses'; glass_factor: number }

type ProtectionComponent =
  | SunscreenComponent
  | UvJacketComponent
  | HatComponent
  | UmbrellaComponent
  | SunglassesComponent

interface ProtectionConfigItem {
  type: ProtectionItemType
  label: string
  icon: string
  field: string
}

const DEFAULT_PROT_CONFIG: ProtectionConfigItem[] = [
  { type: 'sunscreen',  label: 'Sunscreen',  icon: '🧴', field: 'spf'             },
  { type: 'uvJacket',   label: 'UV Jacket',  icon: '🧥', field: 'upf'             },
  { type: 'hat',        label: 'Hat',        icon: '🎩', field: 'hat_factor'      },
  { type: 'umbrella',   label: 'Umbrella',   icon: '☂️', field: 'umbrella_factor' },
  { type: 'sunglasses', label: 'Sunglasses', icon: '🕶️', field: 'glass_factor'   },
]

const MOCK_PROTECTION_VALUES: Record<ProtectionItemType, number> = {
  sunscreen: 50, uvJacket: 30, hat: 70, umbrella: 80, sunglasses: 60,
}

interface CalcResult { id: number; safeOutdoorMinutes: number }

const SKIN_TYPES: { value: SkinType; label: string; desc: string; color: string }[] = [
  { value: 'I',   label: 'Type I (Very fair)',         desc: 'Light, pale white',      color: '#f5e6d3' },
  { value: 'II',  label: 'Type II (Fair)',             desc: 'White, fair',            color: '#e8c9a0' },
  { value: 'III', label: 'Type III (Medium)',          desc: 'Medium white to olive',  color: '#d4a574' },
  { value: 'IV',  label: 'Type IV (Olive)',            desc: 'Olive, mid brown',       color: '#b8864e' },
  { value: 'V',   label: 'Type V (Brown)',             desc: 'Brown, dark',            color: '#8b5e3c' },
  { value: 'VI',  label: 'Type VI (Dark brown/black)', desc: 'Very dark brown, black', color: '#4a2c17' },
]

const TIME_SLOTS: TimeSlot[] = [
  '06:00','07:00','08:00','09:00','10:00','11:00',
  '12:00','13:00','14:00','15:00','16:00','17:00',
]

function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function buildComponents(
  selectedValues: Map<ProtectionItemType, number>,
  config: ProtectionConfigItem[]
): ProtectionComponent[] {
  const result: ProtectionComponent[] = []
  for (const item of config) {
    const val = selectedValues.get(item.type)
    if (val !== undefined) {
      result.push({ type: item.type, [item.field]: val } as unknown as ProtectionComponent)
    }
  }
  return result
}

export default function CalculatePage() {
  const [skinType,       setSkinType]       = useState<SkinType | null>(null)
  const [timeSlot,       setTimeSlot]       = useState<TimeSlot | null>(null)
  const [selectedValues, setSelectedValues] = useState<Map<ProtectionItemType, number>>(new Map())
  const [noneSelected,   setNoneSelected]   = useState(false)
  const [safeMin,        setSafeMin]        = useState(0)
  const [loading,        setLoading]        = useState(false)
  const [protConfig,     setProtConfig]     = useState<ProtectionConfigItem[]>(DEFAULT_PROT_CONFIG)
  const resultIdRef = useRef<number | null>(null)

  useEffect(() => {
    fetchProtectionConfig()
      .then((config: ProtectionConfigItem[]) => setProtConfig(config))
      .catch(() => {})
  }, [])

  const [secs,    setSecs]    = useState(0)
  const [running, setRunning] = useState(false)
  const [, setWarned]  = useState<Set<number>>(new Set())
  const [notif,   setNotif]   = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const showNotif = useCallback((msg: string) => {
    setNotif(msg)
    setTimeout(() => setNotif(null), 4000)
  }, [])

  useEffect(() => {
    const hasProtection = noneSelected || selectedValues.size > 0
    if (!skinType || !timeSlot || !hasProtection) return

    const protectionComponents = buildComponents(selectedValues, protConfig)
    setLoading(true)
    const id = resultIdRef.current
    const payload = { skinType, outdoorTime: timeSlot, protectionComponents }

    const req = id ? updateCalculation(id, payload) : createCalculation(payload)
    req
      .then((data: CalcResult) => { resultIdRef.current = data.id; applyMins(data.safeOutdoorMinutes) })
      .catch(() => showNotif('⚠️ Cannot connect to server'))
      .finally(() => setLoading(false))
  }, [skinType, timeSlot, selectedValues, noneSelected, protConfig, showNotif])

  function applyMins(mins: number) {
    setSafeMin(mins); stopTimer(); setSecs(mins * 60); setWarned(new Set())
  }

  function stopTimer() {
    setRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function handleReset() {
    stopTimer(); setSecs(safeMin * 60); setWarned(new Set())
  }

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSecs(prev => {
          const next = prev - 1
          if (next <= 0) {
            setRunning(false); clearInterval(timerRef.current!)
            showNotif('⚠️ Time is up! Go inside now!'); return 0
          }
          const mLeft = Math.floor(next / 60)
          if ([10, 5, 1].includes(mLeft) && next % 60 === 0) {
            setWarned(w => {
              if (!w.has(mLeft)) {
                showNotif(`⚠️ ${mLeft} minute${mLeft > 1 ? 's' : ''} remaining!`)
                return new Set([...w, mLeft])
              }
              return w
            })
          }
          return next
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, showNotif])

  function toggleItem(type: ProtectionItemType) {
    setNoneSelected(false)
    setSelectedValues(prev => {
      const n = new Map(prev)
      if (n.has(type)) { n.delete(type) } else { n.set(type, MOCK_PROTECTION_VALUES[type]) }
      return n
    })
  }

  function selectNone() { setNoneSelected(true); setSelectedValues(new Map()) }

  const safeH = Math.floor(safeMin / 60)
  const safeM = safeMin % 60
  const resultLabel = loading ? '…' : safeMin === 0 ? '-- mins' : safeH > 0 ? `${safeH} hr ${safeM} mins` : `${safeMin} mins`
  const isUrgent = secs <= 60 && secs > 0

  const panelCls = 'bg-amber-50/70 backdrop-blur-sm border-2 border-amber-300/60 rounded-2xl'
  const activeBorder = 'border-amber-800 shadow-[0_0_0_2px_rgba(120,53,15,0.18)]'
  const inactiveBorder = 'border-amber-200 hover:border-amber-500'

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start p-5 gap-3"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {notif && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl text-sm">
          {notif}
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-amber-900 drop-shadow-md tracking-tight mt-2">
        ☀️ Sun Safety Calculate ✨
      </h1>

      <div className="w-full max-w-[860px] grid grid-cols-2 gap-5 items-start max-[620px]:grid-cols-1">

        {/* ── LEFT: Skin Type ── */}
        <section className="flex flex-col gap-2">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow">
            1. Select Your Skin Type
          </p>
          {SKIN_TYPES.map(st => (
            <button
              key={st.value}
              onClick={() => setSkinType(st.value)}
              className={`${panelCls} flex items-center gap-3 px-3 py-2 rounded-xl border-2 text-left w-full transition-all bg-white/50
                ${skinType === st.value ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
            >
              <span className="w-7 h-7 rounded-lg shrink-0 border border-black/10" style={{ background: st.color }} />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-amber-950">{st.label}</span>
                <span className="text-xs text-amber-700">{st.desc}</span>
              </span>
            </button>
          ))}
        </section>

        {/* ── RIGHT ── */}
        <section className="flex flex-col gap-3">

          {/* Time */}
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow mb-1">
              2. Select Time
            </p>
            <div className={`${panelCls} p-2 max-h-48 overflow-y-auto flex flex-col gap-1
                            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-amber-500 [&::-webkit-scrollbar-thumb]:rounded-full`}>
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`px-4 py-2 rounded-xl border-2 text-base font-semibold text-amber-950 transition-all bg-white/50
                    ${timeSlot === slot ? activeBorder + ' bg-amber-100/80' : 'border-transparent hover:bg-amber-100/60'}`}
                >
                  {slot} – {String(parseInt(slot) + 1).padStart(2, '0')}:59
                </button>
              ))}
            </div>
          </div>

          {/* Protection */}
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow mb-1">
              3. Choose Protection
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={selectNone}
                className={`${panelCls} flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all bg-white/50
                  ${noneSelected ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
              >
                <span className="text-3xl">🚫</span>
                <span className="text-xs font-bold text-amber-800">None</span>
              </button>
              {protConfig.map(item => (
                <button
                  key={item.type}
                  onClick={() => toggleItem(item.type as ProtectionItemType)}
                  className={`${panelCls} flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all bg-white/50
                    ${selectedValues.has(item.type) ? activeBorder + ' bg-amber-100/80' : inactiveBorder}`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold text-amber-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Safe Time */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow">
              Safe Time
            </p>
            <div className={`${panelCls} py-3 px-4 text-center text-3xl font-extrabold text-amber-950`}>
              {resultLabel}
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <div className={`flex-1 text-center font-extrabold tabular-nums text-2xl py-3 px-4
                             ${panelCls} transition-colors
                             ${isUrgent ? 'text-red-700 animate-pulse' : 'text-amber-950'}`}>
              {fmtTime(secs)}
            </div>
            <button
              onClick={() => setRunning(r => !r)}
              disabled={secs === 0}
              className="w-12 h-12 rounded-xl border-2 border-green-600 bg-green-500/90 text-white
                         flex items-center justify-center text-xl hover:bg-green-600
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
              title={running ? 'Pause' : 'Start'}
            >
              {running ? '⏸' : '▶'}
            </button>
            <button
              onClick={handleReset}
              className="w-12 h-12 rounded-xl border-2 border-amber-500 bg-amber-100/80 text-amber-900
                         flex items-center justify-center text-2xl hover:bg-amber-200 transition-colors backdrop-blur-sm"
              title="Reset"
            >
              ↺
            </button>
          </div>

        </section>
      </div>
    </div>
  )
}

