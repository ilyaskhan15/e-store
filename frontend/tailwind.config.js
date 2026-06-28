/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A1F3A',
        gold: '#E8C547',
        red: '#E63946',
        surface: '#F6F7FB',
        card: '#FFFFFF',
        text: '#111827',
        muted: '#6B7280',
        success: '#22C55E',
        info: '#3B82F6',
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 18px 50px rgba(26, 31, 58, 0.12)',
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(26,31,58,0.92), rgba(26,31,58,0.86)), radial-gradient(circle at top left, rgba(232,197,71,0.15), transparent 35%), radial-gradient(circle at bottom right, rgba(230,57,70,0.18), transparent 28%)',
      },
    },
  },
  plugins: [],
}
