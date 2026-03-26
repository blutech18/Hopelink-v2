// Delivery Zustand store - manages delivery/volunteer UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useDeliveryStore = create(
  devtools(
    (set) => ({
      // UI state
      selectedDelivery: null,
      activeTab: 'pending',
      isTrackingModalOpen: false,
      isConfirmationModalOpen: false,

      // Actions
      setSelectedDelivery: (delivery) =>
        set({ selectedDelivery: delivery }, false, 'delivery/setSelected'),

      setActiveTab: (tab) =>
        set({ activeTab: tab }, false, 'delivery/setActiveTab'),

      setTrackingModalOpen: (open) =>
        set({ isTrackingModalOpen: open }, false, 'delivery/setTrackingModal'),

      setConfirmationModalOpen: (open) =>
        set({ isConfirmationModalOpen: open }, false, 'delivery/setConfirmationModal'),

      clearSelection: () =>
        set({ selectedDelivery: null }, false, 'delivery/clearSelection'),
    }),
    { name: 'DeliveryStore' }
  )
)

export default useDeliveryStore
