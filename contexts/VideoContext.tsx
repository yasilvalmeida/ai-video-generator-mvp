'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
}

interface ProcessingState {
  status:
    | 'idle'
    | 'generating-ai'
    | 'transcribing'
    | 'generating-captions'
    | 'completed'
    | 'error';
  message: string;
}

interface VideoState {
  selectedFile: File | null;
  selectedHook: HookOption | null;
  userVideoUrl: string;
  aiVideoUrl: string;
  renderedMontageUrl: string;
  captions: CaptionSegment[];
  processingState: ProcessingState;
  videoTime: number;
  isPlaying: boolean;
  isMuted: boolean;
}

export interface HookOption {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
}

// Actions
type VideoAction =
  | { type: 'SET_SELECTED_FILE'; payload: File | null }
  | { type: 'SET_SELECTED_HOOK'; payload: HookOption | null }
  | { type: 'SET_USER_VIDEO_URL'; payload: string }
  | { type: 'SET_AI_VIDEO_URL'; payload: string }
  | { type: 'SET_RENDERED_MONTAGE_URL'; payload: string }
  | { type: 'SET_CAPTIONS'; payload: CaptionSegment[] }
  | { type: 'SET_PROCESSING_STATE'; payload: ProcessingState }
  | { type: 'SET_VIDEO_TIME'; payload: number }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_IS_MUTED'; payload: boolean }
  | { type: 'RESET_STATE' }
  | { type: 'CLEAR_VIDEOS' }
  | { type: 'CLEAR_PROCESSING_RESULTS' };

// Initial state
const initialState: VideoState = {
  selectedFile: null,
  selectedHook: null,
  userVideoUrl: '',
  aiVideoUrl: '',
  renderedMontageUrl: '',
  captions: [],
  processingState: {
    status: 'idle',
    message: '',
  },
  videoTime: 0,
  isPlaying: false,
  isMuted: false,
};

// Reducer
function videoReducer(state: VideoState, action: VideoAction): VideoState {
  switch (action.type) {
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload };
    case 'SET_SELECTED_HOOK':
      return { ...state, selectedHook: action.payload };
    case 'SET_USER_VIDEO_URL':
      return { ...state, userVideoUrl: action.payload };
    case 'SET_AI_VIDEO_URL':
      return { ...state, aiVideoUrl: action.payload };
    case 'SET_RENDERED_MONTAGE_URL':
      return { ...state, renderedMontageUrl: action.payload };
    case 'SET_CAPTIONS':
      return { ...state, captions: action.payload };
    case 'SET_PROCESSING_STATE':
      return { ...state, processingState: action.payload };
    case 'SET_VIDEO_TIME':
      return { ...state, videoTime: action.payload };
    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_IS_MUTED':
      return { ...state, isMuted: action.payload };
    case 'RESET_STATE':
      return initialState;
    case 'CLEAR_VIDEOS':
      return {
        ...state,
        selectedFile: null,
        userVideoUrl: '',
        aiVideoUrl: '',
        renderedMontageUrl: '',
        captions: [],
        processingState: {
          status: 'idle',
          message: '',
        },
      };
    case 'CLEAR_PROCESSING_RESULTS':
      return {
        ...state,
        userVideoUrl: '',
        aiVideoUrl: '',
        renderedMontageUrl: '',
        captions: [],
        processingState: {
          status: 'idle',
          message: '',
        },
      };
    default:
      return state;
  }
}

// Context
interface VideoContextType {
  state: VideoState;
  dispatch: React.Dispatch<VideoAction>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Provider
interface VideoProviderProps {
  children: ReactNode;
}

export function VideoProvider({ children }: VideoProviderProps) {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  return (
    <VideoContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoContext.Provider>
  );
}

// Hook
export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}

// Force demo mode for Vercel deployment
const FORCE_DEMO_MODE = true;

export const hookOptions: HookOption[] = [
  {
    id: 'trending-intro',
    name: 'Trending Intro',
    description: 'Cinematic intro for trending social media content',
    prompt:
      'cinematic 5s intro of trending social media content for TikTok, vibrant colors, dynamic camera movement, high quality, smooth transitions, professional lighting, no distortion, clean visuals, engaging hook, viral potential',
    category: 'social-media',
  },
  {
    id: 'storytelling-hook',
    name: 'Storytelling Hook',
    description: 'Dramatic storytelling intro with emotional impact',
    prompt:
      'dramatic 5s storytelling intro with emotional music, cinematic lighting, compelling narrative setup, high contrast visuals, professional cinematography, engaging story hook, viral storytelling format',
    category: 'storytelling',
  },
  {
    id: 'educational-hook',
    name: 'Educational Hook',
    description: 'Clear and engaging educational content intro',
    prompt:
      'engaging 5s educational intro with clear visuals, professional presentation style, informative graphics, clean typography, high quality production, learning-focused content, knowledge sharing format',
    category: 'educational',
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Professional product demonstration intro',
    prompt:
      'professional 5s product showcase intro, clean product presentation, studio lighting, high quality product shots, professional marketing style, engaging product hook, commercial quality',
    category: 'commercial',
  },
  {
    id: 'lifestyle-hook',
    name: 'Lifestyle Hook',
    description: 'Authentic lifestyle and personal content intro',
    prompt:
      'authentic 5s lifestyle intro, natural lighting, personal storytelling, relatable content, genuine moments, high quality lifestyle shots, engaging personal hook, real life format',
    category: 'lifestyle',
  },
  {
    id: 'comedy-hook',
    name: 'Comedy Hook',
    description: 'Funny and entertaining content intro',
    prompt:
      'funny 5s comedy intro, humorous setup, entertaining visuals, comedic timing, engaging humor, viral comedy potential, high quality funny content, laughter-inducing hook',
    category: 'entertainment',
  },
];
