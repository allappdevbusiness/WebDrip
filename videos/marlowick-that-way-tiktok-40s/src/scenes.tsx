// The eight story sections. Each scene receives the absolute frame `f` (see Video.tsx) so every
// value can be checked against src/timeline.json and music-map.json.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import T from './timeline.json';
import { C, CAP, Chip, EASE, H, Lapels, MONO, SANS, Screen, SiteBg, Tape, TEXT_X, Title, Touch, View, W, kf, lerp, mix, ramp, recFrame, toCanvas } from './kit';
import { WebDripMark } from './brand';

const B = T.beats;
type Box = { x: number; y: number; w: number; h: number };

// ---------- shared framings ----------
// desktop hero, full width: css x 180-1260 at 1.0 (h1 centre lands at canvas 540, 877)
const DESK_HERO_BOX: Box = { x: 0, y: 632, w: W, h: 900 };
const DESK_HERO_VIEW: View = { x: 180, y: 0, s: 1 };
// soft top/bottom edges so the 900 px tall desktop capture sits in the page background
const FADE_EDGES: React.CSSProperties = { WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 36px, #000 calc(100% - 150px), transparent 100%)' };
// mobile card: 390 css wide at 2.1 (h1 centre also lands at 540, 877 - the shared landmark)
const MOB_BOX: Box = { x: 130.5, y: 450, w: 819, h: H - 450 };
const MOB_VIEW: View = { x: 0, y: 0, s: 2.1 };
// rail photo (hero after its own scroll push-in), portrait crops
const RAIL_HOOK: View = { x: 30, y: 0, s: 1920 / 900 };
const RAIL_BEAUTY: View = { x: 292, y: 30, s: 2.6 }; // jackets only, above the site's caption
const zoomAbout = (v: View, s: number, cx: number, cy: number): View => ({ s, x: cx - (cx - v.x) * v.s / s, y: cy - (cy - v.y) * v.s / s });

// ---------- 1. money hook (0-180) ----------
export const Hook: React.FC<{ f: number }> = ({ f }) => {
  const v = zoomAbout(RAIL_HOOK, lerp(RAIL_HOOK.s, RAIL_HOOK.s * 1.035, ramp(f, 0, 180)), RAIL_HOOK.x + 540 / RAIL_HOOK.s, 450);
  const row = (at: number) => {
    const p = ramp(f, at, at + 6, EASE.out);
    return { opacity: ramp(f, at, at + 3), transform: `translateX(${(1 - p) * -56}px)` };
  };
  return <AbsoluteFill style={{ background: C.ink }}>
    <Screen cap={CAP.deskHeroFull} box={{ x: 0, y: 0, w: W, h: H }} view={v} fill={C.ink} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(18,24,38,.88) 0%, rgba(18,24,38,.70) 40%, rgba(18,24,38,.78) 70%, rgba(18,24,38,.95) 100%)' }} />
    <div style={{ position: 'absolute', left: TEXT_X, top: 500, width: 800, fontFamily: SANS, color: C.white }}>
      <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1.04, letterSpacing: '-0.04em' }}>
        <div>Finally sold</div><div>this website</div><div>to my client.</div>
      </div>
      <div style={{ marginTop: 56, height: 4, width: 760, background: `repeating-linear-gradient(90deg, ${C.camel} 0 18px, transparent 18px 28px)` }} />
      <div style={{ marginTop: 34, display: 'flex', alignItems: 'baseline', gap: 22, ...row(B.hookFigure1) }}>
        <span style={{ fontWeight: 600, fontSize: 54, letterSpacing: '-0.02em', opacity: 0.9 }}>Payout:</span>
        <span style={{ fontWeight: 850, fontSize: 124, letterSpacing: '-0.045em' }}>$300</span>
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 22, ...row(B.hookFigure2) }}>
        <span style={{ fontWeight: 600, fontSize: 54, letterSpacing: '-0.02em', opacity: 0.9 }}>Opus + Astra cost:</span>
        <span style={{ fontWeight: 850, fontSize: 124, letterSpacing: '-0.045em', color: '#F0D2AC' }}>$24</span>
      </div>
    </div>
  </AbsoluteFill>;
};

