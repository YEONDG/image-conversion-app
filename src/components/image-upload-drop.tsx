import React, { useState, DragEvent, ChangeEvent } from 'react';
import { useImageStore } from '../store/useImageStore';

interface ImageUploadDropProps {}

export const ImageUploadDrop: React.FC<ImageUploadDropProps> = () => {
  const { files: imageFiles, setFiles: setImageFiles } = useImageStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    const newFiles = await Promise.all(
      droppedFiles.map(async (file) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
        await img.decode();
        return {
          name: file.name,
          url,
          width: img.width,
          height: img.height,
          file,
        };
      })
    );
    setImageFiles([...imageFiles, ...newFiles]);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
      ? Array.from(e.target.files).filter((file) =>
          file.type.startsWith('image/')
        )
      : [];
    const newFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
        await img.decode();
        return {
          name: file.name,
          url,
          width: img.width,
          height: img.height,
          file,
        };
      })
    );
    setImageFiles([...imageFiles, ...newFiles]);
  };

  const handleFileClick = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  return (
    <div className='p-4 bg-green-50 h-96'>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-8 text-center ${
          isDragging ? 'bg-gray-100' : 'bg-white'
        } transition-colors`}
      >
        <p className='mb-4 text-gray-600'>
          {isDragging
            ? 'Drop files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
          id='fileInput'
        />
        <label
          htmlFor='fileInput'
          className='cursor-pointer text-blue-500 hover:underline'
        >
          이미지파일 찾기
        </label>
      </div>
      <div className='mt-4'>
        <h3 className='font-semibold'>Uploaded Files:</h3>
        <ul className='flex list-disc pl-5 gap-4'>
          {imageFiles.map((file, index) => (
            <li
              key={index}
              className='text-gray-800'
              onClick={() => handleFileClick(index)}
            >
              {file.name}
              {file.url && (
                <div className='mt-2'>
                  <img
                    src={file.url}
                    alt={file.name}
                    className='w-32 h-32 object-cover mt-2'
                  />
                  <p className='text-sm text-gray-600'>
                    {file.width}x{file.height}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
