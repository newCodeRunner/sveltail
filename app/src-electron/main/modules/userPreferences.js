import Store from 'electron-store';

export default (window) => {
  // Define a Store
  const store = new Store();

  if (window !== null) {
    let preferences = store.get('user-preferences');

    const maximizeWindow = () => {
      window.once('show', () => {
        window.maximize();
      });
    };

    // Define Settings on First Time Use
    if (!preferences) {
      preferences = {
        x: 0,
        y: 0,
        width: 1000,
        height: 800,
        isMaximized: false,
      };
      store.set('user-preferences', preferences);
    } else {
      // Restore Last Stored Window Settings
      if (preferences.isMaximized === true) maximizeWindow();

      window.setBounds({
        x: preferences.x,
        y: preferences.y,
        width: preferences.width,
        height: preferences.height,
      });
    }
  }

  // Set Up Auto Save of User Preferences on Close
  window.on('close', () => {
    const bounds = window.getBounds();
    store.set('user-preferences', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: window.isMaximized(),
    });
  });
};
