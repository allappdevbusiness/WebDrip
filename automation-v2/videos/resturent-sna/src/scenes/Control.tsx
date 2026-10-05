import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from '../theme';
import { riff, CYCLE, beatsAfter } from '../timing';
import { ease, ep, kf, lerp, prog, slam, within, hit } from '../lib/motion';
import { Paper, Poster } from '../components/base';
import { DishCard, DISHES, Phone, RouteRow, Shot, Updated, screenW } from '../components/ui';

// 31.191 → 38.911 — OWNER CONTROL. Shown, not explained: price, hours, photo — each change on a riff note.
const A = { E: riff(8, 'E'), E2: riff(8, 'E2'), G: riff(8, 'G'), E3: riff(8, 'E3'), D: riff(8, 'D'), Cn: riff(8, 'C'), B: riff(8, 'B') };
const Bn = { E: riff(9, 'E'), E2: riff(9, 'E2'), G: riff(9, 'G'), E3: riff(9, 'E3'), D: riff(9, 'D'), Cn: riff(9, 'C'), B: riff(9, 'B') };
const START = CYCLE[8];
const END = CYCLE[10];
const HOURS_ROLL = beatsAfter(A.Cn, 1);

// odometer: `from` rolls up to `to`
const Roll: React.FC<{ from: React.ReactNode; to: React.ReactNode; p: number; h: number }> = ({ from, to, p, h }) => (
  <span style={{ display: 'inline-block', height: h, overflow: 'hidden', verticalAlign: 'bottom', lineHeight: `${h}px` }}>
    <span style={{ display: 'block', transform: `translateY(${-p * h}px)` }}>
      <span style={{ display: 'block', height: h }}>{from}</span>
      <span style={{ display: 'block', height: h }}>{to}</span>
    </span>
  </span>
);

const Label: React.FC<{ text: string; t: number; at: number }> = ({ text, t, at }) => {
  const k = ep(t, at, at + 0.16, ease.outExpo);
  return (
    <div style={{ position: 'absolute', left: 540, top: 470, transform: `translate(-50%,0) scale(${lerp(0.4, 1, k)})`, opacity: k }}>
      <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: C.marigold }}>{text}</div>
    </div>
  );
};

