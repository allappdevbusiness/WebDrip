import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, continueRender, delayRender } from 'remotion';
import { C, F } from '../theme';
import { FPS, frames } from '../timing';

// ---------- fonts ----------
const FONT_CSS = `
@font-face { font-family: 'Anton'; src: url('${staticFile('fonts/Anton-400.woff2')}') format('woff2'); font-weight: 400; }
@font-face { font-family: 'Inter'; src: url('${staticFile('fonts/Inter-400.woff2')}') format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Caveat'; src: url('${staticFile('fonts/Caveat-600.woff2')}') format('woff2'); font-weight: 600; }
`;
let fontHandle: number | null = null;
export const Fonts: React.FC = () => {
  if (fontHandle === null && typeof document !== 'undefined') {
    fontHandle = delayRender('fonts');
    const h = fontHandle;
    Promise.all([
      document.fonts.load("100px 'Anton'"),
      document.fonts.load("600 40px 'Inter'"),
      document.fonts.load("600 40px 'Caveat'"),
    ]).then(() => continueRender(h));
  }
  return <style>{FONT_CSS}</style>;
};

// ---------- typography ----------
type PosterProps = {
  children: React.ReactNode;
  size: number;
  color?: string;
  lh?: number;
  ls?: number;
  style?: React.CSSProperties;
  stroke?: string;
  font?: 'display' | 'body' | 'hand';
  weight?: number;
};
export const Poster: React.FC<PosterProps> = ({ children, size, color = C.cobalt, lh = 0.88, ls = 0, style, stroke, font = 'display', weight }) => (
  <div
    style={{
      fontFamily: F[font],
      fontSize: size,
      lineHeight: lh,
      letterSpacing: ls,
      color: stroke ? 'transparent' : color,
      WebkitTextStroke: stroke ? `${Math.max(2, size / 60)}px ${stroke}` : undefined,
      whiteSpace: 'pre',
      fontWeight: weight,
      ...style,
    }}
  >
    {children}
  </div>
);

// Text filled with a photo (background-clip)
export const ImageText: React.FC<{ src: string; size: number; children: React.ReactNode; bgSize?: string; bgPos?: string; style?: React.CSSProperties; lh?: number }> = ({ src, size, children, bgSize = 'cover', bgPos = 'center', style, lh = 0.86 }) => (
  <div
    style={{
      fontFamily: F.display,
      fontSize: size,
      lineHeight: lh,
      whiteSpace: 'pre',
      backgroundImage: `url(${staticFile(src)})`,
      backgroundSize: bgSize,
      backgroundPosition: bgPos,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------- media ----------
// cover-cropped photo with a focus point and zoom (Ken Burns friendly)
export const Photo: React.FC<{ src: string; w: number; h: number; fx?: number; fy?: number; zoom?: number; style?: React.CSSProperties; radius?: number }> = ({ src, w, h, fx = 50, fy = 50, zoom = 1, style, radius = 0 }) => (
  <div style={{ width: w, height: h, overflow: 'hidden', borderRadius: radius, position: 'relative', ...style }}>
    <Img
      src={staticFile(src)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${zoom})`, transformOrigin: `${fx}% ${fy}%` }}
    />
  </div>
);

// footage that starts playing (from `startAt` seconds into the file) at video time `at`
export const Footage: React.FC<{ src: string; at: number; until: number; startAt?: number; rate?: number; fx?: number; fy?: number; zoom?: number; style?: React.CSSProperties }> = ({ src, at, until, startAt = 0, rate = 1, fx = 50, fy = 50, zoom = 1, style }) => (
  <Sequence from={frames(at)} durationInFrames={Math.max(1, frames(until) - frames(at))} layout="none">
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        startFrom={Math.round(startAt * FPS)}
        playbackRate={rate}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${zoom})`, transformOrigin: `${fx}% ${fy}%` }}
      />
    </div>
  </Sequence>
);

// ---------- grounds ----------
export const Paper: React.FC<{ color?: string }> = ({ color = C.bone }) => <AbsoluteFill style={{ background: color }} />;

// static grain overlay (one PNG, jittered per frame)
export const Grain: React.FC<{ t: number; opacity?: number }> = ({ t, opacity = 0.07 }) => {
  const f = Math.floor(t * 24);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('img/grain.png')})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${(f * 137) % 512}px ${(f * 251) % 512}px`,
        opacity,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}
    />
  );
};

export const Flash: React.FC<{ t: number; at: number; dur?: number; color?: string; max?: number }> = ({ t, at, dur = 0.18, color = '#fff', max = 1 }) => {
  if (t < at || t > at + dur) return null;
  return <AbsoluteFill style={{ background: color, opacity: max * Math.pow(1 - (t - at) / dur, 2) }} />;
};
