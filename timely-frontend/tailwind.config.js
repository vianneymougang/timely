/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        surface: {
          DEFAULT: '#ffffff',
          sub:    '#f3f4f6',
          canvas: '#f9fafb',
        },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(17,24,39,0.04)',
        sm: '0 2px 8px rgba(17,24,39,0.06)',
        md: '0 4px 16px rgba(17,24,39,0.08)',
        lg: '0 8px 32px rgba(17,24,39,0.10)',
      },
    },
  },
  plugins: [],
};
