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
        '.maxed-container': {

        }
      })
      // Heading utilities.
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
      });
      
      // Button utilities
      addUtilities({
        '.btn': {
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          'border-radius': theme('borderRadius.DEFAULT'),
          '&.btn-sm': {
            padding: theme(`spacing.1`),
            'font-size': theme('fontSize.sm')
          },
          '&.btn-lg': {
            padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
            'font-size': theme('fontSize.lg'),
          },
          '&.btn-xl': {
            padding: `${theme('spacing[2.5]')} ${theme('spacing.3')}`,
            'font-size': theme('fontSize.xl'),
          }
        },
        '.btn-icon': {
          padding: theme('spacing.2'),
          'border-radius': theme('borderRadius.full'),
          '&.btn-sm': {
            padding: theme('spacing.1'),
            'font-size': theme('fontSize.sm'),
          },
          '&.btn-lg': {
            padding: theme('spacing[2.5]'),
            'font-size': theme('fontSize.lg')
          },
          '&.btn-xl': {
            padding: theme('spacing.3'),
            'font-size': theme('fontSize.2xl')
          }
        }
      });

      // Variants
      addUtilities({
        '.variant-filled': {
          'background-color': theme('colors.zinc.600'),
        },
        '.variant-filled-primary': {
          'background-color': theme('colors.primary.500'),
        }
      });
    })
  ],
}

