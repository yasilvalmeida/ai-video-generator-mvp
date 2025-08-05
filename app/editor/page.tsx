'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Player } from '@remotion/player';
import { VideoMontage } from '@/components/remotion/VideoMontage';
import { useVideo } from '@/contexts/VideoContext';
import {
  Download,
  Settings,
  ArrowLeft,
  Play,
  Pause,
  Video,
} from 'lucide-react';

export default function EditorPage() {
  const { state } = useVideo();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [durationInFrames, setDurationInFrames] = useState(300); // 10 seconds at 30fps
  const [isExporting, setIsExporting] = useState(false);
  const [playerRef, setPlayerRef] = useState<any>(null);
  const [hasData, setHasData] = useState(false);

  // Check if we have video data from context
  useEffect(() => {
    const hasVideoData = !!(
      state.userVideoUrl ||
      state.aiVideoUrl ||
      state.captions.length > 0
    );
    setHasData(hasVideoData);

    // Calculate duration based on captions
    if (state.captions && state.captions.length > 0) {
      const lastCaption = state.captions[state.captions.length - 1];
      const totalDuration = Math.max(lastCaption.endTime, 10); // At least 10 seconds
      setDurationInFrames(totalDuration * 30); // Convert to frames at 30fps
    }
  }, [state.userVideoUrl, state.aiVideoUrl, state.captions]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleFrameUpdate = useCallback((frame: number) => {
    setCurrentFrame(frame);
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      console.log('Downloading video...');
      console.log('Video data from context:', state);

      // Check if we have video data
      if (!state || (!state.userVideoUrl && !state.aiVideoUrl)) {
        throw new Error('No video data available for download');
      }

      // Fetch the video as a blob and create a download
      const videoUrl = await getVideoUrl(state);
      console.log('Video URL:', videoUrl);

      // Fetch the video file
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch video: ${response.status} ${response.statusText}`
        );
      }

      const videoBlob = await response.blob();
      console.log('Video blob size:', videoBlob.size);

      // Create download link with blob
      const url = window.URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `video-montage-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);

      // Show success message
      alert('Video exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export failed:', error);
      alert(
        `Export failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setIsExporting(false);
    }
  }, [state]);

  // Helper function to get the best video URL for download
  const getVideoUrl = async (videoState: any) => {
    try {
      console.log('Getting video URL from state:', videoState);

      // Prioritize rendered montage, then user video, fall back to AI video
      if (videoState.renderedMontageUrl) {
        console.log(
          'Using rendered montage URL:',
          videoState.renderedMontageUrl
        );
        return videoState.renderedMontageUrl;
      } else if (videoState.userVideoUrl) {
        console.log('Using user video URL:', videoState.userVideoUrl);
        return videoState.userVideoUrl;
      } else if (videoState.aiVideoUrl) {
        console.log('Using AI video URL:', videoState.aiVideoUrl);
        return videoState.aiVideoUrl;
      } else {
        console.log('No video URLs found in state');
        throw new Error('No video available for export');
      }
    } catch (error) {
      console.error('Error getting video URL:', error);
      throw error;
    }
  };

  const formatTime = (frames: number) => {
    const seconds = frames / 30; // 30fps
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Prepare video data for Remotion
  const videoData = {
    aiVideoUrl: state.aiVideoUrl,
    userVideoUrl: state.userVideoUrl,
    captions: state.captions,
    aiVideoDuration: 5,
    processingState: state.processingState,
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center space-x-4'>
            <a
              href='/'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Upload</span>
            </a>
          </div>

          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold text-gray-900'>Video Editor</h1>
            {hasData && state.processingState && (
              <div
                className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${
                  state.processingState.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }
              `}
              >
                {state.processingState.status === 'completed'
                  ? 'Ready'
                  : 'Processing'}
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Video Player */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
              {/* Video Player */}
              <div className='relative'>
                {hasData ? (
                  <Player
                    ref={setPlayerRef}
                    component={VideoMontage as any}
                    inputProps={videoData}
                    durationInFrames={durationInFrames}
                    fps={30}
                    compositionWidth={576}
                    compositionHeight={1024}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '70vh',
                    }}
                    controls
                    autoPlay={isPlaying}
                  />
                ) : (
                  <div className='flex items-center justify-center h-96 bg-gray-100'>
                    <div className='text-center'>
                      <Video className='w-16 h-16 mx-auto mb-4 text-gray-400' />
                      <p className='text-gray-600'>No video data available</p>
                      <a
                        href='/'
                        className='text-primary-600 hover:text-primary-700 mt-2 inline-block'
                      >
                        Go back to upload a video
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Controls */}
              <div className='p-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <button
                      onClick={handlePlayPause}
                      className='w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors'
                    >
                      {isPlaying ? (
                        <Pause className='w-5 h-5' />
                      ) : (
                        <Play className='w-5 h-5 ml-0.5' />
                      )}
                    </button>

                    <div className='text-sm text-gray-600'>
                      {formatTime(currentFrame)} /{' '}
                      {formatTime(durationInFrames)}
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${
                        isExporting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }
                    `}
                  >
                    {isExporting ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className='w-4 h-4' />
                        <span>Export Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings and Info */}
          <div className='space-y-6'>
            {/* Video Info */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Video Information
              </h3>

              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Duration
                  </label>
                  <p className='text-sm text-gray-900'>
                    {formatTime(durationInFrames)}
                  </p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Resolution
                  </label>
                  <p className='text-sm text-gray-900'>576 × 1024 (9:16)</p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Frame Rate
                  </label>
                  <p className='text-sm text-gray-900'>30 FPS</p>
                </div>
              </div>
            </div>

            {/* Captions */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Captions
              </h3>

              <div className='space-y-2 max-h-64 overflow-y-auto'>
                {hasData && state.captions ? (
                  state.captions.map((caption, index) => (
                    <div
                      key={index}
                      className={`
                      p-3 rounded-lg border transition-colors
                      ${
                        currentFrame >= caption.startTime * 30 &&
                        currentFrame <= caption.endTime * 30
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-gray-200 bg-gray-50'
                      }
                    `}
                    >
                      <div className='text-sm font-medium text-gray-900'>
                        {caption.text}
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        {formatTime(caption.startTime * 30)} -{' '}
                        {formatTime(caption.endTime * 30)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center text-gray-500 py-4'>
                    No captions available
                  </div>
                )}
              </div>
            </div>

            {/* Export Settings */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Export Settings
              </h3>

              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='quality-select'
                    className='text-sm font-medium text-gray-700'
                  >
                    Quality
                  </label>
                  <select
                    id='quality-select'
                    className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    aria-label='Select video quality'
                  >
                    <option>High (1080p)</option>
                    <option>Medium (720p)</option>
                    <option>Low (480p)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='format-select'
                    className='text-sm font-medium text-gray-700'
                  >
                    Format
                  </label>
                  <select
                    id='format-select'
                    className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    aria-label='Select video format'
                  >
                    <option>MP4</option>
                    <option>MOV</option>
                    <option>WebM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
