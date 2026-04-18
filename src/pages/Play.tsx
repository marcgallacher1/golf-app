import { useState } from 'react'
import type { Round } from '../types'
import NewRoundForm from '../components/round/NewRoundForm'
import ActiveRound from '../components/round/ActiveRound'
import BottomSheet from '../components/ui/BottomSheet'
import CaddyAdvice from '../components/caddy/CaddyAdvice'
import { useStats } from '../hooks/useStats'

export default function Play() {
  const [showForm, setShowForm] = useState(false)
  const [activeRound, setActiveRound] = useState<Round | null>(null)
  const [holeCount, setHoleCount] = useState<9 | 18>(18)
  const [completed, setCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState<number>(0)
  const { stats } = useStats()

  if (activeRound && !completed) {
    return (
      <ActiveRound
        round={activeRound}
        holeCount={holeCount}
        onComplete={(total) => { setFinalScore(total); setCompleted(true) }}
      />
    )
  }

  if (completed && activeRound) {
    const vsPar = finalScore - activeRound.course_par
    const vsParLabel = vsPar === 0 ? 'E' : vsPar > 0 ? `+${vsPar}` : `${vsPar}`
    const completedRound = { ...activeRound, total_score: finalScore }

    return (
      <div className="min-h-screen flex flex-col px-5 pt-16 pb-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏌️</div>
          <h2 className="text-2xl font-bold text-white mb-1">Round Complete!</h2>
          <p className="text-slate-400">{activeRound.course_name}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 text-center mb-6">
          <p className="text-slate-400 text-sm uppercase tracking-wider">Final Score</p>
          <p className="text-6xl font-black text-white mt-1">{finalScore}</p>
          <p className={`text-xl font-bold mt-1 ${vsPar < 0 ? 'text-green-400' : vsPar > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {vsParLabel}
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 mb-6">
          <CaddyAdvice stats={stats} round={completedRound} mode="post-round" />
        </div>

        <button
          onClick={() => { setActiveRound(null); setCompleted(false); setFinalScore(0) }}
          className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100"
        >
          Start Another Round
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <div className="text-6xl mb-4">⛳</div>
      <h2 className="text-2xl font-bold text-white mb-2">Ready to Play?</h2>
      <p className="text-slate-400 mb-8">Start a new round to begin tracking</p>
      <button
        onClick={() => setShowForm(true)}
        className="w-full max-w-xs py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100"
      >
        Start New Round
      </button>

      <BottomSheet open={showForm} onClose={() => setShowForm(false)}>
        <NewRoundForm onStart={(round, count) => { setActiveRound(round); setHoleCount(count); setShowForm(false) }} />
      </BottomSheet>
    </div>
  )
}
