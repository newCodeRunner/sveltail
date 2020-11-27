/* eslint-disable import/no-dynamic-require */

const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('path');
const { readdirSync, readFileSync } = require('fs');

const currDirectory = process.cwd();
const packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
const { app, description, version } = packageJSON;

const svelteConfig = require(resolve(currDirectory, 'sveltail.config.js'));
const { framework } = svelteConfig.default();

module.exports = (env) => {
  const { mode } = env;
  const PROD = mode === 'production';

  const entry = {};
  readdirSync(resolve(currDirectory, 'src-electron', 'main')).forEach((file) => {
    if (file.split('.').pop() === 'js') {
      entry[`eM-${file.replace('.js', '')}`] = resolve(currDirectory, 'src-electron', 'main', file);
    }
  });
  readdirSync(resolve(currDirectory, 'src-electron', 'renderer')).forEach((file) => {
    if (file.split('.').pop() === 'js') {
      entry[`eR-${file.replace('.js', '')}`] = resolve(currDirectory, 'src-electron', 'renderer', file);
    }
  });
  readdirSync(resolve(currDirectory, 'src-electron', 'workers')).forEach((file) => {
    if (file.split('.').pop() === 'js') {
      entry[`eS-${file.replace('.js', '')}`] = resolve(currDirectory, 'src-electron', 'workers', file);
    }
  });

  return {
    entry,
    resolve: {
      alias: {
        sveltail: resolve(currDirectory, 'node_modules', 'sveltail'),
        '~': currDirectory,
      },
      extensions: ['.mjs', '.js'],
      mainFields: ['browser', 'module', 'main'],
      symlinks: false,
    },
    target: 'electron-main',
    output: {
      path: PROD ? resolve(currDirectory, 'dist', 'Electron') : resolve(currDirectory, '.sveltail', 'Electron'),
      filename: PROD ? 'js/[name].js' : undefined,
      chunkFilename: PROD ? 'js/[id].js' : undefined,
      pathinfo: !PROD,
    },
    optimization: {
      splitChunks: !PROD ? undefined : {
        chunks: 'all',
      },
      removeAvailableModules: !PROD,
      removeEmptyChunks: !PROD,
    },
    module: {
      rules: [],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        'process.APP_ENV': JSON.stringify(
          Object.assign(
            framework.APP_ENV,
            {
              productName: app.name,
              productDescription: description,
              productVersion: version,
              platform: 'Electron',
              PROD,
            },
          ),
        ),
      }),
      new EnvironmentPlugin(['platform', 'PROD', 'colors', 'screens']),
    ],
    mode,
    devtool: PROD ? false : 'source-map',
  };
};
