import React from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Sparkles, 
  Heart, 
  Truck, 
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react'

const WorkflowProgressBar = ({ 
  status, 
  currentStep = null, 
  showLabels = true, 
  showStatusInfo = true,
  size = 'md',
  orientation = 'horizontal' 
}) => {
  // Define workflow steps
  const workflowSteps = [
    {
      id: 'available',
      label: 'Available',
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-500/20',
      borderColor: 'border-blue-600 dark:border-blue-400',
      description: 'Donation is posted and available for matching'
    },
    {
      id: 'matched',
      label: 'Matched',
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-500/20',
      borderColor: 'border-purple-600 dark:border-purple-400',
      description: 'Matched with recipient through smart algorithm'
    },
    {
      id: 'claimed',
      label: 'Claimed',
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-500/20',
      borderColor: 'border-pink-600 dark:border-pink-400',
      description: 'Recipient has claimed the donation'
    },
    {
      id: 'in_transit',
      label: 'In Transit',
      icon: Truck,
      color: 'text-amber-600 dark:text-yellow-400',
      bgColor: 'bg-amber-100 dark:bg-yellow-500/20',
      borderColor: 'border-amber-600 dark:border-yellow-400',
      description: 'Volunteer is delivering to recipient'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-500/20',
      borderColor: 'border-green-600 dark:border-green-400',
      description: 'Donation has been delivered'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-500/20',
      borderColor: 'border-emerald-600 dark:border-emerald-400',
      description: 'Transaction completed and confirmed'
    }
  ]

  // Map status to step index
  const getStatusIndex = (status) => {
    const statusMap = {
      'available': 0,
      'matched': 1,
      'claimed': 2,
      'in_transit': 3,
      'delivered': 4,
      'completed': 5
    }
    return statusMap[status] ?? 0
  }

  const currentIndex = currentStep !== null ? currentStep : getStatusIndex(status)
  const activeIndex = Math.min(currentIndex, workflowSteps.length - 1)

  const sizeClasses = {
    sm: {
      icon: 'h-4 w-4',
      text: 'text-[10px]',
      container: 'gap-1',
      stepGap: 'gap-0.5'
    },
    md: {
      icon: 'h-6 w-6',
      text: 'text-sm',
      container: 'gap-3',
      stepGap: 'gap-2'
    },
    lg: {
      icon: 'h-7 w-7',
      text: 'text-base',
      container: 'gap-4',
      stepGap: 'gap-3'
    }
  }

  const classes = sizeClasses[size]

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${classes.container}`}>
        {workflowSteps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index <= activeIndex
          const isCurrent = index === activeIndex
          const isCompleted = index < activeIndex

          return (
            <div key={step.id} className="flex items-start gap-3">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted 
                      ? 'rgba(34, 197, 94, 0.2)' 
                      : isCurrent 
                      ? 'rgba(250, 204, 21, 0.2)' 
                      : 'rgba(51, 65, 85, 0.2)',
                    borderColor: isCompleted 
                      ? 'rgb(34, 197, 94)' 
                      : isCurrent 
                      ? 'rgb(250, 204, 21)' 
                      : 'rgb(51, 65, 85)'
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${step.bgColor} ${step.borderColor}`}
                >
                  <StepIcon className={`${classes.icon} ${isActive ? step.color : 'text-gray-500'}`} />
                </motion.div>
                
                {/* Connector Line */}
                {index < workflowSteps.length - 1 && (
                  <div 
                    className={`w-0.5 flex-1 mt-2 transition-all ${
                      index < activeIndex ? 'bg-green-400' : 'bg-white/30'
                    }`}
                    style={{ minHeight: '40px' }}
                  />
                )}
              </div>

              {/* Step Info (label only – detailed text shown in Current Status section) */}
              <div className="flex-1 pt-1">
                <div className={`font-semibold ${classes.text} ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {step.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className="w-full">
      <div className={`flex items-center ${classes.container} relative`}>
        {workflowSteps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index <= activeIndex
          const isCurrent = index === activeIndex
          const isCompleted = index < activeIndex

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1 relative z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-green-100 dark:bg-green-500/20 border-green-600 dark:border-green-400 shadow-lg shadow-green-400/30' 
                      : isCurrent 
                      ? `${step.bgColor} ${step.borderColor} shadow-xl shadow-amber-400/60 dark:shadow-yellow-400/60` 
                      : 'bg-gray-100 dark:bg-white/20 border-gray-400 dark:border-white/40'
                  }`}
                >
                  <StepIcon className={`${classes.icon} ${isActive ? step.color : 'text-gray-500 dark:text-white'}`} />
                  {isCurrent && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border-2 border-amber-500 dark:border-yellow-400 opacity-80"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
                        className="absolute inset-0 rounded-full border-2 border-amber-600 dark:border-yellow-500 opacity-60"
                      />
                    </>
                  )}
                </motion.div>

                {/* Label (no per-step description – description appears in Current Status only) */}
                {showLabels && (
                <div className="mt-1.5 text-center">
                    <div className={`font-medium ${classes.text} ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {step.label}
                    </div>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < workflowSteps.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 relative -mx-1 sm:-mx-1.5 ${
                    index < activeIndex ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-300 dark:bg-white/30'
                  }`}
                >
                  {index < activeIndex && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-green-600 dark:bg-green-400"
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Current Status Info */}
      {showStatusInfo && workflowSteps[activeIndex] && (() => {
        const CurrentIcon = workflowSteps[activeIndex].icon
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border-2 ${workflowSteps[activeIndex].bgColor} ${workflowSteps[activeIndex].borderColor}`}
          >
            <div className="flex items-center gap-3">
              <CurrentIcon className={`${classes.icon} ${workflowSteps[activeIndex].color}`} />
              <div>
                <div className={`font-semibold ${classes.text} text-gray-900 dark:text-white`}>
                  Current Status: {workflowSteps[activeIndex].label}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                  {workflowSteps[activeIndex].description}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })()}
    </div>
  )
}

export default WorkflowProgressBar


