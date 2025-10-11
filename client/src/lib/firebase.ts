// client/src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, getDoc, getDocs, doc,
  updateDoc, deleteDoc, query, where, orderBy, limit as qlimit,
  serverTimestamp, Timestamp
} from 'firebase/firestore'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ---- Firebase app bootstrap ----
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
setPersistence(auth, browserLocalPersistence).catch(() => {
  /* ignore persistence errors and stay in default mode */
})

export const HAS_STORAGE = !!firebaseConfig.storageBucket
export const storage = getStorage(app)

// ---- Types ----
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
  type: 'water' | 'sun' | 'sunlight' | 'fertilizer' | 'note' | 'general'
  notes?: string
  photoUrl?: string
  // UI may send a date field separately; we always store event time in `date` (Timestamp) on write,
  // and map `createdAt` to millis on read for UI sorting.
  createdAt: number
}

// ---- Helpers ----
function clean<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
}

function requireUid(fromParam?: string): string {
  return fromParam || auth.currentUser?.uid || ''
}

// Convert Firestore Timestamp-like or number/Date to millis
function toMillis(d: any): number | undefined {
  if (d == null) return undefined
  if (typeof d === 'number') return Number.isFinite(d) ? d : undefined
  if (d instanceof Date) return Number.isFinite(d.getTime()) ? d.getTime() : undefined
  if (typeof d?.toDate === 'function') {
    const dt = d.toDate()
    return Number.isFinite(dt.getTime()) ? dt.getTime() : undefined
  }
  if (typeof d?.seconds === 'number') {
    return Math.round(d.seconds * 1000)
  }
  return undefined
}

function mapPlant(id: string, data: any): Plant {
  return {
    id,
    ...data,
    createdAt: toMillis(data?.createdAt),
    lastCareAt: toMillis(data?.lastCareAt),
  }
}

function mapCareLog(id: string, data: any): CareLog {
  return {
    id,
    ...data,
    createdAt: toMillis(data?.createdAt) ?? Date.now(),
  }
}

export async function uploadFileAndGetURL(file: File, path: string) {
  if (!HAS_STORAGE) throw new Error('Storage not configured')
  const r = ref(storage, path)
  await uploadBytes(r, file)
  return await getDownloadURL(r)
}

// ---- Plants API ----
export async function listPlants(userId: string) {
  const qy = query(collection(db, 'plants'), where('userId', '==', userId))
  const snap = await getDocs(qy)
  return snap.docs.map(d => mapPlant(d.id, d.data())) as Plant[]
}

export async function addPlant(p: Plant) {
  const uid = requireUid(p.userId)
  if (!uid) throw new Error('Not signed in (userId missing).')

  const payload = clean({
    ...p,
    userId: uid,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  })

  const refDoc = await addDoc(collection(db, 'plants'), payload as any)
  const d = await getDoc(refDoc)
  return mapPlant(refDoc.id, d.data()) as Plant
}

export async function updatePlant(id: string, data: Partial<Plant>) {
  const uid = requireUid(data.userId as any)
  await updateDoc(doc(db, 'plants', id), clean({
    userId: uid || undefined,           // backfill owner on legacy docs (safe no-op if already present)
    ...data,
    updatedAt: serverTimestamp() as any,
  }) as any)
}

export async function deletePlant(id: string) {
  await deleteDoc(doc(db, 'plants', id))
}

// ---- Care Logs API ----
export async function addCareLog(plantId: string, log: CareLog) {
  const uid = requireUid((log as any).userId)
  if (!uid) throw new Error('Not signed in (userId missing).')

  const anyLog = log as any

  // Accept multiple date field names from the UI for the EVENT time:
  const dateCandidate =
    anyLog.date ??
    anyLog.createdAt ??
    anyLog.when ??
    anyLog.datetime ??
    anyLog.at

  if (dateCandidate == null) {
    throw new Error('Care log requires a date.')
  }

  // Normalize care type
  const rawType = String(anyLog.type || '')
  const normalizedType =
    rawType === 'sun' ? 'sunlight' :
    rawType === 'note' ? 'general'  :
    rawType
  const allowed = ['water', 'sunlight', 'fertilizer', 'general', 'sun', 'note']
  const finalType = allowed.includes(normalizedType) ? normalizedType : 'general'

  // Coerce event date to Firestore Timestamp
  let coercedDate: Timestamp
  if (dateCandidate instanceof Timestamp) {
    coercedDate = dateCandidate
  } else if (dateCandidate instanceof Date) {
    coercedDate = Timestamp.fromDate(dateCandidate)
  } else if (typeof dateCandidate === 'number') {
    coercedDate = Timestamp.fromMillis(dateCandidate)
  } else if (typeof dateCandidate === 'string') {
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(dateCandidate)
      ? `${dateCandidate}T00:00:00`
      : dateCandidate
    coercedDate = Timestamp.fromDate(new Date(iso))
  } else {
    throw new Error('Care log requires a date.')
  }

  // Build payload that satisfies strict/tolerant rules:
  // - event time in `date` (Timestamp)
  // - write time in `createdAt` (serverTimestamp)
  const payload = clean({
    ...log,
    type: finalType,
    userId: uid,
    date: coercedDate,
    createdAt: serverTimestamp() as any, // ALWAYS a Timestamp (never a number)
    updatedAt: serverTimestamp() as any,
  })

  // Optional: debug
  // console.info('addCareLog payload →', payload)

  const col = collection(db, 'plants', plantId, 'careLogs')
  const refDoc = await addDoc(col, payload as any)

  // Update parent's lastCareAt to the event time (coercedDate)
  const lastAt = coercedDate.toDate().getTime()
  await updateDoc(doc(db, 'plants', plantId), { lastCareAt: lastAt } as any)

  const d = await getDoc(refDoc)
  return mapCareLog(refDoc.id, d.data()) as CareLog
}

export async function listCareLogs(plantId: string, howMany = 10) {
  const col = collection(db, 'plants', plantId, 'careLogs')
  const qy = query(col, orderBy('createdAt', 'desc'), qlimit(howMany))
  const snap = await getDocs(qy)
  return snap.docs.map(d => mapCareLog(d.id, d.data())) as CareLog[]
}
