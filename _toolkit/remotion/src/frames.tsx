// WebDrip promo kit — reusable visual building blocks: font loader, device frames, crop tiles,
// box logger for the alignment check, word-highlight subtitles, WebDrip mark and debug guides.
// Colours and copy come in as props so every run can style them from its own brief.
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, OffthreadVideo, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import { CANVAS, CX, DESK, Fmt, LANE, MOB, Rect, browser, clamp, easeInOut, easeOut, phone, ramp } from './kit';

// ---------- fonts (local woff2, the render browser can't reach Google Fonts) ----------
export type FontSpec = { family: string; file: string; weight?: string };
export const useFonts = (fonts: FontSpec[]) => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = fonts.map((f) => new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, { weight: f.weight ?? '400' }));
    Promise.all(faces.map((f) => f.load())).then((loaded) => { loaded.forEach((f) => document.fonts.add(f)); continueRender(handle); })
      .catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
};

// ---------- clips ----------
export type Clip = { src: string; from: number; rate: number; kind: 'desk' | 'mob' };
export const srcDims = (c: Clip) => (c.kind === 'desk' ? DESK : MOB);

export const Vid: React.FC<{ clip: Clip; w: number; h: number; style?: React.CSSProperties; tag?: boolean; freezeAt?: number }> = ({ clip, w, h, style, tag = true }) => (
  <div data-box={tag ? 'video' : undefined} data-kind={tag ? 'video' : undefined} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, ...style }}>
    <OffthreadVideo src={staticFile(clip.src)} trimBefore={clip.from} playbackRate={clip.rate} muted style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

export const LightSweep: React.FC<{ t: number; at: number; w: number; h: number; color?: string }> = ({ t, at, w, h, color = 'rgba(255,255,255,.28)' }) => {
  const p = ramp(t, at, at + 34);
  if (p <= 0 || p >= 1) return null;
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -h * 0.2, height: h * 1.4, width: w * 0.35, left: -w * 0.4 + easeInOut(p) * w * 1.5,
      background: `linear-gradient(100deg, transparent, ${color}, transparent)`, transform: 'skewX(-14deg)' }} />
  </div>;
};

export type FrameTheme = { body: string; bar: string; barText: string; shadow: string; dot?: string[] };
export type Zoom = { z: number; ox: string; oy: string };

// thin-bezel browser window: the 1440x900 clip fills the content area edge to edge
export const BrowserFrame: React.FC<{ box: Rect; clip: Clip; t: number; label: string; theme: FrameTheme; zoom?: Zoom; children?: React.ReactNode; over?: React.ReactNode; sweepAt?: number; id?: string; offset?: boolean; style?: React.CSSProperties }> =
  ({ box, clip, t, label, theme, zoom, children, over, sweepAt = 6, id = 'frame', offset, style }) => {
    const bf = browser(box.w);
    const r = Math.round(box.w * 0.018);
    return <div data-box={id} data-kind="frame" data-offset={offset ? '1' : undefined} style={{ position: 'absolute', left: box.x, top: box.y, width: bf.w, height: bf.h, borderRadius: r, background: theme.body, boxShadow: theme.shadow, overflow: 'hidden', ...style }}>
      <div style={{ height: bf.bar, display: 'flex', alignItems: 'center', gap: bf.bar * 0.22, padding: `0 ${bf.bar * 0.5}px`, background: theme.bar }}>
        {(theme.dot ?? ['#FF5F57', '#FEBC2E', '#28C840']).map((c) => <div key={c} style={{ width: bf.bar * 0.28, height: bf.bar * 0.28, borderRadius: 99, background: c }} />)}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ height: bf.bar * 0.62, width: '58%', borderRadius: bf.bar * 0.31, background: 'rgba(20,33,58,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500, fontSize: bf.bar * 0.36, color: theme.barText, whiteSpace: 'nowrap' }}>{label}</div>
        </div>
        <div style={{ width: bf.bar * 1.2 }} />
      </div>
      <div data-box={id + '-screen'} data-kind="screen" data-src="desk" style={{ position: 'relative', width: bf.w, height: bf.screenH, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: zoom ? `${zoom.ox} ${zoom.oy}` : 'center', transform: `scale(${zoom ? zoom.z : 1})` }}>
          <Vid clip={clip} w={bf.w} h={bf.screenH} />
          {children}
        </div>
        {over}
        <LightSweep t={t} at={sweepAt} w={bf.w} h={bf.screenH} />
      </div>
    </div>;
  };

