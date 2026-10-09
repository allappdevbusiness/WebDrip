import React, { useMemo } from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, W, H } from '../timing';
import { LarkMark, MaskRise, Mono, Rec, clamp, inOut, lerp, lerpRect, measure, outCubic, ramp } from '../lib';

// frames 228–379 (bars 30–31, "hold you in my arms, won't let go").
// IDEA: grown close to home. A route draws from the field to the studio (14 miles, the site's own number),
// flowers bloom where it passes, then the field photo folds into the real "Fourteen miles from field to vase" card.
type P = [number, number];
const SEGS: [P, P, P, P][] = [
  [[250, 660], [250, 800], [830, 740], [810, 950]],
  [[810, 950], [790, 1160], [260, 1090], [290, 1260]],
  [[290, 1260], [320, 1430], [790, 1330], [770, 1470]],
];
const bez = (s: [P, P, P, P], u: number): P => {
  const v = 1 - u;
  return [0, 1].map((i) => v * v * v * s[0][i] + 3 * v * v * u * s[1][i] + 3 * v * u * u * s[2][i] + u * u * u * s[3][i]) as P;
};
function samplePath() {
  const pts: P[] = []; const len: number[] = [0];
  SEGS.forEach((s, k) => { for (let i = k ? 1 : 0; i <= 120; i++) pts.push(bez(s, i / 120)); });
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[len.length - 1];
  const at = (p: number) => { const d = p * total; let i = len.findIndex((l) => l >= d); if (i <= 0) i = 1; const f = (d - len[i - 1]) / (len[i] - len[i - 1] || 1);
    return { x: lerp(pts[i - 1][0], pts[i][0], f), y: lerp(pts[i - 1][1], pts[i][1], f), a: Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) }; };
  const d = 'M' + SEGS.map((s, k) => (k ? '' : `${s[0][0]} ${s[0][1]} `) + `C ${s[1].join(' ')}, ${s[2].join(' ')}, ${s[3].join(' ')}`).join(' ');
  return { total, at, d };
}
const BLOOMS = [
  { s: 0.11, side: 1, c: ['#F2C6D1', '#E9A5B8'], ctr: C.rose, size: 96 },
  { s: 0.22, side: -1, c: ['#E1D6F2', '#C9B8E6'], ctr: C.violet, size: 78 },
  { s: 0.34, side: 1, c: ['#E3EADB', '#C9D6BC'], ctr: C.moss, size: 86 },
  { s: 0.47, side: -1, c: ['#F2C6D1', '#E9A5B8'], ctr: C.rose, size: 100 },
  { s: 0.59, side: 1, c: ['#FFFFFF', '#F3ECE1'], ctr: '#D9A441', size: 80 },
  { s: 0.71, side: -1, c: ['#E1D6F2', '#C9B8E6'], ctr: C.violet, size: 92 },
  { s: 0.83, side: 1, c: ['#F2C6D1', '#E9A5B8'], ctr: C.rose, size: 84 },
];
// real spot card in the m-field capture (DOM-measured): x16 w358 h560, top 119→139 css during the recorded scroll
const K = 2.3;
const CARD: { x: number; y: number; w: number; h: number } = { x: (W - 358 * K) / 2, y: 236, w: 358 * K, h: 560 * K };
const REC_TRIM = 40; // capture frame where the count-up has settled; card top ≈ 129.6 css here

