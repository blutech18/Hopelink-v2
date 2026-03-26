// Events module API - wraps event-related db methods
import { db } from '@/shared/lib/supabase'

export const eventsApi = {
  // Events CRUD
  getEvents: (filters) => db.getEvents(filters),
  getEvent: (eventId) => db.getEvent(eventId),
  createEvent: (data, donationItems) => db.createEvent(data, donationItems),
  updateEvent: (eventId, data, donationItems) => db.updateEvent(eventId, data, donationItems),
  deleteEvent: (eventId) => db.deleteEvent(eventId),

  // Participation
  joinEvent: (eventId, userId) => db.joinEvent(eventId, userId),
  leaveEvent: (eventId, userId) => db.leaveEvent(eventId, userId),
  getEventParticipants: (eventId) => db.getEventParticipants(eventId),
  getUserCompletedEvents: (userId) => db.getUserCompletedEvents(userId),

  // Attendance
  updateAttendance: (eventId, userId, status) => db.updateAttendance(eventId, userId, status),
  bulkUpdateAttendance: (eventId, updates, original) => db.bulkUpdateAttendance(eventId, updates, original),

  // Event bans
  banUserFromEvents: (userId, adminId, reason) => db.banUserFromEvents(userId, adminId, reason),
  unbanUserFromEvents: (userId, adminId) => db.unbanUserFromEvents(userId, adminId),
  resetUserAbsenceCount: (userId, adminId) => db.resetUserAbsenceCount(userId, adminId),
  getBannedUsers: () => db.getBannedUsers(),

  // Stats
  getEventCounts: () => db.getEventCounts(),
}

export default eventsApi
