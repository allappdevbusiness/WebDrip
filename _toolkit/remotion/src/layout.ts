// Shared layout system for the WebDrip promo (Feed 4:5 and TikTok 9:16).
// Pure data + math: imported by Promo.tsx for rendering and by check.mjs for the alignment check.
// Every element position derives from these constants — no hand-nudged numbers in the scenes.

export type Fmt = 'feed' | 'tiktok';
export type Rect = { x: number; y: number; w: number; h: number };
export type Box = Rect & { id: string; kind: 'frame' | 'phone' | 'tile' | 'text' | 'subs' | 'logo' | 'button' | 'decor'; important: boolean; offset?: boolean; clip?: { w: number; h: number; screen: Rect } };

export const FPS = 30;
export const DURATION = 1800;
export const SPACE = { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, xxl: 64, xxxl: 96 };
export const COLORS = { ink: '#09090B', char: '#121215', smoke: '#1C1C21', bone: '#FAFAFA', mist: '#A1A1AA', rose: '#F43F5E', roseSoft: '#FB7185', violet: '#A78BFA', wdBlue: '#0075DE', wdSky: '#dcecfa' };

export const CANVAS = {
  feed: { w: 1080, h: 1350 },
  tiktok: { w: 1080, h: 1920 },
};
// safe areas: feed 960x1150 box (60 l/r, 80 top, 120 bottom); tiktok usable 840x1370 at x120-960, y150-1520
export const SAFE: Record<Fmt, Rect> = {
  feed: { x: 60, y: 80, w: 960, h: 1150 },
  tiktok: { x: 120, y: 150, w: 840, h: 1370 },
};
// TikTok UI overlay mock (for the check): anything important must not touch these
export const TT_UI: Rect[] = [
  { x: 0, y: 0, w: 1080, h: 150 },      // top search bar
  { x: 940, y: 900, w: 140, h: 800 },   // right button column
  { x: 0, y: 1520, w: 1080, h: 400 },   // bottom caption area
];
// fixed subtitle lane per cut
export const LANE: Record<Fmt, Rect> = {
  feed: { x: 60, y: 1110, w: 960, h: 100 },
  tiktok: { x: 160, y: 1400, w: 760, h: 100 },
};
// content area = safe area above the subtitle lane (with one spacing step of air)
export const CONTENT: Record<Fmt, Rect> = {
  feed: { x: 60, y: 80, w: 960, h: 1110 - SPACE.md - 80 },
  tiktok: { x: 120, y: 150, w: 840, h: 1400 - SPACE.md - 150 },
};
export const CX = (f: Fmt) => CANVAS[f].w / 2;

// recorded clip sizes (CSS px)
export const DESK = { w: 1440, h: 900 };
export const MOB = { w: 390, h: 844 };

// scene boundaries (frames) snapped to beats / music phrase hits
export const B = [0, 155, 297, 451, 604, 746, 901, 1054, 1278, 1505, 1800];
export const X = 8; // half transition length (frames) -> 16 frames ≈ 0.53 s
export const SCENES = ['hook', 'hero', 'nav', 'styles', 'spot', 'artists', 'form', 'dscroll', 'mobile', 'end'] as const;
export type SceneId = typeof SCENES[number];
export const sceneStart = (i: number) => Math.max(0, B[i] - (i === 0 ? 0 : X));
export const sceneEnd = (i: number) => Math.min(DURATION, B[i + 1] + (i === SCENES.length - 1 ? 0 : X));

export const LABELS: Record<SceneId, { kicker: string; title: string }> = {
  hook: { kicker: '', title: '' },
  hero: { kicker: '01 — Hero', title: 'Photos that move as you scroll' },
  nav: { kicker: '02 — Navigation', title: 'A menu that stays tidy' },
  styles: { kicker: '03 — Styles', title: 'Every style, priced up front' },
  spot: { kicker: '04 — Spotlight', title: 'A stage for Flash Fridays' },
  artists: { kicker: '05 — Artists', title: 'Book an artist in one tap' },
  form: { kicker: '06 — Booking', title: 'A form that checks itself' },
  dscroll: { kicker: 'Desktop', title: 'Smooth from top to bottom' },
  mobile: { kicker: 'Mobile', title: 'Looks great on any phone' },
  end: { kicker: '', title: '' },
};

