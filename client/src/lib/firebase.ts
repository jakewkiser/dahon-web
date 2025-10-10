import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, getDoc, getDocs, doc,
  updateDoc, deleteDoc, query, where, orderBy, limit as qlimit
} from 'firebase/firestore'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)

// Storage guard (uploads are optional)
export const HAS_STORAGE = !!firebaseConfig.storageBucket
export const storage = getStorage(app)

// ---- Types
export type Plant = {
  id?: string
  userId: string
  name: string
  nickname?: string
  species?: string
  location?: string
  photoUrl?: string
  lastCareAt?: number
  createdAt?: number
}

export type CareLog = {
  id?: string
  type: 'water' | 'sun' | 'fertilizer' | 'note'
  notes?: string
  photoUrl?: string
  createdAt: number
}

// ---- Utils
function clean<T extends Record<string, any>>(obj: T): Partial<T> {
  // Remove undefined so Firestore never sees them
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
}

export async function uploadFileAndGetURL(file: File, path: string) {
  if (!HAS_STORAGE) throw new Error('Storage not configured')
  const r = ref(storage, path)
  await uploadBytes(r, file)
  return await getDownloadURL(r)
}

// ---- Plants
export async function listPlants(userId: string) {
  const qy = query(collection(db, 'plants'), where('userId', '==', userId))
  const snap = await getDocs(qy)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Plant[]
}

export async function addPlant(p: Plant) {
  const payload = clean({ ...p, createdAt: Date.now() })
  const refDoc = await addDoc(collection(db, 'plants'), payload as any)
  const d = await getDoc(refDoc)
  return { id: refDoc.id, ...(d.data() as any) } as Plant
}

export async function updatePlant(id: string, data: Partial<Plant>) {
  await updateDoc(doc(db, 'plants', id), clean(data) as any)
}

export async function deletePlant(id: string) {
  await deleteDoc(doc(db, 'plants', id))
}

// ---- Care logs
export async function addCareLog(plantId: string, log: CareLog) {
  const payload = clean(log)
  const col = collection(db, 'plants', plantId, 'careLogs')
  const refDoc = await addDoc(col, payload as any)
  // Update parent's lastCareAt to this log's createdAt
  if (payload.createdAt) await updateDoc(doc(db, 'plants', plantId), { lastCareAt: payload.createdAt })
  const d = await getDoc(refDoc)
  return { id: refDoc.id, ...(d.data() as any) } as CareLog
}

export async function listCareLogs(plantId: string, howMany = 10) {
  const col = collection(db, 'plants', plantId, 'careLogs')
  const qy = query(col, orderBy('createdAt', 'desc'), qlimit(howMany))
  const snap = await getDocs(qy)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as CareLog[]
}
