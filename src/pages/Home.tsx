import { useStats } from '../hooks/useStats'
import StatCard from '../components/ui/StatCard'
import CaddyAdvice from '../components/caddy/CaddyAdvice'

export default function Home({ onStartRound }: { onStartRound: () => void }) {
  const { stats, rounds, loading } = useStats()

  const recentRounds = rounds.filter(r => r.completed).slice(0, 5)

  const trendIcon = stats?.trend === 'improving' ? '📈' : stats?.trend === 'declining' ? '📉' : '➡️'

  return (
    <div className="px-5 pt-12 pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Golf Caddy</h1>
          <p className="text-slate-400 text-sm">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <span className="text-3xl">⛳</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading stats...</div>
      ) : (
        <>
          {/* Handicap hero */}
          <div className="bg-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Handicap Index</p>
            <p className="text-5xl font-black text-white mt-1">
              {stats && stats.roundsPlayed >= 3 ? stats.handicapIndex : '—'}
            </p>
            {stats && stats.roundsPlayed < 3 && (
              <p className="text-slate-500 text-sm mt-1">Need {3 - stats.roundsPlayed} more rounds</p>
            )}
            {stats && stats.roundsPlayed >= 3 && (
              <p className="text-slate-400 text-sm mt-1">{trendIcon} {stats.trend}</p>
            )}
          </div>

          {/* Stats grid */}
          {stats && stats.roundsPlayed > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Scoring Avg" value={stats.scoringAverage} sub="last 20 rounds" />
              <StatCard label="Fairways" value={`${stats.fairwayPct}%`} />
              <StatCard label="GIR" value={`${stats.girPct}%`} />
              <StatCard label="Avg Putts" value={stats.avgPutts} sub="per round" />
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onStartRound}
            className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100"
          >
            Start New Round
          </button>

          {/* Pre-round AI briefing */}
          {stats && stats.roundsPlayed >= 3 && (
            <div className="bg-slate-800 rounded-2xl p-5">
              <CaddyAdvice stats={stats} mode="pre-round" />
            </div>
          )}

          {/* Recent rounds */}
          {recentRounds.length > 0 && (
            <div>
              <h2 className="text-slate-400 text-sm uppercase tracking-wider mb-3">Recent Rounds</h2>
              <div className="space-y-2">
                {recentRounds.map(r => {
                  const vsPar = (r.total_score ?? 0) - r.course_par
                  const vsParLabel = vsPar === 0 ? 'E' : vsPar > 0 ? `+${vsPar}` : `${vsPar}`
                  return (
                    <div key={r.id} className="bg-slate-800 rounded-xl px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{r.course_name}</p>
                        <p className="text-slate-500 text-xs">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">{r.total_score}</p>
                        <p className={`text-xs font-semibold ${vsPar < 0 ? 'text-green-400' : vsPar > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                          {vsParLabel}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {stats?.roundsPlayed === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No rounds yet — start one above!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
