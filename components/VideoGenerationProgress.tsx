'use client';

import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface VideoGenerationProgressProps {
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  message: string;
  isIndeterminate?: boolean;
}

export const VideoGenerationProgress: React.FC<
  VideoGenerationProgressProps
> = ({ status, message, isIndeterminate = false }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'starting':
      case 'processing':
        return <Loader2 className='w-5 h-5 animate-spin text-blue-600' />;
      case 'succeeded':
        return <CheckCircle className='w-5 h-5 text-green-600' />;
      case 'failed':
        return <XCircle className='w-5 h-5 text-red-600' />;
      default:
        return <Loader2 className='w-5 h-5 animate-spin text-blue-600' />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'starting':
      case 'processing':
        return 'text-blue-600';
      case 'succeeded':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm'>
      <div className='flex items-center space-x-3'>
        {getStatusIcon()}
        <div className='flex-1'>
          <p className={`text-sm font-medium ${getStatusColor()}`}>{message}</p>
          {isIndeterminate && (
            <div className='mt-2'>
              <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                <div
                  className='bg-blue-600 h-2 rounded-full'
                  style={{
                    width: '30%',
                    animation: 'indeterminate-progress 2s ease-in-out infinite',
                  }}
                ></div>
              </div>
              <p className='text-xs text-gray-500 mt-1'>Processing...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
