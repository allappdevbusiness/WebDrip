import React, { useMemo } from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, W, H } from '../timing';
import { layoutStack, outCubic, outQuart, ramp } from '../lib';

// frames 834–900: the song's final chord rings out. Bookend of the second hook, now about the viewer's business.
const X0 = 110, WIDTH = 860;
const WebDripMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
    <rect x="2" y="2" width="28" height="28" rx="7" fill="#dcecfa" />
    <path d="M9 2H23A7 7 0 0 1 30 9V13H28Q26.5 13 26.5 14.5V15.5A1.5 1.5 0 0 1 23.5 15.5V14.5Q23.5 13 22 13H21Q19.5 13 19.5 14.5V21A2.75 2.75 0 0 1 14 21V14.5Q14 13 12.5 13H12Q10.5 13 10.5 14.5V17A1.75 1.75 0 0 1 7 17V14.5Q7 13 5.5 13H2V9A7 7 0 0 1 9 2Z" fill="#0075de" />
    <circle cx="7" cy="7.5" r="1.3" fill="#fff" /><circle cx="10.8" cy="7.5" r="1.3" fill="#fff" /><circle cx="14.6" cy="7.5" r="1.3" fill="#fff" />
    <path d="M16.75 25C17.9 26.4 18.4 27.2 18.4 27.9A1.65 1.65 0 0 1 15.1 27.9C15.1 27.2 15.6 26.4 16.75 25Z" fill="#0075de" />
  </svg>
);

export const End: React.FC = () => {
  const t = useCurrentFrame();
  const L = useMemo(() => layoutStack(['YOUR BUSINESS', 'SHOULD FEEL', 'LIKE THIS.'], WIDTH, 420, 0.2), []);
  const REV = [0, 4, 8];
  const brand = outCubic(ramp(t, 14, 24));
  const url = outQuart(ramp(t, 18, 27));
  const note = ramp(t, 24, 32);
  const last = L.lines[2];
  const drift = -24 * ramp(t, 0, 66);
  return <AbsoluteFill style={{ background: C.paper }}>
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        {L.lines.map((ln, i) => <clipPath id={`e${i}`} key={i}><rect x={0} y={ln.base - ln.cap - 30} width={W} height={ln.cap + 50} /></clipPath>)}
        <mask id="eThis" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="black" />
          <g clipPath="url(#e2)"><text x={X0} y={last.base} fontFamily={FONT.display} fontSize={last.size} fill="white"
            transform={`translate(0 ${(1 - outQuart(ramp(t, REV[2], REV[2] + 9))) * (last.cap + 40)})`}>{last.text}</text></g>
        </mask>
      </defs>
      {L.lines.slice(0, 2).map((ln, i) => (
        <g key={i} clipPath={`url(#e${i})`}><text x={X0} y={ln.base} fontFamily={FONT.display} fontSize={ln.size} fill={i === 1 ? C.rose : C.ink}
          transform={`translate(0 ${(1 - outQuart(ramp(t, REV[i], REV[i] + 9))) * (ln.cap + 40)})`}>{ln.text}</text></g>
      ))}
      <image href={staticFile('photos/site-hero.jpg')} x={-200 + drift} y={last.base - last.cap - 300} width={1500} height={last.cap + 600} preserveAspectRatio="xMidYMid slice" mask="url(#eThis)" />
    </svg>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: brand, transform: `translateY(${(1 - brand) * 30}px)` }}>
        <WebDripMark size={112} />
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 104, letterSpacing: '-0.03em', color: C.ink }}>WebDrip</div>
      </div>
      <div style={{ overflow: 'hidden', marginTop: 30 }}>
        <div style={{ transform: `translateY(${(1 - url) * 110}%)`, fontFamily: FONT.sans, fontWeight: 600, fontSize: 56, color: C.drip }}>getwebdrip.com</div>
      </div>
      <div style={{ marginTop: 96, width: 820, textAlign: 'center', fontFamily: FONT.sans, fontWeight: 500, fontSize: 30, lineHeight: 1.4, color: C.muted, opacity: note }}>
        Larkmere Flower Studio is a fictional concept site designed by WebDrip.
      </div>
    </div>
  </AbsoluteFill>;
};
