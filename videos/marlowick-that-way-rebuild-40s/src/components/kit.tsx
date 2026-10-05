// Reusable building blocks: font loader, real UI layers, 3D stage, kinetic text, touch indicator, SFX cue.
import React, { useEffect, useState } from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, Img, Interactive, type InteractivitySchema, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from 'remotion';
import LAYERS from '../layers.json';
import ANCHORS from '../sfx-anchors.json';
import { FPS } from '../beats';
import { C, E, SANS, k } from '../theme';

// ---------- fonts: the site's own Inter (variable) + JetBrains Mono, cached locally ----------
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
export const SceneRoot: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg = C.ivory, children }) => {
  useFonts();
  return <AbsoluteFill style={{ background: bg, overflow: 'hidden', fontFamily: SANS }}>{children}</AbsoluteFill>;
};

// ---------- real UI element layers (transparent PNGs captured from the live site at DPR 3) ----------
export type LayerId = keyof typeof LAYERS;
export const layerSize = (id: LayerId, s: number) => ({ w: LAYERS[id].cssW * s, h: LAYERS[id].cssH * s });
// Draws a layer centred on (x, y) at css->px scale s. Extra transforms go in `style`.
export const UILayer: React.FC<{ id: LayerId; s: number; x: number; y: number; style?: React.CSSProperties }> = ({ id, s, x, y, style }) => {
  const { w, h } = layerSize(id, s);
  return <Img src={staticFile(`layers/${id}.png`)} style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, maxWidth: 'none', ...style }} />;
};

// full-bleed photo with cover fit and a push / drift
export const Photo: React.FC<{ src: string; iw: number; ih: number; zoom?: number; dx?: number; dy?: number; style?: React.CSSProperties }> = ({ src, iw, ih, zoom = 1, dx = 0, dy = 0, style }) => {
  const s = Math.max(1080 / iw, 1920 / ih) * zoom;
  return <Img src={staticFile(src)} style={{ position: 'absolute', left: (1080 - iw * s) / 2 + dx, top: (1920 - ih * s) / 2 + dy, width: iw * s, height: ih * s, maxWidth: 'none', ...style }} />;
};

// ---------- 3D stage: perspective + a camera transform applied to a preserve-3d world ----------
export type Cam = { x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; s?: number };
export const Stage3D: React.FC<{ cam: Cam; perspective?: number; origin?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ cam, perspective = 1600, origin = '540px 960px', children, style }) => (
  <AbsoluteFill style={{ perspective, perspectiveOrigin: origin, ...style }}>
    <AbsoluteFill style={{ transformStyle: 'preserve-3d', transformOrigin: origin,
      transform: `translate3d(${cam.x ?? 0}px, ${cam.y ?? 0}px, ${cam.z ?? 0}px) rotateX(${cam.rx ?? 0}deg) rotateY(${cam.ry ?? 0}deg) rotateZ(${cam.rz ?? 0}deg) scale(${cam.s ?? 1})` }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);
// a positioned element inside the 3D world
export const Node3D: React.FC<{ x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; s?: number; opacity?: number; children: React.ReactNode }> = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, opacity = 1, children }) => (
  <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, opacity }}>{children}</AbsoluteFill>
);