const Badge: React.FC<{ t: number; at: number; y: number }> = ({ t, at, y }) =>
  t >= at - 0.06 ? (
    <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${slam(t, at, 2, 0.06)}) rotate(-3deg)` }}>
      <Updated k={1.5} />
    </div>
  ) : null;

export const Control: React.FC<{ t: number }> = ({ t }) => {
  if (!within(t, START, END)) return null;

  // ---- UPDATE ANYTIME / NO DEVELOPER NEEDED ----
  if (t >= Bn.Cn) {
    const rosa = t >= Bn.B;
    const ua = hit(t, Bn.Cn, 2.2);
    const nd = t >= Bn.B ? hit(t, Bn.B, 2.4) : 0;
    const items = ['MENU', 'PRICES', 'PHOTOS', 'HOURS', 'CONTENT'];
    return (
      <AbsoluteFill>
        <Paper color={rosa ? C.rosa : C.cobalt} />
        {!rosa ? (
          <>
            <div style={{ position: 'absolute', left: 540, top: 700, transform: `translate(-50%,-50%) scale(${ua})`, textAlign: 'center' }}>
              <Poster size={230} color={C.bone}>UPDATE</Poster>
              <Poster size={230} color={C.marigold}>ANYTIME.</Poster>
            </div>
            <div style={{ position: 'absolute', left: 90, right: 90, top: 1080, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 }}>
              {items.map((it, i) => {
                const k = ep(t, Bn.Cn + 0.08 + i * 0.07, Bn.Cn + 0.2 + i * 0.07, ease.outBack);
                return (
                  <div key={it} style={{ transform: `scale(${k})`, display: 'flex', alignItems: 'center', gap: 12, background: C.bone, borderRadius: 99, padding: '14px 26px 14px 16px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.jade, color: C.bone, display: 'grid', placeItems: 'center', fontFamily: F.body, fontWeight: 800, fontSize: 24 }}>✓</div>
                    <div style={{ fontFamily: F.display, fontSize: 46, color: C.cobalt, letterSpacing: 1 }}>{it}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ position: 'absolute', left: 540, top: 860, transform: `translate(-50%,-50%) scale(${nd}) rotate(-2deg)`, textAlign: 'center' }}>
            <Poster size={168} color={C.bone}>NO DEVELOPER</Poster>
            <div style={{ display: 'inline-block', marginTop: 16, background: C.marigold, padding: '18px 44px 4px' }}>
              <Poster size={230} color={C.cobalt}>NEEDED.</Poster>
            </div>
          </div>
        )}
      </AbsoluteFill>
    );
  }

  // header: YOUR SITE. / YOUR CONTROL. — big, then docked at the top
  const ys = hit(t, A.E, 1.9);
  const yc = t >= A.E2 - 0.07 ? slam(t, A.E2, 2.2, 0.07) : 0;
  const dock = ep(t, A.G - 0.1, A.G + 0.12, ease.inOutCubic);
  const hScale = lerp(1, 0.52, dock);
  const hY = lerp(820, 300, dock);

  // which demo is on screen
  const demo = t < A.G - 0.02 ? null : t < A.Cn ? 'price' : t < Bn.E ? 'hours' : 'photo';
  const enterAt = demo === 'price' ? A.G : demo === 'hours' ? A.Cn : Bn.E;
  const enter = ep(t, enterAt - 0.02, enterAt + 0.2, ease.outExpo);

  return (
    <AbsoluteFill>
      <Paper color={C.cobalt} />
      <div style={{ position: 'absolute', left: 540, top: hY, transform: `translate(-50%,-50%) scale(${hScale})`, textAlign: 'center' }}>
        <div style={{ transform: `scale(${ys})` }}>
          <Poster size={180} color={C.bone}>YOUR SITE.</Poster>
        </div>
        {yc > 0 && (
          <div style={{ transform: `scale(${yc})` }}>
            <Poster size={180} color={C.marigold}>YOUR CONTROL.</Poster>
          </div>
        )}
      </div>

      {demo === 'price' && (
        <>
          <Label text="MENU PRICE" t={t} at={A.G} />
          <div style={{ position: 'absolute', left: 540, top: 540, transform: `translateX(-50%) perspective(1600px) rotateY(${(1 - enter) * 80}deg)` }}>
            <DishCard
              dish={DISHES.pastor}
              w={860}
              compact
              price={
                <span style={{ position: 'relative', display: 'inline-block', padding: '0 10px', borderRadius: 12, outline: t > A.G + 0.12 ? `5px solid ${C.marigold}` : 'none', outlineOffset: 6 }}>
                  <Roll from="$12" to="$14" p={ep(t, A.E3 - 0.08, A.E3, ease.inOutCubic)} h={62} />
                </span>
              }
            />
          </div>
          <Badge t={t} at={A.D} y={1380} />
        </>
      )}
      {demo === 'hours' && (
        <>
          <Label text="HOURS" t={t} at={A.Cn} />
          <div style={{ position: 'absolute', left: 70, top: 560, width: 940, transform: `translateY(${(1 - enter) * 700}px)`, opacity: 0.55 }}>
            <RouteRow day="WEDNESDAY" where="E 6th & Waller — taco night" hours="11am–9pm" k={2.5} />
          </div>
          <div style={{ position: 'absolute', left: 70, top: 1000, width: 940, transform: `translateY(${(1 - enter) * 900}px)`, opacity: 0.55 }}>
            <RouteRow day="FRIDAY" where="S Congress & Elizabeth" hours="11am–12am" k={2.5} />
          </div>
          <div style={{ position: 'absolute', left: 70, top: 780, width: 940, transform: `translateY(${(1 - enter) * 700}px) scale(1.04)` }}>
            <RouteRow
              day="THURSDAY"
              where="Zilker Park, Barton Springs"
              today
              k={2.5}
              hours={
                <span style={{ outline: t > A.Cn + 0.15 ? `5px solid ${C.marigold}` : 'none', outlineOffset: 8, borderRadius: 10, padding: '0 8px', display: 'inline-block' }}>
                  <Roll from="11am–10pm" to="11am–12am" p={ep(t, HOURS_ROLL - 0.08, HOURS_ROLL, ease.inOutCubic)} h={40} />
                </span>
              }
            />
          </div>
          <Badge t={t} at={A.B} y={1330} />
        </>
      )}
      {demo === 'photo' && (
        <>
          <Label text="PHOTOS" t={t} at={Bn.E} />
          <div style={{ position: 'absolute', left: 540, top: 560, transform: `translate(-50%,0) translateY(${(1 - enter) * 900}px) rotate(${lerp(8, -3, enter)}deg)` }}>
            <Phone w={420}>
              <Shot src="shots/m_hero.jpg" w={screenW(420)} scroll={24} />
              {/* the hero photo region of the site, swapped on E2 */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 50, height: 330, overflow: 'hidden' }}>
                <Img src={staticFile(t < Bn.E2 ? 'img/hero.jpg' : 'img/tacoposter.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {t >= Bn.E2 && t < Bn.E2 + 0.12 && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 1 - (t - Bn.E2) / 0.12 }} />}
              </div>
            </Phone>
          </div>
          <Badge t={t} at={Bn.G} y={1430} />
        </>
      )}
    </AbsoluteFill>
  );
};
