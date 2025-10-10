// client/src/lib/auth.tsx
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  signInWithPopup,
  User,
  getAuth,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { app } from './firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  // email
  signInEmail: (email: string, password: string) => Promise<void>
  emailSignIn: (email: string, password: string) => Promise<void> // alias
  // google
  signInGoogle: () => Promise<void>
  googleSignIn: () => Promise<void> // alias
  // sign out
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useMemo(() => getAuth(app), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [auth])

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOut = async () => {
    await fbSignOut(auth)
  }

  // aliases to keep older callers working
  const emailSignIn = signInEmail
  const googleSignIn = signInGoogle

  const value: AuthContextValue = {
    user,
    loading,
    signInEmail,
    emailSignIn,
    signInGoogle,
    googleSignIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
