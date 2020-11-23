/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const { execSync } = require('child_process');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { resolve } = require('path');
// eslint-disable-next-line object-curly-newline
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');

const currDirectory = process.cwd();
const packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
const { app, description, version } = packageJSON;

const svelteConfig = require(resolve(currDirectory, 'sveltail.config.js'));
const { tailwindcss, pwa, framework } = svelteConfig.default();
if (!existsSync(resolve(currDirectory, '.sveltail'))) mkdirSync(resolve(currDirectory, '.sveltail'));
writeFileSync(resolve(currDirectory, '.sveltail', 'tailwind.config.js'), JSON.stringify(tailwindcss));
const tailwind = require('tailwindcss')(resolve(currDirectory, '.sveltail', 'tailwind.config.js'));

module.exports = (env) => {
  const { platform, mode, type } = env;
  const PROD = mode === 'production';
  const include = [resolve(currDirectory, 'src'), resolve(currDirectory, 'node_modules', 'sveltail')];
  const bundle = [resolve(currDirectory, 'src', 'app.js')];

  process.env.platform = platform;
  process.env.PROD = PROD;

  const plugins = [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: resolve(currDirectory, 'src/assets'),
          to: resolve(currDirectory, 'public', platform, 'assets'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.template.html',
      templateParameters: {
        productName: app.name,
        productDescription: description,
        cordova: platform === 'Cordova',
      },
    }),
    new DefinePlugin({
      'process.APP_ENV': JSON.stringify(
        Object.assign(
          framework.APP_ENV,
          {
            productName: app.name,
            productDescription: description,
            productVersion: version,
            platform,
            PROD,
          },
        ),
      ),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
      ignoreOrder: false,
    }),
    new EnvironmentPlugin(['platform', 'PROD']),
  ];

  if (PROD) {
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: resolve(currDirectory, 'public', platform),
            to: resolve(currDirectory, 'dist', platform),
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
            from: resolve(currDirectory, 'package.json'),
            to: resolve(currDirectory, 'dist', platform, 'manifest.json'),
            transform() {
              const manifestJSON = JSON.stringify(pwa.manifest, null, 2);
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
              execSync(`(cd src-cordova && cordova run ${type})`, { stdio: 'inherit' });
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

            if (file.indexOf('brands') > -1) fileName = 'fa-brands.svg';
            else if (file.indexOf('regular') > -1) fileName = 'fa-regular.svg';
            else if (file.indexOf('solid') > -1) fileName = 'fa-solid.svg';

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
      contentBase: resolve(currDirectory, 'public', platform),
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
        colors: true,
      },
    },
    entry: {
      bundle,
    },
    resolve: {
      alias: {
        svelte: resolve(currDirectory, 'node_modules', 'svelte'),
        '~': resolve(currDirectory, '/'),
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
      symlinks: false,
    },
    output: {
      path: resolve(currDirectory, 'dist', platform),
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
