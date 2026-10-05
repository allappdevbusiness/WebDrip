// Shared building blocks for the Marlowick "That Way" TikTok edit.
// Everything is driven by the current frame: no CSS animations, timers or randomness.
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile } from 'remotion';

export const W = 1080;
export const H = 1920;
// Source palette (automation-v2/websites/marlowick/app/src/index.css)
export const C = {
  ivory: '#FAF7F0',
  cobalt: '#2747D6',
  deep: '#1B32A3',
  camel: '#C08A4E',
  sky: '#E9F0FF',
  ink: '#121826',
  white: '#FFFFFF',
};
export const SANS = 'Inter, system-ui, sans-serif';
export const MONO = '"JetBrains Mono", ui-monospace, monospace';
// Working area for essential text (review guide, not a platform spec)
export const SAFE = { x0: 90, x1: 870, y0: 220, y1: 1480 };
export const TEXT_X = 96;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (f: number, a: number, b: number, ease: (t: number) => number = (t) => t) => ease(clamp01((f - a) / (b - a)));
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // sharp start, controlled settle
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.7, 0, 0.2, 1),
  soft: Easing.bezier(0.45, 0, 0.55, 1),
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = <T extends Record<string, number>>(a: T, b: T, t: number): T =>
  Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k], b[k], t)])) as T;
export const kf = (f: number, frames: number[], values: number[], ease = EASE.inOut) =>
  interpolate(f, frames, values, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// ---------- fonts: the site's own Inter (variable) and JetBrains Mono 500, cached locally ----------
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = [
      new FontFace('Inter', `url(${staticFile('fonts/inter-latin-wght.woff2')}) format('woff2')`, { weight: '100 900' }),
      new FontFace('JetBrains Mono', `url(${staticFile('fonts/jetbrains-mono-500.woff2')}) format('woff2')`, { weight: '500' }),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => { loaded.forEach((f) => (document.fonts as any).add(f)); continueRender(handle); })
      .catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
};

// ---------- captures ----------
// Each capture is a real screenshot (desktop DPR 2, mobile DPR 3). Coordinates below are CSS px.
export type Cap = { src: string; cssW: number; cssH: number };
export const CAP = {
  deskHero: { src: 'cap/desk-hero.png', cssW: 1440, cssH: 900 },
  deskHeroFull: { src: 'cap/desk-hero-p100.png', cssW: 1440, cssH: 900 },
  deskSuitsHead: { src: 'cap/desk-suits-head.png', cssW: 1440, cssH: 900 },
  deskSuitsRow1: { src: 'cap/desk-suits-row1.png', cssW: 1440, cssH: 900 },
  deskSuitsRow2: { src: 'cap/desk-suits-row2.png', cssW: 1440, cssH: 900 },
  deskHirePlans: { src: 'cap/desk-hire-plans.png', cssW: 1440, cssH: 900 },
  deskForm: { src: 'cap/desk-form.png', cssW: 1440, cssH: 900 },
  mobHero: { src: 'cap/mob-hero.png', cssW: 390, cssH: 844 },
} satisfies Record<string, Cap>;
export const recFrame = (shot: 'mob-menu' | 'mob-book' | 'mob-occasion', i: number, last: number): Cap => ({
  src: `rec/${shot}/${String(Math.max(0, Math.min(last, Math.round(i)))).padStart(5, '0')}.jpg`, cssW: 390, cssH: 844,
});

export type View = { x: number; y: number; s: number }; // css point drawn at the box's top-left, and css->canvas scale

// Draws a capture inside a canvas box, positioned by a CSS-px view. Area outside the screenshot shows `fill`.
export const Screen: React.FC<{ cap: Cap; box: { x: number; y: number; w: number; h: number }; view: View; fill?: string; radius?: number; shadow?: string; style?: React.CSSProperties; children?: React.ReactNode }> =
  ({ cap, box, view, fill = C.ivory, radius = 0, shadow, style, children }) => (
    <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', background: fill, borderRadius: radius, boxShadow: shadow, ...style }}>
      <Img src={staticFile(cap.src)} style={{ position: 'absolute', left: -view.x * view.s, top: -view.y * view.s, width: cap.cssW * view.s, height: cap.cssH * view.s, maxWidth: 'none' }} />
      {children}
    </div>
  );
