// client/src/App.tsx
import { Outlet } from 'react-router-dom'
import Topbar from './components/ui/Topbar'
import { useIdleSignOut } from './lib/useIdleSignOut'

export default function App() {
  // Prompt the user after 60s idle; auto sign out after 3 min.
  // The hook handles the prompt + sign-out internally and won't sign out on refresh.
  useIdleSignOut({ warnAfter: 60_000, signOutAfter: 180_000 })

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Topbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
