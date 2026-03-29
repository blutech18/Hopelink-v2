import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Settings,
  Gift,
  Users,
  Calendar,
  Truck,
  Shield,
  Bell,
  Clock,
  ChevronDown,
  MessageSquare,
  Building,
  ShieldCheck,
  Info,
  Flag,
  CheckCircle,
  Target,
  Home,
  Phone,
  HelpCircle,
  PanelLeftOpen,
  PanelLeftClose,
  Pin,
  PinOff,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Layers,
} from "lucide-react";
import { useAuth } from "../../modules/auth/AuthContext";
import { useToast } from "../../shared/contexts/ToastContext";
import { db } from "../../lib/supabase";
import FeedbackModal from "../ui/FeedbackModal";
import useUIStore from "../../stores/uiStore";

const enableNavbarLogs = false;
const navbarLog = (...args) => {
  if (enableNavbarLogs) {
    console.log(...args);
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  // Sidebar state from Zustand store
  const sidebarMode = useUIStore((s) => s.sidebarMode);
  const isSidebarHovered = useUIStore((s) => s.isSidebarHovered);
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const setSidebarMode = useUIStore((s) => s.setSidebarMode);
  const setSidebarHovered = useUIStore((s) => s.setSidebarHovered);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  // Compute expanded state from mode + hover
  const isSidebarExpanded =
    sidebarMode === "pinned" || (sidebarMode === "hover" && isSidebarHovered);
  const setIsSidebarExpanded = () => {}; // no-op, kept for compat
  const [activeSection, setActiveSection] = useState("home");
  const [showFeedbackFloat, setShowFeedbackFloat] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSidebarModeModal, setShowSidebarModeModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const { success, error } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const desktopProfileMenuRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  const sidebarModeMenuRef = useRef(null);
  const sidebarModeButtonRef = useRef(null);
  const sidebarHoverCloseTimeoutRef = useRef(null);

  const sidebarModeOptions = [
    {
      value: "pinned",
      label: "Expand",
      description: "Always keep sidebar open",
      icon: Pin,
    },
    {
      value: "collapsed",
      label: "Collapsed",
      description: "Always keep sidebar compact",
      icon: PanelLeftClose,
    },
    {
      value: "hover",
      label: "Expand on Hover",
      description: "Open only while hovering",
      icon: PanelLeftOpen,
    },
  ];

  // Hide profile display during callback processing to prevent flash of user info before error handling
  const isCallbackPage = location.pathname === "/auth/callback";
  const shouldShowProfile = isAuthenticated && profile && !isCallbackPage;

  // IntersectionObserver scroll spy for homepage sections
  useEffect(() => {
    if (location.pathname !== "/") return;
    const sectionIds = [
      "home",
      "events",
      "how-it-works",
      "guide",
      "about",
      "contact",
    ];
    const observers = [];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    // Small delay to let sections render
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0,
          });
          observer.observe(el);
          observers.push(observer);
        }
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [location.pathname]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close profile menu when clicking outside either desktop or mobile dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDesktop =
        desktopProfileMenuRef.current &&
        desktopProfileMenuRef.current.contains(event.target);
      const clickedInsideMobile =
        mobileProfileMenuRef.current &&
        mobileProfileMenuRef.current.contains(event.target);
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInside =
        notificationsDropdownRef.current &&
        notificationsDropdownRef.current.contains(event.target);
      if (!clickedInside && showNotifications) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showNotifications]);

  // Close sidebar mode picker when clicking outside
  useEffect(() => {
    if (!showSidebarModeModal) return;

    const handleClickOutside = (event) => {
      const clickedInsideMenu =
        sidebarModeMenuRef.current &&
        sidebarModeMenuRef.current.contains(event.target);
      const clickedToggleButton =
        sidebarModeButtonRef.current &&
        sidebarModeButtonRef.current.contains(event.target);

      if (!clickedInsideMenu && !clickedToggleButton) {
        setShowSidebarModeModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebarModeModal]);

  useEffect(() => {
    return () => {
      if (sidebarHoverCloseTimeoutRef.current) {
        clearTimeout(sidebarHoverCloseTimeoutRef.current);
      }
    };
  }, []);

  // Periodic floating animation for feedback tooltip every 20 minutes
  useEffect(() => {
    const showFloatingTooltip = () => {
      setShowFeedbackFloat(true);
      setTimeout(() => setShowFeedbackFloat(false), 5000); // Show for 5 seconds
    };

    // Show immediately on mount
    const initialTimeout = setTimeout(showFloatingTooltip, 3000); // Show after 3 seconds

    // Then show every 20 minutes
    const interval = setInterval(showFloatingTooltip, 20 * 60 * 1000); // 20 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Realtime notifications
  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    async function load() {
      if (!profile?.id) {
        navbarLog("⚠️ No profile ID, skipping notification load");
        // Clear notifications when no profile
        if (isMounted) {
          setNotifications([]);
          setUnreadCount(0);
        }
        return;
      }

      const currentProfileId = profile.id; // Capture profile ID to avoid stale closure

      navbarLog(`🔄 Loading notifications for user ${currentProfileId}...`);
      try {
        const items = await db.getUserNotifications(currentProfileId, 50);
        if (isMounted && profile?.id === currentProfileId) {
          navbarLog(
            `📬 Received ${items?.length || 0} notifications from database:`,
            items,
          );
          setNotifications(items || []);
          setUnreadCount((items || []).filter((n) => !n.read_at).length);
          navbarLog(
            `✅ Notifications state updated: ${items?.length || 0} total, ${(items || []).filter((n) => !n.read_at).length} unread`,
          );
        }
      } catch (error) {
        console.error("❌ Error loading notifications:", error);
      }

      try {
        unsubscribe = db.subscribeToUserNotifications(
          currentProfileId,
          async (payload) => {
            const isPollEvent = payload?.eventType === "POLL";
            if (!isPollEvent) {
              navbarLog("🔔 Notification change detected in Navbar:", payload);
            }

            // Check if component is still mounted and profile still exists
            if (!isMounted || !profile?.id || profile.id !== currentProfileId) {
              navbarLog(
                "⚠️ Notification callback skipped - profile changed or component unmounted",
              );
              return;
            }
            try {
              // Double-check profile still exists before fetching
              if (!profile?.id || profile.id !== currentProfileId) {
                navbarLog(
                  "⚠️ Profile changed during notification fetch, skipping",
                );
                return;
              }

              // Refresh notifications when any change is detected
              const items = await db.getUserNotifications(currentProfileId, 50);

              // Final check before updating state
              if (isMounted && profile?.id === currentProfileId) {
                navbarLog(
                  `📬 Polling update - received ${items?.length || 0} notifications`,
                );
                setNotifications(items || []);
                setUnreadCount((items || []).filter((n) => !n.read_at).length);
                navbarLog(
                  `📬 Updated notifications: ${items?.length || 0} total, ${(items || []).filter((n) => !n.read_at).length} unread`,
                );

                // If it's a new notification (INSERT), show a visual indicator
                if (payload.eventType === "INSERT" && payload.new) {
                  navbarLog("✨ New notification received:", payload.new);
                  // The notification will appear in the list automatically
                }
              }
            } catch (error) {
              console.error("❌ Error refreshing notifications:", error);
            }
          },
        );
      } catch (error) {
        console.error("❌ Error setting up notification subscription:", error);
      }
    }

    load();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        navbarLog("🔔 Cleaning up notification subscription");
        unsubscribe();
      }
      // Clear notifications on cleanup
      setNotifications([]);
      setUnreadCount(0);
    };
  }, [profile?.id]);

  const markAllNotificationsAsRead = async () => {
    try {
      const unread = (notifications || []).filter((n) => !n.read_at);
      await Promise.all(unread.map((n) => db.markNotificationAsRead(n.id)));
      const items = await db.getUserNotifications(profile.id, 50);
      setNotifications(items || []);
      setUnreadCount((items || []).filter((n) => !n.read_at).length);
      success("All notifications marked as read");
    } catch (e) {
      error("Failed to mark notifications as read");
    }
  };

  // Close menus when authentication state changes
  useEffect(() => {
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  }, [isAuthenticated]);

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setActiveSection("home");
        return;
      }

      const sections = ["home", "events", "about", "contact"];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element =
          section === "home" ? document.body : document.getElementById(section);

        if (element) {
          const elementTop = section === "home" ? 0 : element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleSignOut = async () => {
    // Prevent double-clicking
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      // Close the profile menu first
      setIsProfileMenuOpen(false);

      // Add a loading state to prevent multiple clicks
      navbarLog("Starting sign out process...");

      await signOut();

      // Navigate to home page first, then show toast
      // This ensures a smooth transition without double navigation
      navigate("/", { replace: true });

      // Show success message after navigation
      setTimeout(() => {
        success("Successfully signed out");
      }, 100);
    } catch (signOutError) {
      console.error("Error signing out:", signOutError);
      // Show error message but still try to navigate (in case of partial sign out)
      error("Error signing out, but you have been logged out locally");
      navigate("/", { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleScrollNavigation = (scrollTo) => {
    const doScroll = () => {
      if (scrollTo === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(scrollTo);
        if (element) {
          const navbarHeight = 70;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: "smooth",
          });
        }
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 300);
    } else {
      doScroll();
    }
  };

  // Public navigation links (shown only when not authenticated or when clicking logo)
  const publicNavLinks = [
    { path: "/", label: "Events", scrollTo: "events", icon: Calendar },
    {
      path: "/",
      label: "How It Works",
      scrollTo: "how-it-works",
      icon: Target,
    },
    { path: "/", label: "Guide", scrollTo: "guide", icon: Info },
    { path: "/", label: "About", scrollTo: "about", icon: Info },
    { path: "/", label: "Contact", scrollTo: "contact", icon: Phone },
  ];

  // Helper function to determine if a link is active
  const isLinkActive = (link) => {
    if (link.scrollTo) {
      // For scroll-based navigation, check if current section matches the link's scroll target
      return location.pathname === "/" && activeSection === link.scrollTo;
    }
    return location.pathname === link.path;
  };

  // Get navigation links based on user role
  const getNavLinksForRole = (role) => {
    switch (role) {
      case "donor":
      case "admin":
        return [
          { path: "/events", label: "Events" },
          { path: "/", label: "Contact", scrollTo: "contact" },
        ]; // Events and Contact for donors and admins
      case "recipient":
      case "volunteer":
        return [{ path: "/", label: "Contact", scrollTo: "contact" }]; // Contact for recipients and volunteers
      default:
        return publicNavLinks; // Show all for non-authenticated users
    }
  };

  const roleBasedLinks = {
    donor: [
      { path: "/dashboard", label: "Dashboard", icon: User },
      { path: "/post-donation", label: "Post Donation", icon: Gift },
      { path: "/my-donations", label: "My Donations", icon: Heart },
      { path: "/pending-requests", label: "Pending Requests", icon: Bell },
      { path: "/browse-requests", label: "Browse Requests", icon: Users },
    ],
    recipient: [
      { path: "/dashboard", label: "Dashboard", icon: User },
      { path: "/browse-donations", label: "Browse Donations", icon: Gift },
      { path: "/create-request", label: "Create Request", icon: Heart },
      { path: "/my-requests", label: "My Requests", icon: Users },
      {
        path: "/my-approved-requests",
        label: "My Approved Requests",
        icon: CheckCircle,
      },
    ],
    volunteer: [
      { path: "/volunteer-dashboard", label: "Dashboard", icon: User },
      { path: "/available-tasks", label: "Available Tasks", icon: Truck },
      { path: "/my-deliveries", label: "My Deliveries", icon: Calendar },
      { path: "/volunteer-schedule", label: "Manage Schedule", icon: Clock },
    ],
    admin: [
      { path: "/admin", label: "Dashboard", icon: Shield },
      { path: "/admin/users", label: "Users", icon: Users },
      {
        path: "/admin/id-verification",
        label: "ID Verification",
        icon: ShieldCheck,
      },
      { path: "/admin/donations", label: "Donations", icon: Gift },
      {
        path: "/admin/cfc-donations",
        label: "Direct Donations",
        icon: Building,
      },
      { path: "/admin/volunteers", label: "Volunteers", icon: Truck },
      { path: "/admin/requests", label: "Requests", icon: Heart },
      { path: "/admin/events", label: "Events", icon: Calendar },
      {
        path: "/admin/matching-parameters",
        label: "Matching Parameters",
        icon: Target,
      },
      { path: "/admin/feedback", label: "Feedback", icon: MessageSquare },
    ],
  };

  // Get the current navigation links based on authentication and role
  const currentNavLinks =
    isAuthenticated && profile?.role
      ? getNavLinksForRole(profile.role)
      : publicNavLinks;

  return (
    <>
      {/* Fixed Sidebar for authenticated users - must be before nav for proper z-index */}
      {shouldShowProfile && (
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarExpanded ? "16rem" : isMobile ? "3rem" : "4rem",
          }}
          transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
          className={`fixed top-14 sm:top-16 left-0 bottom-0 border-r bg-white dark:bg-gray-900 dark:border-gray-700 border-gray-200 flex flex-col overflow-visible ${
            sidebarMode === "hover" && isSidebarHovered
              ? "z-[70] shadow-2xl"
              : "z-[60]"
          }`}
          onMouseEnter={() => {
            if (sidebarMode === "hover" && !isMobile) {
              if (sidebarHoverCloseTimeoutRef.current) {
                clearTimeout(sidebarHoverCloseTimeoutRef.current);
                sidebarHoverCloseTimeoutRef.current = null;
              }
              setSidebarHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (sidebarMode === "hover" && !isMobile) {
              sidebarHoverCloseTimeoutRef.current = setTimeout(() => {
                setSidebarHovered(false);
              }, 90);
            }
          }}
        >
          {/* Navigation Links */}
          <div className="p-2 sm:p-3 md:p-4 overflow-y-auto overflow-x-visible flex-1">
            {profile?.role && roleBasedLinks[profile.role] && (
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                {roleBasedLinks[profile.role].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center transition-all duration-200 group/link ${
                      isSidebarExpanded
                        ? "justify-start px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-medium border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-logoBlue"
                        : "justify-start px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-medium border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-logoBlue"
                    } ${
                      location.pathname === link.path
                        ? isSidebarExpanded
                          ? "text-logoBlue bg-blue-50 dark:bg-blue-900/30 font-semibold border border-blue-100 dark:border-blue-800"
                          : "text-logoBlue bg-blue-50/70 dark:bg-blue-900/20"
                        : "text-gray-800 dark:text-gray-400 hover:text-logoBlue"
                    }`}
                  >
                    <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">
                      <link.icon className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                    </span>
                    <motion.span
                      initial={false}
                      animate={{
                        opacity: isSidebarExpanded ? 1 : 0,
                        maxWidth: isSidebarExpanded ? 180 : 0,
                        x: isSidebarExpanded ? 0 : -6,
                      }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{ marginLeft: 10 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                    {/* Tooltip for collapsed mode */}
                    {!isSidebarExpanded && sidebarMode === "collapsed" && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover/link:opacity-100 pointer-events-none transition-opacity duration-200 z-[90] shadow-lg">
                        {link.label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Settings Panel at Bottom */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 sm:p-3 space-y-1">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`relative flex items-center w-full transition-all duration-200 group/btn ${
                isSidebarExpanded
                  ? "justify-start space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-400 hover:text-logoBlue"
                  : "justify-center py-2.5 text-gray-800 dark:text-gray-400 hover:text-logoBlue"
              }`}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              ) : (
                <Moon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              )}
              <motion.span
                initial={false}
                animate={{
                  opacity: isSidebarExpanded ? 1 : 0,
                  maxWidth: isSidebarExpanded ? 160 : 0,
                  x: isSidebarExpanded ? 0 : -6,
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ marginLeft: 10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </motion.span>
              {!isSidebarExpanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-200 z-[90] shadow-lg">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                </div>
              )}
            </button>

            {/* Sidebar Mode Picker Trigger */}
            <button
              ref={sidebarModeButtonRef}
              onClick={() => setShowSidebarModeModal((prev) => !prev)}
              className={`relative flex items-center w-full transition-all duration-200 group/btn ${
                isSidebarExpanded
                  ? "justify-start space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-400 hover:text-logoBlue"
                  : "justify-center py-2.5 text-gray-800 dark:text-gray-400 hover:text-logoBlue"
              }`}
            >
              <Layers className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <motion.div
                initial={false}
                animate={{
                  opacity: isSidebarExpanded ? 1 : 0,
                  maxWidth: isSidebarExpanded ? 170 : 0,
                  x: isSidebarExpanded ? 0 : -6,
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ marginLeft: 10 }}
                className="overflow-hidden flex flex-col items-start"
              >
                <span className="whitespace-nowrap text-sm">Sidebar Mode</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {sidebarMode === "pinned" && "Expand"}
                  {sidebarMode === "collapsed" && "Collapsed"}
                  {sidebarMode === "hover" && "Expand on Hover"}
                </span>
              </motion.div>
              {!isSidebarExpanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-200 z-[90] shadow-lg">
                  Sidebar Mode
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                </div>
              )}
            </button>

            <AnimatePresence>
              {showSidebarModeModal && (
                <motion.div
                  ref={sidebarModeMenuRef}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className={`absolute bottom-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-2 z-[95] ${
                    isSidebarExpanded ? "left-2 right-2" : "left-full ml-2 w-56"
                  }`}
                >
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Choose Sidebar Mode
                  </p>
                  <div className="space-y-1">
                    {sidebarModeOptions.map((modeOption) => {
                      const ModeIcon = modeOption.icon;
                      const isActive = sidebarMode === modeOption.value;

                      return (
                        <button
                          key={modeOption.value}
                          onClick={() => {
                            setSidebarMode(modeOption.value);
                            setShowSidebarModeModal(false);
                          }}
                          className={`w-full text-left rounded-lg px-2.5 py-2 transition-colors ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <ModeIcon
                              className={`h-4 w-4 mt-0.5 ${isActive ? "text-logoBlue" : "text-gray-700 dark:text-gray-400"}`}
                            />
                            <div>
                              <p
                                className={`text-xs font-medium ${isActive ? "text-logoBlue" : "text-gray-700 dark:text-gray-200"}`}
                              >
                                {modeOption.label}
                              </p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                {modeOption.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}

      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            {/* Logo Container */}
            <div className="flex items-center relative">
              {/* Desktop hamburger removed — sidebar mode is controlled at the bottom of sidebar */}
              {shouldShowProfile ? (
                <Link
                  to="/"
                  className="flex items-center space-x-1.5 sm:space-x-2"
                >
                  <div className="bg-logoBlue p-1.5 rounded-lg shadow-sm">
                    <img
                      src="/hopelinklogo.png"
                      alt="HopeLink"
                      className="h-7 sm:h-8 md:h-10 rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-logoBlue">
                      HopeLink
                    </span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] text-secondary-500 font-semibold">
                      CFC-GK
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => handleScrollNavigation("home")}
                  className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer"
                >
                  <div className="bg-logoBlue p-1.5 rounded-lg shadow-sm">
                    <img
                      src="/hopelinklogo.png"
                      alt="HopeLink"
                      className="h-7 sm:h-8 md:h-10 rounded"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-logoBlue">
                      HopeLink
                    </span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] text-secondary-500 font-semibold">
                      CFC-GK
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Desktop Navigation — centered */}
            <div className="hidden md:flex md:items-center md:justify-center md:flex-1 md:space-x-6 lg:space-x-8">
              {/* Public Navigation - show for all users */}
              {publicNavLinks.map((link) =>
                link.scrollTo ? (
                  <button
                    key={`${link.path}-${link.scrollTo}`}
                    onClick={() => handleScrollNavigation(link.scrollTo)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out relative ${
                      isLinkActive(link)
                        ? "text-logoBlue font-bold"
                        : "text-gray-600 hover:text-logoBlue"
                    }`}
                  >
                    {link.label}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-secondary-400 transition-all duration-300 ease-in-out ${
                        isLinkActive(link) ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    key={`${link.path}-${link.label}`}
                    to={link.path}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out relative ${
                      isLinkActive(link)
                        ? "text-logoBlue font-bold"
                        : "text-gray-600 hover:text-logoBlue"
                    }`}
                  >
                    {link.label}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-secondary-400 transition-all duration-300 ease-in-out ${
                        isLinkActive(link) ? "w-full" : "w-0"
                      }`}
                    />
                  </Link>
                ),
              )}

              {/* Role-based Navigation - show only for non-authenticated users */}
              {!isAuthenticated &&
                isAuthenticated &&
                profile?.role &&
                roleBasedLinks[profile.role] && (
                  <>
                    {roleBasedLinks[profile.role].map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                          location.pathname === link.path
                            ? "text-logoBlue font-bold"
                            : "text-gray-600 hover:text-logoBlue"
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </>
                )}
            </div>

            {/* Auth Section — right-aligned */}
            <div className="hidden md:flex md:items-center md:space-x-2 md:flex-shrink-0">
              {shouldShowProfile ? (
                <div className="flex items-center space-x-2">
                  {/* Notifications Bell */}
                  <div className="relative" ref={notificationsDropdownRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifications((v) => !v);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
                      aria-label="Notifications"
                    >
                      <Bell
                        className={`h-5 w-5 transition-colors ${unreadCount > 0 ? "text-logoBlue animate-pulse" : "text-gray-500 hover:text-logoBlue"}`}
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center border-2 border-navy-900 shadow-lg animate-bounce">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 flex flex-col"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Bell className="h-5 w-5 text-logoBlue" />
                              <span className="text-logoBlue text-base font-bold">
                                Notifications
                              </span>
                              {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                  {unreadCount} new
                                </span>
                              )}
                            </div>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllNotificationsAsRead}
                                className="text-xs text-logoBlue hover:text-navy-900 font-semibold transition-colors px-2 py-1 hover:bg-gray-200 rounded"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>

                          {/* Notifications List */}
                          <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                            {!notifications || notifications.length === 0 ? (
                              <div className="p-8 text-center">
                                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                  No notifications yet
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                  {notifications === null
                                    ? "Loading..."
                                    : "You're all caught up!"}
                                </p>
                              </div>
                            ) : (
                              <div className="divide-y divide-navy-800">
                                {notifications.slice(0, 5).map((n) => (
                                  <div
                                    key={n.id}
                                    className={`p-4 transition-all hover:bg-gray-50 cursor-pointer group ${
                                      !n.read_at
                                        ? "bg-blue-50 border-l-4 border-logoBlue"
                                        : "border-l-4 border-transparent"
                                    }`}
                                    onClick={async () => {
                                      if (!n.read_at) {
                                        try {
                                          await db.markNotificationAsRead(n.id);
                                          const items =
                                            await db.getUserNotifications(
                                              profile.id,
                                              50,
                                            );
                                          setNotifications(items || []);
                                          setUnreadCount(
                                            (items || []).filter(
                                              (n) => !n.read_at,
                                            ).length,
                                          );
                                        } catch (_) {}
                                      }

                                      // Navigate based on notification type for admin users
                                      if (
                                        profile?.role === "admin" &&
                                        n.data?.link
                                      ) {
                                        const notifType =
                                          n.data?.notification_type;
                                        let targetPath = n.data.link;

                                        // Add query params for specific notification types
                                        if (notifType === "user_report") {
                                          targetPath =
                                            "/admin/users?openReports=true";
                                        }

                                        navigate(targetPath);
                                        setShowNotifications(false);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        {/* Title with unread indicator */}
                                        <div className="flex items-center gap-2 mb-1">
                                          {!n.read_at && (
                                            <span className="h-2 w-2 bg-logoBlue rounded-full flex-shrink-0 animate-pulse"></span>
                                          )}
                                          {n.type === "user_report" && (
                                            <Flag className="h-4 w-4 text-red-400 flex-shrink-0" />
                                          )}
                                          {n.type !== "user_report" &&
                                            n.type === "system_alert" && (
                                              <Info className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                            )}
                                          <h4
                                            className={`text-sm font-semibold truncate ${
                                              n.type === "user_report"
                                                ? "text-red-600"
                                                : "text-gray-900"
                                            }`}
                                          >
                                            {n.title || "Notification"}
                                          </h4>
                                        </div>

                                        {/* Message */}
                                        <p
                                          className={`text-xs mb-2 line-clamp-2 ${
                                            n.type === "user_report"
                                              ? "text-red-500"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {n.message}
                                        </p>
                                        {/* Show clickable hint for admin notifications with links */}
                                        {profile?.role === "admin" &&
                                          n.data?.link && (
                                            <p className="text-blue-600 text-[10px] mt-1 italic flex items-center gap-1">
                                              <svg
                                                className="h-3 w-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                              </svg>
                                              Click to view details
                                            </p>
                                          )}

                                        {/* Timestamp and status */}
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-400 text-[11px]">
                                            {new Date(
                                              n.created_at,
                                            ).toLocaleString()}
                                          </span>
                                          {!n.read_at ? (
                                            <span className="text-logoBlue text-[10px] font-semibold uppercase tracking-wide">
                                              New
                                            </span>
                                          ) : (
                                            <span className="text-gray-500 text-[10px] uppercase tracking-wide">
                                              Read
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Mark as read button for unread notifications */}
                                      {!n.read_at && (
                                        <button
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                              await db.markNotificationAsRead(
                                                n.id,
                                              );
                                              const items =
                                                await db.getUserNotifications(
                                                  profile.id,
                                                  50,
                                                );
                                              setNotifications(items || []);
                                              setUnreadCount(
                                                (items || []).filter(
                                                  (n) => !n.read_at,
                                                ).length,
                                              );
                                            } catch (_) {}
                                          }}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                          title="Mark as read"
                                        >
                                          <svg
                                            className="h-4 w-4 text-logoBlue"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* View All Button */}
                          {notifications && notifications.length > 0 && (
                            <div className="p-2 border-t border-gray-100 bg-gray-50">
                              <button
                                onClick={() => {
                                  setShowNotificationsModal(true);
                                  setShowNotifications(false);
                                }}
                                className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-logoBlue text-xs font-semibold rounded transition-all duration-200 flex items-center justify-center gap-1.5"
                              >
                                <Bell className="h-3.5 w-3.5" />
                                View All
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={desktopProfileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-8 w-8 bg-logoBlue rounded-full overflow-hidden flex items-center justify-center">
                        {profile?.profile_image_url ? (
                          <img
                            src={profile.profile_image_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-medium">
                            {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-logoBlue">
                        {profile?.name || "User"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                        >
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 text-gray-500" />
                            <span>Profile Settings</span>
                          </Link>
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                              isSigningOut
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <LogOut className="h-4 w-4" />
                            <span>
                              {isSigningOut ? "Signing Out..." : "Sign Out"}
                            </span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Feedback Button - Hide for admin users */}
                  {profile?.role !== "admin" && (
                    <div className="relative">
                      <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MessageSquare className="h-5 w-5 text-gray-500 hover:text-logoBlue" />
                      </button>

                      {/* Floating Notification Bubble */}
                      <AnimatePresence>
                        {showFeedbackFloat && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            className="absolute top-full right-0 mt-4 w-48 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-xs font-medium rounded-lg shadow-xl z-50"
                          >
                            {/* Arrow pointing up to feedback button */}
                            <div className="absolute bottom-full right-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-600"></div>

                            <div className="p-2 relative">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowFeedbackFloat(false);
                                }}
                                className="absolute top-1.5 right-1.5 hover:bg-white/20 rounded p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="flex items-center gap-1.5 pr-5">
                                <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                                <div className="flex-1 leading-tight text-center">
                                  <div>Help Us Improve!</div>
                                  <div>Share your feedback</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === "/login"
                        ? "text-logoBlue border-b-2 border-logoBlue"
                        : "text-gray-600 hover:text-logoBlue"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === "/signup" ||
                      location.pathname.startsWith("/signup/")
                        ? "bg-logoBlue text-white shadow-md"
                        : "bg-logoBlue text-white hover:bg-navy-800"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Feedback Button */}
              {shouldShowProfile && profile?.role !== "admin" && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="p-2 rounded-md text-gray-500 hover:text-logoBlue hover:bg-gray-100 transition-colors active:scale-95"
                  title="Help Us Improve"
                  aria-label="Open Feedback Modal"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              )}

              {/* Mobile Profile Dropdown - for authenticated users */}
              {shouldShowProfile ? (
                <div className="relative" ref={mobileProfileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-1 p-2 rounded-md text-gray-500 hover:text-logoBlue hover:bg-gray-100"
                  >
                    <div className="h-6 w-6 bg-logoBlue rounded-full overflow-hidden flex items-center justify-center">
                      {profile?.profile_image_url ? (
                        <img
                          src={profile.profile_image_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-medium">
                          {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Mobile Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleSignOut();
                          }}
                          disabled={isSigningOut}
                          className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                            isSigningOut
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>
                            {isSigningOut ? "Signing Out..." : "Sign Out"}
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Mobile Menu Toggle - for non-authenticated users */
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-logoBlue hover:bg-gray-100"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Show for all users */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 shadow-lg bg-white"
            >
              <div className="px-6 py-6 space-y-3 max-w-md mx-auto">
                {/* Public Navigation for Mobile */}
                {publicNavLinks.map((link) =>
                  link.scrollTo ? (
                    <button
                      key={`mobile-${link.path}-${link.scrollTo}`}
                      onClick={() => {
                        handleScrollNavigation(link.scrollTo);
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full px-6 py-3 text-center text-base font-semibold rounded-lg transition-all duration-200 ${
                        isLinkActive(link)
                          ? "text-logoBlue bg-blue-50 border border-blue-100"
                          : "text-gray-600 hover:text-logoBlue hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={`mobile-${link.path}-${link.label}`}
                      to={link.path}
                      className={`block px-6 py-3 text-center text-base font-semibold rounded-lg transition-all duration-200 ${
                        isLinkActive(link)
                          ? "text-logoBlue bg-blue-50 border border-blue-100"
                          : "text-gray-600 hover:text-logoBlue hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ),
                )}

                {/* Mobile Auth Section - Only for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="pt-4 space-y-3 border-t border-gray-200">
                    <Link
                      to="/login"
                      className={`block px-6 py-3 text-center text-base font-semibold rounded-lg transition-all duration-200 border ${
                        location.pathname === "/login"
                          ? "text-logoBlue bg-blue-50 border border-blue-100"
                          : "text-gray-600 hover:text-logoBlue hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className={`block px-6 py-3 text-center text-base font-bold rounded-lg transition-all duration-200 shadow-md ${
                        location.pathname === "/signup" ||
                        location.pathname.startsWith("/signup/")
                          ? "bg-[#001a5c] text-white border-2 border-transparent"
                          : "bg-logoBlue text-white hover:bg-navy-900"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />

        {/* Notifications Modal */}
        <AnimatePresence>
          {showNotificationsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              onClick={() => setShowNotificationsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Bell className="h-6 w-6 text-logoBlue" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-logoBlue">
                        All Notifications
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {notifications.length} total • {unreadCount} unread
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-logoBlue rounded-lg transition-colors text-sm font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotificationsModal(false)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-400 hover:text-logoBlue" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto max-h-[calc(85vh-120px)] custom-scrollbar">
                  {!notifications || notifications.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                        <Bell className="h-16 w-16 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No notifications yet
                      </h3>
                      <p className="text-gray-500">
                        {notifications === null
                          ? "Loading your notifications..."
                          : "You're all caught up! Check back later for updates."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 p-6">
                      {notifications.map((n) => (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-5 rounded-xl border-2 transition-all cursor-pointer group ${
                            !n.read_at
                              ? "bg-blue-50 border-logoBlue hover:bg-blue-100"
                              : "bg-white border-transparent hover:bg-gray-50"
                          }`}
                          onClick={async () => {
                            if (!n.read_at) {
                              try {
                                await db.markNotificationAsRead(n.id);
                                const items = await db.getUserNotifications(
                                  profile.id,
                                  50,
                                );
                                setNotifications(items || []);
                                setUnreadCount(
                                  (items || []).filter((n) => !n.read_at)
                                    .length,
                                );
                              } catch (_) {}
                            }

                            // Navigate based on notification type for admin users
                            if (profile?.role === "admin" && n.data?.link) {
                              const notifType = n.data?.notification_type;
                              let targetPath = n.data.link;

                              // Add query params for specific notification types
                              if (notifType === "user_report") {
                                targetPath = "/admin/users?openReports=true";
                              }

                              navigate(targetPath);
                              setShowNotificationsModal(false);
                            }
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div
                              className={`flex-shrink-0 p-3 rounded-xl ${
                                !n.read_at ? "bg-blue-50" : "bg-gray-100"
                              }`}
                            >
                              {n.type === "user_report" && (
                                <Flag className="h-6 w-6 text-red-500" />
                              )}
                              {n.type === "donation_request" && (
                                <Gift className="h-6 w-6 text-blue-500" />
                              )}
                              {n.type === "volunteer_request" && (
                                <Truck className="h-6 w-6 text-green-500" />
                              )}
                              {n.type === "delivery_completed" && (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              )}
                              {n.type === "volunteer_approved" && (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              )}
                              {n.type === "delivery_assigned" && (
                                <Truck className="h-6 w-6 text-blue-500" />
                              )}
                              {n.type === "system_alert" && (
                                <Info className="h-6 w-6 text-blue-500" />
                              )}
                              {![
                                "user_report",
                                "donation_request",
                                "volunteer_request",
                                "delivery_completed",
                                "volunteer_approved",
                                "delivery_assigned",
                                "system_alert",
                              ].includes(n.type) && (
                                <Bell className="h-6 w-6 text-logoBlue" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  {!n.read_at && (
                                    <span className="h-2.5 w-2.5 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></span>
                                  )}
                                  <h3
                                    className={`text-base font-bold ${
                                      n.type === "user_report"
                                        ? "text-red-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {n.title || "Notification"}
                                  </h3>
                                </div>
                                {!n.read_at ? (
                                  <span className="px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                                    NEW
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full whitespace-nowrap">
                                    READ
                                  </span>
                                )}
                              </div>

                              <p
                                className={`text-sm mb-3 ${
                                  n.type === "user_report"
                                    ? "text-red-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {n.message}
                              </p>

                              {/* Show clickable hint for admin notifications with links */}
                              {profile?.role === "admin" && n.data?.link && (
                                <div className="flex items-center gap-2 text-blue-600 text-xs font-medium mb-2">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>
                                  Click to view details
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>
                                    {new Date(n.created_at).toLocaleString()}
                                  </span>
                                </div>

                                {!n.read_at && (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        await db.markNotificationAsRead(n.id);
                                        const items =
                                          await db.getUserNotifications(
                                            profile.id,
                                            50,
                                          );
                                        setNotifications(items || []);
                                        setUnreadCount(
                                          (items || []).filter(
                                            (n) => !n.read_at,
                                          ).length,
                                        );
                                      } catch (_) {}
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-logoBlue rounded-lg text-xs font-semibold flex items-center gap-1"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
