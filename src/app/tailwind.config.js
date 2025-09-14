/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // 👈 important so Angular templates get scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
