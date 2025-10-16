import { Link, NavLink, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Settings as SettingsIcon, PlusCircle, Home } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../lib/auth'

export default function Topbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()

  // Brand mascot
  const [imgErr, setImgErr] = useState(false)
  const brandImg = useMemo(() => (imgErr ? '' : '/mascot_excited.svg'), [imgErr])
  const active = (p: string) => pathname.startsWith(p)

  return (
    <header className="topbar sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#0b0f14]/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* 🌱 Brand mascot */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          title="Home"
        >
          {brandImg ? (
            <img
              src={brandImg}
              alt="Dahon"
              className="w-7 h-7 rounded-lg ring-1 ring-black/10 dark:ring-white/10 object-cover transform transition-transform duration-500 ease-out group-hover:-rotate-12 group-hover:scale-105"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 transform transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-105" />
          )}
          <span className="font-semibold tracking-tight group-hover:text-green-500 transition-colors duration-300">
            Dahon
          </span>
        </Link>

        {/* 🧭 Nav Links */}
        <nav className="ml-4 flex items-center gap-2 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg flex items-center gap-1 transition-all transform hover:scale-105 hover:text-green-500 ${
                isActive || active('/plant') ? 'bg-black/10 dark:bg-white/10' : ''
              }`
            }
          >
            <Home size={14} className="opacity-80" />
            Dashboard
          </NavLink>

          <NavLink
            to="/ai"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg flex items-center gap-1 transition-all transform hover:scale-105 hover:text-green-500 ${
                isActive ? 'bg-black/10 dark:bg-white/10' : ''
              }`
            }
          >
            <PlusCircle size={14} className="opacity-80" />
            Add Plant
          </NavLink>
        </nav>

        {/* 🌗 Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle — faint pulse on hover */}
          <div className="transition-transform hover:scale-110 hover:animate-pulse">
            <ThemeToggle />
          </div>

          {/* ⚙️ Gear icon */}
          <Link
            to="/settings"
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition group"
            title="Settings"
          >
            <SettingsIcon
              size={18}
              className="opacity-80 group-hover:opacity-100 transform transition-transform duration-500 ease-out group-hover:rotate-[25deg] group-hover:text-green-500"
            />
          </Link>

          {!user && (
            <Link to="/signin" className="text-sm underline opacity-80 hover:text-green-500 transition">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
