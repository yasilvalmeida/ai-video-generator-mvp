'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, Settings } from 'lucide-react';

interface DownloadButtonProps {
  videoUrl?: string;
  fileName?: string;
  onDownload: () => void;
  isReady: boolean;
  isExporting: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  videoUrl,
  fileName = 'video-montage.mp4',
  onDownload,
  isReady,
  isExporting,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('high');
  const [format, setFormat] = useState('mp4');

  const qualityOptions = [
    { value: 'low', label: 'Low (480p)', size: '~10MB' },
    { value: 'medium', label: 'Medium (720p)', size: '~25MB' },
    { value: 'high', label: 'High (1080p)', size: '~50MB' },
  ];

  const formatOptions = [
    { value: 'mp4', label: 'MP4', description: 'Best compatibility' },
    { value: 'mov', label: 'MOV', description: 'Apple devices' },
    { value: 'webm', label: 'WebM', description: 'Web optimized' },
  ];

  if (!isReady) {
    return null;
  }

  return (
    <div className='space-y-4'>
      {/* Download Button */}
      <button
        onClick={onDownload}
        disabled={isExporting}
        className={`
          w-full py-4 px-6 rounded-xl font-medium transition-all duration-300
          ${
            isExporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          }
        `}
      >
        {isExporting ? (
          <div className='flex items-center justify-center space-x-3'>
            <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
            <span className='text-lg'>Exporting...</span>
          </div>
        ) : (
          <div className='flex items-center justify-center space-x-3'>
            <Download className='w-6 h-6' />
            <span className='text-lg'>Download Final Video</span>
          </div>
        )}
      </button>

      {/* Video Info */}
      <div className='bg-white rounded-xl p-4 border border-gray-200'>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='font-medium text-gray-900'>Export Settings</h4>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Toggle export settings'
            title='Toggle export settings'
          >
            <Settings className='w-4 h-4 text-gray-600' />
          </button>
        </div>

        <div className='space-y-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Format:</span>
            <span className='font-medium text-gray-900'>MP4</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Resolution:</span>
            <span className='font-medium text-gray-900'>1080×1920 (9:16)</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Estimated size:</span>
            <span className='font-medium text-gray-900'>~50MB</span>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className='mt-4 pt-4 border-t border-gray-200 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Quality
              </label>
              <div className='space-y-2'>
                {qualityOptions.map((option) => (
                  <label
                    key={option.value}
                    className='flex items-center space-x-3 cursor-pointer'
                  >
                    <input
                      type='radio'
                      name='quality'
                      value={option.value}
                      checked={quality === option.value}
                      onChange={(e) => setQuality(e.target.value)}
                      className='text-primary-600 focus:ring-primary-500'
                    />
                    <div>
                      <span className='text-sm font-medium text-gray-900'>
                        {option.label}
                      </span>
                      <span className='text-xs text-gray-500 ml-2'>
                        {option.size}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Format
              </label>
              <div className='space-y-2'>
                {formatOptions.map((option) => (
                  <label
                    key={option.value}
                    className='flex items-center space-x-3 cursor-pointer'
                  >
                    <input
                      type='radio'
                      name='format'
                      value={option.value}
                      checked={format === option.value}
                      onChange={(e) => setFormat(e.target.value)}
                      className='text-primary-600 focus:ring-primary-500'
                    />
                    <div>
                      <span className='text-sm font-medium text-gray-900'>
                        {option.label}
                      </span>
                      <span className='text-xs text-gray-500 ml-2'>
                        {option.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
