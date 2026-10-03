import React from 'react';
import { Composition } from 'remotion';
import { Promo } from './Promo';
import { CANVAS, DURATION, FPS } from './layout';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Feed" component={Promo} durationInFrames={DURATION} fps={FPS} width={CANVAS.feed.w} height={CANVAS.feed.h} defaultProps={{ fmt: 'feed' as const, showGuides: false }} />
    <Composition id="TikTok" component={Promo} durationInFrames={DURATION} fps={FPS} width={CANVAS.tiktok.w} height={CANVAS.tiktok.h} defaultProps={{ fmt: 'tiktok' as const, showGuides: false }} />
  </>
);
