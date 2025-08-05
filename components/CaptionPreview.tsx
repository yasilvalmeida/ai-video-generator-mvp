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
    <div className='mx-auto w-full max-w-md'>
      <div className='video-container'>
        {!videoUrl && (
          <div className='p-4 text-white'>No video URL provided</div>
        )}
        {!isVideoLoaded && videoUrl && (
          <div className='absolute inset-0 flex items-center justify-center bg-black'>
            <div className='text-center text-white'>
              <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          className='h-full w-full bg-black object-contain'
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
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100'>
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
            className='pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className='h-8 w-8' />
            ) : (
              <Play className='ml-1 h-8 w-8' />
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
          className='absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90'
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className='h-6 w-6' />
          ) : (
            <Play className='ml-1 h-6 w-6' />
          )}
        </button>

        {/* Mute Button */}
        <button
          onClick={onMuteToggle}
          className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className='h-4 w-4' />
          ) : (
            <Volume2 className='h-4 w-4' />
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
          className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
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
          <h4 className='mb-2 text-sm font-medium text-gray-900'>Captions</h4>
          <div className='max-h-32 space-y-1 overflow-y-auto'>
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
    </div>
  );
};
