// Matching module API - wraps matching-related db methods
import { db } from '@/shared/lib/supabase'

export const matchingApi = {
  // Matching operations
  matchNewDonation: (donationId, opts) => db.matchNewDonation(donationId, opts),
  matchNewRequest: (requestId, opts) => db.matchNewRequest(requestId, opts),
  rankOpenRequests: (opts) => db.rankOpenRequests(opts),
  findMatchesForRequest: (requestId, maxResults) => db.findMatchesForRequest(requestId, maxResults),
  findVolunteersForTask: (taskId, taskType, maxResults) => db.findVolunteersForTask(taskId, taskType, maxResults),
  findOptimalMatches: (filters) => db.findOptimalMatches(filters),
  performAutomaticMatching: (donationId, requestId) => db.performAutomaticMatching(donationId, requestId),
  createSmartMatch: (requestId, donationId, volunteerId) => db.createSmartMatch(requestId, donationId, volunteerId),

  // Parameters
  getMatchingParameters: () => db.getMatchingParameters(),
  updateMatchingParameters: (group, updates, userId) => db.updateMatchingParameters(group, updates, userId),

  // Recommendations
  getMatchingRecommendations: (userId, role, limit) => db.getMatchingRecommendations(userId, role, limit),
}

export default matchingApi
