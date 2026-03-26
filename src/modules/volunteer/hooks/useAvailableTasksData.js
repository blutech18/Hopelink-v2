// AvailableTasks TanStack Query hook - cached volunteer tasks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const availableTasksKeys = {
  all: ['availableTasks'],
  list: () => [...availableTasksKeys.all, 'list'],
  volunteerProfile: (userId) => [...availableTasksKeys.all, 'profile', userId],
}

export function useAvailableTasks(userId, options = {}) {
  const queryClient = useQueryClient()

  const tasksQuery = useQuery({
    queryKey: availableTasksKeys.list(),
    queryFn: () => db.getAvailableVolunteerTasks(),
    placeholderData: [],
    staleTime: 1000 * 60 * 1,
    ...options,
  })

  const profileQuery = useQuery({
    queryKey: availableTasksKeys.volunteerProfile(userId),
    queryFn: () => db.getProfile(userId),
    enabled: !!userId,
    placeholderData: null,
    staleTime: 1000 * 60 * 5,
  })

  // Realtime
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('availabletasks_tq')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donation_claims' },
        () => queryClient.invalidateQueries({ queryKey: availableTasksKeys.list() })
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: availableTasksKeys.all })
  }, [queryClient])

  const hasLoaded = tasksQuery.status === 'success' || tasksQuery.status === 'error'

  return {
    tasks: tasksQuery.data || [],
    isLoading: !hasLoaded,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    isFetching: tasksQuery.isFetching,
    volunteerProfile: profileQuery.data || null,
    refetchAll,
  }
}

export function useAssignVolunteerTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ claimId, volunteerId }) => db.assignVolunteer(claimId, volunteerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: availableTasksKeys.all }),
  })
}
