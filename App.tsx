import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateFashionImage } from './services/geminiService';
import type { ImageState } from './types';

function App() {
  const [personImage, setPersonImage] = useState<ImageState | null>(null);
  const [topImage, setTopImage] = useState<ImageState | null>(null);
  const [bottomImage, setBottomImage] = useState<ImageState | null>(null);
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

  const handleTopImageChange = useCallback(async (file: File) => {
    try {
      const imageState = await fileToImageState(file);
      setTopImage(imageState);
    } catch (err) {
      setError('Error processing top image.');
      console.error(err);
    }
  }, []);
  
  const handleBottomImageChange = useCallback(async (file: File) => {
    try {
      const imageState = await fileToImageState(file);
      setBottomImage(imageState);
    } catch (err) {
      setError('Error processing bottom image.');
      console.error(err);
    }
  }, []);

  const handleTryOn = useCallback(async () => {
    if (!personImage || !topImage || !bottomImage) {
      setError('Please upload a person, a top, and a bottom item.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateFashionImage(
        personImage,
        topImage,
        bottomImage
      );
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, topImage, bottomImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
        <Header />
        <main className="mt-8 flex-grow grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <ImageUploader
              id="person-uploader"
              label="1. 인물 사진 업로드"
              onImageChange={handlePersonImageChange}
              preview={personImage?.preview}
            />
            <ImageUploader
              id="top-uploader"
              label="2. 상의 사진 업로드"
              onImageChange={handleTopImageChange}
              preview={topImage?.preview}
            />
            <ImageUploader
              id="bottom-uploader"
              label="3. 하의 사진 업로드"
              onImageChange={handleBottomImageChange}
              preview={bottomImage?.preview}
            />
            <div className="mt-4">
              <button
                onClick={handleTryOn}
                disabled={!personImage || !topImage || !bottomImage || isLoading}
                className="w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                {isLoading ? 'AI 스타일링 중...' : '4. 가상 피팅 시작'}
              </button>
            </div>
          </div>
          
          {/* Right Content Area */}
          <div className="md:col-span-2">
            <ResultDisplay
              isLoading={isLoading}
              generatedImage={generatedImage}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;