import type { Round, Hole, PlayerStats } from '../types'
import { calculateHandicapIndex } from './handicap'

export function calculateStats(rounds: Round[]): PlayerStats {
  const completed = rounds.filter(r => r.completed && r.total_score)
  const last20 = completed.slice(0, 20)

  const allHoles: Hole[] = last20.flatMap(r => r.holes ?? [])

  const fairwayHoles = allHoles.filter(h => h.par !== 3 && h.fairway_hit !== null)
  const fairwayHit = fairwayHoles.filter(h => h.fairway_hit).length
  const fairwayPct = fairwayHoles.length ? Math.round((fairwayHit / fairwayHoles.length) * 100) : 0

  const girHoles = allHoles.filter(h => h.green_in_regulation !== null)
  const girHit = girHoles.filter(h => h.green_in_regulation).length
  const girPct = girHoles.length ? Math.round((girHit / girHoles.length) * 100) : 0

  const puttHoles = allHoles.filter(h => h.putts !== null)
  const totalPutts = puttHoles.reduce((a, h) => a + (h.putts ?? 0), 0)
  const avgPutts = puttHoles.length ? Math.round((totalPutts / last20.length) * 10) / 10 : 0

  const scores = last20.map(r => r.total_score ?? 0)
  const scoringAverage = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0

  // Trend: compare first half vs second half of last 10 rounds
  let trend: PlayerStats['trend'] = 'stable'
  if (completed.length >= 6) {
    const recent = completed.slice(0, 5).map(r => r.total_score ?? 0)
    const older = completed.slice(5, 10).map(r => r.total_score ?? 0)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    if (recentAvg < olderAvg - 1) trend = 'improving'
    else if (recentAvg > olderAvg + 1) trend = 'declining'
  }

  // Weakest/best holes by average over par
  const holeStats: Record<number, { total: number; count: number; par: number }> = {}
  for (const h of allHoles) {
    if (h.score === null) continue
    if (!holeStats[h.hole_number]) holeStats[h.hole_number] = { total: 0, count: 0, par: h.par }
    holeStats[h.hole_number].total += h.score - h.par
    holeStats[h.hole_number].count++
  }

  const holeAvgs = Object.entries(holeStats)
    .map(([num, s]) => ({ hole: Number(num), avg: s.total / s.count }))
    .sort((a, b) => b.avg - a.avg)

  const weakestHoles = holeAvgs.slice(0, 3).map(h => `#${h.hole}`).join(', ') || 'N/A'
  const bestHoles = holeAvgs.slice(-3).reverse().map(h => `#${h.hole}`).join(', ') || 'N/A'

  return {
    handicapIndex: calculateHandicapIndex(last20),
    scoringAverage,
    fairwayPct,
    girPct,
    avgPutts,
    roundsPlayed: completed.length,
    trend,
    weakestHoles,
    bestHoles,
  }
}
