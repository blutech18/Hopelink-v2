// Donor module API - wraps donation-related db methods
import { db } from '@/shared/lib/supabase'

export const donorApi = {
  // Donations CRUD
  getDonations: (filters) => db.getDonations(filters),
  getDonationById: (id) => db.getDonationById(id),
  createDonation: (donation) => db.createDonation(donation),
  updateDonation: (id, updates, userId) => db.updateDonation(id, updates, userId),
  deleteDonation: (id, userId) => db.deleteDonation(id, userId),
  getAvailableDonations: (filters) => db.getAvailableDonations(filters),
  claimDonation: (donationId, recipientId) => db.claimDonation(donationId, recipientId),
  autoExpireDonations: (retentionDays) => db.autoExpireDonations(retentionDays),

  // Stats & counts
  getDonationCounts: () => db.getDonationCounts(),
  getDonationExpiryStats: () => db.getDonationExpiryStats(),
  getDonorStats: (userId) => db.getDonorStats(userId),
  getUserBadges: (userId) => db.getUserBadges(userId),
}

export default donorApi
