// client/src/components/ui/Card.tsx
import type React from 'react'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  className?: string
  variant?: 'glass' | 'surface' | 'brutal'
  hover?: boolean
}

/**
 * Dahon Card Component — v2
 * ----------------------------------------------------------
 * Visual style: minimal glass, neutral material, or brutalist.
 * - glass: soft, frosted translucent layer
 * - surface: solid neutral block for content or forms
 * - brutal: sharp, outlined box with bold contrast
 * ----------------------------------------------------------
 */
export default function Card({
  children,
  className = '',
  variant = 'glass',
  hover = true,
}: Props) {
  const base =
    'rounded-xl transition-all duration-200 overflow-hidden'

  const variants: Record<string, string> = {
    glass: `
      bg-[var(--glass-bg)]
      backdrop-blur-[var(--glass-blur)]
      border border-[var(--glass-border)]
      shadow-[var(--shadow-soft)]
      hover:shadow-[var(--shadow-medium)]
      hover:translate-y-[-1px]
    `,
    surface: `
      bg-[var(--color-surface)]
      border border-[rgba(0,0,0,0.06)]
      dark:border-[rgba(255,255,255,0.08)]
      shadow-[var(--shadow-soft)]
    `,
    brutal: `
      bg-[var(--color-surface-strong)]
      border-2 border-[var(--color-secondary)]
      shadow-[3px_3px_0_var(--color-primary)]
      hover:shadow-[4px_4px_0_var(--color-primary-light)]
      font-semibold
    `,
  }

  const motionProps = hover
    ? { whileHover: { y: -2 }, whileTap: { scale: 0.98 } }
    : {}

  return (
    <motion.div
      {...motionProps}
      className={`${base} ${variants[variant]} p-5 ${className}`}
    >
      {children}
    </motion.div>
  )
}
