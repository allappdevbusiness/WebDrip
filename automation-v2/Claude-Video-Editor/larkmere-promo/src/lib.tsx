import React, { useEffect, useMemo, useState } from 'react';
import { AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile } from 'remotion';
import { C, FONT, W } from './timing';

// ---------- motion ----------
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const outCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const outQuart = (t: number) => 1 - Math.pow(1 - clamp(t), 4);
export const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
export const inCubic = (t: number) => Math.pow(clamp(t), 3);
export const inOut = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const sine = (t: number) => -(Math.cos(Math.PI * clamp(t)) - 1) / 2;
export type Rect = { x: number; y: number; w: number; h: number };
export const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) });

// ---------- fonts: the site's own faces, loaded locally; nothing renders until they are measured-ready ----------
const FACES = [
  { family: 'Abril Fatface', file: 'fonts/AbrilFatface-400.woff2', weight: '400' },
  { family: 'Inter', file: 'fonts/Inter-var.woff2', weight: '100 900' },
  { family: 'JetBrains Mono', file: 'fonts/JetBrainsMono-var.woff2', weight: '100 800' },
];
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(FACES.map((f) => new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, { weight: f.weight }).load()))
      .then((loaded) => { loaded.forEach((f) => document.fonts.add(f)); return document.fonts.ready; })
      .then(() => setReady(true))
      .catch((e) => { console.error(e); setReady(true); });
  }, []);
  useEffect(() => { if (ready) continueRender(handle); }, [ready, handle]);
  return ready ? <>{children}</> : null;
};

// canvas text metrics (fonts are ready when this runs)
const ctx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
export const measure = (text: string, family: string, weight = 400, size = 100, spacing = 0) => {
  if (!ctx) return { w: text.length * size * 0.6, cap: size * 0.7 };
  ctx.font = `${weight} ${size}px ${family}`;
  (ctx as any).letterSpacing = `${spacing}px`;
  const m = ctx.measureText(text);
  const cap = ctx.measureText('H').actualBoundingBoxAscent;
  return { w: m.width, cap };
};

// exact glyph box from real SVG layout (canvas metrics drift from SVG text layout for this face)
export const svgCharBox = (text: string, family: string, size: number, index: number) => {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('width', '4000'); svg.setAttribute('height', '1000');
  svg.style.position = 'absolute'; svg.style.left = '-9999px'; svg.style.top = '0';
  const tx = document.createElementNS(ns, 'text'); tx.setAttribute('x', '0'); tx.setAttribute('y', String(size));
  tx.setAttribute('font-family', family); tx.setAttribute('font-size', String(size)); tx.textContent = text;
  svg.appendChild(tx); document.body.appendChild(svg);
  const r = (tx as SVGTextContentElement).getExtentOfChar(index);
  const total = (tx as SVGTextContentElement).getComputedTextLength();
  document.body.removeChild(svg);
  return { x: r.x, w: r.width, total };
};

// ---------- justified display stack: every line set to the same width (poster type, the site's Abril Fatface) ----------
export type StackLine = { text: string; color?: string; at: number; fillImage?: string };
export type StackLayout = { x: number; width: number; lines: { text: string; size: number; base: number; cap: number; w: number }[]; top: number; bottom: number };
export function layoutStack(texts: string[], width: number, top: number, gapRatio = 0.2, maxSize = 999): StackLayout {
  let y = top;
  const lines = texts.map((t) => {
    const m = measure(t, FONT.display, 400, 100);
    const size = Math.min(maxSize, (100 * width) / m.w);
    const cap = (m.cap * size) / 100;
    const base = y + cap;
    y = base + cap * gapRatio + 10;
    return { text: t, size, base, cap, w: (m.w * size) / 100 };
  });
  return { x: 0, width, lines, top, bottom: lines[lines.length - 1].base };
}

// a line of text that rises out of a mask (the site's own .w word-reveal language)
export const MaskRise: React.FC<{ t: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number }> = ({ t, at, dur = 9, children, style, dist = 1.12 }) => {
  const p = outQuart(ramp(t, at, at + dur));
  return <div style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em', ...style }}>
    <div style={{ transform: `translateY(${(1 - p) * dist * 100}%)`, opacity: p > 0 ? 1 : 0 }}>{children}</div>
  </div>;
};

