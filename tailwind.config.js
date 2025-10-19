/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 requires this preset
  presets: [require('nativewind/preset')],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00BCD4',
          50: '#B2EBF2',
          100: '#80DEEA',
          200: '#4DD0E1',
          300: '#26C6DA',
          400: '#00BCD4',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
      },
    },
  },
  plugins: [],
}