// lapel planes close over the hook (164-180) and open on the downbeat (180-216)
export const LapelTransition: React.FC<{ f: number }> = ({ f }) => {
  const t = f < B.lapelOpen ? ramp(f, B.lapelClose, B.lapelOpen, EASE.in) : 1 - ramp(f, B.lapelOpen, B.lapelOpen + 36, EASE.inOut);
  const tilt = f < B.lapelOpen ? 0 : ramp(f, B.lapelOpen, B.lapelOpen + 36, EASE.inOut) * 7;
  return <Lapels t={t} tilt={tilt} />;
};

// ---------- 2. reveal (180-443) ----------
export const Reveal: React.FC<{ f: number }> = ({ f }) => {
  const start: View = { x: 720 - 540 / 1.9, y: 245 - 300 / 1.9, s: 1.9 };
  const p = ramp(f, 182, 292, EASE.out);
  const settled = zoomAbout(DESK_HERO_VIEW, lerp(1, 1.025, ramp(f, 300, 443, EASE.soft)), 720, 420);
  const view = f < 300 ? mix(start, DESK_HERO_VIEW, p) : settled;
  const boxY = lerp(560, DESK_HERO_BOX.y, ramp(f, 300, 443, EASE.soft));
  return <AbsoluteFill>
    <SiteBg />
    <Screen cap={CAP.deskHero} box={{ ...DESK_HERO_BOX, y: boxY }} view={view} fill="transparent" style={FADE_EDGES} />
    <Title f={f} inAt={190} outAt={B.revealTitleOut} lines={["Here's what", '$300 bought.']} size={92} y={250} />
  </AbsoluteFill>;
};

// ---------- 3. design detail (443-706) ----------
// photo layer that pulls back from full-bleed into the exact rect of the same image in its real card
const PhotoMatch: React.FC<{ f: number; src: string; iw: number; ih: number; from: Box; to: Box; t0: number; t1: number; z0: number; focusY?: number }> = ({ f, src, iw, ih, from, to, t0, t1, z0, focusY = 0.5 }) => {
  const p = ramp(f, t0, t1, EASE.inOut);
  const r = mix(from, to, p);
  const z = lerp(z0, 1, p) * (1 + 0.04 * (1 - ramp(f, t0 - 27, t0)));
  const a = iw / ih;
  const cover = a > r.w / r.h ? { h: r.h * z, w: r.h * a * z } : { w: r.w * z, h: (r.w / a) * z };
  const fy = lerp(focusY, 0.5, p);
  return <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden' }}>
    <Img src={staticFile(src)} style={{ position: 'absolute', left: (r.w - cover.w) / 2, top: (r.h - cover.h) * fy, width: cover.w, height: cover.h, maxWidth: 'none' }} />
  </div>;
};
const CARD_BOX: Box = { x: 0, y: 470, w: W, h: H - 470 };
const cardView = (s: number, imgX = 177, imgY = 111, targetX = 142.6, targetY = 520): View => ({ s, x: imgX - targetX / s, y: imgY - (targetY - CARD_BOX.y) / s });

export const Detail: React.FC<{ f: number }> = ({ f }) => {
  const second = f >= B.matchCut2;
  const t0 = second ? B.matchCut2 + 25 : B.matchCut1 + 27;
  const t1 = t0 + 50;
  const imgRect = { x: 142.6, y: 520, w: 345 * 2.3, h: 258 * 2.3 };
  // camera on the real page after the match: hold to read the product name, then widen
  const s = second ? kf(f, [t1 + 4, 704], [2.3, 1.75], EASE.inOut) : kf(f, [560, 598], [2.3, 2.02], EASE.inOut);
  const view = second ? zoomAbout(cardView(2.3), s, 177, 111) : zoomAbout(cardView(2.3), s, 177, 111);
  const ctx = ramp(f, t1 - 34, t1 - 4, EASE.soft);
  const photoOut = ramp(f, t1 + 2, t1 + 8);
  return <AbsoluteFill style={{ background: C.ivory }}>
    <div style={{ position: 'absolute', inset: 0, opacity: ctx }}>
      <Screen cap={second ? CAP.deskSuitsRow2 : CAP.deskSuitsRow1} box={CARD_BOX} view={f > t1 ? view : cardView(2.3)} />
    </div>
    {photoOut < 1 && <div style={{ position: 'absolute', inset: 0, opacity: 1 - photoOut }}>
      {second
        ? <PhotoMatch f={f} src="img/dinner.jpg" iw={1080} ih={720} from={CARD_BOX} to={imgRect} t0={t0} t1={t1} z0={1.25} focusY={0.42} />
        : <PhotoMatch f={f} src="img/navy.jpg" iw={1080} ih={608} from={{ x: 0, y: 0, w: W, h: H }} to={imgRect} t0={t0} t1={t1} z0={1.3} focusY={0.45} />}
    </div>}
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 470, background: C.ivory, opacity: second ? 1 : ramp(f, t0 + 20, t0 + 40) }} />
    <Title f={f} inAt={B.matchCut1 + 62} outAt={694} lines={['A storefront that', 'fits the brand.']} size={80} y={250} />
  </AbsoluteFill>;
};

