export type ImageFileType = {
  name: string;
  url: string;
  width?: number;
  height?: number;
  file: File;
  quality: 'low' | 'medium' | 'high';
};
