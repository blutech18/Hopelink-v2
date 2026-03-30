import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, MessageSquare, Gift, Heart, Truck } from 'lucide-react'
import { useAuth } from '../../modules/auth/AuthContext'
import { useToast } from '../../shared/contexts/ToastContext'
import { db } from '../../lib/supabase'
import LoadingSpinner from './LoadingSpinner'

const FeedbackModal = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth()
  const { success, error } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [roleSpecificAnswers, setRoleSpecificAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Role-specific questions
  const getRoleQuestions = () => {
    if (profile?.role === 'donor') {
      return [
        { id: 'ease_of_posting', label: 'How easy was it to post your donation?', type: 'rating' },
        { id: 'matching_quality', label: 'Were you matched with appropriate recipients?', type: 'rating' },
        { id: 'communication', label: 'How was the communication with recipients?', type: 'rating' }
      ]
    } else if (profile?.role === 'recipient') {
      return [
        { id: 'ease_of_requesting', label: 'How easy was it to request items?', type: 'rating' },
        { id: 'item_quality', label: 'Were the donated items helpful and in good condition?', type: 'rating' },
        { id: 'delivery_experience', label: 'How was your delivery/pickup experience?', type: 'rating' }
      ]
    } else if (profile?.role === 'volunteer') {
      return [
        { id: 'task_clarity', label: 'Were delivery tasks clear and well-organized?', type: 'rating' },
        { id: 'route_efficiency', label: 'How efficient were the delivery routes?', type: 'rating' },
        { id: 'support', label: 'Did you receive adequate support from the platform?', type: 'rating' }
      ]
    }
    return []
  }

  const getRoleIcon = () => {
    if (profile?.role === 'donor') return Gift
    if (profile?.role === 'recipient') return Heart
    if (profile?.role === 'volunteer') return Truck
    return MessageSquare
  }

  const getRoleTitle = () => {
    if (profile?.role === 'donor') return 'Donor Feedback'
    if (profile?.role === 'recipient') return 'Recipient Feedback'
    if (profile?.role === 'volunteer') return 'Volunteer Feedback'
    return 'Platform Feedback'
  }

  const getRoleDescription = () => {
    if (profile?.role === 'donor') return 'Share your donation experience'
    if (profile?.role === 'recipient') return 'Tell us about receiving donations'
    if (profile?.role === 'volunteer') return 'Share your delivery experience'
    return 'Share your experience with HopeLink'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      error('Please select a rating')
      return
    }

    if (!feedbackText.trim()) {
      error('Please provide your feedback')
      return
    }

    try {
      setSubmitting(true)

      // Submit role-specific platform feedback
      const feedbackData = {
        user_id: user.id,
        user_role: profile?.role,
        rating: rating,
        feedback: feedbackText.trim(),
        role_specific_answers: roleSpecificAnswers,
        feedback_type: profile?.role || 'platform',
        created_at: new Date().toISOString()
      }

      await db.submitPlatformFeedback(feedbackData)

      success('Thank you for your feedback!')
      setRating(0)
      setFeedbackText('')
      setRoleSpecificAnswers({})
      onClose()
    } catch (err) {
      console.error('Error submitting feedback:', err)
      error('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Excellent'
    if (rating === 4) return 'Good'
    if (rating === 3) return 'Average'
    if (rating === 2) return 'Poor'
    if (rating === 1) return 'Very Poor'
    return 'Select Rating'
  }

  if (!isOpen) return null

  const RoleIcon = getRoleIcon()
  const roleQuestions = getRoleQuestions()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[120] p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-gray-200 shadow-2xl rounded-lg sm:rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <RoleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">{getRoleTitle()}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">{getRoleDescription()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 ml-2"
              aria-label="Close feedback modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Overall Rating */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-3 sm:mb-4 text-center">
                  Overall Experience Rating *
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all hover:scale-110 sm:hover:scale-125 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-0.5 sm:p-1 active:scale-95"
                    >
                      <Star
                        className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                            : 'text-gray-600 hover:text-gray-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs sm:text-sm font-semibold text-gray-700">
                  {getRatingLabel(hoveredRating || rating)}
                </p>
              </div>

              {/* Role-Specific Questions */}
              {roleQuestions.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-5 border border-gray-100 space-y-3 sm:space-y-5">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 text-center border-b border-gray-200 pb-2 sm:pb-3">
                    {profile?.role === 'donor' && '📦 Donation Experience Details'}
                    {profile?.role === 'recipient' && '🎁 Receiving Experience Details'}
                    {profile?.role === 'volunteer' && '🚚 Delivery Experience Details'}
                  </h4>
                  {roleQuestions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                      <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-2 sm:mb-3">
                        {index + 1}. {question.label}
                      </label>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRoleSpecificAnswers({
                              ...roleSpecificAnswers,
                              [question.id]: star
                            })}
                            className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-full p-0.5 active:scale-95"
                          >
                            <Star
                              className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${
                                star <= (roleSpecificAnswers[question.id] || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-600 hover:text-gray-500'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2">
                        {roleSpecificAnswers[question.id] 
                          ? `Rating: ${roleSpecificAnswers[question.id]}/5` 
                          : 'Tap to rate'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback Text */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Tell us about your experience *
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  maxLength={500}
                  className="input h-28 sm:h-32 resize-none text-sm"
                  placeholder="What did you like? What could we improve? Any suggestions?"
                  required
                />
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  {feedbackText.length} / 500 characters
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-blue-700 text-[10px] sm:text-xs leading-relaxed">
                  💡 Your feedback helps us improve HopeLink for everyone. Thank you for taking the time to share your thoughts!
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClose}
              type="button"
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm sm:text-base font-medium border border-gray-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={submitting || rating === 0 || !feedbackText.trim()}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default FeedbackModal
