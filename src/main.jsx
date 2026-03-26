import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './modules/auth/AuthContext.jsx'
import { ToastProvider } from './shared/contexts/ToastContext.jsx'
import GoogleMapsLoader from './shared/components/ui/GoogleMapsLoader.jsx'
import { QueryProvider } from './shared/providers/QueryProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <GoogleMapsLoader>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </GoogleMapsLoader>
    </QueryProvider>
  </React.StrictMode>,
) 