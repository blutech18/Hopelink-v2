// Notification Zustand store
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useNotificationStore = create(
  devtools(
    (set, get) => ({
      // State
      unreadCount: 0,

      // Actions
      setUnreadCount: (count) =>
        set({ unreadCount: count }, false, 'notifications/setUnreadCount'),

      incrementUnread: () =>
        set((state) => ({ unreadCount: state.unreadCount + 1 }), false, 'notifications/increment'),

      decrementUnread: () =>
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount - 1),
        }), false, 'notifications/decrement'),

      resetUnread: () =>
        set({ unreadCount: 0 }, false, 'notifications/resetUnread'),
    }),
    { name: 'NotificationStore' }
  )
)

export default useNotificationStore
