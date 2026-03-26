// Dashboard TanStack Query hook - replaces useState/useEffect data fetching
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const dashboardKeys = {
  all: ['dashboard'],
  data: (userId, role) => [...dashboardKeys.all, 'data', userId, role],
}

// Compute stats from raw data based on role
function computeDashboardData(role, rawData) {
  if (role === 'donor') {
    const { donations = [], events = [], notifications = [] } = rawData
    const totalDonations = donations.length
    const availableDonations = donations.filter(d => d.status === 'available').length
    const inProgressDonations = donations.filter(d => ['matched', 'claimed', 'in_transit'].includes(d.status)).length
    const completedDonations = donations.filter(d => ['delivered', 'completed'].includes(d.status)).length
    const cancelledDonations = donations.filter(d => d.status === 'cancelled').length
    const expiredDonations = donations.filter(d => d.status === 'expired').length
    const totalProcessed = totalDonations - cancelledDonations - expiredDonations
    const completionRate = totalProcessed > 0 ? Math.round((completedDonations / totalProcessed) * 100) : 0

    const categoryMap = {}
    donations.forEach(donation => {
      const category = donation.category || 'Other'
      categoryMap[category] = (categoryMap[category] || 0) + 1
    })
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const pendingActions = (notifications || [])
      .filter(n => !n.read_at && [
        'donation_request', 'volunteer_request', 'delivery_completed',
        'pickup_scheduled', 'pickup_completed',
        'direct_delivery_request', 'direct_delivery_completed'
      ].includes(n.type))
      .slice(0, 5)

    return {
      stats: {
        totalDonations, activeDonations: availableDonations, inProgressDonations,
        completedDonations, cancelledDonations, expiredDonations,
        completedEvents: events.length, completionRate, totalItemsDelivered: completedDonations
      },
      recentActivity: donations.slice(0, 5),
      completedEvents: events || [],
      donations,
      categoryBreakdown,
      pendingActions,
    }
  }

  if (role === 'recipient') {
    const { requests = [], notifications = [], approvedDonationsCount = 0 } = rawData
    const totalRequests = requests.length
    const openRequests = requests.filter(r => r.status === 'open').length
    const fulfilledRequests = requests.filter(r => r.status === 'fulfilled').length
    const closedRequests = requests.filter(r => r.status === 'closed').length
    const totalProcessed = totalRequests - closedRequests
    const fulfillmentRate = totalProcessed > 0 ? Math.round((fulfilledRequests / totalProcessed) * 100) : 0

    const categoryMap = {}
    requests.forEach(request => {
      const category = request.category || 'Other'
      categoryMap[category] = (categoryMap[category] || 0) + 1
    })
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const pendingActions = (notifications || [])
      .filter(n => !n.read_at && [
        'donation_approved', 'delivery_completed', 'pickup_scheduled',
        'pickup_completed', 'direct_delivery_completed', 'rating_reminder'
      ].includes(n.type))
      .slice(0, 5)

    return {
      stats: {
        totalRequests, openRequests, fulfilledRequests, closedRequests,
        fulfillmentRate, approvedDonations: approvedDonationsCount, itemsReceived: fulfilledRequests
      },
      recentActivity: requests.slice(0, 5),
      completedEvents: [],
      donations: requests,
      categoryBreakdown,
      pendingActions,
    }
  }

  if (role === 'admin') {
    const { donationCounts = {}, requestCounts = {}, recentDonations = [], recentRequests = [] } = rawData
    return {
      stats: {
        totalDonations: donationCounts.total || 0,
        totalRequests: requestCounts.total || 0,
        totalUsers: 0,
      },
      recentActivity: [...recentDonations.slice(0, 3), ...recentRequests.slice(0, 2)],
      completedEvents: [],
      donations: [],
      categoryBreakdown: [],
      pendingActions: [],
    }
  }

  return { stats: {}, recentActivity: [], completedEvents: [], donations: [], categoryBreakdown: [], pendingActions: [] }
}

async function fetchDashboardRawData(userId, role) {
  if (role === 'donor') {
    const [donations, events, notifications] = await Promise.all([
      db.getDonations({ donor_id: userId }),
      db.getUserCompletedEvents(userId),
      db.getUserNotifications(userId, 50).catch(() => [])
    ])
    return { donations, events, notifications }
  }

  if (role === 'recipient') {
    const [requests, notifications] = await Promise.all([
      db.getRequests({ requester_id: userId, limit: 100 }),
      db.getUserNotifications(userId, 50).catch(() => [])
    ])

    // Count approved donations from claims
    let approvedDonationsCount = 0
    try {
      const { data: donations, error } = await supabase
        .from('donations')
        .select('id, claims')
        .not('claims', 'is', null)
        .order('created_at', { ascending: false })
        .limit(500)
      if (!error && donations) {
        const validStatuses = new Set(['claimed', 'delivered', 'completed'])
        donations.forEach(donation => {
          if (Array.isArray(donation.claims)) {
            donation.claims.forEach(claim => {
              if (claim.recipient_id === userId && validStatuses.has(claim.status)) {
                approvedDonationsCount++
              }
            })
          }
        })
      }
    } catch (err) {
      console.error('Error loading approved donations count:', err)
    }
    return { requests, notifications, approvedDonationsCount }
  }

  if (role === 'admin') {
    const [donationCounts, requestCounts, recentDonations, recentRequests] = await Promise.all([
      db.getDonationCounts(),
      db.getRequestCounts(),
      db.getDonations({ limit: 10 }),
      db.getRequests({ limit: 10 })
    ])
    return { donationCounts, requestCounts, recentDonations, recentRequests }
  }

  return {}
}

export function useDashboardData(userId, role, options = {}) {
  const queryClient = useQueryClient()

  const emptyDashboard = { stats: {}, recentActivity: [], completedEvents: [], donations: [], categoryBreakdown: [], pendingActions: [] }

  const query = useQuery({
    queryKey: dashboardKeys.data(userId, role),
    queryFn: async () => {
      const rawData = await fetchDashboardRawData(userId, role)
      return computeDashboardData(role, rawData)
    },
    enabled: !!userId && !!role && role !== 'volunteer',
    placeholderData: emptyDashboard,
    staleTime: 1000 * 60 * 2,     // 2 min
    gcTime: 1000 * 60 * 10,       // 10 min
    refetchOnWindowFocus: true,
    ...options,
  })

  // Supabase realtime → auto-invalidate TanStack Query cache
  useEffect(() => {
    if (!supabase || !userId || !role) return

    let channel
    if (role === 'donor') {
      channel = supabase
        .channel(`dashboard_tq_${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'donations', filter: `donor_id=eq.${userId}` },
          () => queryClient.invalidateQueries({ queryKey: dashboardKeys.data(userId, role) })
        )
        .subscribe()
    } else if (role === 'recipient') {
      channel = supabase
        .channel(`dashboard_tq_${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'donation_requests', filter: `requester_id=eq.${userId}` },
          () => queryClient.invalidateQueries({ queryKey: dashboardKeys.data(userId, role) })
        )
        .subscribe()
    }

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [userId, role, queryClient])

  return query
}
