// Donor TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { donorApi } from '../api/donorApi'

// Query keys factory
export const donorKeys = {
  all: ['donations'],
  lists: () => [...donorKeys.all, 'list'],
  list: (filters) => [...donorKeys.lists(), filters],
  details: () => [...donorKeys.all, 'detail'],
  detail: (id) => [...donorKeys.details(), id],
  available: (filters) => [...donorKeys.all, 'available', filters],
  counts: () => [...donorKeys.all, 'counts'],
  expiryStats: () => [...donorKeys.all, 'expiryStats'],
  donorStats: (userId) => [...donorKeys.all, 'donorStats', userId],
  badges: (userId) => [...donorKeys.all, 'badges', userId],
}

// === Queries ===

export function useDonations(filters = {}, options = {}) {
  return useQuery({
    queryKey: donorKeys.list(filters),
    queryFn: () => donorApi.getDonations(filters),
    ...options,
  })
}

export function useDonation(donationId, options = {}) {
  return useQuery({
    queryKey: donorKeys.detail(donationId),
    queryFn: () => donorApi.getDonationById(donationId),
    enabled: !!donationId,
    ...options,
  })
}

export function useAvailableDonations(filters = {}, options = {}) {
  return useQuery({
    queryKey: donorKeys.available(filters),
    queryFn: () => donorApi.getAvailableDonations(filters),
    ...options,
  })
}

export function useDonationCounts(options = {}) {
  return useQuery({
    queryKey: donorKeys.counts(),
    queryFn: () => donorApi.getDonationCounts(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useDonationExpiryStats(options = {}) {
  return useQuery({
    queryKey: donorKeys.expiryStats(),
    queryFn: () => donorApi.getDonationExpiryStats(),
    ...options,
  })
}

export function useDonorStats(userId, options = {}) {
  return useQuery({
    queryKey: donorKeys.donorStats(userId),
    queryFn: () => donorApi.getDonorStats(userId),
    enabled: !!userId,
    ...options,
  })
}

export function useUserBadges(userId, options = {}) {
  return useQuery({
    queryKey: donorKeys.badges(userId),
    queryFn: () => donorApi.getUserBadges(userId),
    enabled: !!userId,
    ...options,
  })
}

// === Mutations ===

export function useCreateDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (donation) => donorApi.createDonation(donation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.all })
    },
  })
}

export function useUpdateDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, updates, userId }) =>
      donorApi.updateDonation(donationId, updates, userId),
    onSuccess: (_, { donationId }) => {
      queryClient.invalidateQueries({ queryKey: donorKeys.detail(donationId) })
      queryClient.invalidateQueries({ queryKey: donorKeys.lists() })
    },
  })
}

export function useDeleteDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, userId }) =>
      donorApi.deleteDonation(donationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.all })
    },
  })
}

export function useClaimDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, recipientId }) =>
      donorApi.claimDonation(donationId, recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.all })
    },
  })
}
