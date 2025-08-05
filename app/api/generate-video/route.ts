import { NextRequest, NextResponse } from 'next/server';
import { generateAIVideo } from '@/lib/replicate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      duration = 5,
      fps = 30,
      width = 1080,
      height = 1920,
      model = 'zeroscope',
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateAIVideo({
      prompt,
      duration,
      fps,
      width,
      height,
      model,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-video API:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'failed',
      },
      { status: 500 }
    );
  }
}