// ---------- media ----------
export const Photo: React.FC<{ src: string; t: number; dur: number; from?: number; to?: number; ox?: number; oy?: number; dx?: number; dy?: number; style?: React.CSSProperties; pos?: string }> =
  ({ src, t, dur, from = 1.08, to = 1.0, ox = 50, oy = 50, dx = 0, dy = 0, style, pos = '50% 50%' }) => {
    const p = sine(t / dur);
    const s = lerp(from, to, p);
    return <AbsoluteFill style={{ overflow: 'hidden', ...style }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
        transformOrigin: `${ox}% ${oy}%`, transform: `translate(${dx * p}px, ${dy * p}px) scale(${s})` }} />
    </AbsoluteFill>;
  };

// a recording placed so that CSS pixel (cx, cy) of the 390-wide (or 1440-wide) capture lands at (x, y) on the canvas at `scale` canvas px per CSS px
export const Rec: React.FC<{ src: string; cssW: number; cssH: number; scale: number; cx: number; cy: number; x: number; y: number; trimBefore?: number; rate?: number; style?: React.CSSProperties }> =
  ({ src, cssW, cssH, scale, cx, cy, x, y, trimBefore = 0, rate = 1, style }) => (
    <div style={{ position: 'absolute', left: x - cx * scale, top: y - cy * scale, width: cssW * scale, height: cssH * scale, ...style }}>
      <OffthreadVideo src={staticFile(src)} trimBefore={trimBefore} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );

// slim neutral phone frame (no vendor marks)
export const Phone: React.FC<{ x: number; y: number; screenW: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, screenW, children, style }) => {
  const sh = (screenW * 844) / 390, b = Math.round(screenW * 0.024), r = Math.round(screenW * 0.12);
  return <div style={{ position: 'absolute', left: x, top: y, width: screenW + 2 * b, height: sh + 2 * b, borderRadius: r + b, background: '#1E181C',
    boxShadow: '0 2px 3px rgba(34,26,32,.18), 0 50px 90px -30px rgba(80,30,50,.45)', ...style }}>
    <div style={{ position: 'absolute', left: b, top: b, width: screenW, height: sh, borderRadius: r, overflow: 'hidden', background: C.paper }}>{children}</div>
  </div>;
};
export const phoneDims = (screenW: number) => { const sh = (screenW * 844) / 390, b = Math.round(screenW * 0.024); return { w: screenW + 2 * b, h: sh + 2 * b, b, sh }; };

// the real Larkmere logo mark (copied from the site's header SVG), petals bloom with p 0..1
export const LarkMark: React.FC<{ size: number; p?: number; colors?: [string, string]; center?: string }> = ({ size, p = 1, colors = ['#F2C6D1', '#E9A5B8'], center = C.rose }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
    <g transform="translate(16 15)">
      {[0, 1, 2, 3, 4].map((k) => {
        const pk = outCubic(clamp(p * 1.6 - k * 0.15));
        return <ellipse key={k} rx={5} ry={9} fill={colors[k % 2]} transform={`rotate(${k * 72 - (1 - pk) * 40}) translate(0 ${-6 * pk}) scale(${pk})`} />;
      })}
      <circle r={3.6 * outCubic(clamp(p * 1.4 - 0.2))} fill={center} />
    </g>
  </svg>
);

export const Mono: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size = 34, color = C.rose, style, children }) => (
  <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: size, letterSpacing: '0.08em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style }}>{children}</div>
);

export const Paper: React.FC<{ color?: string }> = ({ color = C.paper }) => <AbsoluteFill style={{ background: color }} />;

// subtle paper grain so flat colour fields feel printed, not digital
export const Grain: React.FC<{ opacity?: number; seed?: number }> = ({ opacity = 0.06, seed = 3 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply', opacity }}>
    <svg width={W} height={1920}><filter id={`g${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} /><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.25  0 0 0 1.2 -0.15" /></filter>
      <rect width="100%" height="100%" filter={`url(#g${seed})`} /></svg>
  </AbsoluteFill>
);

export const useOnce = <T,>(fn: () => T, deps: any[] = []) => useMemo(fn, deps);
