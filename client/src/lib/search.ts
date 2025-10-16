// client/src/lib/search.ts
import { ALL_PLANTS, type PlantRecord, findLocalGuide } from '../data/plants'

export type PlantGuide = PlantRecord // maintain expected type alias

/** Report whether local AI search is ready and how many plants are indexed. */
export function aiSearchStatus() {
  return { provider: 'local', ready: ALL_PLANTS.length > 0, count: ALL_PLANTS.length }
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * localSearch
 * Lightweight fuzzy search over plant names and species.
 */
export function localSearch(q: string, limit = 30) {
  const nq = norm(q.trim())
  if (!nq) return []

  const rows = ALL_PLANTS.map((p, i) => {
    const hayRaw = `${p.name} ${p.species ?? ''}`.trim()
    const hay = norm(hayRaw)
    const starts = hay.startsWith(nq)
    const includes = !starts && hay.includes(nq)

    // Simple score: starts-with wins, then includes; tie-break by shorter name then original index
    const score = (starts ? 3 : 0) + (includes ? 1 : 0)

    return { ...p, _localId: i, score, _len: hayRaw.length }
  })
    .filter(r => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a._len !== b._len) return a._len - b._len
      return a._localId - b._localId
    })
    .slice(0, limit)
    .map(({ _len, ...rest }) => rest)

  return rows
}

/**
 * getLocalGuideByName
 * Retrieves a guide by normalized common name or species.
 */
export function getLocalGuideByName(name?: string): PlantRecord | undefined {
  if (!name) return
  const n = norm(name)
  return (
    ALL_PLANTS.find(p => norm(p.name) === n) ||
    ALL_PLANTS.find(p => p.species && norm(p.species) === n)
  )
}

// --- Back-compat exports ---
export const PLANTS = ALL_PLANTS
export const findLocalGuideLegacy = findLocalGuide
