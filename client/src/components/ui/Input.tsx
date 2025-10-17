// client/src/components/ui/Input.tsx
import type { InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type Variant = 'frosted' | 'surface' | 'brutal'
type Props = InputHTMLAttributes<HTMLInputElement> & {
  variant?: Variant
}

/**
 * Dahon Input Component — v2.1
 * ----------------------------------------------------------
 * Design: Minimal glass with material clarity and brutalist edge.
 * Variants:
 *  • frosted  – default soft glass field
 *  • surface  – clean, solid background field
 *  • brutal   – bold outlined form with hard contrast
 * ----------------------------------------------------------
 */
export default function Input({
  className = '',
  variant = 'frosted',
  ...props
}: Props) {
  const base =
    'w-full px-3 py-2 text-[var(--color-ink)] rounded-md transition-all duration-150 focus:outline-none'

  const variants: Record<Variant, string> = {
    frosted: `
      bg-[rgba(255,255,255,0.65)]
      border border-[rgba(0,0,0,0.08)]
      dark:bg-[rgba(255,255,255,0.08)]
      dark:border-[rgba(255,255,255,0.1)]
      backdrop-blur-[6px]
      focus:border-[var(--color-primary)]
      focus:shadow-[var(--focus-ring)]
      placeholder:text-[rgba(30,35,41,0.5)]
      dark:placeholder:text-[rgba(223,230,238,0.45)]
    `,
    surface: `
      bg-[var(--color-surface)]
      border border-[rgba(0,0,0,0.06)]
      dark:border-[rgba(255,255,255,0.08)]
      focus:border-[var(--color-primary)]
      focus:shadow-[var(--focus-ring)]
      placeholder:text-[rgba(30,35,41,0.5)]
      dark:placeholder:text-[rgba(223,230,238,0.45)]
    `,
    brutal: `
      bg-[var(--color-surface)]
      border-2 border-[var(--color-secondary)]
      shadow-[2px_2px_0_var(--color-primary)]
      focus:shadow-[3px_3px_0_var(--color-primary-light)]
      font-semibold
      placeholder:text-[rgba(30,35,41,0.6)]
    `,
  }

  // ✅ Use motion.div wrapper to keep soft scale animations w/o TS conflict
  return (
    <motion.div
      whileFocus={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className="w-full"
    >
      <input
        {...props}
        className={`${base} ${variants[variant]} ${className}`}
      />
    </motion.div>
  )
}
