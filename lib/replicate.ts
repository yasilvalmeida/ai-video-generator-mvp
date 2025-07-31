import Replicate from 'replicate';

// Initialize Replicate client
let replicate: Replicate | null = null;

function getReplicateClient(): Replicate | null {
  console.log('getReplicateClient called');
  console.log('replicate exists:', !!replicate);
  console.log('REPLICATE_API_TOKEN exists:', !!process.env.REPLICATE_API_TOKEN);

  if (!replicate && process.env.REPLICATE_API_TOKEN) {
    console.log('Creating new Replicate client');
    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  return replicate;
}

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  fps?: number;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string;
  error?: string;
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

    // Using a popular video generation model (you can change this based on your needs)
    const output = await client.run(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      {
        input: {
          prompt: request.prompt,
          num_frames: (request.duration || 5) * (request.fps || 24),
          fps: request.fps || 24,
          width: 576,
          height: 1024, // 9:16 aspect ratio for mobile
        },
      }
    );

    return {
      id: Date.now().toString(),
      status: 'succeeded',
      output: output as unknown as string,
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

export function createVideoPrompt(topic: string): string {
  return `cinematic 5s intro of ${topic} for TikTok, vibrant colors, dynamic camera movement, high quality`;
}
