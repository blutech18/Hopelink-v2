// MyDonations TanStack Query hook - replaces manual data fetching with cached queries
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const myDonationsKeys = {
  all: ['myDonations'],
  list: (userId) => [...myDonationsKeys.all, 'list', userId],
  notifications: (userId) => [...myDonationsKeys.all, 'notifications', userId],
  claims: (userId) => [...myDonationsKeys.all, 'claims', userId],
}

// Fetch donation claims for completed donations
async function fetchDonationClaimsData(donationsList) {
  const completedDonations = (donationsList || []).filter(d => d.status === 'completed')
  if (completedDonations.length === 0) return {}

  const donationIds = completedDonations.map(d => d.id)
  const { data: claims, error: claimsError } = await supabase
    .from('donation_claims')
    .select('*')
    .in('donation_id', donationIds)
    .eq('status', 'completed')

  if (claimsError) throw claimsError
  if (!claims || claims.length === 0) return {}

  const recipientIds = claims.map(c => c.recipient_id).filter(Boolean)
  const claimIds = claims.map(c => c.id)

  const [{ data: recipients }, { data: deliveries }] = await Promise.all([
    supabase.from('users').select('id, name, email, role').in('id', recipientIds),
    supabase.from('deliveries').select('id, claim_id, volunteer_id').in('claim_id', claimIds),
  ])

  const volunteerIds = deliveries?.map(d => d.volunteer_id).filter(Boolean) || []
  const { data: volunteers } = volunteerIds.length > 0
    ? await supabase.from('users').select('id, name, email, role').in('id', volunteerIds)
    : { data: [] }

  const recipientsMap = new Map(recipients?.map(r => [r.id, r]) || [])
  const volunteersMap = new Map(volunteers?.map(v => [v.id, v]) || [])
  const deliveriesMap = new Map()
  deliveries?.forEach(d => {
    if (!deliveriesMap.has(d.claim_id)) deliveriesMap.set(d.claim_id, [])
    deliveriesMap.get(d.claim_id).push({ ...d, volunteer: volunteersMap.get(d.volunteer_id) || null })
  })

  const claimsByDonation = {}
  claims.forEach(claim => {
    if (!claimsByDonation[claim.donation_id]) claimsByDonation[claim.donation_id] = []
    claimsByDonation[claim.donation_id].push({
      ...claim,
      recipient: recipientsMap.get(claim.recipient_id) || null,
      delivery: deliveriesMap.get(claim.id) || []
    })
  })
  return claimsByDonation
}

// Parse notification types from raw notifications
function parseNotifications(notifications) {
  const deliveryConfirmation = (notifications || []).filter(n =>
    n.type === 'delivery_completed' && n.data?.action_required === 'donor_final_confirmation' && !n.read_at)
  const pickup = (notifications || []).filter(n =>
    n.type === 'system_alert' && (n.data?.notification_type === 'pickup_scheduled' || n.data?.notification_type === 'pickup_update') && !n.read_at)
  const pickupConfirmation = (notifications || []).filter(n =>
    n.type === 'system_alert' && n.data?.notification_type === 'pickup_completed' && n.data?.action_required === 'confirm_pickup' && n.data?.role === 'donor' && !n.read_at)
  const directDelivery = (notifications || []).filter(n =>
    n.type === 'system_alert' && (n.data?.notification_type === 'direct_delivery_request' || n.data?.notification_type === 'direct_delivery_update') && !n.read_at)
  const directDeliveryConfirmation = (notifications || []).filter(n =>
    n.type === 'system_alert' && n.data?.notification_type === 'direct_delivery_completed' && n.data?.action_required === 'confirm_direct_delivery' && n.data?.role === 'donor' && !n.read_at)

  return { deliveryConfirmation, pickup, pickupConfirmation, directDelivery, directDeliveryConfirmation }
}

// Main donations list query
export function useMyDonations(userId, options = {}) {
  const queryClient = useQueryClient()

  const donationsQuery = useQuery({
    queryKey: myDonationsKeys.list(userId),
    queryFn: () => db.getDonations({ donor_id: userId, limit: 30 }),
    enabled: !!userId,
    placeholderData: [],
    staleTime: 1000 * 60 * 2,
    ...options,
  })

  // Notifications query
  const notificationsQuery = useQuery({
    queryKey: myDonationsKeys.notifications(userId),
    queryFn: async () => {
      const raw = await db.getUserNotifications(userId, 100)
      return parseNotifications(raw)
    },
    enabled: !!userId,
    placeholderData: {},
    staleTime: 1000 * 30, // 30s for notifications
    ...options,
  })

  // Claims query - depends on donations
  const claimsQuery = useQuery({
    queryKey: myDonationsKeys.claims(userId),
    queryFn: () => fetchDonationClaimsData(donationsQuery.data),
    enabled: !!userId && !!donationsQuery.data,
    placeholderData: {},
    staleTime: 1000 * 60 * 2,
    ...options,
  })

  // Supabase realtime → invalidate on changes
  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`mydonations_tq_${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations', filter: `donor_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: myDonationsKeys.list(userId) })
          queryClient.invalidateQueries({ queryKey: myDonationsKeys.claims(userId) })
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => queryClient.invalidateQueries({ queryKey: myDonationsKeys.notifications(userId) })
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId, queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: myDonationsKeys.all })
  }, [queryClient])

  // isLoading = true only on the very first fetch when no real data exists yet
  // Once the query has succeeded at least once (even with []), we stop showing loading
  const hasLoaded = donationsQuery.status === 'success' || donationsQuery.status === 'error'

  return {
    donations: donationsQuery.data || [],
    isLoading: !hasLoaded,
    isError: donationsQuery.isError,
    error: donationsQuery.error,
    isFetching: donationsQuery.isFetching,
    notifications: notificationsQuery.data || {},
    donationClaims: claimsQuery.data || {},
    refetchAll,
  }
}

// Delete mutation
export function useDeleteMyDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, userId }) => db.deleteDonation(donationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myDonationsKeys.all })
    },
  })
}

// Update mutation
export function useUpdateMyDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donationId, updates, userId }) => db.updateDonation(donationId, updates, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myDonationsKeys.all })
    },
  })
}
