// Auth TanStack Query hooks
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/authApi'

export const authKeys = {
  all: ['auth'],
  profile: (userId) => [...authKeys.all, 'profile', userId],
  profileCompletion: (userId) => [...authKeys.all, 'profileCompletion', userId],
  emailAvailability: (email) => [...authKeys.all, 'emailAvailability', email],
  roleSignup: (role) => [...authKeys.all, 'roleSignup', role],
}

export function useProfile(userId, options = {}) {
  return useQuery({
    queryKey: authKeys.profile(userId),
    queryFn: () => authApi.getProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useProfileCompletion(userId, options = {}) {
  return useQuery({
    queryKey: authKeys.profileCompletion(userId),
    queryFn: () => authApi.checkProfileCompletion(userId),
    enabled: !!userId,
    ...options,
  })
}

export function useEmailAvailability(email, options = {}) {
  return useQuery({
    queryKey: authKeys.emailAvailability(email),
    queryFn: () => authApi.checkEmailAvailability(email),
    enabled: !!email && email.includes('@'),
    staleTime: 1000 * 30,
    ...options,
  })
}

export function useRoleSignupEnabled(role, options = {}) {
  return useQuery({
    queryKey: authKeys.roleSignup(role),
    queryFn: () => authApi.isRoleSignupEnabled(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}
