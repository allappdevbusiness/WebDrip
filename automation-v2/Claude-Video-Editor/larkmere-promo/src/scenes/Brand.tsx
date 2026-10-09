import React, { useMemo } from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT } from '../timing';
import { HOOK2_PHOTO } from './SecondHook';
import { LarkMark, Phone, Rec, clamp, inOut, lerp, measure, outCubic, outQuart, ramp } from '../lib';

// frames 152–228 (bar 29). Drums hit: we are inside the photo from "THIS." -> the brand card blooms ->
// on beat 3 the wordmark flies into the real site's header and the actual mobile hero plays its intro.
const SCREEN_W = 600;
const NAV_PATCH = '#ECE6E0'; // header background colour sampled from the capture
const PH = { x: 226, y: 196 };              // phone frame position
const SCR = { x: PH.x + 14, y: PH.y + 14 };  // screen origin (bezel 14)
const K = SCREEN_W / 390;                   // canvas px per site CSS px
// measured in the live DOM: logo mark 16,22 32x32; "Larkmere" text starts at x 58, 22 px Abril, line centre y 38
const NAV_MARK = { x: SCR.x + 32 * K, y: SCR.y + 38 * K, size: 32 * K };

export const Brand: React.FC = () => {
  const t = useCurrentFrame();
  const BIG = 168;
  const wm = useMemo(() => measure('Larkmere', FONT.display, 400, BIG), []);
  const NAV_TEXT = { x: SCR.x + (58 + (wm.w * 22) / BIG / 2) * K, y: SCR.y + 38 * K, size: 22 * K };
  // card + wordmark home position
  const card = { x: 100, y: 560, w: 880, h: 640 };
  const home = { x: 540, y: card.y + 395 };            // wordmark centre
  const markHome = { x: 540, y: card.y + 150 };
  // match-cut into the phone header: beats 3 → 4 (local 38 → 52)
  const m = inOut(ramp(t, 38, 52));
  const wmPos = { x: lerp(home.x, NAV_TEXT.x, m), y: lerp(home.y, NAV_TEXT.y, m) };
  const wmScale = lerp(1, NAV_TEXT.size / BIG, m);
  const markPos = { x: lerp(markHome.x, NAV_MARK.x, m), y: lerp(markHome.y, NAV_MARK.y, m) };
  const markScale = lerp(1, NAV_MARK.size / 168, m);
  const flyOut = clamp(1 - ramp(t, 50, 54));          // the real header takes over
  const cardIn = outCubic(ramp(t, 1, 11));
  const cardOut = clamp(1 - ramp(t, 37, 45));
  const phoneIn = outCubic(ramp(t, 38, 50));
  const blur = lerp(0, 16, ramp(t, 38, 50));
  const push = lerp(1.0, 1.07, ramp(t, 0, 76));
  const studio = outQuart(ramp(t, 19, 28));

  return <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
    {/* same framing the "THIS." mask ended on, so the cut is invisible */}
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 46%', filter: blur ? `blur(${blur}px)` : undefined }}>
      <Img src={staticFile(HOOK2_PHOTO)} style={{ position: 'absolute', left: 0, top: -40, width: 1080, height: 1980, objectFit: 'cover' }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `rgba(251,246,240,${lerp(0, 0.42, ramp(t, 38, 50))})` }} />

    {/* the site's glass index-card, carrying the brand */}
    <div style={{ position: 'absolute', left: card.x, top: card.y, width: card.w, height: card.h, borderRadius: 16,
      background: 'rgba(251,246,240,.9)', border: '1px solid rgba(255,255,255,.9)', backdropFilter: 'blur(12px)',
      boxShadow: '0 40px 80px -36px rgba(34,26,32,.5)', opacity: cardIn * cardOut, transform: `scale(${lerp(0.94, 1, cardIn)})` }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 492, textAlign: 'center', overflow: 'hidden', height: 70 }}>
        <div style={{ transform: `translateY(${(1 - studio) * 70}px)`, fontFamily: FONT.mono, fontWeight: 600, fontSize: 46, letterSpacing: '0.34em', color: C.rose, paddingLeft: '0.34em' }}>FLOWER STUDIO</div>
      </div>
    </div>

    {/* phone with the real site */}
    <Sequence from={38} layout="none">
      <div style={{ opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 60}px) scale(${lerp(1.04, 1, phoneIn)})`, transformOrigin: '50% 30%' }}>
        <Phone x={PH.x} y={PH.y} screenW={SCREEN_W}>
          <Rec src="rec/m-hero2.mp4" cssW={390} cssH={844} scale={K} cx={0} cy={0} x={0} y={0} />
          <div style={{ position: 'absolute', left: 10 * K, top: 16 * K, width: 268 * K, height: 44 * K, borderRadius: 10 * K, background: NAV_PATCH,
            opacity: 1 - ramp(t, 50, 53), filter: 'blur(3px)' }} />
        </Phone>
      </div>
    </Sequence>

    {/* flying brand mark + wordmark (bloom on the drum hit, then into the header) */}
    <div style={{ position: 'absolute', left: markPos.x - 84, top: markPos.y - 84, width: 168, height: 168, opacity: flyOut, transform: `scale(${markScale})` }}>
      <LarkMark size={168} p={ramp(t, 0, 16)} />
    </div>
    <div style={{ position: 'absolute', left: wmPos.x - wm.w / 2, top: wmPos.y - BIG * 0.55, width: wm.w, height: BIG * 1.1, overflow: 'hidden', fontFamily: FONT.display, fontSize: BIG, lineHeight: 1.1, color: C.ink, whiteSpace: 'nowrap',
      opacity: flyOut, transform: `scale(${wmScale})`, transformOrigin: '50% 50%' }}>
      <div style={{ transform: `translateY(${(1 - outQuart(ramp(t, 3, 13))) * 110}%)` }}>Larkmere</div>
    </div>
  </AbsoluteFill>;
};
