
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        AI Fashion Try-On
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Nano Banana 모델을 사용하여 가상으로 옷을 입어보세요.
      </p>
    </header>
  );
};
