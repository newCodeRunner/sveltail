/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const { exec, execSync } = require('child_process');
const { readdirSync, readFileSync } = require('fs');
const { resolve } = require('path');

// Webpack and plugins
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const currDirectory = process.cwd();
const packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
const { app, description, version } = packageJSON;

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
      });
    }
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
    watch: true,
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
      filename: PROD ? 'js/e-[name].js' : undefined,
      chunkFilename: PROD ? 'js/e-[id].js' : undefined,
      pathinfo: !PROD,
    },
    optimization: {
      splitChunks: !PROD ? undefined : {
        chunks: 'all',
      },
      removeAvailableModules: !PROD,
      removeEmptyChunks: !PROD,
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
              url,
            },
          ),
        ),
      }),
      new EnvironmentPlugin(['platform', 'PROD']),
      new OnBuildPlugin(),
    ],
    mode,
    devtool: PROD ? false : 'source-map',
  };
};
