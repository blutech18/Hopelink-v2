import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Package, 
  Clock, 
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Percent,
  ArrowUpRight,
  Star,
  Zap,
  Gauge,
  Info
} from 'lucide-react'
import { useAuth } from '@/modules/auth/AuthContext'
import { useToast } from '@/shared/contexts/ToastContext'
import { db, supabase } from '@/shared/lib/supabase'
import { DashboardSkeleton } from '@/shared/components/ui/Skeleton'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'
import ProfileCompletionPrompt from '@/modules/profile/components/ProfileCompletionPrompt'
import WorkflowGuideModal from '@/shared/components/ui/WorkflowGuideModal'

const VolunteerDashboardPage = () => {
  const { profile, user } = useAuth()
  const { success, error } = useToast()
  const [stats, setStats] = useState({})
  const [recentDeliveries, setRecentDeliveries] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [pendingActions, setPendingActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false)


  const loadVolunteerData = async () => {
    if (!profile) return

    try {
      const [deliveriesData, notifications] = await Promise.all([
        db.getDeliveries({ volunteer_id: profile.id }),
        db.getUserNotifications(profile.id, 50).catch(() => [])
      ])
      
      setDeliveries(deliveriesData || [])
      
      // Calculate comprehensive stats
      const totalDeliveries = deliveriesData.length
      const assignedDeliveries = deliveriesData.filter(d => d.status === 'assigned').length
      const acceptedDeliveries = deliveriesData.filter(d => d.status === 'accepted').length
      const inProgressDeliveries = deliveriesData.filter(d => ['picked_up', 'in_transit'].includes(d.status)).length
      const completedDeliveries = deliveriesData.filter(d => d.status === 'delivered').length
      
      // Calculate completion rate
      const totalProcessed = totalDeliveries
      const completionRate = totalProcessed > 0 ? Math.round((completedDeliveries / totalProcessed) * 100) : 0
      
      // Calculate weekly capacity utilization
      const now = new Date()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
      startOfWeek.setHours(0, 0, 0, 0)
      
      const thisWeekDeliveries = deliveriesData.filter(d => {
        const deliveryDate = new Date(d.created_at || d.assigned_at)
        return deliveryDate >= startOfWeek
      })
      
      const activeThisWeek = thisWeekDeliveries.filter(d => 
        ['assigned', 'accepted', 'picked_up', 'in_transit'].includes(d.status)
      ).length
      
      const maxCapacity = profile?.max_deliveries_per_week || 10
      const capacityUtilization = maxCapacity > 0 ? Math.round((activeThisWeek / maxCapacity) * 100) : 0
      const remainingCapacity = Math.max(0, maxCapacity - activeThisWeek)
      
      // Get pending actions from notifications
      const pending = (notifications || [])
        .filter(n => !n.read_at && [
          'volunteer_approved',
          'volunteer_declined',
          'delivery_assigned'
        ].includes(n.type))
        .slice(0, 5)
      setPendingActions(pending)
      
      setStats({
        totalDeliveries,
        assignedDeliveries,
        acceptedDeliveries,
        inProgressDeliveries,
        completedDeliveries,
        completionRate,
        pendingDeliveries: assignedDeliveries,
        activeThisWeek,
        maxCapacity,
        capacityUtilization,
        remainingCapacity
      })
      setRecentDeliveries(deliveriesData.slice(0, 5))
    } catch (error) {
      console.error('Error loading volunteer data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVolunteerData()

    // Set up real-time subscriptions for live updates
    let deliveriesSubscription
    let notificationsSubscription

    if (supabase && profile?.id) {
      // Subscribe to delivery changes for this volunteer
      deliveriesSubscription = supabase
        .channel('volunteer_deliveries')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deliveries',
            filter: `volunteer_id=eq.${profile.id}`
          },
          () => {
            console.log('🚚 Volunteer delivery change detected')
            loadVolunteerData()
          }
        )
        .subscribe()

      // Subscribe to notifications for this volunteer
      notificationsSubscription = supabase
        .channel('volunteer_notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${profile.id}`
          },
          () => {
            console.log('🔔 Volunteer notification change detected')
          }
        )
        .subscribe()
    }

    // Cleanup subscriptions
    return () => {
      if (deliveriesSubscription) {
        supabase.removeChannel(deliveriesSubscription)
      }
      if (notificationsSubscription) {
        supabase.removeChannel(notificationsSubscription)
      }
    }
  }, [profile])



  if (loading) {
    return <DashboardSkeleton />
  }

  const quickActions = [
    {
      title: 'Available Tasks',
      description: 'Find delivery opportunities',
      icon: Package,
      color: 'bg-blue-500',
      link: '/available-tasks'
    },
    {
      title: 'My Deliveries',
      description: 'Track your deliveries',
      icon: Truck,
      color: 'bg-green-500',
      link: '/my-deliveries'
    },
    {
      title: 'Manage Schedule',
      description: 'Update availability & preferences',
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/volunteer-schedule'
    },
    {
      title: 'Profile Settings',
      description: 'Update volunteer information',
      icon: Users,
      color: 'bg-orange-500',
      link: '/profile'
    }
  ]

  const statsCards = [
    { 
      label: 'Total Deliveries', 
      value: stats.totalDeliveries || 0, 
      icon: Truck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      label: 'Assigned', 
      value: stats.assignedDeliveries || 0, 
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    { 
      label: 'Accepted', 
      value: stats.acceptedDeliveries || 0, 
      icon: CheckCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    { 
      label: 'In Progress', 
      value: stats.inProgressDeliveries || 0, 
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    { 
      label: 'Completed', 
      value: stats.completedDeliveries || 0, 
      icon: Star,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    { 
      label: 'Completion Rate', 
      value: `${stats.completionRate || 0}%`, 
      icon: Percent,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-8 lg:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {profile?.name}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Thank you for helping connect our community through volunteer deliveries.
                </p>
              </div>
              <div className="flex items-center justify-start sm:justify-end flex-shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setShowWorkflowGuide(true)}
                  className="inline-flex items-center justify-center h-8 sm:h-9 px-1 text-blue-600 hover:text-blue-700 transition-colors"
                  title="How the workflow works"
                  aria-label="How the workflow works"
                >
                  <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile Completion Prompt */}
          <ProfileCompletionPrompt />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {statsCards.map((stat) => (
              <div key={stat.label} className="card p-6 border border-gray-200 bg-white rounded-xl shadow-sm hover:border-blue-400 transition-colors">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor || 'bg-blue-50'}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color || 'text-blue-600'}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Capacity Utilization Card */}
            {stats.maxCapacity !== undefined && (
              <div className="card p-6 border border-gray-200 bg-white rounded-xl shadow-sm hover:border-blue-400 transition-colors">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    stats.capacityUtilization >= 90 ? 'bg-red-100' :
                    stats.capacityUtilization >= 75 ? 'bg-orange-100' :
                    stats.capacityUtilization >= 50 ? 'bg-amber-100' :
                    'bg-green-100'
                  }`}>
                    <Gauge className={`h-6 w-6 ${
                      stats.capacityUtilization >= 90 ? 'text-red-600' :
                      stats.capacityUtilization >= 75 ? 'text-orange-600' :
                      stats.capacityUtilization >= 50 ? 'text-blue-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Weekly Capacity</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.activeThisWeek || 0} / {stats.maxCapacity}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.capacityUtilization || 0}% utilized
                    </p>
                  </div>
                </div>
                {/* Capacity Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        stats.capacityUtilization >= 90 ? 'bg-red-500' :
                        stats.capacityUtilization >= 75 ? 'bg-orange-500' :
                        stats.capacityUtilization >= 50 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(stats.capacityUtilization || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
        
      {/* Quick Actions Section */}
      <section className="py-8 lg:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Capacity Warning Banner */}
          {stats.capacityUtilization !== undefined && stats.capacityUtilization >= 75 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl border ${
                stats.capacityUtilization >= 90 ? 'border-red-200 bg-red-50' :
                'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  stats.capacityUtilization >= 90 ? 'text-red-600' : 'text-orange-600'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    stats.capacityUtilization >= 90 ? 'text-red-800' : 'text-orange-800'
                  }`}>
                    {stats.capacityUtilization >= 90 ? 'Capacity Limit Reached!' : 'Approaching Capacity Limit'}
                  </h3>
                  <p className={`text-sm ${
                    stats.capacityUtilization >= 90 ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {stats.capacityUtilization >= 90 ? (
                      <>You've reached your weekly capacity limit of {stats.maxCapacity} deliveries. Complete some deliveries or increase your capacity in <Link to="/volunteer-schedule" className="underline font-medium">Schedule Settings</Link>.</>
                    ) : (
                      <>You're at {stats.capacityUtilization}% of your weekly capacity ({stats.activeThisWeek}/{stats.maxCapacity}). Only {stats.remainingCapacity} delivery{stats.remainingCapacity === 1 ? '' : 's'} remaining this week.</>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all group border border-gray-200 hover:border-blue-400"
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content Grid Section */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          >
            {/* Recent Deliveries */}
            <div className="lg:col-span-2 card p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Deliveries
                </h2>
                <Link to="/my-deliveries" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            {recentDeliveries.length > 0 ? (
              <div className="space-y-3">
                {recentDeliveries.map((delivery, index) => {
                  const getStatusConfig = (status) => {
                    const statusConfig = {
                      assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                      accepted: { label: 'Accepted', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                      picked_up: { label: 'Picked Up', color: 'bg-amber-100 text-gray-700 border-yellow-200' },
                      in_transit: { label: 'In Transit', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200' }
                    }
                    return statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' }
                  }
                  
                  const statusConfig = getStatusConfig(delivery.status)
                  const donationTitle = delivery.claim?.donation?.title || 'Delivery'
                  
                  return (
                    <Link
                      key={index}
                      to="/my-deliveries"
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 transition-all group bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <Truck className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {donationTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          {delivery.claim?.recipient?.name && (
                            <span className="text-xs text-gray-500">
                              To: {delivery.claim.recipient.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(delivery.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700">No deliveries yet</p>
                <p className="text-sm text-gray-500 mt-1">Check out available tasks to get started!</p>
                <Link to="/available-tasks" className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Browse Available Tasks →
                </Link>
              </div>
            )}
          </div>

            {/* Pending Actions */}
            <div className="card p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Pending Actions
              </h2>
              {pendingActions.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 border border-blue-200 rounded text-xs font-semibold text-blue-700">
                  {pendingActions.length}
                </span>
              )}
            </div>
            {pendingActions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {pendingActions.map((action, index) => {
                  const getActionType = (type) => {
                    const types = {
                      volunteer_approved: { label: 'Request Approved', icon: CheckCircle, color: 'text-green-600', link: '/available-tasks' },
                      volunteer_declined: { label: 'Request Declined', icon: XCircle, color: 'text-red-600', link: '/available-tasks' },
                      delivery_assigned: { label: 'New Delivery', icon: Truck, color: 'text-blue-600', link: '/my-deliveries' }
                    }
                    return types[type] || { label: type, icon: Bell, color: 'text-gray-600', link: '#' }
                  }
                  const actionType = getActionType(action.type)
                  const ActionIcon = actionType.icon
                  
                  return (
                    <Link
                      key={index}
                      to={actionType.link}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all group"
                    >
                      <ActionIcon className={`h-5 w-5 ${actionType.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          {actionType.label}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {action.message || action.data?.message || 'Action required'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(action.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-700 text-sm">All caught up!</p>
                <p className="text-xs text-gray-500 mt-1">No pending actions</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Status Distribution and Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Status Distribution */}
          <div className="card p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Status Overview
              </h2>
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            {deliveries.length > 0 ? (
              <div className="space-y-4">
                {[
                  { status: 'assigned', label: 'Assigned', color: 'bg-blue-500', count: stats.assignedDeliveries || 0 },
                  { status: 'accepted', label: 'Accepted', color: 'bg-purple-500', count: stats.acceptedDeliveries || 0 },
                  { status: 'in_progress', label: 'In Progress', color: 'bg-orange-500', count: stats.inProgressDeliveries || 0 },
                  { status: 'delivered', label: 'Delivered', color: 'bg-green-500', count: stats.completedDeliveries || 0 }
                ].map((item, index) => {
                  const total = deliveries.length
                  const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded ${item.color} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.label}</span>
                          <span className="text-sm text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 text-sm">No status data yet</p>
                <p className="text-xs text-gray-500 mt-1">Your delivery statuses will appear here</p>
              </div>
            )}
          </div>

          {/* Impact Metrics */}
          <div className="card p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Your Impact
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Deliveries Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedDeliveries || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-purple-200 bg-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Percent className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completionRate || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Total Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="card p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Quick Insights
              </h2>
              <div className="space-y-4">
                {stats.totalDeliveries === 0 ? (
                  <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold text-gray-900">Get Started!</span> Browse available tasks to start making deliveries and help connect our community.
                    </p>
                  </div>
                ) : (
                  <>
                    {stats.assignedDeliveries > 0 && (
                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                        <p className="text-sm text-blue-700">
                          <span className="font-semibold text-gray-900">{stats.assignedDeliveries}</span> delivery{stats.assignedDeliveries !== 1 ? 'ies' : ''} {stats.assignedDeliveries === 1 ? 'is' : 'are'} assigned and waiting for your acceptance.
                        </p>
                      </div>
                    )}
                    {stats.inProgressDeliveries > 0 && (
                      <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                        <p className="text-sm text-orange-700">
                          <span className="font-semibold text-gray-900">{stats.inProgressDeliveries}</span> delivery{stats.inProgressDeliveries !== 1 ? 'ies' : ''} {stats.inProgressDeliveries === 1 ? 'is' : 'are'} currently in progress.
                        </p>
                      </div>
                    )}
                    {stats.completedDeliveries > 0 && (
                      <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                        <p className="text-sm text-green-700">
                          <span className="font-semibold text-gray-900">Great job!</span> You've successfully completed {stats.completedDeliveries} delivery{stats.completedDeliveries !== 1 ? 'ies' : ''}.
                        </p>
                      </div>
                    )}
                    {stats.completionRate >= 80 && stats.completedDeliveries > 0 && (
                      <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                        <p className="text-sm text-purple-700">
                          <span className="font-semibold text-gray-900">Excellent!</span> Your {stats.completionRate}% completion rate shows your dedication to helping others.
                        </p>
                      </div>
                    )}
                    {pendingActions.length > 0 && (
                      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                        <p className="text-sm text-amber-700">
                          <span className="font-semibold text-gray-900">Action Required:</span> You have {pendingActions.length} pending action{pendingActions.length !== 1 ? 's' : ''} that need your attention.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Guide Modal */}
      <WorkflowGuideModal
        isOpen={showWorkflowGuide}
        onClose={() => setShowWorkflowGuide(false)}
        userRole="volunteer"
      />
    </div>
  )
}

export default VolunteerDashboardPage 