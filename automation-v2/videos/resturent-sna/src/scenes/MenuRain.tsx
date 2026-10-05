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

  // camera lands on each card as it drops (close), then pulls out to the whole table on C (wide)
  const focus = (id: string) => {
    const c = CARDS.find((x) => x.id === id)!;
    return { x: c.x + CW / 2, y: c.y + 150 };
  };
  const path: [number, { x: number; y: number }, number][] = [
    [N.E, focus('pollo'), 1.75],
    [N.E2, focus('birria'), 1.75],
    [N.G, focus('pastor'), 1.75],
    [N.E3, focus('ceviche'), 1.7],
    [N.D, focus('pupusas'), 1.7],
    [N.Cn + 0.3, { x: 540, y: 1020 }, 0.98],
  ];
  const key = (sel: (p: (typeof path)[number]) => number): [number, number, (x: number) => number][] => {
    const k: [number, number, (x: number) => number][] = [[START, sel(path[0]), ease.linear]];
    path.forEach((p, i) => {
      if (i === 0) return;
      const move = i === path.length - 1 ? 0.3 : 0.16;
      k.push([p[0] - move, sel(path[i - 1]), ease.linear]);
      k.push([p[0], sel(p), ease.inOutCubic]);
    });
    return k;
  };
  const fx = kf(t, key((p) => p[1].x));
  const fy = kf(t, key((p) => p[1].y));
  const zoom = kf(t, key((p) => p[2])) * kf(t, [[N.Cn + 0.3, 1], [N.B, 1.06, ease.linear]]);
  const tilt = kf(t, [[N.Cn, 24], [N.Cn + 0.3, 16, ease.inOutCubic]]);

  return (
    <AbsoluteFill style={{ perspective: 1500 }}>
      <Paper color={C.shell} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1080,
          height: 1900,
          transformOrigin: '0 0',
          transform: `translate(${540 - fx * zoom}px, ${960 - fy * zoom}px) scale(${zoom}) rotateX(${tilt}deg)`,
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
