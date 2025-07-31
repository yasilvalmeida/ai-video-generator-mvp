import { NextResponse } from 'next/server';

export async function GET() {
  const hasReplicateToken = !!process.env.REPLICATE_API_TOKEN;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({
    hasApiKeys: hasReplicateToken && hasOpenAIKey,
    hasReplicateToken,
    hasOpenAIKey,
  });
}
