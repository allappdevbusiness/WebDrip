// 31.029-32.781  The drums drop out and the picture stops with them: the montage's last shot (the site's
// tuxedo photo) freezes on its final frame, drains to monochrome while the camera creeps in, then is sucked
// away into the dark just before the bass returns at 32.78 s. No text - the silence is the moment.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SCENES } from '../beats';
import { C, E, k } from '../theme';
import { Photo, SceneRoot } from '../components/kit';

const S = SCENES.hold.from;

export const Hold: React.FC = () => {
  const f = useCurrentFrame() + S;
  const end = SCENES.hold.to;
  const drain = k(f, [S + 2, S + 30], [0, 1], E.glide);
  const creep = k(f, [S, end - 24], [1.1, 1.2], E.glide); // continues from the montage's last framing (1.1, -0.8 deg)
  const suck = k(f, [end - 24, end], [0, 1], E.accel); // anticipation into the hit
  return (
    <SceneRoot bg={C.ink}>
      <AbsoluteFill style={{ rotate: '-0.8deg', scale: String(creep * (1 - 0.85 * suck)), opacity: 1 - suck, borderRadius: suck * 80, overflow: 'hidden', filter: `grayscale(${drain}) contrast(${1 + 0.15 * drain})` }}>
        <Photo src="img/p2.jpg" iw={1080} ih={720} dx={20} />
      </AbsoluteFill>
    </SceneRoot>
  );
};
