import { useState } from 'react'
import { useRound } from '../../hooks/useRound'
import type { Round } from '../../types'

const today = new Date().toISOString().split('T')[0]

const inputClass = 'w-full px-4 py-3 rounded-xl bg-slate-700/60 text-white placeholder-slate-500 border border-slate-600/50 focus:outline-none focus:border-slate-400 text-base'
const selectClass = 'w-full px-4 py-3 rounded-xl bg-slate-700/60 text-white border border-slate-600/50 focus:outline-none focus:border-slate-400 text-base'
const labelClass = 'text-slate-400 text-xs uppercase tracking-wider block mb-1.5'

export default function NewRoundForm({ onStart }: { onStart: (round: Round, holeCount: 9 | 18) => void }) {
  const { createRound, loading, error } = useRound()
  const [holeCount, setHoleCount] = useState<9 | 18>(18)
  const [form, setForm] = useState({
    course_name: '',
    date: today,
    tees: 'White',
    course_par: 72,
  })

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const par = holeCount === 9 ? Math.round(form.course_par / 2) : form.course_par
    const round = await createRound({ ...form, course_par: par })
    if (round) onStart(round, holeCount)
  }

  return (
    <div className="px-5 pb-8">
      <h2 className="text-lg font-semibold text-white text-center mb-6">New Round</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Holes toggle */}
        <div>
          <label className={labelClass}>Holes</label>
          <div className="flex rounded-xl overflow-hidden border border-slate-600/50">
            {([9, 18] as const).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setHoleCount(n)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors
                  ${holeCount === n ? 'bg-white text-slate-900' : 'bg-slate-700/60 text-slate-400'}`}
              >
                {n} Holes
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Course</label>
          <input
            type="text"
            value={form.course_name}
            onChange={e => set('course_name', e.target.value)}
            placeholder="Course name"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Tees</label>
            <select
              value={form.tees}
              onChange={e => set('tees', e.target.value)}
              className={selectClass}
            >
              {['Black', 'Blue', 'White', 'Yellow', 'Red'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className={labelClass}>Course Par</label>
            <select
              value={form.course_par}
              onChange={e => set('course_par', Number(e.target.value))}
              className={selectClass}
            >
              {(holeCount === 9 ? [33, 34, 35, 36, 37] : [70, 71, 72, 73, 74]).map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100 disabled:opacity-50 mt-2"
        >
          {loading ? 'Starting...' : 'Tee It Up ⛳'}
        </button>
      </form>
    </div>
  )
}
