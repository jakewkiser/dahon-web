// client/src/components/ui/Button.tsx
import { motion } from 'framer-motion'
import type React from 'react'

type Variant = 'primary' | 'neutral' | 'ghost'

type MotionButtonProps = React.ComponentProps<typeof motion.button>

type Props = Omit<MotionButtonProps, 'ref'> & {
  variant?: Variant
}

/**
 * Dahon Button Component — v2
 * ----------------------------------------------------------
 * A minimal, geometric button system blending Notion calm,
 * Material clarity, and a touch of brutalist solidity.
 * ----------------------------------------------------------
 */
export default function Button({
  className = '',
  variant = 'neutral',
  style,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center font-medium tracking-tight px-4 py-2 rounded-md transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  // 🪴 Primary: Sage accent with glow
  if (variant === 'primary') {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className={[
          base,
          'text-white bg-[var(--color-primary)] shadow-sm',
          'hover:bg-[var(--color-primary-light)] hover:shadow-[var(--shadow-glow)]',
          'focus-visible:ring-[var(--color-primary)]',
          'active:scale-[0.98]',
          className,
        ].join(' ')}
        style={{
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 8px rgba(74,92,82,0.2)',
          ...style,
        }}
        {...props}
      />
    )
  }

  // 🌿 Neutral: Minimal surface button (default)
  if (variant === 'neutral') {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        className={[
          base,
          'bg-[var(--color-surface)] text-[var(--color-ink)]',
          'border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.1)]',
          'hover:shadow-[var(--shadow-soft)]',
          'dark:bg-[var(--color-surface)]',
          className,
        ].join(' ')}
        style={{
          backdropFilter: 'blur(6px)',
          ...style,
        }}
        {...props}
      />
    )
  }

  // 🌫️ Ghost: Clean, transparent variant for toolbar/links
  if (variant === 'ghost') {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        className={[
          base,
          'bg-transparent text-[var(--color-ink-muted)]',
          'hover:text-[var(--color-ink)]',
          'dark:hover:bg-[rgba(255,255,255,0.05)]',
          'border border-transparent',
          className,
        ].join(' ')}
        {...props}
      />
    )
  }

  // Default fallback
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${className}`}
      {...props}
    />
  )
}
