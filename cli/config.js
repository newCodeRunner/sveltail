/* eslint-disable no-console */

const clear = require('clear');
const inquirer = require('inquirer');
const { resolve } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { copySync } = require('fs-extra');
const plist = require('plist');
const XML = require('xml2js');

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
              { key: 'sveltail-config', script: 'sveltail config' },
              { key: 'sveltail-icons', script: 'sveltail icons --path src/assets/logo.png' },
              { key: 'sveltail-dev', script: 'sveltail dev' },
              { key: 'sveltail-build', script: 'veltail build' },
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

            // Add sveltail.config.js
            if (!existsSync(resolve(currDirectory, 'sveltail.config.js'))) {
              const sveltailConfig = readFileSync(resolve(__dirname, '../app/sveltail.config.js'));
              writeFileSync(resolve(currDirectory, 'sveltail.config.js'), sveltailConfig);
            }

            // Update Root Folder Package Info
            writeFileSync(resolve(currDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2));

            // Update Cordova Project Info
            if (existsSync(resolve(currDirectory, 'src-cordova/package.json'))) {
              const cordovaPkg = JSON.parse(readFileSync(resolve(currDirectory, 'src-cordova/package.json'), 'utf-8'));

              cordovaPkg.name = packageJSON.app.id;
              cordovaPkg.displayName = packageJSON.app.name;
              cordovaPkg.version = packageJSON.version;
              cordovaPkg.description = packageJSON.description;
              writeFileSync('src-cordova/package.json', JSON.stringify(cordovaPkg, null, 2));
              console.log(chalk.green(' Updated src-cordova/package.json'));

              const builderXML = new XML.Builder();

              const config = readFileSync(resolve(currDirectory, 'src-cordova/config.xml'), 'utf-8');
              let jObject = {};
              XML.parseString(config, (err, res) => {
                if (err) console.log(chalk.red('Unable to update src-cordova/config.xml'));
                else {
                  jObject = { ...res };
                  jObject.widget.$.id = packageJSON.app.id;
                  jObject.widget.$.version = packageJSON.version;
                  jObject.widget.name[0] = packageJSON.app.name;
                  jObject.widget.description[0] = packageJSON.description;
                  jObject.widget.author[0]._ = packageJSON.author;
                  jObject.widget.author[0].$.email = packageJSON.app.email;
                  jObject.widget.author[0].$.href = packageJSON.app.website;
                }

                const configXml = builderXML.buildObject(jObject);
                writeFileSync('src-cordova/config.xml', configXml);
                console.log(chalk.green(' Updated src-cordova/config.xml'));
              });
            }

            // Update NativeScript Project Info
            if (existsSync(resolve(currDirectory, 'src-nativescript/package.json'))) {
              const nativePkg = readFileSync(resolve(currDirectory, 'src-nativescript/package.json'), 'utf-8');
              nativePkg.name = packageJSON.name;
              nativePkg.version = packageJSON.version;
              nativePkg.author = packageJSON.author;
              nativePkg.description = packageJSON.description;
              writeFileSync('src-nativescript/package.json', JSON.stringify(nativePkg, null, 2));
              console.log(chalk.green(' Updated src-nativescript/package.json'));

              const stringsObject = {
                resources: {
                  string: [
                    {
                      _: packageJSON.app.name,
                      $: { name: 'app_name' },
                    },
                    {
                      _: packageJSON.app.id,
                      $: { name: 'app_id' },
                    },
                    {
                      _: `${packageJSON.app.id}.activity`,
                      $: { name: 'activity_id' },
                    },
                    {
                      _: packageJSON.app.name,
                      $: { name: 'title_activity_kimera' },
                    },
                  ],
                },
              };
              const builderXML = new XML.Builder();
              const stringsXml = builderXML.buildObject(stringsObject);
              writeFileSync('src-nativescript/App_Resources/Android/src/main/res/values/strings.xml', stringsXml);
              console.log(chalk.green(' Updated Nativescript Android Values'));

              const info = plist.parse(readFileSync('./src-nativescript/App_Resources/iOS/Info.plist', 'utf8'));
              info.CFBundleDisplayName = packageJSON.app.name;
              info.CFBundleName = packageJSON.id;
              info.CFBundleShortVersionString = packageJSON.version;
              info.CFBundleVersion = packageJSON.version;
              writeFileSync('src-nativescript/App_Resources/iOS/Info.plist', plist.build(info));
              console.log(chalk.green(' Updated Nativescript iOS values'));
            }

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
                *npm-debug.log*
                *yarn-debug.log*
                *yarn-error.log*

                # Editor directories and files
                .idea
                *.suo
                *.ntvs*
                *.njsproj
                *.sln`.replace(/^ +| +$/gm, ''),
              );
            }
          } else {
            console.log(chalk.red('\n Configuration cancelled by User. Please run the config command again.\n'));
          }
        });
    });
};
