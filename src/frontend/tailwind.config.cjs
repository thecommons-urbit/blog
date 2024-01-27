/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'San Francisco',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      mono: [
        'ui-monospace',
        'Geist Mono Light',
        'Fira Mono',
        'Menlo',
        'Monaco',
        'Cascadia Mono',
        'Segoe UI Mono',
        'Roboto Mono',
        'Oxygen Mono',
        'Ubuntu Monospace',
        'Source Code Pro',
        'Droid Sans Mono',
        'Courier New',
        'monospace',
      ],
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
        darkergray: '#3D3D3D'
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}
