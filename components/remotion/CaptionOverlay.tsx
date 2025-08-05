import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface CaptionOverlayProps {
  captions: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the current caption
  const currentCaption = captions.find(
    (caption) =>
      currentTime >= caption.startTime && currentTime <= caption.endTime
  );

  if (!currentCaption) {
    return null;
  }

  // Calculate animation progress
  const captionDuration = currentCaption.endTime - currentCaption.startTime;
  const captionProgress =
    (currentTime - currentCaption.startTime) / captionDuration;

  // Enhanced caption styles for social media
  const captionStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    fontSize: 'clamp(24px, 4vw, 32px)',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadow: `
      2px 2px 4px rgba(0,0,0,0.8),
      0 0 20px rgba(0,0,0,0.5),
      0 0 40px rgba(0,0,0,0.3)
    `,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '12px 20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.2)',
    maxWidth: '90%',
    lineHeight: 1.2,
    letterSpacing: '0.5px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    // Animation properties
    opacity:
      captionProgress < 0.1
        ? captionProgress * 10
        : captionProgress > 0.9
        ? (1 - captionProgress) * 10
        : 1,
    transform: `translateX(-50%) translateY(${
      captionProgress < 0.1
        ? (1 - captionProgress * 10) * 20
        : captionProgress > 0.9
        ? (captionProgress - 0.9) * 10 * 20
        : 0
    }px)`,
    transition: 'all 0.3s ease-in-out',
  };

  return <div style={captionStyle}>{currentCaption.text}</div>;
};