// ---------- element geometry ----------
export const LABEL_H: Record<Fmt, { kicker: number; title: number; gap: number }> = {
  feed: { kicker: 26, title: 60, gap: 14 },
  tiktok: { kicker: 30, title: 56, gap: 16 },
};
export const labelHeight = (f: Fmt) => LABEL_H[f].kicker * 1.3 + LABEL_H[f].gap + LABEL_H[f].title * 1.1;

// browser frame keeps the 1440x900 aspect inside its content area
export function browser(w: number) {
  const bar = Math.round(w * 0.038);
  const screenH = (w * DESK.h) / DESK.w;
  return { w, h: bar + screenH, bar, screenH };
}
// phone frame keeps the 390x844 aspect inside its screen
export function phone(h: number) {
  const bezel = Math.round(h * 0.013);
  const sh = h - 2 * bezel;
  const sw = (sh * MOB.w) / MOB.h;
  return { w: sw + 2 * bezel, h, bezel, sw, sh, r: Math.round((sw + 2 * bezel) * 0.13) };
}

export const FEED_FRAME_W = 920;
export const TT_PHONE_H = 1030;
export const FEED_PHONE_H = 860;
export const PUSH = 1.03; // max slow push-in scale during holds

export type SceneLayout = { boxes: Box[] };

const centerX = (f: Fmt, w: number) => CX(f) - w / 2;

// resting layout of each scene (before motion transforms)
export function sceneLayout(f: Fmt, s: SceneId): SceneLayout {
  const C = CONTENT[f];
  const L = labelHeight(f);
  const boxes: Box[] = [];
  const label = (y: number) => boxes.push({ id: 'label', kind: 'text', important: true, x: C.x, y, w: C.w, h: L });
  if (s === 'hook') {
    if (f === 'feed') {
      const bf = browser(FEED_FRAME_W);
      const textH = 92 + SPACE.sm + 46;
      const total = bf.h + SPACE.xl + textH;
      const top = C.y + (C.h - total) / 2;
      boxes.push({ id: 'frame', kind: 'frame', important: true, x: centerX(f, bf.w), y: top, w: bf.w, h: bf.h, clip: { w: DESK.w, h: DESK.h, screen: { x: centerX(f, bf.w), y: top + bf.bar, w: bf.w, h: bf.screenH } } });
      boxes.push({ id: 'brand', kind: 'text', important: true, x: C.x, y: top + bf.h + SPACE.xl, w: C.w, h: textH });
    } else {
      const tw = 760, th = 770;
      const textH = 100 + SPACE.sm + 50;
      const total = th + SPACE.xl + textH;
      const top = C.y + (C.h - total) / 2;
      boxes.push({ id: 'tile', kind: 'tile', important: true, x: centerX(f, tw), y: top, w: tw, h: th });
      boxes.push({ id: 'brand', kind: 'text', important: true, x: centerX(f, 780), y: top + th + SPACE.xl, w: 780, h: textH });
    }
    return { boxes };
  }
  if (s === 'end') {
    const E = endCard(f);
    return { boxes: E };
  }
  if (f === 'feed') {
    if (s === 'mobile') {
      const p = phone(FEED_PHONE_H);
      const total = L + SPACE.lg + p.h;
      const top = C.y + (C.h - total) / 2;
      label(top);
      const bf = browser(FEED_FRAME_W);
      boxes.push({ id: 'backdrop', kind: 'decor', important: false, x: centerX(f, bf.w), y: top + L + SPACE.lg + (p.h - bf.h) / 2, w: bf.w, h: bf.h });
      boxes.push({ id: 'phone', kind: 'phone', important: true, x: centerX(f, p.w), y: top + L + SPACE.lg, w: p.w, h: p.h, clip: { w: MOB.w, h: MOB.h, screen: { x: centerX(f, p.sw), y: top + L + SPACE.lg + p.bezel, w: p.sw, h: p.sh } } });
      return { boxes };
    }
    const bf = browser(FEED_FRAME_W);
    const total = L + SPACE.lg + bf.h;
    const top = C.y + (C.h - total) / 2;
    label(top);
    const fy = top + L + SPACE.lg;
    boxes.push({ id: 'frame', kind: 'frame', important: true, x: centerX(f, bf.w), y: fy, w: bf.w, h: bf.h, clip: { w: DESK.w, h: DESK.h, screen: { x: centerX(f, bf.w), y: fy + bf.bar, w: bf.w, h: bf.screenH } } });
    return { boxes };
  }
  // tiktok
  if (s === 'dscroll') {
    // two stacked windows onto the same scrolling page (the lower one runs ahead), each at 0.62x
    const tw = 760, th = 520;
    const total = L + SPACE.lg + th * 2 + SPACE.md;
    const top = C.y + (C.h - total) / 2;
    label(top);
    boxes.push({ id: 'tile', kind: 'tile', important: true, x: centerX(f, tw), y: top + L + SPACE.lg, w: tw, h: th });
    boxes.push({ id: 'tile2', kind: 'tile', important: true, x: centerX(f, tw), y: top + L + SPACE.lg + th + SPACE.md, w: tw, h: th });
    return { boxes };
  }
  const p = phone(s === 'mobile' ? TT_PHONE_H + 40 : TT_PHONE_H);
  const total = L + SPACE.lg + p.h;
  const top = C.y + (C.h - total) / 2;
  label(top);
  const py = top + L + SPACE.lg;
  boxes.push({ id: 'backdrop', kind: 'decor', important: false, x: centerX(f, 780), y: py + p.h * 0.12, w: 780, h: p.h * 0.76 });
  boxes.push({ id: 'phone', kind: 'phone', important: true, x: centerX(f, p.w), y: py, w: p.w, h: p.h, clip: { w: MOB.w, h: MOB.h, screen: { x: centerX(f, p.sw), y: py + p.bezel, w: p.sw, h: p.sh } } });
  return { boxes };
}

