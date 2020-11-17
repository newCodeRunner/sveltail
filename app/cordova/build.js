const { readFileSync, writeFileSync } = require('fs');

const temp = {
  android: {
    release: {
      keystore: '',
      storePassword: '',
      alias: '',
      password: '',
      keystoreType: '',
    },
  },
};

module.exports.updateSecrets = () => {
  const env = readFileSync('./.env', 'utf-8');
  if (env.length > 0) {
    env.replace(/\r?\n|\r/g, '\n').split('\n').forEach((param) => {
      const [key, val] = param.split('=');
      if (temp.android.release[key] !== undefined) temp.android.release[key] = val;
    });
    writeFileSync('./src-cordova/build.json', JSON.stringify(temp));
    console.log(' Successfully created temp secrets file');
  }
};

module.exports.removeSecrets = () => {
  writeFileSync(
    './src-cordova/build.json',
    JSON.stringify({
      android: {
        release: {
          keystore: '',
          storePassword: '',
          alias: '',
          password: '',
          keystoreType: '',
        },
      },
    }),
  );
  console.log(' Successfully removed temp secrets file');
};

module.exports.generateKeyStore = () => {
  const env = readFileSync('./.env', 'utf-8');
  if (env.length > 0) {
    const tempObject = {};
    env.replace(/\r?\n|\r/g, '\n').split('\n').forEach((param) => {
      const [key, val] = param.split('=');
      tempObject[key] = val;
    });
    // eslint-disable-next-line object-curly-newline
    const { keystore, storePassword, alias, password } = tempObject;

    console.log(`|-genkey -v -keystore ./src-cordova/${keystore} -storepass ${storePassword} -alias ${alias} -keypass ${password} -keyalg RSA -keysize 2048 -validity 10000`);
  }
};
