import Button from './Button'
import { useTheme } from '../../lib/theme'
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Theme: {theme}</Button>
}