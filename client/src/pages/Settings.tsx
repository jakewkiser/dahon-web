// client/src/pages/Settings.tsx
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../lib/auth'
import { useState, useMemo } from 'react'

export default function Settings() {
  const { user, signOut } = useAuth()

  // Reuse mascot from /public just like Topbar
  const [imgErr, setImgErr] = useState(false)
  const brandImg = useMemo(() => (imgErr ? '' : '/mascot_excited.svg'), [imgErr])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        {/* Header with mascot leaf */}
        <div className="flex items-center gap-2 mb-3">
          {brandImg ? (
            <img
              src={brandImg}
              alt="Dahon mascot"
              className="w-6 h-6 rounded-md ring-1 ring-black/10 dark:ring-white/10 object-cover transform transition-transform duration-500 ease-out hover:-rotate-12 hover:scale-110"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400 animate-pulse" />
          )}
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        </div>

        <div className="space-y-3">
          {/* Theme Section */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm opacity-80">Light / Dark</div>
            </div>
            <ThemeToggle />
          </div>

          <hr className="border-white/10" />

          {/* Account Section */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <div className="font-medium">Account</div>
              <div className="text-sm opacity-80 break-all">
                {user?.email || 'Not signed in'}
              </div>
            </div>
            <div className="text-right">
              <Button className="text-ink" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
