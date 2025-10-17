// client/src/components/ui/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Theme = 'light' | 'dark'

function applyTheme(next: Theme) {
  const root = document.documentElement
  const isDark = next === 'dark'
  root.classList.toggle('dark', isDark)
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  localStorage.setItem('theme', next)
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * ThemeToggle — Dahon Edition
 * -------------------------------------
 * • Glass-button design with motion feedback
 * • Minimal and accessible
 * • Uses Dahon accent glow on hover
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className={[
        'relative inline-flex items-center justify-center rounded-xl p-2.5',
        'border border-white/10 dark:border-white/20',
        'backdrop-blur-lg bg-[var(--glass-surface)] hover:bg-[rgba(255,255,255,0.18)]',
        'shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent2)]',
        'transition-all duration-200 ease-out select-none',
      ].join(' ')}
    >
      {/* ☀️ / 🌙 Icon */}
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="text-lg"
      >
        {isDark ? '🌙' : '☀️'}
      </motion.span>

      {/* Accent glow ring */}
      <span className="absolute inset-0 rounded-xl ring-[var(--accent2)] ring-opacity-0 hover:ring-opacity-30 transition-all duration-300 pointer-events-none" />
    </motion.button>
  )
}
