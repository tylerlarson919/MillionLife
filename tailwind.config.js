const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gemini-dark-900": "#1b1c1d", // Main background
        "gemini-dark-800": "#282a2c", // Sidebar/surface
        "gemini-dark-700": "#3c4043", // Hover/active items
        "gemini-text": "#e0e0e0", // Primary text
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [heroui()],
};
module.exports = config;