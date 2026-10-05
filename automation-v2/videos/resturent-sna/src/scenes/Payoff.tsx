import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from '../theme';
import { RELEASE, PRECHORUS, DURATION, beatsAfter } from '../timing';
import { ease, ep, kf, lerp, prog, rand, slam, within, hit } from '../lib/motion';
import { Flash, Paper, Poster } from '../components/base';
import { TileGrid } from '../components/talavera';
import { Browser, Phone, Pill, Shot, Tap, screenW } from '../components/ui';

// 46.208 → 50.000 — PAYOFF. Release swell: YOUR BUSINESS · pre-chorus hit: COULD LOOK LIKE THIS.
// beat: LET'S BUILD YOURS (pressed) · final beat: getwebdrip.com lock-up. No fade.
const BTN = beatsAfter(PRECHORUS, 3); // 48.223
const PRESS = beatsAfter(PRECHORUS, 4); // 48.728
const FINAL = beatsAfter(PRECHORUS, 5); // 49.233
const PULSE = beatsAfter(PRECHORUS, 6); // 49.738

export const PAYOFF_TIMES = { BTN, PRESS, FINAL, PULSE };

export const Payoff: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, RELEASE, DURATION + 1)) return null;
  const yb = hit(t, RELEASE, 2.4);
  const cl = t >= PRECHORUS - 0.07 ? slam(t, PRECHORUS, 2.2, 0.07) : 0;
  const dev = ep(t, PRECHORUS - 0.05, PRECHORUS + 0.4, ease.outExpo);
  const burst = ep(t, PRECHORUS, PRECHORUS + 0.6, ease.outExpo);
  const btn = t >= BTN - 0.07 ? slam(t, BTN, 2.4, 0.07) : 0;
  const pressed = t >= PRESS && t < PRESS + 0.12;
  // final lock-up: devices drop away, button rises to centre
  const fin = ep(t, FINAL - 0.1, FINAL + 0.08, ease.inOutCubic);
  const finSlam = t >= FINAL ? 1 + 0.06 * Math.exp(-(t - FINAL) * 14) * Math.cos((t - FINAL) * 36) : 1;
  const pulse = t >= PULSE ? 1 + 0.035 * Math.exp(-(t - PULSE) * 10) : 1;
  const T = 150;

  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <Paper />
      {/* tile frame bursting in around the edges on the pre-chorus hit */}
      <TileGrid
        cols={8}
        rows={14}
        size={T}
        x={-60}
        y={-90}
        tile={(i, c, r) => {
          const edge = c === 0 || c === 7 || r === 0 || r === 13;
          if (!edge || t < PRECHORUS) return null;
          const k = 1 - burst;
          return { transform: `scale(${1 - k}) rotate(${(rand(i) - 0.5) * 200 * k}deg)` };
        }}
      />
      <div style={{ position: 'absolute', left: 540, top: lerp(470, 430, fin), transform: `translate(-50%,-50%) scale(${lerp(1, 0.86, fin)})`, textAlign: 'center' }}>
        <div style={{ transform: `scale(${yb})` }}>
          <Poster size={150} color={C.cobalt}>YOUR BUSINESS</Poster>
        </div>
        {cl > 0 && (
          <div style={{ transform: `scale(${cl})`, marginTop: 6 }}>
            <Poster size={150} color={C.rosa}>COULD LOOK</Poster>
            <Poster size={150} color={C.rosa}>LIKE THIS.</Poster>
          </div>
        )}
      </div>
      {/* device cluster */}
      {dev > 0 && fin < 1 && (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - dev) * 900 + fin * 1200}px)` }}>
          <div style={{ position: 'absolute', left: 300, top: 860, transform: 'rotateY(-22deg) rotateZ(2deg)' }}>
            <Browser w={680}>
              <Img src={staticFile('shots/d_hero.jpg')} style={{ width: '100%' }} />
            </Browser>
          </div>
          <div style={{ position: 'absolute', left: 150, top: 780, transform: 'rotateZ(-5deg)' }}>
            <Phone w={300}>
              <Shot src="shots/m_hero.jpg" w={screenW(300)} scroll={24} />
            </Phone>
          </div>
        </div>
      )}
      {btn > 0 && (
        <div style={{ position: 'absolute', left: 540, top: lerp(1400, 1080, fin), transform: `translate(-50%,-50%) scale(${btn * finSlam * pulse * (pressed ? 0.93 : 1) * lerp(1, 1.25, fin)})` }}>
          <Pill label="LET'S BUILD YOURS →" bg={C.rosa} k={2.5} style={{ fontFamily: F.display, fontWeight: 400, fontSize: 54, letterSpacing: 2 }} />
        </div>
      )}
      <Tap t={t} at={PRESS} x={540} y={1400} k={2} />
      {fin > 0 && (
        <div style={{ position: 'absolute', left: 540, top: 1290, transform: `translate(-50%,-50%) scale(${slam(t, FINAL, 1.8, 0.1)})`, textAlign: 'center', opacity: fin }}>
          <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 64, color: C.cacao, letterSpacing: 1 }}>getwebdrip.com</div>
          <div style={{ fontFamily: F.hand, fontSize: 60, color: C.cobalt, marginTop: 6 }}>websites that sell</div>
        </div>
      )}
      <Flash t={t} at={RELEASE} dur={0.22} />
    </AbsoluteFill>
  );
};
