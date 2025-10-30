import React from 'react';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    <p className="mt-4 text-lg text-gray-300">AI가 당신의 룩을 만들고 있습니다...</p>
    <p className="mt-2 text-sm text-gray-500">잠시만 기다려 주세요.</p>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 border border-gray-700">
      {isLoading && <LoadingSpinner />}
      {error && !isLoading && (
        <div className="text-center text-red-400">
          <h3 className="text-xl font-bold">오류 발생</h3>
          <p className="mt-2">{error}</p>
        </div>
      )}
      {generatedImage && !isLoading && (
        <div className="w-full max-w-lg">
           <h3 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">피팅 결과</h3>
          <img src={generatedImage} alt="Generated fashion" className="rounded-lg shadow-2xl w-full h-auto object-contain" />
        </div>
      )}
      {!isLoading && !generatedImage && !error && (
        <div className="text-center text-gray-500">
          <p className="text-lg">이미지를 업로드하고 "가상 피팅 시작"을 클릭하세요.</p>
          <p>AI가 생성한 결과가 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
};