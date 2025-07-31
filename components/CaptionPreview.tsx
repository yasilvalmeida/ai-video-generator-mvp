'use client';

import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
}

interface CaptionPreviewProps {
  videoUrl: string;
  captions: CaptionSegment[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  isMuted: boolean;
}

export const CaptionPreview: React.FC<CaptionPreviewProps> = ({
  videoUrl,
  captions,
  currentTime,
  onTimeUpdate,
  isPlaying,
  onPlayPause,
  onMuteToggle,
  isMuted,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Find current caption
  const currentCaption = captions.find(
    (caption) => currentTime >= caption.startTime && currentTime <= caption.endTime
  );

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = videoRef.current?.duration || 0;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="video-container">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              onTimeUpdate(0);
            }
          }}
          muted={isMuted}
        />
        
        {/* Caption Overlay */}
        {currentCaption && (
          <div className="caption-overlay">
            <div className="caption-text">
              {currentCaption.text}
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={onPlayPause}
            className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>

        {/* Mute Button */}
        <button
          onClick={onMuteToggle}
          className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max={totalDuration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (totalDuration || 1)) * 100}%, #e5e7eb ${(currentTime / (totalDuration || 1)) * 100}%, #e5e7eb 100%)`
          }}
          aria-label="Video progress"
          title="Video progress"
        />
      </div>

      {/* Caption List */}
      {captions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Captions</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {captions.map((caption, index) => (
              <div
                key={index}
                className={`
                  p-2 rounded text-xs transition-colors
                  ${currentTime >= caption.startTime && currentTime <= caption.endTime
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                <div className="font-medium">{caption.text}</div>
                <div className="text-xs opacity-75">
                  {formatTime(caption.startTime)} - {formatTime(caption.endTime)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 