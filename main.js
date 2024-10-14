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

  // win.webContents.openDevTools();

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

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

      const outputPath = path.join(
        outputDir,
        `${nameWithoutExtension}-${Date.now()}.${format}`
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
