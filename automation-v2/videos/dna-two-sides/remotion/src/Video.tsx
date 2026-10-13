// "One Technology. Two Lives." — Higgsfield footage assembled, re-timed and finished in Remotion.
// Every clip is a 24 fps JPG sequence (public/f/<clip>/NNN.jpg) so each shot can be speed-ramped
// frame by frame onto the voiceover; overlays and the mix read the same numbers from timeline.ts.
import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import { useFonts } from './frames';
import { FPS, SC, T, VO } from './timeline';
import captions from './captions.json';

// ---------- helpers ----------
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (s: number, a: number, b: number) => clamp((s - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const eo = (p: number) => 1 - Math.pow(1 - clamp(p), 3);
const eio = (p: number) => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
const ei = (p: number) => Math.pow(clamp(p), 3);
const inOut = (s: number, a: number, b: number, fin = 0.25, fout = 0.3) => Math.min(eo(ramp(s, a, a + fin)), 1 - ei(ramp(s, b - fout, b)));
// piecewise-linear time remap: video seconds -> source seconds
const remap = (pts: [number, number][]) => (s: number) => {
  if (s <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (s <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (s - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
  return pts[pts.length - 1][1];
};

const C = { paper: '#F2ECDF', amber: '#E8A33D', red: '#D23B2E', ink: '#0B0B0C', dim: 'rgba(242,236,223,.62)', cyan: '#9FD3E0' };
const MONO = 'JetBrains Mono, monospace';
const HEAD = 'Barlow Condensed, Inter, sans-serif';
const BODY = 'Inter, sans-serif';

// ---------- footage ----------
const N = 97;
const pad = (i: number) => String(i).padStart(3, '0');
const Clip: React.FC<{ name: string; t: number; style?: React.CSSProperties; blend?: boolean }> = ({ name, t, style, blend = true }) => {
  const x = clamp(t * 24, 0, N - 1);
  const i = Math.floor(x); const f = x - i;
  const img = (k: number, o: number) => <Img src={staticFile(`f/${name}/${pad(Math.min(N, k + 1))}.jpg`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: o }} />;
  return <AbsoluteFill style={style}>{img(i, 1)}{blend && f > 0.04 && i < N - 1 ? img(i + 1, f) : null}</AbsoluteFill>;
};
const Still: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
);
// camera move on a layer: scale about an origin plus drift
const Cam: React.FC<{ z: number; x?: number; y?: number; ox?: string; oy?: string; children: React.ReactNode; filter?: string }> = ({ z, x = 0, y = 0, ox = '50%', oy = '50%', children, filter }) => (
  <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${z})`, transformOrigin: `${ox} ${oy}`, filter }}>{children}</AbsoluteFill>
);

// ---------- type ----------
const Label: React.FC<{ s: number; at: number; out: number; text: string; x?: number; y: number; size?: number; color?: string; align?: 'center' | 'left'; rule?: boolean }> =
  ({ s, at, out, text, x = 540, y, size = 34, color = C.paper, align = 'center', rule = true }) => {
    const o = inOut(s, at, out, 0.18, 0.25);
    if (o <= 0) return null;
    const chars = Math.round(text.length * eo(ramp(s, at, at + 0.35)));
    return <div style={{ position: 'absolute', left: align === 'center' ? x - 420 : x, top: y, width: 840, textAlign: align, opacity: o }}>
      {rule && <div style={{ width: 64 * eo(ramp(s, at, at + 0.3)), height: 3, background: C.amber, margin: align === 'center' ? '0 auto 16px' : '0 0 16px' }} />}
      <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: '0.22em', color, textShadow: '0 2px 18px rgba(0,0,0,.85)' }}>{text.slice(0, chars)}</span>
    </div>;
  };
const Head: React.FC<{ s: number; at: number; out: number; text: string; y: number; size: number; color?: string; x?: number; w?: number; punch?: boolean; spacing?: number; align?: 'center' | 'left' | 'right' }> =
  ({ s, at, out, text, y, size, color = C.paper, x = 540, w = 840, punch = true, spacing = 0.02, align = 'center' }) => {
    const o = inOut(s, at, out, 0.12, 0.3);
    if (o <= 0) return null;
    const p = eo(ramp(s, at, at + 0.35));
    const sc = punch ? lerp(1.18, 1, p) : 1;
    const blur = punch ? (1 - p) * 10 : 0;
    const left = align === 'center' ? x - w / 2 : align === 'left' ? x : x - w;
    return <div style={{ position: 'absolute', left, top: y, width: w, textAlign: align, opacity: o, transform: `scale(${sc})`, transformOrigin: 'center', filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 0.95, letterSpacing: `${spacing}em`, textTransform: 'uppercase', color, textShadow: '0 6px 40px rgba(0,0,0,.75)' }}>{text}</span>
    </div>;
  };
const Flash: React.FC<{ s: number; at: number; d?: number; color?: string; max?: number }> = ({ s, at, d = 0.25, color = '#fff', max = 0.85 }) => {
  const p = ramp(s, at, at + d);
  if (p <= 0 || p >= 1) return null;
  return <AbsoluteFill style={{ background: color, opacity: max * (1 - eo(p)) }} />;
};
const Black: React.FC<{ o: number }> = ({ o }) => (o > 0 ? <AbsoluteFill style={{ background: '#000', opacity: o }} /> : null);

// ---------- captions ----------
type W = { text: string; start: number; end: number };
const chunks = (() => {
  const out: { words: W[]; start: number; end: number }[] = [];
  (captions as { id: string; words: W[] }[]).forEach((line) => {
    let cur: W[] = [];
    const flush = () => { if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
    line.words.forEach((w) => {
      const len = cur.map((c) => c.text).join(' ').length + w.text.length + 1;
      if (cur.length >= 4 || (cur.length >= 2 && len > 26)) flush();
      cur.push(w);
      if (/[.?!,:]$/.test(w.text) && cur.length >= 2) flush();
    });
    flush();
  });
  out.forEach((c, k) => { const nx = out[k + 1]; c.end = Math.min(c.end + 0.5, nx ? nx.start : c.end + 0.5); });
  return out;
})();
const Captions: React.FC<{ s: number }> = ({ s }) => {
  const c = chunks.find((k) => s >= k.start - 0.05 && s < k.end);
  if (!c) return null;
  const o = eo(ramp(s, c.start - 0.05, c.start + 0.1));
  return <div style={{ position: 'absolute', left: 140, top: 1400, width: 800, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', gap: 13, padding: '8px 22px', borderRadius: 14, background: 'rgba(8,8,9,.58)', opacity: o, transform: `translateY(${(1 - o) * 8}px)` }}>
      {c.words.map((w, k) => {
        const nx = c.words[k + 1];
        const active = s >= w.start - 0.03 && (nx ? s < nx.start - 0.03 : s < c.end);
        return <span key={k} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 50, lineHeight: 1.15, whiteSpace: 'nowrap', color: active ? C.amber : C.paper }}>{w.text}</span>;
      })}
    </div>
  </div>;
};

// ---------- grain + vignette ----------
const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ mixBlendMode: 'overlay', opacity: 0.32, pointerEvents: 'none' }}>
    <svg width="1080" height="1920"><filter id={`g${f % 7}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="1080" height="1920" filter={`url(#g${f % 7})`} /></svg>
  </AbsoluteFill>
);
const Vignette: React.FC = () => <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 48%, transparent 55%, rgba(0,0,0,.62) 100%)', pointerEvents: 'none' }} />;

// ---------- scenes ----------
const inSc = (s: number, w: readonly [number, number], padA = 0, padB = 0) => s >= w[0] - padA && s < w[1] + padB;

const MapScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[0, 0], [4.0, 4.04]])(s);
  const ring = (at: number, out: number, y: number) => {
    const p = eo(ramp(s, at, at + 0.4)); const o = inOut(s, at, out, 0.15, 0.25);
    return o > 0 ? <div style={{ position: 'absolute', left: 540 - 60 * (2 - p), top: y - 60 * (2 - p), width: 120 * (2 - p), height: 120 * (2 - p), borderRadius: 999, border: `3px solid ${C.amber}`, opacity: o * 0.9, boxShadow: `0 0 30px ${C.amber}` }} /> : null;
  };
  return <AbsoluteFill>
    <Cam z={lerp(1.0, 1.06, eio(ramp(s, 0, 4)))}><Clip name="v1" t={t} /></Cam>
    {ring(T.virginia, T.richmond - 0.05, 930)}
    <Label s={s} at={T.virginia} out={T.richmond - 0.05} text="VIRGINIA" y={1010} size={46} />
    {ring(T.richmond, 3.3, 930)}
    <Label s={s} at={T.richmond} out={3.3} text="RICHMOND" y={1010} size={46} />
    <Head s={s} at={T.y1987} out={4.1} text="1987" y={420} size={250} spacing={0.06} />
  </AbsoluteFill>;
};

const StreetScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.street[0], 0.1], [SC.street[1], 2.6]])(s);
  return <AbsoluteFill>
    <Cam z={lerp(1.02, 1.08, ramp(s, SC.street[0], SC.street[1]))}><Clip name="v13" t={t} /></Cam>
    <Label s={s} at={4.15} out={6.2} text="RICHMOND, VA · 1987" y={230} size={30} />
  </AbsoluteFill>;
};

const DESK_PTS: [number, number][] = [[240, 600], [645, 885], [285, 930], [300, 1290]];
const DeskScene: React.FC<{ s: number }> = ({ s }) => {
  const sl = T.slam;
  const t = remap([[SC.desk[0], 0.12], [sl[0], 0.58], [sl[1], 1.07], [sl[2], 1.35], [sl[3], 1.75], [SC.desk[1], 4.04]])(s);
  const n = sl.filter((x) => s >= x).length;
  const kick = sl.reduce((a, x, i) => a + (s >= x ? Math.exp(-(s - x) * 14) * (i === 3 ? 14 : 8) : 0), 0);
  const line = ramp(s, 9.35, 10.3);
  const pairs: [number, number][] = [[0, 2], [2, 3], [0, 1], [1, 3], [2, 1]];
  return <AbsoluteFill>
    <Cam z={1.04 + kick * 0.002} y={kick * 0.6}><Clip name="v2" t={t} /></Cam>
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      {pairs.map(([a, b], k) => {
        const p = eio(ramp(line, k * 0.12, k * 0.12 + 0.5)); if (p <= 0) return null;
        const A = DESK_PTS[a], B = DESK_PTS[b];
        return <line key={k} x1={A[0]} y1={A[1]} x2={lerp(A[0], B[0], p)} y2={lerp(A[1], B[1], p)} stroke={C.red} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.red})` }} />;
      })}
      {DESK_PTS.map((P, k) => line > 0.05 ? <circle key={k} cx={P[0]} cy={P[1]} r={11} fill={C.red} opacity={eo(ramp(line, 0, 0.3))} /> : null)}
    </svg>
    {n > 0 && <div style={{ position: 'absolute', left: 140, top: 170, width: 400, textAlign: 'left' }}>
      <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: '0.24em', color: C.dim }}>OPEN CASES</div>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 210, lineHeight: 1, color: C.paper, transform: `scale(${1 + kick * 0.012})`, transformOrigin: 'left center', textShadow: '0 6px 40px rgba(0,0,0,.8)' }}>{n}</div>
    </div>}
  </AbsoluteFill>;
};

const DATES = ['SEPTEMBER 1987', 'OCTOBER 1987', 'NOVEMBER 1987'];
const TimelineScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.timeline[0], 0], [T.samePattern, 3.6], [T.samePattern + 0.46, 4.04]])(s);
  const after = ramp(s, T.samePattern, SC.timeline[1]);
  return <AbsoluteFill>
    <Cam z={1.02 + after * 0.05}><Clip name="v3" t={t} /></Cam>
    {DATES.map((d, i) => {
      const at = T.dates[i];
      const p = ramp(s, at - 0.2, at + 1.0);
      const collapse = ramp(s, T.samePattern - 0.35, T.samePattern);
      if (p <= 0 || (p >= 1 && collapse <= 0) || s > T.samePattern) return null;
      // each date flies at the lens, then settles small in its slot until all collapse together
      const fly = eio(p);
      const slotY = 760 + i * 120;
      const z = p < 1 ? lerp(0.35, 2.6, ei(p)) : 0.42;
      const o = p < 1 ? Math.min(eo(ramp(s, at - 0.2, at)), 1 - ramp(p, 0.62, 0.95)) : 0.0;
      const keep = s >= at + 0.75 ? eo(ramp(s, at + 0.75, at + 0.95)) * (1 - collapse) : 0;
      return <React.Fragment key={i}>
        {o > 0 && <div style={{ position: 'absolute', left: 0, top: 860 - 60, width: 1080, textAlign: 'center', opacity: o, transform: `scale(${z})`, filter: `blur(${Math.max(0, (fly - 0.55) * 18)}px)` }}>
          <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, letterSpacing: '0.04em', color: C.paper, textShadow: '0 4px 30px rgba(0,0,0,.8)' }}>{d}</span></div>}
        {keep > 0 && <div style={{ position: 'absolute', left: 0, top: lerp(slotY - 520, 900, eio(collapse)), width: 1080, textAlign: 'center', opacity: keep }}>
          <span style={{ fontFamily: MONO, fontSize: 34, letterSpacing: '0.22em', color: C.amber }}>{d}</span></div>}
      </React.Fragment>;
    })}
    <Flash s={s} at={T.samePattern} d={0.3} max={0.6} />
    <Head s={s} at={T.samePattern} out={SC.timeline[1] + 0.05} text="SAME PATTERN." y={820} size={170} />
  </AbsoluteFill>;
};

const PINS = [{ t: 'RICHMOND', x: 150, y: 430 }, { t: 'CHESTERFIELD', x: 520, y: 640 }, { t: 'ARLINGTON', x: 180, y: 1180 }];
const BoardScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.board[0], 0], [T.stop, 4.04]])(s);
  const stopped = s >= T.stop;
  const z = stopped ? lerp(1.0, 1.07, eo(ramp(s, T.stop, SC.board[1]))) : 1.0;
  const conn = eio(ramp(s, T.connect, T.connect + 0.9));
  const slot = eo(ramp(s, T.stop + 0.05, T.stop + 0.35));
  const pinXY = PINS.map((p) => [p.x + 22, p.y + 22]);
  return <AbsoluteFill>
    <Cam z={z} oy="50%"><Clip name="v4" t={t} style={{ filter: stopped ? `saturate(${lerp(1, 0.55, slot)}) brightness(${lerp(1, 0.7, slot)})` : undefined }} />
      {slot > 0 && <div style={{ position: 'absolute', left: 555 - 165, top: 954 - 200, width: 330, height: 400, background: 'rgba(12,10,9,.94)', outline: `3px dashed ${C.paper}`, outlineOffset: -14, opacity: slot,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.7)' }}>
        <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 280, color: C.paper, transform: `scale(${lerp(1.4, 1, slot)})` }}>?</span></div>}
    </Cam>
    {!stopped && <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      {conn > 0 && [[0, 1], [1, 2], [2, 0]].map(([a, b], k) => {
        const p = clamp(conn * 3 - k); const A = pinXY[a], B = pinXY[b];
        return p > 0 ? <line key={k} x1={A[0]} y1={A[1]} x2={lerp(A[0], B[0], p)} y2={lerp(A[1], B[1], p)} stroke={C.amber} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${C.amber})` }} /> : null;
      })}
    </svg>}
    {!stopped && PINS.map((p, i) => {
      const at = T.pins[i]; const o = eo(ramp(s, at, at + 0.18)); if (o <= 0) return null;
      return <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, opacity: o, transform: `scale(${lerp(1.3, 1, o)})`, transformOrigin: '22px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 99, background: C.red, boxShadow: `0 0 18px ${C.red}`, border: '4px solid #f6e7d5' }} />
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 34, letterSpacing: '0.16em', color: C.ink, background: C.paper, padding: '6px 14px' }}>{p.t}</span>
      </div>;
    })}
  </AbsoluteFill>;
};

