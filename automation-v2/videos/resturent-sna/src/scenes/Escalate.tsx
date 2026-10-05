import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from '../theme';
import { riff, CYCLE, RELEASE } from '../timing';
import { ease, ep, kf, lerp, prog, rand, slam, within, hit } from '../lib/motion';
import { Footage, Paper, Photo, Poster } from '../components/base';
import { TileGrid } from '../components/talavera';
import { Browser, Phone, Shot, screenW } from '../components/ui';

// 38.911 → 46.208 — ESCALATE. Best moments return, faster; then a grid of them collapses into the release.
const A = { E: riff(10, 'E'), E2: riff(10, 'E2'), G: riff(10, 'G'), E3: riff(10, 'E3'), D: riff(10, 'D'), Cn: riff(10, 'C'), B: riff(10, 'B') };
const Bn = { E: riff(11, 'E'), E2: riff(11, 'E2'), G: riff(11, 'G'), E3: riff(11, 'E3'), D: riff(11, 'D'), Cn: riff(11, 'C'), B: riff(11, 'B') };
const START = CYCLE[10];
const MID = CYCLE[11];
const END = RELEASE;

const REVIEWS = [
  { q: '"I drove across town for half a chicken and I\'d do it again tomorrow."', n: 'Daniel R.', img: 'img/daniel.jpg', c: C.marigold },
  { q: '"Found pupusas like my abuela\'s. In a truck. Thank you, Rosa."', n: 'Karla M.', img: 'img/karla.jpg', c: C.rosa },
  { q: '"Fed 60 people in 40 minutes. Three asked me for the link."', n: 'Marcus T.', img: 'img/marcus.jpg', c: C.cobalt },
];

const ReviewCard: React.FC<{ r: (typeof REVIEWS)[number] }> = ({ r }) => (
  <div style={{ width: 760, background: C.paper, borderRadius: 32, padding: '34px 40px', boxShadow: '0 24px 60px rgba(27,71,196,.2)', border: '3px solid rgba(63,42,31,.06)' }}>
    <div style={{ color: C.marigold, fontSize: 40, letterSpacing: 4 }}>★★★★★</div>
    <div style={{ fontFamily: F.body, fontSize: 36, lineHeight: 1.45, color: C.clay, marginTop: 12 }}>{r.q}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 22 }}>
      <Img src={staticFile(r.img)} style={{ width: 70, height: 70, borderRadius: '50%', border: `4px solid ${r.c}` }} />
      <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.cacao }}>{r.n}</div>
    </div>
  </div>
);

// 2×3 grid panels (riff 12)
const PANELS: { at: number; render: (t: number) => React.ReactNode }[] = [
  { at: Bn.E, render: () => <Footage src="video/hero-3d.mp4" at={Bn.E} until={END} startAt={5} /> },
  {
    at: Bn.E2,
    render: () => (
      <AbsoluteFill style={{ background: C.bone, display: 'grid', placeItems: 'center' }}>
        <Poster size={230} color={C.rosa} style={{ textShadow: `10px 10px 0 ${C.cobalt}` }}>$500</Poster>
      </AbsoluteFill>
    ),
  },
  { at: Bn.G, render: () => <Photo src="img/birria.jpg" w={540} h={640} fx={45} zoom={1.2} /> },
  {
    at: Bn.E3,
    render: () => (
      <AbsoluteFill style={{ background: C.blush }}>
        <div style={{ position: 'absolute', left: 120, top: 40 }}>
          <Phone w={300}>
            <Shot src="shots/m_hero.jpg" w={screenW(300)} scroll={24} />
          </Phone>
        </div>
      </AbsoluteFill>
    ),
  },
  { at: Bn.D, render: () => <Photo src="img/ceviche.jpg" w={540} h={640} fx={70} zoom={1.1} /> },
  { at: Bn.Cn, render: () => <Footage src="video/taco-3d.mp4" at={Bn.Cn} until={END} startAt={1.5} /> },
];
const PW = 540, PH = 640;

