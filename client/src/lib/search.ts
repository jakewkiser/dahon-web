import Fuse from 'fuse.js'
import type { LocalPlantGuide } from '../data/plants.us-top100'
import { PLANTS_US_TOP } from '../data/plants.us-top100'

// Algolia optional wiring
const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID as string | undefined
const ALGOLIA_API_KEY = import.meta.env.VITE_ALGOLIA_API_KEY as string | undefined
const ALGOLIA_INDEX = import.meta.env.VITE_ALGOLIA_INDEX as string | undefined

type LocalResult = LocalPlantGuide & { _localId: number }

let fuse: Fuse<LocalResult> | null = null

function buildFuse() {
  const base: LocalResult[] = PLANTS_US_TOP.map((p, i) => ({ ...p, _localId: i }))
  fuse = new Fuse(base, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: 'name', weight: 0.6 },
      { name: 'species', weight: 0.3 },
      { name: 'guide.water', weight: 0.05 },
      { name: 'guide.light', weight: 0.05 }
    ]
  })
  return fuse
}

export function localSearch(query: string, limit = 20): LocalResult[] {
  if (!fuse) buildFuse()
  if (query.trim().length < 2) return []
  const res = fuse!.search(query, { limit })
  return res.map(r => r.item)
}

export function getLocalGuideByName(name: string): LocalPlantGuide | undefined {
  return PLANTS_US_TOP.find(p => p.name.toLowerCase() === name.toLowerCase())
}

export function aiSearchStatus(): 'Algolia Connected' | 'Local Search (Fuse.js)' {
  if (ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX) return 'Algolia Connected'
  return 'Local Search (Fuse.js)'
}

// Placeholder Algolia search shim for future enablement
export async function search(query: string, limit = 20) {
  if (ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX) {
    // Dynamically import to avoid bundle when unused
    const [{ default: algoliasearch }] = await Promise.all([import('algoliasearch')])
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
    const index = client.initIndex(ALGOLIA_INDEX)
    const { hits } = await index.search(query, { hitsPerPage: limit })
    return hits
  }
  return localSearch(query, limit)
}
