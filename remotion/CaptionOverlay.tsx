import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface Caption {
  text: string;
  startTime: number;
  endTime: number;
}

interface CaptionOverlayProps {
  captions: Caption[];
  currentFrame: number;
  fps: number;
  scale: number;
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  captions,
  currentFrame,
  fps,
  scale,
}) => {
  const currentTime = currentFrame / fps;

  // Find the current caption
  const currentCaption = captions.find(
    (caption) =>
      currentTime >= caption.startTime && currentTime <= caption.endTime
  );

  if (!currentCaption) {
    return null;
  }

  // Calculate caption animation
  const captionProgress = interpolate(
    currentTime,
    [
      currentCaption.startTime,
      currentCaption.startTime + 0.3,
      currentCaption.endTime - 0.3,
      currentCaption.endTime,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const captionY = interpolate(captionProgress, [0, 1], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 80,
        paddingHorizontal: 20,
      }}
    >
      <div
        style={{
          transform: `translateY(${captionY}px) scale(${scale})`,
          opacity: captionProgress,
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
          borderRadius: 16,
          padding: '12px 20px',
          border: '2px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          maxWidth: '90%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 'bold',
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {currentCaption.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