// slim phone: the 390x844 clip fills the screen, clipped to its corner radius
export const PhoneFrame: React.FC<{ box: Rect; clip?: Clip; t: number; theme: { body: string; shadow: string }; sweepAt?: number; zoom?: Zoom; over?: React.ReactNode; screen?: React.ReactNode; id?: string; offset?: boolean; style?: React.CSSProperties }> =
  ({ box, clip, t, theme, sweepAt = 8, zoom, over, screen, id = 'phone', offset, style }) => {
    const p = phone(box.h);
    return <div data-box={id} data-kind="phone" data-offset={offset ? '1' : undefined} style={{ position: 'absolute', left: box.x, top: box.y, width: p.w, height: p.h, borderRadius: p.r, background: theme.body, boxShadow: theme.shadow, ...style }}>
      <div data-box={id + '-screen'} data-kind="screen" data-src="mob" style={{ position: 'absolute', left: p.bezel, top: p.bezel, width: p.sw, height: p.sh, borderRadius: p.r - p.bezel, overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: zoom ? `${zoom.ox} ${zoom.oy}` : 'center', transform: `scale(${zoom ? zoom.z : 1})` }}>
          {clip ? <Vid clip={clip} w={p.sw} h={p.sh} /> : <div data-box="video" data-kind="video" style={{ position: 'absolute', left: 0, top: 0, width: p.sw, height: p.sh }}>{screen}</div>}
        </div>
        {over}
        <LightSweep t={t} at={sweepAt} w={p.sw} h={p.sh} />
      </div>
    </div>;
  };

// a rounded window onto a recording at a fixed scale (vertical crops for 9:16, split-screen tiles)
export const CropTile: React.FC<{ box: Rect; clip: Clip; scale: number; focusX: number; focusY: number; t: number; radius?: number; style?: React.CSSProperties; sweepAt?: number; zoom?: number; id?: string; offset?: boolean; shadow?: string; children?: React.ReactNode }> =
  ({ box, clip, scale, focusX, focusY, t, radius = 26, style, sweepAt = 6, zoom = 1, id = 'tile', offset, shadow, children }) => {
    const S = srcDims(clip);
    const vw = S.w * scale, vh = S.h * scale;
    const left = clamp(box.w / 2 - focusX * scale, box.w - vw, 0);
    const top = clamp(box.h / 2 - focusY * scale, box.h - vh, 0);
    return <div data-box={id} data-kind="tile" data-offset={offset ? '1' : undefined} style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: radius, overflow: 'hidden', background: '#fff', boxShadow: shadow, ...style }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: `${focusX * scale + left}px ${focusY * scale + top}px` }}>
        <Vid clip={clip} w={vw} h={vh} style={{ left, top }} />
        {children && <div style={{ position: 'absolute', left, top, width: vw, height: vh }}>{children}</div>}
      </div>
      <LightSweep t={t} at={sweepAt} w={box.w} h={box.h} />
    </div>;
  };

// ---------- alignment-check logger: every [data-box] element's rendered rect (after 3D transforms) ----------
export const useBoxLogger = (enabled?: boolean) => {
  const t = useCurrentFrame();
  useEffect(() => {
    if (!enabled) return;
    const h = delayRender('boxes');
    setTimeout(() => {
      const out = Array.from(document.querySelectorAll<HTMLElement>('[data-box]')).map((e) => {
        const r = e.getBoundingClientRect();
        const sc = e.closest('[data-scene]') as HTMLElement | null;
        let op = 1; for (let n: HTMLElement | null = e; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
        return { id: e.dataset.box, kind: e.dataset.kind, src: e.dataset.src, offset: e.dataset.offset === '1', scene: sc ? sc.dataset.scene : null, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), op: +op.toFixed(3) };
      });
      console.log('BOXES' + JSON.stringify(out));
      continueRender(h);
    }, 50);
  }, [t, enabled]);
};

