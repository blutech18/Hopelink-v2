// Auth module barrel export
export { default as authApi } from './api/authApi'
export * from './hooks/useAuthQueries'

// Pages (lazy-loaded in App.jsx, not exported here)
// Components
export { default as CaptchaModal } from './components/CaptchaModal'
export { default as RoleSelectionModal } from './components/RoleSelectionModal'
