// 17.015-24.022  CHORUS. A phone slams down on the downbeat. Real recorded interaction: tap on the hero's
// "Book a fitting" on the kick (19.21 s), the page travels, lands on the fitting form on the next kick
// (20.53 s), and "Black tie" is selected in the real occasion field on the half-beat. Then the phone whips
// out of frame on the kick+snare (23.59 s).
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EV, SCENES } from '../beats';
import { C, E, MONO, k, shake } from '../theme';
import { KineticText, SceneRoot, Touch } from '../components/kit';

const S = SCENES.mobile.from;
const PH = { w: 600, x: 240, y: 490, s: 600 / 390 }; // screen rect; 390 css wide mobile capture
const occStart = EV.occasionSelect - 66; // rec frame 66 = the real selectOption

const recSrc = (f: number) => {
  // mob-book: tap at rec 30, scroll rec 36-96, arrival hold; then mob-occasion (select at rec 66)
  if (f >= occStart) return `rec/mob-occasion/${String(Math.min(149, f - occStart)).padStart(5, '0')}.jpg`;
  let i: number;
  if (f < EV.tapBook) i = Math.min(29, Math.max(0, f - (EV.tapBook - 30)));
  else if (f < EV.travelStart) i = 30 + (f - EV.tapBook);
  else if (f < EV.arrive) i = 36 + (f - EV.travelStart) * 60 / (EV.arrive - EV.travelStart);
  else i = 96 + (f - EV.arrive);
  return `rec/mob-book/${String(Math.min(149, Math.round(i))).padStart(5, '0')}.jpg`;
};
const toPh = (cx: number, cy: number) => ({ x: PH.x + cx * PH.s, y: PH.y + cy * PH.s });

export const Mobile: React.FC = () => {
  const f = useCurrentFrame() + S;
  const slam = k(f, [S, S + 10], [1.28, 1], E.snap); // lands on the downbeat
  const land = k(f, [S, S + 18], [26, 0], E.land);
  const sh = shake(f, S, 26, 16);
  const sh2 = shake(f, EV.arrive, 10, 10);
  // gentle orbit, flattened while a finger is on screen so the touch lands on the real target
  const flat = (a: number, b: number) => k(f, [a - 16, a, b, b + 16], [1, 0, 0, 1], E.glide);
  const orbit = Math.min(flat(EV.tapBook, EV.tapBook + 10), flat(EV.occasionPress, EV.occasionSelect + 8));
  const ry = orbit * Math.sin((f - S) / 55) * 12;
  const exit = k(f, [EV.phoneExit - 4, SCENES.mobile.to], [0, 1], E.accel);
  const punch = k(f, [EV.arrive, EV.arrive + 10], [1.035, 1], E.snap);
  const travel = f > EV.travelStart && f < EV.arrive;
  const book = toPh(120.3, 402);
  const occ = toPh(195, 470.3);
  const demo = f >= EV.arrive + 6;
  return (
    <SceneRoot>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 55%, ${C.sky} 0%, ${C.ivory} 70%)` }} />
      <AbsoluteFill style={{ perspective: 1800, translate: `${sh.x + sh2.x}px ${sh.y + sh2.y}px` }}>
        <AbsoluteFill style={{ transformOrigin: '540px 1140px', transform: `translateX(${-exit * 1100}px) rotateY(${ry - exit * 70}deg) rotateX(${land}deg) scale(${punch * slam})` }}>
          {/* plain phone body (no device brand) with the real 390 x 844 capture as its screen */}
          <div style={{ position: 'absolute', left: PH.x - 18, top: PH.y - 18, width: PH.w + 36, height: 844 * PH.s + 36, borderRadius: 74, background: C.ink, boxShadow: '0 60px 120px -40px rgba(27,50,163,.6)' }} />
          <div style={{ position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: 844 * PH.s, borderRadius: 58, overflow: 'hidden', background: C.white }}>
            <Img src={staticFile(recSrc(f))} style={{ width: '100%', height: '100%', filter: travel ? 'blur(3px)' : undefined }} />
          </div>
          <Touch f={f} at={EV.tapBook} x={book.x} y={book.y} from={{ x: 760, y: 1500 }} />
          <Touch f={f} at={EV.occasionPress} x={occ.x} y={occ.y} from={{ x: 820, y: 1450 }} leave={22} />
          {demo && <div style={{ position: 'absolute', left: PH.x + 24, top: PH.y + 128, fontFamily: MONO, fontSize: 28, color: C.white, background: C.ink, padding: '8px 16px', borderRadius: 12, opacity: k(f, [EV.arrive + 6, EV.arrive + 12], [0, 1]) }}>Demo preview</div>}
        </AbsoluteFill>
      </AbsoluteFill>
      <KineticText name="IN THEIR POCKET." from={EV.phoneSlam - S + 13} durationInFrames={EV.tapBook - EV.phoneSlam - 6} mode="slam" color={C.ink} size={108} y={232} out={EV.tapBook - EV.phoneSlam - 20}>In their pocket.</KineticText>
      <KineticText name="ONE TAP." from={EV.tapBook - S} durationInFrames={EV.arrive - EV.tapBook} mode="pop" color={C.ivory} size={120} y={262} highlight={C.cobalt} out={EV.arrive - EV.tapBook - 8}>One tap.</KineticText>
      <KineticText name="STRAIGHT TO THE FORM." from={EV.arrive - S} durationInFrames={EV.phoneExit - EV.arrive} mode="slam" color={C.ink} size={96} y={240} out={EV.phoneExit - EV.arrive - 8}>Straight to the form.</KineticText>
    </SceneRoot>
  );
};
