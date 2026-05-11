'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import type { Profile, Role, PortalAccess, ROLE_ACCESS } from './types'

interface AuthState {
  user: any | null
  profile: Profile | null
  loading: boolean
  portalAccess: PortalAccess | null
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Store signup metadata temporarily so we can create profile after email confirmation
let pendingSignupMeta: { fullName: string; role: Role } | null = null

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    portalAccess: null,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        ensureProfile(session.user)
      } else {
        setState({ user: null, profile: null, loading: false, portalAccess: null })
      }
    })

    // Listen for auth changes (this fires after email confirmation too!)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)

      if (event === 'SIGNED_IN' && session?.user) {
        await ensureProfile(session.user)
      } else if (event === 'SIGNED_OUT') {
        pendingSignupMeta = null
        setState({ user: null, profile: null, loading: false, portalAccess: null })
      } else if (session?.user) {
        await ensureProfile(session.user)
      } else {
        setState({ user: null, profile: null, loading: false, portalAccess: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function ensureProfile(user: any) {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      // Profile exists, just load it
      const { ROLE_ACCESS } = await import('./types')
      const role: Role = existingProfile.role || 'student'
      setState({
        user,
        profile: existingProfile,
        loading: false,
        portalAccess: ROLE_ACCESS[role],
      })
      return
    }

    // Profile doesn't exist — create it
    // Use pending signup metadata if available, otherwise use user metadata from Supabase Auth
    const userMeta = user.user_metadata || {}
    const fullName = pendingSignupMeta?.fullName || userMeta.full_name || userMeta.name || user.email?.split('@')[0] || 'User'
    const role: Role = pendingSignupMeta?.role || userMeta.role || 'student'

    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role,
        section: role === 'student' ? 'primary' : null,
      })
      .select()
      .single()

    const { ROLE_ACCESS } = await import('./types')
    const finalRole: Role = newProfile?.role || role

    setState({
      user,
      profile: newProfile || { id: user.id, email: user.email, full_name: fullName, role, section: null },
      loading: false,
      portalAccess: ROLE_ACCESS[finalRole],
    })

    // Clear pending meta after use
    pendingSignupMeta = null
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
  }

  async function signUp(email: string, password: string, fullName: string, role: Role) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
          role,
        },
      },
    })
    if (error) return { error: error.message }

    // Store metadata for when the user confirms their email and comes back
    pendingSignupMeta = { fullName, role }

    // Also try to create profile now (in case auto-confirm is on)
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        section: role === 'student' ? 'primary' : null,
      })
    }

    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    pendingSignupMeta = null
    setState({ user: null, profile: null, loading: false, portalAccess: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