const Strike: React.FC<{ s: number; at: number; strike: number; out: number; text: string; y: number }> = ({ s, at, strike, out, text, y }) => {
  const o = inOut(s, at, out, 0.18, 0.3); if (o <= 0) return null;
  const p = eio(ramp(s, strike, strike + 0.3));
  return <div style={{ position: 'absolute', left: 0, top: y, width: 1080, display: 'flex', justifyContent: 'center', opacity: o }}>
    <div style={{ position: 'relative', padding: '6px 18px', background: 'rgba(8,8,10,.55)' }}>
      <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 38, letterSpacing: '0.2em', color: p > 0.5 ? C.dim : C.paper }}>{text}</span>
      <div style={{ position: 'absolute', left: 10, top: '50%', height: 5, width: `calc(${p * 100}% - 20px)`, background: C.red }} />
    </div>
  </div>;
};
const PrintScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.print[0], 0], [SC.print[1], 4.04]])(s);
  return <AbsoluteFill>
    <Cam z={lerp(1.0, 1.1, ramp(s, SC.print[0], SC.print[1]))}><Clip name="v5" t={t} /></Cam>
    <Strike s={s} at={22.95} strike={T.printStrike} out={24.8} text="FINGERPRINT" y={300} />
    <Strike s={s} at={24.85} strike={T.sketchStrike} out={26.4} text="WITNESS SKETCH" y={300} />
    <Black o={eio(ramp(s, T.dark, SC.print[1]))} />
  </AbsoluteFill>;
};

