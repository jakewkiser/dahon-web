// client/src/components/ui/Topbar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Home, Plus, Settings } from 'lucide-react'
import { useAuth } from '../../lib/auth'

export default function Topbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [imgErr, setImgErr] = useState(false)

  const brandImg = useMemo(() => (imgErr ? '' : '/mascot_excited.svg'), [imgErr])
  const active = (p: string) => pathname.startsWith(p)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--glass-surface)] border-b border-[var(--glass-border)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* Left-aligned group */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 🌿 Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group" title="Home">
            {brandImg ? (
              <img
                src={brandImg}
                alt="Dahon mascot"
                className="w-8 h-8 rounded-xl ring-1 ring-black/10 dark:ring-white/10 object-cover transition-transform duration-500 ease-out group-hover:-rotate-12 group-hover:scale-105"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent3)] via-[var(--accent2)] to-[var(--accent)] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-105" />
            )}
            <span className="font-semibold tracking-tight gradient-text text-[1rem] sm:text-[1.05rem] group-hover:opacity-90 transition-opacity">
              Dahon
            </span>
          </Link>

          {/* 🧭 Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm sm:text-[0.95rem]">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                [
                  'nav-btn flex items-center justify-center sm:justify-start gap-2 select-none rounded-xl transition-all duration-200',
                  'min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0', // ✅ tap area
                  isActive || active('/plant')
                    ? 'nav-btn-active text-[var(--accent3)] dark:text-[var(--tint-green)]'
                    : 'nav-btn-idle',
                ].join(' ')
              }
              title="Dashboard"
            >
              <Home size={18} className="opacity-85 shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>

            <NavLink
              to="/ai"
              className={({ isActive }) =>
                [
                  'nav-btn flex items-center justify-center sm:justify-start gap-2 select-none rounded-xl transition-all duration-200',
                  'min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0', // ✅ tap area
                  isActive
                    ? 'nav-btn-active text-[var(--accent2)] dark:text-[var(--tint-teal)]'
                    : 'nav-btn-idle',
                ].join(' ')
              }
              title="Add Plant"
            >
              <Plus size={18} className="opacity-85 shrink-0" />
              <span className="hidden sm:inline">Add Plant</span>
            </NavLink>
          </nav>
        </div>

        {/* 🌗 Right-aligned group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ⚙️ Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                'ctrl-btn group',
                isActive
                  ? 'bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 text-[var(--accent3)] dark:text-[var(--tint-green)]'
                  : 'text-[var(--ink)] dark:text-[rgba(255,255,255,0.85)]',
              ].join(' ')
            }
            title="Settings"
          >
            <Settings
              size={18}
              className="opacity-80 group-hover:opacity-100 group-hover:rotate-[20deg] transition-all duration-500 ease-out"
            />
          </NavLink>

          {!user && (
            <Link
              to="/signin"
              className="text-sm font-medium underline opacity-80 hover:text-[var(--accent2)] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// Tailwind utility suggestions (add to index.css or tokens.css)
/*
.nav-btn { @apply px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.03] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glass-surface)]; }
.nav-btn-idle { @apply text-[var(--ink)] dark:text-[rgba(255,255,255,0.85)]; }
.nav-btn-active { @apply bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 font-medium backdrop-blur-sm; }
.ctrl-btn { @apply relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-[rgba(0,0,0,0.05)] dark:bg-white/5 transition-all duration-300 hover:scale-[1.05] hover:brightness-[1.05] focus-within:ring-2 focus-within:ring-[var(--accent2)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--glass-surface)]; }
*/
