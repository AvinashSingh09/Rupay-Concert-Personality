/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        brush: ['"Permanent Marker"', '"Caveat Brush"', 'cursive'],
        script: ['"Kaushan Script"', 'cursive'],
      },
      colors: {
        concert: {
          bg: '#0c0521',
          card: '#1b0e3a',
          border: '#7952b3',
        }
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSparkle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.85' },
          '50%': { transform: 'translateY(-3px) rotate(8deg)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'sparkle': 'floatSparkle 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.25s ease-out forwards',
      }
    },
  },
  plugins: [],
};
