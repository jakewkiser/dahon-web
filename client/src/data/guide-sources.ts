// client/src/data/guide-sources.ts
// Canonical registry of credible plant information providers

export type GuideSource = {
  id: string
  title: string
  url: string
  provider?: string
}

export const SOURCES: GuideSource[] = [
  {
    id: 'mobot',
    title: 'Missouri Botanical Garden – Plant Finder',
    url: 'https://www.missouribotanicalgarden.org/plantfinder/plantfindersearch.aspx',
    provider: 'Missouri Botanical Garden'
  },
  {
    id: 'uf-ifas',
    title: 'UF/IFAS Gardening Solutions',
    url: 'https://gardeningsolutions.ifas.ufl.edu/plants/',
    provider: 'University of Florida IFAS'
  },
  {
    id: 'clemson-hgic',
    title: 'Clemson HGIC – Home & Garden Information Center',
    url: 'https://hgic.clemson.edu/',
    provider: 'Clemson University Cooperative Extension'
  },
  {
    id: 'penn-state',
    title: 'Penn State Extension – Houseplants',
    url: 'https://extension.psu.edu/programs/master-gardener',
    provider: 'Penn State Extension'
  },
  {
    id: 'rhs',
    title: 'RHS – Plants',
    url: 'https://www.rhs.org.uk/plants',
    provider: 'Royal Horticultural Society'
  },
  {
    id: 'wiki',
    title: 'Wikipedia – Plant Pages',
    url: 'https://en.wikipedia.org/',
    provider: 'Wikipedia'
  }
]

// Convenient lookup map
export const SOURCE_INDEX: Record<string, GuideSource> = Object.fromEntries(
  SOURCES.map(s => [s.id, s])
)
