// Notifications TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../api/notificationsApi'

export const notificationKeys = {
  all: ['notifications'],
  user: (userId) => [...notificationKeys.all, 'user', userId],
}

export function useUserNotifications(userId, limit = 50, options = {}) {
  return useQuery({
    queryKey: notificationKeys.user(userId),
    queryFn: () => notificationsApi.getUserNotifications(userId, limit),
    enabled: !!userId,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    ...options,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId) =>
      notificationsApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useCreateNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => notificationsApi.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
