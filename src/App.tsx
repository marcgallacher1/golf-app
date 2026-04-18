import { useContext, useState } from 'react'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Play from './pages/Play'
import History from './pages/History'
import Profile from './pages/Profile'
import Caddy from './pages/Caddy'
import BottomNav from './components/ui/BottomNav'
import type { Tab } from './types'

function AppRoutes() {
  const { session, loading } = useContext(AuthContext)
  const [tab, setTab] = useState<Tab>('home')

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-slate-900">
        <div className="text-green-500 text-4xl animate-pulse">⛳</div>
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <div className="min-h-svh bg-slate-900 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'home' && <Home onStartRound={() => setTab('play')} />}
        {tab === 'play' && <Play />}
        {tab === 'caddy' && <Caddy />}
        {tab === 'history' && <History />}
        {tab === 'profile' && <Profile />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
