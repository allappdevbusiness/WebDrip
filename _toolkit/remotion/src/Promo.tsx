import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import {
  B, CANVAS, COLORS, CX, DESK, END, Fmt, LABELS, LABEL_H, LANE, MOB, Rect, SCENES, SceneId, SPACE, X,
  browser, endCard, groupRect, phone, sceneEnd, sceneLayout, sceneMotion, sceneStart, springNoOvershoot, easeInOut, easeOut, labelHeight,
} from './layout';
import captions from './captions.json';

// ---------- fonts (local woff2, the render browser can't reach Google Fonts) ----------
const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = [
      new FontFace('Outfit', `url(${staticFile('Outfit.woff2')}) format('woff2')`, { weight: '100 900' }),
      new FontFace('JBMono', `url(${staticFile('JBMono.woff2')}) format('woff2')`, { weight: '100 900' }),
    ];
    Promise.all(faces.map((f) => f.load())).then((loaded) => { loaded.forEach((f) => document.fonts.add(f)); continueRender(handle); })
      .catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const OUTFIT = 'Outfit, system-ui, sans-serif';
const MONO = 'JBMono, ui-monospace, monospace';

// ---------- clip config per scene ----------
type Clip = { src: string; from: number; rate: number; kind: 'desk' | 'mob' };
const D = (n: string, from: number, rate: number): Clip => ({ src: `desk-${n}.mp4`, from, rate, kind: 'desk' });
const M = (n: string, from: number, rate: number): Clip => ({ src: `mob-${n}.mp4`, from, rate, kind: 'mob' });
const FEED_CLIPS: Partial<Record<SceneId, { main: Clip; back?: Clip }>> = {
  hook: { main: D('hero', 0, 0.55) },
  hero: { main: D('hero', 60, 0.95) },
  nav: { main: D('nav', 0, 0.97) },
  styles: { main: D('styles', 5, 1) },
  spot: { main: D('spot', 10, 1) },
  artists: { main: D('artists', 5, 1) },
  form: { main: D('book', 0, 1) },
  dscroll: { main: D('scroll', 0, 1.26) },
  mobile: { main: M('scroll', 0, 1.37), back: D('scroll', 120, 0.6) },
};
const TT_CLIPS: Partial<Record<SceneId, { main: Clip; back?: Clip }>> = {
  hook: { main: D('hero', 0, 0.55) },
  hero: { main: M('hero', 15, 1), back: D('hero', 60, 0.95) },
  nav: { main: M('menu', 0, 1), back: D('nav', 0, 0.97) },
  styles: { main: M('styles', 5, 1), back: D('styles', 5, 1) },
  spot: { main: M('spot', 5, 1), back: D('spot', 10, 1) },
  artists: { main: M('artists', 5, 1), back: D('artists', 5, 1) },
  form: { main: M('book', 0, 1), back: D('book', 0, 1) },
  dscroll: { main: D('scroll', 0, 1.26) },
  mobile: { main: M('scroll', 0, 1.37), back: D('scroll', 120, 0.6) },
};

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
      background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.16), transparent)', transform: 'skewX(-14deg)' }} />
  </div>;
};

