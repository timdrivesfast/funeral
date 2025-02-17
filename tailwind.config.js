/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.4',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'modal-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)',
            filter: 'blur(8px)'
          },
          '60%': {
            opacity: '0.8',
            transform: 'scale(1.02) translateY(-5px)',
            filter: 'blur(0)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
            filter: 'blur(0)'
          },
        },
        'backdrop-in': {
          '0%': {
            opacity: '0',
            backdropFilter: 'blur(0)',
          },
          '100%': {
            opacity: '1',
            backdropFilter: 'blur(8px)',
          },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'modal-in': 'modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'backdrop-in': 'backdrop-in 0.5s ease-out forwards'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

