import React from 'react';
import { Composition, Folder } from 'remotion';
import { DURATION, FPS, H, SCENES, W } from './beats';
import { MarlowickRebuild } from './Video';
import { Hook } from './scenes/Hook';
import { Explode } from './scenes/Explode';
import { Collection } from './scenes/Collection';
import { Mobile } from './scenes/Mobile';
import { Payoff } from './scenes/Payoff';
import { Montage } from './scenes/Montage';
import { Hold } from './scenes/Hold';
import { Hero } from './scenes/Hero';
import { Cta } from './scenes/Cta';

const len = (s: { from: number; to: number }) => s.to - s.from;
export const Root: React.FC = () => (
  <>
    <Composition id="MarlowickRebuild40" component={MarlowickRebuild} width={W} height={H} fps={FPS} durationInFrames={DURATION} defaultProps={{ showGuides: false, musicDb: -6 }} />
    <Composition id="MarlowickRebuild40Guides" component={MarlowickRebuild} width={W} height={H} fps={FPS} durationInFrames={DURATION} defaultProps={{ showGuides: true, musicDb: -6 }} />
    {/* connected scene compositions (each scene's own timeline; frame 0 = the scene's first frame in the edit) */}
    <Folder name="Scenes">
      <Composition id="S1-Hook" component={Hook} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.hook)} />
      <Composition id="S2-Explode" component={Explode} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.explode)} />
      <Composition id="S3-Collection" component={Collection} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.collection)} />
      <Composition id="S4-Mobile" component={Mobile} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.mobile)} />
      <Composition id="S5-Payoff" component={Payoff} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.payoff)} />
      <Composition id="S6-Montage" component={Montage} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.montage)} />
      <Composition id="S7-Hold" component={Hold} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.hold)} />
      <Composition id="S8-Hero" component={Hero} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.hero)} />
      <Composition id="S9-Cta" component={Cta} width={W} height={H} fps={FPS} durationInFrames={len(SCENES.cta)} />
    </Folder>
  </>
);
