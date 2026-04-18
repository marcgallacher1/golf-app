import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { stats, round, mode } = await req.json()

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

    const question = mode === 'pre-round'
      ? 'Give me a game plan for today. What should I focus on to shoot my best round?'
      : 'Analyse my round. What went well, what cost me shots, and what one thing should I work on?'

    const prompt = `You are an experienced golf caddy and coach.
Here is the player's profile based on their last 20 rounds:

PLAYER STATS:
- Handicap index: ${stats.handicapIndex}
- Fairways hit: ${stats.fairwayPct}%
- Greens in regulation: ${stats.girPct}%
- Avg putts per round: ${stats.avgPutts}
- Scoring average: ${stats.scoringAverage}
- Weakest holes (by avg over par): ${stats.weakestHoles}
- Recent trend: ${stats.trend}

${round ? `TODAY'S ROUND:
- Course: ${round.course_name}, Par ${round.course_par}
- Final score: ${round.total_score} (${round.total_score - round.course_par > 0 ? '+' : ''}${round.total_score - round.course_par} vs par)` : ''}

QUESTION: ${question}

Give specific, actionable advice in 3-4 sentences. Be direct, like a caddy talking between shots — not a textbook.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    })

    const advice = (message.content[0] as { type: string; text: string }).text

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