// ---------- 4. Astra + Opus (706-1021) ----------
const TEAM_BOX: Box = { x: 72, y: 480, w: 936, h: 560 };
const TEAM_VIEW: View = { x: 330, y: 150, s: 1.2 };
const CODE = [
  [['<', 't'], ['a ', 't'], ['href', 'a'], ['=', 'p'], ['"#visit"', 's']],
  [['   className', 'a'], ['=', 'p'], ['"wd-btn wd-btn-primary wd-sheen"', 's'], ['>', 't']],
  [['  Book a fitting', 'x']],
  [['</', 't'], ['a', 't'], ['>', 't']],
] as const;
const CODE_COL: Record<string, string> = { t: '#8FB0FF', a: '#E8C79E', p: '#C9D1E3', s: '#B7E1C1', x: '#FFFFFF' };

export const Team: React.FC<{ f: number }> = ({ f }) => {
  const resolve = ramp(f, B.gridResolve + 5, T.scenes.team[1], EASE.inOut);
  const box = mix(TEAM_BOX, DESK_HERO_BOX, resolve);
  const view = mix(TEAM_VIEW, DESK_HERO_VIEW, resolve);
  const dim = (1 - ramp(f, 712, 760)) * 0 + 0.5 * (1 - ramp(f, B.gridResolve - 10, B.gridResolve + 10));
  const clutter = 1 - ramp(f, B.gridResolve - 6, B.gridResolve + 8);
  const tapeX = kf(f, [708, 742], [-960, TEAM_BOX.x], EASE.out);
  const cols = 12;
  const pt = (x: number, y: number) => toCanvas(TEAM_BOX, TEAM_VIEW, { x, y });
  const book = pt(645, 450);
  const suits = pt(795, 450);
  // Astra notes
  const astraOut = ramp(f, B.opusIn - 12, B.opusIn - 2, EASE.in);
  const note = (at: number) => ({ opacity: ramp(f, at, at + 8) * (1 - astraOut), transform: `translateY(${(1 - ramp(f, at, at + 12, EASE.out)) * 24}px)` });
  // Opus typing
  const total = CODE.flat().reduce((n, [s]) => n + s.length, 0);
  const typed = Math.floor(kf(f, B.codeType, [0, total], (t) => t));
  let left = typed;
  const uiLift = ramp(f, B.uiResolve, B.uiResolve + 14, EASE.out) * (1 - ramp(f, B.gridResolve - 4, B.gridResolve + 10, EASE.inOut));
  const btnRect = { x: 575, y: 426, w: 140, h: 48 };
  const b0 = pt(btnRect.x, btnRect.y);
  return <AbsoluteFill>
    <SiteBg />
    <Screen cap={CAP.deskHero} box={box} view={view} fill="transparent" radius={lerp(18, 0, resolve)} shadow={`0 30px 80px -30px rgba(27,50,163,${0.45 * (1 - resolve)})`}>
      <div style={{ position: 'absolute', inset: 0, background: `rgba(233,240,255,${dim})` }} />
    </Screen>
    {clutter > 0 && <div style={{ position: 'absolute', inset: 0, opacity: clutter }}>
      {/* tape marks become the layout grid */}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const g = ramp(f, 738 + i * 1.5, 768 + i * 1.5, EASE.out);
        return <div key={i} style={{ position: 'absolute', left: TEAM_BOX.x + (i * TEAM_BOX.w) / cols - 1, top: TEAM_BOX.y, width: 2, height: TEAM_BOX.h * g, background: C.cobalt, opacity: 0.32 }} />;
      })}
      {[169, 322, 426, 474].map((y, i) => {
        const g = ramp(f, 760 + i * 3, 790 + i * 3, EASE.out);
        return <div key={y} style={{ position: 'absolute', left: TEAM_BOX.x, top: pt(0, y).y - 1, width: TEAM_BOX.w * g, height: 0, borderTop: `3px dashed ${C.camel}`, opacity: 0.9 }} />;
      })}
      <Tape x={tapeX} y={TEAM_BOX.y - 40} len={TEAM_BOX.w} thick={36} />
      {/* targets the notes point at */}
      {[[B.astraNote1, suits, 137], [B.astraNote2, book, 140]].map(([at, p, w], i) => {
        const pp = p as { x: number; y: number };
        const o = ramp(f, (at as number) + 4, (at as number) + 12) * (i === 1 ? 1 : 1 - astraOut);
        return <div key={i} style={{ position: 'absolute', left: pp.x - ((w as number) * 1.2) / 2 - 10, top: pp.y - 39, width: (w as number) * 1.2 + 20, height: 78, borderRadius: 14, border: `4px solid ${i === 0 ? C.camel : C.cobalt}`, opacity: o }} />;
      })}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {f >= B.astraNote1 && <line x1={suits.x} y1={suits.y + 40} x2={suits.x} y2={1218} stroke={C.camel} strokeWidth={3} opacity={note(B.astraNote1).opacity} />}
        {f >= B.astraNote2 && f < B.opusIn && <line x1={book.x} y1={book.y + 40} x2={book.x} y2={1308} stroke={C.cobalt} strokeWidth={3} opacity={note(B.astraNote2).opacity} />}
      </svg>
      {/* Astra: creative direction */}
      {f < B.opusIn && <>
        <div style={{ position: 'absolute', left: TEXT_X, top: 1090, fontFamily: SANS, ...note(762) }}>
          <div style={{ fontFamily: MONO, fontSize: 26, color: C.deep, letterSpacing: '0.04em' }}>OpenAI</div>
          <div style={{ fontWeight: 700, fontSize: 44, color: C.ink, letterSpacing: '-0.02em' }}>Astra — Creative direction</div>
        </div>
        <div style={{ position: 'absolute', left: TEXT_X, top: 1218, padding: '14px 22px', background: C.white, borderLeft: `6px solid ${C.camel}`, borderRadius: 10, fontFamily: SANS, fontWeight: 650, fontSize: 42, color: C.ink, boxShadow: '0 12px 30px -14px rgba(18,24,38,.35)', ...note(B.astraNote1) }}>Lead with the collection.</div>
        <div style={{ position: 'absolute', left: TEXT_X, top: 1308, padding: '14px 22px', background: C.white, borderLeft: `6px solid ${C.cobalt}`, borderRadius: 10, fontFamily: SANS, fontWeight: 650, fontSize: 42, color: C.ink, boxShadow: '0 12px 30px -14px rgba(18,24,38,.35)', ...note(B.astraNote2) }}>Make the fitting easy to find.</div>
      </>}
      {/* Opus: build */}
      {f >= B.opusIn && <>
        <div style={{ position: 'absolute', left: TEXT_X, top: 1090, fontFamily: SANS, opacity: ramp(f, B.opusIn, B.opusIn + 8), transform: `translateY(${(1 - ramp(f, B.opusIn, B.opusIn + 12, EASE.out)) * 24}px)` }}>
          <div style={{ fontFamily: MONO, fontSize: 26, color: C.deep, letterSpacing: '0.04em' }}>Claude</div>
          <div style={{ fontWeight: 700, fontSize: 44, color: C.ink, letterSpacing: '-0.02em' }}>Opus — Build</div>
        </div>
        <div style={{ position: 'absolute', left: TEXT_X - 8, top: 1210, width: 790, padding: '18px 24px 22px', background: C.ink, borderRadius: 16, boxShadow: '0 20px 50px -20px rgba(18,24,38,.6)', opacity: ramp(f, B.opusIn + 4, B.opusIn + 12) }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.camel, marginBottom: 10 }}>src/components/Hero.jsx</div>
          {CODE.map((line, li) => <div key={li} style={{ fontFamily: MONO, fontSize: 27, lineHeight: 1.45, whiteSpace: 'pre', height: 39 }}>
            {line.map(([s, k], i) => {
              const show = Math.max(0, Math.min(s.length, left));
              left -= s.length;
              return <span key={i} style={{ color: CODE_COL[k] }}>{s.slice(0, show)}</span>;
            })}
          </div>)}
        </div>
        {/* the actual button it produces, lifted out of the real page */}
        {uiLift > 0 && <>
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            <line x1={book.x} y1={b0.y + btnRect.h * 1.2 + 10} x2={book.x} y2={1210} stroke={C.cobalt} strokeWidth={3} strokeDasharray="8 8" opacity={uiLift} />
          </svg>
          <div style={{ position: 'absolute', left: b0.x - 6 * 1.2, top: b0.y - 6 * 1.2, transformOrigin: 'center', transform: `scale(${1 + 0.45 * uiLift}) translateY(${-10 * uiLift}px)`, boxShadow: `0 ${24 * uiLift}px ${50 * uiLift}px -16px rgba(27,50,163,.55)`, borderRadius: 12, overflow: 'hidden' }}>
            <Screen cap={CAP.deskHero} box={{ x: 0, y: 0, w: (btnRect.w + 12) * 1.2, h: (btnRect.h + 12) * 1.2 }} view={{ x: btnRect.x - 6, y: btnRect.y - 6, s: 1.2 }} fill="transparent" style={{ position: 'relative' }} />
          </div>
        </>}
      </>}
    </div>}
    <Title f={f} inAt={712} outAt={990} lines={['Astra plans.', 'Opus builds.']} size={88} y={250} />
  </AbsoluteFill>;
};

