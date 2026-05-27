/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /banquet-(gold|peach|cream|red|green|ink|muted)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        banquet: {
          gold: '#DAA520',
          peach: '#FFDAB9',
          cream: '#FFFDD0',
          red: '#DC143C',
          green: '#006400',
          ink: '#000000',
          muted: '#006400',
        },
        primary: {
          500: '#DC143C',
          600: '#b01030',
          700: '#8a0c25',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(45, 18, 25, 0.08), 0 4px 12px rgba(45, 18, 25, 0.05)',
        soft: '0 2px 8px rgba(45, 18, 25, 0.08)',
      },
    },
  },
  plugins: [],
}
