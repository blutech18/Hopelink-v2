import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for all files, including context files
      fastRefresh: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.hcaptcha.com https://maps.googleapis.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.hcaptcha.com https://*.googleapis.com https://hcaptcha.com; frame-src https://*.hcaptcha.com https://www.google.com;"
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Production optimizations
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Don't chunk source files
          if (!id.includes('node_modules')) {
            return null
          }

          // --- Standalone heavy libraries (no React dependency issues) ---
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/jspdf-autotable')) {
            return 'vendor-pdf'
          }
          if (id.includes('node_modules/html2canvas')) {
            return 'vendor-canvas'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }

          // --- Charting (recharts + d3 dependencies) ---
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
            return 'vendor-recharts'
          }

          // --- Animation (framer-motion) ---
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/@motionone')) {
            return 'vendor-framer'
          }

          // --- Google Maps ---
          if (id.includes('node_modules/@react-google-maps') || id.includes('node_modules/@vis.gl/react-google-maps') || id.includes('node_modules/@googlemaps')) {
            return 'vendor-maps'
          }

          // --- Radix UI components ---
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix'
          }

          // --- Icons ---
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/lucide')) {
            return 'vendor-icons'
          }

          // --- Utility libraries ---
          if (
            id.includes('node_modules/date-fns') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge') ||
            id.includes('node_modules/zustand') ||
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@tanstack')
          ) {
            return 'vendor-utils'
          }

          // --- Core React (react, react-dom, react-router, scheduler, etc.) ---
          return 'vendor-react'
        },
      },
    },
    chunkSizeWarningLimit: 600, // Tighter limit now that chunks are properly split
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Production build optimizations
    target: 'esnext',
    cssCodeSplit: true,
    reportCompressedSize: false, // Faster builds
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true,
  },
})