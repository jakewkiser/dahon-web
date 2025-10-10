// client/src/lib/theme.tsx
import { createContext, useContext, useLayoutEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'light',
  setTheme: () => {},
})

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
    root.style.colorScheme = 'light'
  }
  localStorage.setItem('theme', theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light')
  useLayoutEffect(() => applyTheme(theme), [theme])
  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
