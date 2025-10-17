// client/src/components/GuideBlock.tsx
import { getCareGuide } from '../data/guides'

type Props = {
  /** Prefer species (e.g., "Monstera deliciosa"); falls back to name */
  species?: string
  name?: string
  className?: string
}

/**
 * GuideBlock — Dahon Style
 * --------------------------------------------------------
 * - Minimal glass card for water/light/fertilizer guidance
 * - Elegant brutalist linework + subtle gradients
 * - Sources block fades gently into view
 */
export default function GuideBlock({ species, name, className = '' }: Props) {
  const guide = getCareGuide(species || name)
  const sources = guide.sources ?? []

  return (
    <div
      className={[
        'rounded-2xl p-5 glass-card soft-fade shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
        'border border-[var(--glass-border)] transition-all duration-200',
        'hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)] hover:-translate-y-[2px]',
        className,
      ].join(' ')}
    >
      <div className="text-sm space-y-2 text-[var(--ink)]">
        <div className="flex justify-between items-start border-b border-[var(--glass-border)] pb-2 mb-2">
          <span className="text-xs uppercase tracking-wide opacity-70">Water</span>
          <span className="font-medium">{guide.water}</span>
        </div>
        <div className="flex justify-between items-start border-b border-[var(--glass-border)] pb-2 mb-2">
          <span className="text-xs uppercase tracking-wide opacity-70">Light</span>
          <span className="font-medium">{guide.light}</span>
        </div>
        {guide.fertilizer && (
          <div className="flex justify-between items-start border-b border-[var(--glass-border)] pb-2 mb-2">
            <span className="text-xs uppercase tracking-wide opacity-70">Fertilizer</span>
            <span className="font-medium">{guide.fertilizer}</span>
          </div>
        )}
        {guide.notes && (
          <div>
            <span className="text-xs uppercase tracking-wide opacity-70 block mb-1">
              Notes
            </span>
            <p className="text-sm leading-relaxed">{guide.notes}</p>
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
          <div className="text-xs uppercase tracking-wide opacity-70 mb-1">
            Sources
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            {sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-[var(--accent2)]/40 hover:decoration-[var(--accent2)] hover:text-[var(--accent2)] transition-colors duration-200"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
