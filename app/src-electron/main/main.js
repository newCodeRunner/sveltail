/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-unresolved
import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';
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
      devTools: !JSON.parse(process.env.PROD),

      nodeIntegration: false,
      nodeIntegrationInWorker: false,

      preload: resolve(__dirname, 'eR-main.js'),
    },
  });

  // Sets up window size, position and state
  setupUserPreferences(mainWindow);

  mainWindow.on('close', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(
    JSON.parse(process.env.PROD)
      ? `file:///${resolve(__dirname, process.APP_ENV.url)}`
      : process.APP_ENV.url,
  );
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
