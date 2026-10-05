import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F } from '../theme';
import { riff, CYCLE } from '../timing';
import { ease, ep, kf, lerp, prog, slam, within } from '../lib/motion';
import { Footage, Paper } from '../components/base';

// 0.000 → 4.032 — riff 1, guitar alone.
// E: CLIENT PAID · E G E D: $ 5 0 0 stamped one per note · C: footage floods the digits + FOR THIS WEBSITE
// B: camera dives into the stroke of the first 0 until the footage fills the frame.
const N = {
  E: riff(0, 'E'),
  E2: riff(0, 'E2'),
  G: riff(0, 'G'),
  E3: riff(0, 'E3'),
  D: riff(0, 'D'),
  Cn: riff(0, 'C'),
  B: riff(0, 'B'),
};
export const HOOK_END = CYCLE[1];
// hero footage file time at video 0 inside the digits; Tease continues from the same frame
export const HERO_START = 0.4;
export const heroFileTime = (t: number) => HERO_START + (t - (riff(0, 'C') - 0.05));

const DIGITS = [
  { ch: '$', x: 186, at: N.E2, tilt: -4 },
  { ch: '5', x: 420, at: N.G, tilt: 3 },
  { ch: '0', x: 654, at: N.E3, tilt: -2 },
  { ch: '0', x: 888, at: N.D, tilt: 4 },
];
const DIGIT_Y = 1240; // baseline
const DIGIT_SIZE = 500;
// dive target: left stroke of the first 0
const DIVE = { x: 594, y: 1070 };

export const Hook: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, 0, HOOK_END)) return null;

  // camera: slow push on the long C, then exponential dive on B
  const push = kf(t, [[N.Cn, 1], [N.B, 1.06, ease.outCubic]]);
  const dive = t < N.B ? 1 : lerp(1, 60, ease.inExpo(prog(t, N.B + 0.05, HOOK_END)));
  const camS = push * dive;
  const cam = `translate(${DIVE.x} ${DIVE.y}) scale(${camS}) translate(${-DIVE.x} ${-DIVE.y})`;

  // CLIENT PAID: lands on frame 0, then rises to make room when $ arrives
  const cpScale = 1 + 0.14 * Math.exp(-t * 16);
  const cpY = kf(t, [[N.E2 - 0.14, 990], [N.E2, 580, ease.inCubic]]);
  const cpSize = kf(t, [[N.E2 - 0.14, 214], [N.E2, 190, ease.inCubic]]);

  // FOR THIS WEBSITE on C
  const ftw = t >= N.Cn - 0.09 ? slam(t, N.Cn, 1.9, 0.09) : 0;
  // footage floods the digits on C
  const flood = ep(t, N.Cn - 0.03, N.Cn + 0.16, ease.outCubic);

  const digit = (d: (typeof DIGITS)[number], i: number, fill: string, dx = 0, dy = 0) => {
    if (t < d.at - 0.09) return null;
    const s = slam(t, d.at, 3.2, 0.09);
    const rot = lerp(d.tilt * 4, d.tilt, ease.outCubic(prog(t, d.at - 0.09, d.at)));
    return (
      <text
        key={i}
        x={0}
        y={0}
        fill={fill}
        textAnchor="middle"
        fontFamily={F.display}
        fontSize={DIGIT_SIZE}
        transform={`translate(${d.x + dx} ${DIGIT_Y + dy}) rotate(${rot}) scale(${s})`}
      >
        {d.ch}
      </text>
    );
  };

  return (
    <AbsoluteFill>
      <Paper />
      {/* rosa slash behind CLIENT PAID on frame 0 */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id="hook500" clipPathUnits="userSpaceOnUse">
            {DIGITS.map((d, i) => digit(d, i, '#000'))}
          </clipPath>
        </defs>
        <g transform={cam}>
          <rect
            x={-40}
            y={cpY - cpSize * 0.62}
            width={1160 * ep(t, 0, 0.22, ease.outExpo)}
            height={cpSize * 0.2}
            fill={C.marigold}
            transform={`rotate(-3 540 ${cpY})`}
          />
          <text
            x={540}
            y={cpY}
            textAnchor="middle"
            fontFamily={F.display}
            fontSize={cpSize}
            fill={C.cobalt}
            transform={`translate(540 ${cpY - cpSize * 0.35}) scale(${cpScale}) translate(-540 ${-(cpY - cpSize * 0.35)})`}
          >
            CLIENT PAID
          </text>
          {/* misregistered print: cobalt plate under rosa digits */}
          {DIGITS.map((d, i) => digit(d, i, C.cobalt, 16, 16))}
          {DIGITS.map((d, i) => digit(d, i, C.rosa))}
          {ftw > 0 && (
            <g transform={`translate(540 1440) scale(${ftw}) translate(-540 -1440)`}>
              <rect x={150} y={1348} width={780} height={124} fill={C.cobalt} transform="rotate(-2 540 1410)" />
              <text x={540} y={1450} textAnchor="middle" fontFamily={F.display} fontSize={112} fill={C.bone} transform="rotate(-2 540 1410)">
                FOR THIS WEBSITE
              </text>
            </g>
          )}
          {/* hero footage inside the digits: clipped in SVG space so the footage stays 1:1 while the letters scale */}
          {t >= N.Cn - 0.05 && (
            <g clipPath="url(#hook500)" opacity={flood}>
              <g transform={`translate(${DIVE.x} ${DIVE.y}) scale(${1 / camS}) translate(${-DIVE.x} ${-DIVE.y})`}>
                <foreignObject x={0} y={0} width={1080} height={1920}>
                  <div style={{ position: 'relative', width: 1080, height: 1920 }}>
                    <Footage src="video/hero-3d.mp4" at={N.Cn - 0.05} until={HOOK_END} startAt={HERO_START} fx={50} fy={50} />
                  </div>
                </foreignObject>
              </g>
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
