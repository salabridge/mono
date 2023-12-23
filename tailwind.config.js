import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,svelte,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        headers: '"Josefin Sans"',
      },
      colors: {
        primary: {
          500: '#00758A',
        },
        secondary: {
          500: '#00a29A'
        }
      }
    },
  },
  plugins: [
    plugin(({
      addUtilities,
      theme
    }) => {
      addUtilities({
        '.h1': {
          'font-size': theme('fontSize.3xl'),
          'font-weight': theme('fontWeight.bold'),
          'font-family': theme('fontFamily.headers'),
        },
        '.h2': {
          'font-size': theme('fontSize.2xl'),
          'font-weight': theme('fontWeight.semibold'),
          'font-family': theme('fontFamily.headers')
        },
        '.h3': {
          'font-size': theme('fontSize.xl'),
          'font-family': theme('fontFamily.headers'),
          'text-decoration': 'underline',
        },
        '.h4': {
          'font-family': theme('fontFamily.headers'),
          'font-size': theme('fontSize.lg'),
          'font-weight': theme('fontWeight.bold'),
        },
        '.h5': {
          'font-family': theme('fontFamily.headers'),
          'font-size': theme('fontSize.lg'),
          'font-weight': theme('fontWeight.semibold'),
        },
        '.h6': {
          'font-family': theme('fontFamily.headers'),
          'font-size': theme('fontSize.md'),
          'font-weight': theme('fontWeight.semibold'),
        }
      })
    })
  ],
}

