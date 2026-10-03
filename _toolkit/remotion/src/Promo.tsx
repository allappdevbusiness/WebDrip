import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  B, CANVAS, COLORS, CX, DESK, END, Fmt, LABELS, LABEL_H, LANE, LOGO_HIT, MOB, Rect, SCENES, SceneId, SPACE, X,
  browser, endCard, groupRect, phone, sceneEnd, sceneLayout, sceneMotion, sceneStart, springNoOvershoot, easeInOut, easeOut,
} from './layout';
import captions from './captions.json';

// ---------- fonts (local woff2, the render browser can't reach Google Fonts) ----------
const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = [
      new FontFace('Oswald', `url(${staticFile('Oswald.woff2')}) format('woff2')`, { weight: '400 700' }),
      new FontFace('Ubuntu', `url(${staticFile('Ubuntu-500.woff2')}) format('woff2')`, { weight: '500' }),
      new FontFace('Ubuntu', `url(${staticFile('Ubuntu-700.woff2')}) format('woff2')`, { weight: '700' }),
      new FontFace('UMono', `url(${staticFile('UbuntuMono-700.woff2')}) format('woff2')`, { weight: '700' }),
      new FontFace('Inter', `url(${staticFile('Inter.woff2')}) format('woff2')`, { weight: '400 800' }),
    ];
    Promise.all(faces.map((f) => f.load())).then((loaded) => { loaded.forEach((f) => document.fonts.add(f)); continueRender(handle); })
      .catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const OSWALD = 'Oswald, Impact, sans-serif';
const UBUNTU = 'Ubuntu, system-ui, sans-serif';
const MONO = 'UMono, ui-monospace, monospace';
const INTER = 'Inter, system-ui, sans-serif';

// ---------- clip config per scene ----------
type Clip = { src: string; from: number; rate: number; kind: 'desk' | 'mob' };
const D = (n: string, from: number, rate: number): Clip => ({ src: `desk-${n}.mp4`, from, rate, kind: 'desk' });
const M = (n: string, from: number, rate: number): Clip => ({ src: `mob-${n}.mp4`, from, rate, kind: 'mob' });
type SceneClips = { main: Clip; back?: Clip; b?: Clip; c?: Clip; phone?: Clip };
const FEED_CLIPS: Partial<Record<SceneId, SceneClips>> = {
  hook: { main: D('hero', 0, 0.55) },
  hero: { main: D('hero', 60, 1) },
  nav: { main: D('nav', 0, 1) },
  lessons: { main: D('lessons', 20, 1) },
  spot: { main: D('spot', 4, 0.97) },
  herd: { main: D('herd', 8, 0.98), b: D('timetable', 10, 0.98), c: M('herd', 60, 0.7) },
  form: { main: D('book', 20, 0.98) },
  dscroll: { main: D('scroll', 0, 1.45) },
  mobile: { main: M('scroll', 0, 1.47), back: D('scroll', 100, 0.6) },
};
const TT_CLIPS: Partial<Record<SceneId, SceneClips>> = {
  hook: { main: D('hero', 0, 0.55) },
  hero: { main: M('hero', 30, 1), back: D('hero', 60, 1) },
  nav: { main: M('menu', 0, 0.92), back: D('nav', 0, 1) },
  lessons: { main: D('lessons', 20, 1), phone: M('lessons', 20, 1) },
  spot: { main: M('spot', 4, 0.97), back: D('spot', 4, 0.97) },
  herd: { main: D('herd', 8, 0.98), b: M('herd', 60, 0.7), c: D('timetable', 10, 0.98) },
  form: { main: M('book', 20, 0.98), back: D('book', 20, 0.98) },
  dscroll: { main: D('scroll', 0, 1.45) },
  mobile: { main: M('scroll', 0, 1.47), back: D('scroll', 100, 0.6) },
};
const srcDims = (c: Clip) => (c.kind === 'desk' ? DESK : MOB);

const Vid: React.FC<{ clip: Clip; w: number; h: number; style?: React.CSSProperties; tag?: boolean }> = ({ clip, w, h, style, tag = true }) => (
  <div data-box={tag ? 'video' : undefined} data-kind={tag ? 'video' : undefined} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, ...style }}>
    <OffthreadVideo src={staticFile(clip.src)} trimBefore={clip.from} playbackRate={clip.rate} muted style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

// ---------- device frames ----------
const LightSweep: React.FC<{ t: number; at: number; w: number; h: number }> = ({ t, at, w, h }) => {
  const p = ramp(t, at, at + 34);
  if (p <= 0 || p >= 1) return null;
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -h * 0.2, height: h * 1.4, width: w * 0.35, left: -w * 0.4 + easeInOut(p) * w * 1.5,
      background: 'linear-gradient(100deg, transparent, rgba(255,236,205,.2), transparent)', transform: 'skewX(-14deg)' }} />
  </div>;
};

