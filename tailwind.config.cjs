/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#E27254',
          hover: '#D16346',
          light: '#F5E6E1',
        },
        skyblue: {
          DEFAULT: '#87CEBB',
          hover: '#76BCAB',
          light: '#E6F4F1',
        },
        sagegreen: {
          DEFAULT: '#8FBC8F',
          hover: '#7EAB7E',
          light: '#EAF2EA',
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        heading: ['Montserrat', 'sans-serif'],
        subheading: ['Montserrat', 'sans-serif'],
        quote: ['Playfair Display', 'serif'],
      }
    }
  },
  plugins: []
}
