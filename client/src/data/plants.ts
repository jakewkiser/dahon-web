// client/src/data/plants.ts
// Unified loader and local search across the 100-plant dataset.

import raw from "./plants_local.json"

export type Source = { title?: string; url?: string }
export type Guide = {
  water?: string
  light?: string
  fertilizer?: string
  notes?: string
}
export type PlantRecord = {
  id: string
  name: string
  species?: string
  guide: Guide
  sources?: Source[]
  image?: string
}

function slug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
}

function normalizeRow(row: any, idx: number): PlantRecord {
  const name = String(row?.name || "").trim()
  const species = row?.species ? String(row.species).trim() : undefined

  const guide: Guide = {
    water: row?.guide?.water ?? row?.water ?? undefined,
    light: row?.guide?.light ?? row?.light ?? undefined,
    fertilizer: row?.guide?.fertilizer ?? row?.fertilizer ?? undefined,
    notes: row?.guide?.notes ?? row?.notes ?? undefined,
  }

  const sources: Source[] | undefined = Array.isArray(row?.sources)
    ? row.sources.map((s: any) => ({
        title: s?.title || undefined,
        url: s?.url || undefined,
      }))
    : undefined

  // 🖼️ Preserve or infer image path
  const image =
    row?.image && typeof row.image === "string"
      ? row.image.startsWith("/")
        ? row.image
        : `/plants_local_examples/${row.id ?? idx}/${row.image}`
      : `/plants_local_examples/${row.id ?? idx}/placeholder.jpg`

  return {
    id: row?.id ? String(row.id) : slug(name || species || `plant-${idx}`),
    name: name || species || `Plant ${idx + 1}`,
    species,
    guide,
    sources,
    image, // ✅ include image in the normalized record
  }
}

export const ALL_PLANTS: PlantRecord[] = (raw as any[]).map(normalizeRow)

// -----------------------------------------------------------------------------
// 🔍 Robust Local Guide Lookup
// -----------------------------------------------------------------------------

export function findLocalGuide(
  name?: string,
  species?: string
): { guide: Guide; sources?: Source[]; plant?: PlantRecord } | undefined {
  if (!name && !species) return undefined

  const normalize = (s?: string) =>
    (s || "")
      .toLowerCase()
      .replace(/[‘’“”']/g, "")
      .replace(/\s+/g, " ")
      .trim()

  const keys = [species, name].filter(Boolean).map(normalize)

  for (const p of ALL_PLANTS) {
    const pname = normalize(p.name)
    const pspecies = normalize(p.species)

    if (keys.some((k) => pname === k || pspecies === k))
      return { guide: p.guide, sources: p.sources, plant: p }

    if (keys.some((k) => pname.includes(k) || pspecies.includes(k)))
      return { guide: p.guide, sources: p.sources, plant: p }

    const pgenus = pname.split(" ")[0]
    if (keys.some((k) => k.startsWith(pgenus)))
      return { guide: p.guide, sources: p.sources, plant: p }
  }

  return undefined
}

// -----------------------------------------------------------------------------
// Local fuzzy search
// -----------------------------------------------------------------------------

export function localSearch(query: string, limit = 30) {
  const q = query.trim().toLowerCase()
  if (q.length < 2)
    return [] as Array<PlantRecord & { _localId: number; score: number }>
  const scored: Array<PlantRecord & { _localId: number; score: number }> = []
  ALL_PLANTS.forEach((p, i) => {
    const hay = `${p.name} ${p.species || ""}`.toLowerCase()
    if (hay.includes(q)) {
      const starts =
        p.name.toLowerCase().startsWith(q) ||
        (p.species || "").toLowerCase().startsWith(q)
      const score = starts ? 2 : 1
      scored.push({ ...p, _localId: i, score })
    }
  })
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  return scored.slice(0, limit)
}

// -----------------------------------------------------------------------------
// Source aggregation for Settings view
// -----------------------------------------------------------------------------

export function listAllSources(): Source[] {
  const seen = new Set<string>()
  const out: Source[] = []
  for (const p of ALL_PLANTS) {
    for (const s of p.sources || []) {
      const key = `${s.url || ""}|${s.title || ""}`
      if (!seen.has(key)) {
        seen.add(key)
        out.push({ title: s.title, url: s.url })
      }
    }
  }
  return out
}
