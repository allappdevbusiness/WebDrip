import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C } from '../theme';
import { riff, CYCLE } from '../timing';
import { ease, ep, kf, lerp, prog, within } from '../lib/motion';
import { Footage, Paper, Poster } from '../components/base';

// 19.737 → 23.551 — the site's "El Arte del Taco" chapter, rebuilt in vertical slices.
const N = {
  E: riff(5, 'E'),
  E2: riff(5, 'E2'),
  G: riff(5, 'G'),
  E3: riff(5, 'E3'),
  D: riff(5, 'D'),
  Cn: riff(5, 'C'),
  B: riff(5, 'B'),
};
const START = CYCLE[5];
const END = CYCLE[6];

const STEPS = [
  { at: N.E, num: '01', a: 'IT STARTS', b: 'WITH THE MASA.', color: C.rosa, img: 'img/pupusas.jpg', fy: 50 },
  { at: N.G, num: '02', a: 'THEN COMES', b: 'THE FIRE.', color: C.tomate, img: 'img/pollo.jpg', fy: 45 },
  { at: N.Cn, num: '03', a: 'AND NEVER', b: 'FROM A JAR.', color: C.jade, img: 'img/hero.jpg', fy: 40 },
];
const SL = { y: 800, h: 680, w: 300, gap: 20, x0: 60 };

export const TacoChapter: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;
  const si = STEPS.filter((s) => t >= s.at).length - 1;
  const step = STEPS[si];
  const k = ep(t, step.at, step.at + 0.22, ease.outExpo);

  // B: slices open into the full-frame lime squeeze
  const open = ep(t, N.B - 0.04, N.B + 0.45, ease.inOutCubic);
  const textOut = ep(t, N.B - 0.04, N.B + 0.2, ease.inCubic);
  const push = kf(t, [[N.B + 0.45, 1], [END, 1.12, ease.inCubic]]);

  const sliceRect = (i: number) => {
    const x = lerp(SL.x0 + i * (SL.w + SL.gap), i * 360, open);
    const w = lerp(SL.w, 360, open);
    const y = lerp(SL.y, 0, open);
    const h = lerp(SL.h, 1920, open);
    return { x, y, w, h };
  };

  return (
    <AbsoluteFill>
      <Paper color={C.blush} />
      {/* title block */}
      <div style={{ position: 'absolute', left: 80, top: 210, opacity: 1 - textOut, transform: `translateY(${-textOut * 120}px)` }}>
        <Poster size={260} color={step.color} style={{ opacity: 0.22, transform: `scale(${lerp(1.6, 1, k)})`, transformOrigin: '0% 50%' }}>{step.num}</Poster>
        <div style={{ marginTop: -70, transform: `translateX(${(1 - k) * -700}px)` }}>
          <Poster size={128} color={C.cobalt}>{step.a}</Poster>
        </div>
        <div style={{ transform: `translateX(${(1 - k) * 900}px)` }}>
          <Poster size={128} color={step.color}>{step.b}</Poster>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 34, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ height: 8, width: i === si ? 96 : 56, borderRadius: 8, background: i === si ? C.rosa : 'rgba(63,42,31,.2)' }} />
          ))}
        </div>
      </div>
      {/* vertical slices */}
      {[0, 1, 2].map((i) => {
        const r = sliceRect(i);
        const drop = ep(t, step.at + i * 0.05, step.at + i * 0.05 + 0.24, ease.outExpo);
        const yOff = (1 - drop) * (i % 2 ? 700 : -700);
        const offset = (i - 1) * 140 * (1 - open) * (t >= N.B ? 1 : 0);
        const lime = t >= N.B - 0.04;
        return (
          <div key={i} style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', borderRadius: lerp(18, 0, open) }}>
            <div style={{ position: 'absolute', left: -r.x, top: -r.y + (lime ? offset : yOff), width: 1080, height: 1920, transform: `scale(${push})` }}>
              {lime ? (
                <Footage src="video/taco-3d.mp4" at={N.B - 0.04} until={END} startAt={0.3} fx={55} fy={50} />
              ) : (
                <div style={{ position: 'absolute', left: SL.x0, top: SL.y, width: 3 * SL.w + 2 * SL.gap, height: SL.h }}>
                  <Img src={staticFile(step.img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${step.fy}%` }} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
