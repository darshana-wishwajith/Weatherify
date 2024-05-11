/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./dist/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'dark-bg' : '#0E162A',
        'light-bg' : '#FEFFFE',
        'dark-bg-secondary' : '#1D273A',
        'dark-bg-secondary-hover' : '#2B3446',
        'light-secondary' : '#EBEDF0',

        'dark-heading' : '#E3E9F0',
        'light-heading' : '#0E162A',
        'dark-txt' : '#8B98AE',
        'light-txt' : '4A5669',
        'dark-txt-hover' : '#C6D0DD',

        'dark-border' : '#e5e7eb',

        'accent' : '#00B3F0'

      },
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'animate-spin': 'spin 0.1s linear infinite',
      }
    },
  },
  plugins: [],
}

