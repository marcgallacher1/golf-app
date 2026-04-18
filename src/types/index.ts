export type Round = {
  id: string
  user_id: string
  course_name: string
  date: string
  tees: string
  course_par: number
  total_score: number | null
  completed: boolean
  notes: string | null
  holes?: Hole[]
}

export type Hole = {
  id: string
  round_id: string
  hole_number: number
  par: number
  score: number | null
  putts: number | null
  fairway_hit: boolean | null
  green_in_regulation: boolean | null
  penalties: number
}

export type PlayerStats = {
  handicapIndex: number
  scoringAverage: number
  fairwayPct: number
  girPct: number
  avgPutts: number
  roundsPlayed: number
  trend: 'improving' | 'declining' | 'stable'
  weakestHoles: string
  bestHoles: string
}

export type Tab = 'home' | 'play' | 'history' | 'profile'

export type Profile = {
  id: string
  username: string | null
  home_course: string | null
  created_at: string
}
