import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './shared/components/layout/Navbar'
import Footer from './shared/components/layout/Footer'
import { DashboardSkeleton } from './shared/components/ui/Skeleton'
import SetupGuide from './shared/components/ui/SetupGuide'
import ScrollToTop from './shared/components/ui/ScrollToTop'
import { ErrorBoundaryWithNavigate } from './shared/components/ui/ErrorBoundary'
import { useAuth } from './modules/auth/AuthContext'
import { useToast } from './shared/contexts/ToastContext'
import { isDevelopment, getEnvironmentStatus } from './shared/lib/devUtils'
import { supabase } from './shared/lib/supabase'
import lazyWithRetry from './shared/lib/lazyWithRetry'
import { preloadRoutes } from './shared/lib/preloadRoutes'
import useUIStore from './stores/uiStore'

// Import public pages directly (avoiding lazy loading for these specific pages due to Vercel build issues)
import HomePage from './modules/marketing/pages/HomePage.jsx'
import AboutPage from './modules/marketing/pages/AboutPage.jsx'
import HowItWorksPage from './modules/marketing/pages/HowItWorksPage.jsx'
import GuidePage from './modules/marketing/pages/GuidePage.jsx'

// Lazy load other pages for better performance
const importLoginPage = () => import('./modules/auth/pages/LoginPage')
const importSignupPage = () => import('./modules/auth/pages/SignupPage')
const importCallbackPage = () => import('./modules/auth/pages/CallbackPage')
const importResetPasswordPage = () => import('./modules/auth/pages/ResetPasswordPage')
const importDashboardPage = () => import('./modules/dashboard/pages/DashboardPage')
const importProfilePage = () => import('./modules/profile/pages/ProfilePage')

const LoginPage = lazyWithRetry(importLoginPage)
const SignupPage = lazyWithRetry(importSignupPage)
const CallbackPage = lazyWithRetry(importCallbackPage)
const ResetPasswordPage = lazyWithRetry(importResetPasswordPage)
const DashboardPage = lazyWithRetry(importDashboardPage)
const ProfilePage = lazyWithRetry(importProfilePage)

// Donor pages
const importPostDonationPage = () => import('./modules/donor/pages/PostDonationPage')
const importFulfillRequestPage = () => import('./modules/donor/pages/FulfillRequestPage')
const importMyDonationsPage = () => import('./modules/donor/pages/MyDonationsPage')
const importBrowseRequestsPage = () => import('./modules/donor/pages/BrowseRequestsPage')
const importPendingRequestsPage = () => import('./modules/donor/pages/PendingRequestsPage')

const PostDonationPage = lazyWithRetry(importPostDonationPage)
const FulfillRequestPage = lazyWithRetry(importFulfillRequestPage)
const MyDonationsPage = lazyWithRetry(importMyDonationsPage)
const BrowseRequestsPage = lazyWithRetry(importBrowseRequestsPage)
const PendingRequestsPage = lazyWithRetry(importPendingRequestsPage)

// Recipient pages
const importBrowseDonationsPage = () => import('./modules/recipient/pages/BrowseDonationsPage')
const importCreateRequestPage = () => import('./modules/recipient/pages/CreateRequestPage')
const importMyRequestsPage = () => import('./modules/recipient/pages/MyRequestsPage')
const importMyApprovedDonationsPage = () => import('./modules/recipient/pages/MyApprovedDonationsPage')
const importMyApprovedRequestsPage = () => import('./modules/recipient/pages/MyApprovedRequestsPage')

const BrowseDonationsPage = lazyWithRetry(importBrowseDonationsPage)
const CreateRequestPage = lazyWithRetry(importCreateRequestPage)
const MyRequestsPage = lazyWithRetry(importMyRequestsPage)
const MyApprovedDonationsPage = lazyWithRetry(importMyApprovedDonationsPage)
const MyApprovedRequestsPage = lazyWithRetry(importMyApprovedRequestsPage)

// Volunteer pages
const importVolunteerDashboardPage = () => import('./modules/volunteer/pages/VolunteerDashboardPage')
const importAvailableTasksPage = () => import('./modules/volunteer/pages/AvailableTasksPage')
const importMyDeliveriesPage = () => import('./modules/volunteer/pages/MyDeliveriesPage')
const importVolunteerSchedulePage = () => import('./modules/volunteer/pages/VolunteerSchedulePage')

const VolunteerDashboardPage = lazyWithRetry(importVolunteerDashboardPage)
const AvailableTasksPage = lazyWithRetry(importAvailableTasksPage)
const MyDeliveriesPage = lazyWithRetry(importMyDeliveriesPage)
const VolunteerSchedulePage = lazyWithRetry(importVolunteerSchedulePage)

// Event pages
const importEventsPage = () => import('./modules/events/pages/EventsPage')
const importEventDetailsPage = () => import('./modules/events/pages/EventDetailsPage')

const EventsPage = lazyWithRetry(importEventsPage)
const EventDetailsPage = lazyWithRetry(importEventDetailsPage)

