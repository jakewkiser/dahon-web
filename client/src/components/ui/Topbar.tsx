// client/src/components/ui/Topbar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Settings as SettingsIcon, PlusCircle, Home } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../lib/auth'

export default function Topbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [imgErr, setImgErr] = useState(false)

  const brandImg = useMemo(() => (imgErr ? '' : '/mascot_excited.svg'), [imgErr])
  const active = (p: string) => pathname.startsWith(p)

  return (
    <header
      className={[
        'sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--glass-surface)]',
        'border-b border-[var(--glass-border)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
        'transition-all duration-300',
      ].join(' ')}
    >
      <div
        className={[
          'max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3',
          'flex items-center justify-between gap-2 sm:gap-3',
          'whitespace-nowrap overflow-x-auto no-scrollbar',
        ].join(' ')}
      >
        {/* 🌿 Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
          title="Home"
        >
          {brandImg ? (
            <img
              src={brandImg}
              alt="Dahon mascot"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl ring-1 ring-black/10 dark:ring-white/10 object-cover transition-transform duration-500 ease-out group-hover:-rotate-12 group-hover:scale-105"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[var(--accent3)] via-[var(--accent2)] to-[var(--accent)] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-105" />
          )}
          <span className="font-semibold tracking-tight gradient-text text-[1rem] sm:text-[1.05rem] group-hover:opacity-90 transition-opacity">
            Dahon
          </span>
        </Link>

        {/* 🧭 Navigation */}
        <nav
          className={[
            'flex items-center gap-1 sm:gap-2 text-sm sm:text-[0.95rem]',
            'overflow-hidden shrink',
          ].join(' ')}
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [
                'px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all duration-200',
                'hover:scale-[1.03] hover:brightness-[1.05]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glass-surface)]',
                isActive || active('/plant')
                  ? [
                      'bg-white/70 border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]',
                      'dark:bg-[rgba(255,255,255,0.12)] dark:border-white/10',
                      'text-[var(--accent3)] dark:text-[var(--tint-green)] font-medium backdrop-blur-sm',
                    ].join(' ')
                  : 'text-[var(--ink)] dark:text-[rgba(255,255,255,0.85)]',
              ].join(' ')
            }
          >
            <Home size={14} className="opacity-80" />
            <span className="hidden xs:inline">Dashboard</span>
          </NavLink>

          <NavLink
            to="/ai"
            className={({ isActive }) =>
              [
                'px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all duration-200',
                'hover:scale-[1.03] hover:brightness-[1.05]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glass-surface)]',
                isActive
                  ? [
                      'bg-white/70 border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]',
                      'dark:bg-[rgba(255,255,255,0.12)] dark:border-white/10',
                      'text-[var(--accent2)] dark:text-[var(--tint-teal)] font-medium backdrop-blur-sm',
                    ].join(' ')
                  : 'text-[var(--ink)] dark:text-[rgba(255,255,255,0.85)]',
              ].join(' ')
            }
          >
            <PlusCircle size={14} className="opacity-80" />
            <span className="hidden xs:inline">Add Plant</span>
          </NavLink>
        </nav>

        {/* 🌗 Right side controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 🌓 Theme toggle — matched to Settings dimensions */}
          <div
            className={[
              'relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl',
              'bg-[rgba(0,0,0,0.05)] dark:bg-white/5',
              'transition-all duration-300 hover:scale-[1.05] hover:brightness-[1.05]',
              'focus-within:ring-2 focus-within:ring-[var(--accent2)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--glass-surface)]',
            ].join(' ')}
          >
            <ThemeToggle />
          </div>

          {/* ⚙️ Settings button */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                'relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 group',
                'hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-white/5',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glass-surface)]',
                isActive
                  ? [
                      'bg-white/70 border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]',
                      'dark:bg-[rgba(255,255,255,0.12)] dark:border-white/10',
                      'text-[var(--accent3)] dark:text-[var(--tint-green)] font-medium backdrop-blur-sm',
                    ].join(' ')
                  : 'text-[var(--ink)] dark:text-[rgba(255,255,255,0.85)]',
              ].join(' ')
            }
            title="Settings"
          >
            <SettingsIcon
              size={18}
              className="opacity-80 group-hover:opacity-100 group-hover:rotate-[20deg] transition-all duration-500 ease-out"
            />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-[2px] rounded-full bg-[var(--accent2)] opacity-0 group-hover:opacity-80 transition-all duration-300"></span>
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
