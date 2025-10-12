// client/src/components/ui/Topbar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../lib/auth'
import Button from './Button'
import { useMemo, useState } from 'react'

export default function Topbar() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()

  const placeholder =
    (import.meta.env.VITE_PLACEHOLDER_IMAGE_URL as string | undefined) || '/Vector.svg'
  const [imgErr, setImgErr] = useState(false)
  const brandImg = useMemo(() => (imgErr ? undefined : placeholder), [imgErr, placeholder])

  const active = (p: string) => pathname.startsWith(p)

  return (
    <header className="topbar sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#0b0f14]/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          {brandImg ? (
            <img
              src={brandImg}
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
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${
                isActive || active('/plant') ? 'bg-black/10 dark:bg-white/10' : ''
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/ai"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${
                isActive ? 'bg-black/10 dark:bg-white/10' : ''
              }`
            }
          >
            AI Search
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${
                isActive ? 'bg-black/10 dark:bg-white/10' : ''
              }`
            }
          >
            Settings
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Do NOT pass className/pill into ThemeToggle; it doesn't accept props */}
          <ThemeToggle />
          {user ? (
            <Button onClick={signOut}>Sign out</Button>
          ) : (
            <Link to="/signin" className="text-sm underline opacity-80">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
