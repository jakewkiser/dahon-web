// Local dataset for the most popular US houseplants.
// Add more entries easily — designed to scale to 100.
// Each item includes a minimal care guide & optional cadences.

export type LocalPlantGuide = {
  name: string
  species?: string
  guide: {
    water: string          // short line, e.g., "Every 1–2 weeks; let soil dry"
    light: string          // e.g., "Bright, indirect light"
    fertilizer?: string    // e.g., "Monthly during growing season"
    notes?: string
    cadenceDays?: {        // optional, feeds Next Care engine later
      water?: number
      fertilizer?: number
    }
  }
  sources?: Array<{ title: string; url: string }>
}

export const PLANTS_US_TOP: LocalPlantGuide[] = [
  {
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata (Dracaena trifasciata)',
    guide: {
      water: 'Every 2–3 weeks; allow soil to dry completely',
      light: 'Low to bright, indirect; very tolerant',
      fertilizer: 'Light monthly feed in spring/summer',
      notes: 'Avoid overwatering; rot-prone.',
      cadenceDays: { water: 17, fertilizer: 30 }
    },
    sources: [
      { title: 'Univ. of Florida IFAS', url: 'https://edis.ifas.ufl.edu/publication/EP465' }
    ]
  },
  {
    name: 'Pothos',
    species: 'Epipremnum aureum',
    guide: {
      water: 'Every 1–2 weeks; dry out between waterings',
      light: 'Low to medium, indirect',
      fertilizer: 'Monthly during growing season',
      notes: 'Very forgiving; great starter plant.',
      cadenceDays: { water: 10, fertilizer: 30 }
    },
    sources: [
      { title: 'Univ. of Vermont Ext.', url: 'https://pss.uvm.edu/ppp/articles/pothos.html' }
    ]
  },
  {
    name: 'Monstera',
    species: 'Monstera deliciosa',
    guide: {
      water: 'Every 1–2 weeks; keep lightly moist',
      light: 'Bright, indirect',
      fertilizer: 'Monthly spring–summer',
      notes: 'Provide support; prune to shape.',
      cadenceDays: { water: 9, fertilizer: 30 }
    },
    sources: [
      { title: 'Univ. of Wisconsin Ext.', url: 'https://hort.extension.wisc.edu/articles/monstera/' }
    ]
  },
  {
    name: 'ZZ Plant',
    species: 'Zamioculcas zamiifolia',
    guide: {
      water: 'Every 2–3 weeks; drought tolerant',
      light: 'Low to medium, indirect',
      fertilizer: 'Occasional, light feeding',
      cadenceDays: { water: 18, fertilizer: 45 }
    }
  },
  {
    name: 'Peace Lily',
    species: 'Spathiphyllum spp.',
    guide: {
      water: 'Keep evenly moist; do not let fully dry',
      light: 'Medium, indirect; avoid harsh sun',
      fertilizer: 'Every 6–8 weeks during growth',
      cadenceDays: { water: 7, fertilizer: 45 }
    }
  },
  {
    name: 'Spider Plant',
    species: 'Chlorophytum comosum',
    guide: {
      water: 'Every 1–2 weeks; slightly dry between',
      light: 'Bright, indirect; avoids harsh sun',
      fertilizer: 'Monthly spring–summer',
      cadenceDays: { water: 9, fertilizer: 30 }
    }
  },
  {
    name: 'Rubber Plant',
    species: 'Ficus elastica',
    guide: {
      water: 'Every 1–2 weeks; less in winter',
      light: 'Bright, indirect',
      fertilizer: 'Monthly spring–summer',
      cadenceDays: { water: 10, fertilizer: 30 }
    }
  },
  {
    name: 'Philodendron (Heartleaf)',
    species: 'Philodendron hederaceum',
    guide: {
      water: 'Every 1–2 weeks; keep lightly moist',
      light: 'Medium, indirect',
      fertilizer: 'Monthly spring–summer',
      cadenceDays: { water: 9, fertilizer: 30 }
    }
  },
  {
    name: 'Aloe Vera',
    species: 'Aloe barbadensis',
    guide: {
      water: 'Every 2–3 weeks; dry out completely',
      light: 'Bright, direct to indirect',
      fertilizer: 'Sparingly; spring–summer',
      cadenceDays: { water: 20, fertilizer: 60 }
    }
  },
  {
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    guide: {
      water: 'Weekly; keep evenly moist, not soggy',
      light: 'Bright, indirect (lots of it)',
      fertilizer: 'Monthly spring–summer',
      notes: 'Dislikes drafts; rotate for even growth.',
      cadenceDays: { water: 7, fertilizer: 30 }
    }
  },
  // — Add more items here to reach 100. Structure is simple; copy & adapt.
]
