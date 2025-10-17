// client/src/pages/SignIn.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../lib/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
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

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [imgErr, setImgErr] = useState(false)
  const mascotSrc = '/mascot_excited.svg'

  useEffect(() => {
    if (user) nav('/dashboard', { replace: true })
  }, [user, nav])

  async function onEmailSubmit() {
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        await emailSignIn(email, password)
      } else {
        if (password.length < 6) throw new Error('Password should be at least 6 characters.')
        await createUserWithEmailAndPassword(auth, email, password)
      }
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
        alert('⚠️ Firebase configuration issue. Check your .env or Vercel project settings.')
      }
    } finally {
      setLoading(false)
    }
  }

  function GoogleButton() {
    return (
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-surface px-4 py-2 text-sm font-medium text-[#1f1f1f] dark:text-ink shadow-sm hover:bg-white/90 focus:outline-none transition-all duration-200"
      >
        <GoogleGIcon />
        <span>{loading ? 'Signing in…' : 'Sign in with Google'}</span>
      </button>
    )
  }

  return (
    <div className="max-w-md mx-auto pt-16 soft-fade">
      <Card className="p-6 bg-[var(--glass-surface)] border border-[var(--glass-border)] shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold gradient-text">
            {mode === 'signin' ? 'Welcome back 🌿' : 'Create your account'}
          </h1>
          <span className="text-xs px-2 py-1 rounded-lg bg-[var(--tint-teal)]/30 text-[var(--accent2)] border border-[var(--accent2)]/30">
            Beta v{versionFromEnv} • {releaseDateFromEnv}
          </span>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-500/30 rounded-xl p-2">
            {error}
          </div>
        )}

        {/* Email Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onEmailSubmit()
          }}
          className="space-y-3"
        >
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
          />
          <Button
            className="text-[var(--ink)] w-full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? mode === 'signin'
                ? 'Signing in…'
                : 'Creating…'
              : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
          </Button>
        </form>

        <div className="text-center text-xs opacity-60 my-3">or</div>

        <GoogleButton />

        {/* Mode toggle */}
        <div className="mt-3 text-xs text-center">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="underline text-[var(--accent2)] hover:opacity-80 transition"
                disabled={loading}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="underline text-[var(--accent2)] hover:opacity-80 transition"
                disabled={loading}
              >
                Sign in
              </button>
            </>
          )}
        </div>

        {/* Brand block */}
        <div className="mt-6 rounded-2xl p-4 glass flex items-center gap-4 border border-[var(--glass-border)] bg-[var(--surface-alt)]/50">
          <div className="relative inline-block w-20 h-20 shrink-0">
            {!imgErr ? (
              <img
                key={mascotSrc}
                src={mascotSrc}
                alt="Dahon"
                className="w-20 h-20 rounded-xl object-cover transition-transform duration-500 ease-out hover:scale-105"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400" />
            )}
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight">Dahon</div>
            <div className="text-sm opacity-80">
              “Dahon” — Tagalog for <em>leaf</em>, your calm, modern plant-care companion.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
