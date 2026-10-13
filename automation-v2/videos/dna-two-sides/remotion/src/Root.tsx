import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { DUR, FPS } from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition id="TikTok" component={Video} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
);