// css point -> canvas point for a Screen
export const toCanvas = (box: { x: number; y: number }, view: View, p: { x: number; y: number }) => ({ x: box.x + (p.x - view.x) * view.s, y: box.y + (p.y - view.y) * view.s });

// ---------- editorial title (one focal message at a time) ----------
export const Title: React.FC<{ f: number; inAt: number; outAt?: number; lines: string[]; size?: number; color?: string; y?: number; weight?: number; accent?: number }> =
  ({ f, inAt, outAt = 1e9, lines, size = 84, color = C.ink, y = 240, weight = 800, accent }) => {
    const out = ramp(f, outAt, outAt + 10, EASE.in);
    if (f < inAt || out >= 1) return null;
    return <div style={{ position: 'absolute', left: TEXT_X, top: y, width: SAFE.x1 - TEXT_X, fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.035em', color, opacity: 1 - out, transform: `translateY(${-out * 18}px)` }}>
      {lines.map((l, i) => {
        const p = ramp(f, inAt + i * 4, inAt + i * 4 + 12, EASE.out);
        return <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <div style={{ transform: `translateY(${(1 - p) * 105}%)` }}>{l}</div>
        </div>;
      })}
      {accent !== undefined && <div style={{ marginTop: 18, height: 6, width: 120 * ramp(f, inAt + 8, inAt + 22, EASE.out), background: C.camel, borderRadius: 3 }} />}
    </div>;
  };

// small mono label (role labels, "Demo preview")
export const Chip: React.FC<{ children: React.ReactNode; x: number; y: number; bg?: string; color?: string; size?: number; opacity?: number; style?: React.CSSProperties }> =
  ({ children, x, y, bg = C.sky, color = C.deep, size = 32, opacity = 1, style }) => (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: MONO, fontWeight: 500, fontSize: size, color, background: bg, padding: `${size * 0.32}px ${size * 0.55}px`, borderRadius: size * 0.4, letterSpacing: '0.02em', opacity, whiteSpace: 'nowrap', ...style }}>{children}</div>
  );

