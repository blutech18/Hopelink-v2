import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertCircle, CheckCircle, Clock, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const VerificationRequiredModal = ({ isOpen, onClose, verificationStatus, hasIdUploaded }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const getStatusInfo = () => {
    if (!hasIdUploaded) {
      return {
        icon: AlertCircle,
        title: 'ID Verification Required',
        message: 'To create donation requests, you must complete your ID verification first.',
        description: 'Please upload a valid government-issued ID to verify your identity. This helps ensure the safety and trustworthiness of our community.',
        actionText: 'Complete ID Verification',
        actionColor: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
        statusColor: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-400/30'
      }
    } else if (verificationStatus === 'pending') {
      return {
        icon: Clock,
        title: 'Verification Under Review',
        message: 'Your ID verification is currently being reviewed by our administrators.',
        description: 'Please wait for admin approval before creating donation requests. You will be notified once your verification is complete.',
        actionText: 'View Profile',
        actionColor: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        statusColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-400/30'
      }
    } else if (verificationStatus === 'rejected') {
      return {
        icon: AlertCircle,
        title: 'Verification Rejected',
        message: 'Your ID verification was rejected. Please update your ID documents.',
        description: 'Please review your ID documents and upload a valid, clear government-issued ID. Contact support if you need assistance.',
        actionText: 'Update ID Documents',
        actionColor: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        statusColor: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-400/30'
      }
    } else {
      return {
        icon: AlertCircle,
        title: 'Verification Required',
        message: 'ID verification is required to create donation requests.',
        description: 'Please complete your ID verification in your profile settings.',
        actionText: 'Go to Profile',
        actionColor: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-400/30'
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  const handleAction = () => {
    navigate('/profile#id-verification')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                    <StatusIcon className={`h-6 w-6 ${statusInfo.statusColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{statusInfo.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Verification Required</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className={`p-4 rounded-xl border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
                  <p className="text-gray-900 font-medium mb-2">{statusInfo.message}</p>
                  <p className="text-sm text-gray-600">{statusInfo.description}</p>
                </div>

                {/* Verification Status Indicator */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Current Status</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {!hasIdUploaded && 'No ID uploaded'}
                        {hasIdUploaded && verificationStatus === 'pending' && 'Pending admin review'}
                        {hasIdUploaded && verificationStatus === 'rejected' && 'Verification rejected'}
                        {hasIdUploaded && !verificationStatus && 'Verification not started'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits of Verification */}
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/20">
                  <p className="text-sm font-medium text-green-300 mb-2">Benefits of Verification:</p>
                  <ul className="space-y-1 text-xs text-green-200/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>Create and manage donation requests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>Build trust with donors in the community</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>Access priority matching features</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${statusInfo.actionColor} text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg`}
                  >
                    <span>{statusInfo.actionText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default VerificationRequiredModal

