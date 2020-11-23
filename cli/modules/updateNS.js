/* eslint-disable no-console */
const { resolve } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const plist = require('plist');
const XML = require('xml2js');

exports.default = (chalk, currDirectory, packageJSON) => {
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
};
