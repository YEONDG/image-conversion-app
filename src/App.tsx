import React from 'react';
import { ImageUploadDrop } from '@/src/components/image-upload-drop';
import { ImageConverter } from '@/src/components/image-converter';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <main>
      <Toaster richColors />
      <h1 className='bg-red-50 text-3xl p-2'>이미지 변환</h1>
      <ImageUploadDrop />
      <ImageConverter />
    </main>
  );
};

export default App;
