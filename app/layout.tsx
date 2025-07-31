import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Video Generator MVP',
  description: 'Create AI-powered video montages with your content',
};

// Server-side function to check API keys
async function getApiKeysStatus() {
  const hasReplicateToken = !!process.env.REPLICATE_API_TOKEN;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  return hasReplicateToken && hasOpenAIKey;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasApiKeys = await getApiKeysStatus();

  return (
    <html lang='en'>
      <body>
        <div data-has-api-keys={hasApiKeys.toString()}>{children}</div>
      </body>
    </html>
  );
}
