// 27.526-31.029  The fastest part of the edit: hard cuts on every half beat through the best details of
// the site (wide photos, macro type, real buttons and cards), tightening to quarter beats for the last
// fill, then a hard stop where the drums drop out at 31.03 s.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { beat, SCENES } from '../beats';
import { C } from '../theme';
import { LayerId, Photo, SceneRoot, UILayer } from '../components/kit';

const S = SCENES.montage.from;
type Clip = { kind: 'layer'; id: LayerId; s: number; bg: string; dy?: number } | { kind: 'photo'; src: string; iw: number; ih: number };
const CLIPS: Clip[] = [
  { kind: 'layer', id: 'heroLine1', s: 4.2, bg: C.ivory },
  { kind: 'photo', src: 'img/navy.jpg', iw: 1080, ih: 608 },
  { kind: 'layer', id: 'btnBook', s: 4.6, bg: C.sky },
  { kind: 'photo', src: 'img/hero.jpg', iw: 2400, ih: 1600 },
  { kind: 'layer', id: 'tagB', s: 3.2, bg: C.ivory },
  { kind: 'photo', src: 'img/grey.jpg', iw: 1080, ih: 717 },
  { kind: 'layer', id: 'stat1', s: 2.9, bg: C.ivory },
  { kind: 'photo', src: 'img/dinner.jpg', iw: 1080, ih: 720 },
  { kind: 'layer', id: 'suitsTitle', s: 1.55, bg: C.ivory },
  { kind: 'photo', src: 'img/check.jpg', iw: 1080, ih: 781 },
  { kind: 'layer', id: 'visitTitle', s: 1.65, bg: C.ivory },
  { kind: 'photo', src: 'img/tie.jpg', iw: 1080, ih: 720 },
  { kind: 'layer', id: 'logo', s: 6.5, bg: C.white },
  // quarter-beat run
  { kind: 'photo', src: 'img/shirt.jpg', iw: 1080, ih: 720 },
  { kind: 'layer', id: 'plan1', s: 2.6, bg: C.white, dy: 260 },
  { kind: 'photo', src: 'img/groom.jpg', iw: 1080, ih: 720 },
  { kind: 'layer', id: 'heroLine2', s: 3.8, bg: C.ivory },
  { kind: 'photo', src: 'img/spot.jpg', iw: 1080, ih: 720 },
  { kind: 'photo', src: 'img/p2.jpg', iw: 1080, ih: 720 }, // held as the freeze frame in the break
];
// cut points: half beats from 248 to 254, then quarter beats to the stop
const CUTS = [...Array.from({ length: 13 }, (_, i) => beat(248 + i * 0.5)), ...Array.from({ length: 6 }, (_, i) => beat(254.5 + i * 0.25))];

export const Montage: React.FC = () => {
  const f = useCurrentFrame() + S;
  let i = 0;
  for (let j = 0; j < CUTS.length; j++) if (f >= CUTS[j]) i = j;
  const c = CLIPS[i];
  const t = f - CUTS[i];
  const len = (CUTS[i + 1] ?? SCENES.montage.to) - CUTS[i];
  const p = t / len;
  const dir = i % 2 ? -1 : 1;
  const punch = 1 + 0.07 * Math.max(0, 1 - t / 4); // 4-frame scale impact on every cut
  const zoom = (1 + 0.1 * p) * punch;
  const rot = dir * (0.8 - 1.6 * p);
  return (
    <SceneRoot bg={c.kind === 'layer' ? c.bg : C.ink}>
      <AbsoluteFill style={{ rotate: `${rot}deg`, scale: String(zoom) }}>
        {c.kind === 'photo'
          ? <Photo src={c.src} iw={c.iw} ih={c.ih} dx={dir * 40 * (p - 0.5)} />
          : <UILayer id={c.id} s={c.s} x={540 + dir * 30 * (p - 0.5)} y={960 + (c.dy ?? 0)} />}
      </AbsoluteFill>
    </SceneRoot>
  );
};
