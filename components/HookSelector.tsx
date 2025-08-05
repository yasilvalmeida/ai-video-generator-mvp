'use client';

import React from 'react';
import { Sparkles, Video, Settings } from 'lucide-react';
import { HookOption } from '@/contexts/VideoContext';

const hookOptions: HookOption[] = [
  {
    id: 'trending',
    name: 'Trending Hook',
    description: 'Eye-catching intro for viral content',
    prompt:
      'cinematic 5s intro of trending social media content for TikTok, vibrant colors, dynamic camera movement, high quality, smooth transitions, professional lighting, no distortion, clean visuals',
    category: 'social-media',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Hook',
    description: 'Perfect for lifestyle and personal content',
    prompt:
      'cinematic 5s intro of lifestyle and daily routine for TikTok, warm lighting, smooth transitions, high quality, natural colors, no distortion, clean visuals',
    category: 'lifestyle',
  },
  {
    id: 'energetic',
    name: 'Energetic Hook',
    description: 'High-energy intro for dynamic content',
    prompt:
      'cinematic 5s intro of energetic and fast-paced content for TikTok, bold colors, rapid cuts, high quality, smooth motion, no distortion, clean visuals',
    category: 'entertainment',
  },
];

interface HookSelectorProps {
  selectedHook: string | null;
  onHookSelect: (hook: HookOption) => void;
  disabled?: boolean;
  selectedQuality?: string;
  onQualityChange?: (quality: string) => void;
}

export const HookSelector: React.FC<HookSelectorProps> = ({
  selectedHook,
  onHookSelect,
  disabled = false,
  selectedQuality = 'latent-consistency-model',
  onQualityChange,
}) => {
  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='text-center mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Choose your AI hook
        </h3>
        <p className='text-sm text-gray-600'>
          Select a template to generate your 5-second intro video
        </p>
      </div>

      {/* Quality Selector */}
      {onQualityChange && (
        <div className='mb-6'>
          <div className='flex items-center justify-center space-x-4'>
            <Settings className='w-4 h-4 text-gray-600' />
            <span className='text-sm font-medium text-gray-700'>
              Video Quality:
            </span>
            <select
              value={selectedQuality}
              onChange={(e) => onQualityChange(e.target.value)}
              disabled={disabled}
              className='px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
              aria-label='Select video quality'
            >
              <option value='latent-consistency-model'>
                Vertical Optimized (Best for TikTok) ⭐
              </option>
              <option value='videocrafter-2'>
                Professional Quality (Best Results)
              </option>
              <option value='zeroscope'>Standard (Faster)</option>
              <option value='stable-video-diffusion'>
                High Quality (Slower)
              </option>
            </select>
          </div>
          <p className='text-xs text-gray-500 text-center mt-1'>
            Vertical Optimized is recommended for TikTok-style videos. It
            supports vertical format natively without distortion.
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {hookOptions.map((hook) => (
          <button
            key={hook.id}
            onClick={() => onHookSelect(hook)}
            disabled={disabled}
            className={`
              relative p-5 rounded-xl border-2 transition-all duration-200 text-left
              ${
                selectedHook === hook.id
                  ? 'border-primary-500 bg-primary-50 shadow-md scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className='flex flex-col h-full'>
              <div className='flex flex-col items-center justify-start gap-3 '>
                <div
                  className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-white transition-transform duration-200
                  bg-gradient-to-r from-primary-500 to-primary-600
                  ${selectedHook === hook.id ? 'scale-110' : ''}
                `}
                >
                  <Video className='w-6 h-6' />
                </div>

                <h6 className='font-semibold text-gray-900 text-base text-center'>
                  {hook.name}
                </h6>
              </div>

              <p className='text-sm text-gray-600 leading-relaxed text-center mt-4'>
                {hook.description}
              </p>
            </div>

            {selectedHook === hook.id && (
              <div className='absolute top-2 right-2'>
                <div className='w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-3 h-3 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
