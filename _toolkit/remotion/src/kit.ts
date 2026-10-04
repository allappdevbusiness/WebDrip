// WebDrip promo kit — reusable layout system for the Feed (4:5) and TikTok (9:16) cuts.
// Pure data + math, imported by the scenes for rendering and by check.mjs for the alignment check.
// No story, scene order or pacing lives here: each run designs those in its own story file.

export type Fmt = 'feed' | 'tiktok';
export type Rect = { x: number; y: number; w: number; h: number };
export type Kind = 'frame' | 'phone' | 'tile' | 'text' | 'subs' | 'logo' | 'button' | 'decor';
export type Box = Rect & { id: string; kind: Kind; important: boolean; offset?: boolean };

export const FPS = 30;
export const SPACE = { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, xxl: 64, xxxl: 96 };

export const CANVAS: Record<Fmt, { w: number; h: number }> = {
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
// below this y, TikTok content must also clear the button column: keep it <= TT_LOW_W wide and centred
export const TT_LOW_Y = 900;
export const TT_LOW_W = 800;
// fixed subtitle lane per cut
export const LANE: Record<Fmt, Rect> = {
  feed: { x: 60, y: 1110, w: 960, h: 100 },
  tiktok: { x: 160, y: 1400, w: 760, h: 100 },
};
// content area = safe area above the subtitle lane (with one spacing step of air)
export const CONTENT: Record<Fmt, Rect> = {
  feed: { x: 60, y: 80, w: 960, h: LANE.feed.y - SPACE.md - 80 },
  tiktok: { x: 120, y: 150, w: 840, h: LANE.tiktok.y - SPACE.md - 150 },
};
export const CX = (f: Fmt) => CANVAS[f].w / 2;
export const centerX = (f: Fmt, w: number) => CX(f) - w / 2;
// vertical start that centres a stack of height h inside the content area
export const stackTop = (f: Fmt, h: number) => CONTENT[f].y + (CONTENT[f].h - h) / 2;

// recorded clip sizes (CSS px)
export const DESK = { w: 1440, h: 900 };
export const MOB = { w: 390, h: 844 };

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
// phone height that gives a frame of width w
export const phoneHForW = (w: number) => {
  let h = w / 0.476;
  for (let i = 0; i < 6; i++) h *= w / phone(h).w;
  return h;
};

export const MAX_TILT: Record<Fmt, number> = { feed: 10, tiktok: 6 };

// ---------- motion ----------
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
// critically damped spring response normalised to land exactly on 1 at t=1 (monotonic, no wobble)
export const springNoOvershoot = (t: number) => { t = clamp(t); const k = 7; return (1 - (1 + k * t) * Math.exp(-k * t)) / (1 - (1 + k) * Math.exp(-k)); };
export const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) });

export function groupRect(bs: Rect[]): Rect {
  const x0 = Math.min(...bs.map((b) => b.x)), y0 = Math.min(...bs.map((b) => b.y));
  const x1 = Math.max(...bs.map((b) => b.x + b.w)), y1 = Math.max(...bs.map((b) => b.y + b.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
// scale a rect about a centre point
export const scaleAbout = (r: Rect, cx: number, cy: number, s: number): Rect => ({ x: cx + (r.x - cx) * s, y: cy + (r.y - cy) * s, w: r.w * s, h: r.h * s });

// a phone box at a given height, its screen rect included (for the clip-fill check)
export const phoneRect = (x: number, y: number, h: number): Rect => ({ x, y, w: phone(h).w, h });
