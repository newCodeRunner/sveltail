const { colors } = require('tailwindcss/defaultTheme');
const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const packageJSON = {};
if (existsSync(resolve(__dirname, 'package.json'))) {
  const tempObject = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
  Object.keys(tempObject).forEach((key) => {
    packageJSON[key] = tempObject[key];
  });
}

// eslint-disable-next-line arrow-body-style
exports.default = (/* cfg */) => {
  // Your code to change the config here

  return {
    tailwindcss: {
      theme: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
        },
      },
      future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
      },
      darkMode: 'media',
    },
    pwa: {
      manifest: {
        background_color: '#fdfdfd',
        theme_color: '#68b0ab',
        name: packageJSON.app.name,
        description: packageJSON.description,
        short_name: packageJSON.app.name,
        start_url: 'index.html',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            type: 'image/png',
            sizes: '72x72',
          },
          {
            src: '/icons/icon-96x96.png',
            type: 'image/png',
            sizes: '96x96',
          },
          {
            src: '/icons/icon-128x128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: '/icons/icon-144x144.png',
            type: 'image/png',
            sizes: '144x144',
          },
          {
            src: '/icons/icon-152x152.png',
            type: 'image/png',
            sizes: '152x152',
          },
          {
            src: '/icons/icon-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: '/icons/icon-384x384.png',
            type: 'image/png',
            sizes: '384x384',
          },
          {
            src: '/icons/icon-512x512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
      },
    },
    framework: {
      APP_ENV: {
        // Define variables here
      },
      entryPoints: {
        Web: {},
        Electron: {},
      },
      webpack(cfg) {
        return cfg;
      },
      webpackElectron(cfg) {
        return cfg;
      },
    },
    'electron-builder': {
      appId: packageJSON.app.id,
      productName: packageJSON.app.name,
      copyright: 'Copyright © Sveltail',
      asar: true,
      directories: {
        output: 'dist/Electron/packaged',
      },
      win: {
        target: [
          {
            target: 'nsis',
            arch: [
              'x64',
            ],
          },
        ],
      },
      linux: {
        target: [
          {
            target: 'AppImage',
            arch: [
              'x64',
            ],
          },
        ],
      },
      mac: {
        target: [
          {
            target: 'dmg',
            arch: [
              'x64',
            ],
          },
        ],
      },
    },
  };
};
