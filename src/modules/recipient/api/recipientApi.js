// Recipient module API - wraps request/claim-related db methods
import { db } from '@/shared/lib/supabase'

export const recipientApi = {
  // Requests CRUD
  getRequests: (filters) => db.getRequests(filters),
  createRequest: (request) => db.createRequest(request),
  updateRequest: (id, updates) => db.updateRequest(id, updates),

  // Donation requests
  createDonationRequest: (data) => db.createDonationRequest(data),
  getUserDonationRequests: (userId) => db.getUserDonationRequests(userId),
  updateDonationRequest: (id, updates) => db.updateDonationRequest(id, updates),
  deleteDonationRequest: (id, userId) => db.deleteDonationRequest(id, userId),

  // Stats
  getRequestCounts: () => db.getRequestCounts(),
}

export default recipientApi
