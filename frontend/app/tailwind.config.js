/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{html,ts}",  // 👈 important so Angular templates get scanned
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeInScale: 'fadeInScale 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
