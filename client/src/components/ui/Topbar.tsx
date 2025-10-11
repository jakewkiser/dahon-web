// client/src/components/ui/Topbar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../lib/auth'
import Button from './Button'
import { useMemo, useState } from 'react'

function PillLink({
  to,
  children,
  active,
}: { to: string; children: React.ReactNode; active?: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'px-3 py-1 rounded-xl transition-colors',
          'hover:bg-black/5 dark:hover:bg-white/5',
          (isActive || active) ? 'bg-black/10 dark:bg-white/10' : '',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Topbar() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()

  const [imgErr, setImgErr] = useState(false)
  const envSrc = (import.meta.env.VITE_PLACEHOLDER_IMAGE_URL as string | undefined) || ''
  const brandSrc = useMemo(
    () => (/^(https?:\/\/|\/)/.test(envSrc) && !imgErr ? envSrc : '/Vector.svg'),
    [envSrc, imgErr]
  )

  const isPlantDetails = pathname.startsWith('/plant')

  return (
    <header
      className={[
        'topbar sticky top-0 z-40',
        'backdrop-blur',
        // neutral translucent surface that works in both themes
        'bg-white/60 dark:bg-[#0b0f14]/60',
        'supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-[#0b0f14]/60',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 text-ink">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          {!imgErr ? (
            <img
              src={brandSrc}
              alt="Dahon"
              className="w-7 h-7 rounded-lg ring-1 ring-black/10 dark:ring-white/10 object-cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400" />
          )}
          <span className="font-semibold tracking-tight">Dahon</span>
        </Link>

        {/* Nav */}
        <nav className="ml-4 flex items-center gap-2 text-sm">
          <PillLink to="/dashboard" active={isPlantDetails}>Dashboard</PillLink>
          <PillLink to="/ai">AI Search</PillLink>
          <PillLink to="/settings">Settings</PillLink>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme button styled like the pills */}
          <ThemeToggle
            className="px-3 py-1 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
            pill
          />
          {user ? (
            <button
              type="button"
              onClick={signOut}
              className="px-3 py-1 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
            >
              Sign out
            </button>
          ) : (
            <Link to="/signin" className="text-sm underline opacity-80">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