// end card stack: headline (3 lines), logo + wordmark, button, follow line
export const END = {
  feed: { head: 76, headLH: 1.02, logoMark: 132, word: 100, button: 84, btnFont: 34, follow: 30, gapA: SPACE.xxl, gapB: SPACE.xxl, gapC: SPACE.lg },
  tiktok: { head: 90, headLH: 1.02, logoMark: 128, word: 88, button: 96, btnFont: 36, follow: 34, gapA: 80, gapB: 80, gapC: SPACE.xl },
};
export function endCard(f: Fmt): Box[] {
  const C = CONTENT[f];
  const e = END[f];
  const headH = e.head * e.headLH * 3;
  const logoH = e.logoMark;
  const followH = e.follow * 1.3;
  const total = headH + e.gapA + logoH + e.gapB + e.button + e.gapC + followH;
  let y = C.y + (C.h - total) / 2;
  const maxW = f === 'tiktok' ? 780 : C.w;
  const out: Box[] = [];
  out.push({ id: 'endHead', kind: 'text', important: true, x: CX(f) - maxW / 2, y, w: maxW, h: headH }); y += headH + e.gapA;
  const logoW = Math.round((f === 'feed' ? C.w : 840) * 0.6);
  out.push({ id: 'endLogo', kind: 'logo', important: true, x: CX(f) - logoW / 2, y, w: logoW, h: logoH }); y += logoH + e.gapB;
  const btnW = f === 'feed' ? 760 : 760;
  out.push({ id: 'endButton', kind: 'button', important: true, x: CX(f) - btnW / 2, y, w: btnW, h: e.button }); y += e.button + e.gapC;
  const fw = f === 'feed' ? 560 : 600;
  out.push({ id: 'endFollow', kind: 'text', important: true, x: CX(f) - fw / 2, y, w: fw, h: followH });
  return out;
}

// ---------- motion ----------
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// critically damped ease (no overshoot)
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
// critically damped spring response normalised to land exactly on 1 at t=1 (monotonic, no wobble)
export const springNoOvershoot = (t: number) => { t = clamp(t); const k = 7; return (1 - (1 + k * t) * Math.exp(-k * t)) / (1 - (1 + k) * Math.exp(-k)); };

