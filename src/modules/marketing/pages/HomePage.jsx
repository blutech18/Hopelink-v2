import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  Users,
  Truck,
  Gift,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Calendar,
  Info,
  MapPin,
  Phone,
  Mail,
  Clock,
  UserPlus,
  Facebook,
  Download,
  X,
  Star,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDown,
  Activity,
  Search,
  Package,
  UserCheck,
  Navigation,
  BookOpen,
  Home,
  BarChart3,
  Bell,
  FileText,
  Building,
  Edit3,
  Eye,
  TrendingUp,
  Award,
  BellRing,
  User,
  Settings,
  Target,
  HelpCircle
} from 'lucide-react'
import { db } from '@/shared/lib/supabase'
import { useToast } from '@/shared/contexts/ToastContext'
import { useAuth } from '@/modules/auth/AuthContext'

// Shared constants
const DARK_BLUE = '#210976'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { error } = useToast()
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [activeRole, setActiveRole] = useState('donor')

  const paymentMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      logo: '/gcashlogo.png',
      description: 'Scan to donate via GCash',
      qrCode: '/qrplaceholder.png',
      account: 'HopeLink Foundation',
      accountNumber: '09123456789',
      color: 'blue'
    },
    {
      id: 'bpi',
      name: 'BPI',
      logo: '/bpilogo.png',
      description: 'Scan to donate via BPI',
      qrCode: '/qrplaceholder.png',
      account: 'HopeLink Foundation',
      accountNumber: '1234-5678-90',
      color: 'red'
    },
    {
      id: 'bdo',
      name: 'BDO',
      logo: '/bdologo.jpg',
      description: 'Scan to donate via BDO',
      qrCode: '/qrplaceholder.png',
      account: 'HopeLink Foundation',
      accountNumber: '0987-6543-21',
      color: 'blue'
    }
  ]

  const handlePaymentClick = (method) => {
    setSelectedPayment(method)
    setShowQRModal(true)
  }

  const handleDownloadQR = () => {
    if (!selectedPayment) return
    const link = document.createElement('a')
    link.href = selectedPayment.qrCode
    link.download = `${selectedPayment.name}-QR-Code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const features = [
    {
      icon: Gift,
      title: 'Seamless Donations',
      description: 'Post and track your donations with ease. Directly impact the lives of those in need in your local community.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      icon: Heart,
      title: 'Fulfill Requests',
      description: 'Browse verified requests from your neighbors and provide exactly what they need when they need it most.',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    {
      icon: Truck,
      title: 'Volunteer Delivery',
      description: 'Join our dedicated delivery fleet to transport goods safely from donors directly to recipients.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      icon: Users,
      title: 'Community Events',
      description: 'Engage in local events, outreach programs, and collective giving initiatives to build a stronger community.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '50K+', label: 'Donations Made', icon: Gift },
    { value: '500+', label: 'Volunteers', icon: Shield },
    { value: '100+', label: 'Communities', icon: MapPin },
  ]

  // How It Works workflow steps
  const workflowSteps = {
    donor: [
      { step: 1, title: 'Post Your Donation', description: 'Create a donation listing with photos, description, and delivery preferences.', icon: Gift, color: 'text-blue-400', bgColor: 'bg-blue-500/20', value: 'Your donation will help families in your community.' },
      { step: 2, title: 'Smart Matching', description: 'Our algorithm matches your donation with recipients based on location, need, and urgency.', icon: Sparkles, color: 'text-purple-400', bgColor: 'bg-purple-500/20', value: 'Each match ensures your donation reaches those who need it most.' },
      { step: 3, title: 'Recipient Claims', description: 'Matched recipients can claim your donation. You\'ll receive notifications.', icon: Heart, color: 'text-pink-400', bgColor: 'bg-pink-500/20', value: 'See the impact of your donation in your area.' },
      { step: 4, title: 'Volunteer Delivery', description: 'A verified volunteer picks up and delivers your donation safely.', icon: Truck, color: 'text-green-400', bgColor: 'bg-green-500/20', value: 'Track delivery in real-time and receive confirmation.' },
      { step: 5, title: 'Completion & Feedback', description: 'Once delivered and confirmed, the transaction is complete.', icon: CheckCircle2, color: 'text-blue-500', bgColor: 'bg-blue-50', value: 'Your generosity creates lasting positive impact.' }
    ],
    recipient: [
      { step: 1, title: 'Create a Request', description: 'Post what you need with details about urgency and quantity.', icon: Package, color: 'text-pink-400', bgColor: 'bg-pink-500/20', value: 'Verified recipients get priority matching with donors.' },
      { step: 2, title: 'Browse Donations', description: 'Search and browse donations that match your needs.', icon: Search, color: 'text-blue-400', bgColor: 'bg-blue-500/20', value: 'Find donations from verified donors in your community.' },
      { step: 3, title: 'Claim a Donation', description: 'Claim a donation that matches your request.', icon: Heart, color: 'text-red-400', bgColor: 'bg-red-500/20', value: 'Your request helps donors understand community needs.' },
      { step: 4, title: 'Receive Delivery', description: 'A volunteer will deliver your donation. Track and confirm receipt.', icon: Truck, color: 'text-green-400', bgColor: 'bg-green-500/20', value: 'Safe, verified delivery directly to your location.' },
      { step: 5, title: 'Confirm & Thank', description: 'Confirm receipt and provide feedback.', icon: CheckCircle2, color: 'text-blue-500', bgColor: 'bg-blue-50', value: 'Your feedback helps build trust and improve the community.' }
    ],
    volunteer: [
      { step: 1, title: 'Complete Profile', description: 'Set up your volunteer profile with availability and vehicle type.', icon: UserCheck, color: 'text-green-400', bgColor: 'bg-green-500/20', value: 'Verified volunteers are trusted by donors and recipients.' },
      { step: 2, title: 'Browse Tasks', description: 'View delivery tasks in your area with pickup and delivery locations.', icon: Search, color: 'text-blue-400', bgColor: 'bg-blue-500/20', value: 'Help connect donors with recipients in your community.' },
      { step: 3, title: 'Accept Task', description: 'Accept a delivery task that fits your schedule and capacity.', icon: CheckCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/20', value: 'Your delivery helps families receive essential resources.' },
      { step: 4, title: 'Pick Up & Deliver', description: 'Pick up the donation from the donor and deliver it to the recipient.', icon: Navigation, color: 'text-blue-500', bgColor: 'bg-blue-50', value: 'Track your route and provide real-time updates.' },
      { step: 5, title: 'Complete & Rate', description: 'Mark delivery as complete and provide feedback.', icon: Star, color: 'text-orange-400', bgColor: 'bg-orange-500/20', value: 'Your service creates meaningful connections.' }
    ]
  }

  const currentSteps = workflowSteps[activeRole]

  // Fetch upcoming events from database
  const fetchUpcomingEvents = async () => {
    try {
      setLoadingEvents(true)

      const allEvents = await db.getEvents()

      const upcoming = (allEvents || [])
        .filter(event => {
          const eventDate = new Date(event.start_date)
          const today = new Date()
          return event.status === 'active' || event.status === 'upcoming' || eventDate >= today
        })
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 4)

      setUpcomingEvents(upcoming)
    } catch (err) {
      console.error('Error fetching events:', err)
      error('Failed to load upcoming events')
      setUpcomingEvents([])
    } finally {
      setLoadingEvents(false)
    }
  }

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO
       ═══════════════════════════════════════════════════════════ */}
      <section id="home" className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-white to-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[120px]" />
          <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] rounded-full bg-yellow-300/20 blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 leading-[1.1]">
                Bridge the Gap with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400" style={{ backgroundImage: `linear-gradient(to right, ${DARK_BLUE}, #3b82f6)` }}>HopeLink</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                Join our ecosystem of donors, volunteers, and recipients. Share resources, lend a hand, and make a lasting impact in your local community today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-300 hover:-translate-y-1 bg-logoBlue"
                >
                  Start Making an Impact
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works')
                    if (el) {
                      const navbarHeight = 70
                      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navbarHeight, behavior: 'smooth' })
                    }
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer"
                >
                  See How It Works
                </button>
              </div>

            </motion.div>

            {/* Image Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative lg:ml-auto w-full mx-auto lg:mx-0 lg:max-w-[700px]"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl ring-1 ring-gray-900/5 group">
                <img
                  src="/landingIMG.jpg"
                  alt="HopeLink Community"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000f3d]/80 via-[#000f3d]/20 to-transparent"></div>
                
                {/* Image Overlay Text */}
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white font-semibold text-lg drop-shadow-md">
                    "Small acts, when multiplied by millions of people, can transform the world."
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PARTNERS LOGO STRIP (hidden until logos are added)
       ═══════════════════════════════════════════════════════════ */}
      {/* 
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16">
            <img src="/partner1.png" alt="Partner 1" className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
            <img src="/partner2.png" alt="Partner 2" className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
            <img src="/partner3.png" alt="Partner 3" className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
            <img src="/partner4.png" alt="Partner 4" className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </section>
      */}


      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — UPCOMING EVENTS
       ═══════════════════════════════════════════════════════════ */}
      <section id="events" className="py-24 lg:py-32 relative bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
                Upcoming Events
              </h2>
              <p className="text-lg text-gray-600 mt-4">Join the movement and make an impact in your community.</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:text-gray-600 transition-colors group"
            >
              View All Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm animate-pulse">
                  <div className="h-8 bg-gray-200 rounded-xl w-2/3 mb-6"></div>
                  <div className="space-y-4 mb-8">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-2xl w-full"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-blue-100">
                      {event.target_goal || 'Community'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-8 line-clamp-2 text-lg flex-1">{event.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase">Location</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {event.location || event.address || 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id || ''}`}
                    className="w-full py-4 rounded-2xl text-center font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-logoBlue hover:text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowUpRight className="w-5 h-5 opacity-70" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white shadow-sm rounded-3xl border border-gray-100">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We're currently planning our next community initiatives. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
       ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              How <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${DARK_BLUE}, #3b82f6)` }}>HopeLink</span> Works
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn how our platform connects donors, recipients, and volunteers to create meaningful impact.
            </p>
          </motion.div>

          {/* Role Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { id: 'donor', label: 'For Donors', icon: Gift },
              { id: 'recipient', label: 'For Recipients', icon: Heart },
              { id: 'volunteer', label: 'For Volunteers', icon: Truck }
            ].map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeRole === role.id
                      ? 'bg-logoBlue text-white shadow-lg scale-105 border border-logoBlue'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-logoBlue'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {role.label}
                </button>
              )
            })}
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 xl:gap-4">
            {currentSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={`${activeRole}-${step.step}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="relative z-20 mb-3 lg:mb-4">
                    <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-primary-100 shadow-sm flex items-center justify-center bg-white">
                      <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-primary-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-secondary-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm lg:text-base shadow-md border-2 border-white">
                      {step.step}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 lg:p-5 border border-gray-100 hover:border-primary-200 transition-all duration-300 h-full flex flex-col w-full shadow-sm hover:shadow-md hover:scale-[1.02] group">
                    <h3 className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight text-center">{step.title}</h3>
                    <p className="text-gray-600 mb-3 lg:mb-4 text-xs lg:text-sm leading-relaxed flex-grow text-center">{step.description}</p>
                    <div className="mt-auto pt-3 lg:pt-4 border-t border-gray-100 group-hover:border-primary-100 transition-colors">
                      <p className="text-xs text-primary-600 italic leading-relaxed text-center">{step.value}</p>
                    </div>
                  </div>
                  {index < currentSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowDown className="h-6 w-6 text-gray-300 animate-bounce" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Key Features */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">Key Features</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">What makes HopeLink different</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:bg-white transition-all text-center shadow-sm hover:shadow-md"
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3B — USER GUIDE
       ═══════════════════════════════════════════════════════════ */}
      <section id="guide" className="py-24 lg:py-32 relative bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 border border-primary-100 mb-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              User <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${DARK_BLUE}, #3b82f6)` }}>Guide</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Step-by-step guide to navigate and use HopeLink features effectively
            </p>
          </motion.div>

          {/* Role Selector (reuses the same activeRole state) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { id: 'donor', label: 'For Donors', icon: Gift },
              { id: 'recipient', label: 'For Recipients', icon: Heart },
              { id: 'volunteer', label: 'For Volunteers', icon: Truck }
            ].map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={`guide-${role.id}`}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeRole === role.id
                      ? 'bg-logoBlue text-white shadow-lg scale-105 border border-logoBlue'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-logoBlue'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {role.label}
                </button>
              )
            })}
          </motion.div>

          {/* Guide Content Cards */}
          <div className="space-y-6">
            {activeRole === 'donor' && [
              { title: 'Getting Started', icon: Home, items: [
                { title: 'Complete Your Profile', description: 'Fill out your profile information including location, preferences, and upload your ID for verification.', steps: ['Go to your Profile page from the navigation menu', 'Fill in your personal information and location', 'Upload a valid government-issued ID', 'Wait for admin verification (24-48 hours)', 'Get your verification badge once approved'] },
                { title: 'Explore Your Dashboard', description: 'Your dashboard shows your impact statistics, recent activity, and quick actions.', steps: ['View your impact metrics (families helped, completion rate)', 'See your recent donations and their status', 'Check pending actions and notifications', 'Monitor your community value created'] }
              ]},
              { title: 'Posting Donations', icon: Gift, items: [
                { title: 'Create a Donation', description: 'Post items you want to donate with photos, descriptions, and delivery preferences.', steps: ['Click "Post Donation" from the dashboard or navigation', 'Upload clear photos of the items', 'Write a detailed description including condition', 'Select the appropriate category', 'Set quantity and delivery mode (pickup, volunteer, direct)', 'Add pickup location and preferences', 'Submit your donation listing'] },
                { title: 'Manage Your Donations', description: 'Track and manage all your posted donations in one place.', steps: ['View all your donations and their current status', 'Edit or delete donations that haven\'t been claimed', 'Track delivery progress in real-time', 'See recipient confirmations and feedback', 'Monitor completion rates'] },
                { title: 'Browse Requests', description: 'See what your community needs and fulfill requests directly.', steps: ['Browse requests from verified recipients', 'Filter by category, urgency, and location', 'View request details and recipient information', 'Fulfill requests by creating matching donations', 'See impact preview before fulfilling'] }
              ]},
              { title: 'Understanding Status', icon: BarChart3, items: [
                { title: 'Donation Status Workflow', description: 'Learn what each status means and what happens at each stage.', steps: ['Available: Your donation is posted and waiting for matching', 'Matched: System matched your donation with recipients', 'Claimed: A recipient has claimed your donation', 'In Transit: Volunteer is delivering to recipient', 'Delivered: Item reached the recipient', 'Completed: Recipient confirmed receipt, transaction complete'] },
                { title: 'Notifications', description: 'Stay informed about your donations through real-time notifications.', steps: ['Receive notifications when donations are matched', 'Get alerts when recipients claim your donations', 'Track delivery status updates', 'See recipient confirmations and feedback'] }
              ]}
            ].map((section, sectionIndex) => {
              const SectionIcon = section.icon
              return (
                <motion.div
                  key={`donor-guide-${sectionIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-primary-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary-50 border border-primary-100 shadow-sm">
                      <SectionIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:bg-white hover:border-primary-100 hover:shadow-sm transition-all">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                        {item.steps && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">Steps:</p>
                            <ol className="space-y-2">
                              {item.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-3 text-sm text-gray-600">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-semibold text-xs mt-0.5">{stepIndex + 1}</span>
                                  <span className="leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}

            {activeRole === 'recipient' && [
              { title: 'Getting Started', icon: Home, items: [
                { title: 'Complete ID Verification', description: 'Verify your identity to get priority matching and unlock all features.', steps: ['Go to your Profile page', 'Scroll to "ID Verification" section', 'Upload a valid government-issued ID', 'Fill in ID details (type, number)', 'Wait for admin review (24-48 hours)', 'Get verified badge for priority matching'] },
                { title: 'Explore Your Dashboard', description: 'Monitor your requests, matches, and track items you\'ve received.', steps: ['View your request statistics', 'See fulfillment rates and items received', 'Check pending matches and approved donations', 'Track time and money saved'] }
              ]},
              { title: 'Creating Requests', icon: Package, items: [
                { title: 'Create a Request', description: 'Post what you need with details to help donors understand your needs.', steps: ['Click "Create Request" from dashboard or navigation', 'Fill in title and detailed description', 'Select category and quantity needed', 'Set urgency level (low, medium, high, critical)', 'Add your location for delivery coordination', 'Submit your request'] },
                { title: 'Manage Your Requests', description: 'Track all your requests and see how the community is responding.', steps: ['View all your requests and their current status', 'Edit open requests to update details', 'See matches and approved donations', 'Track delivery progress', 'Confirm receipt when items arrive'] }
              ]},
              { title: 'Finding Donations', icon: Search, items: [
                { title: 'Browse Available Donations', description: 'Search and claim donations that match your needs.', steps: ['Browse all available donations from verified donors', 'Filter by category, location, and condition', 'Check donor verification status', 'View donation details and photos', 'Claim donations that match your needs', 'Coordinate pickup or delivery'] }
              ]}
            ].map((section, sectionIndex) => {
              const SectionIcon = section.icon
              return (
                <motion.div
                  key={`recipient-guide-${sectionIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-primary-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary-50 border border-primary-100 shadow-sm">
                      <SectionIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:bg-white hover:border-primary-100 hover:shadow-sm transition-all">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                        {item.steps && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">Steps:</p>
                            <ol className="space-y-2">
                              {item.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-3 text-sm text-gray-600">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-semibold text-xs mt-0.5">{stepIndex + 1}</span>
                                  <span className="leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}

            {activeRole === 'volunteer' && [
              { title: 'Getting Started', icon: Home, items: [
                { title: 'Complete Volunteer Profile', description: 'Set up your volunteer profile with availability and preferences.', steps: ['Go to your Profile page', 'Complete personal information and location', 'Set your availability schedule', 'Specify vehicle type and delivery capacity', 'Set distance preferences for deliveries', 'Save your profile settings'] },
                { title: 'Explore Volunteer Dashboard', description: 'Monitor your volunteer impact and delivery statistics.', steps: ['View deliveries completed', 'See families helped count', 'Check your volunteer rating', 'Monitor active deliveries'] }
              ]},
              { title: 'Managing Deliveries', icon: Truck, items: [
                { title: 'Browse Available Tasks', description: 'Find delivery tasks in your area that match your availability.', steps: ['View all available delivery tasks', 'Filter by location, distance, and urgency', 'Check pickup and delivery locations', 'Review item details and recipient information', 'Accept tasks that fit your schedule and capacity'] },
                { title: 'Track Your Deliveries', description: 'Manage active deliveries and update status in real-time.', steps: ['View all your active and completed deliveries', 'Update delivery status (picked up, in transit, delivered)', 'Communicate with donors and recipients', 'Track route and delivery progress', 'Mark deliveries as complete'] }
              ]},
              { title: 'Delivery Process', icon: CheckCircle, items: [
                { title: 'Delivery Workflow', description: 'Understand the complete delivery process from acceptance to completion.', steps: ['Accept a delivery task from available tasks', 'Coordinate pickup time with donor', 'Update status to "Picked Up" when collected', 'Update status to "In Transit" when en route', 'Navigate to recipient location', 'Update status to "Delivered" upon arrival', 'Wait for recipient confirmation'] },
                { title: 'Best Practices', description: 'Tips for being an effective volunteer.', steps: ['Update status promptly for real-time tracking', 'Communicate clearly with donors and recipients', 'Respect scheduled pickup and delivery times', 'Handle items with care during transport', 'Complete deliveries promptly'] }
              ]}
            ].map((section, sectionIndex) => {
              const SectionIcon = section.icon
              return (
                <motion.div
                  key={`volunteer-guide-${sectionIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-primary-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary-50 border border-primary-100 shadow-sm">
                      <SectionIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:bg-white hover:border-primary-100 hover:shadow-sm transition-all">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                        {item.steps && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">Steps:</p>
                            <ol className="space-y-2">
                              {item.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-3 text-sm text-gray-600">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-semibold text-xs mt-0.5">{stepIndex + 1}</span>
                                  <span className="leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — ABOUT & MISSION
       ═══════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 lg:py-32 relative bg-gray-50 border-y border-gray-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-50 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side: Mission & Vision Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6" style={{ color: DARK_BLUE }}>
                  Driving Change with Purpose
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  We believe in the power of community and the impact of collective action. Our mission is to create a seamless platform that connects those who want to help with those who need support.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Building Renewed Families and Communities for God and Country.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Faith on Action for Spiritual and Temporal Transformation.
                </p>
              </div>
            </motion.div>

            {/* Right side: Decorative Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:block"
            >
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 translate-y-8">
                    <div className="rounded-3xl overflow-hidden aspect-[4/5] border border-gray-100 shadow-xl">
                      <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600" alt="Volunteer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-3xl overflow-hidden aspect-[4/5] border border-gray-100 shadow-xl">
                      <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" alt="Community" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
               </div>
               
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 ring-1 ring-black/5">
                 <div className="text-center">
                    <span className="block text-2xl font-black" style={{ color: DARK_BLUE }}>100%</span>
                    <span className="block text-xs font-bold text-gray-500 uppercase">Impact</span>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — CONTACT & MAP
       ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-600 mb-8">
                We'd love to hear from you
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:border-blue-300 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Our Location</h4>
                    <p className="text-gray-600 text-lg">Pasil, Kauswagan<br/>Cagayan de Oro, Philippines</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:border-emerald-300 transition-colors">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 text-lg">+63 123 456 7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 group-hover:border-amber-300 transition-colors">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Email</h4>
                    <a href="mailto:cfcgkmisor@gmail.com" className="text-blue-600 text-lg hover:text-blue-700 transition-colors">cfcgkmisor@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:border-blue-300 transition-colors">
                    <Facebook className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Social Media</h4>
                    <a href="https://web.facebook.com/cfcgkmisormain" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-lg hover:text-blue-700 transition-colors">Follow us on Facebook</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="h-full min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1771906761337!6m8!1m7!1sjtpN4A_s-NC1jUPxVL9ajQ!2m2!1d8.499443741602416!2d124.6424556738541!3f89.62932224702477!4f23.217577416907858!5f0.7820865974627469"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HopeLink Location"
                allow="accelerometer; gyroscope"
              ></iframe>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — MONETARY DONATIONS
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-gray-50 border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6" style={{ color: DARK_BLUE }}>
              Support Our Mission
            </h2>
            <p className="text-lg text-gray-600">
              Your financial contributions help us maintain the platform and organize larger community drives. Every amount counts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {paymentMethods.map((method, index) => (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onClick={() => handlePaymentClick(method)}
                className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-primary-400 hover:shadow-xl hover:-translate-y-2 hover:bg-primary-50/30 transition-all duration-300 text-center group cursor-pointer"
              >
                <div className="h-20 flex items-center justify-center mb-6">
                  <img src={method.logo} alt={method.name} className="max-h-full max-w-[120px] object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{method.description}</p>
                <div className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary-50 text-primary-700 font-semibold group-hover:bg-primary-100 group-hover:text-primary-800 transition-colors border border-primary-100 group-hover:border-primary-200">
                  Show QR Code
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-sm text-gray-500">
              After donating, please send a screenshot of your transaction to <a href="mailto:cfcgkmisor@gmail.com" className="text-blue-600 font-medium hover:underline">cfcgkmisor@gmail.com</a> for our records.
            </p>
          </div>
        </div>
      </section>

      {/* Old partners section removed — partners strip is now between Hero and Events (hidden until logos are added) */}

      {/* ═══════════════════════════════════════════════════════════
          QR CODE MODAL
       ═══════════════════════════════════════════════════════════ */}
      {showQRModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div className="p-6 text-center relative border-b border-gray-100">
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <img src={selectedPayment.logo} alt={selectedPayment.name} className="h-12 mx-auto mb-3 object-contain" />
              <h3 className="text-lg font-bold text-gray-900">Scan to Donate</h3>
            </div>
            
            <div className="p-8 bg-gray-50">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <img
                  src={selectedPayment.qrCode}
                  alt={`${selectedPayment.name} QR Code`}
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="space-y-3 text-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account Name</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.account}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account Number</p>
                  <p className="font-mono font-bold text-blue-600 text-lg tracking-wider">{selectedPayment.accountNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowQRModal(false)}
                className="py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadQR}
                className="py-3 px-4 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                style={{ backgroundColor: DARK_BLUE }}
              >
                <Download className="h-4 w-4" />
                Save QR
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default HomePage 
