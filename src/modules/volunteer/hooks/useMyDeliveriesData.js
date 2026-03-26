// MyDeliveries TanStack Query hook - cached volunteer deliveries
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const myDeliveriesKeys = {
  all: ['myDeliveries'],
  list: (userId) => [...myDeliveriesKeys.all, 'list', userId],
  notifications: (userId) => [...myDeliveriesKeys.all, 'notifications', userId],
}

export function useMyDeliveries(userId, options = {}) {
  const queryClient = useQueryClient()

  const deliveriesQuery = useQuery({
    queryKey: myDeliveriesKeys.list(userId),
    queryFn: () => db.getDeliveries({ volunteer_id: userId }),
    enabled: !!userId,
    placeholderData: [],
    staleTime: 1000 * 60 * 2,
    ...options,
  })

  // Realtime → auto-invalidate
  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`mydeliveries_tq_${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliveries', filter: `volunteer_id=eq.${userId}` },
        () => queryClient.invalidateQueries({ queryKey: myDeliveriesKeys.list(userId) })
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId, queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: myDeliveriesKeys.all })
  }, [queryClient])

  const hasLoaded = deliveriesQuery.status === 'success' || deliveriesQuery.status === 'error'

  return {
    deliveries: deliveriesQuery.data || [],
    isLoading: !hasLoaded,
    isError: deliveriesQuery.isError,
    error: deliveriesQuery.error,
    isFetching: deliveriesQuery.isFetching,
    refetchAll,
  }
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deliveryId, status, updates }) => db.updateDeliveryStatus(deliveryId, status, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myDeliveriesKeys.all }),
  })
}