// ---------- kinetic text (editable in Studio: text, colour, size) ----------
type KineticProps = {
  readonly children: string;
  readonly color: string;
  readonly size: number;
  readonly mode: 'slam' | 'rise' | 'pop';
  readonly x?: number;
  readonly y?: number;
  readonly highlight?: string;
  readonly out?: number; // local frame to exit
  readonly style?: React.CSSProperties;
};
const KineticInner: React.FC<KineticProps> = ({ children, color, size, mode, x = 96, y = 260, highlight, out, style }) => {
  const f = useCurrentFrame();
  const inP = mode === 'rise' ? k(f, [0, 10], [0, 1], E.snap) : k(f, [0, 7], [0, 1], E.snap);
  const exitP = out === undefined ? 0 : k(f, [out, out + 7], [0, 1], E.accel);
  const scale = mode === 'slam' ? interpolate(inP, [0, 1], [1.55, 1]) : mode === 'pop' ? interpolate(inP, [0, 0.6, 1], [0.6, 1.06, 1]) : 1;
  return (
    <Interactive.Div
      style={{
        position: 'absolute', left: x, top: y, maxWidth: 870 - x, fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 0.98,
        letterSpacing: '-0.045em', color, textTransform: 'uppercase', transformOrigin: 'left center',
        opacity: Math.min(1, inP * 3) * (1 - exitP),
        translate: `${exitP * -60}px ${mode === 'rise' ? (1 - inP) * 60 : 0}px`,
        scale: String(scale * (1 + exitP * 0.15)),
        filter: exitP > 0 ? `blur(${exitP * 10}px)` : undefined,
        ...style,
      }}
    >
      {highlight ? <span style={{ background: highlight, padding: '0 0.14em', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{children}</span> : children}
    </Interactive.Div>
  );
};
const kineticSchema = {
  children: { type: 'text-content', default: '', description: 'Text' },
  color: { type: 'color', default: C.ink, description: 'Text colour' },
  size: { type: 'number', default: 120, min: 20, max: 300, step: 1, description: 'Font size', hiddenFromList: false },
} as const satisfies InteractivitySchema;
export const KineticText = Interactive.withSchema({ Component: KineticInner, componentName: '<KineticText>', schema: kineticSchema, wrapInSequence: true });

// ---------- touch indicator that lands on a real target and leaves a ring ----------
export const Touch: React.FC<{ f: number; at: number; x: number; y: number; from: { x: number; y: number }; leave?: number }> = ({ f, at, x, y, from, leave = 16 }) => {
  const st = at - 20;
  if (f < st || f > at + leave) return null;
  const p = k(f, [st, at - 1], [0, 1], E.snap);
  const press = 1 - 0.2 * Math.sin(Math.PI * k(f, [at - 3, at + 6], [0, 1], (t) => t));
  const ring = k(f, [at, at + 18], [0, 1], E.snap);
  return <>
    {f >= at && <div style={{ position: 'absolute', left: x - 40 - ring * 60, top: y - 40 - ring * 60, width: 80 + ring * 120, height: 80 + ring * 120, borderRadius: '50%', border: `6px solid ${C.camel}`, opacity: 1 - ring }} />}
    <div style={{ position: 'absolute', left: x + (from.x - x) * (1 - p) - 34, top: y + (from.y - y) * (1 - p) - 34, width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', border: `4px solid ${C.cobalt}`, boxShadow: '0 10px 30px rgba(18,24,38,.35)', scale: String(press), opacity: k(f, [st, st + 5], [0, 1]) * (1 - k(f, [at + leave - 6, at + leave], [0, 1])) }} />
  </>;
};

// ---------- SFX cue: places a licensed Epidemic effect so its transient (or peak) lands on `at` ----------
type SfxFile = keyof typeof ANCHORS;
export const SFX_TRIM = 5; // bus trim (dB) measured against the music under each hit
export const Sfx: React.FC<{ name: string; file: SfxFile; at: number; db: number; align?: 'onset' | 'peak'; maxS?: number }> = ({ name, file, at, db, align = 'onset', maxS }) => {
  const a = ANCHORS[file];
  const offset = Math.round((align === 'peak' ? a.peak_s : a.onset_s) * FPS);
  const from = at - offset;
  const dur = Math.ceil((maxS ?? a.dur) * FPS);
  const trim = Math.max(0, -from);
  return <Audio name={name} src={staticFile(`audio/sfx/${file}`)} from={Math.max(0, from)} trimBefore={trim} durationInFrames={dur - trim} volume={Math.pow(10, (db + SFX_TRIM) / 20)} premountFor={FPS} />;
};

export const WebDripMark: React.FC<{ size: number }> = ({ size }) => (
  // WebDrip mark, as used in the getwebdrip.com header (_toolkit/remotion/src/frames.tsx)
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible', flex: 'none' }}>
    <rect x="2" y="2" width="28" height="28" rx="7" fill="#dcecfa" />
    <path d="M9 2H23A7 7 0 0 1 30 9V13H28Q26.5 13 26.5 14.5V15.5A1.5 1.5 0 0 1 23.5 15.5V14.5Q23.5 13 22 13H21Q19.5 13 19.5 14.5V21A2.75 2.75 0 0 1 14 21V14.5Q14 13 12.5 13H12Q10.5 13 10.5 14.5V17A1.75 1.75 0 0 1 7 17V14.5Q7 13 5.5 13H2V9A7 7 0 0 1 9 2Z" fill="#0075de" />
    <circle cx="7" cy="7.5" r="1.3" fill="#fff" /><circle cx="10.8" cy="7.5" r="1.3" fill="#fff" /><circle cx="14.6" cy="7.5" r="1.3" fill="#fff" />
    <path d="M16.75 25C17.9 26.4 18.4 27.2 18.4 27.9A1.65 1.65 0 0 1 15.1 27.9C15.1 27.2 15.6 26.4 16.75 25Z" fill="#0075de" />
  </svg>
);
