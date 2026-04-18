import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PlayerStats, Round } from '../../types'

export default function CaddyAdvice({
  stats,
  round,
  mode,
}: {
  stats: PlayerStats | null
  round?: Round | null
  mode: 'pre-round' | 'post-round'
}) {
  const [advice, setAdvice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdvice = async () => {
    if (!stats) return
    setLoading(true)
    setError(null)
    const { data, error: err = null } = await supabase.functions.invoke('caddy-advice', {
      body: { stats, round, mode },
    })
    setLoading(false)
    if (err || !data?.advice) {
      setError('Could not reach your caddy. Try again.')
      return
    }
    setAdvice(data.advice)
  }

  if (loading) {
    return (
      <div className="space-y-2.5 animate-pulse py-1">
        <div className="h-3.5 bg-slate-700 rounded-full w-3/4" />
        <div className="h-3.5 bg-slate-700 rounded-full w-full" />
        <div className="h-3.5 bg-slate-700 rounded-full w-5/6" />
        <div className="h-3.5 bg-slate-700 rounded-full w-2/3" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={fetchAdvice} className="w-full py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm active:bg-slate-100">
          Try again
        </button>
      </div>
    )
  }

  if (advice) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎙️</span>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
            {mode === 'pre-round' ? 'Game Plan' : 'Round Analysis'}
          </p>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">{advice}</p>
        <button
          onClick={() => setAdvice(null)}
          className="text-slate-500 text-xs underline"
        >
          Ask again
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={fetchAdvice}
      disabled={!stats}
      className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-base active:bg-slate-100 disabled:opacity-40"
    >
      {mode === 'pre-round' ? '🎙️ Get Game Plan' : '🎙️ Analyse My Round'}
    </button>
  )
}
