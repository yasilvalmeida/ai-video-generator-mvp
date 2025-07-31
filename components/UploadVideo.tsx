'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Video, X, CheckCircle, Play, Pause } from 'lucide-react';
import { validateFile } from '@/lib/storage';

interface UploadVideoProps {
  onVideoSelect: (file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  showPreview?: boolean;
}

export const UploadVideo: React.FC<UploadVideoProps> = ({
  onVideoSelect,
  onError,
  disabled = false,
  showPreview = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      const validation = validateFile(file);

      if (!validation.valid) {
        onError(validation.error!);
        return;
      }

      setSelectedFile(file);
      onVideoSelect(file);
    },
    [onVideoSelect, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  if (selectedFile) {
    return (
      <div className='w-full max-w-sm mx-auto space-y-4'>
        {/* File Info */}
        <div className='bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm'>
          <div className='flex items-center space-x-3'>
            <CheckCircle className='w-6 h-6 text-green-500' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {selectedFile.name}
              </p>
              <p className='text-xs text-gray-500'>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className='text-xs text-green-600 font-medium mt-1'>
                ✓ Ready for processing
              </p>
            </div>
            <button
              onClick={removeFile}
              className='p-1 hover:bg-gray-100 rounded-full transition-colors'
              disabled={disabled}
              aria-label='Remove video file'
              title='Remove video file'
            >
              <X className='w-4 h-4 text-gray-400' />
            </button>
          </div>
        </div>

        {/* Video Preview */}
        {showPreview && (
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200'>
            <div className='relative aspect-video'>
              <video
                ref={videoRef}
                src={URL.createObjectURL(selectedFile)}
                className='w-full h-full object-cover'
                onEnded={() => setIsPlaying(false)}
              />
              <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                <button
                  onClick={togglePlay}
                  className='w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors'
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <Pause className='w-6 h-6' />
                  ) : (
                    <Play className='w-6 h-6 ml-0.5' />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='w-full max-w-sm mx-auto'>
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${
            isDragOver
              ? 'border-primary-500 bg-primary-50 scale-105 shadow-lg'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type='file'
          accept='video/*'
          onChange={handleFileInput}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          disabled={disabled}
          aria-label='Upload video file'
          title='Upload video file'
        />

        <div className='space-y-4'>
          <div
            className={`
            mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragOver ? 'bg-primary-100 scale-110' : 'bg-gray-100'}
          `}
          >
            {isDragOver ? (
              <Upload className='w-8 h-8 text-primary-600' />
            ) : (
              <Video className='w-8 h-8 text-gray-400' />
            )}
          </div>

          <div>
            <p className='text-sm font-medium text-gray-900'>
              {isDragOver ? 'Drop your video here' : 'Upload your video'}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {isDragOver
                ? 'Release to upload'
                : 'Drag and drop or click to browse'}
            </p>
            <p className='text-xs text-gray-400 mt-2'>
              MP4, MOV, WebM, AVI • Max 100MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
