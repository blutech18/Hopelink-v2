// Events TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/eventsApi'

export const eventKeys = {
  all: ['events'],
  lists: () => [...eventKeys.all, 'list'],
  list: (filters) => [...eventKeys.lists(), filters],
  details: () => [...eventKeys.all, 'detail'],
  detail: (id) => [...eventKeys.details(), id],
  participants: (eventId) => [...eventKeys.all, 'participants', eventId],
  completedByUser: (userId) => [...eventKeys.all, 'completed', userId],
  counts: () => [...eventKeys.all, 'counts'],
  banned: () => [...eventKeys.all, 'banned'],
}

// === Queries ===

export function useEvents(filters = {}, options = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventsApi.getEvents(filters),
    ...options,
  })
}

export function useEvent(eventId, options = {}) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventsApi.getEvent(eventId),
    enabled: !!eventId,
    ...options,
  })
}

export function useEventParticipants(eventId, options = {}) {
  return useQuery({
    queryKey: eventKeys.participants(eventId),
    queryFn: () => eventsApi.getEventParticipants(eventId),
    enabled: !!eventId,
    ...options,
  })
}

export function useUserCompletedEvents(userId, options = {}) {
  return useQuery({
    queryKey: eventKeys.completedByUser(userId),
    queryFn: () => eventsApi.getUserCompletedEvents(userId),
    enabled: !!userId,
    ...options,
  })
}

export function useEventCounts(options = {}) {
  return useQuery({
    queryKey: eventKeys.counts(),
    queryFn: () => eventsApi.getEventCounts(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useBannedUsers(options = {}) {
  return useQuery({
    queryKey: eventKeys.banned(),
    queryFn: () => eventsApi.getBannedUsers(),
    ...options,
  })
}

// === Mutations ===

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, donationItems }) =>
      eventsApi.createEvent(data, donationItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, data, donationItems }) =>
      eventsApi.updateEvent(eventId, data, donationItems),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId) => eventsApi.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}

export function useJoinEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, userId }) =>
      eventsApi.joinEvent(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.participants(eventId) })
    },
  })
}

export function useLeaveEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, userId }) =>
      eventsApi.leaveEvent(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.participants(eventId) })
    },
  })
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, userId, status }) =>
      eventsApi.updateAttendance(eventId, userId, status),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.participants(eventId) })
    },
  })
}

export function useBulkUpdateAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, updates, original }) =>
      eventsApi.bulkUpdateAttendance(eventId, updates, original),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.participants(eventId) })
    },
  })
}
