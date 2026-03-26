// UI Zustand store - manages global UI state (modals, sidebar, toasts, etc.)
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useUIStore = create(
  devtools(
    (set) => ({
      // Sidebar
      isSidebarExpanded: false,
      isMobileMenuOpen: false,

      // Global modals
      activeModal: null,
      modalData: null,

      // Actions
      setSidebarExpanded: (expanded) =>
        set({ isSidebarExpanded: expanded }, false, 'ui/setSidebarExpanded'),

      setMobileMenuOpen: (open) =>
        set({ isMobileMenuOpen: open }, false, 'ui/setMobileMenuOpen'),

      openModal: (modalName, data = null) =>
        set({ activeModal: modalName, modalData: data }, false, 'ui/openModal'),

      closeModal: () =>
        set({ activeModal: null, modalData: null }, false, 'ui/closeModal'),
    }),
    { name: 'UIStore' }
  )
)

export default useUIStore
