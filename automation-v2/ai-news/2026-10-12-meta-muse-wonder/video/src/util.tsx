import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from 'remotion';
import { C, F, FONTS, H, W, CAPTION_Y, clamp, easeOut, easeOutExpo, lerp, prog, shake } from './theme';
import quad from './pov_quad.json';
import captionsJson from './captions.json';

// ---------- fonts: local woff2 only (the render browser has no Google Fonts access) ----------
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = FONTS.map((f) => new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, { weight: f.weight }));
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => { loaded.forEach((f) => document.fonts.add(f)); continueRender(handle); })
      .catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
};

// ---------- photo with a cover crop, focal point, zoom and handheld drift ----------
export type Cam = { zoom?: number; fx?: number; fy?: number; dx?: number; dy?: number; rot?: number; shakeAmp?: number; seed?: number };
export const coverBox = (iw: number, ih: number, cam: Cam, s: number, boxW = W, boxH = H) => {
  const z = cam.zoom ?? 1;
  const sc = Math.max(boxW / iw, boxH / ih) * z;
  const fx = (cam.fx ?? 0.5) * iw, fy = (cam.fy ?? 0.5) * ih;
  let left = boxW / 2 - fx * sc, top = boxH / 2 - fy * sc;
  left = clamp(left, boxW - iw * sc, 0); top = clamp(top, boxH - ih * sc, 0);
  const sh = shake(s, cam.shakeAmp ?? 0, cam.seed ?? 0);
  return { sc, left: left + (cam.dx ?? 0) + sh.x, top: top + (cam.dy ?? 0) + sh.y, rot: (cam.rot ?? 0) + sh.r };
};

export const Photo: React.FC<{ src: string; iw: number; ih: number; s: number; cam: Cam; filter?: string; boxW?: number; boxH?: number; children?: React.ReactNode; style?: React.CSSProperties }> =
  ({ src, iw, ih, s, cam, filter, boxW = W, boxH = H, children, style }) => {
    const c = coverBox(iw, ih, cam, s, boxW, boxH);
    return <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: iw, height: ih, transformOrigin: '0 0',
        transform: `translate(${c.left}px, ${c.top}px) scale(${c.sc}) rotate(${c.rot}deg)`, filter }}>
        <Img src={staticFile(src)} style={{ position: 'absolute', left: 0, top: 0, width: iw, height: ih }} />
        {children}
      </div>
    </div>;
  };

// ---------- homography: map a w x h box onto a quad (tl, tr, br, bl) as a CSS matrix3d ----------
export function homography(w: number, h: number, q: { tl: number[]; tr: number[]; br: number[]; bl: number[] }) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const dst = [q.tl, q.tr, q.br, q.bl];
  const A: number[][] = []; const B: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]; const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  // gaussian elimination
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      B[r] -= f * B[c];
    }
  }
  return B.map((v, i) => v / A[i][i]);
}
export function quadMatrix(w: number, h: number, q: { tl: number[]; tr: number[]; br: number[]; bl: number[] }) {
  const hh = homography(w, h, q);
  return `matrix3d(${hh[0]},${hh[3]},0,${hh[6]},${hh[1]},${hh[4]},0,${hh[7]},0,0,1,0,${hh[2]},${hh[5]},0,1)`;
}