// touch indicator: fingertip dot that travels to a real target, presses, and leaves a ring
export const Touch: React.FC<{ f: number; at: number; x: number; y: number; from?: { x: number; y: number }; leave?: number }> = ({ f, at, x, y, from, leave = 34 }) => {
  const start = at - 24;
  if (f < start || f > at + leave) return null;
  const p = ramp(f, start, at - 2, EASE.out);
  const fx = from ? lerp(from.x, x, p) : x;
  const fy = from ? lerp(from.y, y, p) : y;
  const press = 1 - 0.18 * Math.sin(Math.PI * ramp(f, at - 3, at + 7));
  const fade = 1 - ramp(f, at + leave - 10, at + leave);
  const ring = ramp(f, at, at + 22, EASE.out);
  return <>
    {f >= at && <div style={{ position: 'absolute', left: x - 40 - ring * 50, top: y - 40 - ring * 50, width: 80 + ring * 100, height: 80 + ring * 100, borderRadius: '50%', border: `5px solid ${C.camel}`, opacity: (1 - ring) * 0.95 }} />}
    <div style={{ position: 'absolute', left: fx - 36, top: fy - 36, width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', border: `4px solid ${C.cobalt}`, boxShadow: '0 10px 30px rgba(18,24,38,.28)', transform: `scale(${press})`, opacity: fade * ramp(f, start, start + 6) }} />
  </>;
};

// tailor's tape: camel band with cm ticks, used as the measuring guide
export const Tape: React.FC<{ x: number; y: number; len: number; vertical?: boolean; thick?: number; labels?: boolean; style?: React.CSSProperties }> = ({ x, y, len, vertical = false, thick = 34, labels = true, style }) => {
  const step = 12;
  const n = Math.floor(len / step);
  return <div style={{ position: 'absolute', left: x, top: y, width: vertical ? thick : len, height: vertical ? len : thick, background: '#E8C79E', boxShadow: '0 6px 18px rgba(18,24,38,.18)', overflow: 'hidden', ...style }}>
    {Array.from({ length: n }, (_, i) => {
      const major = i % 10 === 0;
      const mid = i % 5 === 0;
      const l = major ? thick * 0.62 : mid ? thick * 0.42 : thick * 0.26;
      return <React.Fragment key={i}>
        <div style={vertical
          ? { position: 'absolute', top: i * step, left: 0, height: 2, width: l, background: C.ink, opacity: 0.75 }
          : { position: 'absolute', left: i * step, top: 0, width: 2, height: l, background: C.ink, opacity: 0.75 }} />
        {labels && major && i > 0 && <div style={vertical
          ? { position: 'absolute', top: i * step - 9, left: thick * 0.64, fontFamily: MONO, fontSize: 13, color: C.ink }
          : { position: 'absolute', left: i * step + 3, top: thick * 0.5, fontFamily: MONO, fontSize: 13, color: C.ink }}>{i / 10}</div>}
      </React.Fragment>;
    })}
  </div>;
};

// lapel planes: two cobalt jacket fronts with notch lapels and camel stitching.
// t = 0 fully apart (offscreen), t = 1 closed over the frame.
export const Lapels: React.FC<{ t: number; tilt?: number }> = ({ t, tilt = 0 }) => {
  if (t <= 0) return null;
  const off = (1 - t) * 760;
  const left = 'M -420 -40 L 452 -40 L 488 330 L 440 384 L 566 990 L 566 1960 L -420 1960 Z';
  const stitchL = 'M 424 -40 L 458 326 L 412 380 L 536 980 L 536 1960';
  const plane = (d: string, stitch: string, fill: string, dx: number, rot: number, origin: string, mirror: boolean) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible', transform: `translateX(${dx}px) rotate(${rot}deg)`, transformOrigin: origin }}>
      <g transform={mirror ? `translate(${W} 0) scale(-1 1)` : undefined}>
        <path d={d} fill={fill} />
        <path d={stitch} fill="none" stroke={C.camel} strokeWidth={4} strokeDasharray="14 10" opacity={0.9} />
        <path d={d} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={2} />
      </g>
    </svg>
  );
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {plane(left, stitchL, C.cobalt, -off, -tilt, '0px 0px', false)}
    {plane(left, stitchL, C.deep, off, tilt, `${W}px 0px`, true)}
  </AbsoluteFill>;
};

// soft page-like background shared by scenes (matches the site's hero stage gradient)
export const SiteBg: React.FC<{ color?: string }> = ({ color }) => (
  <AbsoluteFill style={{ background: color ?? `radial-gradient(60% 40% at 50% 0%, #ffffff 0%, transparent 70%), linear-gradient(180deg, ${C.ivory} 0%, ${C.sky} 100%)` }} />
);

// private review overlay: working area + approximate TikTok UI zones. Never rendered in the export.
export const Guides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: SAFE.x0, top: SAFE.y0, width: SAFE.x1 - SAFE.x0, height: SAFE.y1 - SAFE.y0, outline: '3px dashed rgba(0,190,120,.95)' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 150, background: 'rgba(255,0,80,.22)' }} />
    <div style={{ position: 'absolute', left: 930, top: 880, width: 150, height: 760, background: 'rgba(255,0,80,.22)' }} />
    <div style={{ position: 'absolute', left: 0, top: 1540, width: W, height: 380, background: 'rgba(255,0,80,.22)' }} />
  </AbsoluteFill>
);
