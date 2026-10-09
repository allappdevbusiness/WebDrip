import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, W, H } from '../timing';
import { Grain, Mono, clamp, inOut, lerp, lerpRect, outCubic, outQuart, ramp, sine } from '../lib';

// frames 455–683 (bars 33–35). IDEA: a bouquet is made by hand, stem by stem — and the site sells exactly that.
// Real photographed stems arrive on the beats through "a thunderstorm, a lightning strike", foliage on bar 34,
// paper, cotton, and the cord pulls TIGHT on "…each other tight" (local 152 = frame 607).
// Then a hard cut to the real Market Posy photo, which settles into the real $38 card from the site.
const B = { x: 540, y: 1180 }; // binding point (where the hand holds the stems)
type Stem = { src: string; w: number; h: number; dh: number; ax: number; ay: number; ang: number; at: number; flip?: boolean; z: number };
const STEMS: Stem[] = [
  // foliage sits behind the flowers
  { src: 'cut/euca-a.png', w: 1293, h: 2203, dh: 1020, ax: 0.75, ay: 0.9, ang: -33, at: 76, z: 0 },
  { src: 'cut/euca-b.png', w: 1629, h: 2162, dh: 980, ax: 0.28, ay: 0.9, ang: 30, at: 80, flip: true, z: 0 },
  { src: 'cut/green.png', w: 492, h: 839, dh: 760, ax: 0.36, ay: 0.9, ang: 40, at: 86, z: 0 },
  { src: 'cut/green.png', w: 492, h: 839, dh: 700, ax: 0.64, ay: 0.9, ang: -42, at: 90, flip: true, z: 0 },
  // flowers
  { src: 'cut/lisi-b.png', w: 360, h: 724, dh: 760, ax: 0.5, ay: 0.88, ang: -4, at: 0, z: 1 },
  { src: 'cut/lisi-d.png', w: 310, h: 788, dh: 770, ax: 0.51, ay: 0.88, ang: 14, at: 19, z: 1 },
  { src: 'cut/sweetpea.png', w: 427, h: 1021, dh: 900, ax: 0.34, ay: 0.9, ang: -21, at: 31, z: 1 },
  { src: 'cut/lisi-c.png', w: 230, h: 790, dh: 800, ax: 0.59, ay: 0.88, ang: 4, at: 38, z: 1 },
  { src: 'cut/lisi-e.png', w: 313, h: 711, dh: 720, ax: 0.27, ay: 0.88, ang: -11, at: 47, z: 1 },
  { src: 'cut/lisi-a.png', w: 424, h: 700, dh: 700, ax: 0.65, ay: 0.88, ang: 24, at: 53, z: 1 },
];
const STEPS = [
  { at: 0, word: 'One stem.' }, { at: 19, word: 'Another.' }, { at: 76, word: 'Foliage.' }, { at: 95, word: 'Paper.' }, { at: 112, word: 'Cotton.' }, { at: 146, word: 'Tied.' },
];

const StemView: React.FC<{ s: Stem; t: number }> = ({ s, t }) => {
  const p = outCubic(ramp(t, s.at, s.at + 14));
  if (t < s.at) return null;
  const w = (s.w * s.dh) / s.h, h = s.dh;
  const rad = ((s.ang) * Math.PI) / 180;
  const dist = (1 - p) * 640; // slides in along its own stem axis, from below
  const dx = -Math.sin(rad) * dist, dy = Math.cos(rad) * dist;
  const rot = s.ang + (1 - p) * (s.ang >= 0 ? 12 : -12);
  return <div style={{ position: 'absolute', left: B.x - s.ax * w, top: B.y - s.ay * h, width: w, height: h, transformOrigin: `${s.ax * w}px ${s.ay * h}px`,
    transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: clamp(p * 3), filter: 'drop-shadow(0 16px 18px rgba(70,40,50,.16))' }}>
    <Img src={staticFile(s.src)} style={{ width: '100%', height: '100%', transform: s.flip ? 'scaleX(-1)' : undefined }} />
  </div>;
};

// wrapping paper, front view: flared top, pinched at the tie (y≈1250), short tail
const SHEET_L = 'M 92 912 L 236 788 L 664 1012 L 612 1250 L 594 1560 L 496 1560 L 468 1250 Z';
const SHEET_R = 'M 988 912 L 844 788 L 416 1012 L 468 1250 L 486 1560 L 584 1560 L 612 1250 Z';
const SHEET_BACK = 'M 120 700 Q 250 560 540 520 Q 830 560 960 700 L 612 1250 L 590 1560 L 490 1560 L 468 1250 Z';

