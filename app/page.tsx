'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { UploadVideo } from '@/components/UploadVideo';
import { HookSelector, HookOption } from '@/components/HookSelector';
import { CaptionPreview } from '@/components/CaptionPreview';
import { GenerateButton } from '@/components/GenerateButton';
import { DownloadButton } from '@/components/DownloadButton';

import { uploadFile } from '@/lib/storage';
import {
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Video,
} from 'lucide-react';

interface ProcessingState {
  status:
    | 'idle'
    | 'generating-ai'
    | 'transcribing'
    | 'generating-captions'
    | 'completed'
    | 'error';
  message: string;
}

export default function HomePage() {
  // Read API keys status from server-side rendered data attribute
  const [hasApiKeys, setHasApiKeys] = useState<boolean>(false);

  useEffect(() => {
    const dataElement = document.querySelector('[data-has-api-keys]');
    if (dataElement) {
      const apiKeysStatus =
        dataElement.getAttribute('data-has-api-keys') === 'true';
      setHasApiKeys(apiKeysStatus);
    }
  }, []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedHook, setSelectedHook] = useState<HookOption | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    message: '',
  });

  const [aiVideoUrl, setAiVideoUrl] = useState<string>('');
  const [userVideoUrl, setUserVideoUrl] = useState<string>('');
  const [captions, setCaptions] = useState<
    Array<{
      text: string;
      startTime: number;
      endTime: number;
    }>
  >([]);

  const [videoTime, setVideoTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleVideoSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setProcessingState({ status: 'idle', message: '' });
  }, []);

  const handleHookSelect = useCallback((hook: HookOption) => {
    setSelectedHook(hook);
  }, []);

  const handleError = useCallback((error: string) => {
    setProcessingState({ status: 'error', message: error });
  }, []);

  const processVideo = useCallback(async () => {
    if (!selectedFile || !selectedHook) {
      handleError('Please select both a video and a hook template');
      return;
    }

    try {
      setProcessingState({
        status: 'generating-ai',
        message: 'Generating AI intro video...',
      });

      // Check if API keys are configured
      console.log('API Keys status:', hasApiKeys);
      console.log('Processing state:', processingState.status);

      // Use demo mode if no API keys or for testing
      if (hasApiKeys === false || hasApiKeys === null) {
        // Demo mode - simulate processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setProcessingState({
          status: 'transcribing',
          message: 'Transcribing audio...',
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setProcessingState({
          status: 'generating-captions',
          message: 'Generating captions...',
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Demo AI video URL (placeholder)
        setAiVideoUrl(
          'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Upload user video and get URL
        const storedFile = await uploadFile(selectedFile);
        setUserVideoUrl(storedFile.url);

        // Demo captions
        const demoCaptions = [
          { text: 'Welcome to my channel!', startTime: 0, endTime: 2 },
          { text: "Today we're going to", startTime: 2, endTime: 4 },
          { text: 'create something amazing', startTime: 4, endTime: 6 },
        ];

        setCaptions(demoCaptions);
        setProcessingState({
          status: 'completed',
          message:
            'Demo mode: Video processing completed! (Add API keys for full functionality)',
        });
        return;
      }

      // Full mode - use actual APIs
      console.log('Using full mode with API keys');

      // Generate AI video via API
      const aiResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: selectedHook.prompt,
          duration: 5,
          fps: 30,
        }),
      });

      const aiResult = await aiResponse.json();
      if (aiResult.status === 'failed') {
        // Check if it's a credit issue
        if (
          aiResult.error?.includes('Insufficient credit') ||
          aiResult.error?.includes('402 Payment Required')
        ) {
          console.log('Credit issue detected, switching to demo mode');
          // Fall back to demo mode
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setProcessingState({
            status: 'transcribing',
            message: 'Transcribing audio...',
          });

          await new Promise((resolve) => setTimeout(resolve, 1500));
          setProcessingState({
            status: 'generating-captions',
            message: 'Generating captions...',
          });

          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Demo AI video URL (placeholder)
          setAiVideoUrl(
            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Upload user video and get URL
          const storedFile = await uploadFile(selectedFile);
          setUserVideoUrl(storedFile.url);

          // Demo captions
          const demoCaptions = [
            { text: 'Welcome to my channel!', startTime: 0, endTime: 2 },
            { text: "Today we're going to", startTime: 2, endTime: 4 },
            { text: 'create something amazing', startTime: 4, endTime: 6 },
          ];

          setCaptions(demoCaptions);
          setProcessingState({
            status: 'completed',
            message:
              'Demo mode: Video processing completed! (Add credits to Replicate for full functionality)',
          });
          return;
        }
        throw new Error(aiResult.error || 'Failed to generate AI video');
      }

      setAiVideoUrl(aiResult.output || '');
      setProcessingState({
        status: 'transcribing',
        message: 'Transcribing audio...',
      });

      // Upload user video and get URL
      const storedFile = await uploadFile(selectedFile);
      setUserVideoUrl(storedFile.url);

      // Transcribe audio via API
      const formData = new FormData();
      formData.append('file', selectedFile);

      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const transcription = await transcriptionResponse.json();
      if (transcription.error) {
        throw new Error(transcription.error);
      }

      setProcessingState({
        status: 'generating-captions',
        message: 'Generating captions...',
      });

      // Generate styled captions via API
      const captionsResponse = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcription.text,
          style: 'tiktok',
        }),
      });

      const captionsResult = await captionsResponse.json();
      if (captionsResult.error) {
        throw new Error(captionsResult.error);
      }

      const captionLines = captionsResult.captions;

      // Create timed captions
      const totalDuration =
        transcription.segments.length > 0
          ? transcription.segments[transcription.segments.length - 1].end
          : 10;

      const captionsWithTiming = captionLines.map(
        (line: string, index: number) => {
          const startTime = (index / captionLines.length) * totalDuration;
          const endTime = ((index + 1) / captionLines.length) * totalDuration;
          return {
            text: line,
            startTime,
            endTime,
          };
        }
      );

      setCaptions(captionsWithTiming);
      setProcessingState({
        status: 'completed',
        message: 'Video processing completed!',
      });
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingState({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  }, [selectedFile, selectedHook, handleError]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const canProcess =
    !!selectedFile && !!selectedHook && processingState.status === 'idle';
  const isProcessing =
    processingState.status !== 'idle' &&
    processingState.status !== 'completed' &&
    processingState.status !== 'error';

  // Step indicators
  const steps = [
    { id: 1, title: 'Upload Video', completed: !!selectedFile },
    { id: 2, title: 'Choose Hook', completed: !!selectedHook },
    {
      id: 3,
      title: 'Generate',
      completed: processingState.status === 'completed',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Video Generator MVP
          </h1>
          <p className='text-gray-600'>
            Create AI-powered video montages with your content
          </p>

          {/* API Keys Notice */}
          {!hasApiKeys && (
            <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <p className='text-sm text-yellow-800'>
                <strong>Demo Mode:</strong> Add your API keys to enable full
                functionality. Create a{' '}
                <code className='bg-yellow-100 px-1 rounded'>.env.local</code>{' '}
                file with
                <code className='bg-yellow-100 px-1 rounded'>
                  REPLICATE_API_TOKEN
                </code>{' '}
                and
                <code className='bg-yellow-100 px-1 rounded'>
                  OPENAI_API_KEY
                </code>
              </p>
            </div>
          )}

          {hasApiKeys && showBanner && (
            <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg relative'>
              <button
                onClick={() => setShowBanner(false)}
                className='absolute top-2 right-2 text-green-600 hover:text-green-800'
                aria-label='Close banner'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
              <p className='text-sm text-green-800 pr-6'>
                <strong>✅ Full Mode:</strong> API keys are configured. You can
                now generate real AI videos and transcriptions!
              </p>
            </div>
          )}
        </div>

        {/* Processing Status */}
        {processingState.status !== 'idle' && (
          <div className='mb-6'>
            <div
              className={`
              p-4 rounded-lg border-2 flex items-center space-x-3
              ${
                processingState.status === 'completed'
                  ? 'border-green-200 bg-green-50'
                  : processingState.status === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-blue-200 bg-blue-50'
              }
            `}
            >
              {processingState.status === 'completed' ? (
                <CheckCircle className='w-5 h-5 text-green-500' />
              ) : processingState.status === 'error' ? (
                <AlertCircle className='w-5 h-5 text-red-500' />
              ) : (
                <Loader2 className='w-5 h-5 text-blue-500 animate-spin' />
              )}
              <span className='text-sm font-medium'>
                {processingState.message}
              </span>
            </div>
          </div>
        )}

        {/* Step Progress */}
        <div className='mb-8'>
          <div className='flex items-center justify-center space-x-4'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    step.completed
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
                >
                  {step.completed ? '✓' : step.id}
                </div>
                <span
                  className={`
                  ml-2 text-sm font-medium
                  ${step.completed ? 'text-primary-600' : 'text-gray-500'}
                `}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    w-12 h-0.5 mx-4
                    ${step.completed ? 'bg-primary-600' : 'bg-gray-200'}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Upload and Setup */}
          <div className='space-y-8'>
            {/* Video Upload */}
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Upload Your Video
              </h2>
              <UploadVideo
                onVideoSelect={handleVideoSelect}
                onError={handleError}
                disabled={isProcessing}
              />
            </div>

            {/* Hook Selection */}
            <div>
              <HookSelector
                selectedHook={selectedHook?.id || null}
                onHookSelect={handleHookSelect}
                disabled={isProcessing}
              />
            </div>

            {/* Generate Button */}
            <GenerateButton
              isEnabled={canProcess}
              isProcessing={isProcessing}
              processingState={processingState}
              onClick={processVideo}
              selectedFile={selectedFile}
              selectedHook={selectedHook}
            />

            {/* Download Button */}
            <DownloadButton
              isReady={processingState.status === 'completed'}
              isExporting={false}
              onDownload={() => {
                // TODO: Implement actual download logic
                console.log('Downloading video...');
              }}
            />
          </div>

          {/* Right Column - Preview */}
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Preview
            </h2>

            {processingState.status === 'completed' && userVideoUrl ? (
              <CaptionPreview
                videoUrl={userVideoUrl}
                captions={captions}
                currentTime={videoTime}
                onTimeUpdate={setVideoTime}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onMuteToggle={handleMuteToggle}
                isMuted={isMuted}
              />
            ) : isProcessing ? (
              <div className='video-container bg-gray-100 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4'></div>
                  <p className='text-sm text-gray-600 font-medium'>
                    {processingState.message}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    This may take a few minutes...
                  </p>
                </div>
              </div>
            ) : (
              <div className='video-container bg-gray-200 flex items-center justify-center'>
                <div className='text-center text-gray-500'>
                  <Video className='w-12 h-12 mx-auto mb-2' />
                  <p className='text-sm'>
                    Upload a video and select a hook to see preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        {processingState.status === 'completed' && (
          <div className='mt-8 text-center'>
            <a
              href='/editor'
              className='btn-primary inline-flex items-center space-x-2'
            >
              <span>Continue to Editor</span>
              <span>→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