const FRAME_SHADOW = '0 50px 90px -40px rgba(0,0,0,.85), 0 0 0 1px rgba(247,245,238,.14), 0 30px 120px -60px rgba(255,95,3,.38)';

const BrowserFrame: React.FC<{ box: Rect; clip: Clip; t: number; zoom?: { z: number; ox: string; oy: string }; children?: React.ReactNode; over?: React.ReactNode; sweepAt?: number }> = ({ box, clip, t, zoom, children, over, sweepAt = 6 }) => {
  const bf = browser(box.w);
  const r = Math.round(box.w * 0.018);
  return <div data-box="frame" data-kind="frame" style={{ position: 'absolute', left: box.x, top: box.y, width: bf.w, height: bf.h, borderRadius: r, background: '#0B2423', boxShadow: FRAME_SHADOW, overflow: 'hidden' }}>
    <div style={{ height: bf.bar, display: 'flex', alignItems: 'center', gap: bf.bar * 0.22, padding: `0 ${bf.bar * 0.5}px`, background: '#0E2E2D', borderBottom: '1px solid rgba(247,245,238,.08)' }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: bf.bar * 0.28, height: bf.bar * 0.28, borderRadius: 99, background: c, opacity: 0.85 }} />)}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ height: bf.bar * 0.62, width: '54%', borderRadius: bf.bar * 0.31, background: 'rgba(247,245,238,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: UBUNTU, fontWeight: 500, fontSize: bf.bar * 0.36, color: 'rgba(247,245,238,.75)' }}>Ashcanter Riding School — demo by WebDrip</div>
      </div>
      <div style={{ width: bf.bar * 1.2 }} />
    </div>
    <div data-box="frame-screen" data-kind="screen" style={{ position: 'relative', width: bf.w, height: bf.screenH, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: zoom ? `${zoom.ox} ${zoom.oy}` : 'center', transform: `scale(${zoom ? zoom.z : 1})` }}>
        <Vid clip={clip} w={bf.w} h={bf.screenH} />
        {children}
      </div>
      {over}
      <LightSweep t={t} at={sweepAt} w={bf.w} h={bf.screenH} />
    </div>
  </div>;
};

const PhoneFrame: React.FC<{ box: Rect; clip: Clip; t: number; sweepAt?: number; zoom?: { z: number; ox: string; oy: string }; over?: React.ReactNode }> = ({ box, clip, t, sweepAt = 8, zoom, over }) => {
  const p = phone(box.h);
  return <div data-box="phone" data-kind="phone" style={{ position: 'absolute', left: box.x, top: box.y, width: p.w, height: p.h, borderRadius: p.r, background: 'linear-gradient(160deg,#20403E,#081A19)',
    boxShadow: '0 60px 110px -40px rgba(0,0,0,.9), 0 0 0 1.5px rgba(247,245,238,.18), inset 0 0 0 1px rgba(255,255,255,.06), 0 30px 140px -60px rgba(255,95,3,.45)' }}>
    <div data-box="phone-screen" data-kind="screen" style={{ position: 'absolute', left: p.bezel, top: p.bezel, width: p.sw, height: p.sh, borderRadius: p.r - p.bezel, overflow: 'hidden', background: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: zoom ? `${zoom.ox} ${zoom.oy}` : 'center', transform: `scale(${zoom ? zoom.z : 1})` }}>
        <Vid clip={clip} w={p.sw} h={p.sh} />
      </div>
      {over}
      <LightSweep t={t} at={sweepAt} w={p.sw} h={p.sh} />
    </div>
  </div>;
};

// a rounded window onto a recording at a fixed scale (vertical crops for 9:16, bento tiles)
const CropTile: React.FC<{ box: Rect; clip: Clip; scale: number; focusX: number; focusY: number; t: number; radius?: number; style?: React.CSSProperties; sweepAt?: number; zoom?: number; boxId?: string; offset?: boolean }> = ({ box, clip, scale, focusX, focusY, t, radius = 26, style, sweepAt = 6, zoom = 1, boxId = 'tile', offset }) => {
  const S = srcDims(clip);
  const vw = S.w * scale, vh = S.h * scale;
  const left = clamp(box.w / 2 - focusX * scale, box.w - vw, 0);
  const top = clamp(box.h / 2 - focusY * scale, box.h - vh, 0);
  return <div data-box={boxId} data-kind={boxId === 'backdrop' ? 'decor' : 'tile'} data-offset={offset ? '1' : undefined} style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: radius, overflow: 'hidden', background: '#000',
    boxShadow: '0 50px 100px -40px rgba(0,0,0,.9), 0 0 0 1px rgba(247,245,238,.14)', ...style }}>
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: `${focusX * scale + left}px ${focusY * scale + top}px` }}>
      <Vid clip={clip} w={vw} h={vh} style={{ left, top }} />
    </div>
    <LightSweep t={t} at={sweepAt} w={box.w} h={box.h} />
  </div>;
};

