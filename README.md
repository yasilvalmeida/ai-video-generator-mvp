# Video Generator MVP

A Next.js application for creating AI-powered video montages with user-generated content, inspired by reel.farm. This MVP allows users to generate 5-6 second AI video hooks, upload their own videos, and combine them with automatically generated captions.

## Features

- 🎬 **AI Video Generation**: Create 5-second cinematic intros using Replicate API
- 📹 **Enhanced Video Upload**: Drag-and-drop with immediate preview and validation (max 100MB)
- 🎯 **Smart Hook Selection**: 3 pre-designed AI video prompts with visual feedback
- 🎤 **Auto Transcription**: Extract speech from videos using OpenAI Whisper
- 📝 **Smart Captions**: Generate TikTok-style captions with timing
- 🎨 **Video Composition**: Combine AI + user videos with smooth transitions
- 📱 **Mobile-First Design**: Optimized for 9:16 vertical format
- 🎭 **Remotion Integration**: Professional video rendering and export
- 🔄 **Intelligent Fallback**: Demo mode when APIs are unavailable or credits insufficient
- ⚡ **Server-Side Rendering**: API keys loaded securely on the server
- 🎨 **Modern UI/UX**: Enhanced drag-and-drop, progress indicators, and visual feedback

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with Server-Side Rendering
- **Styling**: Tailwind CSS with custom animations and gradients
- **Video Processing**: Remotion for professional video composition
- **AI Services**:
  - Replicate API (video generation with intelligent fallback)
  - OpenAI Whisper (speech-to-text transcription)
  - OpenAI GPT (caption formatting and styling)
- **Language**: TypeScript with strict type checking
- **Icons**: Lucide React
- **Architecture**: Modular components with API routes for server-side processing

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Replicate API token (with credits for video generation)
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

- **Enhanced drag-and-drop** with visual feedback and immediate preview
- **File validation** with size and format checking
- **Supported formats**: MP4, MOV, WebM, AVI
- **Maximum file size**: 100MB
- **Preview functionality**: Play/pause uploaded video before processing

### 2. Choose AI Hook Template

- **Visual selection** with enhanced UI and descriptions
- **Trending Hook**: Eye-catching intro for viral content
- **Lifestyle Hook**: Perfect for lifestyle and personal content
- **Energetic Hook**: High-energy intro for dynamic content
- **Smart feedback**: Visual indicators for selected hooks

### 3. Generate Montage

- **Smart button states** with dynamic text and progress indicators
- **Real-time progress** with percentage and status updates
- **Intelligent fallback**: Demo mode when APIs unavailable or credits insufficient
- The app will:
  - Generate a 5-second AI intro video (or use demo)
  - Transcribe your video's audio using Whisper
  - Create TikTok-style captions with GPT
  - Combine everything into a preview

### 4. Edit & Export

- **Enhanced preview** with caption overlay
- **Download options** with quality and format settings
- **Export settings**: MP4, MOV, WebM formats with quality options
- Review the combined video in the editor
- Adjust caption timing if needed
- Export in your preferred quality and format

## Project Structure

```
video-generator-mvp/
├── app/                           # Next.js App Router
│   ├── page.tsx                  # Main upload page with SSR
│   ├── editor/page.tsx           # Video editor page
│   ├── layout.tsx                # Root layout with API key detection
│   ├── globals.css               # Global styles
│   └── api/                      # Server-side API routes
│       ├── config/route.ts       # API key status endpoint
│       ├── generate-video/route.ts # AI video generation
│       ├── transcribe/route.ts   # Audio transcription
│       └── generate-captions/route.ts # Caption generation
├── components/                   # Reusable UI components
│   ├── UploadVideo.tsx           # Enhanced file upload with preview
│   ├── HookSelector.tsx          # AI hook selection with visual feedback
│   ├── CaptionPreview.tsx        # Video preview with captions
│   ├── GenerateButton.tsx        # Smart button with progress states
│   └── DownloadButton.tsx        # Export with quality options
├── lib/                          # Utility functions
│   ├── replicate.ts              # Replicate API wrapper (server-side)
│   ├── openai.ts                 # OpenAI API wrapper (server-side)
│   ├── storage.ts                # File storage utilities
│   └── videoMerge.ts             # Remotion rendering
├── remotion/                     # Video compositions
│   ├── Root.tsx                  # Remotion root
│   ├── VideoMontage.tsx          # Main video composition
│   └── CaptionOverlay.tsx        # Caption rendering
└── public/                       # Static assets
```

## API Integration

### Server-Side Architecture

All API calls are processed server-side for security and reliability:

- **API Routes**: `/api/generate-video`, `/api/transcribe`, `/api/generate-captions`
- **Environment Variables**: Securely loaded on the server
- **Error Handling**: Intelligent fallback to demo mode

### Replicate API

Used for generating AI video hooks. The app uses the Zeroscope v2 XL model for high-quality video generation.

- **Intelligent Fallback**: Automatically switches to demo mode if credits are insufficient
- **Error Handling**: Graceful degradation with user feedback

### OpenAI API

- **Whisper**: Speech-to-text transcription with timestamps
- **GPT-3.5-turbo**: Caption formatting and styling
- **Server-Side Processing**: All API calls handled securely on the server

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

| Variable              | Description                                             | Required |
| --------------------- | ------------------------------------------------------- | -------- |
| `REPLICATE_API_TOKEN` | Replicate API token for video generation (with credits) | Yes      |
| `OPENAI_API_KEY`      | OpenAI API key for transcription and captions           | Yes      |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application                           | No       |

### Demo Mode

The app includes a comprehensive demo mode that activates when:

- API keys are not configured
- Replicate credits are insufficient
- API services are unavailable

Demo mode provides a full simulation of the video processing workflow for testing and demonstration purposes.

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

### Development Guidelines

- Follow TypeScript best practices with strict type checking
- Use modular component architecture
- Implement server-side processing for API calls
- Include proper error handling and fallback mechanisms
- Maintain responsive design principles

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.

---

Built with ❤️ using Next.js, Remotion, and AI APIs

## Recent Updates

### v1.1.0 - Enhanced UI/UX & Server-Side Architecture

- ✨ **Enhanced drag-and-drop** with immediate video preview
- 🎯 **Improved hook selection** with visual feedback and descriptions
- ⚡ **Server-side rendering** for secure API key handling
- 🔄 **Intelligent fallback** system with demo mode
- 📊 **Real-time progress indicators** with percentage tracking
- 🎨 **Modern UI components** with gradients and animations
- 🛡️ **Robust error handling** with graceful degradation
- 📱 **Mobile-optimized** responsive design
