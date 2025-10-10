import { CareLog, Plant } from './firebase'

// Default cadence (days) when we don't have a species-specific guide
const DEFAULTS = {
  water: 7,          // weekly watering default
  fertilizer: 30,    // monthly
}

function lastOfType(logs: CareLog[], type: CareLog['type']): number | undefined {
  const l = logs.find((x) => x.type === type) // logs should already be newest-first
  return l?.createdAt
}

export function computeNextCareFromLogs(plant: Plant, logs: CareLog[]) {
  // Prefer type-specific last logs; pick the soonest upcoming date
  const lastWater = lastOfType(logs, 'water') ?? plant.lastCareAt ?? plant.createdAt
  const lastFert  = lastOfType(logs, 'fertilizer')

  const candidates: { type: 'water' | 'fertilizer'; dueAt: number; label: string }[] = []

  if (lastWater) {
    const dueAt = lastWater + DEFAULTS.water * 24 * 60 * 60 * 1000
    candidates.push({ type: 'water', dueAt, label: 'Water' })
  }
  if (lastFert) {
    const dueAt = lastFert + DEFAULTS.fertilizer * 24 * 60 * 60 * 1000
    candidates.push({ type: 'fertilizer', dueAt, label: 'Fertilize' })
  }

  if (candidates.length === 0) {
    // No history at all — offer a gentle start
    const dueAt = Date.now() + 3 * 24 * 60 * 60 * 1000
    return { type: 'water' as const, dueAt, label: 'Start with a light watering' }
  }

  candidates.sort((a, b) => a.dueAt - b.dueAt)
  return candidates[0]
}

export function formatNextCare(next: { label: string; dueAt: number }) {
  const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
  const when = fmt.format(new Date(next.dueAt))
  return `${next.label} • ${when}`
}
