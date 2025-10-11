import { useEffect, useState } from 'react'

type Props = { className?: string }

export default function ThemeToggle({ className = '' }: Props) {
  const [isDark, setIsDark] = useState(false)

  // Initialize from localStorage or system preference, and sync <html> class
  useEffect(() => {
    const root = document.documentElement
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const dark = saved ? saved === 'dark' : !!prefersDark
    root.classList.toggle('dark', dark)
    setIsDark(dark)
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    const root = document.documentElement
    root.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Match Topbar nav pill: text-only chip, no border, no ring
      className={[
        'px-3 py-1 rounded-lg text-sm',
        'hover:bg-black/5 dark:hover:bg-white/5',
        'transition-colors select-none outline-none', // no focus ring
        className,
      ].join(' ')}
      aria-label="Toggle theme"
    >
      Theme: {isDark ? 'dark' : 'light'}
    </button>
  )
}
