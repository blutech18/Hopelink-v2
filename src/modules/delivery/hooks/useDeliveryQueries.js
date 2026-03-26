// Delivery TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deliveryApi } from '../api/deliveryApi'

export const deliveryKeys = {
  all: ['deliveries'],
  lists: () => [...deliveryKeys.all, 'list'],
  list: (filters) => [...deliveryKeys.lists(), filters],
  counts: () => [...deliveryKeys.all, 'counts'],
  confirmations: (deliveryId) => [...deliveryKeys.all, 'confirmations', deliveryId],
  locationHistory: (deliveryId) => [...deliveryKeys.all, 'locationHistory', deliveryId],
  volunteerDeliveries: (volunteerId, status) => [...deliveryKeys.all, 'volunteerDeliveries', volunteerId, status],
}

// === Queries ===

export function useDeliveries(filters = {}, options = {}) {
  return useQuery({
    queryKey: deliveryKeys.list(filters),
    queryFn: () => deliveryApi.getDeliveries(filters),
    ...options,
  })
}

export function useDeliveryCounts(options = {}) {
  return useQuery({
    queryKey: deliveryKeys.counts(),
    queryFn: () => deliveryApi.getDeliveryCounts(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useDeliveryConfirmations(deliveryId, options = {}) {
  return useQuery({
    queryKey: deliveryKeys.confirmations(deliveryId),
    queryFn: () => deliveryApi.getDeliveryConfirmations(deliveryId),
    enabled: !!deliveryId,
    ...options,
  })
}

export function useDeliveryLocationHistory(deliveryId, options = {}) {
  return useQuery({
    queryKey: deliveryKeys.locationHistory(deliveryId),
    queryFn: () => deliveryApi.getDeliveryLocationHistory(deliveryId),
    enabled: !!deliveryId,
    ...options,
  })
}

export function useVolunteerDeliveriesWithLocation(volunteerId, status = null, options = {}) {
  return useQuery({
    queryKey: deliveryKeys.volunteerDeliveries(volunteerId, status),
    queryFn: () => deliveryApi.getVolunteerDeliveriesWithLocation(volunteerId, status),
    enabled: !!volunteerId,
    ...options,
  })
}

// === Mutations ===

export function useCreateDelivery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => deliveryApi.createDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useUpdateDelivery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deliveryId, updates }) =>
      deliveryApi.updateDelivery(deliveryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deliveryId, status, volunteerId, additionalData }) =>
      deliveryApi.updateDeliveryStatus(deliveryId, status, volunteerId, additionalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deliveryId, userId, userRole, confirmed, rating, feedback }) =>
      deliveryApi.confirmDeliveryByUser(deliveryId, userId, userRole, confirmed, rating, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useConfirmReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deliveryId, recipientId, confirmed, rating, feedback }) =>
      deliveryApi.confirmReceipt(deliveryId, recipientId, confirmed, rating, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useUpdatePickupStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ claimId, userId, status, notes }) =>
      deliveryApi.updatePickupStatus(claimId, userId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useUpdateDirectDeliveryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ claimId, userId, status, addr, instructions, notes }) =>
      deliveryApi.updateDirectDeliveryStatus(claimId, userId, status, addr, instructions, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useLogDeliveryLocation() {
  return useMutation({
    mutationFn: ({ deliveryId, location, volunteerId }) =>
      deliveryApi.logDeliveryLocation(deliveryId, location, volunteerId),
  })
}
