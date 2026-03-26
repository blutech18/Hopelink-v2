// Matching TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchingApi } from '../api/matchingApi'

export const matchingKeys = {
  all: ['matching'],
  parameters: () => [...matchingKeys.all, 'parameters'],
  recommendations: (userId, role) => [...matchingKeys.all, 'recommendations', userId, role],
  matchesForRequest: (requestId) => [...matchingKeys.all, 'matchesForRequest', requestId],
  optimal: (filters) => [...matchingKeys.all, 'optimal', filters],
}

// === Queries ===

export function useMatchingParameters(options = {}) {
  return useQuery({
    queryKey: matchingKeys.parameters(),
    queryFn: () => matchingApi.getMatchingParameters(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

export function useMatchingRecommendations(userId, role, limit = 5, options = {}) {
  return useQuery({
    queryKey: matchingKeys.recommendations(userId, role),
    queryFn: () => matchingApi.getMatchingRecommendations(userId, role, limit),
    enabled: !!userId && !!role,
    ...options,
  })
}

export function useMatchesForRequest(requestId, maxResults = 10, options = {}) {
  return useQuery({
    queryKey: matchingKeys.matchesForRequest(requestId),
    queryFn: () => matchingApi.findMatchesForRequest(requestId, maxResults),
    enabled: !!requestId,
    ...options,
  })
}

export function useOptimalMatches(filters = {}, options = {}) {
  return useQuery({
    queryKey: matchingKeys.optimal(filters),
    queryFn: () => matchingApi.findOptimalMatches(filters),
    ...options,
  })
}

// === Mutations ===

export function useUpdateMatchingParameters() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ group, updates, userId }) =>
      matchingApi.updateMatchingParameters(group, updates, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchingKeys.parameters() })
    },
  })
}

export function usePerformAutoMatching() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, requestId }) =>
      matchingApi.performAutomaticMatching(donationId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchingKeys.all })
    },
  })
}

export function useCreateSmartMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, donationId, volunteerId }) =>
      matchingApi.createSmartMatch(requestId, donationId, volunteerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchingKeys.all })
    },
  })
}
