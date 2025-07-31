import { Composition } from 'remotion';
import { VideoMontage } from './VideoMontage';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id='VideoMontage'
        component={VideoMontage}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={576}
        height={1024}
        defaultProps={{
          aiVideoUrl: '',
          userVideoUrl: '',
          captions: [],
          aiVideoDuration: 5,
        }}
      />
    </>
  );
};
