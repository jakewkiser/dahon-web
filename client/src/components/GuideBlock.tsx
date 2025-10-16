// client/src/components/GuideBlock.tsx
import { getCareGuide } from '../data/guides'

type Props = {
  /** Prefer species (e.g., "Monstera deliciosa"); falls back to name */
  species?: string
  name?: string
  className?: string
}

export default function GuideBlock({ species, name, className = '' }: Props) {
  const guide = getCareGuide(species || name)
  const sources = guide.sources ?? [] // <-- guard: never undefined

  return (
    <div className={`rounded-2xl p-4 glass ${className}`}>
      <div className="text-sm space-y-1">
        <div>
          <span className="opacity-70">Water:</span> {guide.water}
        </div>
        <div>
          <span className="opacity-70">Light:</span> {guide.light}
        </div>
        {guide.fertilizer && (
          <div>
            <span className="opacity-70">Fertilizer:</span> {guide.fertilizer}
          </div>
        )}
        {guide.notes && (
          <div>
            <span className="opacity-70">Notes:</span> {guide.notes}
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div className="mt-3">
          <div className="text-xs opacity-70 mb-1">Sources</div>
          <ul className="list-disc pl-5 text-xs">
            {sources.map((s, i) => (
              <li key={i}>
                <a className="underline" href={s.url} target="_blank" rel="noreferrer">
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