// ---------- the real hand-held phone (Unsplash photo) with our UI mapped onto its screen ----------
export const SCREEN = { w: 390, h: 834 };
const POV_MATRIX = quadMatrix(SCREEN.w, SCREEN.h, quad);
const POV_H = homography(SCREEN.w, SCREEN.h, quad);
// where a point of the phone UI lands in the 1080x1920 frame for a given camera
export function povToFrame(x: number, y: number, s: number, cam: Cam) {
  const h = POV_H; const d = h[6] * x + h[7] * y + 1;
  const ix = (h[0] * x + h[1] * y + h[2]) / d, iy = (h[3] * x + h[4] * y + h[5]) / d;
  const c = coverBox(quad.img[0], quad.img[1], cam, s);
  const r = (c.rot * Math.PI) / 180;
  const rx = ix * Math.cos(r) - iy * Math.sin(r), ry = ix * Math.sin(r) + iy * Math.cos(r);
  return { x: c.left + rx * c.sc, y: c.top + ry * c.sc };
}
export const PovPhone: React.FC<{ s: number; cam: Cam; children: React.ReactNode; dim?: number; filter?: string }> = ({ s, cam, children, dim = 0, filter }) => {
  const [iw, ih] = quad.img;
  return <Photo src="img/pov_phone.jpg" iw={iw} ih={ih} s={s} cam={cam} filter={filter}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: iw, height: ih,
      WebkitMaskImage: `url(${staticFile('img/pov_mask.png')})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile('img/pov_mask.png')})`, maskSize: '100% 100%' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN.w, height: SCREEN.h, transformOrigin: '0 0', transform: POV_MATRIX, overflow: 'hidden', background: '#fff' }}>
        {children}
      </div>
      {/* keep the photo's own screen shading and a faint glass sheen */}
      <Img src={staticFile('img/pov_shade.png')} style={{ position: 'absolute', left: 0, top: 0, width: iw, height: ih, mixBlendMode: 'multiply', opacity: 0.8 }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: iw, height: ih, background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.10) 42%, rgba(255,255,255,0) 52%)' }} />
      {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})` }} />}
    </div>
  </Photo>;
};

// ---------- generic chat UI pieces (no real product branding) ----------
export const ChatHeader: React.FC<{ title: string; stamp: string; accent?: string }> = ({ title, stamp, accent = '#111' }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN.w, height: 92, background: 'rgba(255,255,255,.96)', borderBottom: '1px solid #ECECEC', fontFamily: F.ui, zIndex: 2 }}>
    <div style={{ position: 'absolute', left: 22, right: 22, top: 18, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#111' }}>
      <span>9:41</span><span style={{ letterSpacing: 1 }}>●●● ▮</span>
    </div>
    <div style={{ position: 'absolute', left: 18, right: 18, top: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 26, color: '#999', lineHeight: '26px', marginTop: -4 }}>‹</div>
      <div style={{ width: 28, height: 28, borderRadius: 14, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800 }}>AI</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: '#111' }}>{title}</div>
      <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#666', background: '#F1F1F1', borderRadius: 10, padding: '4px 8px', fontFamily: F.mono }}>{stamp}</div>
    </div>
  </div>
);
export const Bubble: React.FC<{ me?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ me, children, style }) => (
  <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', margin: '0 16px 12px', ...style }}>
    <div style={{ maxWidth: me ? 270 : 320, fontFamily: F.ui, fontSize: 16.5, lineHeight: 1.36, fontWeight: 500,
      color: me ? '#fff' : '#151515', background: me ? '#1F1F23' : '#F2F2F4', borderRadius: 20, padding: '10px 14px',
      borderBottomRightRadius: me ? 6 : 20, borderBottomLeftRadius: me ? 20 : 6, whiteSpace: 'pre-line' }}>{children}</div>
  </div>
);
export const InputBar: React.FC<{ s: number; text?: string }> = ({ s, text }) => (
  <div style={{ position: 'absolute', left: 14, right: 14, bottom: 26, height: 50, borderRadius: 25, border: '1.5px solid #E2E2E2', background: '#fff',
    display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: F.ui, fontSize: 16, color: '#9A9A9A', zIndex: 2 }}>
    {text ?? 'Message'}<span style={{ marginLeft: 2, width: 2, height: 20, background: '#111', opacity: Math.floor(s * 2.2) % 2 ? 0 : 1 }} />
    <div style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: 16, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>↑</div>
  </div>
);

// ---------- big slam typography ----------
export const Slam: React.FC<{ s: number; at: number; children: React.ReactNode; size?: number; color?: string; y?: number; from?: number; style?: React.CSSProperties; lh?: number }> =
  ({ s, at, children, size = 150, color = C.white, y = H / 2, from = 1.5, style, lh = 0.92 }) => {
    if (s < at) return null;
    const p = easeOutExpo((s - at) / 0.16);
    const sc = lerp(from, 1, p) * (1 + 0.025 * clamp((s - at - 0.16) / 1.6));
    return <div style={{ position: 'absolute', left: 120, width: 840, top: y, transform: `translateY(-50%) scale(${sc})`, textAlign: 'center',
      fontFamily: F.display, fontSize: size, lineHeight: lh, color, letterSpacing: '0.01em', textTransform: 'uppercase', opacity: clamp((s - at) / 0.05), ...style }}>{children}</div>;
  };

// ---------- broadcast doodle: hand-drawn arrow + note ----------
export const Doodle: React.FC<{ s: number; at: number; path: string; note?: string; noteX: number; noteY: number; color?: string; w?: number; h?: number }> =
  ({ s, at, path, note, noteX, noteY, color = C.yellow, w = W, h = H }) => {
    if (s < at) return null;
    const p = easeOut((s - at) / 0.28);
    return <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: 'drop-shadow(0 4px 0 rgba(0,0,0,.35))' }} />
      {note && <text x={noteX} y={noteY} fill={color} fontFamily={F.hand} fontWeight={700} fontSize={78} opacity={clamp((s - at - 0.18) / 0.12)}
        style={{ filter: 'drop-shadow(0 4px 0 rgba(0,0,0,.4))' }}>{note}</text>}
    </svg>;
  };

// ---------- film grain + vignette (keeps flat graphics from looking sterile) ----------
export const Grain: React.FC<{ s: number; opacity?: number }> = ({ s, opacity = 0.07 }) => {
  const seed = Math.floor(s * 12) % 8;
  return <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
    <filter id={`g${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={W} height={H} filter={`url(#g${seed})`} />
  </svg>;
};
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.45 }) => (
  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none' }} />
);

