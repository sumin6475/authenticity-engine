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
        'ae-bg': 'var(--ae-bg)',
        'ae-surface': 'var(--ae-surface)',
        'ae-card': '#f1f5f9',
      },
      boxShadow: {
        'ae-card': 'var(--ae-card-shadow)',
        'soft': 'var(--ae-card-shadow)',
        'nav': '0 -2px 10px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'ae-card': 'var(--ae-radius-card)',
        'ae-inner': 'var(--ae-radius-inner)',
      },
      spacing: {
        'ae-card': 'var(--ae-space-card)',
        'ae-card-lg': 'var(--ae-space-card-lg)',
        'ae-section': 'var(--ae-space-section)',
      },
    },
  },
  plugins: [],
}
