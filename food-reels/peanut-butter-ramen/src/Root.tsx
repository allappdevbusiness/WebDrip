import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';

export const Root: React.FC = () => (
  <Composition id="PeanutButterRamen" component={Main} durationInFrames={1800} fps={30} width={1080} height={1920} />
);
