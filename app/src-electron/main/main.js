/* eslint-disable no-underscore-dangle */
import { app, BrowserWindow } from 'electron';
import setupUserPreferences from './modules/userPreferences';

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    useContentSize: true,
    webPreferences: {
      enableRemoteModule: false,
      webSecurity: true,
      webviewTag: false,
      navigateOnDragDrop: false,
      allowRunningInsecureContent: false,
      devTools: !process.env.PROD,

      nodeIntegration: false,
      nodeIntegrationInWorker: false,

      preload: './eR-main.js',
    },
  });

  // Sets up window size, position and state
  setupUserPreferences(mainWindow);

  mainWindow.on('close', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(process.APP_ENV.url);
};

// Make changes for production
if (process.env.PROD) {
  // eg. Menu.setApplicationMenu(false);
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
