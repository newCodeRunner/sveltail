/* eslint-disable object-curly-newline */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
// eslint-disable-next-line object-curly-newline
const { readFileSync, writeFileSync, existsSync, mkdirSync, watchFile } = require('fs');
const { resolve } = require('path');
const { exec, execSync } = require('child_process');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');

// Webpack and Plugins
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// Find current working directory
const currDirectory = process.cwd();

// Load values from package.json
const packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
const { app, description, version } = packageJSON;

// Load values from sveltail.config.js
const svelteConfig = require(resolve(currDirectory, 'sveltail.config.js'));
const { tailwindcss, pwa, framework } = svelteConfig.default();

// Create an inital tailwind.config.js file based on user values
const updateTailwindConfig = (css) => {
  const checkCSS = require('./checkTailwind');
  const modifiedCSS = checkCSS(css, currDirectory);

  if (!existsSync(resolve(currDirectory, '.sveltail'))) mkdirSync(resolve(currDirectory, '.sveltail'));
  writeFileSync(
    resolve(currDirectory, '.sveltail', 'tailwind.config.js'),
    `module.exports = ${JSON.stringify(modifiedCSS, null, 2)}`,
  );
};
updateTailwindConfig(tailwindcss);
const tailwind = require('tailwindcss')(resolve(currDirectory, '.sveltail', 'tailwind.config.js'));

// Update Tailwind Config on changes in sveltail.config.js
watchFile(resolve(currDirectory, 'sveltail.config.js'), () => {
  const requireUncached = (module) => {
    delete require.cache[require.resolve(module)];
    return require(module);
  };

  const configJS = requireUncached(resolve(currDirectory, 'sveltail.config.js'));
  const config = configJS.default();
  updateTailwindConfig(config.tailwindcss);
});

const isObject = (value) => value && typeof value === 'object' && value.constructor === Object;

module.exports = (env) => {
  let url = 'index.html';
  const { platform, mode, type } = env;
  const PROD = mode === 'production';
  const entry = {
    'main-bundle': resolve(currDirectory, 'src', 'app.js'),
  };

  // Add additional entry points
  if (framework.entryPoints) {
    if (framework.entryPoints.Web) {
      if (isObject(framework.entryPoints.Web)) {
        Object.keys(framework.entryPoints.Web).forEach((entryKey) => {
          if (entryKey === 'main-bundle') {
            console.log(chalk.yellow('\n Sveltail: Skipped Entry point "main-bundle" for Web, this is reserved for sveltail default.'));
          } else {
            entry[entryKey] = framework.entryPoints.Web[entryKey];
          }
        });
      } else {
        console.log(chalk.yellow('\n Sveltail: Skipped Entry points for Web, these must be an Object'));
      }
    }
  }

  // Set up for purging
  process.env.NODE_ENV = mode;

  process.env.platform = platform;
  process.env.PROD = PROD;
  process.env.colors = JSON.stringify(Object.assign(tailwindcss.theme.colors, tailwindcss.theme.extend.colors));
  process.env.screens = JSON.stringify(tailwindcss.theme.screens);
  process.env.noIcons = framework.noIcons || false;

  const plugins = [
    new EnvironmentPlugin(['platform', 'PROD', 'colors', 'screens', 'noIcons']),
    new DefinePlugin({
      'process.APP_ENV': JSON.stringify(
        Object.assign(
          framework.APP_ENV,
          {
            productName: app.name,
            productDescription: description,
            productVersion: version,
          },
        ),
      ),
    }),
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
      inject: 'head',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
      ignoreOrder: false,
    }),
  ];

  if (platform === 'PWA') {
    // Create a new Entry Point for PWA mode.
    writeFileSync(
      resolve(currDirectory, '.sveltail', 'app.js'),
      `import '../src-pwa/index.js';
      import '../src/app.js;
      `.replace(/^ +| +$/gm, ''),
    );

    // Replace the normal entry point for webpack.
    entry['main-bundle'] = resolve(currDirectory, '.sveltail', 'app.js');

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
  } else if (platform === 'Cordova' || platform === 'Electron') {
    class OnBuildPlugin {
      constructor(options) {
        this.options = options;
        this.firstTimeBuild = false;
      }

      apply(compiler) {
        compiler.hooks.afterEmit.tap('OnBuildPlugin', () => {
          if (!this.firstTimeBuild) {
            this.firstTimeBuild = true;
            setTimeout(() => {
              if (platform === 'Cordova') {
                console.log(chalk.green('\n Sveltail: Running Cordova'));
                const child = exec(
                  `(cd src-cordova && cordova run ${type})`,
                  { cwd: currDirectory, stdio: 'inherit' },
                );
                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);
              } else if (platform === 'Electron') {
                console.log(chalk.green('\n Sveltail: Starting electron build process'));
                const electronConfigPath = resolve(__dirname, 'webpackElectron.js');
                const child = exec(
                  `npx webpack --config "${electronConfigPath}" --env mode=${mode} --env url=${url}`,
                  { cwd: currDirectory, stdio: 'inherit' },
                );
                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);
                child.on('exit', () => {
                  process.stdout.pause();
                  process.stderr.pause();
                  if (process.platform === 'win32') {
                    execSync(`taskkill -F -T -PID ${process.pid}`);
                  } else {
                    process.kill(process.pid);
                  }
                });
              }
            }, 1000);
          }
        });
      }
    }
    plugins.push(new OnBuildPlugin());
  }

  if (PROD) {
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: resolve(currDirectory, 'public', platform),
            to: resolve(currDirectory, 'dist', platform, platform === 'Electron' ? 'unpacked' : undefined),
          },
        ],
      }),
    );

    plugins.push(
      new CompressionPlugin({
        test: /\.(html|css|js|woff)(\?.*)?$/i, // only compressed html/css/js, skips compressing sourcemaps etc
      }),
    );
  }

  // Web Config
  let config = {
    entry,
    plugins,
    mode,
    devtool: PROD ? false : 'source-map',
    resolve: {
      alias: {
        svelte: resolve(currDirectory, 'node_modules', 'svelte'),
        sveltail: resolve(currDirectory, 'node_modules', 'sveltail'),
        src: resolve(currDirectory, 'src'),
        '~': currDirectory,
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
      symlinks: false,
    },
    output: {
      path: resolve(currDirectory, 'dist', platform, platform === 'Electron' ? 'unpacked' : ''),
      filename: PROD ? 'js/[name].js' : undefined,
      chunkFilename: PROD ? 'js/[id].js' : undefined,
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev: !PROD,
              emitCss: true,
              hotReload: !PROD,
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader',
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
    optimization: {
      splitChunks: !PROD ? undefined : {
        chunks: 'all',
      },
      removeAvailableModules: PROD,
      removeEmptyChunks: PROD,
      minimize: PROD,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin(),
      ],
    },
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
    devServer: {
      writeToDisk: true,
      historyApiFallback: true,
      hot: true,
      open: platform !== 'Electron' && platform !== 'Cordova',
      contentBase: platform === 'Electron'
        ? [resolve(currDirectory, 'public', platform), resolve(currDirectory, '.sveltail', 'Electron')]
        : resolve(currDirectory, 'public', platform),
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
      before(_app, server) {
        url = `http://${server.options.host}:${server.options.port}/`;
      },
    },
  };

  const userConfig = framework.webpack(config);
  config = userConfig || config;

  if (PROD) delete config.devServer;

  return config;
};
