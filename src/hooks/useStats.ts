import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useRound } from './useRound'
import { calculateStats } from '../lib/statsCalculator'
import type { PlayerStats, Round } from '../types'

export function useStats() {
  const { user } = useContext(AuthContext)
  const { fetchRounds } = useRound()
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchRounds().then(data => {
      setRounds(data)
      setStats(calculateStats(data))
      setLoading(false)
    })
  }, [user])

  return { stats, rounds, loading }
}
