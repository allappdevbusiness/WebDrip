import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F } from '../theme';
import { riff, CYCLE, beatsAfter } from '../timing';
import { ease, ep, kf, lerp, prog, slam, within } from '../lib/motion';
import { Paper, Poster } from '../components/base';
import { Chip, DishCard, DISHES, Pill, RouteRow, Tap } from '../components/ui';

// 27.354 → 31.191 — the site actually works: filters on riff notes, the route, a booking.
const N = {
  E: riff(7, 'E'),
  E2: riff(7, 'E2'),
  G: riff(7, 'G'),
  E3: riff(7, 'E3'),
  D: riff(7, 'D'),
  Cn: riff(7, 'C'),
  B: riff(7, 'B'),
};
const START = CYCLE[7];
const END = CYCLE[8];

const K = 2;
const CHIPS = [
  { label: 'Everything', cat: 'all', x: 90, y: 250, w: 250 },
  { label: 'De la Brasa', cat: 'brasa', x: 360, y: 250, w: 260 },
  { label: 'Tacos', cat: 'tacos', x: 640, y: 250, w: 170 },
  { label: 'Masa & Maíz', cat: 'masa', x: 90, y: 360, w: 270 },
  { label: 'Del Mar', cat: 'mar', x: 380, y: 360, w: 200 },
  { label: 'Dulce', cat: 'dulce', x: 600, y: 360, w: 160 },
];
const FILTERS: Record<string, (keyof typeof DISHES)[]> = {
  all: ['pollo', 'birria', 'pastor', 'elote', 'pupusas', 'ceviche'],
  tacos: ['birria', 'pastor'],
  mar: ['ceviche', 'cubano'],
  dulce: ['churros'],
};
const TAPS: { at: number; cat: string }[] = [
  { at: N.E2, cat: 'tacos' },
  { at: N.G, cat: 'mar' },
  { at: N.E3, cat: 'dulce' },
  { at: N.D, cat: 'all' },
];
const CW = 300, GAP = 30;
const pos = (i: number) => ({ x: 75 + (i % 3) * (CW + GAP), y: 540 + Math.floor(i / 3) * 430 });

const ROUTE = [
  { day: 'MONDAY', where: 'Rainey St & Davis', hours: '5–10pm' },
  { day: 'TUESDAY', where: 'Closed — prep & market run', hours: 'Closed', dim: true },
  { day: 'WEDNESDAY', where: 'E 6th & Waller — taco night', hours: '11am–9pm' },
  { day: 'THURSDAY', where: 'Zilker Park, Barton Springs', hours: '11am–10pm', today: true },
  { day: 'FRIDAY', where: 'S Congress & Elizabeth', hours: '11am–12am' },
];

