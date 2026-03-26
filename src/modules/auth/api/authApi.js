// Auth module API - wraps auth-related db methods and supabase auth
import { supabase, db } from '@/shared/lib/supabase'

export const authApi = {
  // Session
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (cb) => supabase.auth.onAuthStateChange(cb),
  signInWithPassword: (credentials) => supabase.auth.signInWithPassword(credentials),
  signUp: (credentials) => supabase.auth.signUp(credentials),
  signOut: () => supabase.auth.signOut(),
  signInWithOAuth: (options) => supabase.auth.signInWithOAuth(options),
  resetPasswordForEmail: (email, options) => supabase.auth.resetPasswordForEmail(email, options),
  updateUser: (attrs) => supabase.auth.updateUser(attrs),

  // Profile
  getProfile: (userId) => db.getProfile(userId),
  createProfile: (userId, data) => db.createProfile(userId, data),
  updateProfile: (userId, updates) => db.updateProfile(userId, updates),
  checkEmailAvailability: (email) => db.checkEmailAvailability(email),
  checkProfileCompletion: (userId) => db.checkProfileCompletion(userId),

  // Role signup check
  isRoleSignupEnabled: (role) => db.isRoleSignupEnabled(role),
}

export default authApi
