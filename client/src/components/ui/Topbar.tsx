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
    (import.meta.env.VITE_PLACEHOLDER_IMAGE_URL as string | undefined) ||
    '/Vector.svg'
  const [imgErr, setImgErr] = useState(false)
  const brandImg = useMemo(() => (imgErr ? undefined : placeholder), [imgErr, placeholder])

  const pill = (active: boolean) =>
    `px-3 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${
      active ? 'bg-black/5 dark:bg-white/10' : ''
    }`

  return (
    // Bright in light mode; subtle divider; no backdrop tint
    <header className="topbar sticky top-0 z-40 bg-white dark:bg-[#0b0f14] border-b border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Brand: mascot + tiny PH flag overlay (no clipping) */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative inline-block w-8 h-8 shrink-0">
            {brandImg ? (
              <img
                src={brandImg}
                alt="Dahon"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-black/10 dark:ring-white/10"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 ring-1 ring-black/10 dark:ring-white/10" />
            )}
            <span
              className="absolute -top-1 -right-1 text-sm drop-shadow-sm"
              role="img"
              aria-label="Philippines flag"
              title="Philippines"
            >
              🇵🇭
            </span>
          </div>
          <span className="font-semibold tracking-tight">Dahon</span>
        </Link>

        {/* Nav */}
        <nav className="ml-4 flex items-center gap-2 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => pill(isActive || pathname.startsWith('/plant'))}
          >
            Dashboard
          </NavLink>
          <NavLink to="/ai" className={({ isActive }) => pill(isActive)}>
            AI Search
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => pill(isActive)}>
            Settings
          </NavLink>
        </nav>

        {/* Actions (no Add Plant here) */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Button
              type="button"
              onClick={async () => {
                try {
                  await signOut()
                } catch (err) {
                  console.error('Sign out failed:', err)
                }
              }}
            >
              Sign out
            </Button>
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
