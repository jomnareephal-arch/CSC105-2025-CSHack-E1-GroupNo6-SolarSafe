import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchProtectionConfig, createCalculation, updateCalculation } from '../apis/calculate.api'
import type { SkinType, TimeSlot, ProtectionItemType, ProtectionConfigItem, ProtectionComponent } from '../types/calculate.types'
import SkinTypeSelector from '../components/SkinTypeSelector'
import TimeSlotSelector from '../components/TimeSlotSelector'
import ProtectionSelector from '../components/ProtectionSelector'
import SafeTimeDisplay from '../components/SafeTimeDisplay'

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

function buildComponents(
  selectedValues: Map<ProtectionItemType, number>,
  config: ProtectionConfigItem[]
): ProtectionComponent[] {
  return config
    .filter(item => selectedValues.has(item.type))
    .map(item => ({ type: item.type, [item.field]: selectedValues.get(item.type) } as unknown as ProtectionComponent))
}

export default function CalculatePage() {
  const [skinType,       setSkinType]       = useState<SkinType | null>(null)
  const [timeSlot,       setTimeSlot]       = useState<TimeSlot | null>(null)
  const [selectedValues, setSelectedValues] = useState<Map<ProtectionItemType, number>>(new Map())
  const [noneSelected,   setNoneSelected]   = useState(false)
  const [safeMin,        setSafeMin]        = useState(0)
  const [loading,        setLoading]        = useState(false)
  const [protConfig,     setProtConfig]     = useState<ProtectionConfigItem[]>(DEFAULT_PROT_CONFIG)
  const [secs,           setSecs]           = useState(0)
  const [running,        setRunning]        = useState(false)
  const [notif,          setNotif]          = useState<string | null>(null)
  const [,               setWarned]         = useState<Set<number>>(new Set())
  const resultIdRef = useRef<number | null>(null)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchProtectionConfig()
      .then((config: ProtectionConfigItem[]) => setProtConfig(config))
      .catch(() => {})
  }, [])

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
      .then(data => { resultIdRef.current = data.id; applyMins(data.safeOutdoorMinutes) })
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

  return (
    <div className="min-h-screen p-4 md:p-10">
      {notif && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl text-sm">
          {notif}
        </div>
      )}

      <h1 className="text-3xl md:text-5xl font-bold text-amber-950 mb-5 md:mb-7">
        Sun Safety Calculate
      </h1>

      <div className="grid grid-cols-2 gap-5 items-start max-[620px]:grid-cols-1">
        <SkinTypeSelector value={skinType} onChange={setSkinType} />

        <section className="flex flex-col gap-3">
          <TimeSlotSelector value={timeSlot} onChange={setTimeSlot} />
          <ProtectionSelector
            config={protConfig}
            selectedValues={selectedValues}
            noneSelected={noneSelected}
            onToggle={toggleItem}
            onSelectNone={selectNone}
          />
          <SafeTimeDisplay
            safeMin={safeMin}
            loading={loading}
            secs={secs}
            running={running}
            onToggleTimer={() => setRunning(r => !r)}
            onReset={handleReset}
          />
        </section>
      </div>
    </div>
  )
}
