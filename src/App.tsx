import React from 'react';
import { ImageUploadDrop } from './components/image-upload-drop';
import { ImageConverter } from './components/image-converter';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <div>
      <Toaster richColors />
      <h1 className='bg-red-50 text-3xl p-4'>이미지 변환</h1>
      <ImageUploadDrop />
      <ImageConverter />
    </div>
  );
};

export default App;
