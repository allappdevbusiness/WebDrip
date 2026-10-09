import React, { useMemo } from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, H, W } from '../timing';
import { clamp, inCubic, layoutStack, lerp, outQuart, ramp, sine, svgCharBox } from '../lib';

// 0:02.53–0:05.07 (frames 76–152) over the breath bar.
// Beat 1 "A FLOWER / SHOP", beat 2 "SHOULD / FEEL", beat 3 "LIKE / THIS." — then hold through the pull-back,
// and on the vocal pickup the camera dives into the photo inside "THIS.", which is the next shot.
export const HOOK2_PHOTO = 'photos/site-hero.jpg';
const X0 = 140, WIDTH = 800, TOP = 196;
const REVEAL = [-4, -1, 15, 18, 34, 37]; // cut on action: the first line is already rising on the cut frame

export const SecondHook: React.FC = () => {
  const t = useCurrentFrame();
  const L = useMemo(() => layoutStack(['A FLOWER', 'SHOP', 'SHOULD', 'FEEL', 'LIKE', 'THIS.'], WIDTH, TOP, 0.11), []);
  // fit the stack to the useful vertical area (y 196 … ~1500)
  const this5 = L.lines[5];
  // zoom-through: the photo inside "THIS." grows to fill the frame by frame 76 (= drums)
  const zp = inCubic(ramp(t, 55, 74));
  const zoom = lerp(1, 40, zp);
  const fill = ramp(t, 64, 71); // the photo completes the frame however the glyph geometry falls
  // pivot inside the thick stem of the "I" in THIS.
  const iPivot = useMemo(() => {
    const box = svgCharBox('THIS.', FONT.display, this5.size, 2);
    return { x: X0 + box.x + box.w * 0.5, y: this5.base - this5.cap * 0.5 };
  }, [this5.size, this5.base, this5.cap]);
  const breathe = 1 - 0.018 * sine(ramp(t, 46, 60)); // tiny inhale on the instrument pull-back
  const othersOut = clamp(1 - ramp(t, 56, 66));
  const photoDrift = lerp(0, -40, ramp(t, 38, 76));

  return <AbsoluteFill style={{ background: C.paper }}>
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        {L.lines.map((ln, i) => (
          <clipPath id={`l${i}`} key={i}><rect x={0} y={ln.base - ln.cap - 30} width={W} height={ln.cap + 50} /></clipPath>
        ))}
        <mask id="thisMask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="black" />
          <g transform={`translate(${iPivot.x} ${iPivot.y}) scale(${zoom}) translate(${-iPivot.x} ${-iPivot.y})`}>
            <g clipPath={zp > 0 ? undefined : 'url(#l5)'}>
              <text x={X0} y={this5.base} fontFamily={FONT.display} fontSize={this5.size} fill="white"
                transform={`translate(0 ${(1 - outQuart(ramp(t, REVEAL[5], REVEAL[5] + 9))) * (this5.cap + 40)})`}>THIS.</text>
            </g>
          </g>
        </mask>
      </defs>
      <g transform={`translate(${W / 2} ${H / 2}) scale(${breathe}) translate(${-W / 2} ${-H / 2})`} opacity={othersOut}>
        {L.lines.slice(0, 5).map((ln, i) => {
          const p = outQuart(ramp(t, REVEAL[i], REVEAL[i] + 9));
          return <g key={i} clipPath={`url(#l${i})`}>
            <text x={X0} y={ln.base} fontFamily={FONT.display} fontSize={ln.size} fill={i === 3 ? C.rose : C.ink}
              transform={`translate(0 ${(1 - p) * (ln.cap + 40)})`}>{ln.text}</text>
          </g>;
        })}
      </g>
      <image href={staticFile(HOOK2_PHOTO)} x={0} y={photoDrift} width={W} height={H + 60} preserveAspectRatio="xMidYMid slice" mask="url(#thisMask)" />
      {fill > 0 && <image href={staticFile(HOOK2_PHOTO)} x={0} y={photoDrift} width={W} height={H + 60} preserveAspectRatio="xMidYMid slice" opacity={fill} />}
    </svg>
  </AbsoluteFill>;
};
