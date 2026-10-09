import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, W } from '../timing';
import { Phone, clamp, inCubic, lerp, outCubic, outQuart, ramp } from '../lib';

// frames 0–227 (bars 25–27: the airy "…ooh / You, ooh, ooh" with no drums).
// IDEA: most websites are a grey template. Real stems grow up out of one, and every element they reach
// blooms from grey into colour; on bar 27 the camera pushes into the bloom, then a hard cut on the bar-28
// downbeat to "A FLOWER SHOP SHOULD FEEL LIKE THIS." (look like this -> feel like this).
const SCREEN_W = 480, B = 12;
const PH = { x: (W - (SCREEN_W + 2 * B)) / 2, y: 440 };
const S = { x: PH.x + B, y: PH.y + B };          // screen origin
const CLIP_Y = PH.y + (SCREEN_W * 844) / 390 + 2 * B; // stems grow out of the phone's bottom edge
const FOCUS = { x: 540, y: 690 };                // the focal bloom, centre of the push-in

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, p: number) => { const A = hex(a), Bc = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, Bc[i], clamp(p)))).join(',')})`; };

type G = { src: string; w: number; h: number; dh: number; cx: number; ang: number; at: number; dur: number; flip?: boolean };
const STEMS: G[] = [
  // foliage frames the phone from the far sides
  { src: 'cut/euca-a.png', w: 1293, h: 2203, dh: 1240, cx: 330, ang: -30, at: 114, dur: 26 },
  { src: 'cut/euca-b.png', w: 1629, h: 2162, dh: 1180, cx: 760, ang: 28, at: 120, dur: 26, flip: true },
  { src: 'cut/green.png', w: 492, h: 839, dh: 900, cx: 300, ang: -40, at: 150, dur: 18 },
  { src: 'cut/green.png', w: 492, h: 839, dh: 860, cx: 790, ang: 42, at: 156, dur: 18, flip: true },
  // stems climb the edges first, so the template's own changes stay visible until bar 27
  { src: 'cut/lisi-b.png', w: 360, h: 724, dh: 1040, cx: 700, ang: 7, at: 30, dur: 42 },   // first stem: brushes the hero box on "You"
  { src: 'cut/sweetpea.png', w: 427, h: 1021, dh: 1100, cx: 365, ang: -15, at: 76, dur: 22 },
  { src: 'cut/lisi-d.png', w: 310, h: 788, dh: 980, cx: 775, ang: 15, at: 95, dur: 22 },
  { src: 'cut/lisi-e.png', w: 313, h: 711, dh: 940, cx: 470, ang: -6, at: 133, dur: 20 },
  { src: 'cut/lisi-c.png', w: 230, h: 790, dh: 1000, cx: 600, ang: 5, at: 140, dur: 20 },
];
const Grow: React.FC<{ g: G; t: number }> = ({ g, t }) => {
  if (t < g.at) return null;
  const p = outCubic(ramp(t, g.at, g.at + g.dur));
  const w = (g.w * g.dh) / g.h;
  const sway = Math.sin((t - g.at) / 22) * 1.2 * p;
  return <div style={{ position: 'absolute', left: g.cx - w / 2, top: CLIP_Y + 70 - g.dh, width: w, height: g.dh, transformOrigin: '50% 100%',
    transform: `rotate(${g.ang + sway}deg) translateY(${(1 - p) * g.dh * 0.8}px)`, filter: 'drop-shadow(0 14px 16px rgba(60,40,50,.18))' }}>
    <Img src={staticFile(g.src)} style={{ width: '100%', height: '100%', transform: g.flip ? 'scaleX(-1)' : undefined }} />
  </div>;
};

export const Intro: React.FC = () => {
  const t = useCurrentFrame();
  const warm = ramp(t, 76, 150);
  const bg = mix('#E9E9EC', C.paper, warm);
  const screenBg = mix('#F4F4F6', C.paper, warm);
  const grey = '#D3D3D8', grey2 = '#E1E1E5';
  // each template element blooms when a stem reaches it
  const hero = outCubic(ramp(t, 66, 82));
  const head = ramp(t, 95, 103), para = ramp(t, 101, 109), btn = ramp(t, 114, 121), cards = outCubic(ramp(t, 133, 145)), logo = ramp(t, 76, 84);
  const headlineOut = outQuart(ramp(t, 150, 164));
  const push = lerp(1, 3.1, inCubic(ramp(t, 166, 227)));
  const bloom = outCubic(ramp(t, 150, 164));

  const bar = (x: number, y: number, w: number, h: number, col: string, r = h / 2) =>
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: col }} />;
  const reveal = (src: string, p: number, cx: string, pos = '50% 50%') =>
    <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, clipPath: `circle(${p * 120}% at ${cx})` }} />;

  return <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
    {/* the claim */}
    <div style={{ position: 'absolute', left: 110, top: 176, width: 860, opacity: 1 - headlineOut, transform: `translateY(${-60 * headlineOut}px)` }}>
      {['Most websites', 'look like this.'].map((s, i) => (
        <div key={i} style={{ overflow: 'hidden', height: 104 }}>
          <div style={{ transform: `translateY(${i === 0 ? 0 : (1 - outQuart(ramp(t, 2, 10))) * 110}%)`, fontFamily: FONT.sans, fontWeight: 800, fontSize: 86, lineHeight: '104px', letterSpacing: '-0.03em', color: '#2B2A30' }}>{s}</div>
        </div>
      ))}
    </div>

    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${FOCUS.x}px ${FOCUS.y}px` }}>
      {/* a generic template, on a phone */}
      <Phone x={PH.x} y={PH.y} screenW={SCREEN_W} style={{ boxShadow: `0 2px 3px rgba(34,26,32,.14), 0 50px 90px -34px rgba(60,40,60,${lerp(0.25, 0.45, warm)})` }}>
        <div style={{ position: 'absolute', inset: 0, background: screenBg }}>
          {/* header */}
          <div style={{ position: 'absolute', left: 24, top: 22, width: 28, height: 28, borderRadius: 99, background: mix(grey, '#E9A5B8', logo) }} />
          {bar(62, 30, 92, 12, mix(grey, C.ink, logo))}
          {[0, 1, 2].map((k) => bar(418, 24 + k * 9, 34, 4, grey, 2))}
          {/* hero placeholder -> real flowers burst out from where the first stem passes */}
          <div style={{ position: 'absolute', left: 24, top: 92, width: 432, height: 300, borderRadius: 10, overflow: 'hidden', background: grey }}>
            <svg width={432} height={300} style={{ position: 'absolute', inset: 0, opacity: 1 - hero }}>
              <line x1={0} y1={0} x2={432} y2={300} stroke="#C2C2C8" strokeWidth={3} /><line x1={432} y1={0} x2={0} y2={300} stroke="#C2C2C8" strokeWidth={3} />
            </svg>
            {hero > 0 && reveal('photos/site-hero.jpg', hero, '88% 70%', '62% 45%')}
          </div>
          {bar(24, 420, 360, 30, mix(grey, C.ink, head), 6)}
          {bar(24, 462, 250, 30, mix(grey, C.rose, head), 6)}
          {bar(24, 520, 410, 12, mix(grey2, '#CBBFC5', para))}
          {bar(24, 544, 380, 12, mix(grey2, '#CBBFC5', para))}
          {bar(24, 568, 300, 12, mix(grey2, '#CBBFC5', para))}
          <div style={{ position: 'absolute', left: 24, top: 606, width: 200, height: 54, borderRadius: 8, background: mix(grey, C.rose, btn), boxShadow: btn ? `0 10px 24px -10px rgba(168,50,90,${0.6 * btn})` : undefined }} />
          {/* product cards: grey boxes become real bouquets */}
          {[{ x: 24, src: 'photos/site-posy.jpg' }, { x: 248, src: 'photos/site-bridal.jpg' }].map((c) => (
            <div key={c.x} style={{ position: 'absolute', left: c.x, top: 696, width: 208, height: 250, borderRadius: 10, background: mix('#EBEBEE', '#FFFFFF', cards), boxShadow: cards ? `0 12px 30px -16px rgba(168,50,90,${0.4 * cards})` : undefined }}>
              <div style={{ position: 'absolute', left: 10, top: 10, width: 188, height: 140, borderRadius: 6, overflow: 'hidden', background: grey }}>{cards > 0 && reveal(c.src, cards, '50% 100%')}</div>
              {bar(14, 166, 150, 14, mix(grey, C.ink, cards), 4)}
              {bar(14, 192, 90, 12, mix(grey2, C.rose, cards), 4)}
            </div>
          ))}
        </div>
      </Phone>

      {/* real stems grow up out of the template */}
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: `linear-gradient(180deg, #000 0px, #000 ${CLIP_Y - 170}px, transparent ${CLIP_Y + 10}px)` }}>
        {STEMS.map((g, i) => <Grow key={i} g={g} t={t} />)}
      </div>
      {/* the focal bloom settles over the hero, then the camera dives into it */}
      {t >= 150 && <div style={{ position: 'absolute', left: FOCUS.x - 270, top: FOCUS.y - 240, width: 540, height: 479, opacity: clamp(ramp(t, 150, 154)),
        transform: `scale(${lerp(0.55, 1, bloom)}) rotate(${(1 - bloom) * -18}deg)`, filter: 'drop-shadow(0 22px 26px rgba(70,40,50,.25))', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 18%)' }}>
        <Img src={staticFile('cut/lisi-head.png')} style={{ width: '100%', height: '100%' }} />
      </div>}
    </AbsoluteFill>
  </AbsoluteFill>;
};
