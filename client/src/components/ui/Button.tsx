// client/src/components/ui/Button.tsx
import { motion } from 'framer-motion'
import type React from 'react'

type Variant = 'glass' | 'primary' | 'primarySoft' | 'ghost'

// Use Framer Motion’s props to avoid onDrag/onPointer type conflicts
type MotionButtonProps = React.ComponentProps<typeof motion.button>

type Props = Omit<MotionButtonProps, 'ref'> & {
  variant?: Variant
}

export default function Button({
  className = '',
  variant = 'glass',
  style,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center px-4 py-2 rounded-xl border focus:outline-none focus-visible:ring-2 ring-accent transition font-medium'

  // Loud gradient (kept for places you want pop)
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

  // Soft Sage glass chip with dark-olive label (your latest request)
  // Light: chip #EDF5F1 • text #2F3E2C • ring #A6D8C0 • hover #DFECE6
  // Dark:  chip rgba(15,26,22,0.9) • text #DCE7D7
  if (variant === 'primarySoft') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={[
          base,
          className,
          'text-[#2F3E2C] dark:text-[#DCE7D7]',
          'hover:bg-[#DFECE6] dark:hover:bg-[#17241F]',
          'shadow-sm',
        ].join(' ')}
        style={{
          backgroundColor: '#EDF5F1',
          backgroundImage:
            'linear-gradient(0deg, rgba(166,216,192,0.12), rgba(166,216,192,0.12))',
          backdropFilter: 'blur(12px)',
          outline: '1px solid rgba(166,216,192,0.35)',
          boxShadow: '0 6px 28px rgba(0,0,0,0.10)',
          color: '#2F3E2C',
          ...style,
        }}
        {...props}
      />
    )
  }

  // Ghost
  if (variant === 'ghost') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={`${base} ${className} bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5`}
        {...props}
      />
    )
  }

  // Glass (default)
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${base} ${className} glass border-white/10 shadow-glow hover:shadow-glass`}
      {...props}
    />
  )
}
