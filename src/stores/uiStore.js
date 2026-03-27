// UI Zustand store - manages global UI state (modals, sidebar, toasts, etc.)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Sidebar modes:
// 'hover'     — auto-expand on hover, overlaps page content
// 'pinned'    — always expanded, page content shifts to make room
// 'collapsed' — always collapsed, shows tooltips on hover
const SIDEBAR_MODES = ['hover', 'pinned', 'collapsed']

export const useUIStore = create(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarMode: 'hover', // 'hover' | 'pinned' | 'collapsed'
      isSidebarHovered: false,
      isMobileMenuOpen: false,

      // Dark mode
      isDarkMode: false,

      // Global modals
      activeModal: null,
      modalData: null,

      // Actions
      setSidebarMode: (mode) => {
        if (SIDEBAR_MODES.includes(mode)) {
          set({ sidebarMode: mode })
        }
      },

      cycleSidebarMode: () => {
        const current = get().sidebarMode
        const idx = SIDEBAR_MODES.indexOf(current)
        const next = SIDEBAR_MODES[(idx + 1) % SIDEBAR_MODES.length]
        set({ sidebarMode: next })
      },

      setSidebarHovered: (hovered) => set({ isSidebarHovered: hovered }),

      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      toggleDarkMode: () => {
        const next = !get().isDarkMode
        set({ isDarkMode: next })
        if (next) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      setDarkMode: (enabled) => {
        set({ isDarkMode: enabled })
        if (enabled) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),

      closeModal: () => set({ activeModal: null, modalData: null }),
    }),
    {
      name: 'hopelink-ui-settings',
      partialize: (state) => ({
        sidebarMode: state.sidebarMode,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
)

export default useUIStore
