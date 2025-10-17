// client/src/components/ui/KawaiiMascot.tsx
import { motion } from 'framer-motion'

/**
 * Dahon Mascot (Glass-Brutalist Hybrid)
 * --------------------------------------
 * Visual direction:
 *  - Simplified, geometric shape hierarchy (Material influence)
 *  - Soft frosted gradients + bold leaf geometry
 *  - Minimal face, warm blush, gentle idle motion
 */
export default function KawaiiMascot({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dahon mascot"
      role="img"
      initial={{ scale: 0.98, opacity: 0.9 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 12 }}
    >
      <defs>
        {/* 🌈 Dahon Accent Gradient */}
        <linearGradient id="dahonAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent3)" />
          <stop offset="50%" stopColor="var(--accent2)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>

        {/* ✨ Soft Glass Blur */}
        <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 🌿 Ground Glow */}
      <ellipse
        cx="100"
        cy="124"
        rx="70"
        ry="12"
        fill="url(#dahonAccent)"
        opacity="0.15"
        filter="url(#glass-blur)"
      />

      {/* 🪴 Pot (Geometric Brutal Form) */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x="45"
          y="72"
          width="110"
          height="58"
          rx="12"
          fill="url(#dahonAccent)"
          opacity="0.9"
          filter="url(#glass-blur)"
        />
        <rect
          x="38"
          y="63"
          width="124"
          height="18"
          rx="9"
          fill="rgba(255,255,255,0.65)"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
      </motion.g>

      {/* 🌱 Leaves (Material-Brutal Gradient Layers) */}
      <motion.g
        initial={{ rotate: -1 }}
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M100 60 C 82 32, 80 18, 104 10 C 122 22, 112 45, 100 60 Z"
          fill="#8FD19E"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
        <path
          d="M120 60 C 138 36, 152 20, 130 12 C 110 22, 114 45, 120 60 Z"
          fill="#5FBF94"
        />
        <path
          d="M82 60 C 64 40, 54 28, 72 20 C 90 28, 88 48, 82 60 Z"
          fill="#4BAE7E"
        />
      </motion.g>

      {/* 😊 Face (Minimal, Material-Brutalist Linework) */}
      <circle cx="80" cy="98" r="6" fill="var(--ink)" />
      <circle cx="120" cy="98" r="6" fill="var(--ink)" />
      <path
        d="M88 110 C 95 116, 105 116, 112 110"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* 🌸 Blush */}
      <circle cx="68" cy="104" r="4" fill="#FF9EBB" opacity="0.75" />
      <circle cx="132" cy="104" r="4" fill="#FF9EBB" opacity="0.75" />
    </motion.svg>
  )
}
