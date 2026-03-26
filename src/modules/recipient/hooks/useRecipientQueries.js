// Recipient TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recipientApi } from '../api/recipientApi'

export const recipientKeys = {
  all: ['requests'],
  lists: () => [...recipientKeys.all, 'list'],
  list: (filters) => [...recipientKeys.lists(), filters],
  donationRequests: (userId) => [...recipientKeys.all, 'donationRequests', userId],
  counts: () => [...recipientKeys.all, 'counts'],
}

// === Queries ===

export function useRequests(filters = {}, options = {}) {
  return useQuery({
    queryKey: recipientKeys.list(filters),
    queryFn: () => recipientApi.getRequests(filters),
    ...options,
  })
}

export function useUserDonationRequests(userId, options = {}) {
  return useQuery({
    queryKey: recipientKeys.donationRequests(userId),
    queryFn: () => recipientApi.getUserDonationRequests(userId),
    enabled: !!userId,
    ...options,
  })
}

export function useRequestCounts(options = {}) {
  return useQuery({
    queryKey: recipientKeys.counts(),
    queryFn: () => recipientApi.getRequestCounts(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

// === Mutations ===

export function useCreateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request) => recipientApi.createRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientKeys.all })
    },
  })
}

export function useUpdateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, updates }) =>
      recipientApi.updateRequest(requestId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientKeys.all })
    },
  })
}

export function useCreateDonationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => recipientApi.createDonationRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientKeys.all })
    },
  })
}

export function useUpdateDonationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, updates }) =>
      recipientApi.updateDonationRequest(requestId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientKeys.all })
    },
  })
}

export function useDeleteDonationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, userId }) =>
      recipientApi.deleteDonationRequest(requestId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientKeys.all })
    },
  })
}
