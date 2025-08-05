'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useVideo } from '@/contexts/VideoContext';
import { UploadVideo } from '@/components/UploadVideo';
import { HookSelector } from '@/components/HookSelector';
import { GenerateButton } from '@/components/GenerateButton';
import { VideoGenerationProgress } from '@/components/VideoGenerationProgress';
import { CaptionPreview } from '@/components/CaptionPreview';
import { DownloadButton } from '@/components/DownloadButton';

export default function HomePage() {
  const { state, dispatch } = useVideo();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string>('');

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl);
      }
    };
  }, [videoBlobUrl]);

  // Create blob URL only when needed
  useEffect(() => {
    if (state.selectedFile && !videoBlobUrl) {
      try {
        // Clear previous blob URL if exists
        if (videoBlobUrl) {
          URL.revokeObjectURL(videoBlobUrl);
        }
        const blobUrl = URL.createObjectURL(state.selectedFile);
        setVideoBlobUrl(blobUrl);
      } catch (error) {
        console.error('Error creating blob URL:', error);
      }
    }
  }, [state.selectedFile, videoBlobUrl]);

  // Use real APIs but keep demo video to avoid Vercel limitations
  const useRealApis = true;

  const handleError = (message: string) => {
    console.error('Error:', message);
    alert(message);
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep('');
  };

  const processVideo = useCallback(async () => {
    if (!state.selectedFile || !state.selectedHook) {
      handleError('Please select both a video and a hook template');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCurrentStep('Starting video processing...');

    try {
      // Step 1: Upload video file
      setCurrentStep('Uploading your video...');
      setProgress(10);

      const formData = new FormData();
      formData.append('file', state.selectedFile);

      const uploadResponse = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video');
      }

      const uploadResult = await uploadResponse.json();
      const uploadedVideoUrl = uploadResult.fileUrl;

      // Step 2: Generate AI video hook via Replicate
      setCurrentStep('Generating AI video hook...');
      setProgress(30);

      const generateResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: state.selectedHook.prompt,
          duration: 5,
          fps: 30,
          width: 1080,
          height: 1920,
          model: 'zeroscope',
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate AI video');
      }

      const generateResult = await generateResponse.json();
      const aiVideoUrl = generateResult.videoUrl;

      // Step 3: Extract audio and transcribe via OpenAI
      setCurrentStep('Extracting audio for transcription...');
      setProgress(50);

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData, // Use the same formData with the video file
      });

      if (!transcribeResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const transcribeResult = await transcribeResponse.json();

      // Step 4: Generate captions via OpenAI
      setCurrentStep('Generating captions...');
      setProgress(70);

      const captionsResponse = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcribeResult.text,
        }),
      });

      if (!captionsResponse.ok) {
        throw new Error('Failed to generate captions');
      }

      const captionsResult = await captionsResponse.json();

      // Step 5: Create final montage (using user's video without FFmpeg)
      setCurrentStep('Creating final video montage...');
      setProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use the user's uploaded video as the final result
      // Create a blob URL for the user's file
      const finalMontageUrl = state.selectedFile
        ? URL.createObjectURL(state.selectedFile)
        : uploadedVideoUrl;

      // Convert captions to the expected format
      const formattedCaptions = captionsResult.captions.map(
        (caption: string, index: number) => ({
          text: caption,
          startTime: index * 2,
          endTime: (index + 1) * 2,
        })
      );

      dispatch({ type: 'SET_AI_VIDEO_URL', payload: aiVideoUrl });
      dispatch({ type: 'SET_USER_VIDEO_URL', payload: uploadedVideoUrl });
      dispatch({ type: 'SET_CAPTIONS', payload: formattedCaptions });
      dispatch({ type: 'SET_RENDERED_MONTAGE_URL', payload: finalMontageUrl });

      setProgress(100);
      setCurrentStep('Video processing completed!');

      dispatch({
        type: 'SET_PROCESSING_STATE',
        payload: {
          status: 'completed',
          message: 'Video processing completed successfully!',
        },
      });
    } catch (error) {
      console.error('Error in video processing:', error);
      setCurrentStep('Error in video processing');
      dispatch({
        type: 'SET_PROCESSING_STATE',
        payload: {
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Video processing error occurred',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  }, [state.selectedFile, state.selectedHook, dispatch]);

  const handleHookSelect = (hook: any) => {
    // Clear previous processing results when hook changes
    if (state.selectedHook?.id !== hook.id) {
      dispatch({ type: 'CLEAR_PROCESSING_RESULTS' });
      // Clear blob URL
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl);
        setVideoBlobUrl('');
      }
    }
    dispatch({ type: 'SET_SELECTED_HOOK', payload: hook });
  };

  const handleQualityChange = useCallback((quality: string) => {
    // Demo mode - quality selection is simulated
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>
            🎬 Video Generator MVP
          </h1>
          <p className='mb-2 text-lg text-gray-600'>
            Create engaging video content with AI-generated hooks
          </p>
          <div className='inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800'>
            <span className='mr-2'>🎬</span>
            Real APIs - No FFmpeg Processing
          </div>
        </div>

        {/* Main Content */}
        <div className='mx-auto max-w-4xl space-y-8'>
          {/* Upload Section */}
          <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Upload Your Video
            </h2>
            <UploadVideo
              onVideoSelect={(file) =>
                dispatch({ type: 'SET_SELECTED_FILE', payload: file })
              }
              onError={handleError}
              disabled={isProcessing}
              showPreview={false}
            />
          </div>

          {/* Hook Selection */}
          {state.selectedFile && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Choose Your AI Hook Template
              </h2>
              <HookSelector
                selectedHook={state.selectedHook?.id || null}
                onHookSelect={handleHookSelect}
                disabled={isProcessing}
                selectedQuality='latent-consistency-model'
                onQualityChange={handleQualityChange}
              />
            </div>
          )}

          {/* Generate Button */}
          {state.selectedFile && state.selectedHook && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <GenerateButton
                onClick={processVideo}
                isEnabled={!isProcessing}
                isProcessing={isProcessing}
                processingState={state.processingState}
                selectedFile={state.selectedFile}
                selectedHook={state.selectedHook}
              />
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <VideoGenerationProgress
                status={
                  state.processingState.status === 'completed'
                    ? 'succeeded'
                    : state.processingState.status === 'error'
                    ? 'failed'
                    : 'processing'
                }
                message={currentStep}
                isIndeterminate={
                  state.processingState.status !== 'completed' &&
                  state.processingState.status !== 'error'
                }
              />
            </div>
          )}

          {/* Original Video Preview - Show during processing */}
          {state.selectedFile && state.captions.length === 0 && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Original Video Preview
              </h2>
              <p className='text-sm text-gray-600 mb-4'>
                Your video is ready. Select a hook template and click "Generate
                Video" to add AI-generated captions.
              </p>
              {(() => {
                const videoUrl = videoBlobUrl || state.renderedMontageUrl;

                return (
                  <div className='w-full max-w-md mx-auto'>
                    <div className='video-container'>
                      <video
                        src={videoUrl}
                        className='w-full h-full object-contain bg-black'
                        controls
                        playsInline
                        preload='metadata'
                        crossOrigin='anonymous'
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Preview - Show only when captions are available */}
          {state.selectedFile && state.captions.length > 0 && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Video Preview with Captions
              </h2>
              {(() => {
                const videoUrl = videoBlobUrl || state.renderedMontageUrl;

                return (
                  <CaptionPreview
                    videoUrl={videoUrl}
                    captions={state.captions}
                    currentTime={state.videoTime}
                    onTimeUpdate={(time) =>
                      dispatch({ type: 'SET_VIDEO_TIME', payload: time })
                    }
                    isPlaying={state.isPlaying}
                    onPlayPause={() =>
                      dispatch({
                        type: 'SET_IS_PLAYING',
                        payload: !state.isPlaying,
                      })
                    }
                    onMuteToggle={() =>
                      dispatch({
                        type: 'SET_IS_MUTED',
                        payload: !state.isMuted,
                      })
                    }
                    isMuted={state.isMuted}
                  />
                );
              })()}
            </div>
          )}

          {/* Processing Summary */}
          {state.renderedMontageUrl && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Processing Summary
              </h2>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Video Upload:</span>
                  <span className='font-medium text-green-600'>
                    ✓ Completed
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>AI Video Generation:</span>
                  <span className='font-medium text-green-600'>
                    ✓ Completed
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Audio Transcription:</span>
                  <span className='font-medium text-green-600'>
                    ✓ Completed
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Caption Generation:</span>
                  <span className='font-medium text-green-600'>
                    ✓ Completed
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Captions Count:</span>
                  <span className='font-medium text-gray-900'>
                    {state.captions.length}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Final Video:</span>
                  <span className='font-medium text-blue-600'>
                    Your Original Video
                  </span>
                </div>
              </div>
              <div className='mt-4 rounded-lg bg-blue-50 p-3'>
                <p className='text-sm text-blue-800'>
                  <strong>Note:</strong> The preview shows your original video
                  with AI-generated captions overlaid. The download will include
                  your original video file.
                </p>
              </div>
            </div>
          )}

          {/* Download */}
          {state.renderedMontageUrl && (
            <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <DownloadButton
                videoUrl={state.renderedMontageUrl}
                isReady={state.processingState.status === 'completed'}
                isExporting={false}
                onDownload={async () => {
                  try {
                    // Use the user's original file for download
                    if (state.selectedFile) {
                      const url = window.URL.createObjectURL(
                        state.selectedFile
                      );
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `video-with-captions-${Date.now()}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } else {
                      // Fallback: try to download from the URL
                      const response = await fetch(state.renderedMontageUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `video-with-captions-${Date.now()}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }
                  } catch (error) {
                    console.error('Download failed:', error);
                    alert('Download failed - please try again');
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
