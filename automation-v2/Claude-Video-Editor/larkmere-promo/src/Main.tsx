import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { F } from './timing';
import { FontGate } from './lib';
import { Hook } from './scenes/Hook';
import { SecondHook } from './scenes/SecondHook';
import { Brand } from './scenes/Brand';
import { Route } from './scenes/Route';
import { NoFoam } from './scenes/NoFoam';
import { Bouquet } from './scenes/Bouquet';
import { Wedding } from './scenes/Wedding';
import { RoseHit, RoseStop } from './scenes/Rose';
import { End } from './scenes/End';

// Picture only. Music (with the hook's own audio) is mixed in tools/mix.py and muxed after render.
const CUTS: [number, number, React.FC][] = [
  [0, F.musicIn, Hook],
  [F.musicIn, F.drums, SecondHook],
  [F.drums, F.bar30, Brand],
  [F.bar30, F.bar32, Route],
  [F.bar32, F.bar33, NoFoam],
  [F.bar33, F.bar36, Bouquet],
  [F.bar36, F.stop, Wedding],
  [F.stop, F.rose, RoseStop],
  [F.rose, F.resolve, RoseHit],
  [F.resolve, F.end, End],
];

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: '#FBF6F0' }}>
    <FontGate>
      {CUTS.map(([a, b, S]) => <Sequence key={a} from={a} durationInFrames={b - a}><S /></Sequence>)}
    </FontGate>
  </AbsoluteFill>
);