// ---------- captions: 3-6 words, lower-middle lane, key terms highlighted ----------
type Word = { text: string; start: number; end: number };
const KEY = [['muse', 'wonder'], ['active', 'memory'], ['active', 'focus'], ['ai', 'agent'], ['own', 'testing'], ['meta'], ['metas'], ['wonder']];
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
function markKeys(words: Word[]) {
  const key = new Array(words.length).fill(false);
  for (let i = 0; i < words.length; i++) {
    for (const k of KEY) {
      if (k.every((kw, j) => words[i + j] && norm(words[i + j].text) === kw)) { for (let j = 0; j < k.length; j++) key[i + j] = true; break; }
    }
  }
  return key;
}
export type Chunk = { words: (Word & { key: boolean })[]; start: number; end: number };
export function buildChunks(): Chunk[] {
  const out: Chunk[] = [];
  (captionsJson as { words: Word[] }[]).forEach((line) => {
    const key = markKeys(line.words);
    let cur: (Word & { key: boolean })[] = [];
    const flush = () => { if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
    line.words.forEach((w, i) => {
      const len = cur.map((c) => c.text).join(' ').length + w.text.length + 1;
      // never split a key phrase across chunks
      const keepWithPrev = key[i] && i > 0 && key[i - 1] && cur.length > 0;
      if (!keepWithPrev && (cur.length >= 5 || (cur.length >= 3 && len > 26))) flush();
      cur.push({ ...w, key: key[i] });
      if (/[.?!…:,]$/.test(w.text) && cur.length >= 3 && !(key[i] && line.words[i + 1] && key[i + 1])) flush();
    });
    flush();
  });
  out.forEach((c, k) => { const nx = out[k + 1]; c.end = Math.min(c.end + 0.45, nx ? nx.start - 0.02 : c.end + 0.45); });
  return out;
}
const CHUNKS = buildChunks();
export const Captions: React.FC<{ s: number; hidden?: boolean; y?: number }> = ({ s, hidden, y = CAPTION_Y }) => {
  if (hidden) return null;
  const c = CHUNKS.find((k) => s >= k.start - 0.05 && s < k.end);
  if (!c) return null;
  const inP = easeOut((s - (c.start - 0.05)) / 0.12);
  return <div style={{ position: 'absolute', left: 140, width: 800, top: y, transform: `translateY(-50%)`, display: 'flex', justifyContent: 'center' }}>
    <div data-safe="caption" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 14px', padding: '12px 24px 14px', borderRadius: 22,
      background: 'rgba(11,11,12,.78)', maxWidth: 800, opacity: inP, transform: `translateY(${(1 - inP) * 8}px)` }}>
      {c.words.map((w, i) => {
        const said = s >= w.start - 0.04;
        return <span key={i} style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 50, lineHeight: 1.18, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
          color: w.key ? C.yellow : C.white, opacity: said ? 1 : 0.5 }}>{w.text}</span>;
      })}
    </div>
  </div>;
};

// ---------- misc ----------
export const Fill: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 1 }) => <AbsoluteFill style={{ background: color, opacity }} />;
export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.14em', textTransform: 'uppercase', ...style }}>{children}</div>
);
export const appear = (s: number, at: number, dur = 0.22) => ({ p: easeOutExpo(prog(s, at, dur)), on: s >= at });
