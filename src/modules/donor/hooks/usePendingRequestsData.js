// PendingRequests TanStack Query hook — cached donation & volunteer request notifications
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { db, supabase } from '@/shared/lib/supabase'

export const pendingRequestsKeys = {
  all: ['pendingRequests'],
  donations: (userId) => [...pendingRequestsKeys.all, 'donations', userId],
  volunteers: (userId) => [...pendingRequestsKeys.all, 'volunteers', userId],
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const isValidUUID = (id) => typeof id === 'string' && id.length === 36 && UUID_RE.test(id)

/** Batch-fetch donations with donor info */
async function fetchDonationsMap(donationIds) {
  const valid = donationIds.filter(isValidUUID)
  if (!valid.length) return new Map()

  let q = supabase.from('donations').select('*')
  q = valid.length === 1 ? q.eq('id', valid[0]) : q.in('id', valid)
  const { data: donations, error } = await q
  if (error || !donations?.length) return new Map()

  // Fetch donors
  const donorIds = [...new Set(donations.map(d => d.donor_id).filter(isValidUUID))]
  let donorsMap = new Map()
  if (donorIds.length) {
    let dq = supabase.from('users').select('id, name, email, profile_image_url, latitude, longitude')
    dq = donorIds.length === 1 ? dq.eq('id', donorIds[0]) : dq.in('id', donorIds)
    const { data: donors } = await dq
    if (donors) donorsMap = new Map(donors.map(d => [d.id, d]))
  }

  const map = new Map()
  donations.forEach(d => {
    if (donorsMap.has(d.donor_id)) d.donor = donorsMap.get(d.donor_id)
    map.set(d.id, d)
  })
  return map
}

/** Batch-fetch profiles */
async function fetchProfilesMap(ids) {
  const valid = ids.filter(isValidUUID)
  const map = new Map()
  if (!valid.length) return map

  const batchSize = 5
  for (let i = 0; i < valid.length; i += batchSize) {
    const batch = valid.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async (id) => {
        try {
          const profile = await db.getProfile(id)
          if (profile) map.set(id, profile)
        } catch { /* skip */ }
      })
    )
  }
  return map
}

// ─── main fetch ───────────────────────────────────────────────────────────────

async function fetchPendingRequests(userId) {
  // 1. Get raw notifications -------------------------------------------------
  const [allNotifications, volQuery, donQuery] = await Promise.all([
    db.getUserNotifications(userId, 100),
    supabase.from('notifications').select('*')
      .eq('user_id', userId).eq('type', 'volunteer_request')
      .is('read_at', null).order('created_at', { ascending: false }).limit(50),
    supabase.from('notifications').select('*')
      .eq('user_id', userId).eq('type', 'donation_request')
      .order('created_at', { ascending: false }).limit(50),
  ])

  const donNotifs = (!donQuery.error && donQuery.data) ? donQuery.data
    : allNotifications.filter(n => n.type === 'donation_request')
  const volNotifs = (!volQuery.error && volQuery.data) ? volQuery.data
    : allNotifications.filter(n => n.type === 'volunteer_request' && !n.read_at)

  // 2. Collect IDs for batch enrichment --------------------------------------
  const donationIds = new Set()
  const requesterIds = new Set()
  const volunteerIds = new Set()

  donNotifs.forEach(r => {
    if (r.data?.donation_id) donationIds.add(r.data.donation_id)
    if (r.data?.requester_id) requesterIds.add(r.data.requester_id)
  })
  volNotifs.forEach(r => {
    if (r.data?.donation_id) donationIds.add(r.data.donation_id)
    if (r.data?.volunteer_id) volunteerIds.add(r.data.volunteer_id)
  })

  // 3. Batch fetch -----------------------------------------------------------
  const [donationsMap, requesterProfilesMap, volunteerProfilesMap] = await Promise.all([
    fetchDonationsMap([...donationIds]),
    fetchProfilesMap([...requesterIds]),
    fetchProfilesMap([...volunteerIds]),
  ])

  // 4. Enrich & filter donation requests -------------------------------------
  const shouldFilter = (donation) => {
    if (!donation) return false
    const claims = Array.isArray(donation.claims) ? donation.claims : []
    const hasClaimed = claims.some(c => c.status === 'claimed')
    return hasClaimed && donation.delivery_mode !== 'pickup'
  }

  const enrichedDonations = donNotifs
    .map(r => {
      const donation = donationsMap.get(r.data?.donation_id) || null
      const rp = r.data?.requester_id ? requesterProfilesMap.get(r.data.requester_id) : null
      return {
        ...r,
        donation,
        requesterProfile: rp || null,
        data: {
          ...r.data,
          requester_email: rp?.email || r.data?.requester_email,
          requester_phone: rp?.phone_number || r.data?.requester_phone,
          requester_address: rp?.address || r.data?.requester_address,
          requester_address_street: rp?.address_street,
          requester_address_barangay: rp?.address_barangay,
          requester_address_landmark: rp?.address_landmark,
          requester_city: rp?.city,
          requester_province: rp?.province,
          requester_zip_code: rp?.zip_code,
        },
      }
    })
    .filter(r => !shouldFilter(r.donation))
    .filter(r => {
      if (!r.read_at) return true
      const don = r.donation
      if (!don || don.delivery_mode !== 'pickup') return false
      const claims = Array.isArray(don.claims) ? don.claims : []
      return !claims.some(c => c.status === 'completed')
    })

  // 5. Enrich volunteer requests ---------------------------------------------
  const enrichedVolunteers = volNotifs.map(r => {
    const donation = donationsMap.get(r.data?.donation_id) || null
    const vp = r.data?.volunteer_id ? volunteerProfilesMap.get(r.data.volunteer_id) : null
    return {
      ...r,
      donation,
      volunteerProfile: vp || null,
      data: {
        ...r.data,
        volunteer_email: vp?.email || r.data?.volunteer_email,
        volunteer_phone: vp?.phone_number || r.data?.volunteer_phone,
        volunteer_address_street: vp?.address_street,
        volunteer_address_barangay: vp?.address_barangay,
        volunteer_address_landmark: vp?.address_landmark,
        volunteer_city: vp?.city,
        volunteer_province: vp?.province,
        volunteer_zip_code: vp?.zip_code,
      },
    }
  })

  return { donationRequests: enrichedDonations, volunteerRequests: enrichedVolunteers }
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function usePendingRequests(userId, options = {}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: pendingRequestsKeys.donations(userId),
    queryFn: () => fetchPendingRequests(userId),
    enabled: !!userId,
    placeholderData: { donationRequests: [], volunteerRequests: [] },
    staleTime: 1000 * 30,          // 30s
    gcTime: 1000 * 60 * 5,         // 5 min
    refetchOnWindowFocus: true,
    ...options,
  })

  // Supabase realtime → auto-invalidate on notification changes
  useEffect(() => {
    if (!supabase || !userId) return
    const channel = supabase
      .channel(`pendingrequests_tq_${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => queryClient.invalidateQueries({ queryKey: pendingRequestsKeys.all })
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        () => queryClient.invalidateQueries({ queryKey: pendingRequestsKeys.all })
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId, queryClient])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: pendingRequestsKeys.all })
  }, [queryClient])

  // isLoading = true only on the very first fetch before any real data arrives
  const hasLoaded = query.status === 'success' || query.status === 'error'

  return {
    donationRequests: query.data?.donationRequests || [],
    volunteerRequests: query.data?.volunteerRequests || [],
    isLoading: !hasLoaded,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetchAll,
  }
}
