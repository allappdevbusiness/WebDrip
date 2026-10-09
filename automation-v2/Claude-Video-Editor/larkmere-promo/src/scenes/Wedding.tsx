import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, W } from '../timing';
import { Mono, clamp, inOut, lerp, lerpRect, outCubic, outQuart, ramp } from '../lib';

// frames 683–739 (bar 36, the vocal breath). IDEA: a website lets a couple imagine their flowers before the first coffee.
// A palette picker (concept graphic, not a site feature) re-tones the real bridal photo on half-beats,
// then the photo settles into the site's real "Bridal bouquets" card (same photo).
const PALETTE = [
  { name: 'Blush', dot: '#EBB3C2', tint: '#F0A9BC', a: 0.55, at: 0 },
  { name: 'Ivory', dot: '#F1E8D6', tint: '#F3E2C0', a: 0.28, at: 8 },
  { name: 'Lilac', dot: '#C9B8E6', tint: '#B7A0E0', a: 0.55, at: 16 },
  { name: 'Green', dot: '#A9BE97', tint: '#9DBA86', a: 0.5, at: 24 },
];
const FRAME = { x: 120, y: 470, w: 840, h: 820 };
const CARD = { x: 164, y: 470, s: 0.7 };                          // m-wed-card3.png (1074x1422)
const SLOT = { x: CARD.x + 3 * CARD.s, y: CARD.y + 3 * CARD.s, w: 1068 * CARD.s, h: 854 * CARD.s };

export const Wedding: React.FC = () => {
  const t = useCurrentFrame();
  const sel = PALETTE.filter((p) => t >= p.at).length - 1;
  const morph = inOut(ramp(t, 30, 42));
  const r = lerpRect(FRAME, SLOT, morph);
  const ui = clamp(1 - ramp(t, 30, 36));
  const cardIn = ramp(t, 34, 40);
  return <AbsoluteFill style={{ background: '#F8ECE6', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 110, top: 168, width: 860 }}>
      <div style={{ overflow: 'hidden' }}><div style={{ transform: `translateY(${(1 - outQuart(ramp(t, 0, 8))) * 110}%)` }}><Mono size={34}>Wedding flowers</Mono></div></div>
      {['Big days,', 'small details'].map((ln, i) => <div key={i} style={{ overflow: 'hidden', height: 118, marginTop: i ? -8 : 4 }}>
        <div style={{ transform: `translateY(${(1 - outQuart(ramp(t, 2 + i * 3, 11 + i * 3))) * 110}%)`, fontFamily: FONT.display, fontSize: 104, lineHeight: '118px', color: C.ink, whiteSpace: 'nowrap' }}>{ln}</div>
      </div>)}
    </div>
    <Img src={staticFile('snaps/m-wed-card3.png')} style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: 1074 * CARD.s, opacity: cardIn, borderRadius: 8,
      boxShadow: '0 2px 4px rgba(34,26,32,.06), 0 40px 70px -26px rgba(168,50,90,.42)' }} />
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: lerp(18, 8, morph), overflow: 'hidden', opacity: t >= 44 ? 0 : 1,
      boxShadow: `0 40px 80px -40px rgba(34,26,32,${0.5 * (1 - morph)})` }}>
      <Img src={staticFile('photos/site-bridal.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 55%', transform: `scale(${lerp(1.1, 1, ramp(t, 0, 42))})` }} />
      {PALETTE.map((p, i) => {
        const on = i === sel ? outCubic(ramp(t, p.at, p.at + 5)) : i === sel - 1 ? 1 - outCubic(ramp(t, PALETTE[sel].at, PALETTE[sel].at + 5)) : 0;
        return <div key={p.name} style={{ position: 'absolute', inset: 0, background: p.tint, mixBlendMode: 'color', opacity: on * p.a * (1 - morph) }} />;
      })}
    </div>
    {/* chips */}
    <div style={{ position: 'absolute', left: 120, top: 1322, width: 840, display: 'flex', gap: 16, opacity: ui, transform: `translateY(${(1 - outCubic(ramp(t, 0, 8))) * 40}px)` }}>
      {PALETTE.map((p, i) => {
        const active = i === sel;
        const tap = ramp(t, p.at, p.at + 9);
        return <div key={p.name} style={{ position: 'relative', flex: 1, height: 92, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          border: `3px solid ${active ? C.ink : 'rgba(34,26,32,.12)'}`, boxShadow: active ? '0 14px 30px -14px rgba(34,26,32,.45)' : 'none', transform: `translateY(${active ? -4 : 0}px)` }}>
          <div style={{ width: 34, height: 34, borderRadius: 99, background: p.dot, border: '2px solid rgba(34,26,32,.12)' }} />
          <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, color: C.ink }}>{p.name}</div>
          {tap > 0 && tap < 1 && <div style={{ position: 'absolute', left: '50%', top: '50%', width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: 99,
            border: `4px solid ${C.rose}`, opacity: 1 - tap, transform: `scale(${lerp(0.3, 1.3, tap)})` }} />}
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};
