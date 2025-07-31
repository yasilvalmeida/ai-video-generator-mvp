'use client';

import React, { useState, useCallback } from 'react';
import { Player } from '@remotion/player';
import { VideoMontage } from '@/remotion/VideoMontage';
import { Download, Settings, ArrowLeft, Play, Pause } from 'lucide-react';

// Mock data for demo - in real app, this would come from the previous page
const mockData = {
  aiVideoUrl: 'https://example.com/ai-video.mp4',
  userVideoUrl: 'https://example.com/user-video.mp4',
  captions: [
    { text: 'Welcome to my channel!', startTime: 0, endTime: 2 },
    { text: 'Today we\'re going to', startTime: 2, endTime: 4 },
    { text: 'create something amazing', startTime: 4, endTime: 6 },
  ],
  aiVideoDuration: 5,
};

export default function EditorPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [durationInFrames, setDurationInFrames] = useState(300); // 10 seconds at 30fps
  const [isExporting, setIsExporting] = useState(false);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleFrameUpdate = useCallback((frame: number) => {
    setCurrentFrame(frame);
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // In a real implementation, this would call Remotion's render API
      // For now, we'll simulate the export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock download link
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'video-montage.mp4';
      link.click();
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const formatTime = (frames: number) => {
    const seconds = frames / 30; // 30fps
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Upload</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Video Editor
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Video Player */}
              <div className="relative">
                <Player
                  component={VideoMontage}
                  inputProps={mockData}
                  durationInFrames={durationInFrames}
                  fps={30}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                  }}
                  controls
                  autoPlay={isPlaying}
                  onFrameUpdate={handleFrameUpdate}
                />
              </div>

              {/* Custom Controls */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                    
                    <div className="text-sm text-gray-600">
                      {formatTime(currentFrame)} / {formatTime(durationInFrames)}
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${isExporting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }
                    `}
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings and Info */}
          <div className="space-y-6">
            {/* Video Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Video Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">{formatTime(durationInFrames)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Resolution</label>
                  <p className="text-sm text-gray-900">576 × 1024 (9:16)</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Frame Rate</label>
                  <p className="text-sm text-gray-900">30 FPS</p>
                </div>
              </div>
            </div>

            {/* Captions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Captions
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockData.captions.map((caption, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg border transition-colors
                      ${currentFrame >= caption.startTime * 30 && currentFrame <= caption.endTime * 30
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-gray-200 bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {caption.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTime(caption.startTime * 30)} - {formatTime(caption.endTime * 30)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Export Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="quality-select" className="text-sm font-medium text-gray-700">Quality</label>
                  <select 
                    id="quality-select"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    aria-label="Select video quality"
                  >
                    <option>High (1080p)</option>
                    <option>Medium (720p)</option>
                    <option>Low (480p)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="format-select" className="text-sm font-medium text-gray-700">Format</label>
                  <select 
                    id="format-select"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    aria-label="Select video format"
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