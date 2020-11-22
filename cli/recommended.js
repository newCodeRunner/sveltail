/* eslint-disable no-console */
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { exec } = require('child_process');

exports.default = (chalk) => {
  const currDirectory = process.cwd();
  // Add .eslintrc.js
  if (!existsSync(resolve(currDirectory, '.eslintrc.js'))) {
    const eslintConfig = readFileSync(resolve(__dirname, '../.eslintrc.js'));
    writeFileSync(resolve(currDirectory, '.eslintrc.js'), eslintConfig);
    console.log(chalk.green(' Added eslint recommended settings'));
  }

  if (existsSync(resolve(currDirectory, 'package.json'))) {
    const packageJSON = JSON.parse(resolve(currDirectory, 'package.json'));
    const { dependencies, devDependencies } = packageJSON;

    const devDeps = [
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-plugin-import',
      'eslint-plugin-svelte3',
    ];
    const deps = [
      '',
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

    let firstDep = true;
    deps.forEach((cmd) => {
      if (!dependencies[cmd]) {
        if (firstDep) {
          firstDep = false;
          if (existsSync(resolve(currDirectory, 'package-lock.json'))) command += ' && npm install';
          else command += '  && yarn add';
        }
        command += ` ${cmd}`;
      }
    });

    const child = exec(command, { cwd: currDirectory });
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
      console.log(chalk.grey(data));
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
      throw new Error(data);
    });
  } else {
    console.log(chalk.yellow(' No package.json file found in root folder.'));
  }
};
