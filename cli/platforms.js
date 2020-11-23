/* eslint-disable no-console */
const { resolve } = require('path');
const { copySync } = require('fs-extra');
// eslint-disable-next-line object-curly-newline
const { writeFileSync, existsSync, rmdirSync, readFileSync } = require('fs');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const updateCordova = require('./modules/updateCordova.js');
const updateNS = require('./modules/updateNS.js');

const currDirectory = process.cwd();
let packageJSON = null;
if (existsSync(resolve(currDirectory, 'package.json'))) {
  packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
}

exports.addPlatform = (chalk, platform) => {
  console.log('\n');
  if (platform === 'cordova') {
    copySync(resolve(__dirname, '../app/src-cordova'), resolve(currDirectory, 'src-cordova'));

    if (packageJSON) {
      // Adding Cordova related scripts
      const scripts = [
        { key: 'st-dev-cor-android', script: 'sveltail dev --cordova --android' },
        { key: 'st-dev-cor-ios', script: 'sveltail dev --cordova --ios' },
        { key: 'st-build-cor-android', script: 'sveltail build --cordova --android' },
        { key: 'st-build-cor-ios', script: 'sveltail build --cordova --ios' },
      ];

      if (packageJSON.scripts === undefined) packageJSON.scripts = {};
      scripts.forEach((obj) => {
        packageJSON.scripts[obj.key] = obj.script;
        if (!packageJSON.scripts[obj.key]) {
          console.log(
            chalk.yellow(` Overwriting script: ${obj.key} beacuse a script with same name already exists.`),
          );
        }
      });

      writeFileSync(resolve(__dirname, '../app/src-electron'), JSON.stringify(packageJSON, null, 2));
    }

    // Update Cordova Project Info
    updateCordova.default(chalk, currDirectory, packageJSON);

    console.log(chalk.green(' Added Cordova to the project. Please use "svelte dev --cordova --ios" to start cordova in dev mode.'));
    console.log(' Note: Cordova CLI must be installed globally "npm install cordova -g"');
    console.log(' Next Step: run "(cd src-cordova && npm install)"');
  } else if (platform === 'electron') {
    copySync(resolve(__dirname, '../app/src-electron'), resolve(currDirectory, 'src-electron'));
    console.log(chalk.green(' Added Electron to the project. Please use "svelte dev --electron" to start electron in dev mode.'));

    if (packageJSON) {
      // Adding Electron related scripts
      const scripts = [
        { key: 'st-dev-electron', script: 'sveltail dev --electron' },
        { key: 'st-build-electron', script: 'sveltail build --electron' },
      ];

      if (packageJSON.scripts === undefined) packageJSON.scripts = {};
      scripts.forEach((obj) => {
        packageJSON.scripts[obj.key] = obj.script;
        if (!packageJSON.scripts[obj.key]) {
          console.log(
            chalk.yellow(` Overwriting script: ${obj.key} beacuse a script with same name already exists.`),
          );
        }
      });

      writeFileSync(resolve(__dirname, '../app/src-electron'), JSON.stringify(packageJSON, null, 2));

      // Add project dependencies and devDependencies
      const devDeps = ['electron', 'electron-builder'];

      let command = '';
      devDeps.forEach((cmd) => {
        if (!packageJSON.devDependencies[cmd]) {
          if (command === '') {
            if (existsSync(resolve(currDirectory, 'package-lock.json'))) command = 'npm install';
            else command = 'yarn add';
          }
          command += ` ${cmd}`;
        }
      });

      if (command.trim() !== '') {
        console.log(chalk.grey(' Adding Electron dependencies to the project.'));
        command += ' --dev';
        console.log(' Adding project dependencies');
        execSync(command, { cwd: currDirectory, stdio: 'inherit' });
      }
    }
  } else if (platform === 'pwa') {
    copySync(resolve(__dirname, '../app/src-pwa'), resolve(currDirectory, 'src-pwa'));
    console.log(chalk.green(' Added PWA support to the project. Please use "svelte dev --pwa" to start developing in PWA mode.'));
  } else if (platform === 'nativescript') {
    copySync(resolve(__dirname, '../app/src-nativescript'), resolve(currDirectory, 'src-nativescript'));

    // Update NativeScript Project Info
    updateNS.default(chalk, currDirectory, packageJSON);

    console.log(chalk.green(' Added NativeScript to the project. Please use "svelte dev --nativescript --ios" to start dev mode.'));
    console.log(' Note: NativeScript CLI must be installed globally "npm install nativescript -g"');
    console.log(' Next Step: run "(cd src-nativescript && npm install)"');
  } else if (platform === 'firebase') {
    const fb = {
      projects: {},
    };
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'Please enter your firebase project name?',
          validate: (answer) => {
            let result = true;
            const formattedAnswer = String(answer).trim();
            if (formattedAnswer.length > 0) {
              fb.projects.default = formattedAnswer;
            } else {
              result = 'Project Name can not be blank';
            }
            return result;
          },
        },
      ])
      .then(() => {
        copySync('../app/src-firebase', resolve(currDirectory, 'src-firebase'));

        writeFileSync(resolve(currDirectory, '.firebaserc'), JSON.stringify(fb, null, 2));
        writeFileSync(
          resolve(currDirectory, 'firebase.json'),
          JSON.stringify({
            firestore: {
              rules: 'src-firebase/firestore.rules',
              indexes: 'src-firebase/firestore.indexes.json',
            },
            functions: {
              source: 'src-firebase/functions',
              predeploy: [
                'npm --prefix "$RESOURCE_DIR" run lint',
              ],
            },
            hosting: {
              public: 'dist/pwa',
              ignore: [
                'firebase.json',
                '**/.*',
                '**/node_modules/**',
              ],
            },
            storage: {
              rules: 'src-firebase/storage.rules',
            },
            emulators: {
              functions: {
                port: 5001,
              },
              firestore: {
                port: 8080,
              },
              hosting: {
                port: 5000,
              },
              pubsub: {
                port: 8085,
              },
              ui: {
                enabled: true,
              },
            },
          }), null, 2,
        );

        console.log(chalk.green(' Added firebase to the project. Please use firebase-cli to run firebase commands.'));
        console.log(' Note: Firebase CLI must be installed globally "npm install firebase-tools -g"');
      });
  }
  console.log('\n');
};

exports.removePlatform = (chalk, platform) => {
  if (existsSync(resolve(currDirectory, `src-${platform}`))) {
    console.log('\n');
    inquirer
      .prompt([
        {
          name: 'confirm',
          type: 'confirm',
          default: false,
          message: ` Are you sure you want to remove ${platform}? You will lose all the changes permanently.`,
        },
      ])
      .then(({ confirm }) => {
        if (confirm) {
          rmdirSync(resolve(currDirectory, `src-${platform}`), { recursive: true });
          console.log(chalk.green(` The ${platform} has been successfully removed from the project.\n`));
        } else {
          console.log(chalk.yellow(` The ${platform} removal was cancelled.\n`));
        }
      });
  } else {
    console.log(chalk.yellow(`\n The ${platform} is not present in the project.\n`));
  }
};
