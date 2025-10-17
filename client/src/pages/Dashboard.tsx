// client/src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import { listPlants, Plant } from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'
import { computeNextCareFromLogs, formatNextCare } from '../lib/schedule'
// @ts-ignore
import pkg from '../../package.json'

const fmt = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function Dashboard() {
  const { user } = useAuth()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold gradient-text tracking-tight">
            Your Plants
          </h1>
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

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center text-sm opacity-70">
          Loading your plants…
        </div>
      )}

      {/* Plant grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plants.map((p) => {
            const next = computeNextCareFromLogs(p, p.careLogs || [])
            const nextText = formatNextCare({
              ...next,
              label: next.phrasedLabel ?? next.label,
            })

            // Dynamic badge color based on care status
            const badgeClass =
              next?.phrasedLabel?.includes('overdue')
                ? 'bg-[var(--tint-red)]/20 text-[var(--tint-red)] border-[var(--tint-red)]/40'
                : next?.phrasedLabel?.includes('today')
                ? 'bg-[var(--tint-yellow)]/20 text-[var(--tint-yellow)] border-[var(--tint-yellow)]/40'
                : 'bg-[var(--tint-teal)]/25 text-[var(--accent2)] border-[var(--accent2)]/30'

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
                        (e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="font-medium text-[var(--ink)] leading-snug">
                    {p.name}
                  </div>
                  {p.nickname && (
                    <div className="text-sm opacity-70 italic">“{p.nickname}”</div>
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

                <Link
                  to={`/plant/${p.id}`}
                  className="mt-3 inline-block text-sm text-[var(--accent2)] underline hover:text-[var(--accent3)] transition-colors"
                >
                  Open
                </Link>
              </Card>
            )
          })}

          {/* Empty state */}
          {!plants.length && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center text-center opacity-80 mt-10 animate-fadeIn">
              <img
                src="/mascot_smile.svg"
                alt="Smiling monstera mascot"
                className="w-24 h-24 mb-3 opacity-90"
                loading="lazy"
              />
              <p className="text-sm font-medium">No plants yet</p>
              <p className="text-xs opacity-70">
                Add your first plant to begin your journey 🌱
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
