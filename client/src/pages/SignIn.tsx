// client/src/pages/SignIn.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../lib/auth'
// @ts-ignore - vite supports json imports
import pkg from '../../package.json'

const versionFromEnv =
  (import.meta.env.VITE_APP_VERSION as string | undefined) ||
  (pkg?.version as string | undefined) ||
  '0.1.0'

const releaseDateFromEnv =
  (import.meta.env.VITE_RELEASE_DATE as string | undefined) ||
  new Date().toISOString().slice(0, 10)

function GoogleGIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.4 6.3 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-7.5 19-20 0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16 18.8 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.4 6.3 28.9 4 24 4 16.5 4 10 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.5-4.8l-6.2-5.1C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.6-11.1-8.5l-6.6 5.1C10 39.6 16.5 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.9 5.8-7.3 6.6l6.2 5.1C36.8 38.9 40 32.9 40 26c0-1.9-.2-3.3-.4-5.5z"/>
    </svg>
  )
}

export default function SignIn() {
  const { emailSignIn, googleSignIn, user } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // --- Mascot source (hardened) ---
  const [imgErr, setImgErr] = useState(false)
  const envSrc = (import.meta.env.VITE_PLACEHOLDER_IMAGE_URL as string | undefined) || ''
  // Only trust env if it's an absolute URL or absolute path; else fallback
  const resolvedMascotSrc =
    /^(https?:\/\/|\/)/.test(envSrc) && !imgErr ? envSrc : '/Vector.svg'

  useEffect(() => {
    if (user) nav('/dashboard', { replace: true })
  }, [user, nav])

  async function onEmailSignIn() {
    setError(null)
    setLoading(true)
    try {
      await emailSignIn(email, password)
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setLoading(true)
    try {
      await googleSignIn()
    } catch (e: any) {
      setError(e?.message || String(e))
      if (e?.code === 'auth/invalid-auth-domain' || e?.code === 'auth/invalid-api-key') {
        alert('Check Firebase env in client/.env.local and restart the dev server.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Branded Google-style button (visual only; same handler)
  function GoogleButton() {
    return (
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-surface px-4 py-2 text-sm font-medium text-[#1f1f1f] dark:text-ink shadow-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <GoogleGIcon />
        <span>{loading ? 'Signing in…' : 'Sign in with Google'}</span>
      </button>
    )
  }

  return (
    <div className="max-w-md mx-auto pt-16">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Sign in</h1>
          {/* Beta badge (version + date) */}
          <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
            Beta v{versionFromEnv} • {releaseDateFromEnv}
          </span>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl p-2">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          <Input placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
          <Button className="text-ink w-full" onClick={onEmailSignIn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          <div className="text-center text-xs opacity-60">or</div>
          <GoogleButton />
        </div>

        {/* Brand block (layout preserved, larger wrapper to avoid clipping) */}
        <div className="mt-6 rounded-2xl p-4 glass flex items-center gap-4">
          {/* Mascot + tiny PH flag overlay (bigger wrapper, no clipping) */}
          <div className="relative inline-block w-20 h-20 shrink-0">
            {!imgErr ? (
              <img
                key={resolvedMascotSrc}        // force rerender if env changes
                src={resolvedMascotSrc}
                alt="Dahon"
                title={resolvedMascotSrc}       // hover to see the actual path in prod
                className="w-20 h-20 rounded-xl object-cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400"
                title="fallback gradient"
              />
            )}
            <span
              className="absolute -top-1 -right-1 text-2xl drop-shadow-sm"
              role="img"
              aria-label="Philippines flag"
              title="Philippines"
            >
              🇵🇭
            </span>
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight">Dahon</div>
            <div className="text-sm opacity-80">
              “Dahon” — Tagalog word for "leaf", and your friendly plant-care assistant.
            </div>
          </div>
        </div>

        {/* Note: Feedback link intentionally NOT shown here (Dashboard only). */}
      </Card>
    </div>
  )
}
