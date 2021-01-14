/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const { exec, execSync } = require('child_process');
const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const chalk = require('chalk');

// Webpack and plugins
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const currDirectory = process.cwd();
const packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
// eslint-disable-next-line object-curly-newline
const { app, description, version, dependencies, devDependencies, author, license } = packageJSON;

const svelteConfig = require(resolve(currDirectory, 'sveltail.config.js'));
const { framework } = svelteConfig.default();

module.exports = (env) => {
  const { mode, url } = env;
  const PROD = mode === 'production';

  process.env.platform = 'Electron';
  process.env.PROD = PROD;

  class OnBuildPlugin {
    constructor() {
      this.electronProcess = null;
      this.exitHandler = () => {
        console.log('\n Sveltail: Terminating development environment');
        process.stdout.pause();
        process.stderr.pause();
        if (process.platform === 'win32') {
          execSync(`taskkill -F -T -PID ${process.pid}`);
        } else {
          process.kill(process.pid);
        }
      };
      this.start = () => {
        const electronStartPath = resolve(currDirectory, '.sveltail', 'Electron', 'eM-main.js');
        this.electronProcess = exec(`npx electron ${electronStartPath}`);
        this.electronProcess.stdout.pipe(process.stdout);
        this.electronProcess.on('exit', this.exitHandler);
      };
    }

    apply(compiler) {
      compiler.hooks.afterEmit.tap('OnBuildPlugin', () => {
        if (PROD) {
          console.log(chalk.green(' Sveltail: Generating package.json\n'));
          writeFileSync(
            resolve(currDirectory, 'dist', 'Electron', 'unpacked', 'package.json'),
            JSON.stringify({
              main: 'eM-main.js',
              name: app.name.replace(/\s/g, ''),
              author: author || 'Sveltail Dev Team',
              description,
              version,
              dependencies,
              devDependencies,
              repository: 'github:newCodeRunner/pb-sa-release',
              license: license || 'ISC',
            }, null, 2),
          );
        } else {
          setTimeout(() => {
            if (this.electronProcess) {
              console.log('\n Sveltail: Closing and Restarting Electron');
              this.electronProcess.stdout.pause();
              this.electronProcess.stderr.pause();
              this.electronProcess.removeAllListeners('exit');
              if (process.platform === 'win32') {
                execSync(`taskkill -F -T -PID ${this.electronProcess.pid}`);
              } else {
                process.kill(this.electronProcess.pid);
              }
              this.start();
            } else {
              console.log('\n Sveltail: Starting Electron');
              this.start();
            }
          }, 1000);
        }
      });
    }
  }

  const plugins = [
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
            url,
          },
        ),
      ),
    }),
    new EnvironmentPlugin(['platform', 'PROD']),
    new OnBuildPlugin(),
  ];

  if (!PROD) {
    plugins.unshift(new CleanWebpackPlugin());
  }

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
    watch: !PROD,
    entry,
    resolve: {
      alias: {
        '~': currDirectory,
      },
      extensions: ['.mjs', '.js', '.json'],
    },
    target: 'electron-main',
    node: {
      __dirname: false,
      __filename: false,
    },
    output: {
      path: PROD ? resolve(currDirectory, 'dist', 'Electron', 'unpacked') : resolve(currDirectory, '.sveltail', 'Electron'),
      filename: '[name].js',
      chunkFilename: '[id].js',
      libraryTarget: 'commonjs2',
    },
    externals: Object.keys(dependencies || {}),
    optimization: {
      splitChunks: !PROD ? undefined : {
        chunks: 'all',
      },
      removeAvailableModules: PROD,
      removeEmptyChunks: PROD,
      minimize: PROD,
    },
    stats: {
      assets: true,
      children: true,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: true,
    },
    plugins,
    mode,
    devtool: PROD ? false : 'source-map',
  };
};