export const Route: React.FC = () => {
  const t = useCurrentFrame();
  const path = useMemo(samplePath, []);
  const p = inOut(ramp(t, 6, 76));                  // head arrives at the studio on bar 31 (local 76)
  const head = path.at(Math.max(0.001, p));
  const miles = Math.round(14 * p);
  const numW = useMemo(() => measure('14', FONT.display, 400, 236).w, []);
  // fold into the card: local 92 → 108, then the real capture takes over
  const fold = inOut(ramp(t, 92, 108));
  const box = lerpRect({ x: 0, y: 0, w: W, h: H }, CARD, fold);
  const overlayOut = clamp(1 - ramp(t, 86, 96));
  const recIn = ramp(t, 104, 110);
  const studioIn = outCubic(ramp(t, 72, 82));
  const fieldIn = outCubic(ramp(t, 0, 10));

  return <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
    {/* field photo (the same image the site uses for this section) */}
    <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', borderRadius: lerp(0, 18, fold),
      boxShadow: fold > 0 ? `0 ${40 * fold}px ${80 * fold}px -40px rgba(34,26,32,.5)` : undefined }}>
      <Img src={staticFile('photos/site-field.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 50%',
        transform: `scale(${lerp(1.16, 1.08, ramp(t, 0, 110))})` }} />
      {/* wash: route legibility, then the site's own bottom-up paper gradient as it becomes the card */}
      <div style={{ position: 'absolute', inset: 0, opacity: overlayOut, background: 'linear-gradient(180deg, rgba(251,246,240,.94) 0%, rgba(251,246,240,.8) 24%, rgba(251,246,240,.34) 52%, rgba(251,246,240,.22) 78%, rgba(251,246,240,.45) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - overlayOut, background: 'linear-gradient(0deg, rgba(251,246,240,.97) 0%, rgba(251,246,240,.75) 50%, rgba(251,246,240,.1) 100%)' }} />
    </div>

    {/* route layer */}
    <AbsoluteFill style={{ opacity: overlayOut }}>
      <div style={{ position: 'absolute', left: 110, top: 186, width: 860 }}>
        <MaskRise t={t} at={0}><Mono size={34}>Where it all grows</Mono></MaskRise>
        <MaskRise t={t} at={3} style={{ marginTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: FONT.display, color: C.ink, lineHeight: 1.0 }}>
            <span style={{ display: 'inline-block', width: numW, textAlign: 'right', fontSize: 236, color: C.rose }}>{miles}</span>
            <span style={{ fontSize: 120, marginLeft: 26 }}>miles</span>
          </div>
        </MaskRise>
        <MaskRise t={t} at={6} style={{ marginTop: 2 }}><Mono size={38} color={C.ink}>from field to vase</Mono></MaskRise>
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d={path.d} fill="none" stroke="rgba(62,91,63,.55)" strokeWidth={6} strokeDasharray="2 18" strokeLinecap="round" opacity={fieldIn} />
        <path d={path.d} fill="none" stroke={C.rose} strokeWidth={11} strokeLinecap="round" strokeDasharray={path.total} strokeDashoffset={path.total * (1 - p)} />
      </svg>
      {BLOOMS.map((b, i) => {
        const pt = path.at(b.s);
        const bp = ramp(p, b.s - 0.01, b.s + 0.09);
        if (bp <= 0) return null;
        const nx = -Math.sin(pt.a) * 66 * b.side, ny = Math.cos(pt.a) * 66 * b.side;
        return <div key={i} style={{ position: 'absolute', left: pt.x + nx - b.size / 2, top: pt.y + ny - b.size / 2, transform: `rotate(${(1 - bp) * -50 + i * 17}deg)` }}>
          <LarkMark size={b.size} p={bp} colors={b.c as [string, string]} center={b.ctr} />
        </div>;
      })}
      {/* field pin */}
      <div style={{ position: 'absolute', left: 250 - 17, top: 660 - 17, width: 34, height: 34, borderRadius: 99, background: C.moss, border: '6px solid #fff', boxShadow: '0 6px 16px rgba(0,0,0,.18)', transform: `scale(${fieldIn})` }} />
      <div style={{ position: 'absolute', left: 292, top: 612, opacity: fieldIn, background: 'rgba(251,246,240,.9)', borderRadius: 14, padding: '12px 20px', boxShadow: '0 10px 30px -12px rgba(34,26,32,.35)' }}>
        <Mono size={38} color={C.moss}>The field</Mono>
        <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 500, color: C.ink, marginTop: 4 }}>cut at first light</div>
      </div>
      <div style={{ position: 'absolute', left: head.x - 13, top: head.y - 13, width: 26, height: 26, borderRadius: 99, background: C.rose, border: '5px solid #fff', opacity: 1 - studioIn }} />
      {/* studio pin + the number */}
      <div style={{ position: 'absolute', left: 770 - 20, top: 1470 - 20, width: 40, height: 40, borderRadius: 99, background: C.rose, border: '7px solid #fff', boxShadow: '0 6px 16px rgba(0,0,0,.2)', transform: `scale(${studioIn})` }} />
      <div style={{ position: 'absolute', right: 1080 - 726, top: 1372, textAlign: 'right', opacity: studioIn, transform: `translateX(${(1 - studioIn) * 20}px)`, background: 'rgba(251,246,240,.9)', borderRadius: 14, padding: '12px 20px', boxShadow: '0 10px 30px -12px rgba(34,26,32,.35)' }}>
        <Mono size={38} color={C.rose}>Larkmere studio</Mono>
        <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 500, color: C.ink, marginTop: 4 }}>14 Mill Row</div>
      </div>
    </AbsoluteFill>

    {/* the real section takes over inside the card */}
    <Sequence from={104} layout="none">
      <AbsoluteFill style={{ opacity: recIn }}>
        <Rec src="rec/m-field.mp4" cssW={390} cssH={844} scale={K} cx={16} cy={129.6} x={CARD.x} y={CARD.y} trimBefore={REC_TRIM} />
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>;
};