// ---------- text ----------
const WordsUp: React.FC<{ text: string; t: number; at: number; size: number; weight: number; color?: string; stagger?: number; tracking?: string; font?: string; align?: 'center' | 'flex-start'; lh?: number }> = ({ text, t, at, size, weight, color = COLORS.paper, stagger = 3, tracking = '-0.01em', font = OSWALD, align = 'center', lh = 1.1 }) => (
  <span style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: align, columnGap: size * 0.24 }}>
    {text.split(' ').map((w, i) => {
      const p = easeOut(ramp(t, at + i * stagger, at + i * stagger + 14));
      return <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
        <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`, opacity: p, fontFamily: font, fontSize: size, fontWeight: weight, color, letterSpacing: tracking, lineHeight: lh }}>{w}</span>
      </span>;
    })}
  </span>
);

const Label: React.FC<{ f: Fmt; s: SceneId; box: Rect; t: number; st: number; en: number }> = ({ f, s, box, t, st, en }) => {
  const L = LABEL_H[f];
  const out = easeInOut(ramp(t, en - 2 * X, en));
  const line = easeOut(ramp(t, st + 6, st + 26));
  return <div data-box="label" data-kind="text" style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: L.gap, opacity: 1 - out, transform: `translateY(${-out * 20}px)` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 36, height: 3, borderRadius: 2, background: COLORS.saddle, transform: `scaleX(${line})`, transformOrigin: 'right' }} />
      <WordsUp text={LABELS[s].kicker} t={t} at={st + 8} size={L.kicker} weight={700} color={COLORS.hay} font={MONO} tracking="0.08em" stagger={2} />
      <div style={{ width: 36, height: 3, borderRadius: 2, background: COLORS.saddle, transform: `scaleX(${line})`, transformOrigin: 'left' }} />
    </div>
    <WordsUp text={LABELS[s].title} t={t} at={st + 12} size={L.title} weight={600} />
  </div>;
};

// small highlight label placed next to a zoomed detail
const Chip: React.FC<{ text: string; x: number; y: number; t: number; at: number; until: number; size?: number }> = ({ text, x, y, t, at, until, size = 26 }) => {
  const p = easeOut(ramp(t, at, at + 12)) * (1 - easeInOut(ramp(t, until - 10, until)));
  if (p <= 0) return null;
  return <div data-kind="chip" style={{ position: 'absolute', left: x, top: y, opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})`, transformOrigin: 'left center',
    display: 'flex', alignItems: 'center', gap: 10, padding: `${size * 0.34}px ${size * 0.6}px`, borderRadius: 999, background: COLORS.saddle, color: COLORS.pine,
    fontFamily: UBUNTU, fontWeight: 700, fontSize: size, letterSpacing: '-0.01em', boxShadow: '0 18px 40px -16px rgba(255,95,3,.9)', whiteSpace: 'nowrap', zIndex: 5 }}>
    <span style={{ width: size * 0.36, height: size * 0.36, borderRadius: 99, background: COLORS.pine }} />{text}
  </div>;
};

