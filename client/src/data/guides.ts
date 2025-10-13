// client/src/data/guides.ts
export type CareGuide = {
  name: string
  speciesMatches: string[] // simple substring matches (lowercased)
  summary: string
  bullets: string[]
  sourceName: string
  sourceUrl: string
}

const GUIDES: CareGuide[] = [
  {
    name: 'Monstera Deliciosa',
    speciesMatches: ['monstera deliciosa', 'monstera'],
    summary: 'Bright, indirect light, water when top 1–2" soil is dry; enjoys humidity.',
    bullets: [
      'Light: Bright indirect; avoid harsh midday sun.',
      'Water: When top 1–2" is dry; reduce in winter.',
      'Humidity: Medium–high preferred.',
      'Soil: Well-draining aroid mix; pot with drainage.',
    ],
    sourceName: 'Houseplant Primer',
    sourceUrl: 'https://example.org/monstera', // replace later with your real source
  },
  {
    name: 'Fiddle Leaf Fig (Ficus lyrata)',
    speciesMatches: ['ficus lyrata', 'fiddle leaf'],
    summary: 'Lots of bright light, consistent watering, hates cold drafts.',
    bullets: [
      'Light: Very bright; near a big window is best.',
      'Water: Evenly moist; do not let sit in water.',
      'Air: Avoid drafts & sudden temp swings.',
      'Rotate: Quarter-turn weekly for even growth.',
    ],
    sourceName: 'Houseplant Primer',
    sourceUrl: 'https://example.org/ficus-lyrata',
  },
  {
    name: 'Golden Pothos (Epipremnum aureum)',
    speciesMatches: ['epipremnum aureum', 'pothos'],
    summary: 'Tolerant and easy; medium light ideal; water after partial dry-back.',
    bullets: [
      'Light: Low–bright indirect; avoids direct sun.',
      'Water: When top 1–2" is dry.',
      'Notes: Very forgiving; great starter plant.',
    ],
    sourceName: 'Houseplant Primer',
    sourceUrl: 'https://example.org/pothos',
  },
  {
    name: 'Snake Plant (Sansevieria / Dracaena trifasciata)',
    speciesMatches: ['sansevieria', 'trifasciata', 'snake plant', 'dracaena trifasciata'],
    summary: 'Low-maintenance; tolerates low light; let soil dry between waterings.',
    bullets: [
      'Light: Low–bright indirect.',
      'Water: Infrequent; allow full dry-back.',
      'Soil: Gritty, fast-draining mix.',
    ],
    sourceName: 'Houseplant Primer',
    sourceUrl: 'https://example.org/snake-plant',
  },
  {
    name: 'Peace Lily (Spathiphyllum)',
    speciesMatches: ['spathiphyllum', 'peace lily'],
    summary: 'Medium light; likes evenly moist soil; droops when thirsty (then rebounds).',
    bullets: [
      'Light: Medium, no direct sun.',
      'Water: Keep lightly moist; don’t waterlog.',
      'Humidity: Enjoys higher humidity.',
    ],
    sourceName: 'Houseplant Primer',
    sourceUrl: 'https://example.org/peace-lily',
  },
]

// Generic fallback
const FALLBACK: CareGuide = {
  name: 'General Houseplant Care',
  speciesMatches: [],
  summary: 'Bright, indirect light; water when top soil dries; ensure drainage; gentle fertilizer in season.',
  bullets: [
    'Light: Bright indirect works for most common houseplants.',
    'Water: Let top 1–2" dry; reduce in winter.',
    'Pot/Soil: Drainage holes + well-draining mix.',
    'Fertilizer: Diluted, during active growth (spring/summer).',
  ],
  sourceName: 'Houseplant Primer',
  sourceUrl: 'https://example.org/general-care',
}

export function getCareGuide(species?: string): CareGuide {
  if (!species) return FALLBACK
  const s = species.toLowerCase()
  const found = GUIDES.find(g => g.speciesMatches.some(m => s.includes(m)))
  return found ?? FALLBACK
}
