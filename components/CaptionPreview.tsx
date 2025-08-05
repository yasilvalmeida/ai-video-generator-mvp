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
  const [videoDuration, setVideoDuration] = React.useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [lastTimeUpdate, setLastTimeUpdate] = React.useState(0);

  // Debounce time updates to prevent excessive calls
  const debouncedTimeUpdate = React.useCallback(
    (time: number) => {
      if (Math.abs(time - lastTimeUpdate) > 0.1) {
        setLastTimeUpdate(time);
        onTimeUpdate(time);
      }
    },
    [onTimeUpdate, lastTimeUpdate]
  );

  // Find current caption
  const currentCaption = captions.find(
    (caption) =>
      currentTime >= caption.startTime && currentTime <= caption.endTime
  );

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime;
      debouncedTimeUpdate(newTime);
    }
  };

  const handlePlay = () => {
    // Update state to reflect that video is playing
    if (!isPlaying) {
      onPlayPause();
    }
  };

  const handlePause = () => {
    // Update state to reflect that video is paused
    if (isPlaying) {
      onPlayPause();
    }
  };

  const handleSeek = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
        debouncedTimeUpdate(newTime);
      }
    },
    [debouncedTimeUpdate]
  );

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setIsVideoLoaded(true);
      onTimeUpdate(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='video-container'>
        {!videoUrl && (
          <div className='text-white p-4'>No video URL provided</div>
        )}
        {!isVideoLoaded && videoUrl && (
          <div className='absolute inset-0 flex items-center justify-center bg-black'>
            <div className='text-white text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          className='w-full h-full object-contain bg-black'
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handlePause}
          onError={(e) => {
            console.error('Video error:', e);
            console.error('Video URL was:', videoUrl);
            setIsVideoLoaded(false);
          }}
          onLoadStart={() => {
            setIsVideoLoaded(false);
          }}
          onCanPlay={() => {
            setIsVideoLoaded(true);
          }}
          muted={isMuted}
          controls={false}
          playsInline
          preload='metadata'
          crossOrigin='anonymous'
        />

        {/* Caption Overlay */}
        {currentCaption && (
          <div className='caption-overlay'>
            <div className='caption-text'>{currentCaption.text}</div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none'>
          <button
            onClick={() => {
              if (videoRef.current) {
                if (isPlaying) {
                  videoRef.current.pause();
                } else {
                  videoRef.current.play().catch((error) => {
                    console.error('Error playing video:', error);
                  });
                }
              }
              onPlayPause();
            }}
            className='w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors pointer-events-auto'
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className='w-8 h-8' />
            ) : (
              <Play className='w-8 h-8 ml-1' />
            )}
          </button>
        </div>

        {/* Always Visible Play/Pause Button */}
        <button
          onClick={async () => {
            if (videoRef.current) {
              try {
                if (isPlaying) {
                  videoRef.current.pause();
                } else {
                  await videoRef.current.play();
                }
              } catch (error) {
                console.error('Error playing/pausing video:', error);
              }
            }
            onPlayPause();
          }}
          className='absolute bottom-4 left-4 w-12 h-12 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors'
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className='w-6 h-6' />
          ) : (
            <Play className='w-6 h-6 ml-1' />
          )}
        </button>

        {/* Mute Button */}
        <button
          onClick={onMuteToggle}
          className='absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors'
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className='w-4 h-4' />
          ) : (
            <Volume2 className='w-4 h-4' />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className='mt-4 space-y-2'>
        <div className='flex justify-between text-xs text-gray-500'>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(videoDuration)}</span>
        </div>

        <input
          type='range'
          min='0'
          max={videoDuration || 0}
          value={currentTime}
          onChange={handleSeek}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
              (currentTime / (videoDuration || 1)) * 100
            }%, #e5e7eb ${
              (currentTime / (videoDuration || 1)) * 100
            }%, #e5e7eb 100%)`,
          }}
          aria-label='Video progress'
          title='Video progress'
          disabled={!isVideoLoaded}
        />
      </div>

      {/* Caption List */}
      {captions.length > 0 && (
        <div className='mt-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>Captions</h4>
          <div className='max-h-32 overflow-y-auto space-y-1'>
            {captions.map((caption, index) => (
              <div
                key={index}
                className={`
                  p-2 rounded text-xs transition-colors
                  ${
                    currentTime >= caption.startTime &&
                    currentTime <= caption.endTime
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                <div className='font-medium'>{caption.text}</div>
                <div className='text-xs opacity-75'>
                  {formatTime(caption.startTime)} -{' '}
                  {formatTime(caption.endTime)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className='mt-4 p-3 bg-gray-100 rounded-lg text-xs'>
        <div className='font-medium mb-2'>Debug Info:</div>
        <div>Video URL: {videoUrl ? 'Set' : 'Not set'}</div>
        <div>Video Loaded: {isVideoLoaded ? 'Yes' : 'No'}</div>
        <div>Duration: {videoDuration}s</div>
        <div>Current Time: {currentTime}s</div>
        <div>Is Playing: {isPlaying ? 'Yes' : 'No'}</div>
        <div>Captions: {captions.length}</div>
      </div>
    </div>
  );
};
