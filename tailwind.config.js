/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: 'rgb(var(--color-neon) / <alpha-value>)',
        black: '#000000',
        glass: 'rgba(0, 0, 0, 0.7)',
      },
      boxShadow: {
        neon: '0 0 10px rgb(var(--color-neon)), 0 0 20px rgb(var(--color-neon))',
        'neon-sm': '0 0 5px rgb(var(--color-neon))',
        'neon-glow': '0 0 15px rgba(var(--color-neon), 0.5)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgb(var(--color-neon))' },
          '50%': { opacity: '.8', boxShadow: '0 0 20px rgb(var(--color-neon))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}