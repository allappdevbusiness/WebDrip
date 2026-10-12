import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { DURATION, FPS, H, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MuseWonder" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ guides: false, mute: false }} />
  </>
);
