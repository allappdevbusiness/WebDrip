import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from '../theme';
import { riff, CYCLE, DRUMS_IN } from '../timing';
import { ease, ep, kf, lerp, prog, within } from '../lib/motion';
import { Footage, Paper, Photo, Poster } from '../components/base';
import { Tile } from '../components/talavera';
import { Pill } from '../components/ui';
import { heroFileTime } from './Hook';

// 4.032 → 8.069 — riff 2, still guitar alone. Fragments only, nothing whole yet.
const N = {
  E: riff(1, 'E'),
  E2: riff(1, 'E2'),
  G: riff(1, 'G'),
  E3: riff(1, 'E3'),
  D: riff(1, 'D'),
  Cn: riff(1, 'C'),
  B: riff(1, 'B'),
};
const START = CYCLE[1];
const END = DRUMS_IN;

const MARQUEE = ['POLLO A LA BRASA', 'BIRRIA DE RES', 'TACOS AL PASTOR', 'PUPUSAS REVUELTAS', 'AREPA REINA PEPIADA', 'CEVICHE LIMEÑO', 'CHURROS'];
export const MarqueeBand: React.FC<{ x: number; h?: number; size?: number; bg?: string; fg?: string }> = ({ x, h = 110, size = 64, bg = C.cobalt, fg = C.bone }) => (
  <div style={{ height: h, background: bg, display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%' }}>
    <div style={{ display: 'flex', gap: size * 0.5, whiteSpace: 'nowrap', transform: `translateX(${x}px)` }}>
      {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
        <React.Fragment key={i}>
          <span style={{ fontFamily: F.display, fontSize: size, color: fg, letterSpacing: size * 0.02 }}>{m}</span>
          <span style={{ fontSize: size * 0.6, color: C.marigold, alignSelf: 'center' }}>✦</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

// one horizontal strip of the collage
const STRIP_H = 1920 / 6;
const strips = (t: number) => [
  <MarqueeBand key="m" x={-600 - (t - N.Cn) * 900} h={STRIP_H} size={110} />,
  <div key="tiles" style={{ display: 'flex', transform: `translateX(${-200 + (t - N.Cn) * 500}px)` }}>
    {Array.from({ length: 8 }, (_, i) => <Tile key={i} size={STRIP_H} variant={i} />)}
  </div>,
  <Photo key="pastor" src="img/pastor.jpg" w={1500} h={STRIP_H} fy={45} style={{ transform: `translateX(${-300 - (t - N.Cn) * 300}px)` }} />,
  <div key="prices" style={{ height: STRIP_H, background: C.bone, display: 'flex', alignItems: 'center', gap: 70, whiteSpace: 'nowrap', transform: `translateX(${-120 + (t - N.Cn) * 650}px)` }}>
    {['$16', '$13', '$12', '$7', '$10', '$15', '$8'].map((p, i) => (
      <span key={i} style={{ fontFamily: F.display, fontSize: 230, color: i % 2 ? C.cobalt : C.rosa, lineHeight: 1 }}>{p}</span>
    ))}
  </div>,
  <Photo key="birria" src="img/birria.jpg" w={1500} h={STRIP_H} fy={40} style={{ transform: `translateX(${-150 - (t - N.Cn) * 420}px)` }} />,
  <div key="btns" style={{ height: STRIP_H, background: C.blush, display: 'flex', alignItems: 'center', gap: 40, paddingLeft: 60, transform: `translateX(${-260 + (t - N.Cn) * 380}px)` }}>
    <Pill label="See the Menu" bg={C.cobalt} k={2.6} />
    <Pill label="Where's the Truck?" outline k={2.6} />
    <Pill label="Book Catering" bg={C.rosa} k={2.6} />
  </div>,
];

export const Tease: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  // 1. E — through the 0: full-frame Talavera footage, the site's marquee band whips across
  if (t < N.E2) {
    const push = lerp(1, 1.1, ep(t, START, N.E2, ease.outCubic));
    const bandX = lerp(500, -900, ease.outExpo(prog(t, START + 0.1, N.E2)));
    return (
      <AbsoluteFill>
        <Footage src="video/hero-3d.mp4" at={START} until={N.E2} startAt={heroFileTime(START)} zoom={push} />
        <div style={{ position: 'absolute', top: 880, left: 0, right: 0, transform: `rotate(-6deg) translateX(${bandX}px)`, opacity: t > START + 0.1 ? 1 : 0 }}>
          <MarqueeBand x={0} h={130} size={78} />
        </div>
      </AbsoluteFill>
    );
  }
  // 2. E2 — macro type: STREET
  if (t < N.G) {
    const x = lerp(260, -160, ease.outCubic(prog(t, N.E2, N.G)));
    return (
      <AbsoluteFill>
        <Paper />
        <div style={{ position: 'absolute', top: 360, left: x, whiteSpace: 'nowrap' }}>
          <Poster size={200} color={C.cobalt}>LATIN</Poster>
          <Poster size={610} color={C.cobalt} lh={0.84}>STREET</Poster>
          <Poster size={200} color={C.cobalt}>FOOD</Poster>
        </div>
      </AbsoluteFill>
    );
  }
  // 3. G — birria macro punch-in
  if (t < N.E3) {
    const z = lerp(1.35, 1.18, ease.outExpo(prog(t, N.G, N.E3)));
    return (
      <AbsoluteFill>
        <Photo src="img/birria.jpg" w={1080} h={1920} fx={42} fy={50} zoom={z} />
      </AbsoluteFill>
    );
  }
  // 4. E3 — macro type: FIRE, sliding the other way
  if (t < N.D) {
    const x = lerp(-380, 0, ease.outCubic(prog(t, N.E3, N.D)));
    return (
      <AbsoluteFill>
        <Paper color={C.blush} />
        <div style={{ position: 'absolute', top: 470, left: x, whiteSpace: 'nowrap' }}>
          <Poster size={170} color={C.rosa}>STRAIGHT OFF THE</Poster>
          <Poster size={760} color={C.rosa} lh={0.84}>FIRE</Poster>
        </div>
      </AbsoluteFill>
    );
  }
  // 5. D — pollo over live coals
  if (t < N.Cn) {
    const z = lerp(1.5, 1.32, ease.outCubic(prog(t, N.D, N.Cn)));
    return (
      <AbsoluteFill style={{ background: '#0b0806' }}>
        <Photo src="img/pollo.jpg" w={1080} h={1920} fx={38} fy={44} zoom={z} />
      </AbsoluteFill>
    );
  }
  // 6. C (long) — strip collage whips in from alternating sides
  // 7. B (long) — strips swap to slices of the real mobile hero and slide into alignment; then suck back
  const assembling = t >= N.B;
  const lock = ep(t, N.B, N.B + 0.55, ease.inOutCubic);
  const suck = kf(t, [[END - 0.32, 1], [END, 0.62, ease.inCubic]]);
  return (
    <AbsoluteFill style={{ background: C.bone }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${suck})`, borderRadius: lerp(0, 60, prog(t, END - 0.32, END)), overflow: 'hidden' }}>
        {Array.from({ length: 6 }, (_, i) => {
          const dir = i % 2 ? 1 : -1;
          const inAt = N.Cn + i * 0.035;
          const enter = ease.outExpo(prog(t, inAt, inAt + 0.22));
          let x = dir * 1100 * (1 - enter);
          if (assembling) x = dir * 160 * (1 - lock) * (i % 3 === 0 ? 1.4 : 1);
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: i * STRIP_H, width: 1080, height: STRIP_H, overflow: 'hidden', transform: `translateX(${x}px)` }}>
              {assembling ? (
                <Img src={staticFile('shots/m_hero.jpg')} style={{ position: 'absolute', left: 0, top: -i * STRIP_H - 70, width: 1080 }} />
              ) : (
                strips(t)[i]
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
