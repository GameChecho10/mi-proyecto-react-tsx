
import React from 'react';
import avionrojo from '../images/avionRojo.png';

interface LoadingTransitionProps {
  message?: string;
}

const LoadingTransition = ({ message = "Cargando..." }: LoadingTransitionProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <img 
            src={avionrojo}
            alt="Avión Avianca" 
            className="w-full h-full object-contain"
            style={{
              animation: 'fly 2s ease-in-out infinite'
            }}
          />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">{message}</h2>
        <p className="text-gray-600">Un momento por favor...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes fly {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(15px) translateY(-8px) rotate(8deg); }
          50% { transform: translateX(0) translateY(-15px) rotate(0deg); }
          75% { transform: translateX(-15px) translateY(-8px) rotate(-8deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingTransition;