const BrowserFrame: React.FC<{ box: Rect; clip: Clip; t: number; zoom?: { z: number; ox: string; oy: string }; children?: React.ReactNode; sweepAt?: number; dim?: number }> = ({ box, clip, t, zoom, children, sweepAt = 6, dim = 0 }) => {
  const bf = browser(box.w);
  const r = Math.round(box.w * 0.018);
  return <div data-box="frame" data-kind="frame" style={{ position: 'absolute', left: box.x, top: box.y, width: bf.w, height: bf.h, borderRadius: r, background: '#16161A',
    boxShadow: '0 50px 90px -40px rgba(0,0,0,.9), 0 0 0 1px rgba(250,250,250,.12), 0 30px 120px -60px rgba(244,63,94,.45)', overflow: 'hidden' }}>
    <div style={{ height: bf.bar, display: 'flex', alignItems: 'center', gap: bf.bar * 0.22, padding: `0 ${bf.bar * 0.5}px`, background: '#1B1B20', borderBottom: '1px solid rgba(250,250,250,.08)' }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: bf.bar * 0.28, height: bf.bar * 0.28, borderRadius: 99, background: c, opacity: 0.85 }} />)}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ height: bf.bar * 0.62, width: '52%', borderRadius: bf.bar * 0.31, background: 'rgba(250,250,250,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: OUTFIT, fontSize: bf.bar * 0.36, color: 'rgba(250,250,250,.72)', letterSpacing: '-0.01em' }}>Hushwren Tattoo — demo by WebDrip</div>
      </div>
      <div style={{ width: bf.bar * 1.2 }} />
    </div>
    <div data-box="frame-screen" data-kind="screen" style={{ position: 'relative', width: bf.w, height: bf.screenH, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: zoom ? `${zoom.ox} ${zoom.oy}` : 'center', transform: `scale(${zoom ? zoom.z : 1})` }}>
        <Vid clip={clip} w={bf.w} h={bf.screenH} />
        {children}
      </div>
      {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(9,9,11,${dim})` }} />}
      <LightSweep t={t} at={sweepAt} w={bf.w} h={bf.screenH} />
    </div>
  </div>;
};

const PhoneFrame: React.FC<{ box: Rect; clip: Clip; t: number; sweepAt?: number }> = ({ box, clip, t, sweepAt = 8 }) => {
  const p = phone(box.h);
  return <div data-box="phone" data-kind="phone" style={{ position: 'absolute', left: box.x, top: box.y, width: p.w, height: p.h, borderRadius: p.r, background: 'linear-gradient(160deg,#2A2A31,#0E0E11)',
    boxShadow: '0 60px 110px -40px rgba(0,0,0,.95), 0 0 0 1.5px rgba(250,250,250,.16), inset 0 0 0 1px rgba(255,255,255,.06), 0 30px 140px -60px rgba(244,63,94,.5)' }}>
    <div data-box="phone-screen" data-kind="screen" style={{ position: 'absolute', left: p.bezel, top: p.bezel, width: p.sw, height: p.sh, borderRadius: p.r - p.bezel, overflow: 'hidden', background: '#000' }}>
      <Vid clip={clip} w={p.sw} h={p.sh} />
      <LightSweep t={t} at={sweepAt} w={p.sw} h={p.sh} />
    </div>
  </div>;
};

// a rounded window onto the desktop recording at a fixed scale (vertical crops for 9:16)
const CropTile: React.FC<{ box: Rect; clip: Clip; scale: number; focusX: number; focusY: number; t: number; radius?: number; style?: React.CSSProperties; sweepAt?: number; zoom?: number; boxId?: string }> = ({ box, clip, scale, focusX, focusY, t, radius = 28, style, sweepAt = 6, zoom = 1, boxId = 'tile' }) => {
  const vw = DESK.w * scale, vh = DESK.h * scale;
  const left = clamp(box.w / 2 - focusX * scale, box.w - vw, 0);
  const top = clamp(box.h / 2 - focusY * scale, box.h - vh, 0);
  return <div data-box={boxId} data-kind={boxId === 'backdrop' ? 'decor' : 'tile'} style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: radius, overflow: 'hidden', background: '#000',
    boxShadow: '0 50px 100px -40px rgba(0,0,0,.95), 0 0 0 1px rgba(250,250,250,.12)', ...style }}>
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: `${focusX * scale + left}px ${focusY * scale + top}px` }}>
      <Vid clip={clip} w={vw} h={vh} style={{ left, top }} />
    </div>
    <LightSweep t={t} at={sweepAt} w={box.w} h={box.h} />
  </div>;
};

// ---------- text ----------
const WordsUp: React.FC<{ text: string; t: number; at: number; size: number; weight: number; color?: string; stagger?: number; tracking?: string; font?: string; upper?: boolean }> = ({ text, t, at, size, weight, color = COLORS.bone, stagger = 3, tracking = '-0.035em', font = OUTFIT, upper }) => (
  <span style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26 }}>
    {text.split(' ').map((w, i) => {
      const p = easeOut(ramp(t, at + i * stagger, at + i * stagger + 14));
      return <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
        <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`, opacity: p, fontFamily: font, fontSize: size, fontWeight: weight, color, letterSpacing: tracking, lineHeight: 1.1, textTransform: upper ? 'uppercase' : undefined }}>{w}</span>
      </span>;
    })}
  </span>
);

const Label: React.FC<{ f: Fmt; s: SceneId; box: Rect; t: number; st: number; en: number }> = ({ f, s, box, t, st, en }) => {
  const L = LABEL_H[f];
  const out = easeInOut(ramp(t, en - 2 * X, en));
  return <div data-box="label" data-kind="text" style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: L.gap, opacity: 1 - out, transform: `translateY(${-out * 20}px)` }}>
    <WordsUp text={LABELS[s].kicker} t={t} at={st + 8} size={L.kicker} weight={500} color={COLORS.roseSoft} font={MONO} tracking="0.12em" upper stagger={2} />
    <WordsUp text={LABELS[s].title} t={t} at={st + 12} size={L.title} weight={800} />
  </div>;
};

