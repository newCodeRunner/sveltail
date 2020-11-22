/* eslint-disable no-console */
const { resolve } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { exec } = require('child_process');
const XML = require('xml2js');

const currDirectory = process.cwd();

const entryAvail = () => existsSync(resolve(currDirectory, 'src/app.js'));

exports.devCordova = (chalk) => {
  const configPath = resolve(currDirectory, 'src-cordova/config.xml');
  if (existsSync(configPath)) {
    const config = readFileSync(configPath, 'utf-8');
    let jObject = {};
    XML.parseString(config, (err, res) => {
      jObject = { ...res };
      jObject.widget.content[0].$.src = 'http://localhost:8080/';
      if (!jObject.widget['allow-navigation']) {
        jObject.widget['allow-navigation'] = [];
        jObject.widget['allow-navigation'].push({
          $: {
            href: 'http://localhost:8080/',
          },
        });
      } else {
        jObject.widget['allow-navigation'][0].$.href = 'http://localhost:8080/';
      }

      const builderXML = new XML.Builder();
      const configXml = builderXML.buildObject(jObject);
      writeFileSync(configPath, configXml);
      console.log(chalk.green(' Updated src-cordova/config.xml for Dev Environment'));
    });
  } else {
    console.log(chalk.red('Error: File "src-cordova/config.xml" not found. Please run "sveltail platform add --cordova"'));
  }
};

exports.devWeb = (chalk) => {
  if (entryAvail()) {
    const configPath = resolve(__dirname, './modules/webpack');
    const child = exec(`webpack serve --config ${configPath} --env mode=development --env platform=Web`, { cwd: currDirectory });
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
      console.log(chalk.grey(data));
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
      throw new Error(data);
    });
  }
};
