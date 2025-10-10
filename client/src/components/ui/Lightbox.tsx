import { useEffect } from 'react'

type Props = {
  open: boolean
  src?: string
  alt?: string
  onClose: () => void
}

export default function Lightbox({ open, src, alt, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Dim backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Image panel */}
      <div
        className="relative z-10 max-w-4xl max-h-[85vh] w-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Care log photo'}
            className="max-h-[85vh] object-contain"
          />
        ) : (
          <div className="bg-surface text-ink p-6">No image</div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-lg bg-black/60 text-white px-2.5 py-1 text-sm hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Close
        </button>
      </div>
    </div>
  )
}
