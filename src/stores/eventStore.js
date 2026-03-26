// Events Zustand store - manages events UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useEventStore = create(
  devtools(
    (set) => ({
      // UI state
      selectedEvent: null,
      filters: {
        status: '',
        search: '',
        dateRange: null,
      },
      isCreateModalOpen: false,
      isAttendanceModalOpen: false,

      // Actions
      setSelectedEvent: (event) =>
        set({ selectedEvent: event }, false, 'events/setSelected'),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }), false, 'events/setFilters'),

      resetFilters: () =>
        set({
          filters: { status: '', search: '', dateRange: null },
        }, false, 'events/resetFilters'),

      setCreateModalOpen: (open) =>
        set({ isCreateModalOpen: open }, false, 'events/setCreateModal'),

      setAttendanceModalOpen: (open) =>
        set({ isAttendanceModalOpen: open }, false, 'events/setAttendanceModal'),

      clearSelection: () =>
        set({ selectedEvent: null }, false, 'events/clearSelection'),
    }),
    { name: 'EventStore' }
  )
)

export default useEventStore
