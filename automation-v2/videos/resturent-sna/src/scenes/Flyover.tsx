import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from '../theme';
import { riff, CYCLE } from '../timing';
import { ease, ep, kf, lerp, prog, slam, within } from '../lib/motion';
import { Paper, Poster } from '../components/base';

// 23.551 → 27.354 — WIDE. The whole desktop build as one tilted plane; the camera flies over it,
// landing on a feature per riff note. B: "ALL OF IT. $500." — callback to the hook.
const N = {
  E: riff(6, 'E'),
  E2: riff(6, 'E2'),
  G: riff(6, 'G'),
  E3: riff(6, 'E3'),
  D: riff(6, 'D'),
  Cn: riff(6, 'C'),
  B: riff(6, 'B'),
};
const START = CYCLE[6];
const END = CYCLE[7];
const STRIP_H = 6591; // public/shots/d_strip.jpg is 1080 × 6591

// strip-y of each feature (measured on the stitched desktop capture)
const STOPS = [
  { at: N.E, y: 330, label: 'Scroll-driven video hero' },
  { at: N.G, y: 3350, label: 'Live menu filters' },
  { at: N.D, y: 4420, label: 'Daily truck schedule' },
  { at: N.Cn, y: 6080, label: 'Catering bookings' },
];

export const Flyover: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  // camera y on the plane: whips between stops, each landing on its note
  const keys: [number, number, (x: number) => number][] = [[START - 0.01, -200, ease.linear]];
  STOPS.forEach((s, i) => {
    if (i > 0) keys.push([s.at - 0.16, STOPS[i - 1].y + 120, ease.outCubic]);
    keys.push([s.at, s.y, ease.inOutCubic]);
  });
  keys.push([N.B - 0.05, 6200, ease.linear]);
  const camY = kf(t, keys);
  // B: pull far back
  const back = ep(t, N.B - 0.05, N.B + 0.5, ease.outExpo);
  const tilt = lerp(52, 62, back);
  const zoom = lerp(1.35, 0.55, back);
  const intro = ep(t, START, START + 0.35, ease.outExpo);

  const stop = [...STOPS].reverse().find((s) => t >= s.at);
  const tagIn = stop ? ep(t, stop.at, stop.at + 0.18, ease.outExpo) : 0;
  const all = t >= N.B - 0.08 ? slam(t, N.B, 2.6, 0.08) : 0;

  return (
    <AbsoluteFill style={{ perspective: 1300, perspectiveOrigin: '50% 30%' }}>
      <Paper color={C.sky} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 960,
          width: 1080,
          height: STRIP_H,
          transformOrigin: `50% ${camY}px`,
          transform: `translateY(${-camY}px) rotateX(${tilt}deg) rotateZ(${lerp(-24, -14, intro)}deg) scale(${zoom * lerp(1.8, 1, intro)})`,
          boxShadow: '0 60px 120px rgba(27,71,196,.35)',
        }}
      >
        <Img src={staticFile('shots/d_strip.jpg')} style={{ width: 1080, height: STRIP_H, display: 'block' }} />
      </div>
      {/* header */}
      <div style={{ position: 'absolute', left: 70, top: 230, transform: `translateX(${(1 - intro) * -900}px) rotate(-2deg)`, opacity: 1 - back }}>
        <div style={{ background: C.cobalt, padding: '14px 34px 4px' }}>
          <Poster size={110} color={C.bone}>THE WHOLE BUILD</Poster>
        </div>
      </div>
      {/* feature tag */}
      {stop && t < N.B - 0.05 && (
        <div style={{ position: 'absolute', left: 90, top: 1250, transform: `translateX(${(1 - tagIn) * -900}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, background: C.bone, borderRadius: 99, padding: '22px 40px', boxShadow: '0 16px 40px rgba(27,71,196,.3)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.rosa }} />
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 46, color: C.cacao, whiteSpace: 'nowrap' }}>{stop.label}</div>
          </div>
        </div>
      )}
      {/* ALL OF IT. $500. */}
      {all > 0 && (
        <div style={{ position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) scale(${all})`, textAlign: 'center' }}>
          <div style={{ background: C.bone, padding: '20px 50px 6px', transform: 'rotate(-3deg)', boxShadow: '0 20px 60px rgba(27,71,196,.35)' }}>
            <Poster size={170} color={C.cobalt}>ALL OF IT.</Poster>
          </div>
          <div style={{ marginTop: 20, background: C.rosa, padding: '20px 50px 6px', display: 'inline-block', transform: 'rotate(2deg)', boxShadow: '0 20px 60px rgba(217,27,98,.35)' }}>
            <Poster size={300} color={C.bone}>$500</Poster>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
