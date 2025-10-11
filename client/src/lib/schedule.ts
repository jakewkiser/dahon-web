// client/src/lib/schedule.ts
import { CareLog, Plant } from './firebase'

// Default cadence (days) when we don't have a species-specific guide
const DEFAULTS = {
  water: 7,        // weekly watering default
  fertilizer: 30,  // monthly
}

// ---- helpers ----
function isFiniteMillis(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

// CareLog.createdAt is already a number in our data layer, but be defensive
function getMillis(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (v instanceof Date && Number.isFinite(v.getTime())) return v.getTime()
  // Firestore Timestamp-like objects from older code paths
  if (v && typeof (v as any).toDate === 'function') {
    const d = (v as any).toDate()
    return Number.isFinite(d.getTime()) ? d.getTime() : null
  }
  if (v && typeof (v as any).seconds === 'number') {
    return Math.round((v as any).seconds * 1000)
  }
  return null
}

function lastOfType(logs: CareLog[], type: CareLog['type']): number | null {
  const l = logs.find((x) => x.type === type) // logs should already be newest-first
  return getMillis(l?.createdAt)
}

// ---- core API ----
export function computeNextCareFromLogs(plant: Plant, logs: CareLog[]) {
  // Prefer type-specific last logs; pick the soonest upcoming date
  const lastWater =
    lastOfType(logs, 'water') ??
    getMillis(plant.lastCareAt) ??
    getMillis(plant.createdAt)

  const lastFert = lastOfType(logs, 'fertilizer')

  const candidates: { type: 'water' | 'fertilizer'; dueAt: number; label: string }[] = []

  if (isFiniteMillis(lastWater)) {
    const dueAt = lastWater + DEFAULTS.water * 24 * 60 * 60 * 1000
    if (isFiniteMillis(dueAt)) candidates.push({ type: 'water', dueAt, label: 'Water' })
  }
  if (isFiniteMillis(lastFert)) {
    const dueAt = lastFert + DEFAULTS.fertilizer * 24 * 60 * 60 * 1000
    if (isFiniteMillis(dueAt)) candidates.push({ type: 'fertilizer', dueAt, label: 'Fertilize' })
  }

  if (candidates.length === 0) {
    // No usable history at all — offer a gentle start
    const dueAt = Date.now() + 3 * 24 * 60 * 60 * 1000
    return { type: 'water' as const, dueAt, label: 'Start with a light watering' }
  }

  candidates.sort((a, b) => a.dueAt - b.dueAt)
  return candidates[0]
}

export function formatNextCare(next?: { label: string; dueAt?: number } | null) {
  if (!next || !isFiniteMillis(next.dueAt)) {
    // No valid date — return just the label or a placeholder
    return next?.label ?? '—'
  }
  try {
    const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
    const when = fmt.format(new Date(next.dueAt))
    return `${next.label} • ${when}`
  } catch {
    return next.label ?? '—'
  }
}

// Optional convenience if you want a one-liner:
// export function nextCareText(plant: Plant, logs: CareLog[]) {
//   return formatNextCare(computeNextCareFromLogs(plant, logs))
// }
