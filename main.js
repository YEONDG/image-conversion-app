const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  Menu.setApplicationMenu(null);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle(
  'convert-image',
  async (event, { fileName, format, width, height, buffer, quality }) => {
    try {
      const outputDir = path.join(app.getPath('desktop'), 'ConvertedImages');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      const nameWithoutExtension = fileName.substring(
        0,
        fileName.lastIndexOf('.')
      );

      const date = new Date();

      const year = String(date.getFullYear()).slice(2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

      const outputPath = path.join(
        outputDir,
        `${nameWithoutExtension}-${year}${month}${day}-${milliseconds}.${format}`
      );

      let transformer;

      switch (format) {
        case 'jpeg':
        case 'jpg':
          transformer = sharp(buffer).jpeg({
            quality: quality === 'low' ? 50 : quality === 'medium' ? 75 : 100,
          });
          break;

        case 'png':
          transformer = sharp(buffer).png({
            compressionLevel:
              quality === 'low' ? 9 : quality === 'medium' ? 6 : 3,
          });
          break;

        case 'webp':
          transformer = sharp(buffer).webp({
            quality: quality === 'low' ? 50 : quality === 'medium' ? 75 : 100,
          });
          break;

        case 'avif':
          transformer = sharp(buffer).avif({
            quality: quality === 'low' ? 30 : quality === 'medium' ? 50 : 80,
          });
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

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
