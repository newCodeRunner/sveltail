/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const { resolve } = require('path');
const { existsSync, writeFileSync, rmdirSync } = require('fs');
const { execSync, exec } = require('child_process');
const chalk = require('chalk');

const currDirectory = process.cwd();
const entryAvail = () => existsSync(resolve(currDirectory, 'src/app.js'));
const config = require(resolve(currDirectory, 'sveltail.config.js'));

exports.buildElectron = ({ noPackage, publish }) => {
  if (entryAvail()) {
    const webpackPath = resolve(__dirname, './modules/webpack.js');
    try {
      // Clean already present files
      const distPath = resolve(currDirectory, 'dist', 'Electron');
      if (existsSync(distPath)) rmdirSync(distPath, { recursive: true });
      console.log(chalk.green('\n Sveltail: Cleaned build directory'));

      const builderJSON = config.default()['electron-builder'];

      // Update Electron Builder Resource folder
      if (!builderJSON.directories) builderJSON.directories = {};
      builderJSON.directories.app = resolve(currDirectory, 'dist', 'Electron', 'unpacked');

      // Update Electron Builder Output folder
      if (!builderJSON.directories.output) builderJSON.directories.output = resolve(currDirectory, 'dist', 'Electron', 'packaged');

      // Update Electron Builder Icons
      if (process.platform === 'darwin') {
        if (!builderJSON.mac) builderJSON.mac = {};
        if (!builderJSON.mac.icon) builderJSON.mac.icon = resolve(currDirectory, 'public', 'Electron', 'icons', 'icon.icns');
      }
      if (process.platform === 'linux') {
        if (!builderJSON.linux) builderJSON.linux = {};
        if (!builderJSON.linux.icon) builderJSON.linux.icon = resolve(currDirectory, 'public', 'Electron', 'icons', 'icon.png');
      }
      if (process.platform === 'win32') {
        if (!builderJSON.win) builderJSON.win = {};
        if (!builderJSON.win.icon) builderJSON.win.icon = resolve(currDirectory, 'public', 'Electron', 'icons', 'icon.ico');
      }

      writeFileSync(resolve(currDirectory, '.sveltail', 'builder.json'), JSON.stringify(builderJSON, null, 2));
      console.log(chalk.green(' Sveltail: Generated builder.json as per user preferences'));

      const child = exec(
        `npx webpack --config "${webpackPath}" --env mode=production --env platform=Electron`,
        { cwd: currDirectory, stdio: 'inherit' },
      );
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      child.on('exit', () => {
        if (!noPackage) {
          console.log(chalk.green(' Sveltail: Building app through Electron Builder'));
          const configPath = resolve(currDirectory, '.sveltail', 'builder.json');

          if (publish) {
            const credentials = require('./credentials');
            credentials.getGHToken()
              .then((token) => {
                execSync(
                  `Set GH_TOKEN=${token} && npx electron-builder build --config ${configPath} --publish always`,
                  { cwd: currDirectory, stdio: 'inherit' },
                );
              });
          } else {
            execSync(
              `npx electron-builder build --config ${configPath}`,
              { cwd: currDirectory, stdio: 'inherit' },
            );
          }
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }
};
