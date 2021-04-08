module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      colors: {
        light: '#ffffff',
        dark: '#000000',
        brand: '#009999',
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
  darkMode: 'media',
};
