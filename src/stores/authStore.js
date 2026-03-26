// Auth Zustand store - manages authentication state
// Replaces the massive AuthContext for global state while keeping AuthContext for provider wiring
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAuthStore = create(
  devtools(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      session: null,
      loading: true,
      isSigningIn: false,
      isSigningOut: false,

      // Derived state
      isAuthenticated: false,
      isDonor: false,
      isRecipient: false,
      isVolunteer: false,
      isAdmin: false,
      isVerified: false,

      // Actions
      setUser: (user) =>
        set({ user, isAuthenticated: !!user }, false, 'auth/setUser'),

      setProfile: (profile) =>
        set({
          profile,
          isDonor: profile?.role === 'donor',
          isRecipient: profile?.role === 'recipient',
          isVolunteer: profile?.role === 'volunteer',
          isAdmin: profile?.role === 'admin',
          isVerified: profile?.is_verified === true,
        }, false, 'auth/setProfile'),

      setSession: (session) =>
        set({ session }, false, 'auth/setSession'),

      setLoading: (loading) =>
        set({ loading }, false, 'auth/setLoading'),

      setSigningIn: (isSigningIn) =>
        set({ isSigningIn }, false, 'auth/setSigningIn'),

      setSigningOut: (isSigningOut) =>
        set({ isSigningOut }, false, 'auth/setSigningOut'),

      reset: () =>
        set({
          user: null,
          profile: null,
          session: null,
          loading: false,
          isSigningIn: false,
          isSigningOut: false,
          isAuthenticated: false,
          isDonor: false,
          isRecipient: false,
          isVolunteer: false,
          isAdmin: false,
          isVerified: false,
        }, false, 'auth/reset'),

      // Hydrate from existing AuthContext (bridge pattern)
      hydrate: ({ user, profile, session }) =>
        set((state) => ({
          user,
          profile,
          session,
          isAuthenticated: !!user,
          isDonor: profile?.role === 'donor',
          isRecipient: profile?.role === 'recipient',
          isVolunteer: profile?.role === 'volunteer',
          isAdmin: profile?.role === 'admin',
          isVerified: profile?.is_verified === true,
          loading: false,
        }), false, 'auth/hydrate'),
    }),
    { name: 'AuthStore' }
  )
)

export default useAuthStore
