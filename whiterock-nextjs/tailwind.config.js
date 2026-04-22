/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Exact design tokens from original HTML
        navy: {
          DEFAULT: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        brand: {
          DEFAULT: '#2447d7',
          50:  '#ebf0ff',
          100: '#d4e0ff',
          500: '#2447d7',
          600: '#1e3db8',
        },
        indigo: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
        },
        surface: {
          DEFAULT: '#f8fafc',
          border: '#f1f5f9',
          card:   '#ffffff',
        },
        muted: '#94a3b8',
        subtle: '#64748b',
      },
      borderRadius: {
        card: '24px',
        panel: '12px',
      },
      boxShadow: {
        card: '0 4px 25px rgba(0,0,0,.04)',
        nav:  '0 1px 2px rgba(0,0,0,.05)',
      },
    },
  },
  plugins: [],
};
