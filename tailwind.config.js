/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#182033',
        line: '#d7dde8',
        mist: '#f5f7fb',
        brand: '#0f5e59',
        coral: '#d8573d',
        gold: '#c8942c',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(24, 32, 51, 0.10)',
      },
    },
  },
  plugins: [],
};
