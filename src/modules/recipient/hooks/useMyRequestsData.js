// MyRequests TanStack Query hook - cached data fetching for recipient requests
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const myRequestsKeys = {
  all: ['myRequests'],
  list: (userId) => [...myRequestsKeys.all, 'list', userId],
  confirmations: (userId) => [...myRequestsKeys.all, 'confirmations', userId],
}

export function useMyRequests(userId, options = {}) {
  const queryClient = useQueryClient()

  const requestsQuery = useQuery({
    queryKey: myRequestsKeys.list(userId),
    queryFn: () => db.getUserDonationRequests(userId),
    enabled: !!userId,
    placeholderData: [],
    staleTime: 1000 * 60 * 2,
    ...options,
  })

  const confirmationsQuery = useQuery({
    queryKey: myRequestsKeys.confirmations(userId),
    queryFn: async () => {
      const notifications = await db.getUserNotifications(userId, 100)
      return notifications.filter(
        n => n.type === 'delivery_completed' && n.data?.action_required === 'confirm_delivery' && !n.read_at
      )
    },
    enabled: !!userId,
    placeholderData: [],
    staleTime: 1000 * 30,
    ...options,
  })

  // Realtime subscriptions → auto-invalidate
  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`myrequests_tq_${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donation_requests', filter: `requester_id=eq.${userId}` },
        () => queryClient.invalidateQueries({ queryKey: myRequestsKeys.list(userId) })
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.new?.type === 'donation_approved' || payload.new?.type === 'delivery_completed') {
            queryClient.invalidateQueries({ queryKey: myRequestsKeys.all })
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId, queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: myRequestsKeys.all })
  }, [queryClient])

  const hasLoaded = requestsQuery.status === 'success' || requestsQuery.status === 'error'

  return {
    requests: requestsQuery.data || [],
    isLoading: !hasLoaded,
    isError: requestsQuery.isError,
    error: requestsQuery.error,
    isFetching: requestsQuery.isFetching,
    deliveryConfirmationNotifications: confirmationsQuery.data || [],
    refetchAll,
  }
}

export function useDeleteMyRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, userId }) => db.deleteDonationRequest(requestId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myRequestsKeys.all }),
  })
}

export function useUpdateMyRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, updates }) => db.updateDonationRequest(requestId, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myRequestsKeys.all }),
  })
}
