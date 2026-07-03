/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        darkBg: '#09090b', // Deep Dark Zinc
        darkCard: '#121215', // Card slate
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        emeraldBrand: {
          500: '#10b981',
          600: '#059669',
        },
      },
      animation: {
        'blob-float-1': 'float-1 25s infinite alternate ease-in-out',
        'blob-float-2': 'float-2 30s infinite alternate ease-in-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'float-1': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(50px, -80px) scale(1.2)' },
          '100%': { transform: 'translate(-20px, 40px) scale(0.9)' },
        },
        'float-2': {
          '0%': { transform: 'translate(0px, 0px) scale(1.1)' },
          '50%': { transform: 'translate(-60px, 70px) scale(0.85)' },
          '100%': { transform: 'translate(40px, -30px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
