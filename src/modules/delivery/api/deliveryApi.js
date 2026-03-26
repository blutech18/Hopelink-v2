// Delivery module API - wraps delivery-related db methods
import { db } from '@/shared/lib/supabase'

export const deliveryApi = {
  // Deliveries CRUD
  getDeliveries: (filters) => db.getDeliveries(filters),
  createDelivery: (data) => db.createDelivery(data),
  updateDelivery: (id, updates) => db.updateDelivery(id, updates),
  updateDeliveryStatus: (id, status, volunteerId, additionalData) => db.updateDeliveryStatus(id, status, volunteerId, additionalData),
  deleteDelivery: (id) => db.deleteDelivery(id),

  // Delivery confirmations
  createDeliveryConfirmationRequest: (deliveryId, volunteerId) => db.createDeliveryConfirmationRequest(deliveryId, volunteerId),
  confirmDeliveryByUser: (deliveryId, userId, userRole, confirmed, rating, feedback) => db.confirmDeliveryByUser(deliveryId, userId, userRole, confirmed, rating, feedback),
  confirmReceipt: (deliveryId, recipientId, confirmed, rating, feedback) => db.confirmReceipt(deliveryId, recipientId, confirmed, rating, feedback),
  confirmDonorDelivery: (deliveryId, donorId, confirmed, rating, feedback) => db.confirmDonorDelivery(deliveryId, donorId, confirmed, rating, feedback),
  completeTransaction: (deliveryId, delivery) => db.completeTransaction(deliveryId, delivery),
  getDeliveryConfirmations: (deliveryId) => db.getDeliveryConfirmations(deliveryId),

  // Pickup
  updatePickupStatus: (claimId, userId, status, notes) => db.updatePickupStatus(claimId, userId, status, notes),
  createPickupCompletionRequest: (claimId, completedByUserId) => db.createPickupCompletionRequest(claimId, completedByUserId),
  confirmPickupCompletion: (claimId, userId, confirmed, rating, feedback) => db.confirmPickupCompletion(claimId, userId, confirmed, rating, feedback),

  // Direct delivery
  updateDirectDeliveryStatus: (claimId, userId, status, addr, instructions, notes) => db.updateDirectDeliveryStatus(claimId, userId, status, addr, instructions, notes),
  createDirectDeliveryCompletionRequest: (claimId, userId) => db.createDirectDeliveryCompletionRequest(claimId, userId),
  confirmDirectDeliveryCompletion: (claimId, userId, confirmed, rating, feedback) => db.confirmDirectDeliveryCompletion(claimId, userId, confirmed, rating, feedback),

  // Location tracking
  updateDeliveryLocation: (deliveryId, location, volunteerId) => db.updateDeliveryLocation(deliveryId, location, volunteerId),
  getDeliveryLocationHistory: (deliveryId) => db.getDeliveryLocationHistory(deliveryId),
  logDeliveryLocation: (deliveryId, location, volunteerId) => db.logDeliveryLocation(deliveryId, location, volunteerId),
  getVolunteerDeliveriesWithLocation: (volunteerId, status) => db.getVolunteerDeliveriesWithLocation(volunteerId, status),

  // Stats
  getDeliveryCounts: () => db.getDeliveryCounts(),
}

export default deliveryApi