// Admin pages
const importAdminDashboard = () => import('./modules/admin/pages/AdminDashboard')
const importUserManagementPage = () => import('./modules/admin/pages/UserManagementPage')
const importIDVerificationPage = () => import('./modules/admin/pages/IDVerificationPage')
const importAdminSettingsPage = () => import('./modules/admin/pages/AdminSettingsPage')
const importMatchingParametersPage = () => import('./modules/matching/pages/MatchingParametersPage')
const importAdminDonationsPage = () => import('./modules/admin/pages/AdminDonationsPage')
const importAdminCFCDonationsPage = () => import('./modules/admin/pages/AdminCFCDonationsPage')
const importAdminVolunteersPage = () => import('./modules/admin/pages/AdminVolunteersPage')
const importAdminRequestsPage = () => import('./modules/admin/pages/AdminRequestsPage')
const importAdminEventsPage = () => import('./modules/admin/pages/AdminEventsPage')
const importAdminFeedbackPage = () => import('./modules/admin/pages/AdminFeedbackPage')

const AdminDashboard = lazyWithRetry(importAdminDashboard)
const UserManagementPage = lazyWithRetry(importUserManagementPage)
const IDVerificationPage = lazyWithRetry(importIDVerificationPage)
const AdminSettingsPage = lazyWithRetry(importAdminSettingsPage)
const MatchingParametersPage = lazyWithRetry(importMatchingParametersPage)
const AdminDonationsPage = lazyWithRetry(importAdminDonationsPage)
const AdminCFCDonationsPage = lazyWithRetry(importAdminCFCDonationsPage)
const AdminVolunteersPage = lazyWithRetry(importAdminVolunteersPage)
const AdminRequestsPage = lazyWithRetry(importAdminRequestsPage)
const AdminEventsPage = lazyWithRetry(importAdminEventsPage)
const AdminFeedbackPage = lazyWithRetry(importAdminFeedbackPage)

// Legal pages
const importTermsOfServicePage = () => import('./modules/legal/pages/TermsOfServicePage')
const importPrivacyPolicyPage = () => import('./modules/legal/pages/PrivacyPolicyPage')
const importCookiesPolicyPage = () => import('./modules/legal/pages/CookiesPolicyPage')
const importCodeOfConductPage = () => import('./modules/legal/pages/CodeOfConductPage')

const TermsOfServicePage = lazyWithRetry(importTermsOfServicePage)
const PrivacyPolicyPage = lazyWithRetry(importPrivacyPolicyPage)
const CookiesPolicyPage = lazyWithRetry(importCookiesPolicyPage)
const CodeOfConductPage = lazyWithRetry(importCodeOfConductPage)

const routePreloaders = [
  importLoginPage,
  importSignupPage,
  importCallbackPage,
  importResetPasswordPage,
  importDashboardPage,
  importProfilePage,
  importPostDonationPage,
  importFulfillRequestPage,
  importMyDonationsPage,
  importBrowseRequestsPage,
  importPendingRequestsPage,
  importBrowseDonationsPage,
  importCreateRequestPage,
  importMyRequestsPage,
  importMyApprovedDonationsPage,
  importMyApprovedRequestsPage,
  importVolunteerDashboardPage,
  importAvailableTasksPage,
  importMyDeliveriesPage,
  importVolunteerSchedulePage,
  importEventsPage,
  importEventDetailsPage,
  importAdminDashboard,
  importUserManagementPage,
  importIDVerificationPage,
  importAdminSettingsPage,
  importMatchingParametersPage,
  importAdminDonationsPage,
  importAdminCFCDonationsPage,
  importAdminVolunteersPage,
  importAdminRequestsPage,
  importAdminEventsPage,
  importAdminFeedbackPage,
  importTermsOfServicePage,
  importPrivacyPolicyPage,
  importCookiesPolicyPage,
  importCodeOfConductPage,
]

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading, isSigningOut } = useAuth()
  const navigate = useNavigate()
  
  // Check if account is suspended - this is a critical security check
  React.useEffect(() => {
    if (profile && (profile.is_active === false || profile.is_active === 'false' || profile.is_active === 0)) {
      console.error('🚨 Suspended account detected in ProtectedRoute - redirecting to login')
      // The auth context should handle sign out, but we'll redirect to login as a safeguard
      navigate('/login', { replace: true, state: { error: 'Your account has been suspended. Please contact the administrator for assistance.' } })
    }
  }, [profile, navigate])
  
  if (loading || isSigningOut) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSkeleton />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // CRITICAL: Block access if account is suspended
  if (profile && (profile.is_active === false || profile.is_active === 'false' || profile.is_active === 0)) {
    console.error('🚨 Suspended account blocked in ProtectedRoute')
    return <Navigate to="/login" replace state={{ error: 'Your account has been suspended. Please contact the administrator for assistance.' }} />
  }
  
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Public Route component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, isSigningIn } = useAuth()
  const location = useLocation()
  const isPasswordRecoveryRoute = location?.pathname === '/reset-password'
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSkeleton />
      </div>
    )
  }
  
  // Don't redirect if user is signing in - let the auth flow complete smoothly
  if (user && !isSigningIn && !isPasswordRecoveryRoute) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Component to conditionally render Footer
