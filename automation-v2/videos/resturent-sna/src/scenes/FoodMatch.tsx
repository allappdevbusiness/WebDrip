import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C } from '../theme';
import { riff, CYCLE } from '../timing';
import { ease, ep, kf, lerp, prog, within } from '../lib/motion';
import { Paper, Photo, Poster } from '../components/base';
import { DishCard, DISHES } from '../components/ui';

// 15.889 → 19.737 — vocals in. Food full frame on each riff note, then the last photo
// shrinks into its slot in the menu grid: food → UI match cut.
const N = {
  E: riff(4, 'E'),
  E2: riff(4, 'E2'),
  G: riff(4, 'G'),
  E3: riff(4, 'E3'),
  D: riff(4, 'D'),
  Cn: riff(4, 'C'),
  B: riff(4, 'B'),
};
const START = CYCLE[4];
const END = CYCLE[5];

const SHOTS: { id: keyof typeof DISHES; at: number; fx: number; fy: number }[] = [
  { id: 'pastor', at: N.E, fx: 40, fy: 50 },
  { id: 'elote', at: N.E2, fx: 55, fy: 50 },
  { id: 'ceviche', at: N.G, fx: 72, fy: 45 },
  { id: 'pupusas', at: N.E3, fx: 45, fy: 50 },
  { id: 'churros', at: N.D, fx: 42, fy: 55 },
];
const GRID: (keyof typeof DISHES)[] = ['pollo', 'birria', 'pastor', 'ceviche', 'churros', 'pupusas', 'elote', 'cubano', 'empanadas'];
const CW = 320, GAP = 20, GX = 40, GY = 640;
const K = CW / 360;
const CH = 300 * K + 2; // compact card height (approx)
const slot = (i: number) => ({ x: GX + (i % 3) * (CW + GAP), y: GY + Math.floor(i / 3) * (CH + GAP) });
const HERO_SLOT = 4; // churros
const IMG = { w: CW - 4 * K, h: 208 * K };

const Tag: React.FC<{ id: keyof typeof DISHES; t: number; at: number }> = ({ id, t, at }) => {
  const d = DISHES[id];
  const x = lerp(-700, 0, ease.outExpo(prog(t, at, at + 0.18)));
  return (
    <div style={{ position: 'absolute', left: 70, top: 1170, transform: `translateX(${x}px) rotate(-2deg)` }}>
      <div style={{ background: C.bone, padding: '14px 30px 4px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,.25)' }}>
        <Poster size={88} color={C.cobalt}>{d.name}</Poster>
      </div>
      <div style={{ marginTop: 10, background: C.rosa, padding: '12px 30px 2px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,.25)', transform: 'rotate(3deg)' }}>
        <Poster size={150} color={C.bone}>{d.price}</Poster>
      </div>
    </div>
  );
};

export const FoodMatch: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  if (t < N.Cn) {
    const cur = [...SHOTS].reverse().find((s) => t >= s.at)!;
    const z = lerp(1.22, 1.08, ease.outCubic(prog(t, cur.at, cur.at + 0.45)));
    return (
      <AbsoluteFill>
        <Photo src={DISHES[cur.id].img} w={1080} h={1920} fx={cur.fx} fy={cur.fy} zoom={z} />
        <Tag id={cur.id} t={t} at={cur.at} />
      </AbsoluteFill>
    );
  }

  // match cut: the churros photo flies from full frame into its card image box
  const m = ep(t, N.Cn - 0.02, N.Cn + 0.5, ease.inOutCubic);
  const hs = slot(HERO_SLOT);
  const cx = hs.x + CW / 2, cy = hs.y + 2 * K + IMG.h / 2;
  // zoom so the card image covers the frame, then exponentially back to 1 (photo + grid share the transform)
  const gz = Math.pow(1920 / IMG.h, 1 - m);
  const box = {
    w: IMG.w * gz,
    h: IMG.h * gz,
    x: cx + (hs.x + 2 * K - cx) * gz,
    y: cy + (hs.y + 2 * K - cy) * gz,
  };
  const gridOpacity = ep(t, N.Cn + 0.02, N.Cn + 0.2);
  const tiltX = kf(t, [[N.B - 0.05, 0], [N.B + 0.35, 18, ease.outCubic]]);
  const tiltZ = kf(t, [[N.B - 0.05, 0], [N.B + 0.35, -6, ease.outCubic]]);
  const drift = kf(t, [[N.B - 0.05, 1], [END, 0.9, ease.linear]]);
  const head = ep(t, N.Cn + 0.25, N.Cn + 0.5, ease.outExpo);

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <Paper />
      <div style={{ position: 'absolute', inset: 0, transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) scale(${drift})`, transformOrigin: '50% 55%' }}>
        <div style={{ position: 'absolute', left: 0, top: 230, width: 1080, textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * -60}px)` }}>
          <Poster size={44} color={C.rosa} font="body" weight={600} style={{ letterSpacing: 14 }}>EL MENÚ</Poster>
          <Poster size={150} color={C.cobalt} style={{ marginTop: 18 }}>EVERYTHING'S</Poster>
          <Poster size={150} color={C.rosa}>MADE TO ORDER</Poster>
        </div>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${gz})`, opacity: gridOpacity }}>
          {GRID.map((id, i) => {
            const s = slot(i);
            return (
              <div key={id} style={{ position: 'absolute', left: s.x, top: s.y }}>
                <DishCard dish={DISHES[id]} w={CW} compact img={i === HERO_SLOT ? <div /> : undefined} />
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', borderRadius: lerp(0, 14 * K, m) }}>
          <Img src={staticFile(DISHES.churros.img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '42% 55%' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
