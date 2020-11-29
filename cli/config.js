/* eslint-disable no-console */

const clear = require('clear');
const inquirer = require('inquirer');
const { resolve } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { copySync } = require('fs-extra');

const updateCordova = require('./modules/updateCordova.js');
const updateNS = require('./modules/updateNS.js');

exports.default = (chalk) => {
  // Clears the command prompt
  clear();

  console.log(chalk.bgBlue(' Welcome to Sveltail CLI! Sveltail will help you setup your cross platform project in a jiffy!'));
  // eslint-disable-next-line max-len
  console.log(chalk.yellow('\n Please note that if you have already created a project using "npm init" or otherwise or run Sveltail CLI before, it will update the files to the values you input!'));

  const currDirectory = process.cwd();
  const packageJSON = {};

  if (existsSync(resolve(currDirectory, 'package.json'))) {
    const tempObject = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
    packageJSON.name = tempObject.name ? tempObject.name : currDirectory.replace(/\\/g, '/').split('/').pop();
    packageJSON.version = tempObject.version ? tempObject.version : '1.0.0';
    packageJSON.description = tempObject.description ? tempObject.description : 'A Sveltail Example';
    packageJSON.app = tempObject.app
      ? tempObject.app
      : {
        id: 'app.web.sveltail', name: 'Sveltail App', email: 'awesome@svetail.com', website: 'svetail.com',
      };

    Object.keys(tempObject).forEach((key) => {
      packageJSON[key] = tempObject[key];
    });

    console.log('\n Found a package.json in root directory. Loaded current values as defaults...\n');
  } else {
    packageJSON.name = currDirectory.replace(/\\/g, '/').split('/').pop();
    packageJSON.version = '1.0.0';
    packageJSON.description = 'A Sveltail Example';
    packageJSON.app = {
      id: 'app.web.sveltail', name: 'Sveltail App', email: 'awesome@svetail.com', website: 'svetail.com',
    };
  }

  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: `Please enter your project name (${packageJSON.name})?`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.name = formattedAnswer;
          }
          return true;
        },
      },
      {
        name: 'version',
        type: 'input',
        message: `Please enter your project version (${packageJSON.version})?`,
        validate: (answer) => {
          let proceed = true;
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            if (formattedAnswer.match(/^(\d+\.)?(\d+\.)?(\*|\d+)$/)) {
              packageJSON.version = formattedAnswer;
            } else {
              proceed = 'Not a valid version number';
            }
          }
          return proceed;
        },
      },
      {
        name: 'description',
        type: 'input',
        message: `Please enter your project description (${packageJSON.description})?`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.description = formattedAnswer;
          }
          return true;
        },
      },
      {
        name: 'author',
        type: 'input',
        message: `Please enter the author name (${packageJSON.author})?`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.author = formattedAnswer;
          }
          return true;
        },
      },
      {
        name: 'appName',
        type: 'input',
        message: `Please enter the app display name (${packageJSON.app.name})? (Required for Electron, Cordova and NativeScript)`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.app.name = formattedAnswer;
          }
          return true;
        },
      },
      {
        name: 'appId',
        type: 'input',
        message: `Please enter the app id (${packageJSON.app.id})? (Required for Cordova and NativeScript)`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.app.id = formattedAnswer;
          }
          return true;
        },
      },
      {
        name: 'appWebsite',
        type: 'input',
        message: `Please enter the website related to your app (${packageJSON.app.website})? (Required for Cordova)`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.app.website = formattedAnswer;
          }
          return true;
        },
      },
      {
        name: 'appEmail',
        type: 'input',
        message: `Please enter the email related to your app (${packageJSON.app.email})? (Required for Cordova)`,
        validate: (answer) => {
          const formattedAnswer = String(answer).trim();
          if (formattedAnswer.length > 0) {
            packageJSON.app.email = formattedAnswer;
          }
          return true;
        },
      },
    ])
    .then(() => {
      console.log(chalk.green('\n'));
      console.log(chalk.green(JSON.stringify({
        name: packageJSON.name,
        description: packageJSON.description,
        author: packageJSON.author,
        version: packageJSON.version,
        app: packageJSON.app,
      }, null, 2)));
      console.log(chalk.green('\n'));

      inquirer
        .prompt([
          {
            name: 'confirm',
            type: 'confirm',
            message: 'Is the above project information correct?',
          },
        ])
        .then(({ confirm }) => {
          if (confirm) {
            const scripts = [
              { key: 'st-config', script: 'sveltail config' },
              { key: 'st-icons', script: 'sveltail icons --path src/assets/logo.png' },
              { key: 'st-dev', script: 'sveltail dev' },
              { key: 'st-build', script: 'sveltail build' },
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

            // Update Root Folder Package Info
            writeFileSync(resolve(currDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2));

            // Add sveltail.config.js
            if (!existsSync(resolve(currDirectory, 'sveltail.config.js'))) {
              const sveltailConfig = readFileSync(resolve(__dirname, '../app/sveltail.config.js'));
              writeFileSync(resolve(currDirectory, 'sveltail.config.js'), sveltailConfig);
            }

            // Update Cordova Project Info
            updateCordova.default(chalk, currDirectory, packageJSON);

            // Update NativeScript Project Info
            updateNS.default(chalk, currDirectory, packageJSON);

            // Add src folder if not exsists
            if (!existsSync(resolve(currDirectory, 'src'))) {
              copySync(resolve(__dirname, '../app/src'), resolve(currDirectory, 'src'));
            }

            // Add .gitignore file if not exsists
            if (!existsSync(resolve(currDirectory, '.gitignore'))) {
              writeFileSync(
                resolve(currDirectory, '.gitignore'),
                `# Common
                *.DS_Store
                *.thumbs.db
                *node_modules*

                # Log files
                *debug.log
                *npm-debug.log
                *yarn-debug.log
                *yarn-error.log

                # Editor directories and files
                .idea
                *.suo
                *.ntvs*
                *.njsproj
                *.sln
                .vscode
                
                # Framework
                .sveltail
                dist/
                src-cordova/platforms
                src-cordova/plugins`.replace(/^ +| +$/gm, ''),
              );
            }

            // Add .gitattributes file if not exsists
            if (!existsSync(resolve(currDirectory, '.gitattributes'))) {
              writeFileSync(
                resolve(currDirectory, '.gitattributes'),
                `*.js eol=lf
                *.css eol=lf 
                *.svelte eol=lf 
                *.html eol=lf
                *.scss eol=lf
                *.sass eol=lf`.replace(/^ +| +$/gm, ''),
              );
            }

            // Add .editorconfig file if not exsists
            if (!existsSync(resolve(currDirectory, '.editorconfig'))) {
              writeFileSync(
                resolve(currDirectory, '.editorconfig'),
                `root = true

                [*]
                charset = utf-8
                indent_style = space
                indent_size = 2
                end_of_line = lf
                insert_final_newline = true
                trim_trailing_whitespace = true`.replace(/^ +| +$/gm, ''),
              );
            }
          } else {
            console.log(chalk.red('\n Configuration cancelled by User. Please run the config command again.\n'));
          }
        });
    });
};
