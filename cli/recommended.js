/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { execSync } = require('child_process');

exports.default = (chalk) => {
  const currDirectory = process.cwd();
  // Add .eslintrc.js
  if (!existsSync(resolve(currDirectory, '.eslintrc.js'))) {
    const eslintConfig = readFileSync(resolve(__dirname, '../.eslintrc.js'));
    writeFileSync(resolve(currDirectory, '.eslintrc.js'), eslintConfig);
    console.log(chalk.green(' Added eslint recommended settings'));
  }

  if (existsSync(resolve(currDirectory, 'package.json'))) {
    const packageJSON = require(resolve(currDirectory, 'package.json'));
    const { devDependencies } = packageJSON;

    const devDeps = [
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-plugin-import',
      'eslint-plugin-svelte3',
    ];

    let command = '';
    devDeps.forEach((cmd) => {
      if (!devDependencies[cmd]) {
        if (command === '') {
          if (existsSync(resolve(currDirectory, 'package-lock.json'))) command = 'npm install';
          else command = 'yarn add';
        }
        command += ` ${cmd}`;
      }
    });

    if (command.trim() !== '') {
      execSync(command, { cwd: currDirectory, stdio: 'inherit' });
    }
  } else {
    console.log(chalk.yellow(' No package.json file found in root folder.'));
  }
};
