// Volunteer TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { volunteerApi } from '../api/volunteerApi'

export const volunteerKeys = {
  all: ['volunteer'],
  tasks: () => [...volunteerKeys.all, 'tasks'],
  stats: (volunteerId) => [...volunteerKeys.all, 'stats', volunteerId],
  ratings: (volunteerId) => [...volunteerKeys.all, 'ratings', volunteerId],
  requestStatus: (volunteerId, taskId) => [...volunteerKeys.all, 'requestStatus', volunteerId, taskId],
  list: (filters) => [...volunteerKeys.all, 'list', filters],
}

// === Queries ===

export function useAvailableTasks(options = {}) {
  return useQuery({
    queryKey: volunteerKeys.tasks(),
    queryFn: () => volunteerApi.getAvailableVolunteerTasks(),
    ...options,
  })
}

export function useVolunteerStats(volunteerId, options = {}) {
  return useQuery({
    queryKey: volunteerKeys.stats(volunteerId),
    queryFn: () => volunteerApi.getVolunteerStats(volunteerId),
    enabled: !!volunteerId,
    ...options,
  })
}

export function useVolunteerRatings(volunteerId, options = {}) {
  return useQuery({
    queryKey: volunteerKeys.ratings(volunteerId),
    queryFn: () => volunteerApi.getVolunteerRatings(volunteerId),
    enabled: !!volunteerId,
    ...options,
  })
}

export function useVolunteers(filters = {}, options = {}) {
  return useQuery({
    queryKey: volunteerKeys.list(filters),
    queryFn: () => volunteerApi.getVolunteers(filters),
    ...options,
  })
}

export function useVolunteerRequestStatus(volunteerId, taskId, options = {}) {
  return useQuery({
    queryKey: volunteerKeys.requestStatus(volunteerId, taskId),
    queryFn: () => volunteerApi.getVolunteerRequestStatus(volunteerId, taskId),
    enabled: !!volunteerId && !!taskId,
    ...options,
  })
}

// === Mutations ===

export function useAssignVolunteer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ claimId, volunteerId }) =>
      volunteerApi.assignVolunteerToDelivery(claimId, volunteerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.all })
    },
  })
}

export function useCreateVolunteerRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => volunteerApi.createVolunteerRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.all })
    },
  })
}

export function useConfirmVolunteerRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ notifId, volunteerId, claimId, approved }) =>
      volunteerApi.confirmVolunteerRequest(notifId, volunteerId, claimId, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.all })
    },
  })
}

export function useCreateVolunteerRating() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => volunteerApi.createVolunteerRating(data),
    onSuccess: (_, { volunteerId }) => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.ratings(volunteerId) })
    },
  })
}
