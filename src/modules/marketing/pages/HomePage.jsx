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
  Activity
} from 'lucide-react'
import { db } from '@/shared/lib/supabase'
import { useToast } from '@/shared/contexts/ToastContext'
import { useAuth } from '@/modules/auth/AuthContext'

// Shared constants
const DARK_BLUE = '#000f3d'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { error } = useToast()
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

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
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-white to-white">
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
                  className="inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: DARK_BLUE }}
                >
                  Start Making an Impact
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Watch How It Works
                </Link>
              </div>

            </motion.div>

            {/* Image Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative lg:ml-auto w-full max-w-[600px] mx-auto lg:mx-0"
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
          SECTION 2 — FEATURES
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 relative" style={{ backgroundColor: DARK_BLUE }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              A Complete Ecosystem of Care
            </h2>
            <p className="text-lg text-blue-100/80">
              Our platform connects every piece of the puzzle, making it simple to give, receive, and volunteer in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-blue-100/80 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — ABOUT & MISSION
       ═══════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 lg:py-32 relative bg-white">
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

            {/* Right side: Decorative Graphic / Layout */}
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
                    <span className="block text-2xl font-black text-[#000f3d]">100%</span>
                    <span className="block text-xs font-bold text-gray-500 uppercase">Impact</span>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — UPCOMING EVENTS
       ═══════════════════════════════════════════════════════════ */}
      <section id="events" className="py-24 lg:py-32 relative" style={{ backgroundColor: DARK_BLUE }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                Join the Movement
              </h2>
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
                <div key={i} className="rounded-3xl p-8 bg-white/5 border border-white/10 animate-pulse">
                  <div className="h-8 bg-white/10 rounded-xl w-2/3 mb-6"></div>
                  <div className="space-y-4 mb-8">
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  </div>
                  <div className="h-12 bg-white/10 rounded-2xl w-full"></div>
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
                  className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-gray-600 transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-amber-200">
                      {event.target_goal || 'Community'}
                    </span>
                  </div>

                  <p className="text-blue-100/80 mb-8 line-clamp-2 text-lg flex-1">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/60 font-medium uppercase">Date</p>
                        <p className="text-sm font-semibold text-white">
                          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-blue-200/60 font-medium uppercase">Location</p>
                        <p className="text-sm font-semibold text-white truncate">
                          {event.location || event.address || 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id || ''}`}
                    className="w-full py-4 rounded-2xl text-center font-bold text-gray-800 bg-white transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowUpRight className="w-5 h-5 opacity-70" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <Calendar className="h-16 w-16 text-blue-300 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Events</h3>
              <p className="text-blue-100/70 mb-8 max-w-md mx-auto">
                We're currently planning our next community initiatives. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — MONETARY DONATIONS
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-gray-50 relative">
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
                className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer"
              >
                <div className="h-20 flex items-center justify-center mb-6">
                  <img src={method.logo} alt={method.name} className="max-h-full max-w-[120px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{method.description}</p>
                <div className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-gray-50 text-gray-900 font-semibold group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
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

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — CONTACT & MAP (Combined)
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 mb-8">
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
          SECTION 7 — PARTNERS
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 border-t border-white/10" style={{ backgroundColor: DARK_BLUE }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-blue-200/60 uppercase tracking-widest mb-8">Trusted by our partners</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Partner Logos */}
            <div className="text-2xl font-black text-white/50">PARTNER 1</div>
            <div className="text-2xl font-black text-white/50">PARTNER 2</div>
            <div className="text-2xl font-black text-white/50">PARTNER 3</div>
            <div className="text-2xl font-black text-white/50">PARTNER 4</div>
          </div>
        </div>
      </section>

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
