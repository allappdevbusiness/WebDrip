import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, DROP, FPS, H, SAFE, W } from './theme';
import { Captions, Grain, useFonts } from './util';
import { Hook, Setup, T_BENCH, T_CARDS, WhatHappened } from './scenes1';
import { Focus, Memory, T_FOCUS } from './scenes2';
import { End, Race, Reality, T_END, T_RACE, T_REALITY, WhyMeta } from './scenes3';
import { T_WHY } from './scenes2';

// one entry per section of the brief, in seconds
const SCENES: [number, number, React.FC<{ s: number }>][] = [
  [0, T_CARDS, Hook],
  [T_CARDS, T_BENCH, WhatHappened],
  [T_BENCH, DROP, Setup],
  [DROP, T_FOCUS, Memory],
  [T_FOCUS, T_WHY, Focus],
  [T_WHY, T_RACE, WhyMeta],
  [T_RACE, T_REALITY, Race],
  [T_REALITY, T_END, Reality],
  [T_END, 61, End],
];

export const Main: React.FC<{ guides?: boolean; mute?: boolean }> = ({ guides, mute }) => {
  useFonts();
  const s = useCurrentFrame() / FPS;
  const scene = SCENES.find(([a, b]) => s >= a && s < b);
  const Scene = scene ? scene[2] : null;
  return <AbsoluteFill style={{ background: C.ink }}>
    {Scene && <Scene s={s} />}
    <Grain s={s} opacity={0.08} />
    <Captions s={s} hidden={s >= 58.4} />
    {!mute && <Audio src={staticFile('mix.wav')} />}
    {guides && <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, outline: '3px dashed rgba(0,255,140,.9)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 150, background: 'rgba(255,0,80,.25)' }} />
      <div style={{ position: 'absolute', left: 940, top: 900, width: 140, height: 620, background: 'rgba(255,0,80,.25)' }} />
      <div style={{ position: 'absolute', left: 0, top: 1520, width: W, height: H - 1520, background: 'rgba(255,0,80,.25)' }} />
    </AbsoluteFill>}
  </AbsoluteFill>;
};
