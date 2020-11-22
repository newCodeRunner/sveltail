// eslint-disable-next-line import/no-mutable-exports
let appSvelte;

if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
  import('./layouts/Web.svelte').then(async (module) => {
    const App = module.default;

    if (process.env.platform === 'PWA') {
      await import('../src-pwa/index.js');
    }

    appSvelte = new App({
      target: document.body,
    });
  });
}

if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
  import('./layouts/Native.svelte').then((module) => {
    appSvelte = module.default;
  });
}

export default appSvelte;
