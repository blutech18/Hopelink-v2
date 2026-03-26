// Feedback TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { feedbackApi } from '../api/feedbackApi'

export const feedbackKeys = {
  all: ['feedback'],
  transactions: (userId, sinceDate) => [...feedbackKeys.all, 'transactions', userId, sinceDate],
  status: (recipientId, transactions) => [...feedbackKeys.all, 'status', recipientId],
  performance: (userId) => [...feedbackKeys.all, 'performance', userId],
  platform: () => [...feedbackKeys.all, 'platform'],
}

export function useCompletedTransactionsForFeedback(userId, sinceDate, options = {}) {
  return useQuery({
    queryKey: feedbackKeys.transactions(userId, sinceDate),
    queryFn: () => feedbackApi.getCompletedTransactionsForFeedback(userId, sinceDate),
    enabled: !!userId,
    ...options,
  })
}

export function useUserPerformanceMetrics(userId, options = {}) {
  return useQuery({
    queryKey: feedbackKeys.performance(userId),
    queryFn: () => feedbackApi.getUserPerformanceMetrics(userId),
    enabled: !!userId,
    ...options,
  })
}

export function useAllPlatformFeedback(options = {}) {
  return useQuery({
    queryKey: feedbackKeys.platform(),
    queryFn: () => feedbackApi.getAllPlatformFeedback(),
    ...options,
  })
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => feedbackApi.submitFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
    },
  })
}

export function useSubmitPlatformFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => feedbackApi.submitPlatformFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.platform() })
    },
  })
}
