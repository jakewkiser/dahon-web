import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Lightbox from '../components/ui/Lightbox'
import {
  db,
  deletePlant,
  Plant,
  listCareLogs,
  CareLog,
  addCareLog,
  HAS_STORAGE,
  uploadFileAndGetURL
} from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../lib/auth'
import { computeNextCareFromLogs, formatNextCare } from '../lib/schedule'
import { findLocalGuide } from '../data/plants'

const fmt = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

export default function PlantDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [logs, setLogs] = useState<CareLog[]>([])
  const [loading, setLoading] = useState(true)

  // add-care form
  const [t, setT] = useState<CareLog['type']>('note')
  const [d, setD] = useState('')
  const [n, setN] = useState('')
  const [f, setF] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // lightbox
  const [lbOpen, setLbOpen] = useState(false)
  const [lbSrc, setLbSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      if (!id) return
      const s = await getDoc(doc(db, 'plants', id))
      if (s.exists()) {
        setPlant({ id: s.id, ...(s.data() as any) })
        const latest = await listCareLogs(id, 20)
        setLogs(latest)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function remove() {
    if (!id) return
    if (!confirm('Delete this plant? This cannot be undone.')) return
    await deletePlant(id)
    nav('/dashboard')
  }

  async function addLog(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!id || !user) return
    if (!d) return setError('Care log date is required.')

    setSaving(true)
    try {
      let url: string | undefined
      if (f) {
        try {
          const path = `plants/${user.uid}/${id}/care/${Date.now()}_${f.name}`
          url = await uploadFileAndGetURL(f, path)
        } catch (err: any) {
          console.warn('Care photo upload skipped:', err)
          setNotice('Care photo upload skipped (Storage not configured).')
        }
      }
      const createdAt = new Date(`${d}T00:00:00`).getTime()
      await addCareLog(id, {
        type: t,
        notes: n.trim() || undefined,
        photoUrl: url,
        createdAt
      })
      const latest = await listCareLogs(id, 20)
      setLogs(latest)
      setT('note')
      setD('')
      setN('')
      setF(null)
      const s = await getDoc(doc(db, 'plants', id))
      setPlant({ id: s.id, ...(s.data() as any) })
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  function openLightbox(src?: string) {
    if (!src) return
    setLbSrc(src)
    setLbOpen(true)
  }

  if (loading || !plant) return <div>Loading...</div>

  const next = computeNextCareFromLogs(plant, logs)

  // 🌿 --- Care Guide Lookup ----------------------------------------------------
  function normalize(input?: string) {
    return (input || '')
      .toLowerCase()
      .replace(/[‘’“”']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const searchKeys = [
    (plant as any).guideRefId,
    (plant as any).guideRefName,
    (plant as any).guideRefSpecies,
    plant.name,
    plant.species
  ].filter(Boolean)

  let canonicalGuide
  for (const key of searchKeys) {
    const n = normalize(String(key))
    canonicalGuide =
      findLocalGuide(n) ||
      findLocalGuide(n.replace(/['"].*$/, '').trim()) ||
      findLocalGuide(n.split('(')[0].trim()) ||
      // genus fallback: take first word (e.g. "Alocasia micholitziana" -> "Alocasia")
      findLocalGuide(n.split(' ')[0])
    if (canonicalGuide) break
  }

// optional debug log (comment out in production)
console.log('Guide lookup', {
  plantName: plant.name,
  plantSpecies: plant.species,
  matched:
    (canonicalGuide as any)?.guide?.name ||
    (canonicalGuide as any)?.plant?.name ||
    'Unknown',
  found: !!canonicalGuide
})

  return (
    <Card className="max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{plant.name}</h1>
          <div className="opacity-70">{plant.species}</div>
          {plant.nickname && <div className="opacity-80">Nickname: {plant.nickname}</div>}
          {(plant as any).location && (
            <div className="opacity-80">Location: {(plant as any).location}</div>
          )}
          {plant.lastCareAt && (
            <div className="text-sm opacity-70 mt-1">
              Last cared: {fmt.format(new Date(plant.lastCareAt))}
            </div>
          )}
        </div>

        <div className="shrink-0 text-xs px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
          {formatNextCare(next)}
        </div>
      </div>

      {plant.photoUrl && (
        <img src={plant.photoUrl} alt="" className="mt-3 w-56 h-56 object-cover rounded-2xl" />
      )}

      {/* 🌱 Care Guide */}
      {canonicalGuide ? (
        <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/20">
          <h2 className="font-semibold text-lg mb-2">Care Guide</h2>
          <div className="space-y-1 text-sm">
          {['light', 'water', 'fertilizer'].map((field) => {
            const raw = canonicalGuide.guide?.[field as keyof typeof canonicalGuide.guide] ?? ''
            const clean = String(raw).replace(/\s*\([^)]*\)/g, '').trim() // remove (...) parts
           const label = field.charAt(0).toUpperCase() + field.slice(1)
           return (
            <p key={field}>
             <strong>
              {field === 'light' && '☀️ '}
              {field === 'water' && '💧 '}
              {field === 'fertilizer' && '🌿 '}
              {field === 'notes' && '🪴 '}
              {label}:
             </strong>{' '}
             {clean || '—'}
           </p>
          )
        })}
      </div>
          {canonicalGuide.sources?.length > 0 && (
            <div className="mt-2 text-xs opacity-70">
              Sources:{' '}
              {canonicalGuide.sources.map((s, i) => (
                <span key={i}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {s.title}
                  </a>
                  {i < canonicalGuide.sources.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 text-sm opacity-70 italic">No matching care guide found.</div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-4 items-center">
        <Link className="underline" to={`/plant/${plant.id}/edit`}>
          Edit
        </Link>
        <button
          onClick={remove}
          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
        >
          Delete
        </button>
      </div>

      <hr className="my-6 border-white/10" />

      {/* Care Logs */}
      <div className="space-y-3">
        <div className="font-semibold">Care Logs</div>
        {logs.length === 0 && <div className="opacity-70 text-sm">No logs yet.</div>}
        {logs.map((l) => (
          <div key={l.id} className="text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {l.photoUrl && (
                <button
                  onClick={() => openLightbox(l.photoUrl)}
                  className="relative rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/10 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  title="View photo"
                >
                  <img src={l.photoUrl} alt="" className="w-20 h-20 object-cover" />
                </button>
              )}
              <div>
                <div className="font-medium capitalize">{l.type}</div>
                {l.notes && <div className="opacity-80">{l.notes}</div>}
              </div>
            </div>
            <div className="opacity-70">{fmt.format(new Date(l.createdAt))}</div>
          </div>
        ))}
      </div>

      <hr className="my-6 border-white/10" />

      {/* Add Care Log */}
      <div className="space-y-2">
        <div className="font-semibold">Add Care Log</div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl p-2">{error}</div>
        )}
        {notice && (
          <div className="text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/40 rounded-xl p-2">{notice}</div>
        )}
        <form onSubmit={addLog} className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm opacity-70">Type</label>
            <select
              className="glass w-full px-3 py-2 rounded-xl"
              value={t}
              onChange={(e) => setT(e.target.value as any)}
            >
              <option value="note">Note</option>
              <option value="water">Water</option>
              <option value="sun">Sunlight</option>
              <option value="fertilizer">Fertilizer</option>
            </select>
          </div>
          <div>
            <label className="text-sm opacity-70">Date *</label>
            <input
              className="glass w-full px-3 py-2 rounded-xl"
              type="date"
              value={d}
              onChange={(e) => setD(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm opacity-70">Notes</label>
            <input
              className="glass w-full px-3 py-2 rounded-xl"
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="e.g., Watered 250ml"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm opacity-70">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setF(e.target.files?.[0] ?? null)} />
            {!HAS_STORAGE && (
              <div className="text-xs opacity-70 mt-1">
                Storage not configured—photo will be skipped.
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button className="text-ink" disabled={saving} type="submit">
              {saving ? 'Saving…' : 'Add log'}
            </Button>
          </div>
        </form>
      </div>

      <Lightbox open={lbOpen} src={lbSrc} onClose={() => setLbOpen(false)} />
    </Card>
  )
}
