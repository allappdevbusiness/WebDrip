// 31.029-32.781  The drums drop out. Everything stops: the last montage frame freezes, drains to ink, and
// the question sits in near-silence ("WORTH" on the next beat, "$300?" on the returning snare). The text
// tightens in the last frames, pulling the viewer into the bass hit at 32.78 s.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EV, SCENES } from '../beats';
import { C, E, k } from '../theme';
import { KineticText, SceneRoot, UILayer } from '../components/kit';

const S = SCENES.hold.from;

export const Hold: React.FC = () => {
  const f = useCurrentFrame() + S;
  const drain = k(f, [S, S + 20], [0, 1], E.glide);
  const squeeze = k(f, [SCENES.hold.to - 26, SCENES.hold.to], [1, 0.9], E.accel);
  return (
    <SceneRoot bg={C.ink}>
      {/* freeze frame of the last montage shot (the real form) */}
      <AbsoluteFill style={{ background: C.ivory, opacity: 1 - drain, filter: `grayscale(${drain})`, scale: String(1.1 - 0.05 * drain) }}>
        <UILayer id="form" s={2.2} x={540} y={920} />
      </AbsoluteFill>
      <AbsoluteFill style={{ scale: String(squeeze), transformOrigin: '400px 900px', opacity: k(f, [SCENES.hold.to - 6, SCENES.hold.to], [1, 0]) }}>
        <KineticText name="WORTH" from={EV.holdWorth - S} mode="rise" color={C.ivory} size={170} y={620}>Worth</KineticText>
        <KineticText name="$300?" from={EV.holdPrice - S} mode="slam" color={C.camel} size={300} y={800}>$300?</KineticText>
      </AbsoluteFill>
    </SceneRoot>
  );
};
