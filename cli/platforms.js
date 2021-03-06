/* eslint-disable no-console */
const { resolve } = require('path');
const { copySync } = require('fs-extra');
// eslint-disable-next-line object-curly-newline
const { writeFileSync, existsSync, rmdirSync, readFileSync } = require('fs');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const chalk = require('chalk');

const updateCordova = require('./modules/updateCordova.js');
const updateNS = require('./modules/updateNS.js');

const currDirectory = process.cwd();
let packageJSON = null;
if (existsSync(resolve(currDirectory, 'package.json'))) {
  packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
}

if (!packageJSON.devDependencies) packageJSON.devDependencies = {};

exports.addPlatform = (platform) => {
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
            chalk.yellow(` Sveltail: Overwriting script: ${obj.key} beacuse a script with same name already exists.`),
          );
        }
      });

      writeFileSync(resolve(currDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2));
    }

    // Update Cordova Project Info
    updateCordova.default(currDirectory, packageJSON);

    console.log(
      chalk.green(
        ' Sveltail: Added Cordova to the project. Please use "svelte dev --cordova --ios" to start cordova in dev mode.',
      ),
    );
    console.log(chalk.green(' Sveltail: Preparing Cordova for first time use.'));
    execSync('(cd src-cordova && cordova prepare android ios)', { cwd: currDirectory, stdio: 'inherit' });
  } else if (platform === 'electron') {
    copySync(resolve(__dirname, '../app/src-electron'), resolve(currDirectory, 'src-electron'));
    console.log(chalk.green(' Sveltail: Added Electron to the project. Please use "svelte dev --electron" to start electron in dev mode.'));

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

      writeFileSync(resolve(currDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2));

      // Add project dependencies and devDependencies
      const devDeps = ['electron', 'electron-builder', 'electron-store'];

      let command = '';
      devDeps.forEach((dep) => {
        if (!packageJSON.devDependencies[dep]) {
          if (command === '') {
            if (existsSync(resolve(currDirectory, 'package-lock.json'))) command = 'npm install';
            else command = 'yarn add';
          }
          command += ` ${dep}`;
        }
      });

      if (command.trim() !== '') {
        console.log(chalk.grey(' Sveltail: Adding Electron dependencies to the project.'));
        if (existsSync(resolve(currDirectory, 'package-lock.json'))) command += ' --also=dev';
        else command += ' --dev';
        console.log(chalk.grey(command));
        execSync(command, { cwd: currDirectory, stdio: 'inherit' });
      }
    }
  } else if (platform === 'pwa') {
    if (packageJSON) {
      // Adding PWA related scripts
      const scripts = [
        { key: 'st-dev-pwa', script: 'sveltail dev --pwa' },
        { key: 'st-build-pwa', script: 'sveltail build --pwa' },
      ];

      if (packageJSON.scripts === undefined) packageJSON.scripts = {};
      scripts.forEach((obj) => {
        packageJSON.scripts[obj.key] = obj.script;
        if (!packageJSON.scripts[obj.key]) {
          console.log(
            chalk.yellow(` Sveltail: Overwriting script: ${obj.key} beacuse a script with same name already exists.`),
          );
        }
      });

      writeFileSync(resolve(currDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2));
    }
    copySync(resolve(__dirname, '../app/src-pwa'), resolve(currDirectory, 'src-pwa'));

    console.log(chalk.green(' Added PWA support to the project. Please use "svelte dev --pwa" to start developing in PWA mode.'));
  } else if (platform === 'nativescript') {
    copySync(resolve(__dirname, '../app/src-nativescript'), resolve(currDirectory, 'src-nativescript'));

    // Update NativeScript Project Info
    updateNS.default(currDirectory, packageJSON);

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

exports.removePlatform = (platform) => {
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
          console.log(chalk.green(` Sveltail: The ${platform} platform has been successfully removed from the project.\n`));
        } else {
          console.log(chalk.yellow(` Sveltail: The ${platform} platform removal was cancelled.\n`));
        }
      });
  } else {
    console.log(chalk.yellow(`\n Sveltail: The ${platform} is not present in the project.\n`));
  }
};
