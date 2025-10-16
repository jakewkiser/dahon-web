// client/src/data/guides.ts
// Centralized care guide resolver, powered by the plants_local dataset.

import { findLocalGuide } from './plants'

export type SourceLink = { title: string; url: string }
export type Guide = {
  water?: string
  light?: string
  fertilizer?: string
  notes?: string
  sources?: SourceLink[]
}

export const GENERIC_GUIDE: Guide = {
  water: 'Water when the top inch of soil feels dry. Ensure drainage.',
  light: 'Bright, indirect light is ideal; avoid harsh direct sun.',
  fertilizer: 'Diluted balanced fertilizer monthly in growing season.',
  notes: 'Adjust care based on season and your home’s humidity/light.'
}

/**
 * getCareGuide
 * Resolves a care guide for the given plant name or species.
 * Falls back to GENERIC_GUIDE when not found.
 */
export function getCareGuide(name?: string): Guide {
  if (!name) return GENERIC_GUIDE
  const found = findLocalGuide(name)
  return found?.guide ?? GENERIC_GUIDE
}

// Alias for consistency
export function resolveGuide(name?: string) {
  return getCareGuide(name)
}
