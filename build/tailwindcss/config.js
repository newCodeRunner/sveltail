const { colors } = require('tailwindcss/defaultTheme');
const { productTheme } = require('../../package.json');

if (productTheme.white) delete colors.current;
if (productTheme.black) delete colors.current;
if (productTheme.current) delete colors.current;

module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
    },
    extend: {
      colors: productTheme,
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    layers: ['base', 'components', 'utilities'],
  },
};
