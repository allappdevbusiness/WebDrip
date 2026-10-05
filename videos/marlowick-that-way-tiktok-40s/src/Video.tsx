// Composition root: one <Sequence> per story section plus the transition and audio layers.
// Scene components get the absolute frame so they can read src/timeline.json directly.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import T from './timeline.json';
import { Guides, useFonts } from './kit';
import { Close, Detail, Hook, LapelTransition, LapelWipe, Mobile, Reveal, Tap, Team, Value } from './scenes';

type Props = { showGuides?: boolean };
const S = T.scenes;
const Abs: React.FC<{ from: number; render: (f: number) => React.ReactNode }> = ({ from, render }) => {
  const f = useCurrentFrame() + from;
  return <>{render(f)}</>;
};
const Scene: React.FC<{ name: string; range: number[]; render: (f: number) => React.ReactNode }> = ({ name, range, render }) => (
  <Sequence name={name} from={range[0]} durationInFrames={range[1] - range[0]} layout="none">
    <Abs from={range[0]} render={render} />
  </Sequence>
);

export const MarlowickVideo: React.FC<Props> = ({ showGuides = false }) => {
  useFonts();
  return <AbsoluteFill style={{ background: '#FAF7F0' }}>
    <Scene name="1 Money hook" range={S.hook} render={(f) => <Hook f={f} />} />
    <Scene name="2 Reveal" range={S.reveal} render={(f) => <Reveal f={f} />} />
    <Scene name="3 Design detail" range={S.detail} render={(f) => <Detail f={f} />} />
    <Scene name="4 Astra + Opus" range={S.team} render={(f) => <Team f={f} />} />
    <Scene name="5 Mobile payoff" range={S.mobile} render={(f) => <Mobile f={f} />} />
    <Scene name="6 Interaction" range={S.tap} render={(f) => <Tap f={f} />} />
    <Scene name="7 Value payoff" range={S.value} render={(f) => <Value f={f} />} />
    <Scene name="8 WebDrip close" range={S.close} render={(f) => <Close f={f} />} />
    <Scene name="Lapel reveal" range={[T.beats.lapelClose, T.beats.lapelOpen + 40]} render={(f) => <LapelTransition f={f} />} />
    <Scene name="Lapel wipe" range={[T.beats.lapelWipe, T.beats.lapelWipe + 25]} render={(f) => <LapelWipe f={f} />} />
    <Audio src={staticFile('audio/mix.wav')} />
    {showGuides && <Guides />}
  </AbsoluteFill>;
};
