// client/src/pages/AddPlant.tsx
import { useEffect, useMemo, useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import {
  addPlant,
  addCareLog,
  uploadFileAndGetURL,
  updatePlant,
  HAS_STORAGE
} from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { findLocalGuide } from '../data/plants'

export default function AddPlant() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [params] = useSearchParams()

  // URL parameters
  const preId = useMemo(() => params.get('id'), [params])
  const preName = useMemo(() => params.get('name') ?? '', [params])
  const preSpecies = useMemo(() => params.get('species') ?? '', [params])

  // Form state
  const [name, setName] = useState(preName)
  const [nickname, setNickname] = useState('')
  const [species, setSpecies] = useState(preSpecies)
  const [location, setLocation] = useState('')
  const [plantPhoto, setPlantPhoto] = useState<File | null>(null)
  const [defaultImage, setDefaultImage] = useState<string | undefined>(undefined)

  const [logType, setLogType] = useState<'water' | 'sun' | 'fertilizer' | 'note'>('note')
  const [logNotes, setLogNotes] = useState('')
  const [logDate, setLogDate] = useState('')
  const [logPhoto, setLogPhoto] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Prefill data
  useEffect(() => {
    let canonical

    if (preId) canonical = findLocalGuide(preId)
    else if (preName) canonical = findLocalGuide(preName)
    else if (preSpecies) canonical = findLocalGuide(preSpecies)

    if (canonical?.plant) {
      setName((prev) => prev || canonical.plant.name)
      setSpecies((prev) => prev || canonical.plant.species || '')
      setDefaultImage(canonical.plant.image || undefined)
    }
  }, [preId, preName, preSpecies])

  function careFieldsUsed() {
    return logType !== 'note' || !!logNotes.trim() || !!logPhoto
  }

  // Submit
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!user) return setError('You are signed out. Please sign in and try again.')
    if (!name.trim()) return setError('Name is required.')
    if (careFieldsUsed() && !logDate) return setError('Care log date is required.')

    setSaving(true)
    const warnings: string[] = []

    try {
      const canonical =
        findLocalGuide(preId ?? name.trim()) ?? findLocalGuide(species.trim())

      const guideRefId = canonical?.plant?.id || undefined
      const guideRefName = canonical?.plant?.name || undefined
      const guideRefSpecies = canonical?.plant?.species || undefined
      const guideImage = canonical?.plant?.image || undefined

      // Create plant record
      const created = await addPlant({
        userId: user.uid,
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        species: species.trim() || undefined,
        location: location.trim() || undefined,
        guideRefId,
        guideRefName,
        guideRefSpecies
      })

      let photoUrl: string | undefined
      let photoSource: 'user' | 'default' | undefined

      if (plantPhoto) {
        try {
          const safe = `plants/${user.uid}/${created.id}/cover_${Date.now()}_${plantPhoto.name}`
          photoUrl = await uploadFileAndGetURL(plantPhoto, safe)
          photoSource = 'user'
        } catch (err: any) {
          console.warn('Plant photo upload skipped:', err)
          warnings.push('Plant photo upload skipped (Storage not configured).')
        }
      } else if (guideImage) {
        photoUrl = guideImage
        photoSource = 'default'
      }

      if (photoUrl) await updatePlant(created.id!, { photoUrl, photoSource })

      // Optional care log
      if (careFieldsUsed()) {
        const createdAt = new Date(`${logDate}T00:00:00`).getTime()
        let carePhotoUrl: string | undefined
        if (logPhoto) {
          try {
            const safe = `plants/${user.uid}/${created.id}/care/${Date.now()}_${logPhoto.name}`
            carePhotoUrl = await uploadFileAndGetURL(logPhoto, safe)
          } catch (err: any) {
            warnings.push('Care log photo upload skipped (Storage not configured).')
          }
        }
        await addCareLog(created.id!, {
          type: logType,
          notes: logNotes.trim() || undefined,
          photoUrl: carePhotoUrl,
          createdAt
        })
      }

      if (!HAS_STORAGE && (plantPhoto || logPhoto)) {
        warnings.push('Photos were skipped because Storage is not configured.')
      }
      if (warnings.length) setNotice(warnings.join(' '))

      nav(`/plant/${created.id}`)
    } catch (err: any) {
      console.error('Add plant failed:', err)
      setError(err?.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  // Render
  return (
    <Card className="max-w-2xl mx-auto soft-fade bg-[var(--glass-surface)] border border-[var(--glass-border)] shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
      <h1 className="text-xl font-semibold mb-4 gradient-text tracking-tight">
        Add a New Plant
      </h1>

      {/* Alerts */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl p-2 border border-red-500/30">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-3 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/40 rounded-xl p-2 border border-amber-400/30">
          {notice}
        </div>
      )}
      {preId && (
        <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl p-2 border border-emerald-400/30">
          This plant is verified and will include its care guide automatically.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm opacity-70">Name *</label>
            <Input
              placeholder="Aloe Vera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!!preId}
              className={preId ? 'opacity-60 cursor-not-allowed' : ''}
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Nickname</label>
            <Input
              placeholder="Sunny"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Species</label>
            <Input
              placeholder="Aloe barbadensis"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              readOnly={!!preId}
              className={preId ? 'opacity-60 cursor-not-allowed' : ''}
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Location</label>
            <Input
              placeholder="Kitchen window"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Photo section */}
          <div className="sm:col-span-2">
            <label className="text-sm opacity-70">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPlantPhoto(e.target.files?.[0] ?? null)}
              className="text-sm mt-1"
            />
            {preId && (
              <p className="mt-1 text-xs text-gray-500 italic">
                If you don’t choose an image, a default image from Dahon’s database will be used.
              </p>
            )}
            {!plantPhoto && defaultImage && (
              <div className="mt-3 flex items-center gap-3 text-xs text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/30 border border-emerald-500/20 rounded-lg p-2 transition-all duration-300">
                <img
                  src={defaultImage}
                  alt="Default preview"
                  className="w-14 h-14 rounded-md border border-emerald-400/30 object-cover"
                />
                <span>
                  Using default image from <strong>Dahon’s</strong> plant library.
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-medium">Initial Care Log (optional)</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm opacity-70">Type</label>
              <select
                className="glass w-full px-3 py-2 rounded-xl"
                value={logType}
                onChange={(e) => setLogType(e.target.value as any)}
              >
                <option value="note">Note</option>
                <option value="water">Water</option>
                <option value="sun">Sunlight</option>
                <option value="fertilizer">Fertilizer</option>
              </select>
            </div>
            <div>
              <label className="text-sm opacity-70">
                Date {careFieldsUsed() && <span className="opacity-80">*</span>}
              </label>
              <input
                className="glass w-full px-3 py-2 rounded-xl"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm opacity-70">Notes</label>
              <input
                className="glass w-full px-3 py-2 rounded-xl"
                placeholder="e.g., Watered 250ml"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm opacity-70">Care photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogPhoto(e.target.files?.[0] ?? null)}
                className="text-sm mt-1"
              />
            </div>
          </div>
        </section>

        <Button
          type="submit"
          variant="primarySoft"
          className="text-[var(--ink)] w-full mt-2"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Plant'}
        </Button>
      </form>
    </Card>
  )
}
