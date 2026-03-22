// client/src/pages/PlantDetails.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Lightbox from '../components/ui/Lightbox'
import { PlantDetailSkeleton } from '../components/ui/Skeleton'
import {
  db,
  deletePlant,
  Plant,
  listCareLogs,
  CareLog,
  addCareLog,
  updateCareLog,
  deleteCareLog,
  HAS_STORAGE,
  uploadFileAndGetURL,
} from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../lib/auth'
import { computeNextCareFromLogs, formatNextCare } from '../lib/schedule'
import { findLocalGuide } from '../data/plants'
import { toast } from '../lib/toast'

const fmt = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

type EditingLog = { id: string; type: CareLog['type']; notes: string }

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

  // log actions
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [editingLog, setEditingLog] = useState<EditingLog | null>(null)

  // lightbox
  const [lbOpen, setLbOpen] = useState(false)
  const [lbSrc, setLbSrc] = useState<string | undefined>()

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
    if (!id || !user) return
    if (!d) return toast.error('Care log date is required.')

    setSaving(true)
    try {
      let url: string | undefined
      if (f) {
        try {
          const path = `plants/${user.uid}/${id}/care/${Date.now()}_${f.name}`
          url = await uploadFileAndGetURL(f, path)
        } catch {
          toast.info('Photo upload skipped (Storage not configured).')
        }
      }
      const createdAt = new Date(`${d}T00:00:00`).getTime()
      await addCareLog(id, { type: t, notes: n.trim() || undefined, photoUrl: url, createdAt })
      const latest = await listCareLogs(id, 20)
      setLogs(latest)
      setT('note')
      setD('')
      setN('')
      setF(null)
      const s = await getDoc(doc(db, 'plants', id))
      setPlant({ id: s.id, ...(s.data() as any) })
      toast.success('Care log added.')
    } catch (err: any) {
      toast.error(err?.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  async function saveEditLog() {
    if (!id || !editingLog) return
    try {
      await updateCareLog(id, editingLog.id, { type: editingLog.type, notes: editingLog.notes || undefined })
      setLogs((prev) =>
        prev.map((l) =>
          l.id === editingLog.id ? { ...l, type: editingLog.type, notes: editingLog.notes || undefined } : l
        )
      )
      setEditingLog(null)
      toast.success('Log updated.')
    } catch {
      toast.error('Could not update log.')
    }
  }

  async function removeLog(logId: string) {
    if (!id) return
    if (!confirm('Delete this care log?')) return
    try {
      await deleteCareLog(id, logId)
      setLogs((prev) => prev.filter((l) => l.id !== logId))
      toast.success('Log deleted.')
    } catch {
      toast.error('Could not delete log.')
    }
  }

  function openLightbox(src?: string) {
    if (!src) return
    setLbSrc(src)
    setLbOpen(true)
  }

  if (loading)
    return (
      <Card className="max-w-2xl mx-auto p-5 bg-[var(--glass-surface)] border border-[var(--glass-border)]">
        <PlantDetailSkeleton />
      </Card>
    )
  if (!plant) return <div className="opacity-70 text-sm text-center mt-10">Plant not found.</div>

  const next = computeNextCareFromLogs(plant, logs)

  function normalize(input?: string) {
    return (input || '').toLowerCase().replace(/[''""']/g, '').replace(/\s+/g, ' ').trim()
  }
  const searchKeys = [
    (plant as any).guideRefId,
    (plant as any).guideRefName,
    (plant as any).guideRefSpecies,
    plant.name,
    plant.species,
  ].filter(Boolean)
  let canonicalGuide
  for (const key of searchKeys) {
    const nk = normalize(String(key))
    canonicalGuide =
      findLocalGuide(nk) ||
      findLocalGuide(nk.replace(/['"].*$/, '').trim()) ||
      findLocalGuide(nk.split('(')[0].trim()) ||
      findLocalGuide(nk.split(' ')[0])
    if (canonicalGuide) break
  }

  return (
    <Card
      hover={false}
      className="max-w-2xl mx-auto soft-fade p-5 bg-[var(--glass-surface)] border border-[var(--glass-border)] shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
    >
      {/* Back nav */}
      <button
        onClick={() => nav(-1)}
        className="text-xs opacity-60 hover:opacity-100 mb-3 flex items-center gap-1 transition-opacity"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold gradient-text">{plant.name}</h1>
          {plant.species && <div className="opacity-70 text-sm">{plant.species}</div>}
          {plant.nickname && <div className="opacity-80 text-sm">"{plant.nickname}"</div>}
          {(plant as any).location && (
            <div className="opacity-80 text-sm">📍 {(plant as any).location}</div>
          )}
          {plant.lastCareAt && (
            <div className="text-xs opacity-70 mt-1">
              Last cared: {fmt.format(new Date(plant.lastCareAt))}
            </div>
          )}
        </div>
        <div className="shrink-0 text-xs px-2 py-1 rounded-lg bg-[var(--tint-teal)]/25 text-[var(--accent2)] border border-[var(--accent2)]/30 font-medium">
          {formatNextCare(next)}
        </div>
      </div>

      {/* Main photo — clickable to open lightbox */}
      {plant.photoUrl && (
        <button
          onClick={() => openLightbox(plant.photoUrl)}
          className="w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent2)] rounded-2xl"
        >
          <img
            src={plant.photoUrl}
            alt={`${plant.name} photo`}
            className="w-full h-60 object-cover rounded-2xl transition-transform duration-500 hover:scale-[1.02] cursor-zoom-in"
          />
        </button>
      )}

      {/* Care Guide */}
      {canonicalGuide ? (
        <div className="mt-5 rounded-2xl glass p-4 border border-emerald-400/20">
          <h2 className="font-semibold text-lg mb-2 text-[var(--accent3)]">Care Guide</h2>
          <div className="space-y-1 text-sm">
            {['light', 'water', 'fertilizer'].map((field) => {
              const raw = canonicalGuide.guide?.[field as keyof typeof canonicalGuide.guide] ?? ''
              const clean = String(raw).replace(/\s*\([^)]*\)/g, '').trim()
              const label = field.charAt(0).toUpperCase() + field.slice(1)
              return (
                <p key={field}>
                  <span className="opacity-70">{label}:</span>{' '}
                  <span className="font-medium">{clean || '—'}</span>
                </p>
              )
            })}
          </div>
          {(canonicalGuide.sources ?? []).length > 0 && (
            <div className="mt-2 text-xs opacity-70">
              Sources:{' '}
              {(canonicalGuide.sources ?? []).map((s, i, arr) => (
                <span key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[var(--accent2)]/40 hover:decoration-[var(--accent2)] hover:text-[var(--accent2)]"
                  >
                    {s.title}
                  </a>
                  {i < arr.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 text-sm opacity-70 italic">No matching care guide found.</div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <Link to={`/plant/${plant.id}/edit`}>
          <Button variant="neutral" className="text-sm px-4 py-1.5">Edit</Button>
        </Link>
        <Button
          onClick={remove}
          className="text-sm px-4 py-1.5 bg-red-600/10 border border-red-500/30 text-red-600 hover:bg-red-600/20"
        >
          Delete
        </Button>
      </div>

      <hr className="my-6 border-[var(--glass-border)]" />

      {/* Care Logs */}
      <div className="space-y-3">
        <div className="font-semibold text-lg">Care Logs</div>
        {logs.length === 0 && <div className="opacity-70 text-sm">No logs yet.</div>}
        {logs.map((l) => (
          <div key={l.id}>
            {/* Log row */}
            <div className="text-sm flex items-center justify-between gap-3 bg-[var(--surface-alt)]/50 rounded-xl p-2">
              <div className="flex items-center gap-3">
                {l.photoUrl && (
                  <button
                    onClick={() => openLightbox(l.photoUrl)}
                    className="relative rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/10 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent2)]"
                    title="View photo"
                  >
                    <img
                      src={l.photoUrl}
                      alt=""
                      className="w-20 h-20 object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />
                  </button>
                )}
                <div>
                  <div className="font-medium capitalize">{l.type}</div>
                  {l.notes && <div className="opacity-80">{l.notes}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="opacity-70 text-xs">{fmt.format(new Date(l.createdAt))}</div>
                {/* Three-dot menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === l.id ? null : l.id!)}
                    className="text-xs px-1.5 py-0.5 rounded hover:bg-[var(--surface-alt)] transition opacity-60 hover:opacity-100"
                    title="Options"
                  >
                    •••
                  </button>
                  {menuOpenId === l.id && (
                    <div className="absolute right-0 top-6 z-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl shadow-lg py-1 min-w-[100px] backdrop-blur-md">
                      <button
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--surface-alt)] transition"
                        onClick={() => {
                          setEditingLog({ id: l.id!, type: l.type, notes: l.notes || '' })
                          setMenuOpenId(null)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 transition"
                        onClick={() => { setMenuOpenId(null); removeLog(l.id!) }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inline edit form */}
            {editingLog?.id === l.id && (
              <div className="mt-1 ml-2 p-3 bg-[var(--surface-alt)]/60 rounded-xl space-y-2 text-sm border border-[var(--glass-border)]">
                <select
                  className="glass w-full px-3 py-1.5 rounded-lg text-sm"
                  value={editingLog?.type ?? 'note'}
                  onChange={(e) => setEditingLog((prev) => prev ? { ...prev, type: e.target.value as CareLog['type'] } : prev)}
                >
                  <option value="note">Note</option>
                  <option value="water">Water</option>
                  <option value="sun">Sunlight</option>
                  <option value="fertilizer">Fertilizer</option>
                </select>
                <input
                  className="glass w-full px-3 py-1.5 rounded-lg text-sm"
                  placeholder="Notes"
                  value={editingLog?.notes ?? ''}
                  onChange={(e) => setEditingLog((prev) => prev ? { ...prev, notes: e.target.value } : prev)}
                />
                <div className="flex gap-2">
                  <Button className="text-xs py-1 px-3" onClick={saveEditLog}>Save</Button>
                  <Button variant="neutral" className="text-xs py-1 px-3" onClick={() => setEditingLog(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="my-6 border-[var(--glass-border)]" />

      {/* Add Care Log */}
      <div className="space-y-2">
        <div className="font-semibold text-lg">Add Care Log</div>
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setF(e.target.files?.[0] ?? null)}
              className="text-sm mt-1"
            />
            {!HAS_STORAGE && (
              <div className="text-xs opacity-70 mt-1">
                Storage not configured — photo will be skipped.
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button className="text-[var(--ink)] w-full" disabled={saving} type="submit">
              {saving ? 'Saving…' : 'Add log'}
            </Button>
          </div>
        </form>
      </div>

      <Lightbox open={lbOpen} src={lbSrc} onClose={() => { setLbOpen(false); setLbSrc(undefined) }} />
    </Card>
  )
}
