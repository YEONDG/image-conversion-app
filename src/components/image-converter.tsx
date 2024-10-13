import React, { useEffect, useState } from 'react';
import { useImageStore } from '../store/useImageStore';
import { ImageFileType } from '../types';
import { CloudFog } from 'lucide-react';

interface ImageConverterProps {}

export const ImageConverter: React.FC<ImageConverterProps> = () => {
  const { files } = useImageStore();
  const [conversionFormat, setConversionFormat] = useState<string>('jpeg');
  const [resizeWidth, setResizeWidth] = useState<number | ''>('');
  const [resizeHeight, setResizeHeight] = useState<number | ''>('');
  const [conversionSuccess, setConversionSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (window.electron) {
      console.log('Electron API is available.');
    } else {
      console.error(
        'Electron API is not available. Check your preload script and setup.'
      );
    }
  }, []);

  const handleConvert = async () => {
    console.log('click');
    try {
      await Promise.all(
        files.map(async (file) => {
          console.log(file.name);
          if (!file.file || !(file.file instanceof File)) {
            throw new Error(
              'File data is missing or is not a valid File object'
            );
          }
          const convertedPath = await window.electron.convertImage(
            file.name,
            conversionFormat,
            resizeWidth || undefined,
            resizeHeight || undefined,
            file.file
          );

          return convertedPath;
        })
      );

      setConversionSuccess(true);
    } catch (error) {
      console.error('Image conversion failed:', error);
      setConversionSuccess(false);
    }
  };

  return (
    <div className='p-4 border-t mt-4'>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2'>Conversion Format:</label>
        <select
          value={conversionFormat}
          onChange={(e) => setConversionFormat(e.target.value)}
          className='border rounded p-2 w-full'
        >
          <option value='jpeg'>JPEG</option>
          <option value='png'>PNG</option>
          <option value='webp'>WEBP</option>
          <option value='avif'>AVIF</option>
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2'>
          Resize Width (optional):
        </label>
        <input
          type='number'
          value={resizeWidth}
          onChange={(e) =>
            setResizeWidth(
              e.target.value === '' ? '' : parseInt(e.target.value)
            )
          }
          className='border rounded p-2 w-full'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2'>
          Resize Height (optional):
        </label>
        <input
          type='number'
          value={resizeHeight}
          onChange={(e) =>
            setResizeHeight(
              e.target.value === '' ? '' : parseInt(e.target.value)
            )
          }
          className='border rounded p-2 w-full'
        />
      </div>
      <button
        onClick={handleConvert}
        className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
      >
        Convert Images
      </button>
      {conversionSuccess && (
        <div className='mt-4 text-green-600 font-semibold'>
          Images successfully converted!
        </div>
      )}
    </div>
  );
};
