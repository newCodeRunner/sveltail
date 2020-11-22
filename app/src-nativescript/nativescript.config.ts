import { NativeScriptConfig } from '@nativescript/webpack/nativescript-target';

export default {
  id: 'org.nativescript.sveltenative',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  webpackConfigPath: 'webpack.config.js',
} as NativeScriptConfig;