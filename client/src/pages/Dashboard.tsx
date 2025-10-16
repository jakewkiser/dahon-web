// client/src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import { listPlants, Plant } from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { Link, useNavigate } from 'react-router-dom'
import KawaiiMascot from '../components/ui/KawaiiMascot'
import { formatNextCare } from '../lib/schedule'
// @ts-ignore
import pkg from '../../package.json'

const fmt = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

export default function Dashboard() {
  const { user } = useAuth()
  const [plants, setPlants] = useState<Plant[]>([])
  const nav = useNavigate()

  useEffect(() => {
    if (user) listPlants(user.uid).then(setPlants)
  }, [user])

  // Dedicated placeholder for plant cards
  const placeholderUrl = '/mascot_camera.svg'

  const feedbackUrl = import.meta.env.VITE_FEEDBACK_URL as string | undefined
  const version = (import.meta.env.VITE_APP_VERSION as string | undefined) || (pkg?.version as string) || '0.1.0'
  const releaseDate = (import.meta.env.VITE_RELEASE_DATE as string | undefined) || new Date().toISOString().slice(0, 10)

  const Beta = useMemo(() => (
    <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
      Beta v{version} • {releaseDate}
    </span>
  ), [version, releaseDate])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Your Plants</h1>
          {Beta}
        </div>
        <div className="flex items-center gap-2">
          {feedbackUrl && (
            <a
              className="text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
              href={feedbackUrl}
              target="_blank"
              rel="noreferrer"
            >
              Give Feedback
            </a>
          )}
          {/* Add Plant CTA was removed per your request */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plants.map((p) => {
          const last = p.lastCareAt || p.createdAt || Date.now()
          const next = { label: 'Water', dueAt: last + 7 * 24 * 60 * 60 * 1000 }

          return (
            <Card key={p.id} className="overflow-hidden">
              {/* Photo (or placeholder) */}
              <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-surfaceAlt flex items-center justify-center">
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={`${p.name} photo`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={placeholderUrl}
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none' }}
                  />
                )}
              </div>

              <div className="font-semibold">{p.name}</div>
              {p.nickname && <div className="text-sm opacity-80">“{p.nickname}”</div>}
              <div className="text-xs opacity-70 mt-1">
                Last cared: {p.lastCareAt ? fmt.format(new Date(p.lastCareAt)) : '—'}
              </div>
              <div className="text-xs mt-1 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 inline-block">
                {formatNextCare(next)}
              </div>

              <Link className="text-sm underline mt-2 inline-block" to={`/plant/${p.id}`}>Open</Link>
            </Card>
          )
        })}

        {plants.length === 0 && <div className="opacity-70">Add your first plant 🌱</div>}
      </div>
    </div>
  )
}
