// client/src/lib/schedule.ts
import { CareLog, Plant } from './firebase'

// Default cadence (days) when no species-specific guide is available
const DEFAULTS = {
  water: 7,        // weekly watering default
  fertilizer: 30,  // monthly
}

// ---- helpers ----
function isFiniteMillis(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function getMillis(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (v instanceof Date && Number.isFinite(v.getTime())) return v.getTime()
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
  const l = logs.find((x) => x.type === type) // logs sorted newest-first
  return getMillis(l?.createdAt)
}

// ---- core API ----
export function computeNextCareFromLogs(plant: Plant, logs: CareLog[]) {
  const now = Date.now()
  const lastWater =
    lastOfType(logs, 'water') ??
    getMillis(plant.lastCareAt) ??
    getMillis(plant.createdAt)

  const lastFert = lastOfType(logs, 'fertilizer')

  const candidates: { type: 'water' | 'fertilizer'; dueAt: number; label: string }[] = []

  if (isFiniteMillis(lastWater)) {
    const dueAt = lastWater + DEFAULTS.water * 24 * 60 * 60 * 1000
    candidates.push({ type: 'water', dueAt, label: 'Water' })
  }
  if (isFiniteMillis(lastFert)) {
    const dueAt = lastFert + DEFAULTS.fertilizer * 24 * 60 * 60 * 1000
    candidates.push({ type: 'fertilizer', dueAt, label: 'Fertilize' })
  }

  // If no care logs exist yet
  if (candidates.length === 0) {
    return { type: 'water' as const, dueAt: now, label: 'Start with a light watering' }
  }

  // Find next due event
  candidates.sort((a, b) => a.dueAt - b.dueAt)
  const next = candidates[0]

  // Add contextual info for overdue or soon-due
  const daysUntil = Math.round((next.dueAt - now) / (1000 * 60 * 60 * 24))
  let phrasedLabel = next.label

  if (daysUntil < 0) {
    phrasedLabel = `${next.label} overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'}`
  } else if (daysUntil === 0) {
    phrasedLabel = `${next.label} today`
  } else if (daysUntil === 1) {
    phrasedLabel = `${next.label} tomorrow`
  } else if (daysUntil <= 5) {
    phrasedLabel = `${next.label} in ${daysUntil} days`
  }

  return { ...next, phrasedLabel }
}

export function formatNextCare(next?: { label?: string; phrasedLabel?: string; dueAt?: number } | null) {
  if (!next) return '—'

  // Use contextual label if available
  const label = next.phrasedLabel || next.label || '—'

  if (!isFiniteMillis(next.dueAt)) {
    return label
  }

  try {
    const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
    const when = fmt.format(new Date(next.dueAt))
    return `${label} • ${when}`
  } catch {
    return label
  }
}
