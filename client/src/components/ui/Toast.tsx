// client/src/components/ui/Toast.tsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, ToastItem } from '../../lib/toast'

function ToastIcon({ type }: { type: ToastItem['type'] }) {
  if (type === 'success') return <span className="text-emerald-500 text-base leading-none">✓</span>
  if (type === 'error') return <span className="text-red-500 text-base leading-none">✕</span>
  return <span className="text-[var(--accent2)] text-base leading-none">i</span>
}

export default function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => toast.subscribe(setItems), [])

  return createPortal(
    <div
      aria-live="polite"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-50 flex flex-col gap-2 items-center sm:items-end pointer-events-none"
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg border backdrop-blur-md bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--ink)] max-w-xs"
          >
            <ToastIcon type={item.type} />
            <span>{item.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
