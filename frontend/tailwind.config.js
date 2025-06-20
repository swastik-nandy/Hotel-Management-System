import plugin from 'tailwindcss/plugin';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans], // ShadCN / Apple-style font
        stylish: ["Playfair Display", "serif"],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cinzel: ["Cinzel", "serif"],
      },
      colors: {
        leafGreen: '#3BAA5F',
        stemBrown: '#4B3E2F',
        hotelDark: '#1e293b',
        neonBlue: '#00ffff',
        glowOrange: '#f97316',
      },
      animation: {
        leafBounce: 'leafBounce 2.5s ease-in-out infinite',
        leafSway: 'sway 4s ease-in-out infinite',
        sway: 'sway 3s ease-in-out infinite',
        cloud1: 'cloud1 60s linear infinite',
        cloud2: 'cloud2 80s linear infinite',
        starTwinkle: 'twinkle 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        pulseSlow: 'pulse 5s ease-in-out infinite',
      },
      keyframes: {
        leafBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        cloud1: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        cloud2: {
          '0%': { transform: 'translateX(-100vw)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      });
    }),
  ],
};
