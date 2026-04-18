import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStats } from '../hooks/useStats'

type Message = { role: 'user' | 'assistant'; content: string }

const GREETING: Message = {
  role: 'assistant',
  content: "Hey, I'm your AI caddy. Ask me anything — swing tips, course strategy, fixing your short game, whatever you need.",
}

export default function Caddy() {
  const { stats } = useStats()
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    const history = next.filter(m => m !== GREETING || next.indexOf(m) > 0)

    const { data, error } = await supabase.functions.invoke('caddy-advice', {
      body: {
        mode: 'chat',
        stats,
        messages: history.map(m => ({ role: m.role, content: m.content })),
      },
    })

    setLoading(false)

    if (error || !data?.reply) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, couldn't reach the caddy. Try again." }])
      return
    }

    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="flex flex-col h-full pt-12">
      {/* Header */}
      <div className="px-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎙️</span>
          <div>
            <h1 className="text-lg font-bold text-white">AI Caddy</h1>
            <p className="text-slate-500 text-xs">Your personal golf pro</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${m.role === 'user'
                  ? 'bg-white text-slate-900 rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-14 left-0 right-0 px-4 py-3 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your caddy..."
            rows={1}
            className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-2xl px-4 py-3 text-sm resize-none outline-none max-h-32"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-full bg-white text-slate-900 font-bold text-lg flex items-center justify-center active:bg-slate-100 disabled:opacity-40 flex-shrink-0"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
