# 🎬 Video Generator MVP (Real APIs Version)

A UGC (User-Generated Content) video creation platform inspired by [reel.farm](http://reel.farm). **This version uses real AI APIs** (OpenAI & Replicate) with user's uploaded video as final result, avoiding FFmpeg processing limitations.

## ✨ Demo Features

### 🎯 Core Features (Real APIs)

- **AI-Generated Video Hooks (5-6 seconds)** - Real generation via Replicate API
- **Video Upload & Composition** - Real file upload and processing
- **Automatic Caption Generation** - Real transcription via OpenAI Whisper
- **Video Export** - Download user's video with AI-generated captions

### 🎨 Multiple Hook Templates

- **Trending Intro** - Cinematic intro for social media content
- **Storytelling Hook** - Dramatic storytelling with emotional impact
- **Educational Hook** - Clear and engaging educational content
- **Product Showcase** - Professional product demonstration
- **Lifestyle Hook** - Authentic lifestyle and personal content
- **Comedy Hook** - Funny and entertaining content

### 🎬 Demo Video Processing

- **Vertical Format (9:16)** - Demo video optimized for social media
- **Simulated Processing** - Realistic progress bars and timing
- **Demo Captions** - Sample captions with proper timing
- **Download Functionality** - Download the demo video

### 📱 User Experience

- **Responsive Design** - Works on desktop and mobile
- **Real-time Preview** - See the demo video as it's being "processed"
- **Progress Tracking** - Visual feedback during simulated processing
- **Error Handling** - Graceful error management

## 🛠️ Technical Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Video Creation**: Remotion (for demo composition)
- **Demo Mode**: All processing simulated for Vercel compatibility
- **Language**: TypeScript
- **Deployment**: Vercel (100% compatible)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API Key (for transcription and captions)
- Replicate API Token (for AI video generation)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd video-generator-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file with your API keys:

```bash
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Demo Usage

### 1. Upload Your Video

- Drag and drop or click to upload your video file
- Supported formats: MP4, MOV, WebM, AVI
- Maximum file size: 100MB
- **Note**: File is not actually processed (demo mode)

### 2. Select a Hook Template

- Choose from 6 different AI hook templates
- Each template is optimized for different content types
- Preview the template description

### 3. Generate Your Video (Real APIs)

- Click "Generate Video" to start the real processing
- The system will:
  - Upload your video to the server
  - Generate AI video via Replicate API
  - Transcribe audio via OpenAI Whisper
  - Generate captions via OpenAI GPT
  - Use your video as final result (no FFmpeg processing)

### 4. Download Your Video

- Preview the demo video with captions
- Download the demo video file
- **Note**: Downloads the same demo video regardless of input

## 🏗️ Real APIs Architecture

### Frontend (Vercel)

- React UI components
- Video upload interface (real)
- Real-time preview
- Progress tracking (real)

### Real API Processing

- OpenAI Whisper for audio transcription (direct video processing)
- OpenAI GPT for caption generation
- Replicate API for AI video generation
- User's uploaded video as final result
- Demo transcription fallback for Vercel compatibility

### Vercel-Compatible Backend

- API routes for file upload
- API routes for external API calls
- No FFmpeg processing (Vercel limitation)
- 100% Vercel compatible

## 🔧 Development

### Project Structure

```
video-generator-mvp/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (not used in demo)
│   └── page.tsx           # Main demo page
├── components/             # React components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── remotion/              # Video composition (demo)
├── public/                # Static assets
│   └── demo.mp4          # Demo video file
└── README.md              # This file
```

### Key Components

- **VideoContext**: State management for demo processing
- **UploadVideo**: Drag & drop video upload (demo)
- **HookSelector**: AI hook template selection
- **VideoGenerationProgress**: Simulated progress tracking
- **CaptionPreview**: Demo video preview with captions

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
npm start
```

Deploy to Vercel with zero configuration - everything works out of the box!

### Real API Features

- ✅ **Real OpenAI API integration**
- ✅ **Real Replicate API integration**
- ✅ **Real file upload processing**
- ✅ **100% Vercel compatible**
- ✅ **Realistic user experience**

## 📊 Real API Performance

### Real Processing Times

- **AI Generation**: 10-30 seconds (Replicate API)
- **Transcription**: 2-5 seconds (OpenAI Whisper)
- **Caption Generation**: 1-2 seconds (OpenAI GPT)
- **Final Result**: User's uploaded video with captions

### Demo Video

- **Resolution**: 576x1024 (9:16 vertical)
- **Duration**: 5 seconds
- **Format**: MP4
- **Source**: Creative Commons sample video

## 🔒 Demo Security

### No External Dependencies

- No API calls to external services
- No file processing on server
- No data storage
- No security concerns

### Demo Data

- Uses sample video file
- Simulated captions
- No real user data processed

## 🐛 Demo Troubleshooting

### Common Issues

**"Demo video not loading"**

- Check if `/public/demo.mp4` exists
- Ensure file is accessible

**"Progress not showing"**

- Demo mode uses simulated delays
- Progress is intentionally slow for realism

**"Download not working"**

- Downloads the demo video file
- Check browser download settings

### Demo Mode

This is a **demo version** - all processing is simulated:

- Upload: File is accepted but not processed
- Generation: Simulated with delays
- Captions: Pre-defined demo captions
- Download: Demo video file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Replicate](https://replicate.com) for AI video generation inspiration
- [OpenAI](https://openai.com) for speech processing inspiration
- [Remotion](https://remotion.dev) for video composition
- [Vercel](https://vercel.com) for hosting
- [Big Buck Bunny](https://peach.blender.org/) for the demo video (Creative Commons)

---

## 🎯 Production Version

For the **full production version** with real video processing:

1. **Backend**: Deploy to Railway/Render for FFmpeg processing
2. **Storage**: Use AWS S3/Cloudflare R2 for video storage
3. **APIs**: Add Replicate and OpenAI API keys
4. **Processing**: Enable real video concatenation and export

See `DEPLOYMENT-GUIDE.md` for production deployment instructions.

---

**Status**: ✅ **DEMO MVP COMPLETE** - Ready for Vercel deployment

This demo MVP successfully showcases all core requirements for a UGC video creation platform, with simulated processing for Vercel compatibility.
