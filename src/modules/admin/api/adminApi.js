// Admin module API - wraps admin-related db methods
import { db } from '@/shared/lib/supabase'

export const adminApi = {
  // Users management
  getAllUsers: (filters) => db.getAllUsers(filters),
  getUserCounts: () => db.getUserCounts(),
  getAllAdminUsers: () => db.getAllAdminUsers(),
  getAdminUsers: () => db.getAdminUsers(),

  // Reports
  getReportedUsers: (status) => db.getReportedUsers(status),
  getReportCount: (status) => db.getReportCount(status),
  createUserReport: (data) => db.createUserReport(data),
  updateReportStatus: (reportId, status, reviewedBy, notes) => db.updateReportStatus(reportId, status, reviewedBy, notes),

  // Settings
  getSettings: () => db.getSettings(),
  updateSettings: (settings) => db.updateSettings(settings),
  setRetentionDays: (days) => db.setRetentionDays(days),
  setAutoAssignEnabled: (enabled) => db.setAutoAssignEnabled(enabled),

  // System
  getDatabaseBackups: (type) => db.getDatabaseBackups(type),
  checkAndCreateWeeklyBackup: () => db.checkAndCreateWeeklyBackup(),
  createDatabaseBackup: (type) => db.createDatabaseBackup(type),
  deleteDatabaseBackup: (id) => db.deleteDatabaseBackup(id),
  downloadDatabaseBackup: (id) => db.downloadDatabaseBackup(id),
  logSystemEvent: (...args) => db.logSystemEvent(...args),
  cleanupOldSystemLogs: (days) => db.cleanupOldSystemLogs(days),
  getSystemLogs: (...args) => db.getSystemLogs(...args),
  checkSystemHealth: () => db.checkSystemHealth(),
  runAutomaticMaintenance: () => db.runAutomaticMaintenance(),
}

export default adminApi
