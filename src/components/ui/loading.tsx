import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="loader bg-blue-950 p-5 rounded-full flex space-x-3">
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.6s]"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;