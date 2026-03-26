// Donations Zustand store - manages donor-side UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useDonationStore = create(
  devtools(
    (set, get) => ({
      // UI state
      selectedDonation: null,
      filters: {
        category: '',
        status: '',
        search: '',
        sortBy: 'newest',
      },
      isCreateModalOpen: false,
      isEditModalOpen: false,

      // Actions
      setSelectedDonation: (donation) =>
        set({ selectedDonation: donation }, false, 'donations/setSelected'),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }), false, 'donations/setFilters'),

      resetFilters: () =>
        set({
          filters: { category: '', status: '', search: '', sortBy: 'newest' },
        }, false, 'donations/resetFilters'),

      setCreateModalOpen: (open) =>
        set({ isCreateModalOpen: open }, false, 'donations/setCreateModal'),

      setEditModalOpen: (open) =>
        set({ isEditModalOpen: open }, false, 'donations/setEditModal'),

      clearSelection: () =>
        set({ selectedDonation: null }, false, 'donations/clearSelection'),
    }),
    { name: 'DonationStore' }
  )
)

export default useDonationStore
