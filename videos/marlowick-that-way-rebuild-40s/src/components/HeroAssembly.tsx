// The Marlowick hero, rebuilt from its real UI elements for a portrait frame.
// `assemble` 0 -> 1 flies every piece in from depth; `explode` 0 -> 1 separates them along Z;
// `tags` controls each price tag's pop (0..1). Used by the hook (pieces converge on the drop),
// the explode scene and as the end-state the camera pushes through.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { C } from '../theme';
import { Node3D, UILayer } from './kit';

export type Piece = { id: string; x: number; y: number; dz: number; rx?: number; ry?: number; from: { x: number; y: number; z: number } };
// final portrait positions (centres) and how far each piece travels in Z when the layout explodes
export const PIECES = {
  logo: { x: 540, y: 330, s: 2.0, dz: -320, from: { x: -600, y: -500, z: 900 } },
  kicker: { x: 540, y: 470, s: 1.25, dz: 260, from: { x: 700, y: -300, z: 1100 } },
  heroLine1: { x: 540, y: 640, s: 1.9, dz: 520, from: { x: -900, y: 0, z: 1000 } },
  heroLine2: { x: 540, y: 790, s: 1.9, dz: 160, from: { x: 0, y: 0, z: 0 } },
  lead: { x: 540, y: 960, s: 1.4, dz: -180, from: { x: 800, y: 300, z: 900 } },
  btnBook: { x: 355, y: 1120, s: 1.8, dz: 720, from: { x: -700, y: 700, z: 1200 } },
  btnSuits: { x: 725, y: 1120, s: 1.8, dz: 620, from: { x: 800, y: 700, z: 1200 } },
} as const;
export const PHOTO = { x: 540, y: 1520, w: 940, h: 560, dz: -700 };
export const TAGS = {
  tagA: { x: 300, y: 1330, s: 1.5, dz: 950 },
  tagB: { x: 760, y: 1460, s: 1.5, dz: 480 },
  tagC: { x: 420, y: 1650, s: 1.5, dz: 1150 },
} as const;

export const HeroAssembly: React.FC<{ assemble: number; explode: number; tags: [number, number, number]; camZ?: number; skipLine2?: boolean }> = ({ assemble, explode, tags, camZ = 0, skipLine2 }) => {
  const a = assemble;
  // fade anything the camera dollies through (z beyond ~1100 px towards the viewer)
  const depthFade = (z: number) => Math.max(0, Math.min(1, (1250 - (z + camZ)) / 300));
  return <>
    <Node3D z={PHOTO.dz * explode + (1 - a) * -1600} opacity={Math.min(1, a * 2) * depthFade(PHOTO.dz * explode)}>
      <div style={{ position: 'absolute', left: PHOTO.x - PHOTO.w / 2, top: PHOTO.y - PHOTO.h / 2, width: PHOTO.w, height: PHOTO.h, borderRadius: 26, overflow: 'hidden', boxShadow: '0 50px 100px -40px rgba(27,50,163,.55)', background: C.sky }}>
        <Img src={staticFile('img/hero.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%', maxWidth: 'none' }} />
      </div>
    </Node3D>
    {(Object.keys(PIECES) as (keyof typeof PIECES)[]).map((id) => {
      if (skipLine2 && id === 'heroLine2') return null;
      const p = PIECES[id];
      const z = p.dz * explode + p.from.z * (1 - a);
      return <Node3D key={id} x={p.from.x * (1 - a)} y={p.from.y * (1 - a)} z={z} rx={(1 - a) * 25} opacity={(id === 'heroLine2' ? 1 : Math.min(1, a * 1.6)) * depthFade(z)}>
        <UILayer id={id} s={p.s} x={p.x} y={p.y} />
      </Node3D>;
    })}
    {(Object.keys(TAGS) as (keyof typeof TAGS)[]).map((id, i) => {
      const t = TAGS[id];
      const pop = tags[i];
      if (pop <= 0) return null;
      const sc = pop < 0.6 ? 0.5 + pop / 0.6 * 0.6 : 1.1 - (pop - 0.6) / 0.4 * 0.1;
      const z = t.dz * explode;
      return <Node3D key={id} z={z} opacity={depthFade(z)}>
        <UILayer id={id} s={t.s * sc} x={t.x} y={t.y} />
      </Node3D>;
    })}
  </>;
};
