/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
const { writeFileSync, readFileSync } = require('fs');
const plist = require('plist');
const XML = require('xml2js');
const { productVersion, productDescription, productName, productDetails } = require('../../package.json');
const cordovaPkg = require('../../src-cordova/package.json');
const nativePkg = require('../../src-nativescript/package.json');

const builderXML = new XML.Builder();

const defaults = {
  version: productVersion,
  description: productDescription,
  name: productName,
  Id: productDetails.ID,
  author: productDetails.Company,
  email: productDetails.Email,
  website: productDetails.Website,
};

module.exports.update = async () => {
  console.log(' Updating src-cordova/config.xml');
  const config = readFileSync('./src-cordova/config.xml', 'utf-8');
  let jObject = {};
  await XML.parseString(config, (err, res) => {
    jObject = { ...res };
    jObject.widget.$.id = defaults.Id;
    jObject.widget.$.version = defaults.version;
    jObject.widget.name[0] = defaults.name;
    jObject.widget.description[0] = defaults.description;
    jObject.widget.author[0]._ = defaults.author;
    jObject.widget.author[0].$.email = defaults.email;
    jObject.widget.author[0].$.href = defaults.website;
  });
  const configXml = await builderXML.buildObject(jObject);
  writeFileSync('src-cordova/config.xml', configXml);

  console.log(' Updating src-cordova/package.json');
  cordovaPkg.name = defaults.Id;
  cordovaPkg.displayName = defaults.name;
  cordovaPkg.version = defaults.version;
  cordovaPkg.description = defaults.description;
  writeFileSync('src-cordova/package.json', JSON.stringify(cordovaPkg, null, 2));

  console.log(' Updating src-nativescript/package.json');
  nativePkg.name = defaults.name;
  nativePkg.version = defaults.version;
  nativePkg.author = defaults.author;
  nativePkg.description = defaults.description;
  writeFileSync('src-nativescript/package.json', JSON.stringify(nativePkg, null, 2));

  console.log(' Updating Nativescript Android Values');
  const stringsObject = {
    resources: {
      string: [
        {
          _: defaults.name,
          $: { name: 'app_name' },
        },
        {
          _: defaults.Id,
          $: { name: 'app_id' },
        },
        {
          _: `${defaults.Id}.activity`,
          $: { name: 'activity_id' },
        },
        {
          _: defaults.name,
          $: { name: 'title_activity_kimera' },
        },
      ],
    },
  };
  const stringsXml = await builderXML.buildObject(stringsObject);
  writeFileSync('src-nativescript/App_Resources/Android/src/main/res/values/strings.xml', stringsXml);

  console.log(' Updating Nativescript iOS values');
  const info = plist.parse(readFileSync('./src-nativescript/App_Resources/iOS/Info.plist', 'utf8'));
  info.CFBundleDisplayName = defaults.name;
  info.CFBundleName = defaults.name;
  info.CFBundleShortVersionString = defaults.version;
  info.CFBundleVersion = defaults.version;
  writeFileSync('src-nativescript/App_Resources/iOS/Info.plist', plist.build(info));
};
