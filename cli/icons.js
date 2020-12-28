/* eslint-disable global-require */
/* eslint-disable no-console */
// eslint-disable-next-line object-curly-newline
const { existsSync, readFileSync, mkdirSync, writeFileSync } = require('fs');
const { resolve, dirname } = require('path');
const sharp = require('sharp');
const { createICO, createICNS } = require('png2icons');

const makeDirectory = (dir) => {
  const directory = dirname(dir);
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
};

exports.default = (chalk, arg) => {
  const currDirectory = process.cwd();

  let logoPath = null;
  let splashPath = null;

  if (arg.logoPath) {
    if (existsSync(resolve(currDirectory, arg.logoPath))) {
      logoPath = resolve(currDirectory, arg.logoPath);
    }

    if (existsSync(resolve(currDirectory, arg.splashPath))) {
      splashPath = resolve(currDirectory, arg.splashPath);
    }
  }

  const logoType = logoPath ? logoPath.split('.').pop() : null;

  if (logoPath !== null && logoType !== null) {
    console.log('\n');
    console.log(chalk.green(`Using Logo: ${logoPath}`));
    console.log(chalk.green(`Using Splash Logo: ${splashPath}`));
    console.log(chalk.green(`Using Splash Background: ${arg.background}`));
    console.log('\n');

    const buffer = readFileSync(logoPath);

    // Default Icons for Web
    const Web = [16, 32, 96, 128];
    Web.forEach((size) => {
      const outputPath = resolve(currDirectory, 'public/Web/icons', `logo-${size}x${size}.png`);
      makeDirectory(outputPath);

      if (logoType === 'png') {
        sharp(buffer)
          .resize(size, size)
          .toFile(outputPath, (err) => {
            if (!err) console.log(`Saved image at ${outputPath}`);
            else throw new Error(err);
          });
      } else {
        sharp(buffer)
          .png()
          .resize(size, size)
          .toFile(outputPath, (err) => {
            if (!err) console.log(`Saved image at ${outputPath}`);
            else throw new Error(err);
          });
      }
    });

    // Icons for PWA
    if (existsSync(resolve(currDirectory, 'src-pwa'))) {
      const PWA = [16, 32, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512];
      PWA.forEach((size) => {
        const outputPath = resolve(currDirectory, 'public/PWA/icons', `logo-${size}x${size}.png`);
        makeDirectory(outputPath);

        if (logoType === 'png') {
          sharp(buffer)
            .resize(size, size)
            .toFile(outputPath, (err) => {
              if (!err) console.log(`Saved image at ${outputPath}`);
              else throw new Error(err);
            });
        } else {
          sharp(buffer)
            .png()
            .resize(size, size)
            .toFile(outputPath, (err) => {
              if (!err) console.log(`Saved image at ${outputPath}`);
              else throw new Error(err);
            });
        }
      });
    }

    // Icons for NativeScript
    if (existsSync(resolve(currDirectory, 'src-nativescript'))) {
      const Android = {
        'drawable-hdpi': {
          icon: '72×72',
          logo: '288×288',
          background: '576×768',
        },
        'drawable-ldpi': {
          icon: '36×36',
          logo: '144×144',
          background: '288×384',
        },
        'drawable-mdpi': {
          icon: '48×48',
          logo: '192×192',
          background: '384×512',
        },
        'drawable-xhdpi': {
          icon: '96×96',
          logo: '384×384',
          background: '768×1024',
        },
        'drawable-xxhdpi': {
          icon: '144×144',
          logo: '576×576',
          background: '1152×1536',
        },
        'drawable-xxxhdpi': {
          icon: '345×345',
          logo: '768×768',
          background: '1536×2048',
        },
      };

      const iOS = {
        icon: {
          'icon-20.png': 20,
          'icon-20@2x.png': 40,
          'icon-20@3x.png': 60,
          'icon-29.png': 29,
          'icon-29@2x.png': 58,
          'icon-29@3x.png': 87,
          'icon-40.png': 40,
          'icon-40@2x.png': 80,
          'icon-40@3x.png': 120,
          'icon-60@2x.png': 120,
          'icon-60@3x.png': 180,
          'icon-76.png': 76,
          'icon-76@2x.png': 152,
          'icon-83.5@2x.png': 167,
          'icon-1024.png': 1024,
          'LaunchScreen-AspectFill.png': '768×1024',
          'LaunchScreen-AspectFill@2x.png': '1536×2048',
          'LaunchScreen-AspectFill@3x.png': '2304×3072',
        },
        splash: {
          'LaunchScreen-Center.png': 384,
          'LaunchScreen-Center@2x.png': 768,
          'LaunchScreen-Center@3x.png': 1152,
        },
      };

      Object.keys(Android).forEach((pathKey) => {
        Object.keys(Android[pathKey]).forEach((nameKey) => {
          const size = Android[pathKey][nameKey].split('×').map((i) => Number(i));
          const outputPath = resolve(currDirectory, 'src-nativescript/App_Resources/Android/src/main/res', pathKey, `${nameKey}.png`);
          makeDirectory(outputPath);

          if (nameKey === 'icon') {
            if (logoType === 'png') {
              sharp(buffer)
                .resize(size[0], size[0])
                .toFile(outputPath, (err) => {
                  if (!err) console.log(`Saved image at ${outputPath}`);
                  else throw new Error(err);
                });
            } else {
              sharp(buffer)
                .png()
                .resize(size, size)
                .toFile(outputPath, (err) => {
                  if (!err) console.log(`Saved image at ${outputPath}`);
                  else throw new Error(err);
                });
            }
          } else if (nameKey === 'background') {
            sharp({
              create: {
                width: size[0],
                height: size[1],
                channels: 4,
                background: arg.background,
              },
            })
              .png()
              .toFile(outputPath, (err) => {
                if (!err) console.log(`Saved image at ${outputPath}`);
                else throw new Error(err);
              });
          }
        });
      });

      Object.keys(iOS.icon).forEach((nameKey) => {
        if (nameKey.includes('icon')) {
          const size = iOS.icon[nameKey];
          const outputPath = resolve(currDirectory, 'src-nativescript/App_Resources/iOS/Assets.xcassets/', 'AppIcon.appiconset/', nameKey);
          makeDirectory(outputPath);

          if (logoType === 'png') {
            sharp(buffer)
              .resize(size, size)
              .toFile(outputPath, (err) => {
                if (!err) console.log(`Saved image at ${outputPath}`);
              });
          } else {
            sharp(buffer)
              .png()
              .resize(size, size)
              .toFile(outputPath, (err) => {
                if (!err) console.log(`Saved image at ${outputPath}`);
              });
          }
        } else if (nameKey.includes('LaunchScreen')) {
          const bgSize = iOS.icon[nameKey].split('×').map((i) => Number(i));
          const outputPath = resolve(
            currDirectory, 'src-nativescript/App_Resources/iOS/Assets.xcassets/', 'LaunchScreen.AspectFill.imageset/', nameKey,
          );
          makeDirectory(outputPath);

          sharp({
            create: {
              width: bgSize[0],
              height: bgSize[1],
              channels: 4,
              background: arg.background,
            },
          })
            .png()
            .toFile(outputPath, (err) => {
              if (!err) console.log(`Saved image at ${outputPath}`);
            });
        }
      });

      if (splashPath !== null) {
        const bufferSplash = readFileSync(splashPath);

        Object.keys(Android).forEach((pathKey) => {
          Object.keys(Android[pathKey]).forEach((nameKey) => {
            if (nameKey === 'logo') {
              const size = Android[pathKey][nameKey].split('×').map((i) => Number(i));
              const outputPath = resolve(
                currDirectory, 'src-nativescript/App_Resources/Android/src/main/res', pathKey, `${nameKey}.png`,
              );
              makeDirectory(outputPath);

              sharp(bufferSplash)
                .resize(size[0], size[0])
                .toFile(outputPath, (err) => {
                  if (!err) console.log(`Saved image at ${outputPath}`);
                });
            }
          });
        });

        Object.keys(iOS.splash).forEach((nameKey) => {
          const size = iOS.splash[nameKey];
          const outputPath = resolve(
            currDirectory, 'src-nativescript/App_Resources/iOS/Assets.xcassets', 'LaunchScreen.Center.imageset', nameKey,
          );
          makeDirectory(outputPath);

          sharp(bufferSplash)
            .resize(size, size)
            .toFile(outputPath, (err) => {
              if (!err) console.log(`Saved image at ${outputPath}`);
            });
        });
      }
    }

    // Icons for Cordova
    if (existsSync(resolve(currDirectory, 'src-cordova'))) {
      const Cordova = {
        icons: {
          'res/android': {
            'hdpi.png': 72,
            'ldpi.png': 36,
            'mdpi.png': 48,
            'xhdpi.png': 96,
            'xxhdpi.png': 144,
            'xxxhdpi.png': 192,
          },
          'res/ios': {
            'icon-1024.png': 1024,
            'icon-20.png': 20,
            'icon-20@2x.png': 40,
            'icon-20@3x.png': 60,
            'icon-24@2x.png': 48,
            'icon-27.5@2x.png': 55,
            'icon-29.png': 29,
            'icon-29@2x.png': 58,
            'icon-29@3x.png': 87,
            'icon-40.png': 40,
            'icon-40@2x.png': 80,
            'icon-44@2x.png': 88,
            'icon-50.png': 50,
            'icon-50@2x.png': 100,
            'icon-60@2x.png': 120,
            'icon-60@3x.png': 180,
            'icon-72.png': 72,
            'icon-72@2x.png': 144,
            'icon-76.png': 76,
            'icon-76@2x.png': 152,
            'icon-83.5@2x.png': 167,
            'icon-86@2x.png': 172,
            'icon-98@2x.png': 196,
            'icon.png': 57,
            'icon@2x.png': 114,
          },
        },
        splash: {
          'res/screen/android': {
            'splash-land-hdpi.png': '800×480',
            'splash-land-ldpi.png': '320×200',
            'splash-land-mdpi.png': '480×320',
            'splash-land-xhdpi.png': '1280×720',
            'splash-land-xxhdpi.png': '1600×960',
            'splash-land-xxxhdpi.png': '1920×1280',
            'splash-port-hdpi.png': '480×800',
            'splash-port-ldpi.png': '200×320',
            'splash-port-mdpi.png': '320×480',
            'splash-port-xhdpi.png': '720×1280',
            'splash-port-xxhdpi.png': '960×1600',
            'splash-port-xxxhdpi.png': '1280×1920',
          },
          'res/screen/ios': {
            'Default@2x~ipad~anyany.png': '2732×2732',
            'Default@2x~ipad~comany.png': '1278×2732',
            'Default@2x~iphone~anyany.png': '1334×1334',
            'Default@2x~iphone~comany.png': '750×1334',
            'Default@2x~iphone~comcom.png': '1334×750',
            'Default@3x~iphone~anyany.png': '2208×2208',
            'Default@3x~iphone~anycom.png': '2208×1242',
            'Default@3x~iphone~comany.png': '1242×2208',
          },
        },
        browser: [16, 32, 96, 128],
      };

      Cordova.browser.forEach((size) => {
        const outputPath = resolve(currDirectory, 'public/Cordova/icons', `logo-${size}x${size}.png`);
        if (logoType === 'png') {
          sharp(buffer)
            .resize(size, size)
            .toFile(outputPath, (err) => {
              if (!err) console.log(`Saved image at ${outputPath}`);
            });
        } else {
          sharp(buffer)
            .png()
            .resize(size, size)
            .toFile(outputPath, (err) => {
              if (!err) console.log(`Saved image at ${outputPath}`);
            });
        }
      });

      Object.keys(Cordova.icons).forEach((pathKey) => {
        Object.keys(Cordova.icons[pathKey]).forEach((nameKey) => {
          const size = Cordova.icons[pathKey][nameKey];
          const outputPath = resolve(currDirectory, 'src-cordova', pathKey, nameKey);
          makeDirectory(outputPath);

          if (logoType === 'png') {
            sharp(buffer)
              .resize(size, size)
              .toFile(outputPath, (err) => {
                if (!err) console.log(`Saved image at ${outputPath}`);
              });
          } else {
            sharp(buffer)
              .png()
              .resize(size, size)
              .toFile(outputPath, (err) => {
                if (!err) console.log(`Saved image at ${outputPath}`);
              });
          }
        });
      });

      if (splashPath !== null) {
        const bufferSplash = readFileSync(splashPath);
        Object.keys(Cordova.splash).forEach((pathKey) => {
          Object.keys(Cordova.splash[pathKey]).forEach((nameKey) => {
            const bgSize = Cordova.splash[pathKey][nameKey].split('×').map((i) => Number(i));
            const splashSize = parseInt(Math.min(bgSize[0], bgSize[1]) * 0.6, 10);
            const outputPath = resolve(currDirectory, 'src-cordova', pathKey, nameKey);
            makeDirectory(outputPath);

            sharp(bufferSplash)
              .resize(splashSize, splashSize)
              .toBuffer()
              .then((data) => {
                sharp({
                  create: {
                    width: bgSize[0],
                    height: bgSize[1],
                    channels: 4,
                    background: arg.background,
                  },
                })
                  .composite([{ input: data }])
                  .png()
                  .toFile(outputPath, (err) => {
                    if (!err) console.log(`Saved image at ${outputPath}`);
                  });
              });
          });
        });
      }
    }

    if (existsSync(resolve(currDirectory, 'src-electron'))) {
      const outputPath = resolve(currDirectory, 'public/Electron/icons', 'icon.png');
      makeDirectory(outputPath);

      // PNG File
      sharp(buffer)
        .resize(512, 512)
        .toFormat('png')
        .toFile(outputPath, (err) => {
          if (!err) console.log(`Saved image at ${outputPath}`);
          else throw new Error(err);
        });

      // ICO File
      const icoPath = outputPath.replace('.png', '.ico');
      sharp(buffer)
        .resize(256, 256)
        .toBuffer((err, resized) => {
          if (!err) {
            const converted = createICO(resized, 0, 0);
            if (converted) {
              writeFileSync(icoPath, converted);
              console.log(`Saved image at ${icoPath}`);
            }
          } else throw new Error(err);
        });

      // ICNS File
      const icnsPath = outputPath.replace('.png', '.icns');
      sharp(buffer)
        .resize(256, 256)
        .toBuffer((err, resized) => {
          if (!err) {
            const converted = createICNS(resized, 0, 0);
            if (converted) {
              writeFileSync(icnsPath, converted);
              console.log(`Saved image at ${icnsPath}`);
            }
          } else throw new Error(err);
        });
    }
  } else {
    throw new Error('Invalid logo path: Please define a valid logo path with --logo argument. Eg. "--logo ./logo.png"');
  }
};
