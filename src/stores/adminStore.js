// Admin Zustand store - manages admin panel UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAdminStore = create(
  devtools(
    (set) => ({
      // UI state
      activeSection: 'overview',
      selectedUser: null,
      isSettingsOpen: false,

      // Actions
      setActiveSection: (section) =>
        set({ activeSection: section }, false, 'admin/setActiveSection'),

      setSelectedUser: (user) =>
        set({ selectedUser: user }, false, 'admin/setSelectedUser'),

      setSettingsOpen: (open) =>
        set({ isSettingsOpen: open }, false, 'admin/setSettingsOpen'),

      clearSelection: () =>
        set({ selectedUser: null }, false, 'admin/clearSelection'),
    }),
    { name: 'AdminStore' }
  )
)

export default useAdminStore
