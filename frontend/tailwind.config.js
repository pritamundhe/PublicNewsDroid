module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        times: ['"Merriweather"', 'Times', 'serif'],
      },
    },
  },
  plugins: [
  require('@tailwindcss/line-clamp'),
],
};
