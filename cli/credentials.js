/* eslint-disable no-console */
const inquirer = require('inquirer');
const keytar = require('keytar');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const chalk = require('chalk');

// Find current working directory
const currDirectory = process.cwd();

// Load values from package.json
const packageJSON = JSON.parse(readFileSync(resolve(currDirectory, 'package.json'), 'utf-8'));
const { name } = packageJSON;

const isNull = (value) => value === null;
const isUndefined = (value) => typeof value === 'undefined';

exports.getGHToken = () => new Promise((res) => {
  let token = null;
  let accountName = name;
  if (isNull(name) || isUndefined(name)) accountName = 'default';

  keytar.findCredentials('Sveltail')
    .then((accounts) => {
      const foundIndex = accounts.findIndex((i) => i.account === accountName);
      const defaultIndex = accounts.findIndex((i) => i.account === 'default');
      if (foundIndex > -1) {
        const { password } = accounts[foundIndex];
        token = password;

        console.log(chalk.green(`\n Sveltail: The GH Token stored against ${accountName} is:`));
        console.log(chalk.grey(` ${password}`));
      } else if (defaultIndex > -1) {
        const { password } = accounts[defaultIndex];
        token = password;

        console.log(chalk.green('\n Sveltail: The GH Token stored against default is:'));
        console.log(chalk.grey(` ${password}`));
      } else {
        console.log(chalk.yellow('\n Sveltail: Your pakcage.json is missing name property or is null. Default store is also not set.'));
        console.log(chalk.gray(' Please save a token as default or set up a store with project\'s name property using:'));
        console.log(chalk.gray(' "sveltail GHToken --set"'));
      }
      res(token);
    })
    .catch((err) => {
      res(token);
      throw new Error(err);
    });
});

exports.setGHToken = (setDefault) => {
  inquirer
    .prompt([
      {
        name: 'token',
        type: 'input',
        message: 'Please enter your GH Token for Releases (Stored in OS Credential Manager):',
        validate: (answer) => {
          let proceed = true;
          if (isNull(answer) || isUndefined(answer) || String(answer).trim() === '') proceed = 'The GH Token can not be blank';
          return proceed;
        },
      },
    ])
    .then(({ token }) => {
      keytar.findCredentials('Sveltail')
        .then((accounts) => {
          let accountName = name;
          let foundIndex = -1;

          if (setDefault) accountName = 'default';

          if (!isNull(name) && !isUndefined(name)) foundIndex = accounts.findIndex((i) => i.account === accountName);
          else accountName = 'default';

          if (foundIndex > -1) console.log(chalk.yellow(`\n Sveltail: Token already present for ${accountName}. Overwriting ...`));

          keytar.setPassword('Sveltail', accountName, token)
            .then(() => {
              console.log(chalk.green(`\n Sveltail: Successfully stored ${accountName} in native OS Credential Manager`));
            })
            .catch((err) => {
              throw new Error(err);
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

exports.clear = (clearDefault) => {
  let accountName = name;
  if (clearDefault) accountName = 'default';
  keytar.deletePassword('Sveltail', accountName)
    .then(() => {
      console.log(chalk.green(`\n Sveltail: Successfully removed ${accountName} from credentials.`));
    })
    .catch((err) => {
      throw new Error(err);
    });
};

exports.list = () => {
  keytar.findCredentials('Sveltail')
    .then((accounts) => {
      if (accounts.length > 0) {
        console.log(chalk.green('\n Sveltail: Below credentials have been saved:'));
        accounts.forEach(({ account }) => {
          console.log(chalk.gray(` ${account}`));
        });
      } else {
        console.log(chalk.green('\n Sveltail: There are no credentials saved.'));
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};
