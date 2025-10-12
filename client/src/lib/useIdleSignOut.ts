// client/src/lib/useIdleSignOut.ts
import { useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'

type Opts = {
  warnAfter?: number      // ms until prompt (default 60s)
  signOutAfter?: number   // ms until auto sign-out (default 3min)
}

/**
 * Idle sign-out:
 * - Prompt at warnAfter via window.confirm
 * - Auto sign-out at signOutAfter
 * - Pauses while tab is hidden (prevents sign-out on refresh/background)
 * - Never signs out on unload/refresh
 */
export function useIdleSignOut(opts: Opts = {}) {
  const warnAfter = opts.warnAfter ?? 60_000
  const signOutAfter = opts.signOutAfter ?? 180_000

  const warnTimer = useRef<number | null>(null)
  const killTimer = useRef<number | null>(null)
  const pausedRef = useRef<boolean>(false)
  const lastActiveRef = useRef<number>(Date.now())

  const clearTimers = () => {
    if (warnTimer.current) { window.clearTimeout(warnTimer.current); warnTimer.current = null }
    if (killTimer.current) { window.clearTimeout(killTimer.current); killTimer.current = null }
  }

  const schedule = () => {
    clearTimers()
    if (pausedRef.current) return

    const now = Date.now()
    const idleFor = now - lastActiveRef.current

    // If already past signOutAfter, sign out now
    if (idleFor >= signOutAfter) {
      signOut(auth).catch(() => {})
      return
    }

    // If already past warnAfter, prompt immediately
    if (idleFor >= warnAfter) {
      const stay = window.confirm('You’ve been inactive. Stay signed in?')
      if (stay) {
        lastActiveRef.current = Date.now()
        schedule()
      } else {
        signOut(auth).catch(() => {})
      }
      return
    }

    // Otherwise schedule warn + kill
    const toWarn = Math.max(0, warnAfter - idleFor)
    const toKill = Math.max(0, signOutAfter - idleFor)

    warnTimer.current = window.setTimeout(() => {
      const stay = window.confirm('You’ve been inactive. Stay signed in?')
      if (stay) {
        lastActiveRef.current = Date.now()
        schedule()
      } else {
        signOut(auth).catch(() => {})
      }
    }, toWarn)

    killTimer.current = window.setTimeout(() => {
      signOut(auth).catch(() => {})
    }, toKill)
  }

  const markActivity = () => {
    if (pausedRef.current) return
    lastActiveRef.current = Date.now()
    schedule()
  }

  useEffect(() => {
    // Start
    schedule()

    // Activity listeners
    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((ev) => window.addEventListener(ev, markActivity, { passive: true }))

    // Pause/resume on visibility change (prevents sign-out on refresh/background)
    const onVisibility = () => {
      pausedRef.current = document.visibilityState === 'hidden'
      if (pausedRef.current) {
        clearTimers()
      } else {
        // Recompute when shown again
        schedule()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Cleanup
    return () => {
      clearTimers()
      events.forEach((ev) => window.removeEventListener(ev, markActivity))
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnAfter, signOutAfter])
}
