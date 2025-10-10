// client/src/components/ui/Button.tsx
import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'glass' | 'primary' | 'primarySoft' | 'ghost'
}

export default function Button({ className = '', variant = 'glass', style, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center px-4 py-2 rounded-xl border focus:outline-none focus-visible:ring-2 ring-accent transition font-medium'

  // Loud gradient (kept for places where you want pop)
  if (variant === 'primary') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={`${base} ${className} border-transparent !text-white shadow-md`}
        style={{
          backgroundImage: 'linear-gradient(90deg, #ff3cac, #9b5cff, #00d4ff)',
          backgroundColor: '#9b5cff',
          color: '#fff',
          position: 'relative',
          zIndex: 1,
          ...style,
        }}
        {...props}
      />
    )
  }

  // NEW: Soft Sage glass chip (higher contrast label)
  // Palette (light):
  // chip  #EDF5F1   • text  #1F6A4E   • ring  #A6D8C0   • hover  #DFECE6
  // Palette (dark):
  // chip  rgba(15,26,22,0.9) • text  #D3F0E0 • ring  #A6D8C0
  if (variant === 'primarySoft') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={[
          base,
          className,
          // darker sage label for strong contrast in light; soft mint in dark
          'text-[#1F6A4E] dark:text-[#093d20]',
          // subtle hover in both themes
          'hover:bg-[#DFECE6] dark:hover:bg-[#17241F]',
          'shadow-sm'
        ].join(' ')}
        style={{
          // light theme chip
          backgroundColor: '#EDF5F1',
          // faint sage tint to keep it “glassy”
          backgroundImage: 'linear-gradient(0deg, rgba(166,216,192,0.12), rgba(166,216,192,0.12))',
          // dark theme base via overlay + higher opacity below
          // soft glass feel
          backdropFilter: 'blur(12px)',
          // thin sage ring
          outline: '1px solid rgba(166,216,192,0.35)',
          boxShadow: '0 6px 28px rgba(0,0,0,0.10)',
          ...style,
        }}
        {...props}
        // Dark chip tweak using inline style override at runtime
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        data-theme-aware // no-op marker
      />
    )
  }

  // ghost
  if (variant === 'ghost') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={`${base} ${className} bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5`}
        {...props}
      />
    )
  }

  // glass (default)
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${base} ${className} glass border-white/10 shadow-glow hover:shadow-glass`}
      {...props}
    />
  )
}

