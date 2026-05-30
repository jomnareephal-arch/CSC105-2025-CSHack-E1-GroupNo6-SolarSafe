const panelCls = 'bg-amber-50/70 backdrop-blur-sm border-2 border-amber-300/60 rounded-2xl'

function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

interface Props {
  safeMin: number
  loading: boolean
  secs: number
  running: boolean
  onToggleTimer: () => void
  onReset: () => void
}

export default function SafeTimeDisplay({ safeMin, loading, secs, running, onToggleTimer, onReset }: Props) {
  const safeH = Math.floor(safeMin / 60)
  const safeM = safeMin % 60
  const resultLabel = loading
    ? '…'
    : safeMin === 0
    ? '-- mins'
    : safeH > 0
    ? `${safeH} hr ${safeM} mins`
    : `${safeMin} mins`

  const isUrgent = secs <= 60 && secs > 0

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide drop-shadow">
        Safe Time
      </p>
      <div className={`${panelCls} py-3 px-4 text-center text-3xl font-extrabold text-amber-950`}>
        {resultLabel}
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div className={`flex-1 text-center font-extrabold tabular-nums text-2xl py-3 px-4
                         ${panelCls} transition-colors
                         ${isUrgent ? 'text-red-700 animate-pulse' : 'text-amber-950'}`}>
          {fmtTime(secs)}
        </div>
        <button
          onClick={onToggleTimer}
          disabled={secs === 0}
          className="w-12 h-12 rounded-xl border-2 border-green-600 bg-green-500/90 text-white
                     flex items-center justify-center text-xl hover:bg-green-600
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
          title={running ? 'Pause' : 'Start'}
        >
          {running ? '⏸' : '▶'}
        </button>
        <button
          onClick={onReset}
          className="w-12 h-12 rounded-xl border-2 border-amber-500 bg-amber-100/80 text-amber-900
                     flex items-center justify-center text-2xl hover:bg-amber-200 transition-colors backdrop-blur-sm"
          title="Reset"
        >
          ↺
        </button>
      </div>
    </div>
  )
}