// ---------- 5. mobile payoff (1021-1336) ----------
export const Mobile: React.FC<{ f: number }> = ({ f }) => {
  const g = ramp(f, B.guideSweep[0], B.guideSweep[1], EASE.inOut);
  const gx = lerp(-80, W + 80, g);
  const menuI = f - B.menuRecStart;
  return <AbsoluteFill>
    <SiteBg />
    <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${Math.max(0, gx)}px)` }}>
      <Screen cap={CAP.deskHero} box={DESK_HERO_BOX} view={DESK_HERO_VIEW} fill="transparent" style={FADE_EDGES} />
    </div>
    <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${Math.max(0, W - gx)}px 0 0)` }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 877px', transform: `scale(${1 + 0.035 * ramp(f, B.guideSweep[1], T.scenes.mobile[1], EASE.soft)})` }}>
        <Screen cap={recFrame('mob-menu', menuI, 119)} box={MOB_BOX} view={MOB_VIEW} radius={40} shadow="0 40px 90px -30px rgba(27,50,163,.45)" fill={C.white} />
      </div>
    </div>
    {g > 0 && g < 1 && <Tape x={gx - 18} y={0} len={H} vertical thick={36} />}
    <Touch f={f} at={B.burgerTap} x={540 + (130.5 + 346 * 2.1 - 540) * (1 + 0.035 * ramp(B.burgerTap, B.guideSweep[1], T.scenes.mobile[1], EASE.soft))} y={877 + (450 + 38 * 2.1 - 877) * (1 + 0.035 * ramp(B.burgerTap, B.guideSweep[1], T.scenes.mobile[1], EASE.soft))} from={{ x: 760, y: 760 }} />
    <Title f={f} inAt={1026} outAt={1318} lines={['Now try it', 'on your phone.']} size={84} y={232} />
  </AbsoluteFill>;
};

