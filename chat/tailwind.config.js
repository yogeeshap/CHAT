/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./index.html', './src/**/*.{html,js,jsx,ts,tsx}'],
//   important: '#root',
important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#F7AC1D',
          500: '#F7901D',
          600: '#ED8109',
        },
      },
    },
  },
  plugins: [],
}

// tailwind css won't be applied to elements outside root element, like modal, drawer(which are out side root but inside document)
