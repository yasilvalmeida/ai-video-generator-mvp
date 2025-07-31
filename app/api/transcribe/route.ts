import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    const result = await transcribeAudio(file);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in transcribe API:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to transcribe audio',
      },
      { status: 500 }
    );
  }
}
