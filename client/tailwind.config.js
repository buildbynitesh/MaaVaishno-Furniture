/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        beige: '#E8DDD0',
        sand: '#D4C5B0',
        wood: '#8B6914',
        'wood-light': '#C4A35A',
        'wood-dark': '#5C3D11',
        bark: '#3D2B1F',
        linen: '#FAF7F2',
        ivory: '#FFFFF0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 4px 40px rgba(61, 43, 31, 0.12)',
        'card': '0 2px 20px rgba(61, 43, 31, 0.08)',
        'hover': '0 8px 40px rgba(61, 43, 31, 0.18)',
      },
      backgroundImage: {
        'wood-grain': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"0.04\"/%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