// cobalt lapel-edge sweep between the menu and the tap demo (same card position on both sides)
export const LapelWipe: React.FC<{ f: number }> = ({ f }) => {
  const p = ramp(f, B.lapelWipe, B.lapelWipe + 24, EASE.inOut);
  if (p <= 0 || p >= 1) return null;
  // leading lapel edge enters, the plane passes through (fully covering only around the cut at 1336) and leaves
  const x = lerp(-300, W + 1800, p);
  return <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
    <path d={`M ${x - 1700} 0 L ${x} 0 L ${x + 260} 900 L ${x + 120} 1920 L ${x - 1700} 1920 Z`} fill={C.cobalt} />
    <path d={`M ${x - 26} 0 L ${x + 232} 900 L ${x + 94} 1920`} fill="none" stroke={C.camel} strokeWidth={4} strokeDasharray="14 10" />
  </svg>;
};

// ---------- 6. interaction (1336-1626) ----------
export const Tap: React.FC<{ f: number }> = ({ f }) => {
  const occasion = f >= B.occasionRecStart;
  // the recorded anchor scroll (rec frames 36-96) plays at 2x: it passes unrevealed sections, so it reads as travel
  const bi = f - B.bookRecStart;
  const bookI = bi <= 36 ? bi : bi <= 66 ? 36 + (bi - 36) * 2 : 96 + (bi - 66);
  const cap = occasion ? recFrame('mob-occasion', f - B.occasionRecStart, 149) : recFrame('mob-book', bookI, 149);
  const demo = ramp(f, B.bookTap + 38, B.bookTap + 46);
  return <AbsoluteFill>
    <SiteBg />
    <Screen cap={cap} box={MOB_BOX} view={MOB_VIEW} radius={40} shadow="0 40px 90px -30px rgba(27,50,163,.45)" fill={C.white} />
    <Touch f={f} at={B.bookTap} x={130.5 + 120.3 * 2.1} y={450 + 402 * 2.1} from={{ x: 700, y: 1480 }} leave={12} />
    <Touch f={f} at={B.occasionPress} x={130.5 + 195 * 2.1} y={450 + 470.3 * 2.1} from={{ x: 760, y: 1250 }} leave={40} />
    {demo > 0 && <Chip x={622} y={640} opacity={demo} size={30} bg={C.ink} color={C.white}>Demo preview</Chip>}
    <Title f={f} inAt={1340} outAt={1612} lines={['Watch where', 'one tap takes you.']} size={76} y={240} />
  </AbsoluteFill>;
};

