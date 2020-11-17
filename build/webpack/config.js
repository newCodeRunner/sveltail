/* eslint-disable no-console */
const { exec } = require('child_process');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const tailwind = require('tailwindcss')('./src-framework/build/tailwindcss/config.js');
const autoprefixer = require('autoprefixer');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const path = require('path');

const {
  productName,
  productDescription,
  productVersion,
  productReleaseNotes,
  productDetails,
  productTheme,
} = require('../../../package.json');

module.exports = (env) => {
  const { platform, mode, type } = env;
  const PROD = mode === 'production';
  const include = [path.resolve(__dirname, '../../../src')];
  const bundle = ['./src/app.js'];

  process.env.platform = platform;
  process.env.PROD = PROD;

  const plugins = [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, '../../../src/assets'),
          to: path.resolve(__dirname, '../../../public', platform, 'assets'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.template.html',
      templateParameters: {
        productName,
        productDescription,
        cordova: platform === 'Cordova',
      },
    }),
    new DefinePlugin({
      'process.APP_CONFIG': JSON.stringify({
        productName,
        productDescription,
        productVersion,
        productReleaseNotes,
      }),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
      ignoreOrder: false,
    }),
    new SpriteLoaderPlugin({ plainSprite: true }),
    new EnvironmentPlugin(['platform', 'PROD']),
  ];

  if (PROD) {
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../../../public', platform),
            to: path.resolve(__dirname, '../../../dist', platform),
          },
        ],
      }),
    );
  }

  if (platform === 'PWA') {
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../../../package.json'),
            to: path.resolve(__dirname, '../../../dist', platform, 'manifest.json'),
            transform(content) {
              const manifest = {};

              manifest.background_color = '#fdfdfd';
              manifest.theme_color = productTheme.brand;
              manifest.name = productName;
              manifest.description = productDescription;
              manifest.short_name = productDetails.ShortName;
              manifest.start_url = 'index.html';

              const valObject = JSON.parse(content.toString()).manifestPWA;
              Object.keys(valObject).forEach((key) => {
                manifest[key] = valObject[key];
              });
              const manifestJSON = JSON.stringify(manifest, null, 2);
              return manifestJSON;
            },
          },
        ],
      }),
    );
    plugins.push(
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './src-pwa/service-worker.js',
        swDest: 'service-worker.js',
      }),
    );
  }

  if (platform === 'Cordova') {
    class OnBuildPlugin {
      constructor(options) {
        this.options = options;
        this.firstTimeBuild = false;
      }

      apply(compiler) {
        if (!this.firstTimeBuild) {
          this.firstTimeBuild = true;
          compiler.hooks.afterEmit.tap('OnBuildPlugin', () => {
            setTimeout(() => {
              console.log('\n Running Cordova');
              const processCordova = exec(`(cd src-cordova && cordova run ${type})`);

              processCordova.stdout.setEncoding('utf8');
              processCordova.stdout.on('data', (data) => {
                console.log(data);
              });

              processCordova.stderr.setEncoding('utf8');
              processCordova.stderr.on('data', (data) => {
                console.log(data);
              });

              processCordova.on('close', (code) => {
                console.log(`Cordova process exited with code ${code}`);
              });
            }, 1000);
          });
        }
      }
    }

    plugins.push(new OnBuildPlugin());
  }

  const rules = [
    {
      test: /\.svelte$/,
      include,
      use: {
        loader: 'svelte-loader',
        options: {
          dev: !PROD,
          emitCss: true,
          hotReload: true,
        },
      },
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
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
    {
      test: /\.svg$/,
      use: {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: (file) => {
            let fileName = file.replace(/\\/g, '/').split('/').pop();

            if (file.indexOf('fontawesome') > -1) {
              if (file.indexOf('brands') > -1) fileName = 'fa-brands.svg';
              else if (file.indexOf('regular') > -1) fileName = 'fa-regular.svg';
              else if (file.indexOf('solid') > -1) fileName = 'fa-solid.svg';
            } else if (file.indexOf('css.gg') > -1) fileName = 'css-gg.svg';

            return `svg/${fileName}`;
          },
        },
      },
    },
  ];

  const configArray = {
    devServer: PROD ? undefined : {
      writeToDisk: true,
      open: platform !== 'Electron' && platform !== 'Cordova',
      contentBase: path.resolve(__dirname, '../../../public', platform),
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: true,
        warnings: true,
      },
    },
    entry: {
      bundle,
    },
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte'),
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
      symlinks: false,
    },
    output: {
      path: path.resolve(__dirname, '../../../dist', platform),
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
      rules,
    },
    plugins,
    mode,
    devtool: PROD ? false : 'source-map',
  };

  return configArray;
};
