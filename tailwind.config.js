/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Organization theme colors (mapped to purple/indigo requested by user)
        primary: {
          50: '#f2effa',
          100: '#e0dcf4',
          200: '#c6bdeb',
          300: '#a392de',
          400: '#7d61cd',
          500: '#5c3bbb',
          600: '#47279c',
          700: '#361c7d',
          800: '#2d186c',
          900: '#210976', // User requested
          950: '#150456',
        },
        // Dark blue from logo (dominant background)
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Logo dark color (Mapped to primary-900 for broad usage)
        logoBlue: '#210976',
        // White from logo (text and outlines)
        white: '#ffffff',
        // Yellow-green secondary colors
        secondary: {
          50: '#f8fae8',
          100: '#eef4c5',
          200: '#e0eb96',
          300: '#d0df5d',
          400: '#cbd93a', // User requested main yellow/green
          500: '#adbc29', // Darker
          600: '#86961c', // Darker
          700: '#657218',
          800: '#525c17',
          900: '#454e17',
        },
        // Legacy colors for compatibility
        skyblue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Custom yellow color - kept for compatibility
        yellow: {
          50: '#f8fae8',
          100: '#eef4c5',
          200: '#e0eb96',
          300: '#d0df5d',
          400: '#cbd93a', // User requested
          500: '#cbd93a',
          600: '#adbc29',
          700: '#86961c',
          800: '#657218',
          900: '#525c17',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} 