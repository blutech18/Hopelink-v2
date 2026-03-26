// Admin TanStack Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/adminApi'

export const adminKeys = {
  all: ['admin'],
  users: (filters) => [...adminKeys.all, 'users', filters],
  userCounts: () => [...adminKeys.all, 'userCounts'],
  reports: (status) => [...adminKeys.all, 'reports', status],
  reportCount: (status) => [...adminKeys.all, 'reportCount', status],
  settings: () => [...adminKeys.all, 'settings'],
  backups: (type) => [...adminKeys.all, 'backups', type],
  systemLogs: (...args) => [...adminKeys.all, 'systemLogs', ...args],
  systemHealth: () => [...adminKeys.all, 'systemHealth'],
}

// === Queries ===

export function useAllUsers(filters = {}, options = {}) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: () => adminApi.getAllUsers(filters),
    ...options,
  })
}

export function useUserCounts(options = {}) {
  return useQuery({
    queryKey: adminKeys.userCounts(),
    queryFn: () => adminApi.getUserCounts(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useReportedUsers(status = 'pending', options = {}) {
  return useQuery({
    queryKey: adminKeys.reports(status),
    queryFn: () => adminApi.getReportedUsers(status),
    ...options,
  })
}

export function useReportCount(status = 'pending', options = {}) {
  return useQuery({
    queryKey: adminKeys.reportCount(status),
    queryFn: () => adminApi.getReportCount(status),
    ...options,
  })
}

export function useSettings(options = {}) {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: () => adminApi.getSettings(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

export function useDatabaseBackups(type = null, options = {}) {
  return useQuery({
    queryKey: adminKeys.backups(type),
    queryFn: () => adminApi.getDatabaseBackups(type),
    ...options,
  })
}

export function useSystemLogs(limit, level, category, startDate, endDate, options = {}) {
  return useQuery({
    queryKey: adminKeys.systemLogs(limit, level, category, startDate, endDate),
    queryFn: () => adminApi.getSystemLogs(limit, level, category, startDate, endDate),
    ...options,
  })
}

export function useSystemHealth(options = {}) {
  return useQuery({
    queryKey: adminKeys.systemHealth(),
    queryFn: () => adminApi.checkSystemHealth(),
    refetchInterval: 1000 * 60 * 5,
    ...options,
  })
}

// === Mutations ===

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings) => adminApi.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings() })
    },
  })
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, status, reviewedBy, notes }) =>
      adminApi.updateReportStatus(reportId, status, reviewedBy, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() })
    },
  })
}

export function useCreateDatabaseBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (type) => adminApi.createDatabaseBackup(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.backups() })
    },
  })
}

export function useDeleteDatabaseBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (backupId) => adminApi.deleteDatabaseBackup(backupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.backups() })
    },
  })
}
