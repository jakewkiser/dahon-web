// client/src/pages/PlantEdit.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { FormSkeleton } from '../components/ui/Skeleton'
import { db, updatePlant, Plant, uploadFileAndGetURL } from '../lib/firebase'
import { DEFAULTS } from '../lib/schedule'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../lib/auth'
import { toast } from '../lib/toast'

export default function PlantEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [waterEveryDays, setWaterEveryDays] = useState<number>(DEFAULTS.water)
  const [fertilizeEveryDays, setFertilizeEveryDays] = useState<number>(DEFAULTS.fertilizer)

  useEffect(() => {
    async function load() {
      try {
        if (!id) throw new Error('Missing id')
        const snap = await getDoc(doc(db, 'plants', id))
        if (!snap.exists()) throw new Error('Plant not found')
        const p = { id: snap.id, ...(snap.data() as any) } as Plant
        setName(p.name || '')
        setNickname(p.nickname || '')
        setSpecies(p.species || '')
        setLocation((p as any).location || '')
        setPhotoUrl(p.photoUrl)
        setWaterEveryDays(p.waterEveryDays ?? DEFAULTS.water)
        setFertilizeEveryDays(p.fertilizeEveryDays ?? DEFAULTS.fertilizer)
      } catch (e: any) {
        toast.error(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (!id) throw new Error('Missing id')
      if (!name.trim()) throw new Error('Name is required')

      let url = photoUrl
      if (newPhoto && user) {
        url = await uploadFileAndGetURL(
          newPhoto,
          `plants/${user.uid}/${id}/cover_${Date.now()}_${newPhoto.name}`
        )
      }

      await updatePlant(id, {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        species: species.trim() || undefined,
        photoUrl: url,
        // @ts-ignore extra field allowed in Firestore doc
        location: location.trim() || undefined,
        waterEveryDays: waterEveryDays > 0 ? waterEveryDays : DEFAULTS.water,
        fertilizeEveryDays: fertilizeEveryDays > 0 ? fertilizeEveryDays : DEFAULTS.fertilizer,
      })
      toast.success('Plant saved.')
      nav(`/plant/${id}`)
    } catch (e: any) {
      toast.error(e.message || String(e))
    }
  }

  if (loading)
    return (
      <Card className="max-w-md mx-auto p-5">
        <FormSkeleton />
      </Card>
    )

  return (
    <Card hover={false} className="max-w-md mx-auto">
      {/* Back nav */}
      <button
        onClick={() => nav(-1)}
        className="text-xs opacity-60 hover:opacity-100 mb-3 flex items-center gap-1 transition-opacity"
      >
        ← Back
      </button>

      <h1 className="text-xl font-semibold mb-4 gradient-text tracking-tight">
        Edit {name || 'Plant'}
      </h1>

      <form onSubmit={onSave} className="space-y-3">
        {/* Basic info */}
        <div>
          <label className="text-sm opacity-70">Name *</label>
          <Input placeholder="Aloe Vera" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm opacity-70">Nickname</label>
          <Input placeholder="Sunny" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        <div>
          <label className="text-sm opacity-70">Species</label>
          <Input placeholder="Aloe barbadensis" value={species} onChange={(e) => setSpecies(e.target.value)} />
        </div>
        <div>
          <label className="text-sm opacity-70">Location</label>
          <Input placeholder="Kitchen window" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        {/* Photo */}
        {photoUrl && (
          <img src={photoUrl} alt="" className="w-40 h-40 object-cover rounded-2xl" />
        )}
        <div>
          <label className="text-sm opacity-70">Replace photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files?.[0] ?? null)}
            className="text-sm mt-1"
          />
        </div>

        {/* Care schedule */}
        <div className="pt-2 border-t border-[var(--glass-border)]">
          <div className="text-sm font-medium mb-2 opacity-80">Care Schedule</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70">Water every (days)</label>
              <input
                type="number"
                min={1}
                max={365}
                className="glass w-full px-3 py-2 rounded-xl text-sm mt-1"
                value={waterEveryDays}
                onChange={(e) => setWaterEveryDays(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs opacity-70">Fertilize every (days)</label>
              <input
                type="number"
                min={1}
                max={365}
                className="glass w-full px-3 py-2 rounded-xl text-sm mt-1"
                value={fertilizeEveryDays}
                onChange={(e) => setFertilizeEveryDays(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" className="text-[var(--ink)]">Save</Button>
          <Button type="button" variant="neutral" onClick={() => nav(-1)}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
