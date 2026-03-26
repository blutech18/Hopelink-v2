// Volunteer module API - wraps volunteer and delivery-related db methods
import { db } from '@/shared/lib/supabase'

export const volunteerApi = {
  // Volunteer tasks
  getAvailableVolunteerTasks: () => db.getAvailableVolunteerTasks(),
  assignVolunteerToDelivery: (claimId, volunteerId) => db.assignVolunteerToDelivery(claimId, volunteerId),
  getVolunteerStats: (volunteerId) => db.getVolunteerStats(volunteerId),
  getVolunteers: (filters) => db.getVolunteers(filters),

  // Volunteer requests
  createVolunteerRequest: (data) => db.createVolunteerRequest(data),
  getVolunteerRequestStatus: (volunteerId, taskId) => db.getVolunteerRequestStatus(volunteerId, taskId),
  updateVolunteerRequestStatus: (requestId, status, volunteerId) => db.updateVolunteerRequestStatus(requestId, status, volunteerId),
  confirmVolunteerRequest: (notifId, volunteerId, claimId, approved) => db.confirmVolunteerRequest(notifId, volunteerId, claimId, approved),

  // Volunteer ratings
  createVolunteerRating: (data) => db.createVolunteerRating(data),
  getVolunteerRatings: (volunteerId) => db.getVolunteerRatings(volunteerId),

  // Auto-assign
  autoAssignVolunteerForClaim: (claimId) => db.autoAssignVolunteerForClaim(claimId),
  autoAssignTopVolunteerWithAcceptance: (claimId, opts) => db.autoAssignTopVolunteerWithAcceptance(claimId, opts),
  acceptVolunteerAssignment: (claimId, volunteerId) => db.acceptVolunteerAssignment(claimId, volunteerId),
}

export default volunteerApi
