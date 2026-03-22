// client/src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import { PlantCardSkeleton } from '../components/ui/Skeleton'
import { listPlants, addCareLog, Plant } from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'
import { computeNextCareFromLogs, computeHealthScore } from '../lib/schedule'
import { toast } from '../lib/toast'
// @ts-ignore
import pkg from '../../package.json'

const fmt = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

type PlantWithNext = Plant & { _nextDueAt: number; _phrased: string }

function urgencyScore(dueAt: number): number {
  return Math.round((dueAt - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function Dashboard() {
  const { user } = useAuth()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [logging, setLogging] = useState<Record<string, boolean>>({})
  const placeholderUrl = '/mascot_camera.svg'

  useEffect(() => {
    if (user) {
      listPlants(user.uid)
        .then(setPlants)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  const feedbackUrl = import.meta.env.VITE_FEEDBACK_URL as string | undefined
  const version =
    (import.meta.env.VITE_APP_VERSION as string | undefined) ||
    (pkg?.version as string) ||
    '0.1.0'
  const releaseDate =
    (import.meta.env.VITE_RELEASE_DATE as string | undefined) ||
    new Date().toISOString().slice(0, 10)

  // Enrich plants with next-care data, then sort by urgency
  const sortedPlants = useMemo<PlantWithNext[]>(() => {
    return plants
      .map((p) => {
        const next = computeNextCareFromLogs(p, (p as any).careLogs || [])
        return {
          ...p,
          _nextDueAt: next.dueAt,
          _phrased: (next as any).phrasedLabel || next.label || '',
        } as PlantWithNext
      })
      .sort((a, b) => urgencyScore(a._nextDueAt) - urgencyScore(b._nextDueAt))
  }, [plants])

  // Apply name filter
  const visiblePlants = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return sortedPlants
    return sortedPlants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nickname ?? '').toLowerCase().includes(q)
    )
  }, [sortedPlants, filter])

  // Stats
  const stats = useMemo(() => {
    const overdue = sortedPlants.filter((p) => p._phrased.toLowerCase().includes('overdue')).length
    const today = sortedPlants.filter((p) => p._phrased.toLowerCase().includes('today')).length
    return { overdue, today }
  }, [sortedPlants])

  async function quickWater(plant: Plant) {
    if (!plant.id) return
    setLogging((l) => ({ ...l, [plant.id!]: true }))
    try {
      await addCareLog(plant.id, { type: 'water', createdAt: Date.now() })
      setPlants((prev) =>
        prev.map((p) => (p.id === plant.id ? { ...p, lastCareAt: Date.now() } : p))
      )
      toast.success(`Watered ${plant.name} 💧`)
    } catch {
      toast.error('Could not log care. Try again.')
    } finally {
      setLogging((l) => ({ ...l, [plant.id!]: false }))
    }
  }

  const Beta = useMemo(
    () => (
      <span className="text-xs px-2 py-1 rounded-md bg-[var(--tint-teal)]/25 text-[var(--accent2)] border border-[var(--accent2)]/30 font-medium tracking-tight">
        Beta v{version} • {releaseDate}
      </span>
    ),
    [version, releaseDate]
  )

  return (
    <div className="soft-fade">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold gradient-text tracking-tight">Your Plants</h1>
          {Beta}
        </div>
        {feedbackUrl && (
          <a
            className="text-sm px-3 py-1.5 rounded-xl border border-[var(--glass-border)] hover:bg-[var(--surface-alt)] transition-all"
            href={feedbackUrl}
            target="_blank"
            rel="noreferrer"
          >
            Give Feedback
          </a>
        )}
      </div>

      {/* Stats bar + filter — only when plants exist */}
      {!loading && plants.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          {/* Summary chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {stats.overdue > 0 && (
              <span className="px-2 py-1 rounded-lg bg-[var(--tint-red)]/15 text-[var(--tint-red)] border border-[var(--tint-red)]/30 font-medium">
                {stats.overdue} overdue
              </span>
            )}
            {stats.today > 0 && (
              <span className="px-2 py-1 rounded-lg bg-[var(--tint-yellow)]/15 text-[var(--tint-yellow)] border border-[var(--tint-yellow)]/30 font-medium">
                {stats.today} due today
              </span>
            )}
            {stats.overdue === 0 && stats.today === 0 && (
              <span className="px-2 py-1 rounded-lg bg-[var(--tint-teal)]/15 text-[var(--accent2)] border border-[var(--accent2)]/30 font-medium">
                All plants on track ✓
              </span>
            )}
          </div>

          {/* Name filter */}
          <input
            className="glass sm:ml-auto text-sm px-3 py-1.5 rounded-xl w-full sm:w-48"
            placeholder="Filter plants…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      )}

      {/* Loading skeleton grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <PlantCardSkeleton key={i} />)}
        </div>
      )}

      {/* Plant grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiblePlants.map((p) => {
            const health = computeHealthScore(p, (p as any).careLogs || [])
            const healthDot =
              health === 'good'
                ? 'bg-emerald-400'
                : health === 'fair'
                ? 'bg-yellow-400'
                : 'bg-red-400'

            const badgeClass = p._phrased.toLowerCase().includes('overdue')
              ? 'bg-[var(--tint-red)]/20 text-[var(--tint-red)] border-[var(--tint-red)]/40'
              : p._phrased.toLowerCase().includes('today')
              ? 'bg-[var(--tint-yellow)]/20 text-[var(--tint-yellow)] border-[var(--tint-yellow)]/40'
              : 'bg-[var(--tint-teal)]/25 text-[var(--accent2)] border-[var(--accent2)]/30'

            const nextText = p._phrased || '—'
            const isLogging = !!logging[p.id!]

            return (
              <Card
                key={p.id}
                className="overflow-hidden hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition-all duration-300 soft-fade"
              >
                {/* Image */}
                <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-[var(--surface-alt)] flex items-center justify-center">
                  {p.photoUrl ? (
                    <img
                      src={p.photoUrl}
                      alt={`${p.name} photo`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={placeholderUrl}
                      alt="Placeholder"
                      className="w-20 h-20 opacity-60"
                      loading="lazy"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${healthDot}`}
                      title={`Health: ${health}`}
                    />
                    <div className="font-medium text-[var(--ink)] leading-snug">{p.name}</div>
                  </div>
                  {p.nickname && (
                    <div className="text-sm opacity-70 italic">"{p.nickname}"</div>
                  )}
                  <div className="text-xs opacity-70">
                    Last cared: {p.lastCareAt ? fmt.format(new Date(p.lastCareAt)) : '—'}
                  </div>

                  {/* Dynamic next care badge */}
                  <div
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-lg border font-medium transition-all duration-300 ${badgeClass}`}
                  >
                    {nextText}
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between mt-3">
                  <Link
                    to={`/plant/${p.id}`}
                    className="text-sm text-[var(--accent2)] underline hover:text-[var(--accent3)] transition-colors"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => quickWater(p)}
                    disabled={isLogging}
                    className="text-xs px-2.5 py-1 rounded-lg border border-sky-400/30 bg-sky-400/10 hover:bg-sky-400/20 transition-all disabled:opacity-50"
                    title="Log watering now"
                  >
                    {isLogging ? '…' : '💧 Water'}
                  </button>
                </div>
              </Card>
            )
          })}

          {/* No filter results */}
          {visiblePlants.length === 0 && plants.length > 0 && (
            <div className="col-span-full text-center opacity-60 text-sm py-6">
              No plants match "{filter}"
            </div>
          )}

          {/* Empty state */}
          {plants.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-center opacity-80 mt-10 animate-fadeIn">
              <img
                src="/mascot_smile.svg"
                alt="Smiling monstera mascot"
                className="w-24 h-24 mb-3 opacity-90"
                loading="lazy"
              />
              <p className="text-sm font-medium">No plants yet</p>
              <p className="text-xs opacity-70">Add your first plant to begin your journey 🌱</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
