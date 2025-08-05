export function optimizePromptForVertical(prompt: string): string {
  // Add vertical-specific keywords to improve generation
  const verticalKeywords = [
    'vertical video format',
    'portrait orientation',
    'mobile-friendly',
    'social media content',
    'no distortion',
    'proper aspect ratio',
    '9:16 aspect ratio',
    'TikTok format',
    'Instagram Reels format',
  ];

  // Check if prompt already contains vertical keywords
  const hasVerticalKeywords = verticalKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );

  if (!hasVerticalKeywords) {
    return `${prompt}, ${verticalKeywords.slice(0, 4).join(', ')}`;
  }

  return prompt;
}

export function createVerticalVideoPrompt(basePrompt: string): string {
  const enhancedPrompt = optimizePromptForVertical(basePrompt);

  // Add specific instructions for better vertical video generation
  return `${enhancedPrompt}, cinematic composition for vertical format, dynamic movement suitable for mobile viewing, high contrast and vibrant colors for social media engagement`;
}

export function createHorizontalVideoPrompt(basePrompt: string): string {
  // For horizontal videos, keep the original prompt but add quality keywords
  return `${basePrompt}, cinematic composition, high quality, smooth motion, professional lighting`;
}
