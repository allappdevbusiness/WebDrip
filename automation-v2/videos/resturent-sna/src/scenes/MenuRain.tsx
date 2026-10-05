import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../theme';
import { riff, CYCLE, VOCALS_IN } from '../timing';
import { ease, ep, kf, lerp, prog, rand, within } from '../lib/motion';
import { Paper, Poster } from '../components/base';
import { DishCard, DISHES } from '../components/ui';

// 12.005 → 15.889 — the menu breaks out of the site: cards drop onto a table, one per riff note.
const N = {
  E: riff(3, 'E'),
  E2: riff(3, 'E2'),
  G: riff(3, 'G'),
  E3: riff(3, 'E3'),
  D: riff(3, 'D'),
  Cn: riff(3, 'C'),
  B: riff(3, 'B'),
};
const START = CYCLE[3];
const END = CYCLE[4];

const CW = 330; // card width on the table
// slot positions on a 3-col table (table-space px), landing time, settle rotation
const CARDS: { id: keyof typeof DISHES; x: number; y: number; at: number; r: number }[] = [
  { id: 'pollo', x: 40, y: 380, at: N.E, r: -4 },
  { id: 'birria', x: 375, y: 320, at: N.E2, r: 3 },
  { id: 'pastor', x: 710, y: 400, at: N.G, r: -2 },
  { id: 'ceviche', x: 60, y: 900, at: N.E3, r: 2 },
  { id: 'pupusas', x: 395, y: 860, at: N.D, r: -3 },
  { id: 'elote', x: 720, y: 920, at: N.Cn, r: 4 },
  { id: 'churros', x: 40, y: 1420, at: N.Cn + 0.08, r: -2 },
  { id: 'cubano', x: 380, y: 1380, at: N.Cn + 0.16, r: 2 },
  { id: 'empanadas', x: 715, y: 1440, at: N.Cn + 0.24, r: -3 },
];

export const MenuRain: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  // macro on the birria price after B, whip out on the vocal pickup
  if (t >= N.B) {
    const z = lerp(1.25, 1, ease.outExpo(prog(t, N.B, N.B + 0.3)));
    const whip = ep(t, VOCALS_IN - 0.06, END, ease.inExpo);
    return (
      <AbsoluteFill style={{ background: C.paper }}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-whip * 1300}px) scale(${z})`, display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center', marginTop: -80 }}>
            <Poster size={170} color={C.cobalt} style={{ letterSpacing: 4 }}>BIRRIA DE RES</Poster>
            <Poster size={760} color={C.rosa} lh={0.95}>$13</Poster>
            <Poster size={58} color={C.clay} font="body" weight={600} style={{ letterSpacing: 9 }}>MOST ORDERED</Poster>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // table camera: oblique → top-down push on C
  const tilt = kf(t, [[N.Cn - 0.05, 26], [N.B - 0.1, 0, ease.inOutCubic]]);
  const zoom = kf(t, [[START, 1.0], [N.Cn - 0.05, 1.04], [N.B - 0.1, 1.9, ease.inOutCubic]]);
  const camY = kf(t, [[N.Cn - 0.05, 0], [N.B - 0.1, 160, ease.inOutCubic]]);
  const camX = kf(t, [[N.Cn - 0.05, 0], [N.B - 0.1, -90, ease.inOutCubic]]);

  return (
    <AbsoluteFill style={{ perspective: 1500 }}>
      <Paper color={C.shell} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 180,
          width: 1080,
          height: 1700,
          transformOrigin: '50% 40%',
          transform: `translate(${camX}px, ${camY}px) scale(${zoom}) rotateX(${tilt}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {CARDS.map((c, i) => {
          if (t < c.at - 0.14) return null;
          const k = ease.inQuart(prog(t, c.at - 0.14, c.at)); // falls in, lands exactly on the note
          const bounce = t > c.at ? 0.025 * Math.exp(-(t - c.at) * 16) * Math.cos((t - c.at) * 38) : 0;
          const z = lerp(600, 0, k);
          const r = lerp(c.r + (rand(i) - 0.5) * 40, c.r, k);
          return (
            <div key={c.id} style={{ position: 'absolute', left: c.x, top: c.y, transform: `translateZ(${z}px) rotate(${r}deg) scale(${1 + bounce})` }}>
              <DishCard dish={DISHES[c.id]} w={CW} compact />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
