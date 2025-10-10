import { Outlet } from 'react-router-dom'
import Topbar from './components/ui/Topbar'

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Topbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}