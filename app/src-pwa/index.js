if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((result) => {
        console.log('SW registered', process.APP_ENV.mode === 'development' ? `: ${result}` : '');
      })
      .catch((err) => {
        console.log('SW registration failed: ', err);
      });
  });
}
