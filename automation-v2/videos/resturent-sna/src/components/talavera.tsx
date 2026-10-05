import React from 'react';
import { C } from '../theme';

// Procedural Talavera tile in the site's palette (the site lifts its palette from the hero tiles).
const PALETTES = [
  { ground: C.bone, ring: C.cobalt, petal: C.cobalt, core: C.marigold, corner: C.rosa, leaf: C.jade },
  { ground: C.bone, ring: C.rosa, petal: C.marigold, core: C.cobalt, corner: C.cobalt, leaf: C.jade },
  { ground: C.cobalt, ring: C.marigold, petal: C.bone, core: C.rosa, corner: C.marigold, leaf: C.bone },
  { ground: C.marigold, ring: C.cobalt, petal: C.rosa, core: C.bone, corner: C.cobalt, leaf: C.jade },
];

export const Tile: React.FC<{ size: number; variant?: number; style?: React.CSSProperties }> = ({ size, variant = 0, style }) => {
  const p = PALETTES[((variant % PALETTES.length) + PALETTES.length) % PALETTES.length];
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: 'block', flexShrink: 0, ...style }}>
      <rect width="200" height="200" fill={p.ground} />
      {[0, 90, 180, 270].map((r) => (
        <g key={r} transform={`rotate(${r} 100 100)`}>
          <path d="M0 0 H46 A46 46 0 0 1 0 46 Z" fill={p.corner} />
          <path d="M0 0 H26 A26 26 0 0 1 0 26 Z" fill={p.ground} />
          <path d="M100 6 C112 22 112 30 100 40 C88 30 88 22 100 6 Z" fill={p.leaf} />
        </g>
      ))}
      <circle cx="100" cy="100" r="62" fill="none" stroke={p.ring} strokeWidth="7" />
      {petals.map((r) => (
        <ellipse key={r} cx="100" cy="64" rx="13" ry="26" fill={p.petal} transform={`rotate(${r} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="20" fill={p.core} />
      <circle cx="100" cy="100" r="8" fill={p.ring} />
    </svg>
  );
};

// a grid of tiles; `tile(i, col, row)` can return a per-tile transform for explosions/assembly
export const TileGrid: React.FC<{
  cols: number;
  rows: number;
  size: number;
  gap?: number;
  x?: number;
  y?: number;
  tile?: (i: number, c: number, r: number) => React.CSSProperties | null;
}> = ({ cols, rows, size, gap = 0, x = 0, y = 0, tile }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: cols * (size + gap), height: rows * (size + gap) }}>
    {Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const st = tile ? tile(i, c, r) : {};
      if (st === null) return null;
      return (
        <div key={i} style={{ position: 'absolute', left: c * (size + gap), top: r * (size + gap), width: size, height: size, ...st }}>
          <Tile size={size} variant={(c + r * 3) % 4} />
        </div>
      );
    })}
  </div>
);
