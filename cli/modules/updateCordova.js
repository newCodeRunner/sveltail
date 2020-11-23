/* eslint-disable no-console */
const { resolve } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const XML = require('xml2js');

// Update Cordova Project Info
exports.default = (chalk, currDirectory, packageJSON) => {
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
};