// autoradiograph lanes: crime-scene sample vs suspect sample, aligned on the word "matched"
const BANDS = [140, 205, 236, 310, 352, 431, 470, 548, 590, 640, 702, 760, 800];
const BW = [14, 8, 18, 10, 6, 16, 9, 12, 7, 15, 9, 13, 8];
const Lane: React.FC<{ x: number; shift: (i: number) => number; label: string; o: number }> = ({ x, shift, label, o }) => (
  <div style={{ position: 'absolute', left: x, top: 590, width: 170, height: 800, opacity: o }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(210,235,240,.10), rgba(210,235,240,.04))', border: '1px solid rgba(220,240,245,.28)' }} />
    {BANDS.map((y, i) => <div key={i} style={{ position: 'absolute', left: 14, width: 142, top: y * 0.92 + shift(i) - 50, height: BW[i], borderRadius: 3, background: 'rgba(14,14,16,.92)', boxShadow: '0 0 6px rgba(0,0,0,.6)' }} />)}
    <div style={{ position: 'absolute', top: -46, left: -40, width: 250, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: MONO, fontSize: 24, letterSpacing: '0.14em', color: C.cyan }}>{label}</div>
  </div>
);
const DnaScene: React.FC<{ s: number }> = ({ s }) => {
  const [a] = SC.dna;
  const head = remap([[a, 0.15], [28.5, 1.95]])(s);
  const tail = remap([[T.through, 2.05], [SC.dna[1], 4.04]])(s);
  const lanesIn = eo(ramp(s, 28.2, 28.8));
  const slide = eio(ramp(s, 28.6, T.match - 0.25));
  const settle = eio(ramp(s, T.match - 0.9, T.match));
  const jitter = (i: number) => (1 - settle) * (Math.sin(i * 7.3 + s * 9) * 38 + ((i * 53) % 61) - 30);
  const matched = s >= T.match;
  const through = ramp(s, T.through - 0.35, T.through + 0.25);
  const lanesZ = lerp(1, 7, ei(through));
  return <AbsoluteFill style={{ background: '#000' }}>
    {s < T.through ? <>
      <Cam z={lerp(1.05, 1.35, eio(ramp(s, a, 28.6)))}><Clip name="v6" t={head} /></Cam>
      {s >= 28.1 && <AbsoluteFill style={{ opacity: eo(ramp(s, 28.1, 28.5)) }}><Cam z={lerp(1.12, 1.0, ramp(s, 28.1, T.through))}>
        <Clip name="v15" t={remap([[28.1, 0], [T.through, 4.04]])(s)} style={{ filter: 'brightness(0.42) saturate(0.7)' }} /></Cam></AbsoluteFill>}
      <Cam z={lanesZ} oy="54%"><AbsoluteFill style={{ opacity: 1 - ramp(through, 0.6, 1) }}>
        <Lane x={lerp(170, 352, slide)} shift={() => 0} label="CRIME SCENE" o={lanesIn} />
        <Lane x={lerp(740, 558, slide)} shift={jitter} label="SUSPECT" o={lanesIn} />
        {matched && BANDS.map((y, i) => {
          const p = eo(ramp(s, T.match + i * 0.025, T.match + i * 0.025 + 0.2));
          return <div key={i} style={{ position: 'absolute', left: 330, top: 590 + y * 0.92 - 50 + BW[i] / 2 - 1, width: 420 * p, height: 2, background: C.amber, boxShadow: `0 0 10px ${C.amber}`, opacity: 0.9 }} />;
        })}
      </AbsoluteFill></Cam>
    </> : <Cam z={lerp(1.12, 1.0, eo(ramp(s, T.through, T.through + 0.6)))}><Clip name="v6" t={tail} /></Cam>}
    <Flash s={s} at={T.dna} d={0.3} max={0.9} />
    {matched && s < T.through && <>
      <Flash s={s} at={T.match} d={0.18} max={0.5} color={C.amber} />
      <div style={{ position: 'absolute', left: 0, top: 250, width: 1080, textAlign: 'center', opacity: inOut(s, T.match, T.through, 0.08, 0.2) }}>
        <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 150, letterSpacing: '0.12em', color: C.amber, textShadow: `0 0 40px rgba(232,163,61,.6)` }}>MATCH</span>
      </div>
    </>}
    <Label s={s} at={T.spencer} out={T.through + 0.1} text="TIMOTHY W. SPENCER" y={425} size={36} />
    <Head s={s} at={T.y1988} out={SC.court[0] + 1.6} text="1988" y={330} size={250} spacing={0.06} />
  </AbsoluteFill>;
};

const CourtScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.court[0], 0], [SC.court[1], 4.04]])(s);
  return <AbsoluteFill>
    <Cam z={1.03}><Clip name="v14" t={t} /></Cam>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 38%)' }} />
    <Label s={s} at={SC.court[0] + 0.2} out={SC.court[1]} text="ARLINGTON, VA · JULY 1988" y={220} size={30} />
    <Head s={s} at={T.first} out={SC.court[1]} text="VIRGINIA'S FIRST CRIMINAL TRIAL" y={330} size={92} w={820} />
    <Head s={s} at={T.admit} out={SC.court[1]} text="TO ADMIT DNA EVIDENCE" y={545} size={92} w={820} color={C.amber} />
  </AbsoluteFill>;
};

const VICTIMS = [
  { n: 'DEBBIE DUDLEY DAVIS', c: 'RICHMOND' },
  { n: 'SUSAN HELLAMS', c: 'RICHMOND' },
  { n: 'DIANE CHO', c: 'CHESTERFIELD COUNTY' },
  { n: 'SUSAN TUCKER', c: 'ARLINGTON' },
];
const FX = [321, 471, 630, 786];
const CasesScene: React.FC<{ s: number }> = ({ s }) => {
  const [a] = SC.cases;
  const nm = T.names;
  const pull = 44.4;
  // lateral slide: camera centres each folder as its name appears
  const cx = remap([[a, FX[0] - 120], [nm[0], FX[0]], [nm[1], FX[1]], [nm[2], FX[2]], [nm[3], FX[3]], [pull, FX[3] + 30]])(s);
  const z = remap([[a, 1.55], [nm[0], 1.75], [nm[3], 1.75], [pull, 1.6]])(s);
  const idx = nm.filter((x) => s >= x).length - 1;
  const v11t = remap([[pull, 2.0], [46.2, 4.04]])(s);
  const four = s >= T.four;
  return <AbsoluteFill style={{ background: '#000' }}>
    {s < pull ? <Cam z={z} x={(540 - cx) * z} y={220 - 140 * z} ox="50%" oy="50%"><Still src="img/k4.jpg" style={{ transformOrigin: '50% 50%' }} />
      {FX.map((x, i) => i <= idx ? <div key={i} style={{ position: 'absolute', left: x - 34, top: 812, width: 68, height: 590, background: `radial-gradient(ellipse at 50% 20%, rgba(255,226,170,${0.22 * eo(ramp(s, nm[i], nm[i] + 0.4))}), transparent 70%)` }} /> : null)}
    </Cam> : <Cam z={lerp(1.08, 1.0, eo(ramp(s, pull, 46.4)))}><Clip name="v11" t={v11t} /></Cam>}
    {s < pull + 0.2 && VICTIMS.map((v, i) => {
      const at = nm[i]; const out = i < 3 ? nm[i + 1] - 0.02 : pull + 0.2;
      const o = inOut(s, at, out, 0.2, 0.18); if (o <= 0) return null;
      return <div key={i} style={{ position: 'absolute', left: 140, top: 300, width: 800, textAlign: 'center', opacity: o, transform: `translateY(${(1 - eo(ramp(s, at, at + 0.3))) * 14}px)` }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 104, lineHeight: 1, color: C.paper, textShadow: '0 4px 30px rgba(0,0,0,.9)' }}>{v.n}</div>
        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 30, letterSpacing: '0.24em', color: C.amber }}>{v.c} · 1987</div>
      </div>;
    })}
    {four && <>
      <Head s={s} at={T.four} out={SC.cases[1] + 0.05} text="4" y={180} size={420} punch />
      <Head s={s} at={T.four + 0.25} out={SC.cases[1] + 0.05} text="MURDER CONVICTIONS" y={1310} size={88} w={840} punch={false} />
    </>}
  </AbsoluteFill>;
};

const InterruptScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.interrupt[0], 0], [SC.interrupt[1], 4.04]])(s);
  return <AbsoluteFill>
    <Cam z={1.02}><Clip name="v7" t={t} /></Cam>
    <Flash s={s} at={T.paper} d={0.35} max={0.55} color="#e9e1cf" />
  </AbsoluteFill>;
};

const CaseCard: React.FC<{ s: number }> = ({ s }) => {
  const at = T.vasquez - 0.3;
  const p = eo(ramp(s, at, at + 0.45));
  if (p <= 0) return null;
  const back = eio(ramp(s, T.y35, T.y35 + 1.6));
  const z = lerp(2.2, 1, p) * lerp(1, 0.78, back);
  const stamp = eo(ramp(s, T.reopened, T.reopened + 0.18));
  return <div style={{ position: 'absolute', left: 540 - 300, top: 760, width: 600, height: 420, transform: `scale(${z}) rotate(${lerp(-6, -2, p)}deg)`, opacity: p, transformOrigin: '50% 50%' }}>
    <div style={{ position: 'absolute', left: 0, top: -44, width: 230, height: 60, background: '#c9a978', borderRadius: '10px 10px 0 0' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #d8bd8c, #b99766)', boxShadow: '0 30px 80px rgba(0,0,0,.75)', borderRadius: 6 }} />
    <div style={{ position: 'absolute', left: 44, top: 46, fontFamily: MONO, fontSize: 26, letterSpacing: '0.2em', color: '#3b2c19' }}>COMMONWEALTH OF VIRGINIA</div>
    <div style={{ position: 'absolute', left: 44, top: 84, width: 512, height: 2, background: '#6b5333' }} />
    <div style={{ position: 'absolute', left: 44, top: 150, fontFamily: HEAD, fontWeight: 700, fontSize: 108, lineHeight: 1, color: '#22180c' }}>DAVID VASQUEZ</div>
    <div style={{ position: 'absolute', left: 44, top: 300, fontFamily: MONO, fontSize: 26, letterSpacing: '0.18em', color: '#3b2c19' }}>ARLINGTON · 1984</div>
    {stamp > 0 && <div style={{ position: 'absolute', left: 70, top: 130, padding: '10px 26px', border: `8px solid ${C.red}`, color: C.red, fontFamily: HEAD, fontWeight: 700, fontSize: 112, letterSpacing: '0.04em',
      transform: `rotate(-9deg) scale(${lerp(1.6, 1, stamp)})`, opacity: 0.92 * stamp, background: 'rgba(240,225,200,.35)' }}>CASE REOPENED</div>}
  </div>;
};
const VasquezScene: React.FC<{ s: number }> = ({ s }) => {
  const [a, b] = SC.vasquez;
  const t = remap([[a, 0], [58.3, 4.04]])(s);
  const hold = ramp(s, 58.3, b);
  const y35 = inOut(s, T.y35, T.served + 0.25, 0.2, 0.25);
  const served = inOut(s, T.served, b + 0.05, 0.25, 0.25);
  const pb = eio(ramp(s, T.y35, T.y35 + 1.6));
  return <AbsoluteFill>
    <Cam z={lerp(1.0, 1.1, hold) * lerp(1.06, 1, pb)}><Clip name="v12" t={t} /></Cam>
    <AbsoluteFill style={{ background: 'rgba(5,12,10,.25)' }} />
    {y35 > 0 && <div style={{ position: 'absolute', left: 0, top: 200, width: 1080, textAlign: 'center', opacity: y35, transform: `scale(${lerp(1.5, 1, pb)})` }}>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 330, lineHeight: 0.9, color: C.paper, textShadow: '0 10px 60px rgba(0,0,0,.8)' }}>35</div>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, letterSpacing: '0.18em', color: C.paper }}>YEARS</div>
    </div>}
    {served > 0 && <div style={{ position: 'absolute', left: 0, top: 200, width: 1080, textAlign: 'center', opacity: served }}>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 330, lineHeight: 0.9, color: C.amber, textShadow: '0 10px 60px rgba(0,0,0,.8)', transform: `scale(${lerp(1.25, 1, eo(ramp(s, T.served, T.served + 0.3)))})` }}>4</div>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 100, letterSpacing: '0.14em', color: C.paper }}>YEARS SERVED</div>
    </div>}
    <CaseCard s={s} />
  </AbsoluteFill>;
};

