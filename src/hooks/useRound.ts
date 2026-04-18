import { useState, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../context/AuthContext'
import type { Round, Hole } from '../types'

export function useRound() {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createRound(data: { course_name: string; date: string; tees: string; course_par: number }) {
    if (!user) return null
    setLoading(true)
    setError(null)
    const { data: round, error: err } = await supabase
      .from('rounds')
      .insert({ ...data, user_id: user.id })
      .select()
      .single()
    setLoading(false)
    if (err) { setError(err.message); return null }
    return round as Round
  }

  async function saveHole(roundId: string, hole: Omit<Hole, 'id' | 'round_id'>) {
    setError(null)
    const { error: err } = await supabase
      .from('holes')
      .upsert({ ...hole, round_id: roundId }, { onConflict: 'round_id,hole_number' })
    if (err) setError(err.message)
    return !err
  }

  async function completeRound(roundId: string, totalScore: number) {
    const { error: err } = await supabase
      .from('rounds')
      .update({ total_score: totalScore, completed: true })
      .eq('id', roundId)
    if (err) setError(err.message)
    return !err
  }

  async function fetchRounds(): Promise<Round[]> {
    if (!user) return []
    const { data, error: err } = await supabase
      .from('rounds')
      .select('*, holes(*)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (err) { setError(err.message); return [] }
    return (data ?? []) as Round[]
  }

  return { createRound, saveHole, completeRound, fetchRounds, loading, error }
}
