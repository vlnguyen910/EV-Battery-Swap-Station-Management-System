/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'battery-glow': 'battery-glow 2s ease-in-out infinite',
        'float-up': 'float-up 1.5s ease-out forwards',
        'success-bounce': 'success-bounce 2s ease-in-out infinite',
        'person-happy': 'person-happy 1s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'battery-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-40px) scale(1.2)', opacity: '0' },
        },
        'success-bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) scale(1)' },
          '40%': { transform: 'translateY(-10px) scale(1.05)' },
          '60%': { transform: 'translateY(-5px) scale(1.02)' },
        },
        'person-happy': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(2deg)' },
          '75%': { transform: 'translateY(-5px) rotate(-2deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
