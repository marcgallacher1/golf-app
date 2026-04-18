import type { Tab } from '../../types'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'play', label: 'Play', icon: '⛳' },
  { id: 'history', label: 'History', icon: '📋' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex z-40">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors
            ${active === t.id ? 'text-green-500' : 'text-slate-400'}`}
          style={{ minHeight: 56 }}
        >
          <span className="text-xl">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
