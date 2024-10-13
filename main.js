const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.webContents.openDevTools();

  win.loadURL('http://localhost:3000');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
const loq = '안녕?';
const decodedFileloq = Buffer.from(loq, 'latin1').toString('utf8');
console.log(decodedFileloq);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
ipcMain.handle(
  'convert-image',
  async (event, { fileName, format, width, height, buffer }) => {
    try {
      const outputDir = path.join(app.getPath('desktop'), 'ConvertedImages');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const outputPath = path.join(
        outputDir,
        `converted-${Date.now()}.${format}`
      );
      let transformer = sharp(buffer).toFormat(format);

      if (width || height) {
        transformer = transformer.resize(width || null, height || null);
      }

      await transformer.toFile(outputPath);
      return outputPath;
    } catch (error) {
      console.error('Image conversion failed:', error);
      throw error;
    }
  }
);
