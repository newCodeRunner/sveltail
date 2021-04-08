/* eslint-disable object-curly-newline */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
// eslint-disable-next-line object-curly-newline
const { resolve } = require('path');
const autoprefixer = require('autoprefixer');

// Webpack and Plugins
const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const tailwind = require('tailwindcss')(resolve(__dirname, './tailwind.config.js'));

module.exports = () => {
  const entry = {
    'main-bundle': resolve(__dirname, './index.js'),
  };
  const mode = 'development';

  process.env.platform = 'Web';
  process.env.PROD = false;
  process.env.colors = JSON.stringify({});
  process.env.screens = JSON.stringify([]);

  const plugins = [
    new EnvironmentPlugin(['platform', 'PROD', 'colors', 'screens']),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './index.template.html'),
      templateParameters: {
        productName: 'Sveltail Designer',
        productDescription: 'Design and compare the components with Material Design components',
      },
      inject: 'head',
    }),
  ];

  // Web Config
  return {
    entry,
    plugins,
    mode,
    devtool: 'source-map',
    resolve: {
      alias: {
        svelte: resolve(process.cwd(), 'node_modules', 'svelte'),
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
      modules: [
        resolve(process.cwd(), 'node_modules'),
      ],
    },
    output: {
      path: resolve(__dirname, './dist'),
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                dev: true,
              },
              hotReload: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                // necessary if you use url('/path/to/some/asset.png|jpg|gif')
                url: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      tailwind,
                      autoprefixer,
                    ],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    devServer: {
      hot: true,
      open: true,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: true,
      },
    },
  };
};
