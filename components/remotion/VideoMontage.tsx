import React from 'react';
import {
  AbsoluteFill,
  Video,
  Sequence,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { CaptionOverlay } from './CaptionOverlay';

interface VideoMontageProps {
  aiVideoUrl: string;
  userVideoUrl: string;
  captions: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
  aiVideoDuration: number;
}

export const VideoMontage: React.FC<VideoMontageProps> = ({
  aiVideoUrl,
  userVideoUrl,
  captions,
  aiVideoDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate transition timing
  const aiVideoFrames = aiVideoDuration * fps;
  const transitionFrames = 15; // 0.5 second transition
  const transitionStart = aiVideoFrames - transitionFrames;

  // Fade out AI video
  const aiVideoOpacity = interpolate(
    frame,
    [transitionStart, aiVideoFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Fade in user video
  const userVideoOpacity = interpolate(
    frame,
    [transitionStart, aiVideoFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Spring animation for captions
  const captionScale = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 300,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* AI Video */}
      <Sequence from={0} durationInFrames={aiVideoFrames}>
        <AbsoluteFill style={{ opacity: aiVideoOpacity }}>
          {aiVideoUrl && (
            <Video
              src={aiVideoUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                backgroundColor: '#000',
              }}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* User Video */}
      <Sequence from={transitionStart} durationInFrames={Infinity}>
        <AbsoluteFill style={{ opacity: userVideoOpacity }}>
          {userVideoUrl && (
            <Video
              src={userVideoUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                backgroundColor: '#000',
              }}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Captions Overlay */}
      <CaptionOverlay captions={captions} />
    </AbsoluteFill>
  );
};
