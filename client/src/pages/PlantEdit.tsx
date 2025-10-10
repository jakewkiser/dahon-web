import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { db, updatePlant, Plant, uploadFileAndGetURL } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../lib/auth'

export default function PlantEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const [newPhoto, setNewPhoto] = useState<File | null>(null)

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
      } catch (e:any) {
        setError(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (!id) throw new Error('Missing id')
      if (!name.trim()) throw new Error('Name is required')

      let url = photoUrl
      if (newPhoto && user) {
        url = await uploadFileAndGetURL(newPhoto, `plants/${user.uid}/${id}/cover_${Date.now()}_${newPhoto.name}`)
      }

      await updatePlant(id, {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        species: species.trim() || undefined,
        photoUrl: url,
        // @ts-ignore extra field allowed in Firestore doc
        location: location.trim() || undefined,
      })
      nav(`/plant/${id}`)
    } catch (e:any) {
      setError(e.message || String(e))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Card className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Edit Plant</h1>
      {error && <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl p-2">{error}</div>}
      <form onSubmit={onSave} className="space-y-3">
        <Input placeholder="Name *" value={name} onChange={e=> setName(e.target.value)} />
        <Input placeholder="Nickname" value={nickname} onChange={e=> setNickname(e.target.value)} />
        <Input placeholder="Species" value={species} onChange={e=> setSpecies(e.target.value)} />
        <Input placeholder="Location" value={location} onChange={e=> setLocation(e.target.value)} />
        {photoUrl && <img src={photoUrl} alt="" className="w-40 h-40 object-cover rounded-2xl" />}
        <input type="file" accept="image/*" onChange={(e)=> setNewPhoto(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <Button type="submit" className="text-ink">Save</Button>
          <Button type="button" className="text-ink" onClick={()=> nav(-1)}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
