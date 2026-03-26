// Requests Zustand store - manages recipient-side UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useRequestStore = create(
  devtools(
    (set) => ({
      // UI state
      selectedRequest: null,
      filters: {
        category: '',
        urgency: '',
        status: '',
        search: '',
        sortBy: 'newest',
      },

      // Actions
      setSelectedRequest: (request) =>
        set({ selectedRequest: request }, false, 'requests/setSelected'),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }), false, 'requests/setFilters'),

      resetFilters: () =>
        set({
          filters: { category: '', urgency: '', status: '', search: '', sortBy: 'newest' },
        }, false, 'requests/resetFilters'),

      clearSelection: () =>
        set({ selectedRequest: null }, false, 'requests/clearSelection'),
    }),
    { name: 'RequestStore' }
  )
)

export default useRequestStore
