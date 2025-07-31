import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import path from 'path';

export interface VideoMergeConfig {
  aiVideoUrl: string;
  userVideoUrl: string;
  captions: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
  aiVideoDuration: number;
  outputPath: string;
  quality?: 'low' | 'medium' | 'high';
  format?: 'mp4' | 'mov' | 'webm';
}

export interface RenderProgress {
  progress: number;
  message: string;
}

export async function renderVideoMontage(
  config: VideoMergeConfig,
  onProgress?: (progress: RenderProgress) => void
): Promise<string> {
  try {
    onProgress?.({ progress: 0, message: 'Bundling composition...' });

    // Bundle the Remotion composition
    const bundled = await bundle(path.join(process.cwd(), 'remotion', 'VideoMontage.tsx'));
    
    onProgress?.({ progress: 20, message: 'Getting compositions...' });

    // Get the composition
    const compositions = await getCompositions(bundled);
    const composition = compositions.find(comp => comp.id === 'VideoMontage');
    
    if (!composition) {
      throw new Error('VideoMontage composition not found');
    }

    onProgress?.({ progress: 40, message: 'Starting render...' });

    // Calculate total duration
    const totalDuration = config.aiVideoDuration + (config.captions.length > 0 
      ? Math.max(...config.captions.map(c => c.endTime))
      : 5
    );

    // Render the video
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: config.format || 'mp4',
      outputLocation: config.outputPath,
      inputProps: {
        aiVideoUrl: config.aiVideoUrl,
        userVideoUrl: config.userVideoUrl,
        captions: config.captions,
        aiVideoDuration: config.aiVideoDuration,
      },
      onProgress: (progress) => {
        const renderProgress = 40 + (progress * 0.6); // 40-100%
        onProgress?.({
          progress: renderProgress,
          message: `Rendering video... ${Math.round(progress * 100)}%`
        });
      },
    });

    onProgress?.({ progress: 100, message: 'Render completed!' });

    return config.outputPath;
  } catch (error) {
    console.error('Error rendering video:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to render video');
  }
}

export function getVideoQualitySettings(quality: 'low' | 'medium' | 'high' = 'medium') {
  switch (quality) {
    case 'low':
      return {
        width: 432,
        height: 768,
        fps: 24,
      };
    case 'high':
      return {
        width: 720,
        height: 1280,
        fps: 30,
      };
    default: // medium
      return {
        width: 576,
        height: 1024,
        fps: 30,
      };
  }
}

export function validateVideoConfig(config: VideoMergeConfig): { valid: boolean; error?: string } {
  if (!config.aiVideoUrl && !config.userVideoUrl) {
    return { valid: false, error: 'At least one video URL is required' };
  }

  if (config.aiVideoDuration < 1 || config.aiVideoDuration > 10) {
    return { valid: false, error: 'AI video duration must be between 1 and 10 seconds' };
  }

  if (config.captions.length > 0) {
    for (const caption of config.captions) {
      if (caption.startTime < 0 || caption.endTime <= caption.startTime) {
        return { valid: false, error: 'Invalid caption timing' };
      }
    }
  }

  return { valid: true };
} 