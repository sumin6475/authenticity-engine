/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'mobile': '430px',
      },
      colors: {
        'ae-blue': '#7dd3fc',
        'ae-blue-dark': '#38bdf8',
        'ae-bg': '#f8fafc',
        'ae-card': '#f1f5f9',
      },
      boxShadow: {
        'soft': '0 4px 14px rgba(0,0,0,0.06)',
        'nav': '0 -2px 10px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
