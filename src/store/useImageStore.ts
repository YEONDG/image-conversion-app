import { create } from 'zustand';
import { ImageFileType } from '../types';

interface ImageStore {
  files: ImageFileType[];
  setFiles: (files: ImageFileType[]) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
}));