// ---------- subtitles: 2–5 words at a time, current word highlighted, one fixed lane per cut ----------
export type CapWord = { text: string; start: number; end: number };
export type SubTheme = { font: string; weight: number; size: Record<Fmt, number>; text: string; active: string; bg: string; ring?: string; radius?: number };
export function chunkCaptions(lines: { words: CapWord[] }[], maxWords = 4, maxChars = 24) {
  const out: { words: CapWord[]; start: number; end: number }[] = [];
  lines.forEach((line) => {
    let cur: CapWord[] = [];
    const flush = () => { if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
    line.words.forEach((w) => {
      const len = cur.map((c) => c.text).join(' ').length + w.text.length + 1;
      if (cur.length >= maxWords || (cur.length >= 2 && len > maxChars)) flush();
      cur.push(w);
      if (/[.?!…,]$/.test(w.text) && cur.length >= 2) flush();
    });
    flush();
  });
  // a chunk stays until the next one starts (max 0.6 s after its last word)
  out.forEach((c, k) => { const nx = out[k + 1]; c.end = Math.min(c.end + 0.6, nx ? nx.start : c.end + 0.6); });
  // single-word chunks merge into the previous chunk of the same line when they'd flash by
  return out;
}
export const Subtitles: React.FC<{ f: Fmt; t: number; chunks: ReturnType<typeof chunkCaptions>; theme: SubTheme; fps?: number }> = ({ f, t, chunks, theme, fps = 30 }) => {
  const sec = t / fps;
  const lane = LANE[f];
  const c = chunks.find((k) => sec >= k.start - 0.04 && sec < k.end);
  if (!c) return null;
  const inP = easeOut(clamp((sec - (c.start - 0.04)) / 0.18));
  const size = theme.size[f];
  return <div style={{ position: 'absolute', left: lane.x, top: lane.y, width: lane.w, height: lane.h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div data-box="subs" data-kind="subs" style={{ display: 'flex', gap: size * 0.26, padding: `${size * 0.16}px ${size * 0.44}px`, borderRadius: theme.radius ?? 18, background: theme.bg, boxShadow: theme.ring,
      opacity: inP, transform: `translateY(${(1 - inP) * 10}px)` }}>
      {c.words.map((w, k) => {
        const next = c.words[k + 1];
        const active = sec >= w.start - 0.03 && (next ? sec < next.start - 0.03 : sec < c.end);
        return <span key={k} style={{ fontFamily: theme.font, fontWeight: theme.weight, fontSize: size, letterSpacing: '-0.01em', lineHeight: 1.15, whiteSpace: 'nowrap',
          color: active ? theme.active : theme.text, transform: `translateY(${active ? -2 : 0}px)`, display: 'inline-block' }}>{w.text}</span>;
      })}
    </div>
  </div>;
};

// ---------- WebDrip mark (copied from the getwebdrip.com header) ----------
export const WebDripMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
    <rect x="2" y="2" width="28" height="28" rx="7" fill="#dcecfa" />
    <path d="M9 2H23A7 7 0 0 1 30 9V13H28Q26.5 13 26.5 14.5V15.5A1.5 1.5 0 0 1 23.5 15.5V14.5Q23.5 13 22 13H21Q19.5 13 19.5 14.5V21A2.75 2.75 0 0 1 14 21V14.5Q14 13 12.5 13H12Q10.5 13 10.5 14.5V17A1.75 1.75 0 0 1 7 17V14.5Q7 13 5.5 13H2V9A7 7 0 0 1 9 2Z" fill="#0075de" />
    <circle cx="7" cy="7.5" r="1.3" fill="#fff" /><circle cx="10.8" cy="7.5" r="1.3" fill="#fff" /><circle cx="14.6" cy="7.5" r="1.3" fill="#fff" />
    <path d="M16.75 25C17.9 26.4 18.4 27.2 18.4 27.9A1.65 1.65 0 0 1 15.1 27.9C15.1 27.2 15.6 26.4 16.75 25Z" fill="#0075de" />
  </svg>
);

// ---------- debug overlay for the alignment-check stills ----------
export const Guides: React.FC<{ f: Fmt }> = ({ f }) => {
  const S = f === 'feed' ? { x: 60, y: 80, w: 960, h: 1150 } : { x: 120, y: 150, w: 840, h: 1370 };
  const L = LANE[f];
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, outline: '2px dashed rgba(0,180,120,.9)' }} />
    <div style={{ position: 'absolute', left: L.x, top: L.y, width: L.w, height: L.h, outline: '2px dashed rgba(230,150,0,.9)' }} />
    <div style={{ position: 'absolute', left: CX(f) - 1, top: 0, width: 2, height: CANVAS[f].h, background: 'rgba(0,150,255,.5)' }} />
    {f === 'tiktok' && <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 150, background: 'rgba(255,0,80,.22)' }} />
      <div style={{ position: 'absolute', left: 940, top: 900, width: 140, height: 800, background: 'rgba(255,0,80,.22)' }} />
      <div style={{ position: 'absolute', left: 0, top: 1520, width: 1080, height: 400, background: 'rgba(255,0,80,.22)' }} />
    </>}
  </AbsoluteFill>;
};
