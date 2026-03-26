import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Users, Heart, TrendingUp, Sparkles, Clock } from 'lucide-react'

const ValueCalculator = ({ userRole = 'donor' }) => {
  const [donationValue, setDonationValue] = useState(500)
  const [itemCount, setItemCount] = useState(1)
  const [category, setCategory] = useState('food')

  const categoryMultipliers = {
    food: { families: 3, impact: 'feeds', icon: '🍽️' },
    clothing: { families: 2, impact: 'clothes', icon: '👕' },
    furniture: { families: 1, impact: 'furnishes', icon: '🪑' },
    electronics: { families: 1, impact: 'enables', icon: '📱' },
    books: { families: 4, impact: 'educates', icon: '📚' },
    toys: { families: 2, impact: 'brings joy to', icon: '🧸' },
    medical: { families: 1, impact: 'supports health for', icon: '💊' },
    other: { families: 2, impact: 'helps', icon: '📦' }
  }

  const calculateImpact = () => {
    const multiplier = categoryMultipliers[category]
    const familiesHelped = Math.floor(itemCount * multiplier.families)
    const peopleHelped = familiesHelped * 4 // Average family size
    const timeSaved = itemCount * 2 // Hours saved per item
    const communityValue = donationValue * 1.5 // Economic multiplier
    
    return {
      familiesHelped,
      peopleHelped,
      timeSaved,
      communityValue,
      impact: multiplier.impact,
      icon: multiplier.icon
    }
  }

  const impact = calculateImpact()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-navy-800/90 to-navy-900/90 rounded-xl p-6 border-2 border-amber-200 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calculator className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Impact Calculator</h3>
          <p className="text-sm text-gray-600/80">See the value of your contribution</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Item Count Input */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Number of Items
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={itemCount}
            onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(categoryMultipliers).map(([key, value]) => (
              <option key={key} value={key}>
                {value.icon} {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Value (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Estimated Value (PHP)
          </label>
          <input
            type="number"
            min="0"
            value={donationValue}
            onChange={(e) => setDonationValue(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Impact Results */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 rounded-xl p-6 border border-amber-200"
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{impact.icon}</div>
          <p className="text-lg text-gray-600 font-medium">
            Your donation {impact.impact} <span className="text-blue-500 font-bold text-xl">{impact.familiesHelped}</span> {impact.familiesHelped === 1 ? 'family' : 'families'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50/50 rounded-lg p-4 text-center border border-gray-200/50">
            <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{impact.peopleHelped}</p>
            <p className="text-xs text-gray-600/80 mt-1">People Helped</p>
          </div>
          
          <div className="bg-gray-50/50 rounded-lg p-4 text-center border border-gray-200/50">
            <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{impact.timeSaved}</p>
            <p className="text-xs text-gray-600/80 mt-1">Hours Saved</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-yellow-400/20">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm font-medium">
              Community Value: ₱{impact.communityValue.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600/70">
          * Estimates based on average family size and community impact multipliers
        </p>
      </div>
    </motion.div>
  )
}

export default ValueCalculator

