/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        ink: 'var(--ink)',
        line: 'var(--line)',
        mist: 'var(--mist)',
        brand: 'var(--brand)',
        coral: 'var(--coral)',
        gold: 'var(--gold)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
        lift: '0 28px 60px color-mix(in srgb, var(--brand) 22%, transparent)',
      },
    },
  },
  plugins: [],
};
