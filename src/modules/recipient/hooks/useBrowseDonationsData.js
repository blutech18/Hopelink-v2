// BrowseDonations TanStack Query hook - cached available donations for recipients
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const browseDonationsKeys = {
  all: ['browseDonations'],
  available: () => [...browseDonationsKeys.all, 'available'],
  userProfile: (userId) => [...browseDonationsKeys.all, 'userProfile', userId],
  userRequests: (userId) => [...browseDonationsKeys.all, 'userRequests', userId],
  matchingParams: () => [...browseDonationsKeys.all, 'matchingParams'],
}

export function useBrowseDonations(userId, options = {}) {
  const queryClient = useQueryClient()

  const donationsQuery = useQuery({
    queryKey: browseDonationsKeys.available(),
    queryFn: () => db.getAvailableDonations({ limit: 30 }),
    placeholderData: [],
    staleTime: 1000 * 60 * 1, // 1 min for browsing
    ...options,
  })

  const profileQuery = useQuery({
    queryKey: browseDonationsKeys.userProfile(userId),
    queryFn: () => db.getProfile(userId),
    enabled: !!userId,
    placeholderData: null,
    staleTime: 1000 * 60 * 5,
  })

  const userRequestsQuery = useQuery({
    queryKey: browseDonationsKeys.userRequests(userId),
    queryFn: () => db.getRequests({ requester_id: userId, status: 'open', limit: 10000 }),
    enabled: !!userId,
    placeholderData: [],
    staleTime: 1000 * 60 * 2,
  })

  const matchingParamsQuery = useQuery({
    queryKey: browseDonationsKeys.matchingParams(),
    queryFn: () => db.getMatchingParameters(),
    placeholderData: null,
    staleTime: 1000 * 60 * 10,
  })

  // Realtime → auto-invalidate when donations change
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('browsedonations_tq')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' },
        () => queryClient.invalidateQueries({ queryKey: browseDonationsKeys.available() })
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: browseDonationsKeys.all })
  }, [queryClient])

  const hasLoaded = donationsQuery.status === 'success' || donationsQuery.status === 'error'

  return {
    donations: donationsQuery.data || [],
    isLoading: !hasLoaded,
    isError: donationsQuery.isError,
    error: donationsQuery.error,
    isFetching: donationsQuery.isFetching,
    recipientProfile: profileQuery.data || null,
    userRequests: userRequestsQuery.data || [],
    matchingParams: matchingParamsQuery.data || null,
    refetchAll,
  }
}

export function useClaimDonationAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, recipientId }) => db.claimDonation(donationId, recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: browseDonationsKeys.all })
    },
  })
}
