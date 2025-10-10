import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        surfaceAlt: 'var(--surface-alt)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        accent3: 'var(--accent3)'
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,0,0,0.1)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.2)'
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px'
      }
    }
  },
  plugins: []
} satisfies Config