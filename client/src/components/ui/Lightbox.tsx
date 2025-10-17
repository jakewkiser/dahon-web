// client/src/components/ui/Lightbox.tsx
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  src?: string
  alt?: string
  onClose: () => void
}

/**
 * Lightbox Modal — Dahon Glass-Brutalist Edition
 * -----------------------------------------------
 *  • Soft glass backdrop with Material depth
 *  • Subtle spring motion for entry/exit
 *  • Minimal controls and clean framing
 *  • Token-driven colors for theme harmony
 */
export default function Lightbox({ open, src, alt, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* ✴ Backdrop — soft brutalist tint */}
          <motion.div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 🖼 Image container */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-w-4xl max-h-[85vh] w-auto rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 bg-[var(--glass-surface)] backdrop-blur-xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          >
            {src ? (
              <img
                src={src}
                alt={alt || 'Plant photo'}
                className="max-h-[85vh] object-contain"
              />
            ) : (
              <div className="flex items-center justify-center bg-[var(--surface)] text-[var(--ink)] p-8 font-medium">
                No image available
              </div>
            )}

            {/* ✨ Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-3 rounded-lg bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(0,0,0,0.4)] border border-white/10 text-[var(--ink)] dark:text-white/90 px-3 py-1.5 text-sm font-medium backdrop-blur-md hover:bg-[rgba(255,255,255,0.25)] dark:hover:bg-[rgba(0,0,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent2)]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              ✕ Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
