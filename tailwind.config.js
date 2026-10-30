/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0d0c0b',
          950: '#0d0c0b',
        },
        darkbg: '#0d0c0b',
      },
    },
  },
  plugins: [],
}