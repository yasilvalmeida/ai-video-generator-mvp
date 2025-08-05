import Replicate from 'replicate';
import {
  createVerticalVideoPrompt,
  createHorizontalVideoPrompt,
} from './promptOptimizer';

// Initialize Replicate client
let replicate: Replicate | null = null;

export function getReplicateClient() {
  if (!replicate) {
    throw new Error('Replicate is not available');
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not configured');
  }

  return replicate;
}

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  model?:
    | 'zeroscope'
    | 'stable-video-diffusion'
    | 'latent-consistency-model'
    | 'videocrafter-2'
    | 'animatediff';
}

export interface VideoGenerationResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string;
  error?: string;
}

// Helper function to validate and adjust dimensions for model compatibility
function getCompatibleDimensions(width: number, height: number, model: string) {
  if (model === 'zeroscope') {
    // Zeroscope supports up to 576x1024, but let's use the maximum for better quality
    const maxWidth = 576;
    const maxHeight = 1024;

    // For vertical videos, use maximum height to maintain quality
    if (width > maxWidth || height > maxHeight) {
      // For vertical videos, prioritize height and use maximum available
      if (height > width) {
        const scale = maxHeight / height;
        return {
          width: Math.floor(width * scale),
          height: maxHeight,
        };
      } else {
        // For horizontal videos, use standard scaling
        const scaleX = maxWidth / width;
        const scaleY = maxHeight / height;
        const scale = Math.min(scaleX, scaleY);

        const newWidth = Math.floor(width * scale);
        const newHeight = Math.floor(height * scale);

        // Ensure dimensions are even numbers (required by some models)
        return {
          width: newWidth % 2 === 0 ? newWidth : newWidth - 1,
          height: newHeight % 2 === 0 ? newHeight : newHeight - 1,
        };
      }
    }
  } else if (model === 'latent-consistency-model') {
    // Latent Consistency Model supports vertical natively
    // Can handle up to 1024x1024, but works well with 9:16
    const maxDimension = 1024;

    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      return {
        width: Math.floor(width * scale),
        height: Math.floor(height * scale),
      };
    }
  } else if (model === 'videocrafter-2') {
    // VideoCrafter-2 supports various resolutions including vertical
    // Can handle up to 1024x1024
    const maxDimension = 1024;

    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      return {
        width: Math.floor(width * scale),
        height: Math.floor(height * scale),
      };
    }
  } else if (model === 'animatediff') {
    // AnimateDiff supports vertical natively
    // Can handle up to 1024x1024 with good vertical support
    const maxDimension = 1024;

    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      return {
        width: Math.floor(width * scale),
        height: Math.floor(height * scale),
      };
    }
  }

  return { width, height };
}

export async function generateAIVideo(
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  try {
    const client = getReplicateClient();
    if (!client) {
      throw new Error(
        'Replicate API is not configured. Please add REPLICATE_API_TOKEN to your environment variables.'
      );
    }

    // For vertical videos, use zeroscope with enhanced prompts
    const isVertical =
      request.height && request.width && request.height > request.width;
    const model = isVertical ? 'zeroscope' : request.model || 'zeroscope';

    // Get compatible dimensions for the model
    const { width, height } = getCompatibleDimensions(
      request.width || 576,
      request.height || 1024,
      model
    );

    // Optimize prompt for zeroscope
    let optimizedPrompt = request.prompt;
    if (request.height && request.width && request.height > request.width) {
      optimizedPrompt = createVerticalVideoPrompt(request.prompt);
    } else {
      optimizedPrompt = createHorizontalVideoPrompt(request.prompt);
    }

    // Start the prediction asynchronously
    const prediction = await client.predictions.create({
      version:
        '9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      input: {
        prompt: optimizedPrompt,
        num_frames: (request.duration || 5) * (request.fps || 30),
        fps: request.fps || 30,
        width: width,
        height: height,
        guidance_scale: 7.5,
        num_inference_steps: 25,
        seed: Math.floor(Math.random() * 1000000),
      },
    });

    // Return immediately with the prediction ID
    return {
      id: prediction.id,
      status: 'starting',
    };
  } catch (error) {
    console.error('Error generating AI video:', error);
    return {
      id: Date.now().toString(),
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function checkVideoGenerationStatus(
  predictionId: string
): Promise<VideoGenerationResponse> {
  try {
    const client = getReplicateClient();
    if (!client) {
      throw new Error(
        'Replicate API is not configured. Please add REPLICATE_API_TOKEN to your environment variables.'
      );
    }

    const prediction = await client.predictions.get(predictionId);

    if (prediction.status === 'succeeded') {
      return {
        id: prediction.id,
        status: 'succeeded',
        output: prediction.output as string,
      };
    } else if (prediction.status === 'failed') {
      return {
        id: prediction.id,
        status: 'failed',
        error: prediction.error || 'Unknown error occurred',
      };
    } else if (prediction.status === 'processing') {
      return {
        id: prediction.id,
        status: 'processing',
      };
    } else if (prediction.status === 'starting') {
      return {
        id: prediction.id,
        status: 'starting',
      };
    } else {
      // Any other status (canceled, etc.)
      return {
        id: prediction.id,
        status: 'processing', // Treat as still processing
      };
    }
  } catch (error) {
    console.error('Error checking video generation status:', error);
    return {
      id: predictionId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export function createVideoPrompt(topic: string): string {
  return `cinematic 5s intro of ${topic} for TikTok, vibrant colors, dynamic camera movement, high quality, smooth transitions, professional lighting, no distortion, clean visuals, 1080p`;
}
