// Pending Requests Zustand store — UI state for PendingRequestsPage
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const usePendingRequestsStore = create(
  devtools(
    (set) => ({
      // Filters / search
      searchTerm: '',

      // Selected items
      selectedRequest: null,
      selectedProfile: null,

      // Modals
      showDetailsModal: false,
      showProfileModal: false,
      showProfileImageModal: false,

      // Processing
      processingRequestId: null,
      approvedRequestIds: new Set(),

      // ── Actions ──────────────────────────────────────────────
      setSearchTerm: (term) =>
        set({ searchTerm: term }, false, 'pendingRequests/setSearchTerm'),

      setSelectedRequest: (request) =>
        set({ selectedRequest: request }, false, 'pendingRequests/setSelectedRequest'),

      setSelectedProfile: (profile) =>
        set({ selectedProfile: profile }, false, 'pendingRequests/setSelectedProfile'),

      openDetailsModal: (request) =>
        set({ selectedRequest: request, showDetailsModal: true }, false, 'pendingRequests/openDetailsModal'),

      closeDetailsModal: () =>
        set({ showDetailsModal: false }, false, 'pendingRequests/closeDetailsModal'),

      openProfileModal: (profile) =>
        set({ selectedProfile: profile, showProfileModal: true }, false, 'pendingRequests/openProfileModal'),

      closeProfileModal: () =>
        set({ showProfileModal: false }, false, 'pendingRequests/closeProfileModal'),

      setShowProfileImageModal: (show) =>
        set({ showProfileImageModal: show }, false, 'pendingRequests/setShowProfileImageModal'),

      setProcessingRequestId: (id) =>
        set({ processingRequestId: id }, false, 'pendingRequests/setProcessingRequestId'),

      addApprovedRequestId: (id) =>
        set((state) => {
          const next = new Set(state.approvedRequestIds)
          next.add(id)
          return { approvedRequestIds: next }
        }, false, 'pendingRequests/addApprovedRequestId'),

      removeApprovedRequestId: (id) =>
        set((state) => {
          const next = new Set(state.approvedRequestIds)
          next.delete(id)
          return { approvedRequestIds: next }
        }, false, 'pendingRequests/removeApprovedRequestId'),

      // Reset all transient UI state (called on unmount or page leave)
      reset: () =>
        set({
          searchTerm: '',
          selectedRequest: null,
          selectedProfile: null,
          showDetailsModal: false,
          showProfileModal: false,
          showProfileImageModal: false,
          processingRequestId: null,
          approvedRequestIds: new Set(),
        }, false, 'pendingRequests/reset'),
    }),
    { name: 'PendingRequestsStore' }
  )
)

export default usePendingRequestsStore
