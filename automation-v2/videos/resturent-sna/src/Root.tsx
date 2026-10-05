import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { DURATION, FPS } from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition id="CarritoRojoSNA" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={DURATION * FPS} />
);
