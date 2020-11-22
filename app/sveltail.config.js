const { colors } = require('tailwindcss/defaultTheme');

// eslint-disable-next-line arrow-body-style
exports.default = (/* cfg */) => {
  // Your code to change the config here

  return {
    tailwind: {
      theme: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
        },
        colors: { // Keep the colors you want to use in tailwind, by default the framework uses below
          black: colors.black,
          white: colors.white,
          gray: colors.gray,
        },
        extend: {
          colors: { // Extend the colors you want to use in tailwind, by default the framework uses below, you can change or add new colors
            brand: '#68b0ab',
            accent: '#e6b89c',
            primary: '#0496ff',
            secondary: '#5eb1bf',
            info: '#9cafb7',
            success: '#90be6d',
            warning: '#ff9f1c',
            danger: '#d81159',
          },
        },
      },
      future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
      },
      purge: {
        layers: ['base', 'components', 'utilities'],
      },
    },
  };
};