export const Escalate: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  if (t < MID) {
    // E — phone over the tile wall, swinging
    if (t < A.E2) {
      const k = ep(t, A.E, A.E + 0.25, ease.outExpo);
      return (
        <AbsoluteFill style={{ perspective: 1600 }}>
          <TileGrid cols={7} rows={11} size={180} x={-90} y={-30 - (t - A.E) * 120} />
          <div style={{ position: 'absolute', left: 540, top: 960, transform: `translate(-50%,-50%) rotateY(${lerp(-50, -16, k)}deg) rotateZ(4deg) scale(${lerp(1.3, 1, k)})` }}>
            <Phone w={560}>
              <Shot src="shots/m_menu.jpg" w={screenW(560)} scroll={24} />
            </Phone>
          </div>
        </AbsoluteFill>
      );
    }
    // E2 — fire
    if (t < A.G) return <AbsoluteFill style={{ background: '#0b0806' }}><Photo src="img/pollo.jpg" w={1080} h={1920} fx={50} fy={44} zoom={lerp(1.9, 1.6, prog(t, A.E2, A.G))} /></AbsoluteFill>;
    // G — desktop menu, straight on, wide
    if (t < A.E3) {
      const k = ep(t, A.G, A.G + 0.2, ease.outExpo);
      return (
        <AbsoluteFill>
          <Paper color={C.cobalt} />
          <div style={{ position: 'absolute', left: 540, top: 960, transform: `translate(-50%,-50%) scale(${lerp(1.4, 1, k)})` }}>
            <Browser w={1000}>
              <Img src={staticFile('shots/d_menu.jpg')} style={{ width: '100%' }} />
            </Browser>
          </div>
        </AbsoluteFill>
      );
    }
    // E3 — birria macro
    if (t < A.D) return <AbsoluteFill><Photo src="img/birria.jpg" w={1080} h={1920} fx={60} fy={50} zoom={lerp(1.6, 1.4, prog(t, A.E3, A.D))} /></AbsoluteFill>;
    // D — the rating
    if (t < A.Cn) {
      const s = hit(t, A.D, 2);
      return (
        <AbsoluteFill>
          <Paper />
          <div style={{ position: 'absolute', left: 540, top: 880, transform: `translate(-50%,-50%) scale(${s})`, textAlign: 'center' }}>
            <div style={{ fontSize: 120, color: C.marigold, letterSpacing: 10 }}>★★★★★</div>
            <Poster size={420} color={C.cobalt}>4.9</Poster>
            <Poster size={60} color={C.clay} font="body" weight={700} style={{ letterSpacing: 10 }}>1,240 REVIEWS</Poster>
          </div>
        </AbsoluteFill>
      );
    }
    // C — split: footage over UI, the divider slides
    if (t < A.B) {
      const div = kf(t, [[A.Cn, 1920], [A.Cn + 0.25, 960, ease.outExpo], [A.B, 900, ease.linear]]);
      return (
        <AbsoluteFill>
          <Paper color={C.blush} />
          <div style={{ position: 'absolute', left: 540, top: div + 60, transform: 'translateX(-50%)' }}>
            <Phone w={600}>
              <Shot src="shots/m_taco.jpg" w={screenW(600)} scroll={24} />
            </Phone>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: div, overflow: 'hidden' }}>
            <Footage src="video/taco-3d.mp4" at={A.Cn} until={A.B} startAt={2.5} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: div - 6, width: 1080, height: 12, background: C.rosa }} />
        </AbsoluteFill>
      );
    }
    // B — reviews fan in
    return (
      <AbsoluteFill>
        <Paper color={C.sky} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', transform: `scale(${hit(t, A.B, 1.8)})` }}>
          <Poster size={140} color={C.cobalt}>PEOPLE TALK.</Poster>
          <Poster size={80} color={C.rosa} style={{ marginTop: 6 }}>MOSTLY ABOUT THE POLLO.</Poster>
        </div>
        {REVIEWS.map((r, i) => {
          const k = ep(t, A.B + 0.06 + i * 0.12, A.B + 0.3 + i * 0.12, ease.outExpo);
          return (
            <div key={i} style={{ position: 'absolute', left: 540, top: 560 + i * 300, transform: `translateX(-50%) translateX(${(1 - k) * (i % 2 ? 1200 : -1200)}px) rotate(${[-3, 2, -1][i]}deg)` }}>
              <ReviewCard r={r} />
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  // ---- riff 12: grid of moments, then collapse/tunnel into the release ----
  const collapse = ep(t, Bn.B - 0.04, END - 0.12, ease.inExpo);
  const push = kf(t, [[Bn.Cn, 1], [Bn.B - 0.04, 1.06, ease.linear]]);
  return (
    <AbsoluteFill style={{ background: C.bone, perspective: 1200 }}>
      {/* tile tunnel rushing toward camera behind the panels during collapse */}
      {collapse > 0 && (
        <div style={{ position: 'absolute', left: 540, top: 960, transform: `translate(-50%,-50%) scale(${lerp(0.3, 6, collapse)}) rotate(${collapse * 40}deg)` }}>
          <TileGrid cols={9} rows={9} size={120} x={-540} y={-540} />
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})` }}>
        {PANELS.map((p, i) => {
          if (t < p.at - 0.08) return null;
          const c = i % 2, r = Math.floor(i / 2);
          const s = slam(t, p.at, 1.5, 0.08);
          const dx = c ? 1 : -1, dy = r - 1;
          const fly = collapse;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: c * PW,
                top: r * PH,
                width: PW,
                height: PH,
                overflow: 'hidden',
                border: `6px solid ${C.bone}`,
                transform: `translate(${dx * 900 * fly}px, ${dy * 1100 * fly}px) translateZ(${fly * 600}px) rotate(${(rand(i) - 0.5) * 50 * fly}deg) scale(${s})`,
              }}
            >
              {p.render(t)}
              {t < p.at + 0.08 && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 1 - prog(t, p.at, p.at + 0.08) }} />}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
