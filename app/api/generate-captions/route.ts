import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, style = 'tiktok' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const result = await generateCaptions(text, style);
    return NextResponse.json({ captions: result });
  } catch (error) {
    console.error('Error in generate-captions API:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate captions',
      },
      { status: 500 }
    );
  }
}
