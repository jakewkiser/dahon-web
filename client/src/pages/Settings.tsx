// client/src/pages/Settings.tsx
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../lib/auth'

type Source = { title: string; url: string }

// Built-in fallback so the page never crashes if the data file is missing
const FALLBACK_SOURCES: Source[] = [
  { title: 'University Extensions (IFAS, UW, UVM, etc.)', url: 'https://extension.org/' },
  { title: 'Royal Horticultural Society (RHS)', url: 'https://www.rhs.org.uk/plants' },
  { title: 'Missouri Botanical Garden', url: 'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderSearch.aspx' },
  { title: 'Kew Science – Plants of the World Online', url: 'https://powo.science.kew.org/' }
]

export default function Settings() {
  const { user, signOut } = useAuth()
  const [sources, setSources] = useState<Source[]>(FALLBACK_SOURCES)

  // Try to dynamically import the source list; fallback keeps UI stable
  useEffect(() => {
    let alive = true
    import('../data/guide-sources')
      .then((mod) => {
        const arr = (mod as any).CARE_GUIDE_SOURCES as Source[] | undefined
        if (alive && Array.isArray(arr) && arr.length) setSources(arr)
      })
      .catch(() => {
        // ignore – fallback already in place
      })
    return () => { alive = false }
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold mb-3">Settings</h1>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm opacity-80">Light / Dark</div>
            </div>
            <ThemeToggle />
          </div>

          <hr className="border-white/10" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-medium">Account</div>
              <div className="text-sm opacity-80 break-all">{user?.email}</div>
            </div>
            <div className="text-right">
              <Button className="text-ink" onClick={signOut}>Sign out</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Care Guide Information */}
      <Card>
        <h2 className="text-lg font-semibold mb-1">Care Guides — How We Build Them</h2>
        <p className="text-sm opacity-80">
          Recommended guides combine horticultural best practices summarized from reputable sources.
          They provide friendly suggestions, not guarantees—always adjust for your environment.
        </p>

        <div className="mt-3">
          <div className="text-sm font-medium mb-1">Sources</div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {sources.map((s, i) => (
              <li key={i}>
                <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  )
}