function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { loading, profile } = useAuth()
  const { showToast, error: showError } = useToast()
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  
  useEffect(() => {
    preloadRoutes(routePreloaders)
  }, [])

  // Hide footer on login and signup pages
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup'

  useEffect(() => {
    // Check if setup is needed in development
    if (isDevelopment) {
      const envStatus = getEnvironmentStatus()
      
      if (!envStatus.isConfigured) {
        setShowSetupGuide(true)
        showToast('Environment configuration needed for full functionality', 'warning')
      }
    }
  }, [showToast])


  // Ensure recovery links always land on the reset password page
  useEffect(() => {
    // If Supabase redirected us to Site URL with ?redirect_to=<absolute-url>, forward immediately
    const params = new URLSearchParams(window.location.search)
    const redirectTo = params.get('redirect_to')
    if (redirectTo) {
      try {
        // Use a hard navigation to preserve any subsequent token appends from Supabase
        window.location.replace(redirectTo)
        return
      } catch {
        navigate(new URL(redirectTo).pathname + (new URL(redirectTo).search || '') + (new URL(redirectTo).hash || ''), { replace: true })
        return
      }
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        const hash = window.location.hash || ''
        const search = window.location.search || ''
        // Preserve tokens when navigating
        navigate(`/reset-password${hash || search ? '' : ''}${hash}${!hash && search ? search : ''}`, { replace: true })
      }
    })
    return () => {
      subscription.subscription?.unsubscribe()
    }
  }, [navigate])

  // Sidebar mode from store — must be before any early returns (Rules of Hooks)
  const sidebarMode = useUIStore((s) => s.sidebarMode)
  const isDarkMode = useUIStore((s) => s.isDarkMode)

  // Initialize dark mode on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSkeleton />
      </div>
    )
  }

  const shouldShowSidebar = profile && location.pathname !== '/auth/callback'

  // Compute the margin class for the main content
  const getSidebarMargin = () => {
    if (!shouldShowSidebar) return ''
    if (sidebarMode === 'pinned') return 'ml-64' // 16rem = w-64
    return 'ml-12 sm:ml-16' // collapsed sidebar width
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <main className={`flex-1 transition-all duration-300 ease-in-out ${getSidebarMargin()}`}>
          <ErrorBoundaryWithNavigate>
            <React.Suspense 
              fallback={
                <div 
                  className="min-h-screen bg-gray-50" 
                >
                  <DashboardSkeleton />
                </div>
              }
            >
              <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              
              {/* Legal pages */}
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookies" element={<CookiesPolicyPage />} />
              <Route path="/conduct" element={<CodeOfConductPage />} />
              
              {/* Public auth routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } />

              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* OAuth callback route */}
              <Route path="/auth/callback" element={<CallbackPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              {/* Donor routes */}
              <Route path="/post-donation" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <PostDonationPage />
                </ProtectedRoute>
              } />
              <Route path="/donate-request/:requestId" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <FulfillRequestPage />
                </ProtectedRoute>
              } />
              <Route path="/my-donations" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <MyDonationsPage />
                </ProtectedRoute>
              } />
              <Route path="/browse-requests" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <BrowseRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/pending-requests" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <PendingRequestsPage />
                </ProtectedRoute>
              } />
              
              {/* Recipient routes */}
              <Route path="/browse-donations" element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <BrowseDonationsPage />
                </ProtectedRoute>
              } />
              <Route path="/create-request" element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <CreateRequestPage />
                </ProtectedRoute>
              } />
              <Route path="/my-requests" element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <MyRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/my-approved-requests" element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <MyApprovedRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/my-approved-donations" element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <MyApprovedDonationsPage />
                </ProtectedRoute>
              } />
              
              {/* Volunteer routes */}
              <Route path="/volunteer-dashboard" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/available-tasks" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <AvailableTasksPage />
                </ProtectedRoute>
              } />
              <Route path="/my-deliveries" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <MyDeliveriesPage />
                </ProtectedRoute>
              } />
              <Route path="/volunteer-schedule" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerSchedulePage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/id-verification" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <IDVerificationPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Navigate to="/profile#admin-settings" replace />
                </ProtectedRoute>
              } />
              <Route path="/admin/matching-parameters" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MatchingParametersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/donations" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDonationsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/cfc-donations" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCFCDonationsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/volunteers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminVolunteersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/requests" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/events" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEventsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/feedback" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminFeedbackPage />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-accent-300 mb-8">Page not found</p>
                    <a href="/" className="btn btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </React.Suspense>
          </ErrorBoundaryWithNavigate>
        </main>
        
        <div className={`transition-all duration-300 ease-in-out ${getSidebarMargin()}`}>
          {!hideFooter && <Footer userRole={profile?.role} />}
        </div>
        
        {/* Development Tools */}
        <AnimatePresence>
          {showSetupGuide && (
            <SetupGuide onClose={() => setShowSetupGuide(false)} />
          )}
        </AnimatePresence>
        
        {/* Development Tools */}
        {isDevelopment && (
          <>
          </>
        )}
      </div>
  )
}

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

// Global keyboard shortcuts for development
if (isDevelopment) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('showSetupGuide'))
    }
  })
}

export default App 