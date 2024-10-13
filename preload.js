const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electron', {
  convertImage: async (fileName, format, width, height, file, quality) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await ipcRenderer.invoke('convert-image', {
      fileName,
      format,
      width,
      height,
      buffer,
      quality,
    });
  },
});
