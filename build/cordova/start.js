const { writeFileSync, readFileSync } = require('fs');
const XML = require('xml2js');

const builderXML = new XML.Builder();

module.exports.dev = async () => {
  console.log(' Updating src-cordova/config.xml for Dev Environment');
  const config = readFileSync('./src-cordova/config.xml', 'utf-8');
  let jObject = {};
  await XML.parseString(config, (err, res) => {
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
  });
  const configXml = await builderXML.buildObject(jObject);
  writeFileSync('src-cordova/config.xml', configXml);
  console.log(' Setup complete');
};