// ---------- background ----------
const Background: React.FC<{ f: Fmt; t: number }> = ({ f, t }) => {
  const { w, h } = CANVAS[f];
  const gx = 50 + 8 * Math.sin(t / 140), gy = 40 + 6 * Math.cos(t / 170);
  return <AbsoluteFill style={{ background: COLORS.bg }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 55% at ${gx}% ${gy}%, rgba(20,82,80,.55), transparent 70%), radial-gradient(ellipse 60% 40% at ${100 - gx}% ${100 - gy * 0.6}%, rgba(255,95,3,.13), transparent 70%), radial-gradient(ellipse 50% 30% at ${gx * 0.6}% ${100 - gy}%, rgba(242,193,78,.07), transparent 70%)` }} />
    <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(247,245,238,.07) 1.2px, transparent 1.2px)', backgroundSize: '36px 36px', opacity: 0.55,
      maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent)' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, boxShadow: 'inset 0 0 240px rgba(0,8,8,.85)' }} />
  </AbsoluteFill>;
};

// ---------- scenes ----------
const Scene: React.FC<{ f: Fmt; i: number }> = ({ f, i }) => {
  const local = useCurrentFrame();
  const st = sceneStart(i), en = sceneEnd(i);
  const t = st + local;
  const s = SCENES[i];
  const lay = sceneLayout(f, s);
  const m = sceneMotion(f, i, t);
  const group = groupRect(lay.boxes.filter((b) => b.kind !== 'text'));
  const clips = (f === 'feed' ? FEED_CLIPS : TT_CLIPS)[s];
  const { w: W, h: H } = CANVAS[f];
  const wipeR = 60;
  const wipe = m.wipe < 1 ? `inset(${(1 - m.wipe) * 50}% ${(1 - m.wipe) * 50}% ${(1 - m.wipe) * 50}% ${(1 - m.wipe) * 50}% round ${wipeR}px)` : undefined;
  const gcx = group.x + group.w / 2, gcy = group.y + group.h / 2;

  if (s === 'end') return <EndCard f={f} t={t} wipe={wipe} />;

  let origin = `${gcx}px ${gcy}px`;
  if (s === 'hook') {
    // macro close-up on the hero headline, pulling back to the full page
    const fr = lay.boxes.find((b) => b.kind === 'frame' || b.kind === 'tile')!;
    origin = f === 'feed' ? `${fr.x + fr.w * 0.5}px ${fr.y + fr.h * 0.44}px` : `${fr.x + fr.w * 0.5}px ${fr.y + fr.h * 0.42}px`;
  }
  const groupStyle: React.CSSProperties = {
    position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: origin,
    transform: `translate(${m.tx}px, ${m.ty}px) scale(${m.scale}) rotateX(${m.rotX}deg) rotateY(${m.rotY}deg)`,
    opacity: m.opacity, filter: m.blur > 0.05 ? `blur(${m.blur}px)` : undefined,
  };

  const content: React.ReactNode[] = [];
  const back = lay.boxes.find((b) => b.id === 'backdrop');
  if (back && clips?.back) {
    const bscale = Math.max(back.h / DESK.h, back.w / DESK.w, 0.92);
    content.push(<CropTile key="back" boxId="backdrop" box={back} clip={clips.back} scale={bscale} focusX={720} focusY={450} t={t} radius={24} sweepAt={-100}
      style={{ opacity: 0.4, filter: 'blur(4px) saturate(.85)' }} />);
  }
  let overlay: React.ReactNode = null;
  if (clips) {
    const main = clips.main;
    const fr = lay.boxes.find((b) => b.kind === 'frame');
    const ph = lay.boxes.find((b) => b.kind === 'phone');
    const tile = lay.boxes.find((b) => b.id === 'tile');
    const tile2 = lay.boxes.find((b) => b.id === 'tile2');
    const tileB = lay.boxes.find((b) => b.id === 'tileB');
    const tileC = lay.boxes.find((b) => b.id === 'tileC');
    if (fr) {
      const bf = browser(fr.w);
      const k = bf.w / DESK.w;
      let zoom: { z: number; ox: string; oy: string } | undefined;
      let child: React.ReactNode = null;
      let over: React.ReactNode = null;
      if (s === 'hero') zoom = { z: 1 + 0.1 * easeInOut(ramp(local, 20, 150)), ox: '50%', oy: '45%' };
      if (s === 'nav') {
        // highlight: glide into the sticky nav while it shrinks, the page below softly dimmed
        const zin = easeInOut(ramp(local, 22, 50)), zout = easeInOut(ramp(local, 118, 142));
        const zp = zin - zout;
        zoom = { z: 1 + 0.42 * zp, ox: '0%', oy: '0%' };
        over = <>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 0%, transparent 22%, rgba(5,34,34,${0.55 * zp}) 40%, rgba(5,34,34,${0.62 * zp}) 100%)` }} />
          <Chip text="Shrinks as you scroll" x={bf.w * 0.06} y={bf.screenH * 0.36} t={local} at={50} until={124} />
        </>;
      }
      if (s === 'lessons') {
        // "explode": two lesson cards lift out of the page in 3D layers, the rest dims, then they settle back
        const cards = [{ x: 418, y: 401, w: 290, h: 490, at: 62 }, { x: 732, y: 401, w: 290, h: 490, at: 70 }];
        const dimP = easeInOut(ramp(local, 58, 72)) * (1 - easeInOut(ramp(local, 122, 136)));
        child = dimP > 0 ? <>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(5,34,34,${0.5 * dimP})`, backdropFilter: `blur(${3 * dimP}px)`, zIndex: 2 }} />
          {cards.map((c, n) => {
            const up = easeInOut(ramp(local, c.at, c.at + 16)) * (1 - easeInOut(ramp(local, 120 + n * 4, 136 + n * 4)));
            return <div key={n} style={{ position: 'absolute', left: c.x * k, top: c.y * k, width: c.w * k, height: c.h * k, borderRadius: 8 * k + 2, overflow: 'hidden', zIndex: 3 + n,
              transform: `perspective(900px) translateY(${-22 * up}px) rotateX(${4 * up}deg) scale(${1 + 0.12 * up})`, transformOrigin: '50% 100%',
              boxShadow: `0 ${44 * up}px ${80 * up}px -20px rgba(0,0,0,.85), 0 0 0 ${2 * up}px rgba(255,95,3,${0.85 * up})` }}>
              <Vid tag={false} clip={main} w={bf.w} h={bf.screenH} style={{ left: -c.x * k, top: -c.y * k }} />
            </div>;
          })}
        </> : null;
        over = <Chip text="Cards lift as you hover" x={bf.w * 0.05} y={bf.screenH * 0.06} t={local} at={76} until={130} />;
      }
      if (s === 'form') {
        // highlight: push into the booking form as it checks itself, soft spotlight around it
        const zp = easeInOut(ramp(local, 30, 60)) * (1 - easeInOut(ramp(local, 150, 172)));
        zoom = { z: 1 + 0.3 * zp, ox: '50%', oy: '43%' };
        over = <>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 42% 60% at 50% 48%, transparent 60%, rgba(5,34,34,${0.6 * zp}) 100%)` }} />
          <Chip text="Friendly, instant checks" x={bf.w * 0.04} y={bf.screenH * 0.06} t={local} at={58} until={160} />
        </>;
      }
      content.push(<BrowserFrame key="frame" box={fr} clip={main} t={local} zoom={zoom} over={over}>{child}</BrowserFrame>);
    }
    if (tile) {
      if (s === 'hook') content.push(<CropTile key="tile" box={tile} clip={main} scale={0.86} focusX={720} focusY={430} t={local} sweepAt={70} />);
      else if (s === 'spot') content.push(<CropTile key="tile" box={tile} clip={main} scale={0.88} focusX={480} focusY={376} t={local} offset zoom={1 + 0.06 * easeInOut(ramp(local, 20, 170))} />);
      else if (s === 'herd') {
        // bento: tiles animate in one by one
        const tin = (n: number) => { const p = easeOut(ramp(local, 4 + n * 6, 20 + n * 6)); return { opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})` }; };
        if (f === 'feed') {
          content.push(<CropTile key="tile" box={tile} clip={main} scale={0.67} focusX={720} focusY={533} t={local} sweepAt={24} style={tin(0)} />);
          content.push(<CropTile key="tileB" boxId="tileB" offset box={tileB!} clip={clips.b!} scale={0.62} focusX={480} focusY={460} t={local} sweepAt={34} style={tin(1)} />);
          content.push(<CropTile key="tileC" boxId="tileC" offset box={tileC!} clip={clips.c!} scale={1.2} focusX={195} focusY={330} t={local} sweepAt={44} style={tin(2)} />);
        } else {
          content.push(<CropTile key="tile" box={tile} clip={main} scale={0.62} focusX={720} focusY={480} t={local} sweepAt={24} style={tin(0)} />);
          content.push(<CropTile key="tileB" boxId="tileB" offset box={tileB!} clip={clips.b!} scale={1.05} focusX={195} focusY={330} t={local} sweepAt={34} style={tin(1)} />);
          content.push(<CropTile key="tileC" boxId="tileC" offset box={tileC!} clip={clips.c!} scale={0.62} focusX={420} focusY={470} t={local} sweepAt={44} style={tin(2)} />);
        }
      } else if (s === 'lessons') content.push(<CropTile key="tile" box={tile} clip={main} scale={0.6} focusX={720} focusY={646} t={local} />);
      else content.push(<CropTile key="tile" box={tile} clip={main} scale={0.62} focusX={720} focusY={450} t={local} />);
      if (tile2) content.push(<CropTile key="tile2" boxId="tile2" box={tile2} clip={{ ...main, from: main.from + 90 }} scale={0.62} focusX={720} focusY={450} t={local} sweepAt={20} />);
    }
    if (ph) {
      let zoom: { z: number; ox: string; oy: string } | undefined;
      let over: React.ReactNode = null;
      if (f === 'tiktok' && s === 'nav') {
        // highlight: the phone screen glides into the opening menu, the page beneath dims
        const zp = easeInOut(ramp(local, 30, 52)) * (1 - easeInOut(ramp(local, 112, 134)));
        zoom = { z: 1 + 0.16 * zp, ox: '50%', oy: '12%' };
        over = <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 0%, transparent 58%, rgba(5,34,34,${0.5 * zp}) 80%)` }} />;
      }
      content.push(<PhoneFrame key="phone" box={ph} clip={clips.phone ?? main} t={local} zoom={zoom} over={over} />);
    }
  }
  const labelBox = lay.boxes.find((b) => b.id === 'label');
  const brand = lay.boxes.find((b) => b.id === 'brand');
  const split = lay.boxes.find((b) => b.id === 'splitText');
  const out = easeInOut(ramp(t, en - 2 * X, en));
  return <AbsoluteFill style={{ clipPath: wipe, perspective: 1800 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `${gcx}px ${gcy}px`, transform: `scale(${m.push})`, transformStyle: 'preserve-3d' }}>
      <div style={groupStyle}>
        {/* soft floor shadow under the devices */}
        <div style={{ position: 'absolute', left: gcx - group.w * 0.42, top: group.y + group.h - 30, width: group.w * 0.84, height: 70, borderRadius: '50%', background: 'rgba(0,0,0,.6)', filter: 'blur(30px)' }} />
        {content}
        {overlay}
      </div>
    </div>
    {labelBox && <Label f={f} s={s} box={labelBox} t={t} st={st} en={en} />}
    {split && <div data-box="splitText" data-kind="text" data-offset="1" style={{ position: 'absolute', left: split.x, top: split.y, width: split.w, height: split.h, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: SPACE.md,
      opacity: 1 - out, transform: `translateY(${-out * 20}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 3, borderRadius: 2, background: COLORS.saddle, transform: `scaleX(${easeOut(ramp(t, st + 6, st + 26))})`, transformOrigin: 'left' }} />
        <WordsUp text={LABELS[s].kicker} t={t} at={st + 8} size={26} weight={700} color={COLORS.hay} font={MONO} tracking="0.08em" stagger={2} align="flex-start" />
      </div>
      <WordsUp text={LABELS[s].title} t={t} at={st + 12} size={64} weight={600} align="flex-start" lh={1.06} />
      <WordsUp text="Gentle motion, with a pause button." t={t} at={st + 30} size={28} weight={500} font={UBUNTU} color={COLORS.mist} tracking="0" align="flex-start" stagger={1} lh={1.4} />
    </div>}
    {brand && <div data-box="brand" data-kind="text" style={{ position: 'absolute', left: brand.x, top: brand.y, width: brand.w, height: brand.h, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACE.sm,
      opacity: 1 - out }}>
      <WordsUp text="Ashcanter Riding School" t={t} at={64} size={f === 'feed' ? 88 : 92} weight={600} stagger={4} />
      <WordsUp text="Ride with quiet confidence." t={t} at={80} size={f === 'feed' ? 44 : 48} weight={500} font={UBUNTU} color={COLORS.saddleSoft} stagger={3} tracking="-0.01em" />
    </div>}
  </AbsoluteFill>;
};

// ---------- WebDrip end card ----------
const WebDripMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
    <rect x="2" y="2" width="28" height="28" rx="7" fill="#dcecfa" />
    <path d="M9 2H23A7 7 0 0 1 30 9V13H28Q26.5 13 26.5 14.5V15.5A1.5 1.5 0 0 1 23.5 15.5V14.5Q23.5 13 22 13H21Q19.5 13 19.5 14.5V21A2.75 2.75 0 0 1 14 21V14.5Q14 13 12.5 13H12Q10.5 13 10.5 14.5V17A1.75 1.75 0 0 1 7 17V14.5Q7 13 5.5 13H2V9A7 7 0 0 1 9 2Z" fill="#0075de" />
    <circle cx="7" cy="7.5" r="1.3" fill="#fff" /><circle cx="10.8" cy="7.5" r="1.3" fill="#fff" /><circle cx="14.6" cy="7.5" r="1.3" fill="#fff" />
    <path d="M16.75 25C17.9 26.4 18.4 27.2 18.4 27.9A1.65 1.65 0 0 1 15.1 27.9C15.1 27.2 15.6 26.4 16.75 25Z" fill="#0075de" />
  </svg>
);

const EndCard: React.FC<{ f: Fmt; t: number; wipe?: string }> = ({ f, t, wipe }) => {
  const e = END[f];
  const bx = endCard(f);
  const head = bx[0], logo = bx[1], btn = bx[2], fol = bx[3];
  const lines = ['Your riding school', 'could look', 'like this.'];
  const H0 = B[9];
  const lineP = (k: number) => easeOut(ramp(t, H0 + 4 + k * 3, H0 + 4 + k * 3 + 16));
  const hl = easeInOut(ramp(t, H0 + 20, H0 + 38));
  const lp = springNoOvershoot(ramp(t, LOGO_HIT - 22, LOGO_HIT));
  const glow = Math.exp(-Math.max(0, t - LOGO_HIT) / 18) * (t >= LOGO_HIT ? 1 : 0);
  const sweep = ramp(t, LOGO_HIT + 6, LOGO_HIT + 40);
  const bp = easeOut(ramp(t, LOGO_HIT + 10, LOGO_HIT + 28));
  const fp = easeOut(ramp(t, LOGO_HIT + 28, LOGO_HIT + 46));
  return <AbsoluteFill style={{ clipPath: wipe }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% ${((logo.y + logo.h / 2) / CANVAS[f].h) * 100}%, rgba(0,117,222,${0.14 + 0.16 * glow}), transparent 70%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20,82,80,.6), transparent 70%), ${COLORS.bg}` }} />
    <div data-box="endHead" data-kind="text" style={{ position: 'absolute', left: head.x, top: head.y, width: head.w, height: head.h, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {lines.map((l, k) => <div key={k} style={{ overflow: lineP(k) < 1 ? 'hidden' : 'visible', height: e.head * e.headLH, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', transform: `translateY(${(1 - lineP(k)) * 100}%)`, opacity: lineP(k), fontFamily: OSWALD, fontWeight: 600, fontSize: e.head, letterSpacing: '-0.01em', lineHeight: e.headLH, color: COLORS.paper }}>
          {k === 2 && <div style={{ position: 'absolute', left: -e.head * 0.16, right: -e.head * 0.16, top: '10%', bottom: '-2%', background: COLORS.saddle, borderRadius: 12, transformOrigin: 'left center', transform: `scaleX(${hl}) skewX(-6deg)`, zIndex: 0 }} />}
          <span style={{ position: 'relative', zIndex: 1, color: k === 2 ? (hl > 0.5 ? COLORS.pine : COLORS.paper) : COLORS.paper }}>{l}</span>
        </div>
      </div>)}
    </div>
    <div data-box="endLogo" data-kind="logo" style={{ position: 'absolute', left: logo.x, top: logo.y, width: logo.w, height: logo.h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACE.md,
      opacity: clamp(lp * 1.6), transform: `translateY(${(1 - lp) * 60}px) scale(${0.7 + 0.3 * lp})` }}>
      <div style={{ filter: `drop-shadow(0 0 ${30 + 40 * glow}px rgba(0,117,222,${0.35 + 0.4 * glow}))` }}><WebDripMark size={e.logoMark} /></div>
      <div style={{ position: 'relative', fontFamily: INTER, fontWeight: 600, fontSize: e.word, letterSpacing: '-0.035em', lineHeight: 1.1, color: COLORS.paper, whiteSpace: 'nowrap' }}>
        Web<span style={{ color: '#2F8FE8', textShadow: `0 0 ${24 * glow + 10}px rgba(0,117,222,.55)` }}>Drip</span>
        {sweep > 0 && sweep < 1 && <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', left: `${-50 + sweep * 160}%`, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.5), transparent)', transform: 'skewX(-16deg)', mixBlendMode: 'overlay' }} /></div>}
      </div>
    </div>
    <div data-box="endButton" data-kind="button" style={{ position: 'absolute', left: btn.x, top: btn.y, width: btn.w, height: btn.h, borderRadius: btn.h / 2, background: COLORS.saddle, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 24px 60px -24px rgba(255,95,3,.9)', opacity: bp, transform: `translateY(${(1 - bp) * 40}px)`, fontFamily: UBUNTU, fontWeight: 700, fontSize: e.btnFont, color: COLORS.pine, letterSpacing: '-0.01em' }}>
      Book your meeting → getwebdrip.com
    </div>
    <div data-box="endFollow" data-kind="text" style={{ position: 'absolute', left: fol.x, top: fol.y, width: fol.w, height: fol.h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: fp, transform: `translateY(${(1 - fp) * 16}px)`,
      fontFamily: UBUNTU, fontWeight: 500, fontSize: e.follow, color: COLORS.mist }}>
      <svg width={e.follow * 1.05} height={e.follow * 1.05} viewBox="0 0 24 24" fill="none" stroke={COLORS.mist} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="4" /><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /><path d="M19 8v6M16 11h6" /></svg>
      Follow for more content like this
    </div>
  </AbsoluteFill>;
};

// ---------- subtitles ----------
type W = { text: string; start: number; end: number };
const CHUNKS: { words: W[]; start: number; end: number }[] = (() => {
  const out: { words: W[]; start: number; end: number }[] = [];
  (captions as { words: W[] }[]).forEach((line) => {
    let cur: W[] = [];
    const flush = () => { if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
    line.words.forEach((w) => {
      const len = cur.map((c) => c.text).join(' ').length + w.text.length + 1;
      if (cur.length >= 4 || (cur.length >= 2 && len > 24)) flush();
      cur.push(w);
      if (/[.?!…,]$/.test(w.text) && cur.length >= 2) flush();
    });
    flush();
  });
  // a chunk stays until the next one starts (max 0.6 s after its last word)
  out.forEach((c, k) => { const nx = out[k + 1]; c.end = Math.min(c.end + 0.6, nx ? nx.start : c.end + 0.6); });
  return out;
})();

const Subtitles: React.FC<{ f: Fmt; t: number }> = ({ f, t }) => {
  const sec = t / 30;
  const lane = LANE[f];
  const c = CHUNKS.find((k) => sec >= k.start - 0.04 && sec < k.end);
  if (!c) return null;
  const inP = easeOut(clamp((sec - (c.start - 0.04)) / 0.18));
  const size = f === 'feed' ? 46 : 48;
  return <div style={{ position: 'absolute', left: lane.x, top: lane.y, width: lane.w, height: lane.h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div data-box="subs" data-kind="subs" style={{ display: 'flex', gap: size * 0.26, padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: 18, background: 'rgba(4,26,26,.82)', boxShadow: '0 0 0 1px rgba(247,245,238,.1)',
      opacity: inP, transform: `translateY(${(1 - inP) * 10}px)` }}>
      {c.words.map((w, k) => {
        const next = c.words[k + 1];
        const active = sec >= w.start - 0.03 && (next ? sec < next.start - 0.03 : sec < c.end);
        return <span key={k} style={{ fontFamily: UBUNTU, fontWeight: 700, fontSize: size, letterSpacing: '-0.01em', lineHeight: 1.15, whiteSpace: 'nowrap',
          color: active ? COLORS.saddle : COLORS.paper, transform: `translateY(${active ? -2 : 0}px)`, display: 'inline-block' }}>{w.text}</span>;
      })}
    </div>
  </div>;
};

// ---------- compositions ----------
export const Promo: React.FC<{ fmt: Fmt; showGuides?: boolean; logBoxes?: boolean }> = ({ fmt, showGuides, logBoxes }) => {
  useFonts();
  const t = useCurrentFrame();
  const { fps } = useVideoConfig();
  useEffect(() => {
    if (!logBoxes) return;
    const h = delayRender('boxes');
    // let images/videos lay out, then log every tagged element's rendered bounding box (after 3D transforms)
    setTimeout(() => {
      const out = Array.from(document.querySelectorAll<HTMLElement>('[data-box]')).map((e) => {
        const r = e.getBoundingClientRect();
        const sc = e.closest('[data-scene]') as HTMLElement | null;
        return { id: e.dataset.box, kind: e.dataset.kind, offset: e.dataset.offset === '1', scene: sc ? sc.dataset.scene : null, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), op: +getComputedStyle(e).opacity };
      });
      console.log('BOXES' + JSON.stringify(out));
      continueRender(h);
    }, 50);
  }, [t, logBoxes]);
  return <AbsoluteFill style={{ background: COLORS.bg, overflow: 'hidden' }}>
    <Background f={fmt} t={t} />
    {SCENES.map((s, i) => (
      <Sequence key={s} from={sceneStart(i)} durationInFrames={sceneEnd(i) - sceneStart(i)} premountFor={fps} name={s}>
        <AbsoluteFill data-scene={s}><Scene f={fmt} i={i} /></AbsoluteFill>
      </Sequence>
    ))}
    <Subtitles f={fmt} t={t} />
    <Audio src={staticFile('mix.wav')} />
    {showGuides && <Guides f={fmt} />}
  </AbsoluteFill>;
};

// debug overlay for the alignment check stills (safe area, lane, centre line, TikTok UI mock)
const Guides: React.FC<{ f: Fmt }> = ({ f }) => {
  const S = f === 'feed' ? { x: 60, y: 80, w: 960, h: 1150 } : { x: 120, y: 150, w: 840, h: 1370 };
  const L = LANE[f];
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, outline: '2px dashed rgba(0,255,160,.8)' }} />
    <div style={{ position: 'absolute', left: L.x, top: L.y, width: L.w, height: L.h, outline: '2px dashed rgba(255,200,0,.8)' }} />
    <div style={{ position: 'absolute', left: CX(f) - 1, top: 0, width: 2, height: CANVAS[f].h, background: 'rgba(0,200,255,.5)' }} />
    {f === 'tiktok' && <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 150, background: 'rgba(255,0,80,.25)' }} />
      <div style={{ position: 'absolute', left: 940, top: 900, width: 140, height: 800, background: 'rgba(255,0,80,.25)' }} />
      <div style={{ position: 'absolute', left: 0, top: 1520, width: 1080, height: 400, background: 'rgba(255,0,80,.25)' }} />
    </>}
  </AbsoluteFill>;
};