// ---------- 7. value payoff (1626-2020) ----------
const WORD_BOX: Box = { x: 0, y: 470, w: W, h: H - 470 };
const Word: React.FC<{ f: number; at: number; out: number; text: string }> = ({ f, at, out, text }) => {
  if (f < at || f >= out) return null;
  const p = ramp(f, at, at + 8, EASE.out);
  return <div style={{ position: 'absolute', left: TEXT_X, top: 236, fontFamily: SANS, fontWeight: 850, fontSize: 132, letterSpacing: '-0.05em', color: C.ink, lineHeight: 1, transform: `translateY(${(1 - p) * 44}px)`, opacity: ramp(f, at, at + 4) }}>
    {text.slice(0, -1)}<span style={{ color: C.camel }}>.</span>
    <div style={{ height: 8, marginTop: 14, width: 150 * ramp(f, at + 4, at + 16, EASE.out), background: C.cobalt, borderRadius: 4 }} />
  </div>;
};
export const Value: React.FC<{ f: number }> = ({ f }) => {
  let body: React.ReactNode;
  if (f < B.compare) {
    const x = kf(f, [B.browse, B.compare], [150, 214], EASE.soft);
    body = <Screen cap={CAP.deskSuitsHead} box={WORD_BOX} view={{ x, y: 140 - 30 / 1.45, s: 1.45 }} />;
  } else if (f < B.enquire) {
    const x = kf(f, [B.compare + 10, B.enquire - 8], [150, 560], EASE.inOut);
    body = <Screen cap={CAP.deskHirePlans} box={WORD_BOX} view={{ x, y: 100 - 30 / 1.6, s: 1.6 }} fill={C.white} />;
  } else if (f < B.beauty) {
    const s = kf(f, [B.enquire, B.beauty], [1.75, 1.82], EASE.soft);
    body = <>
      <Screen cap={CAP.deskForm} box={WORD_BOX} view={zoomAbout({ x: 720 - 540 / 1.75, y: 120 - 30 / 1.75, s: 1.75 }, s, 720, 330)} />
      <Chip x={TEXT_X} y={1210} size={30} bg={C.ink} color={C.white}>Demo preview</Chip>
    </>;
  }
  if (f >= B.beauty) return <Beauty f={f} />;
  return <AbsoluteFill style={{ background: C.ivory }}>
    {body}
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 470, background: C.ivory }} />
    <Word f={f} at={B.browse} out={B.compare} text="Browse." />
    <Word f={f} at={B.compare} out={B.enquire} text="Compare." />
    <Word f={f} at={B.enquire} out={B.beauty} text="Enquire." />
  </AbsoluteFill>;
};

