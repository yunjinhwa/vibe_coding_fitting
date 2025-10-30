
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateFashionImage } from './services/geminiService';
import type { ImageState } from './types';

function App() {
  const [personImage, setPersonImage] = useState<ImageState | null>(null);
  const [clothingImage, setClothingImage] = useState<ImageState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToImageState = (file: File): Promise<ImageState> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve({
            base64: base64String,
            mimeType: file.type,
            preview: reader.result,
          });
        } else {
          reject(new Error('Failed to read file as string.'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handlePersonImageChange = useCallback(async (file: File) => {
    try {
      const imageState = await fileToImageState(file);
      setPersonImage(imageState);
    } catch (err) {
      setError('Error processing person image.');
      console.error(err);
    }
  }, []);

  const handleClothingImageChange = useCallback(async (file: File) => {
    try {
      const imageState = await fileToImageState(file);
      setClothingImage(imageState);
    } catch (err) {
      setError('Error processing clothing image.');
      console.error(err);
    }
  }, []);

  const handleTryOn = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both a person and a clothing item.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateFashionImage(
        personImage.base64,
        personImage.mimeType,
        clothingImage.base64,
        clothingImage.mimeType
      );
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              id="person-uploader"
              label="1. 인물 사진 업로드"
              onImageChange={handlePersonImageChange}
              preview={personImage?.preview}
            />
            <ImageUploader
              id="clothing-uploader"
              label="2. 의상 사진 업로드"
              onImageChange={handleClothingImageChange}
              preview={clothingImage?.preview}
            />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleTryOn}
              disabled={!personImage || !clothingImage || isLoading}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              {isLoading ? 'AI 스타일링 중...' : '3. 가상 피팅 시작'}
            </button>
          </div>

          <ResultDisplay
            isLoading={isLoading}
            generatedImage={generatedImage}
            error={error}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
