export {};

declare global {
  interface Window {
    electron: {
      convertImage: (
        filePath: string,
        format: string,
        width?: number,
        height?: number,
        file: File,
        quality?: 'low' | 'medium' | 'high'
      ) => Promise<string>;
    };
  }
}
