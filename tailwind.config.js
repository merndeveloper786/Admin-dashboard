/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // purple
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        accent: {
          DEFAULT: '#F59E42', // orange
          light: '#FFD8A8',
          dark: '#B26B1F',
        },
        background: '#F5F6FA',
        card: '#FFFFFF',
        border: '#E5E7EB',
        text: '#22223B',
        muted: '#9CA3AF',
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};