/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Futura-Bold', 'Trebuchet MS', 'Arial', 'sans-serif'],
    },
    extend: {
      gridTemplateRows: {
        12: 'repeat(12, (minmax(0, 1fr))',
      },
      gridRow: {
        'span-10': 'span 10 / span 10',
      },
      colors: {
        gray: '#F1F1F1',
        darkgray: '#4D4D4D',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}
