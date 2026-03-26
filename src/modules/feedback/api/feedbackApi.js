// Feedback module API
import { db } from '@/shared/lib/supabase'

export const feedbackApi = {
  // Transaction feedback
  getCompletedTransactionsForFeedback: (userId, sinceDate) => db.getCompletedTransactionsForFeedback(userId, sinceDate),
  hasRecipientProvidedFeedback: (recipientId, deliveryId, claimId, donationId) => db.hasRecipientProvidedFeedback(recipientId, deliveryId, claimId, donationId),
  getFeedbackStatusForTransactions: (recipientId, transactions) => db.getFeedbackStatusForTransactions(recipientId, transactions),
  getUserPerformanceMetrics: (userId) => db.getUserPerformanceMetrics(userId),
  submitFeedback: (data) => db.submitFeedback(data),
  updateUserRating: (userId) => db.updateUserRating(userId),

  // Platform feedback
  submitPlatformFeedback: (data) => db.submitPlatformFeedback(data),
  getAllPlatformFeedback: () => db.getAllPlatformFeedback(),
}

export default feedbackApi
