// client/src/pages/Settings.tsx
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../lib/auth'
import { useState, useMemo } from 'react'

export default function Settings() {
  const { user, signOut } = useAuth()

  // Brand mascot (same as Topbar)
  const [imgErr, setImgErr] = useState(false)
  const brandImg = useMemo(() => (imgErr ? '' : '/mascot_excited.svg'), [imgErr])

  return (
    <div className="max-w-2xl mx-auto space-y-6 soft-fade">
      <Card className="p-5 bg-[var(--glass-surface)] border border-[var(--glass-border)] shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {brandImg ? (
            <img
              src={brandImg}
              alt="Dahon mascot"
              className="w-7 h-7 rounded-lg ring-1 ring-black/10 dark:ring-white/10 object-cover transform transition-transform duration-500 ease-out hover:-rotate-12 hover:scale-110"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400 animate-pulse" />
          )}
          <h1 className="text-2xl font-semibold gradient-text tracking-tight">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Theme Section */}
          <section className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm opacity-70">Light / Dark</div>
            </div>
            <div className="transition-transform hover:scale-110 hover:animate-pulse">
              <ThemeToggle />
            </div>
          </section>

          <hr className="border-[var(--glass-border)]" />

          {/* Account Section */}
          <section className="grid sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="font-medium">Account</div>
              <div className="text-sm opacity-70 break-all">
                {user?.email || 'Not signed in'}
              </div>
            </div>
            <div className="text-right">
              {user ? (
                <Button
                  onClick={signOut}
                  variant="primarySoft"
                  className="text-[var(--ink)]"
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  variant="primarySoft"
                  className="text-[var(--ink)]"
                  onClick={() => (window.location.href = '/signin')}
                >
                  Sign in
                </Button>
              )}
            </div>
          </section>
        </div>
      </Card>

      {/* Version info footer */}
      <Card className="text-center text-xs opacity-70 py-3 bg-[var(--surface-alt)] border border-[var(--glass-border)]">
        Built with <span className="text-[var(--accent2)] font-medium">Dahon</span> 🌿
      </Card>
    </div>
  )
}
