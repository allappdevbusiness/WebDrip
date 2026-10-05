// The edit: nine scenes on one TransitionSeries (hard cuts; every transition is built inside the scenes so
// visual landings stay frame-exact on the beat map in beats.ts), the licensed song section and the SFX layer.
import React from 'react';
import { Audio } from '@remotion/media';
import { TransitionSeries } from '@remotion/transitions';
import { AbsoluteFill, staticFile, useVideoConfig } from 'remotion';
import { SCENES } from './beats';
import { SoundDesign } from './SoundDesign';
import { Collection } from './scenes/Collection';
import { Cta } from './scenes/Cta';
import { Explode } from './scenes/Explode';
import { Hero } from './scenes/Hero';
import { Hold } from './scenes/Hold';
import { Hook } from './scenes/Hook';
import { Mobile } from './scenes/Mobile';
import { Montage } from './scenes/Montage';
import { Payoff } from './scenes/Payoff';
import { Guides } from './Guides';

export const MarlowickRebuild: React.FC<{ showGuides?: boolean; musicDb?: number }> = ({ showGuides = false, musicDb = -6 }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: '#121826' }}>
      <TransitionSeries name="Edit">
        <TransitionSeries.Sequence name="1 Hook (breakdown)" durationInFrames={SCENES.hook.to - SCENES.hook.from} premountFor={fps}><Hook /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="2 Drop + explode" durationInFrames={SCENES.explode.to - SCENES.explode.from} premountFor={fps}><Explode /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="3 Collection" durationInFrames={SCENES.collection.to - SCENES.collection.from} premountFor={fps}><Collection /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="4 Mobile (chorus)" durationInFrames={SCENES.mobile.to - SCENES.mobile.from} premountFor={fps}><Mobile /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="5 Payoff" durationInFrames={SCENES.payoff.to - SCENES.payoff.from} premountFor={fps}><Payoff /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="6 Montage" durationInFrames={SCENES.montage.to - SCENES.montage.from} premountFor={fps}><Montage /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="7 Hold (break)" durationInFrames={SCENES.hold.to - SCENES.hold.from} premountFor={fps}><Hold /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="8 Hero" durationInFrames={SCENES.hero.to - SCENES.hero.from} premountFor={fps}><Hero /></TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="9 CTA" durationInFrames={SCENES.cta.to - SCENES.cta.from} premountFor={fps}><Cta /></TransitionSeries.Sequence>
      </TransitionSeries>
      {/* "That Way" - Nbhd Nick (Epidemic Sound), song 01:21.088 -> 02:01.088, pre-cut sample-exact */}
      <Audio name="Music - That Way 01:21.088" src={staticFile('audio/that-way-81.088-121.088.wav')} volume={Math.pow(10, musicDb / 20)} premountFor={fps} />
      <SoundDesign />
      {showGuides && <Guides />}
    </AbsoluteFill>
  );
};
