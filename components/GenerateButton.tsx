'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  isEnabled: boolean;
  isProcessing: boolean;
  processingState: {
    status: string;
    message: string;
  };
  onClick: () => void;
  selectedFile: File | null;
  selectedHook: any;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isEnabled,
  isProcessing,
  processingState,
  onClick,
  selectedFile,
  selectedHook,
}) => {
  const getButtonText = () => {
    if (isProcessing) {
      return 'Processing...';
    }

    if (!selectedFile && !selectedHook) {
      return 'Upload video and select hook to start';
    }

    if (!selectedFile) {
      return 'Upload a video to continue';
    }

    if (!selectedHook) {
      return 'Select a hook template to continue';
    }

    return 'Generate Video Montage';
  };

  const getProgressPercentage = () => {
    switch (processingState.status) {
      case 'generating-ai':
        return 25;
      case 'transcribing':
        return 50;
      case 'generating-captions':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className='pt-4'>
      <button
        onClick={onClick}
        disabled={!isEnabled || isProcessing}
        className={`
          w-full py-4 px-6 rounded-xl font-medium transition-all duration-300
          ${
            isEnabled && !isProcessing
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isProcessing ? (
          <div className='flex items-center justify-center space-x-3'>
            <Loader2 className='w-6 h-6 animate-spin' />
            <span className='text-lg'>{getButtonText()}</span>
          </div>
        ) : (
          <div className='flex items-center justify-center space-x-3'>
            <Sparkles className='w-6 h-6' />
            <span className='text-lg'>{getButtonText()}</span>
          </div>
        )}
      </button>

      {/* Progress indicator */}
      {isProcessing && (
        <div className='mt-6'>
          <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
            <div
              className='bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out'
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className='flex justify-between items-center mt-2'>
            <p className='text-sm text-gray-600 font-medium'>
              {processingState.message}
            </p>
            <p className='text-xs text-gray-500'>{getProgressPercentage()}%</p>
          </div>
        </div>
      )}
    </div>
  );
};