// the site's own hero end state: the rail photo with its caption
const Beauty: React.FC<{ f: number }> = ({ f }) => {
  const v = zoomAbout(RAIL_BEAUTY, lerp(2.6, 2.7, ramp(f, B.beauty, B.ctaStart, EASE.soft)), RAIL_BEAUTY.x + 540 / 2.6, 300);
  return <AbsoluteFill style={{ background: C.ink }}>
    <Screen cap={CAP.deskHeroFull} box={{ x: 0, y: 0, w: W, h: H }} view={v} fill={C.ink} />
  </AbsoluteFill>;
};

// ---------- 8. WebDrip close (2020-2400) ----------
export const Close: React.FC<{ f: number }> = ({ f }) => {
  // background drifts from the beauty framing back to the opening crop for the replay
  const beautyEnd = zoomAbout(RAIL_BEAUTY, 2.7, RAIL_BEAUTY.x + 540 / 2.6, 300);
  const back = ramp(f, B.ctaStart, 2399, EASE.soft);
  const v = mix(beautyEnd, RAIL_HOOK, back);
  const scrim = lerp(0.18, 0.62, ramp(f, B.leadIn, B.ctaStart, EASE.soft)) + 0.14 * ramp(f, B.loopReturn, 2399, EASE.soft);
  const el = (at: number) => ({ opacity: ramp(f, at, at + 6), transform: `translateY(${(1 - ramp(f, at, at + 10, EASE.out)) * 30}px)` });
  const c = B.ctaStart;
  return <AbsoluteFill style={{ background: C.ink }}>
    <Screen cap={CAP.deskHeroFull} box={{ x: 0, y: 0, w: W, h: H }} view={v} fill={C.ink} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(18,24,38,${scrim + 0.2}) 0%, rgba(18,24,38,${scrim}) 40%, rgba(18,24,38,${scrim + 0.08}) 70%, rgba(18,24,38,${Math.min(0.95, scrim + 0.3)}) 100%)` }} />
    <Title f={f} inAt={B.leadIn} lines={['Your business could', 'look this sharp.']} size={66} y={250} color={C.white} />
    <div style={{ position: 'absolute', left: 72, top: 470, width: 816, padding: '44px 40px 46px', background: C.ivory, borderRadius: 28, boxShadow: '0 40px 100px -30px rgba(0,0,0,.6)', fontFamily: SANS, color: C.ink, ...el(c) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...el(c + 2) }}>
        <WebDripMark size={64} />
        <div style={{ fontWeight: 900, fontSize: 50, letterSpacing: '0.14em' }}>WEBDRIP</div>
      </div>
      <div style={{ marginTop: 34, fontWeight: 850, fontSize: 118, lineHeight: 1, letterSpacing: '-0.045em', ...el(c + 6) }}>Comment</div>
      <div style={{ marginTop: 14, ...el(c + 10) }}>
        <span style={{ display: 'inline-block', fontWeight: 850, fontSize: 118, lineHeight: 1, letterSpacing: '-0.03em', color: C.white, background: C.cobalt, padding: '10px 30px 16px', borderRadius: 20 }}>PROMPT</span>
      </div>
      <div style={{ marginTop: 30, fontWeight: 650, fontSize: 50, letterSpacing: '-0.02em', ...el(c + 16) }}>We’ll DM you the prompt.</div>
      <div style={{ marginTop: 34, height: 4, background: `repeating-linear-gradient(90deg, ${C.camel} 0 18px, transparent 18px 28px)`, ...el(c + 18) }} />
      <div style={{ marginTop: 30, fontWeight: 700, fontSize: 44, ...el(c + 20) }}>Follow WebDrip</div>
      <div style={{ marginTop: 10, fontFamily: MONO, fontWeight: 500, fontSize: 44, color: C.deep, ...el(c + 24) }}>getwebdrip.com</div>
    </div>
  </AbsoluteFill>;
};