const PaperSheet: React.FC<{ d: string; t: number; at: number; dir: number; grad: string; fx?: string }> = ({ d, t, at, dir, grad, fx = 'crinkle' }) => {
  const p = outQuart(ramp(t, at, at + 15));
  if (p <= 0) return null;
  return <g transform={`translate(0 ${(1 - p) * 760}) rotate(${(1 - p) * 28 * dir} 540 1560)`}>
    <path d={d} fill={`url(#${grad})`} filter={`url(#${fx})`} stroke="rgba(255,255,255,.6)" strokeWidth={2.5} strokeLinejoin="round" />
  </g>;
};

export const Bouquet: React.FC = () => {
  const t = useCurrentFrame();
  // ---- build (local 0–152) ----
  const cam = lerp(1.0, 1.05, sine(ramp(t, 0, 152)));
  const tug = t >= 148 && t < 160 ? Math.sin(((t - 148) / 12) * Math.PI) : 0; // the cord tightens: everything lifts a touch
  const cordA = ramp(t, 112, 124), cordB = ramp(t, 121, 132), bow = outCubic(ramp(t, 132, 146));
  const cinch = lerp(1.07, 1.0, outQuart(ramp(t, 149, 154)));
  const stepIdx = STEPS.filter((s) => t >= s.at).length - 1;
  const step = STEPS[Math.max(0, stepIdx)];
  const stepP = outQuart(ramp(t, step.at, step.at + 8));

  // ---- the real product (local 152–228) ----
  const CARD = { x: 164, y: 478, s: 0.7 };                       // m-card-posy.png 1074x1476 at 0.7
  const SLOT = { x: CARD.x + 39 * CARD.s, y: CARD.y + 39 * CARD.s, w: 996 * CARD.s, h: 747 * CARD.s }; // the card's own photo slot
  const shrink = inOut(ramp(t, 166, 182));
  const ph = lerpRect({ x: 0, y: 0, w: W, h: H }, SLOT, shrink);
  const cardIn = ramp(t, 166, 174);
  const fan = outCubic(ramp(t, 194, 210));
  const push = lerp(1, 1.035, ramp(t, 182, 228));

  if (t >= 152) {
    return <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 60%' }}>
        {/* other bouquets fan out behind: the range, from the site */}
        {[{ src: 'snaps/m-card-love.png', dir: -1 }, { src: 'snaps/m-card-wild.png', dir: 1 }].map((c) => (
          <Img key={c.src} src={staticFile(c.src)} style={{ position: 'absolute', left: CARD.x, top: CARD.y + 40, width: 1074 * CARD.s, opacity: fan, borderRadius: 8,
            boxShadow: '0 30px 60px -30px rgba(168,50,90,.4)', transformOrigin: '50% 100%', transform: `translateX(${c.dir * 150 * fan}px) rotate(${c.dir * 9 * fan}deg) scale(0.9)` }} />
        ))}
        <Img src={staticFile('snaps/m-card-posy.png')} style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: 1074 * CARD.s, opacity: cardIn, borderRadius: 8,
          boxShadow: '0 2px 4px rgba(34,26,32,.06), 0 40px 70px -26px rgba(168,50,90,.42)' }} />
        <div style={{ position: 'absolute', left: ph.x, top: ph.y, width: ph.w, height: ph.h, overflow: 'hidden', borderRadius: lerp(0, 9, shrink), opacity: t >= 184 ? 0 : 1 }}>
          <Img src={staticFile('photos/site-posy.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.08, 1, ramp(t, 152, 182))})` }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, top: 168, width: 860 }}>
        <div style={{ overflow: 'hidden', height: 150 }}><div style={{ transform: `translateY(${(1 - outQuart(ramp(t, 172, 181))) * 110}%)`, fontFamily: FONT.display, fontSize: 132, lineHeight: '150px', color: C.ink }}>Bouquets</div></div>
        <div style={{ overflow: 'hidden', height: 160, marginTop: -6 }}><div style={{ transform: `translateY(${(1 - outQuart(ramp(t, 177, 186))) * 110}%)`, fontFamily: FONT.display, fontSize: 132, lineHeight: '160px', color: C.ink }}>from <span style={{ color: C.rose }}>$38</span></div></div>
      </div>
    </AbsoluteFill>;
  }

  return <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 30% 20%, #FFFDF9 0%, ${C.paper} 45%, ${C.linen} 100%)`, overflow: 'hidden' }}>
    <Grain opacity={0.05} />
    <div style={{ position: 'absolute', left: 110, top: 168, width: 860 }}>
      <Mono size={34}>Hand-tied in the studio</Mono>
      <div style={{ overflow: 'hidden', height: 150, marginTop: 6 }}>
        <div style={{ transform: `translateY(${(1 - stepP) * 110}%)`, fontFamily: FONT.display, fontSize: 128, lineHeight: '150px', color: step.word === 'Tied.' ? C.rose : C.ink }}>{step.word}</div>
      </div>
    </div>
    <AbsoluteFill style={{ transform: `translateY(${-10 * tug}px) scale(${cam})`, transformOrigin: '540px 1000px' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F7E3E0" /><stop offset="1" stopColor="#EBC9C6" /></linearGradient>
          <filter id="crinkle" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="4" seed="7" result="n" />
            <feDiffuseLighting in="n" surfaceScale="3.2" lightingColor="#ffffff" result="l"><feDistantLight azimuth="235" elevation="52" /></feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.25" k2="0" k3="0" k4="0" result="c" />
            <feComposite in="c" in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id="pl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EFE2D1" /><stop offset="0.55" stopColor="#E2CFB6" /><stop offset="1" stopColor="#CDB496" /></linearGradient>
          <linearGradient id="pr" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBDD" /><stop offset="0.6" stopColor="#E7D6BF" /><stop offset="1" stopColor="#D3BC9F" /></linearGradient>
        </defs>
        <PaperSheet d={SHEET_BACK} t={t} at={92} dir={0} grad="pb" />
      </svg>
      {STEMS.filter((s) => s.z === 0).map((s, i) => <StemView key={'f' + i} s={s} t={t} />)}
      {STEMS.filter((s) => s.z === 1).map((s, i) => <StemView key={'s' + i} s={s} t={t} />)}
      {/* the focal bloom goes in last, on top */}
      {t >= 57 && <div style={{ position: 'absolute', left: 540 - 205, top: 640, width: 410, height: 363, opacity: clamp(ramp(t, 57, 60)),
        transform: `translateY(${(1 - outCubic(ramp(t, 57, 70))) * 120}px) scale(${lerp(0.82, 1, outCubic(ramp(t, 57, 70)))})`, filter: 'drop-shadow(0 18px 20px rgba(70,40,50,.2))',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 18%)' }}>
        <Img src={staticFile('cut/lisi-head.png')} style={{ width: '100%', height: '100%' }} />
      </div>}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="pl2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EFE2D1" /><stop offset="0.55" stopColor="#E2CFB6" /><stop offset="1" stopColor="#CDB496" /></linearGradient>
          <linearGradient id="pr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBDD" /><stop offset="0.6" stopColor="#E7D6BF" /><stop offset="1" stopColor="#D3BC9F" /></linearGradient>
          <filter id="sh"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#5a3a2a" floodOpacity="0.22" /></filter>
          <filter id="crinkle2" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="4" seed="11" result="n" />
            <feDiffuseLighting in="n" surfaceScale="3.2" lightingColor="#ffffff" result="l"><feDistantLight azimuth="235" elevation="52" /></feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.25" k2="0" k3="0" k4="0" result="c" />
            <feComposite in="c" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter="url(#sh)"><PaperSheet d={SHEET_L} t={t} at={96} dir={-1} grad="pl2" fx="crinkle2" /></g>
        <g filter="url(#sh)"><PaperSheet d={SHEET_R} t={t} at={101} dir={1} grad="pr2" fx="crinkle2" /></g>
        {t >= 101 && <g opacity={ramp(t, 108, 116) * 0.5} stroke="#fff" strokeWidth={2} fill="none"><path d="M 236 790 L 520 1250" /><path d="M 844 790 L 560 1250" /></g>}
        {/* cotton cord: two wraps, then the bow; it cinches on the downbeat */}
        <g transform={`translate(540 1262) scale(${cinch} 1) translate(-540 -1262)`}>
          {[{ d: 'M 452 1238 Q 540 1268 628 1238', p: cordA }, { d: 'M 450 1266 Q 540 1296 630 1266', p: cordB }].map((c, i) => c.p > 0 && <g key={i}>
            <path d={c.d} fill="none" stroke="#CFC2AE" strokeWidth={14} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - c.p)} />
            <path d={c.d} fill="none" stroke="#FBF7EF" strokeWidth={9} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - c.p)} />
            <path d={c.d} fill="none" stroke="#E2D7C6" strokeWidth={2} strokeDasharray="6 7" opacity={c.p} />
          </g>)}
          {bow > 0 && <g transform={`translate(540 1270) scale(${1.45 * bow * lerp(0.9, 1, outQuart(ramp(t, 149, 154)))}) translate(-540 -1270)`}>
            {['M 540 1270 C 470 1205, 425 1300, 540 1274', 'M 540 1270 C 610 1205, 655 1300, 540 1274', 'M 538 1274 Q 516 1336 488 1394', 'M 542 1274 Q 568 1340 596 1390'].map((d, i) => <g key={i}>
              <path d={d} fill="none" stroke="#CFC2AE" strokeWidth={13} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#FBF7EF" strokeWidth={8} strokeLinecap="round" />
            </g>)}
            <circle cx={540} cy={1272} r={11} fill="#F4EDE2" stroke="#CFC2AE" strokeWidth={3} />
          </g>}
        </g>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>;
};
