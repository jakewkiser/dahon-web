import { useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'

type Opts = {
  warnAfter?: number      // ms until prompt
  signOutAfter?: number   // ms until auto sign-out
}

/**
 * Idle sign-out:
 * - Prompt at warnAfter (default 60s)
 * - Auto sign-out at signOutAfter (default 3min)
 * - DOES NOT sign out on page unload/refresh
 */
export function useIdleSignOut(opts: Opts = {}) {
  const warnAfter = opts.warnAfter ?? 60_000
  const signOutAfter = opts.signOutAfter ?? 180_000

  const warnTimer = useRef<number | null>(null)
  const killTimer = useRef<number | null>(null)

  const clearTimers = () => {
    if (warnTimer.current) { window.clearTimeout(warnTimer.current); warnTimer.current = null }
    if (killTimer.current) { window.clearTimeout(killTimer.current); killTimer.current = null }
  }

  const startTimers = () => {
    clearTimers()

    // Show prompt at warnAfter
    warnTimer.current = window.setTimeout(() => {
      const stay = window.confirm('You’ve been inactive. Stay signed in?')
      if (stay) {
        // User confirmed — reset timers to give them a fresh session window
        startTimers()
      } else {
        // User declined — sign out immediately
        signOut(auth).catch(() => {})
      }
    }, warnAfter)

    // Hard auto sign-out at signOutAfter
    killTimer.current = window.setTimeout(() => {
      signOut(auth).catch(() => {})
    }, signOutAfter)
  }

  const noteActivity = () => {
    // Any activity resets the countdowns
    startTimers()
  }

  useEffect(() => {
    // Start timers on mount
    startTimers()

    // Typical activity listeners
    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((ev) => window.addEventListener(ev, noteActivity, { passive: true }))

    // Reset when the page becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === 'visible') startTimers()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // IMPORTANT: No beforeunload/unload handlers → no sign-out on refresh.
    return () => {
      clearTimers()
      events.forEach((ev) => window.removeEventListener(ev, noteActivity))
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnAfter, signOutAfter])
}
