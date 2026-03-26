// Notifications module API
import { db } from '@/shared/lib/supabase'

export const notificationsApi = {
  createNotification: (data) => db.createNotification(data),
  getUserNotifications: (userId, limit) => db.getUserNotifications(userId, limit),
  markNotificationAsRead: (id) => db.markNotificationAsRead(id),
  notifyAllAdmins: (data, excludeUserId) => db.notifyAllAdmins(data, excludeUserId),
}

export default notificationsApi
