import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useStats } from '../hooks/useStats'

export default function Profile() {
  const { user, signOut } = useContext(AuthContext)
  const { stats } = useStats()

  return (
    <div className="px-5 pt-12 pb-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-2xl font-bold text-white">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{user?.email}</p>
            <p className="text-slate-400 text-sm">Golfer</p>
          </div>
        </div>
      </div>

      {stats && (
        <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-slate-400 text-sm uppercase tracking-wider">Career Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-xs">Rounds Played</p>
              <p className="text-white font-bold text-xl">{stats.roundsPlayed}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Handicap</p>
              <p className="text-white font-bold text-xl">{stats.roundsPlayed >= 3 ? stats.handicapIndex : '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Best Holes</p>
              <p className="text-white font-semibold text-sm">{stats.bestHoles}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Weakest Holes</p>
              <p className="text-white font-semibold text-sm">{stats.weakestHoles}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={signOut}
        className="w-full py-4 rounded-2xl bg-slate-800 text-red-400 font-semibold text-base active:bg-slate-700"
      >
        Sign Out
      </button>
    </div>
  )
}