// ---------- background ----------
const Background: React.FC<{ f: Fmt; t: number }> = ({ f, t }) => {
  const { w, h } = CANVAS[f];
  const gx = 50 + 8 * Math.sin(t / 140), gy = 42 + 6 * Math.cos(t / 170);
  return <AbsoluteFill style={{ background: COLORS.ink }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at ${gx}% ${gy}%, rgba(244,63,94,.16), transparent 70%), radial-gradient(ellipse 60% 40% at ${100 - gx}% ${100 - gy}%, rgba(167,139,250,.10), transparent 70%)` }} />
    <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(250,250,250,.07) 1.2px, transparent 1.2px)', backgroundSize: '36px 36px', opacity: 0.6,
      maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent)' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, boxShadow: 'inset 0 0 220px rgba(0,0,0,.85)' }} />
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
  const box = (id: string) => lay.boxes.find((b) => b.id === id)!;
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
    origin = f === 'feed' ? `${fr.x + fr.w * 0.68}px ${fr.y + fr.h * 0.42}px` : `${fr.x + fr.w * 0.5}px ${fr.y + fr.h * 0.42}px`;
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
      style={{ opacity: 0.42, filter: 'blur(3px) saturate(.8)' }} />);
  }
  if (clips) {
    const main = clips.main;
    const fr = lay.boxes.find((b) => b.kind === 'frame');
    const ph = lay.boxes.find((b) => b.kind === 'phone');
    const tile = lay.boxes.find((b) => b.id === 'tile');
    const tile2 = lay.boxes.find((b) => b.id === 'tile2');
    if (fr) {
      let zoom: { z: number; ox: string; oy: string } | undefined;
      let dim = 0;
      let child: React.ReactNode = null;
      if (s === 'hero') zoom = { z: 1 + 0.1 * easeInOut(ramp(local, 20, 140)), ox: '60%', oy: '45%' };
      if (s === 'nav') zoom = { z: 1 + 0.42 * easeInOut(ramp(local, 18, 46)) - 0.42 * easeInOut(ramp(local, 132, 160)), ox: '0%', oy: '0%' };
      if (s === 'artists') {
        // "explode": the hovered artist card lifts out of the page in 3D, the rest dims, then it settles back
        const up = easeInOut(ramp(local, 100, 116)) * (1 - easeInOut(ramp(local, 146, 162)));
        const bf = browser(fr.w);
        const k = bf.w / DESK.w;
        const card = { x: 417 * k, y: 189 * k, w: 293 * k, h: 567 * k };
        dim = 0.55 * up;
        child = up > 0 ? <><div style={{ position: 'absolute', inset: 0, background: `rgba(9,9,11,${dim})`, backdropFilter: `blur(${3 * up}px)`, zIndex: 2 }} /><div style={{ position: 'absolute', left: card.x, top: card.y, width: card.w, height: card.h, borderRadius: 8 * k + 2, overflow: 'hidden', zIndex: 3,
          transform: `translateY(${-18 * up}px) scale(${1 + 0.1 * up})`, boxShadow: `0 ${40 * up}px ${80 * up}px -20px rgba(0,0,0,.9), 0 0 0 ${2 * up}px rgba(244,63,94,${0.8 * up})` }}>
          <Vid tag={false} clip={main} w={bf.w} h={bf.screenH} style={{ left: -card.x, top: -card.y }} />
        </div></> : null;
      }
      if (s === 'form') {
        const xf = ramp(local, 118, 132);
        child = xf > 0 ? <div style={{ position: 'absolute', inset: 0, opacity: easeInOut(xf) }}><Sequence from={110} premountFor={30}><Vid clip={D('footer', 0, 1)} w={browser(fr.w).w} h={browser(fr.w).screenH} /></Sequence></div> : null;
      }
      const frameEl = <BrowserFrame key="frame" box={fr} clip={main} t={local} zoom={zoom}>{child}</BrowserFrame>;
      content.push(frameEl);
    }
    if (ph) content.push(<PhoneFrame key="phone" box={ph} clip={main} t={local} />);
    if (tile) {
      if (s === 'hook') content.push(<CropTile key="tile" box={tile} clip={main} scale={0.86} focusX={985} focusY={450} t={local} sweepAt={70} />);
      else content.push(<CropTile key="tile" box={tile} clip={main} scale={0.62} focusX={720} focusY={450} t={local} />);
      if (tile2) content.push(<CropTile key="tile2" boxId="tile2" box={tile2} clip={{ ...main, from: main.from + 90 }} scale={0.62} focusX={720} focusY={450} t={local} sweepAt={20} />);
    }
  }
  const labelBox = lay.boxes.find((b) => b.id === 'label');
  const brand = lay.boxes.find((b) => b.id === 'brand');
  return <AbsoluteFill style={{ clipPath: wipe, perspective: 1800 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `${gcx}px ${gcy}px`, transform: `scale(${m.push})`, transformStyle: 'preserve-3d' }}>
    <div style={groupStyle}>
      {/* soft floor shadow under the device */}
      <div style={{ position: 'absolute', left: gcx - group.w * 0.42, top: group.y + group.h - 30, width: group.w * 0.84, height: 70, borderRadius: '50%', background: 'rgba(0,0,0,.65)', filter: 'blur(30px)' }} />
      {content}
    </div>
    </div>
    {labelBox && <Label f={f} s={s} box={labelBox} t={t} st={st} en={en} />}
    {brand && <div data-box="brand" data-kind="text" style={{ position: 'absolute', left: brand.x, top: brand.y, width: brand.w, height: brand.h, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACE.sm,
      opacity: 1 - easeInOut(ramp(t, en - 2 * X, en)) }}>
      <WordsUp text="Hushwren Tattoo" t={t} at={64} size={f === 'feed' ? 92 : 100} weight={900} stagger={4} tracking="-0.05em" />
      <WordsUp text="Quiet lines. Loud stories." t={t} at={80} size={f === 'feed' ? 46 : 50} weight={500} color={COLORS.roseSoft} stagger={3} tracking="-0.02em" />
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

export const LOGO_HIT = 1526; // strongest late music hit (50.87 s)
const EndCard: React.FC<{ f: Fmt; t: number; wipe?: string }> = ({ f, t, wipe }) => {
  const e = END[f];
  const bx = endCard(f);
  const head = bx[0], logo = bx[1], btn = bx[2], fol = bx[3];
  const lines = ['Your tattoo studio', 'could look', 'like this.'];
  const lineP = (k: number) => easeOut(ramp(t, 1508 + k * 3, 1508 + k * 3 + 16));
  const hl = easeInOut(ramp(t, 1522, 1540));
  const lp = springNoOvershoot(ramp(t, 1510, LOGO_HIT));
  const glow = Math.exp(-Math.max(0, t - LOGO_HIT) / 18) * (t >= LOGO_HIT ? 1 : 0);
  const sweep = ramp(t, 1532, 1566);
  const bp = easeOut(ramp(t, 1538, 1556));
  const fp = easeOut(ramp(t, 1558, 1576));
  const wordSize = e.word;
  return <AbsoluteFill style={{ clipPath: wipe }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% ${((logo.y + logo.h / 2) / CANVAS[f].h) * 100}%, rgba(0,117,222,${0.16 + 0.18 * glow}), transparent 70%), ${COLORS.ink}` }} />
    <div data-box="endHead" data-kind="text" style={{ position: 'absolute', left: head.x, top: head.y, width: head.w, height: head.h, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {lines.map((l, k) => <div key={k} style={{ overflow: lineP(k) < 1 ? 'hidden' : 'visible', height: e.head * e.headLH, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', transform: `translateY(${(1 - lineP(k)) * 100}%)`, opacity: lineP(k), fontFamily: OUTFIT, fontWeight: 900, fontSize: e.head, letterSpacing: '-0.045em', lineHeight: e.headLH, color: COLORS.bone }}>
          {k === 2 && <div style={{ position: 'absolute', left: -e.head * 0.14, right: -e.head * 0.14, top: '8%', bottom: '-4%', background: COLORS.rose, borderRadius: 14, transformOrigin: 'left center', transform: `scaleX(${hl}) skewX(-6deg)`, zIndex: 0 }} />}
          <span style={{ position: 'relative', zIndex: 1, color: k === 2 ? (hl > 0.5 ? COLORS.ink : COLORS.bone) : COLORS.bone }}>{l}</span>
        </div>
      </div>)}
    </div>
    <div data-box="endLogo" data-kind="logo" style={{ position: 'absolute', left: logo.x, top: logo.y, width: logo.w, height: logo.h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACE.md,
      opacity: clamp(lp * 1.6), transform: `translateY(${(1 - lp) * 60}px) scale(${0.7 + 0.3 * lp})` }}>
      <div style={{ filter: `drop-shadow(0 0 ${30 + 40 * glow}px rgba(0,117,222,${0.35 + 0.4 * glow}))` }}><WebDripMark size={e.logoMark} /></div>
      <div style={{ position: 'relative', fontFamily: OUTFIT, fontWeight: 700, fontSize: wordSize, letterSpacing: '-0.035em', lineHeight: 1.1, color: COLORS.bone, whiteSpace: 'nowrap' }}>
        Web<span style={{ color: COLORS.wdBlue, textShadow: `0 0 ${24 * glow + 10}px rgba(0,117,222,.55)` }}>Drip</span>
        {sweep > 0 && sweep < 1 && <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', left: `${-50 + sweep * 160}%`, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.5), transparent)', transform: 'skewX(-16deg)', mixBlendMode: 'overlay' }} /></div>}
      </div>
    </div>
    <div data-box="endButton" data-kind="button" style={{ position: 'absolute', left: btn.x, top: btn.y, width: btn.w, height: btn.h, borderRadius: btn.h / 2, background: COLORS.rose, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 24px 60px -24px rgba(244,63,94,.9)', opacity: bp, transform: `translateY(${(1 - bp) * 40}px)`, fontFamily: OUTFIT, fontWeight: 800, fontSize: e.btnFont, color: COLORS.ink, letterSpacing: '-0.02em' }}>
      Book your meeting → getwebdrip.com
    </div>
    <div data-box="endFollow" data-kind="text" style={{ position: 'absolute', left: fol.x, top: fol.y, width: fol.w, height: fol.h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: fp, transform: `translateY(${(1 - fp) * 16}px)`,
      fontFamily: OUTFIT, fontWeight: 500, fontSize: e.follow, color: COLORS.mist }}>
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
      if (/[.?!…]$/.test(w.text) && cur.length >= 2) flush();
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
  const size = f === 'feed' ? 48 : 50;
  return <div style={{ position: 'absolute', left: lane.x, top: lane.y, width: lane.w, height: lane.h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div data-box="subs" data-kind="subs" style={{ display: 'flex', gap: size * 0.28, padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: 18, background: 'rgba(9,9,11,.72)', boxShadow: '0 0 0 1px rgba(250,250,250,.08)',
      opacity: inP, transform: `translateY(${(1 - inP) * 10}px)` }}>
      {c.words.map((w, k) => {
        const next = c.words[k + 1];
        const active = sec >= w.start - 0.03 && (next ? sec < next.start - 0.03 : sec < c.end);
        return <span key={k} style={{ fontFamily: OUTFIT, fontWeight: 800, fontSize: size, letterSpacing: '-0.02em', lineHeight: 1.15, whiteSpace: 'nowrap',
          color: active ? COLORS.rose : COLORS.bone, transform: `translateY(${active ? -2 : 0}px)`, display: 'inline-block' }}>{w.text}</span>;
      })}
    </div>
  </div>;
};

// ---------- compositions ----------
export const Promo: React.FC<{ fmt: Fmt; showGuides?: boolean; logBoxes?: boolean }> = ({ fmt, showGuides, logBoxes }) => {
  useFonts();
  const t = useCurrentFrame();
  useEffect(() => {
    if (!logBoxes) return;
    const h = delayRender('boxes');
    // let images/videos lay out, then log every tagged element's rendered bounding box (after 3D transforms)
    setTimeout(() => {
      const out = Array.from(document.querySelectorAll<HTMLElement>('[data-box]')).map((e) => {
        const r = e.getBoundingClientRect();
        const sc = e.closest('[data-scene]') as HTMLElement | null;
        return { id: e.dataset.box, kind: e.dataset.kind, scene: sc ? sc.dataset.scene : null, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), op: +getComputedStyle(e).opacity };
      });
      console.log('BOXES' + JSON.stringify(out));
      continueRender(h);
    }, 50);
  }, [t, logBoxes]);
  return <AbsoluteFill style={{ background: COLORS.ink, overflow: 'hidden' }}>
    <Background f={fmt} t={t} />
    {SCENES.map((s, i) => (
      <Sequence key={s} from={sceneStart(i)} durationInFrames={sceneEnd(i) - sceneStart(i)} premountFor={30} name={s}>
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
