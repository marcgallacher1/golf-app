import { useState } from 'react'
import type { Round, Hole } from '../../types'
import { useRound } from '../../hooks/useRound'
import BottomSheet from '../ui/BottomSheet'
import ShotLogger from '../logging/ShotLogger'

const DEFAULT_PARS_18 = [4,4,3,4,5,4,3,4,5, 4,4,3,4,5,4,3,4,5]
const DEFAULT_PARS_9  = [4,4,3,4,5,4,3,4,5]

export default function ActiveRound({ round, holeCount, onComplete }: {
  round: Round
  holeCount: 9 | 18
  onComplete: (totalScore: number) => void
}) {
  const { saveHole, completeRound } = useRound()
  const [currentHole, setCurrentHole] = useState(1)
  const [open, setOpen] = useState(false)
  const [holes, setHoles] = useState<Hole[]>([])
  const [saving, setSaving] = useState(false)

  const defaultPars = holeCount === 9 ? DEFAULT_PARS_9 : DEFAULT_PARS_18
  const par = defaultPars[currentHole - 1] ?? 4

  const totalScore = holes.reduce((a, h) => a + (h.score ?? 0), 0)
  const totalPar = holes.reduce((a, h) => a + h.par, 0)
  const vsParTotal = totalScore - totalPar
  const vsParLabel = vsParTotal === 0 ? 'E' : vsParTotal > 0 ? `+${vsParTotal}` : `${vsParTotal}`

  const handleSave = async (data: Omit<Hole, 'id' | 'round_id'>) => {
    setSaving(true)
    await saveHole(round.id, data)
    const newHole: Hole = { id: crypto.randomUUID(), round_id: round.id, ...data }
    const updated = [...holes.filter(h => h.hole_number !== data.hole_number), newHole]
    setHoles(updated)
    setOpen(false)

    if (currentHole === holeCount) {
      const total = updated.reduce((a, h) => a + (h.score ?? 0), 0)
      await completeRound(round.id, total)
      onComplete(total)
    } else {
      setCurrentHole(h => h + 1)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-5 pt-12 pb-5">
        <p className="text-slate-400 text-sm">{round.course_name} · {holeCount} holes</p>
        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider">Hole</p>
            <p className="text-6xl font-black text-white leading-none">{currentHole}</p>
            <p className="text-slate-400 text-sm mt-1">Par {par}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase tracking-wider">Score</p>
            <p className="text-4xl font-bold text-white">{totalScore || '—'}</p>
            {totalScore > 0 && (
              <p className={`text-sm font-semibold ${vsParTotal < 0 ? 'text-green-400' : vsParTotal > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                {vsParLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scorecard grid */}
      <div className="px-5 pt-5">
        {holeCount === 18 ? (
          <>
            <HoleGrid holes={holes} from={1} to={9} current={currentHole} />
            <div className="mt-2">
              <HoleGrid holes={holes} from={10} to={18} current={currentHole} />
            </div>
          </>
        ) : (
          <HoleGrid holes={holes} from={1} to={9} current={currentHole} />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        disabled={saving}
        className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-white text-slate-900 text-2xl shadow-lg flex items-center justify-center active:bg-slate-100 z-30 disabled:opacity-50"
        aria-label="Log hole"
      >
        ✏️
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <ShotLogger
          holeNumber={currentHole}
          par={par}
          onSave={handleSave}
          isLast={currentHole === holeCount}
        />
      </BottomSheet>
    </div>
  )
}

function HoleGrid({ holes, from, to, current }: { holes: Hole[]; from: number; to: number; current: number }) {
  const count = to - from + 1
  return (
    <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }, (_, i) => from + i).map(n => {
        const h = holes.find(h => h.hole_number === n)
        const vp = h ? (h.score ?? 0) - h.par : null
        return (
          <div
            key={n}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all
              ${n === current ? 'ring-2 ring-white bg-slate-700' : 'bg-slate-800'}
              ${vp === null ? 'text-slate-600' : vp < 0 ? 'text-green-400' : vp === 0 ? 'text-white' : 'text-red-400'}`}
          >
            {h ? h.score : n}
          </div>
        )
      })}
    </div>
  )
}