export type Motion = { scale: number; push: number; tx: number; ty: number; rotX: number; rotY: number; opacity: number; blur: number; wipe: number };
export const TRANSITION_IN: Record<SceneId, 'blur' | 'wipe' | 'push' | 'scale' | 'none'> = {
  hook: 'none', hero: 'blur', nav: 'wipe', styles: 'push', spot: 'scale', artists: 'wipe', form: 'blur', dscroll: 'push', mobile: 'scale', end: 'wipe',
};
export const MAX_TILT: Record<Fmt, number> = { feed: 10, tiktok: 6 };

// main-group motion for scene i at absolute frame t (applied about the group's centre)
export function sceneMotion(f: Fmt, i: number, t: number): Motion {
  const s = SCENES[i];
  const st = sceneStart(i), en = sceneEnd(i);
  const inP = i === 0 ? 1 : clamp((t - st) / (2 * X));
  const outP = i === SCENES.length - 1 ? 0 : clamp((t - (en - 2 * X)) / (2 * X));
  const ei = easeInOut(inP), eo = easeInOut(outP);
  const tilt = MAX_TILT[f] * 0.55;
  // tilt settles within 18 frames (0.6 s) of the scene start
  const settle = easeOut(clamp((t - st) / 18));
  const dir = i % 2 === 0 ? 1 : -1;
  const pushT = clamp((t - (st + 2 * X)) / Math.max(1, en - st - 4 * X));
  let m: Motion = { scale: 1, push: 1 + (PUSH - 1) * easeInOut(pushT), tx: 0, ty: 0, rotX: 0, rotY: 0, opacity: 1, blur: 0, wipe: 1 };
  if (s !== 'hook' && s !== 'end') { m.rotY = dir * tilt * (1 - settle); m.rotX = tilt * 0.4 * (1 - settle); }
  const tr = TRANSITION_IN[s];
  if (tr === 'blur') { m.opacity = ei; m.blur = 14 * (1 - ei); m.scale *= 0.97 + 0.03 * ei; }
  if (tr === 'push') { m.ty = 70 * (1 - ei); m.opacity = ei; }
  if (tr === 'scale') { m.scale *= 0.92 + 0.08 * ei; m.opacity = ei; }
  if (tr === 'wipe') { m.wipe = ei; }
  // exit: soft fade, slight scale up and blur
  if (outP > 0) { m.opacity *= 1 - eo; m.blur += 10 * eo; m.scale *= 1 + 0.03 * eo; }
  if (s === 'hook') {
    // macro pull-back: lands on the beat at ~2.0 s
    const p = springNoOvershoot(clamp(t / 62));
    m.scale = 2.5 - 1.5 * p;
    m.rotX = (f === 'feed' ? 8 : 5) * (1 - p);
    m.push = 1 + (PUSH - 1) * easeInOut(clamp((t - 62) / 90));
  }
  return m;
}

// boxes after motion (scale about the group centre + translate), for the checker
export function boxesAt(f: Fmt, t: number): { scene: SceneId; i: number; boxes: Box[]; motion: Motion }[] {
  const out: { scene: SceneId; i: number; boxes: Box[]; motion: Motion }[] = [];
  SCENES.forEach((s, i) => {
    if (t < sceneStart(i) || t >= sceneEnd(i)) return;
    const lay = sceneLayout(f, s);
    const m = sceneMotion(f, i, t);
    const g = groupRect(lay.boxes.filter((b) => b.kind !== 'text'));
    const cx = g.x + g.w / 2, cy = g.y + g.h / 2;
    const boxes = lay.boxes.map((b) => {
      if (b.kind === 'text' && s !== 'hook' && s !== 'end') return b; // labels don't scale
      if (s === 'end' || b.kind === 'text') return b;
      const sc = m.scale * m.push;
      return { ...b, x: cx + (b.x - cx) * sc + m.tx, y: cy + (b.y - cy) * sc + m.ty, w: b.w * sc, h: b.h * sc };
    });
    out.push({ scene: s, i, boxes, motion: m });
  });
  return out;
}
export function groupRect(bs: Rect[]): Rect {
  const x0 = Math.min(...bs.map((b) => b.x)), y0 = Math.min(...bs.map((b) => b.y));
  const x1 = Math.max(...bs.map((b) => b.x + b.w)), y1 = Math.max(...bs.map((b) => b.y + b.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
