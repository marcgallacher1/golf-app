import { useState } from 'react'
import type { Hole } from '../../types'

type HoleInput = {
  par: number
  score: number
  putts: number
  fairway_hit: boolean | null
  green_in_regulation: boolean | null
  penalties: number
}

function Counter({ value, onChange, min = 0, max = 15 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-12 h-12 rounded-full bg-slate-700 text-white text-2xl flex items-center justify-center active:bg-slate-600"
      >−</button>
      <span className="text-2xl font-bold w-8 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-12 h-12 rounded-full bg-slate-700 text-white text-2xl flex items-center justify-center active:bg-slate-600"
      >+</button>
    </div>
  )
}

function ToggleGroup({ options, value, onChange }: {
  options: { label: string; value: boolean | null }[]
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map(o => (
        <button
          key={String(o.label)}
          onClick={() => onChange(o.value)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors
            ${value === o.value ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function ShotLogger({
  holeNumber,
  par,
  onSave,
  isLast,
}: {
  holeNumber: number
  par: number
  onSave: (data: Omit<Hole, 'id' | 'round_id'>) => void
  isLast: boolean
}) {
  const [data, setData] = useState<HoleInput>({
    par,
    score: par,
    putts: 2,
    fairway_hit: null,
    green_in_regulation: null,
    penalties: 0,
  })

  const set = <K extends keyof HoleInput>(k: K, v: HoleInput[K]) =>
    setData(d => ({ ...d, [k]: v }))

  const handleSave = () => {
    onSave({
      hole_number: holeNumber,
      par: data.par,
      score: data.score,
      putts: data.putts,
      fairway_hit: data.fairway_hit,
      green_in_regulation: data.green_in_regulation,
      penalties: data.penalties,
    })
  }

  const vsPar = data.score - par
  const vsParLabel = vsPar === 0 ? 'E' : vsPar > 0 ? `+${vsPar}` : `${vsPar}`

  return (
    <div className="px-5 pb-8 space-y-6">
      <div className="text-center">
        <p className="text-slate-400 text-sm">Hole {holeNumber} · Par {par}</p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-slate-300 font-medium">Score</span>
        <div className="flex items-center gap-3">
          <Counter value={data.score} onChange={v => set('score', v)} min={1} max={15} />
          <span className={`text-lg font-bold w-8 ${vsPar < 0 ? 'text-green-400' : vsPar > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {vsParLabel}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-slate-300 font-medium">Putts</span>
        <Counter value={data.putts} onChange={v => set('putts', v)} min={0} max={10} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-slate-300 font-medium">Penalties</span>
        <Counter value={data.penalties} onChange={v => set('penalties', v)} min={0} max={10} />
      </div>

      {par !== 3 && (
        <div>
          <p className="text-slate-300 font-medium mb-2">Fairway</p>
          <ToggleGroup
            options={[
              { label: 'Hit', value: true },
              { label: 'Miss', value: false },
            ]}
            value={data.fairway_hit}
            onChange={v => set('fairway_hit', v)}
          />
        </div>
      )}

      <div>
        <p className="text-slate-300 font-medium mb-2">Green in Regulation</p>
        <ToggleGroup
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
          value={data.green_in_regulation}
          onChange={v => set('green_in_regulation', v)}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100"
      >
        {isLast ? 'Complete Round' : 'Save & Next Hole →'}
      </button>
    </div>
  )
}
