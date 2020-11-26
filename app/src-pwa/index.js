// Do NOT rename or delete this file. The code in this file is run before loading the app in PWA mode.
// Use thsi file to configure and/or add code specifc to PWA mode.

/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((result) => {
        console.log('SW registered', process.APP_ENV.mode === 'development' ? `: ${result}` : '');
      })
      .catch((err) => {
        console.log('SW registration failed: ', process.APP_ENV.mode === 'development' ? `: ${err}` : '');
      });
  });
}
