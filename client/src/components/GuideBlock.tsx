// client/src/components/GuideBlock.tsx
import Card from './ui/Card'
import { getCareGuide } from '../data/guides'

type Props = {
  species?: string
}

export default function GuideBlock({ species }: Props) {
  const guide = getCareGuide(species)

  return (
    <Card className="mb-4">
      {/* Source line above the guide, per spec */}
      <div className="text-xs opacity-70 mb-1">
        Source:{' '}
        <a
          href={guide.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:opacity-80"
        >
          {guide.sourceName}
        </a>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Recommended Care</h3>
        <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          {guide.name}
        </span>
      </div>

      <p className="text-sm opacity-90 mb-2">{guide.summary}</p>

      <ul className="list-disc pl-5 space-y-1 text-sm">
        {guide.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </Card>
  )
}
