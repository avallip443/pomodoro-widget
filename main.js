const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/timer.html'));
});

// handle switching between pages
ipcMain.on('navigate', (e, page) => {
  if (page === 'setup') {
    mainWindow.loadFile(path.join(__dirname, 'renderer/setup.html'));
  } else if (page === 'timer') {
    mainWindow.loadFile(path.join(__dirname, 'renderer/timer.html'));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
