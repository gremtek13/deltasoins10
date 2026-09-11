import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Dossier } from '../lib/types'

type Role = 'cabinet' | 'client' | null

interface AuthState {
  session: Session | null
  user: any | null
  role: Role
  dossierIds: string[]
  dossierActif: Dossier | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [dossierIds, setDossierIds] = useState<string[]>([])
  const [dossierActif, setDossierActif] = useState<Dossier | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let cancelled = false

    async function resolveRole() {
      if (!session) {
        setRole(null)
        setUser(null)
        setDossierIds([])
        setDossierActif(null)
        setLoading(false)
        return
      }
      setLoading(true)
      setUser(session.user)

      const { data: adminRow } = await supabase
        .from('cabinet_admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (cancelled) return

      if (adminRow) {
        setRole('cabinet')
        setDossierIds([])
        setDossierActif(null)
        setLoading(false)
        return
      }

      const { data: memberships } = await supabase
        .from('memberships')
        .select('dossier_id')
        .eq('user_id', session.user.id)

      if (cancelled) return
      setRole('client')
      const ids = (memberships ?? []).map((m) => m.dossier_id)
      setDossierIds(ids)

      // Load first dossier if available
      if (ids.length > 0) {
        const { data: dossier } = await supabase
          .from('dossiers')
          .select('*')
          .eq('id', ids[0])
          .maybeSingle()
        if (!cancelled) setDossierActif(dossier)
      }
      setLoading(false)
    }

    resolveRole()
    return () => {
      cancelled = true
    }
  }, [session])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, role, dossierIds, dossierActif, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
