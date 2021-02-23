#! /usr/bin/env node

/* eslint-disable global-require */
/* eslint-disable no-console */

const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const usageAlert = () => {
  console.log(chalk.red('\n Error: Incorrect command usage. Run "sveltail --help" for more info'));
};

// CLI Options
// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .command(
    '$0',
    'Sveltail CLI',
    () => {},
    () => {
      console.log(
        chalk.green(
          `
            Welcome to Sveltail CLI.
            Please run "sveltail --help" for more information on List of Commands and how to use them.
          `,
        ),
      );
    },
  )
  .command(
    'config',
    "Update your project's name, description, author and other necessary information",
    () => {},
    (arg) => {
      const config = require('../cli/config');
      config.default(arg);
    },
  )
  .command(
    'icons',
    `Generate your project's icons in default folders according to Sveltail Folder Structure.
    (Supported formats [.png, .jpg, .svg])

    Options:

      --logo [relative logo path]
      Run with Custom logo path
      (defaults to [project root]/src/assets/logo.png)

      --splash [relative splashscreen logo path]
      Run with Custom Splash logo path.
      This allows you to have different app and splashscreen logos.
      If no splash logo is defined, default logo is used.
      (defaults to [project root]/src/assets/logo.png)

      --background [hex color]
      Specify custom hex color for splashscreen background.
      (defaults to #FFFFFF)

    `,
    () => {},
    ({ logo, splash, background }) => {
      const icons = require('../cli/icons');
      icons.default(
        {
          logoPath: logo || './src/assets/logo.png',
          splashPath: splash || './src/assets/logo.png',
          background: background || '#FFFFFF',
        },
      );
    },
  )
  .command(
    'add',
    `Add different platforms supported by Sveltail out of the box!
    
    Options:

    --electron        [boolean]
    --cordova         [boolean]
    --pwa             [boolean]
    --nativescript    [boolean]
    --firebase        [boolean]  Adds firebase support out of the box
    `,
    () => {},
    (arg) => {
      let platform = null;
      if (arg.electron) platform = 'electron';
      else if (arg.cordova) platform = 'cordova';
      else if (arg.pwa) platform = 'pwa';
      else if (arg.nativescript) platform = 'nativescript';
      else if (arg.firebase) platform = 'firebase';

      if (platform) {
        const platforms = require('../cli/platforms');
        platforms.addPlatform(platform);
      } else usageAlert();
    },
  )
  .command(
    'remove',
    `Remove different platforms added by Sveltail.
    This will remove all the files added by Sveltail, regardless of whether they have been modified by you.
    Please be careful!
    
    Options:

    --electron        [boolean]
    --cordova         [boolean]
    --pwa             [boolean]
    --nativescript    [boolean]
    --firebase        [boolean]  Removes firebase support
    `,
    () => {},
    (arg) => {
      let platform = null;
      if (arg.electron) platform = 'electron';
      else if (arg.cordova) platform = 'cordova';
      else if (arg.pwa) platform = 'pwa';
      else if (arg.nativescript) platform = 'nativescript';
      else if (arg.firebase) platform = 'firebase';

      if (platform) {
        const platforms = require('../cli/platforms');
        platforms.removePlatform(platform);
      } else usageAlert();
    },
  )
  .command(
    'dev',
    `Runs the development mode for specified platform.
    
    Options:

    --electron        [boolean]
    --cordova         [boolean]
      Cordova Specific:
        --ios         [boolean]
        --andorid     [boolean]

    --pwa             [boolean]
    --nativescript    [boolean]
      NS Specific:
        --ios         [boolean]
        --andorid     [boolean]
    `,
    () => {},
    (arg) => {
      const dev = require('../cli/dev');
      if (arg.cordova) {
        if (arg.android || arg.ios) {
          dev.devCordova({ mode: arg.android ? 'android' : 'ios' });
        } else usageAlert();
      } else if (arg.nativescript) {
        if (arg.android || arg.ios) {
          dev.devNS({ mode: arg.android ? 'android' : 'ios' });
        } else usageAlert();
      } else if (arg.electron) {
        dev.devElectron();
      } else if (arg.pwa) {
        dev.devPWA();
      } else {
        dev.devWeb();
      }
    },
  )
  .command(
    'build',
    `Builds the code for specified platform.
    
    Options:

    --electron        [boolean]
      Electron Specific:
      --noPackage     [boolean]
      --publish       [boolean]

    --cordova         [boolean]
      Cordova Specific:
        --ios         [boolean]
        --andorid     [boolean]

    --pwa             [boolean]
    --nativescript    [boolean]
      NS Specific:
        --ios         [boolean]
        --andorid     [boolean]
    `,
    () => {},
    (arg) => {
      const build = require('../cli/build');
      if (arg.cordova) {
        if (arg.android || arg.ios) {
          build.buildCordova({ mode: arg.android ? 'android' : 'ios' });
        } else usageAlert();
      } else if (arg.nativescript) {
        if (arg.android || arg.ios) {
          build.buildNS({ mode: arg.android ? 'android' : 'ios' });
        } else usageAlert();
      } else if (arg.electron) {
        build.buildElectron({ noPackage: !!arg.noPackage, publish: arg.publish !== undefined });
      } else if (arg.pwa) {
        build.buildPWA();
      } else {
        build.buildWeb();
      }
    },
  )
  .command(
    'recommended',
    'Adds the recommended linters and settings to the project.',
    () => {},
    () => {
      const recommended = require('../cli/recommended');
      recommended.default();
    },
  )
  .command(
    'GHToken',
    `Stores and uses your GHToken to automatically update env when publishing to Github Releases!
    
    Options:

    --set              [boolean]
    Use this option to set a GitHub Access Token for publishing to your repo's Releases.
    The token is stored in native OS credential manager, and retrieved automatically when needed.
    The tokens are not stored and/or used by Sveltail in any way.

      Further Options:
      --default        [boolean]
      Sets a global token store. Use this if you use one access token for all repos.

    --get              [boolean]
    Use this option to display the locally stored GH Token for this project.
    Returns the default token if project specific is not set.

    --clear         [boolean]
    Use this option to clear all the locally stored GH Token for this project.

      Further Options:
        --default        [boolean]
        Clears the global token store. Use this if you want to remove the global store instead.

    --list         [boolean]
    Use this option to list all the locally stored GH Tokens by Sveltail.
    `,
    () => {},
    (arg) => {
      const credentials = require('../cli/credentials');
      if (arg.set) credentials.setGHToken(arg.default);
      else if (arg.get) credentials.getGHToken();
      else if (arg.clear) credentials.clear(arg.default);
      else if (arg.list) credentials.list();
    },
  )
  .argv;
