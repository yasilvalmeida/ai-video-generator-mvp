# Video Generator MVP

A Next.js application for creating AI-powered video montages with user-generated content, inspired by reel.farm. This MVP allows users to generate 5-6 second AI video hooks, upload their own videos, and combine them with automatically generated captions.

## Features

- 🎬 **AI Video Generation**: Create 5-second cinematic intros using Replicate API
- 📹 **Video Upload**: Drag-and-drop video upload with validation (max 100MB)
- 🎯 **Hook Templates**: Choose from 3 pre-designed AI video prompts
- 🎤 **Auto Transcription**: Extract speech from videos using OpenAI Whisper
- 📝 **Smart Captions**: Generate TikTok-style captions with timing
- 🎨 **Video Composition**: Combine AI + user videos with smooth transitions
- 📱 **Mobile-First Design**: Optimized for 9:16 vertical format
- 🎭 **Remotion Integration**: Professional video rendering and export

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Video Processing**: Remotion
- **AI Services**: 
  - Replicate API (video generation)
  - OpenAI Whisper (speech-to-text)
  - OpenAI GPT (caption formatting)
- **Language**: TypeScript
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Replicate API token
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd video-generator-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Upload Your Video
- Drag and drop or click to upload a video file
- Supported formats: MP4, MOV, WebM, AVI
- Maximum file size: 100MB

### 2. Choose AI Hook Template
- **Trending Hook**: Eye-catching intro for viral content
- **Lifestyle Hook**: Perfect for lifestyle and personal content  
- **Energetic Hook**: High-energy intro for dynamic content

### 3. Generate Montage
- Click "Generate Video Montage" to start processing
- The app will:
  - Generate a 5-second AI intro video
  - Transcribe your video's audio
  - Create TikTok-style captions
  - Combine everything into a preview

### 4. Edit & Export
- Review the combined video in the editor
- Adjust caption timing if needed
- Export in your preferred quality and format

## Project Structure

```
video-generator-mvp/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main upload page
│   ├── editor/page.tsx    # Video editor page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── UploadVideo.tsx    # File upload component
│   ├── HookSelector.tsx   # AI hook selection
│   └── CaptionPreview.tsx # Video preview with captions
├── lib/                   # Utility functions
│   ├── replicate.ts       # Replicate API wrapper
│   ├── openai.ts          # OpenAI API wrapper
│   ├── storage.ts         # File storage utilities
│   └── videoMerge.ts      # Remotion rendering
├── remotion/              # Video compositions
│   ├── Root.tsx           # Remotion root
│   ├── VideoMontage.tsx   # Main video composition
│   └── CaptionOverlay.tsx # Caption rendering
└── public/                # Static assets
```

## API Integration

### Replicate API
Used for generating AI video hooks. The app uses the Zeroscope v2 XL model for high-quality video generation.

### OpenAI API
- **Whisper**: Speech-to-text transcription with timestamps
- **GPT-3.5-turbo**: Caption formatting and styling

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests

# Remotion
npm run remotion     # Start Remotion preview
npm run remotion:render  # Render video
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REPLICATE_API_TOKEN` | Replicate API token for video generation | Yes |
| `OPENAI_API_KEY` | OpenAI API key for transcription and captions | Yes |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application | No |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.

---

Built with ❤️ using Next.js, Remotion, and AI APIs 