export const Interact: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  // --- filters ---
  if (t < N.Cn) {
    const done = TAPS.filter((x) => t >= x.at);
    const cur = done.length ? done[done.length - 1] : null;
    const prevCat = done.length >= 2 ? done[done.length - 2].cat : 'all';
    const curCat = cur ? cur.cat : 'all';
    const m = cur ? ep(t, cur.at, cur.at + 0.2, ease.outCubic) : 1;
    const intro = ep(t, START, START + 0.25, ease.outExpo);
    const all = Array.from(new Set([...FILTERS[prevCat], ...FILTERS[curCat]]));
    return (
      <AbsoluteFill>
        <Paper />
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${lerp(1.3, 1, intro)})`, transformOrigin: '50% 20%' }}>
          {CHIPS.map((c) => {
            const active = c.cat === curCat ? (cur && c.cat === cur.cat ? m : 1) : 0;
            return <Chip key={c.label} label={c.label} active={active} k={K} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, justifyContent: 'center' }} />;
          })}
          {all.map((id) => {
            const pi = FILTERS[prevCat].indexOf(id), ci = FILTERS[curCat].indexOf(id);
            const a = pi >= 0 ? pos(pi) : null, b = ci >= 0 ? pos(ci) : null;
            const p = a && b ? { x: lerp(a.x, b.x, m), y: lerp(a.y, b.y, m) } : (b ?? a)!;
            const s = a && b ? 1 : b ? m : 1 - m;
            if (s <= 0.01) return null;
            return (
              <div key={id} style={{ position: 'absolute', left: p.x, top: p.y, transform: `scale(${s})`, opacity: s }}>
                <DishCard dish={DISHES[id]} w={CW} compact />
              </div>
            );
          })}
          {TAPS.map((x) => {
            const c = CHIPS.find((c) => c.cat === x.cat)!;
            return <Tap key={x.at} t={t} at={x.at} x={c.x + c.w / 2} y={c.y + 44} k={1.6} />;
          })}
        </div>
      </AbsoluteFill>
    );
  }

  // --- route ---
  if (t < N.B) {
    const pulse = 0.5 + 0.5 * Math.cos((t - beatsAfter(N.Cn, 1)) * Math.PI * 2 / 0.48);
    return (
      <AbsoluteFill>
        <Paper color={C.shell} />
        <div style={{ position: 'absolute', left: 90, top: 230, transform: `translateX(${(1 - ep(t, N.Cn, N.Cn + 0.2, ease.outExpo)) * -800}px)` }}>
          <Poster size={44} color={C.rosa} font="body" weight={600} style={{ letterSpacing: 14 }}>LA RUTA</Poster>
          <Poster size={150} color={C.cobalt} style={{ marginTop: 16 }}>WE MOVE.</Poster>
          <Poster size={150} color={C.rosa}>HERE'S WHERE.</Poster>
        </div>
        {ROUTE.map((r, i) => {
          const k = ep(t, N.Cn + 0.04 + i * 0.05, N.Cn + 0.3 + i * 0.05, ease.outExpo);
          return (
            <div key={r.day} style={{ position: 'absolute', left: 90, top: 640 + i * 165, width: 860, transform: `translateX(${(1 - k) * 1100}px) scale(${r.today && t > N.Cn + 0.5 ? 1 + 0.03 * pulse : 1})` }}>
              <RouteRow {...r} k={1.85} />
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  // --- booking ---
  const tapAt = N.B + 0.12;
  const ok = ep(t, beatsAfter(N.B, 1) - 0.02, beatsAfter(N.B, 1) + 0.15, ease.outBack);
  const intro = ep(t, N.B, N.B + 0.2, ease.outExpo);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: 'absolute', left: 90, top: 230, transform: `translateY(${(1 - intro) * -300}px)` }}>
        <Poster size={44} color={C.rosa} font="body" weight={600} style={{ letterSpacing: 14 }}>CATERING & EVENTOS</Poster>
        <Poster size={150} color={C.cobalt} style={{ marginTop: 16 }}>BRING THE</Poster>
        <Poster size={150} color={C.rosa}>TRUCK TO YOU.</Poster>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 720, width: 900, height: 640, borderRadius: 50, background: C.paper, boxShadow: '0 30px 80px rgba(63,42,31,.16)', border: '3px solid rgba(63,42,31,.08)', transform: `translateY(${(1 - intro) * 600}px)`, overflow: 'hidden' }}>
        {ok < 0.05 ? (
          <div style={{ padding: 60 }}>
            {['Your name', 'Event date', 'Guests'].map((l, i) => (
              <div key={l} style={{ marginBottom: 26 }}>
                <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: C.cacao, marginBottom: 10 }}>{l} <span style={{ color: C.rosa }}>*</span></div>
                <div style={{ height: 70, borderRadius: 18, border: '3px solid rgba(63,42,31,.12)', background: C.bone, fontFamily: F.body, fontSize: 30, color: C.cacao, display: 'flex', alignItems: 'center', paddingLeft: 24 }}>{['Rosa Martínez', 'Sat, Nov 14', '120'][i]}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', transform: `scale(${ok})` }}>
            <div>
              <div style={{ width: 150, height: 150, margin: '0 auto', borderRadius: '50%', background: 'rgba(15,157,99,.12)', border: '5px solid rgba(15,157,99,.4)', display: 'grid', placeItems: 'center', fontSize: 80, color: C.jade, fontFamily: F.body, fontWeight: 800 }}>✓</div>
              <Poster size={130} color={C.cobalt} style={{ marginTop: 30 }}>¡LISTO!</Poster>
            </div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1440, transform: `translate(-50%,-50%) scale(${t > tapAt && t < tapAt + 0.12 ? 0.94 : 1})`, opacity: intro }}>
        <Pill label="Request a Quote" bg={C.rosa} k={2.2} />
      </div>
      <Tap t={t} at={tapAt} x={540} y={1440} k={1.8} />
    </AbsoluteFill>
  );
};
