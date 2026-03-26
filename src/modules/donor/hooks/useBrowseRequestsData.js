// BrowseRequests TanStack Query hook - cached open requests for donors
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const browseRequestsKeys = {
  all: ['browseRequests'],
  ranked: () => [...browseRequestsKeys.all, 'ranked'],
  donorDonations: (userId) => [...browseRequestsKeys.all, 'donorDonations', userId],
  matchingParams: () => [...browseRequestsKeys.all, 'matchingParams'],
}

export function useBrowseRequests(userId, options = {}) {
  const queryClient = useQueryClient()

  const requestsQuery = useQuery({
    queryKey: browseRequestsKeys.ranked(),
    queryFn: async () => {
      const ranked = await db.rankOpenRequests({ limit: 30 })
      const rankedArray = ranked || []
      if (rankedArray.length > 0 && rankedArray[0]?.request) {
        return rankedArray.map(r => ({ ...r.request, _rankScore: r.score }))
      }
      if (rankedArray.length > 0) return rankedArray
      return await db.getRequests({ status: 'open', limit: 30 })
    },
    placeholderData: [],
    staleTime: 1000 * 60 * 1,
    ...options,
  })

  const donorDonationsQuery = useQuery({
    queryKey: browseRequestsKeys.donorDonations(userId),
    queryFn: () => db.getDonations({ donor_id: userId, status: 'available' }),
    enabled: !!userId,
    placeholderData: [],
    staleTime: 1000 * 60 * 2,
  })

  const matchingParamsQuery = useQuery({
    queryKey: browseRequestsKeys.matchingParams(),
    queryFn: () => db.getMatchingParameters(),
    placeholderData: null,
    staleTime: 1000 * 60 * 10,
  })

  // Realtime → auto-invalidate
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('browserequests_tq')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donation_requests' },
        () => queryClient.invalidateQueries({ queryKey: browseRequestsKeys.ranked() })
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: browseRequestsKeys.all })
  }, [queryClient])

  // isLoading = true only on the very first fetch before any real data arrives
  const hasLoaded = requestsQuery.status === 'success' || requestsQuery.status === 'error'

  return {
    requests: requestsQuery.data || [],
    isLoading: !hasLoaded,
    isError: requestsQuery.isError,
    error: requestsQuery.error,
    isFetching: requestsQuery.isFetching,
    donorDonations: donorDonationsQuery.data || [],
    matchingParams: matchingParamsQuery.data || null,
    refetchAll,
  }
}

export function useCreateSmartMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, donationId }) => db.createSmartMatch(requestId, donationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: browseRequestsKeys.all }),
  })
}
