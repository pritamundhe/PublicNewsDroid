module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        serif: ['"Merriweather"', 'serif'],
      },
    },
  },
  plugins: [
  require('@tailwindcss/line-clamp'),
],
};