const PardonScene: React.FC<{ s: number }> = ({ s }) => {
  const t = remap([[SC.pardon[0], 0], [SC.pardon[1], 4.04]])(s);
  return <AbsoluteFill>
    <Cam z={lerp(1.02, 1.12, ramp(s, SC.pardon[0], SC.pardon[1]))} oy="46%"><Clip name="v16" t={t} /></Cam>
    {/* daylight pours out of the far doorway as the pardon lands */}
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: eio(ramp(s, SC.pardon[0] + 0.4, T.pardoned + 0.3)),
      background: 'radial-gradient(ellipse 38% 30% at 50% 46%, rgba(255,214,150,.95), rgba(255,190,120,.35) 45%, transparent 75%)' }} />
    <Head s={s} at={T.pardoned} out={SC.pardon[1] + 0.05} text="PARDONED" y={330} size={170} />
    <Label s={s} at={T.pardoned + 0.2} out={SC.pardon[1] + 0.05} text="JANUARY 1989" y={520} size={34} rule={false} />
  </AbsoluteFill>;
};

const FinalScene: React.FC<{ s: number }> = ({ s }) => {
  const [a, b] = SC.final;
  const t = remap([[a, 0], [T.convict - 0.1, 2.2], [T.oneTech, 4.04]])(s);
  const hold = ramp(s, T.oneTech, b);
  const labels = 1 - ramp(s, T.oneTech - 0.2, T.oneTech + 0.2);
  const side = (at: number, x: number, year: string, a1: string, a2: string, col: string) => {
    const o = eo(ramp(s, at, at + 0.3)) * labels; if (o <= 0) return null;
    return <div style={{ position: 'absolute', left: x, top: 700, width: 380, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
      <div style={{ display: 'inline-block', padding: '18px 22px', background: 'rgba(6,6,7,.72)', borderTop: `4px solid ${col}` }}>
        <div style={{ fontFamily: MONO, fontSize: 34, letterSpacing: '0.2em', color: col }}>{year}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, lineHeight: 1.0, color: C.paper, marginTop: 8 }}>{a1}<br />{a2}</div>
      </div>
    </div>;
  };
  return <AbsoluteFill>
    <Cam z={lerp(1.0, 1.06, hold)}><Clip name="v8" t={t} style={{ filter: `brightness(${lerp(1, 0.55, eo(hold))})` }} /></Cam>
    {side(T.convict, 130, '1988', 'DNA HELPS', 'CONVICT', C.red)}
    {side(T.exonerate, 570, '1989', 'DNA HELPS', 'EXONERATE', C.amber)}
    <Head s={s} at={T.oneTech} out={b + 1} text="ONE TECHNOLOGY." y={620} size={116} w={840} />
    <Head s={s} at={T.twoLives} out={b + 1} text="TWO LIVES CHANGED." y={760} size={116} w={840} color={C.amber} />
    <Black o={eio(ramp(s, T.fade, b))} />
  </AbsoluteFill>;
};

