// client/src/components/ui/ThemeToggle.tsx
import { useEffect, useState } from 'react'

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
  // default to media preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    // ensure DOM reflects current state on mount
    applyTheme(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="px-3 py-1.5 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-0"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
