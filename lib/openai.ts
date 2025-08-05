import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  text: string;
  segments: TranscriptionSegment[];
  language?: string;
}

export async function transcribeAudio(file: File): Promise<any> {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const response = await client.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word'],
    });

    return response;
  } catch (error) {
    throw new Error(`Transcription failed: ${error}`);
  }
}

export async function generateCaptions(
  text: string,
  style: 'tiktok' | 'subtitles' = 'tiktok'
): Promise<string[]> {
  try {
    const client = getOpenAIClient();
    if (!client) {
      throw new Error(
        'OpenAI API is not configured. Please add OPENAI_API_KEY to your environment variables.'
      );
    }

    const prompt =
      style === 'tiktok'
        ? `Convert this text into TikTok-style captions (short, punchy lines, max 3-4 words per line): "${text}"`
        : `Convert this text into subtitle format (natural breaks, readable length): "${text}"`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a caption formatting expert. Return only the formatted captions, one per line, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
    });

    const captions =
      completion.choices[0]?.message?.content
        ?.split('\n')
        .filter((line) => line.trim()) || [];
    return captions;
  } catch (error) {
    console.error('Error generating captions:', error);
    // Fallback: simple word splitting
    return text
      .split(' ')
      .reduce((acc: string[], word: string, index: number) => {
        if (index % 3 === 0) {
          acc.push(word);
        } else {
          acc[acc.length - 1] += ' ' + word;
        }
        return acc;
      }, []);
  }
}
