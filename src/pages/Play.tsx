import { useState } from 'react'
import type { Round } from '../types'
import NewRoundForm from '../components/round/NewRoundForm'
import ActiveRound from '../components/round/ActiveRound'
import BottomSheet from '../components/ui/BottomSheet'

export default function Play() {
  const [showForm, setShowForm] = useState(false)
  const [activeRound, setActiveRound] = useState<Round | null>(null)
  const [holeCount, setHoleCount] = useState<9 | 18>(18)
  const [completed, setCompleted] = useState(false)

  if (activeRound && !completed) {
    return (
      <ActiveRound
        round={activeRound}
        holeCount={holeCount}
        onComplete={() => setCompleted(true)}
      />
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <div className="text-6xl mb-4">🏌️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Round Complete!</h2>
        <p className="text-slate-400 mb-8">Great round at {activeRound?.course_name}</p>
        <button
          onClick={() => { setActiveRound(null); setCompleted(false) }}
          className="w-full max-w-xs py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100"
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
