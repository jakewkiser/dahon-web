import { useEffect, useMemo, useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { addPlant, addCareLog, uploadFileAndGetURL, updatePlant, HAS_STORAGE } from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AddPlant() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [params] = useSearchParams()

  const preName = useMemo(() => params.get('name') ?? '', [params])
  const preSpecies = useMemo(() => params.get('species') ?? '', [params])

  const [name, setName] = useState(preName)
  const [nickname, setNickname] = useState('')
  const [species, setSpecies] = useState(preSpecies)
  const [location, setLocation] = useState('')
  const [plantPhoto, setPlantPhoto] = useState<File | null>(null)

  const [logType, setLogType] = useState<'water' | 'sun' | 'fertilizer' | 'note'>('note')
  const [logNotes, setLogNotes] = useState('')
  const [logDate, setLogDate] = useState('') // YYYY-MM-DD (required if any care fields are used)
  const [logPhoto, setLogPhoto] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (preName) setName(preName)
    if (preSpecies) setSpecies(preSpecies)
  }, [preName, preSpecies])

  function careFieldsUsed() {
    return logType !== 'note' || !!logNotes.trim() || !!logPhoto
  }

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
      // 1) Create plant always
      const created = await addPlant({
        userId: user.uid,
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        species: species.trim() || undefined,
        location: location.trim() || undefined,
      })

      // 2) Optional plant photo
      if (plantPhoto) {
        try {
          const safe = `plants/${user.uid}/${created.id}/cover_${Date.now()}_${plantPhoto.name}`
          const url = await uploadFileAndGetURL(plantPhoto, safe)
          await updatePlant(created.id!, { photoUrl: url })
        } catch (err: any) {
          console.warn('Plant photo upload skipped:', err)
          warnings.push('Plant photo upload skipped (Storage not configured).')
        }
      }

      // 3) Optional initial care log (REQUIRES DATE if used)
      if (careFieldsUsed()) {
        const createdAt = new Date(`${logDate}T00:00:00`).getTime()
        let carePhotoUrl: string | undefined
        if (logPhoto) {
          try {
            const safe = `plants/${user.uid}/${created.id}/care/${Date.now()}_${logPhoto.name}`
            carePhotoUrl = await uploadFileAndGetURL(logPhoto, safe)
          } catch (err: any) {
            console.warn('Care log photo upload skipped:', err)
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

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-3">Add Plant</h1>

      {error && <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl p-2">{error}</div>}
      {notice && <div className="mb-3 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/40 rounded-xl p-2">{notice}</div>}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm opacity-70">Name *</label>
            <Input placeholder="Aloe Vera" value={name} onChange={(e)=> setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm opacity-70">Nickname</label>
            <Input placeholder="Sunny" value={nickname} onChange={(e)=> setNickname(e.target.value)} />
          </div>
          <div>
            <label className="text-sm opacity-70">Species</label>
            <Input placeholder="Aloe barbadensis" value={species} onChange={(e)=> setSpecies(e.target.value)} />
          </div>
          <div>
            <label className="text-sm opacity-70">Location</label>
            <Input placeholder="Kitchen window" value={location} onChange={(e)=> setLocation(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm opacity-70">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={(e)=> setPlantPhoto(e.target.files?.[0] ?? null)} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-medium">Initial Care Log (optional)</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm opacity-70">Type</label>
              <select className="glass w-full px-3 py-2 rounded-xl" value={logType} onChange={(e)=> setLogType(e.target.value as any)}>
                <option value="note">Note</option>
                <option value="water">Water</option>
                <option value="sun">Sunlight</option>
                <option value="fertilizer">Fertilizer</option>
              </select>
            </div>
            <div>
              <label className="text-sm opacity-70">Date {careFieldsUsed() && <span className="opacity-80">*</span>}</label>
              <input className="glass w-full px-3 py-2 rounded-xl" type="date" value={logDate} onChange={(e)=> setLogDate(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm opacity-70">Notes</label>
              <input className="glass w-full px-3 py-2 rounded-xl" placeholder="e.g., Watered 250ml" value={logNotes} onChange={(e)=> setLogNotes(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm opacity-70">Care photo (optional)</label>
              <input type="file" accept="image/*" onChange={(e)=> setLogPhoto(e.target.files?.[0] ?? null)} />
            </div>
          </div>
        </section>

        <Button type="submit" className="text-ink" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </form>
    </Card>
  )
}

