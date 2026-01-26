/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        secondary: '#D2691E',
        accent: '#DAA520',
        cream: '#FFF8DC',
        warmWhite: '#FFFAF0',
        burgundy: '#722F37',
        olive: '#556B2F',
        charcoal: '#36454F',
        coffee: '#6F4E37',
        terracotta: '#E2725B',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