// ---------- composition ----------
export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / FPS;
  useFonts([
    { family: 'Barlow Condensed', file: 'fonts/barlow-condensed-700.woff2', weight: '700' },
    { family: 'Inter', file: 'fonts/inter-latin-wght-normal-Dx4kXJAl.woff2', weight: '100 900' },
    { family: 'JetBrains Mono', file: 'fonts/jetbrains-mono-latin-500-normal-BWZEU5yA.woff2', weight: '500' },
  ]);
  // short cross-dissolves only where one shot physically becomes the next
  const xf = (w: readonly [number, number], d = 0.12) => clamp(Math.min((s - w[0] + d) / d, 1));
  return <AbsoluteFill style={{ background: '#000' }}>
    <Audio src={staticFile('mix.wav')} />
    {inSc(s, SC.map) && <MapScene s={s} />}
    {inSc(s, SC.street, 0.25) && <AbsoluteFill style={{ opacity: xf(SC.street, 0.25) }}><StreetScene s={s} /></AbsoluteFill>}
    {inSc(s, SC.desk) && <DeskScene s={s} />}
    {inSc(s, SC.timeline) && <TimelineScene s={s} />}
    {inSc(s, SC.board) && <BoardScene s={s} />}
    {inSc(s, SC.print) && <PrintScene s={s} />}
    {inSc(s, SC.dna) && <DnaScene s={s} />}
    {inSc(s, SC.court, 0.3) && <AbsoluteFill style={{ opacity: xf(SC.court, 0.3) }}><CourtScene s={s} /></AbsoluteFill>}
    {inSc(s, SC.cases) && <CasesScene s={s} />}
    {inSc(s, SC.interrupt) && <InterruptScene s={s} />}
    {inSc(s, SC.vasquez, 0.2) && <AbsoluteFill style={{ opacity: xf(SC.vasquez, 0.2) }}><VasquezScene s={s} /></AbsoluteFill>}
    {inSc(s, SC.pardon, 0.2) && <AbsoluteFill style={{ opacity: xf(SC.pardon, 0.2) }}><PardonScene s={s} /></AbsoluteFill>}
    {inSc(s, SC.final, 0.2) && <AbsoluteFill style={{ opacity: xf(SC.final, 0.2) }}><FinalScene s={s} /></AbsoluteFill>}
    <Vignette />
    <Grain f={f} />
    {s < T.fade && <Captions s={s} />}
  </AbsoluteFill>;
};
