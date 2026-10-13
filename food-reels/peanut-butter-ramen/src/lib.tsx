import React from 'react';
import {
  CanvasImage,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {noise2D} from '@remotion/noise';

export const W = 1080;
export const H = 1920;
// Higgsfield stills are 1536x2752; drawn edge to edge at canvas width
export const IMG_H = Math.round((W * 2752) / 1536);

export const GOLD = '#FFC447';
export const INK = '#120C08';

export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- fonts (local woff2, no network at render time) ----------
let fontsLoaded = false;
export const useFonts = () => {
  const [handle] = React.useState(() => (fontsLoaded ? null : delayRender('fonts')));
  React.useEffect(() => {
    if (handle === null) return;
    const faces = [
      new FontFace('Anton', `url(${staticFile('fonts/anton.woff2')})`),
      new FontFace('Montserrat', `url(${staticFile('fonts/montserrat-800.woff2')})`, {weight: '800'}),
      new FontFace('Montserrat', `url(${staticFile('fonts/montserrat-600.woff2')})`, {weight: '600'}),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => {
        loaded.forEach((f) => document.fonts.add(f));
        fontsLoaded = true;
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
};

// ---------- camera on a still ----------
// x/y: normalised image point at screen centre, s: zoom (1 = image fills width)
export type Key = {t: number; x: number; y: number; s: number; r?: number};

const camAt = (keys: Key[], sec: number) => {
  if (sec <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (sec <= b.t) {
      const p = ease((sec - a.t) / (b.t - a.t));
      return {
        t: sec,
        x: a.x + (b.x - a.x) * p,
        y: a.y + (b.y - a.y) * p,
        // zoom interpolates perceptually (log space) so pushes feel linear
        s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * p),
        r: (a.r ?? 0) + ((b.r ?? 0) - (a.r ?? 0)) * p,
      };
    }
  }
  return keys[keys.length - 1];
};

export const Photo: React.FC<{
  src: string;
  keys: Key[];
  shake?: {at: number; px: number; dur: number};
  style?: React.CSSProperties;
  filter?: string;
}> = ({src, keys, shake, style, filter}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const c = camAt(keys, sec);
  const s = Math.max(1.0, c.s);
  // keep the image covering the canvas
  const hx = 0.5 / s;
  const hy = (H / IMG_H) * 0.5 / s;
  const x = Math.min(1 - hx, Math.max(hx, c.x));
  const y = Math.min(1 - hy, Math.max(hy, c.y));
  let sx = 0;
  let sy = 0;
  if (shake && sec >= shake.at && sec < shake.at + shake.dur) {
    const k = 1 - (sec - shake.at) / shake.dur;
    sx = noise2D('sx', frame * 0.9, 0) * shake.px * k;
    sy = noise2D('sy', frame * 0.9, 0) * shake.px * k;
  }
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>
      <CanvasImage
        src={src}
        width={W}
        height={IMG_H}
        fit="cover"
        style={{
          position: 'absolute',
          left: 0,
          top: (H - IMG_H) / 2,
          translate: `${(0.5 - x) * W * s + sx}px ${(0.5 - y) * IMG_H * s + sy}px`,
          scale: `${s}`,
          rotate: `${c.r ?? 0}deg`,
          filter,
        }}
      />
    </div>
  );
};

// ---------- procedural steam ----------
export const Steam: React.FC<{
  x: number; // origin, screen px
  y: number;
  spread?: number;
  rise?: number;
  count?: number;
  opacity?: number;
  size?: number;
  seed?: string;
}> = ({x, y, spread = 220, rise = 700, count = 9, opacity = 0.3, size = 360, seed = 's'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const blobs = [];
  for (let i = 0; i < count; i++) {
    const life = 3.2 + (i % 3) * 0.6;
    const phase = (t / life + i / count) % 1;
    const nx = noise2D(seed + i, t * 0.25, i) * spread;
    const bx = x + (i / (count - 1) - 0.5) * spread * 0.8 + nx;
    const by = y - phase * rise;
    const sz = size * (0.6 + phase * 0.9);
    const a = Math.sin(phase * Math.PI) * opacity;
    blobs.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: bx - sz / 2,
          top: by - sz / 2,
          width: sz,
          height: sz,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,246,235,0.85) 0%, rgba(255,246,235,0.25) 40%, rgba(255,246,235,0) 70%)',
          opacity: a,
          filter: 'blur(28px)',
        }}
      />,
    );
  }
  return <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none'}}>{blobs}</div>;
};

// ---------- grade: vignette + legibility gradients ----------
export const Grade: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1180,
        bottom: 0,
        background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.65))',
      }}
    />
  </>
);

// ---------- text helpers ----------
export const heroText: React.CSSProperties = {
  fontFamily: 'Anton',
  color: 'white',
  textTransform: 'uppercase',
  letterSpacing: 1,
  lineHeight: 0.95,
  textAlign: 'center',
  textShadow: '0 6px 0 rgba(0,0,0,0.35), 0 10px 40px rgba(0,0,0,0.6)',
};

export const pill: React.CSSProperties = {
  fontFamily: 'Montserrat',
  fontWeight: 800,
  fontSize: 44,
  color: INK,
  background: 'rgba(255,248,236,0.96)',
  borderRadius: 999,
  padding: '18px 34px',
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
  whiteSpace: 'nowrap',
};

// ---------- hard cuts between camera setups on stills ----------
export type Cut = {from: number; to: number; src: string; keys: Key[]; punch?: boolean};
export const Cuts: React.FC<{cuts: Cut[]; style?: (c: Cut, t: number) => React.CSSProperties; filter?: (c: Cut, t: number) => string}> = ({
  cuts,
  style,
  filter,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const c = cuts.find((x) => t >= x.from && t < x.to) ?? cuts[cuts.length - 1];
  const lt = t - c.from;
  // keys are local to the cut; a punch adds a short scale settle
  const keys = c.punch === false ? c.keys : [{...c.keys[0], t: 0, s: c.keys[0].s * 1.07}, ...c.keys.map((k) => ({...k, t: k.t + 0.16}))];
  return (
    <SequenceShift t={lt}>
      <Photo src={c.src} keys={keys} style={style?.(c, lt)} filter={filter?.(c, lt)} />
    </SequenceShift>
  );
};
// re-times children so useCurrentFrame() starts at the cut
import {Freeze} from 'remotion';
const SequenceShift: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => {
  const {fps} = useVideoConfig();
  return <Freeze frame={Math.max(0, Math.round(t * fps))}>{children}</Freeze>;
};
