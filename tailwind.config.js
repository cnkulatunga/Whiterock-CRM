/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      '2xl': {'max': '1535px'},
      'xl': {'max': '1279px'},
      'lg': {'max': '1024px'},
      'md': {'max': '768px'},
      'sm': {'max': '640px'},
    },
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pageSlide: {
          'from': { opacity: '0', transform: 'translateX(10px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        headerDrop: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        kpiPop: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(14px)' },
          '70%': { transform: 'scale(1.04) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        memberSlide: {
          'from': { opacity: '0', transform: 'translateX(-14px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        tabSlide: {
          'from': { opacity: '0', transform: 'translateX(-10px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        avatarPop: {
          '0%': { transform: 'scale(0.7) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.12) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        rowIn: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        barGrow: {
          '0%': { opacity: '0', transform: 'translateY(12px) scaleX(0.8)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleX(1)' },
        },
        progressFill: {
          'from': { transform: 'scaleX(0)' },
          'to': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pageSlide: 'pageSlide 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        shake: 'shake 0.2s ease-in-out 0s 2',
        popIn: 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        slideDown: 'slideDown 0.25s ease-out',
        headerDrop: 'headerDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        kpiPop: 'kpiPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        memberSlide: 'memberSlide 0.3s ease both',
        tabSlide: 'tabSlide 0.35s ease both',
        avatarPop: 'avatarPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        rowIn: 'rowIn 0.3s ease both',
        barGrow: 'barGrow 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        progressFill: 'progressFill 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
