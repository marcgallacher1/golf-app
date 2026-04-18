import type { Round } from '../types'

export function calculateHandicapIndex(rounds: Round[]): number {
  if (rounds.length < 3) return 0

  const differentials = rounds.map(r => {
    const score = r.total_score ?? r.course_par
    return (113 / 113) * (score - r.course_par)
  })

  differentials.sort((a, b) => a - b)

  const count = differentials.length
  let numToPick: number
  if (count <= 3) numToPick = 1
  else if (count <= 6) numToPick = 2
  else if (count <= 8) numToPick = 3
  else if (count <= 11) numToPick = 4
  else if (count <= 14) numToPick = 5
  else if (count <= 16) numToPick = 6
  else if (count <= 18) numToPick = 7
  else numToPick = 8

  const best = differentials.slice(0, numToPick)
  const avg = best.reduce((a, b) => a + b, 0) / best.length
  return Math.round(avg * 10) / 10
}
