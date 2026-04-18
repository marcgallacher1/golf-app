import { useEffect, useState } from 'react'
import { useRound } from '../hooks/useRound'
import type { Round, Hole } from '../types'

function HoleRow({ h }: { h: Hole }) {
  const vp = (h.score ?? 0) - h.par
  return (
    <div className="flex items-center py-2 border-b border-slate-700 last:border-0">
      <span className="text-slate-400 text-sm w-12">#{h.hole_number}</span>
      <span className="text-slate-400 text-sm w-12">Par {h.par}</span>
      <span className={`font-bold text-sm flex-1 ${vp < 0 ? 'text-green-400' : vp > 0 ? 'text-red-400' : 'text-white'}`}>
        {h.score} ({vp > 0 ? `+${vp}` : vp})
      </span>
      <span className="text-slate-500 text-xs">{h.putts ?? '—'} putts</span>
    </div>
  )
}

function RoundCard({ round }: { round: Round }) {
  const [expanded, setExpanded] = useState(false)
  const vsPar = (round.total_score ?? 0) - round.course_par
  const vsParLabel = vsPar === 0 ? 'E' : vsPar > 0 ? `+${vsPar}` : `${vsPar}`

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-5 py-4 flex justify-between items-center text-left"
      >
        <div>
          <p className="text-white font-semibold">{round.course_name}</p>
          <p className="text-slate-500 text-sm">{new Date(round.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-xl">{round.total_score}</p>
          <p className={`text-sm font-semibold ${vsPar < 0 ? 'text-green-400' : vsPar > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {vsParLabel}
          </p>
        </div>
      </button>
      {expanded && round.holes && round.holes.length > 0 && (
        <div className="px-5 pb-4">
          {[...round.holes].sort((a, b) => a.hole_number - b.hole_number).map(h => (
            <HoleRow key={h.id} h={h} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const { fetchRounds } = useRound()
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRounds().then(data => {
      setRounds(data.filter(r => r.completed))
      setLoading(false)
    })
  }, [])

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="text-2xl font-bold text-white mb-6">Round History</h1>
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : rounds.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No completed rounds yet.</div>
      ) : (
        <div className="space-y-3">
          {rounds.map(r => <RoundCard key={r.id} round={r} />)}
        </div>
      )}
    </div>
  )
}
