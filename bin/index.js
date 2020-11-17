const { resolve, dirname } = require('path');
const clear = require('clear');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Clears the command prompt
clear();

console.log(chalk.bgBlue('Welcome to Sveltail CLI! Sveltail will help you setup your cross platform project in a jiffy!'));

let repo = '';
const packageJSON = {
  name: dirname(resolve(__dirname, '../../../')).replace(/\\/g, '/').split('/').pop(),
  version: '0.0.1',
  description: 'A Sveltail Project!',
  main: 'index.js',
  scripts: {
    test: 'echo \"Error: no test specified\" && exit 1'
  },
  repository: {
    type: 'git',
    url: "git+https://github.com/newCodeRunner/sveltail.git"
  },
  author: 'Sveltail',
  license: 'MIT',
  bugs: {
    url: "https://github.com/newCodeRunner/sveltail/issues"
  },
  homepage: 'https://github.com/newCodeRunner/sveltail#readme',
};

inquirer.prompt([
  {
    name: 'projectName',
    type: 'input',
    message: `Please enter your project name (${packageJSON.name}?)`,
    validate: (answer) => {
      const formattedAnswer = String(answer).trim();
      if (formattedAnswer.length > 0) {
        packageJSON.name = formattedAnswer;
      }
      return true;
    },
  },
  {
    name: 'projectName',
    type: 'input',
    message: `Please enter your project version (${packageJSON.version}?)`,
    validate: (answer) => {
      const formattedAnswer = String(answer).trim();
      if (new RegExp.ma('/^(\d+\.)?(\d+\.)?(\*|\d+)$/', $string).length > 0) {
        packageJSON.version = formattedAnswer;
      }
      return true;
    },
  },
]);
