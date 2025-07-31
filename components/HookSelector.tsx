'use client';

import React from 'react';
import { Sparkles, TrendingUp, Heart, Zap } from 'lucide-react';

export interface HookOption {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  color: string;
}

const hookOptions: HookOption[] = [
  {
    id: 'trending',
    title: 'Trending Hook',
    description: 'Eye-catching intro for viral content',
    prompt:
      'cinematic 5s intro of trending social media content for TikTok, vibrant colors, dynamic camera movement, high quality',
    icon: <TrendingUp className='w-5 h-5' />,
    color: 'bg-gradient-to-r from-blue-500 to-purple-600',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Hook',
    description: 'Perfect for lifestyle and personal content',
    prompt:
      'cinematic 5s intro of lifestyle and daily routine for TikTok, warm lighting, smooth transitions, high quality',
    icon: <Heart className='w-5 h-5' />,
    color: 'bg-gradient-to-r from-pink-500 to-red-500',
  },
  {
    id: 'energetic',
    title: 'Energetic Hook',
    description: 'High-energy intro for dynamic content',
    prompt:
      'cinematic 5s intro of energetic and fast-paced content for TikTok, bold colors, rapid cuts, high quality',
    icon: <Zap className='w-5 h-5' />,
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },
];

interface HookSelectorProps {
  selectedHook: string | null;
  onHookSelect: (hook: HookOption) => void;
  disabled?: boolean;
}

export const HookSelector: React.FC<HookSelectorProps> = ({
  selectedHook,
  onHookSelect,
  disabled = false,
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
            <div className='space-y-4'>
              <div className='flex flex-col items-center justify-between gap-2'>
                <div
                  className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-white transition-transform duration-200
                  ${hook.color}
                  ${selectedHook === hook.id ? 'scale-110' : ''}
                `}
                >
                  {hook.icon}
                </div>

                <h6 className='font-semibold text-gray-900 text-base'>
                  {hook.title}
                </h6>
              </div>

              <p className='text-sm text-gray-600 leading-relaxed pl-15 -mt-1'>
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
