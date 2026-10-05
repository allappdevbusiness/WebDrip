import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C } from '../theme';
import { riff, CYCLE, DRUMS_IN, beatsAfter } from '../timing';
import { ease, ep, kf, lerp, prog, rand, slam, within } from '../lib/motion';
import { Paper, Poster } from '../components/base';
import { TileGrid } from '../components/talavera';
import { Browser, Phone, Shot, screenW } from '../components/ui';

// 8.069 → 12.005 — DRUMS IN. The website arrives whole for the first time.
const N = {
  E: riff(2, 'E'),
  E2: riff(2, 'E2'),
  G: riff(2, 'G'),
  E3: riff(2, 'E3'),
  D: riff(2, 'D'),
  Cn: riff(2, 'C'),
  B: riff(2, 'B'),
};
const START = DRUMS_IN;
const END = CYCLE[3];

// phone screen cuts on riff notes (real mobile captures)
const SCREENS: [number, string][] = [
  [START, 'shots/m_hero.jpg'],
  [N.E2, 'shots/m_menu.jpg'],
  [N.G, 'shots/m_taco.jpg'],
  [N.E3, 'shots/m_ruta.jpg'],
  [N.D, 'shots/m_hero.jpg'],
];

export const Reveal: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;
  const T = 190; // tile size

  // tiles burst out from behind the phone and settle into a wall
  const burst = ep(t, START, START + 0.5, ease.outExpo);
  const wallDrift = (t - START) * 18;

  // phone: lands from the Tease suck-back (screen 670px) and settles to 560
  const pw = kf(t, [[START, 720], [START + 0.35, 600, ease.outCubic], [N.Cn - 0.1, 600], [N.Cn + 0.25, 520, ease.outCubic]]);
  const land = 1 + 0.06 * Math.exp(-(t - START) * 14) * Math.cos((t - START) * 30);
  // orbit steps on riff notes
  const rotY = kf(t, [[N.E2 - 0.08, 0], [N.E2, 20, ease.outExpo], [N.G - 0.06, 20], [N.G, -16, ease.outExpo], [N.E3 - 0.06, -16], [N.E3, 12, ease.outExpo], [N.D - 0.06, 12], [N.D, 0, ease.outExpo], [N.Cn - 0.1, 0], [N.Cn + 0.3, 14, ease.outCubic]]);
  const phoneX = kf(t, [[N.Cn - 0.1, 0], [N.Cn + 0.3, -170, ease.outCubic]]);
  const screen = [...SCREENS].reverse().find(([at]) => t >= at)![1];
  const flash = SCREENS.some(([at]) => at > START && t >= at && t < at + 0.05);

  // desktop swings in behind on C
  const deskIn = ep(t, N.Cn - 0.12, N.Cn + 0.2, ease.outExpo);
  // push toward camera before the cut
  const finalPush = kf(t, [[beatsAfter(N.B, 1) - 0.02, 1], [END, 2.6, ease.inExpo]]);

  // poster strips
  const bts = t >= N.Cn - 0.09 ? slam(t, N.Cn, 2.4, 0.09) : 0;
  const njl = t >= N.B - 0.09 ? slam(t, N.B, 2.4, 0.09) : 0;

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <Paper />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${finalPush})`, transformOrigin: '50% 45%' }}>
        <TileGrid
          cols={8}
          rows={12}
          size={T}
          x={-(8 * T - 1080) / 2}
          y={-(12 * T - 1920) / 2 - wallDrift}
          tile={(i, c, r) => {
            const dx = c - 3.5, dy = r - 5.5;
            const d = Math.hypot(dx, dy);
            const k = 1 - burst;
            const fly = (1.2 + rand(i) * 0.8) * k;
            return {
              transform: `translate(${dx * 260 * -fly}px, ${dy * 260 * -fly}px) scale(${1 - 0.9 * k * Math.min(1, 3 / (d + 1))}) rotate(${(rand(i + 7) - 0.5) * 180 * k}deg)`,
              opacity: t < START + 0.02 ? 0 : 1,
            };
          }}
        />
        {/* desktop behind */}
        {deskIn > 0 && (
          <div style={{ position: 'absolute', left: 340, top: 640, transform: `translateX(${(1 - deskIn) * 900}px) rotateY(${-32 + 10 * (1 - deskIn)}deg) rotateZ(2deg)`, transformOrigin: '0% 50%' }}>
            <Browser w={900}>
              <Img src={staticFile('shots/d_hero.jpg')} style={{ width: '100%' }} />
            </Browser>
          </div>
        )}
        {/* phone */}
        <div style={{ position: 'absolute', left: 540 + phoneX, top: 960, transform: `translate(-50%, -50%) rotateY(${rotY}deg) scale(${land})` }}>
          <Phone w={pw}>
            <Shot src={screen} w={screenW(pw)} scroll={24} cssW={390} />
            {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0.6 }} />}
          </Phone>
        </div>
        {/* poster strips */}
        {bts > 0 && (
          <div style={{ position: 'absolute', left: 540, top: 300, transform: `translate(-50%,-50%) rotate(-3deg) scale(${bts})` }}>
            <div style={{ background: C.bone, padding: '18px 44px 10px', boxShadow: '0 14px 40px rgba(63,42,31,.25)' }}>
              <Poster size={150} color={C.cobalt}>BUILT TO SELL.</Poster>
            </div>
          </div>
        )}
        {njl > 0 && (
          <div style={{ position: 'absolute', left: 540, top: 1440, transform: `translate(-50%,-50%) rotate(2deg) scale(${njl})` }}>
            <div style={{ background: C.rosa, padding: '16px 40px 8px', boxShadow: '0 14px 40px rgba(63,42,31,.3)' }}>
              <Poster size={96} color={C.bone}>NOT JUST TO LOOK GOOD.</Poster>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
