import React, { useCallback } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageChange: (file: File) => void;
  preview: string | null | undefined;
}

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageChange, preview }) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onImageChange(file);
      }
    },
    [onImageChange]
  );

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">{label}</h2>
      <label
        htmlFor={id}
        className="w-full h-64 flex flex-col items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:border-gray-500 transition-colors duration-300"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-400">
              클릭하여 이미지 업로드
            </p>
          </div>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};