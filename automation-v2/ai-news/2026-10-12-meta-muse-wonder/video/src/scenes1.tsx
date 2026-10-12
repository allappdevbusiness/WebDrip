// 0:00-0:15.7 — hook, what happened, set up the real hook (ACTIVE MEMORY lands on the drop at DROP).
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F, H, W, b, BAR, DROP, backOut, clamp, easeIn, easeInOut, easeOut, easeOutExpo, lerp, prog, punch, shake } from './theme';
import { Bubble, ChatHeader, Fill, InputBar, Label, Photo, PovPhone, SCREEN, Slam, Vignette } from './util';

// ---------------- HOOK ----------------
export const T_TODAY = b(5);          // 2.459 "Today?"
export const T_ZERO = b(6.5);         // 3.197 "...NOTHING" -> STARTING FROM ZERO.
export const T_FACE = b(8);           // 3.934 bar 2: facepalm
export const T_META = b(9.5);         // 4.672 "Meta"
export const T_NEVER = b(12);         // 5.902 "never forgets"
export const T_FLASH = b(13);         // 6.393 near-black flash + bass drop
export const T_CARDS = 6.69;          // cards scene

const YESTERDAY = [
  { me: true, t: 'ok here is my whole plan for the launch' },
  { me: true, t: 'Website for Project X. React + Tailwind. Dark mode. Waitlist form. Pricing page.' },
  { me: false, t: 'Love it. A plan for Friday:\n1. Hero + waitlist form\n2. Pricing page, 3 tiers\n3. Dark mode toggle' },
  { me: true, t: 'budget is $0 and I hate long answers' },
  { me: false, t: 'Noted: free tools only, short answers.' },
  { me: true, t: 'also the meeting with the designer is Friday at 10' },
  { me: false, t: 'Got it. I will have the hero section ready to show by then.' },
  { me: true, t: 'perfect. same palette as my old site btw' },
  { me: false, t: 'Warm greys + one accent. Want to start with the hero?' },
  { me: true, t: 'yes. tomorrow.' },
  { me: false, t: 'See you tomorrow.' },
];

const ChatYesterday: React.FC<{ s: number }> = ({ s }) => {
  // two thumb flicks down a long thread; it ends with the latest message just above the input bar
  const y = 340 * (1 - 0.45 * easeOut(prog(s, 0.15, 0.75)) - 0.55 * easeOut(prog(s, 1.15, 0.8)));
  return <AbsoluteFill style={{ background: '#fff' }}>
    <div style={{ position: 'absolute', left: 0, bottom: 92, width: SCREEN.w, transform: `translateY(${y}px)` }}>
      {YESTERDAY.map((m, i) => <Bubble key={i} me={m.me}>{m.t}</Bubble>)}
    </div>
    <ChatHeader title="Assistant" stamp="YESTERDAY 11:48 PM" />
    <InputBar s={s} />
  </AbsoluteFill>;
};

const ChatToday: React.FC<{ s: number }> = ({ s }) => (
  <AbsoluteFill style={{ background: '#fff' }}>
    <ChatHeader title="New chat" stamp="TODAY 9:03 AM" />
    <div style={{ position: 'absolute', left: 0, width: SCREEN.w, top: 330, textAlign: 'center', fontFamily: F.ui }}>
      <div style={{ fontSize: 25, fontWeight: 800, color: '#1A1A1A' }}>What can I help with?</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#A0A0A0', marginTop: 10 }}>No previous messages</div>
    </div>
    <InputBar s={s} />
  </AbsoluteFill>
);

export const Hook: React.FC<{ s: number }> = ({ s }) => {
  // 1a / 1b: the same real phone, yesterday's long thread -> today's empty chat (hard cut on the beat)
  if (s < T_FACE) {
    const today = s >= T_TODAY;
    const cam = today
      ? { zoom: 2.16 + 0.05 * prog(s, T_TODAY, 1.5), fx: 0.497, fy: 0.5, shakeAmp: 0.9, seed: 2 }
      : { zoom: 1.96 + 0.08 * easeInOut(prog(s, 0, T_TODAY)), fx: 0.497, fy: 0.505, shakeAmp: 1.1, seed: 1 };
    const slam = s >= T_ZERO;
    return <AbsoluteFill style={{ background: C.ink }}>
      <PovPhone s={s} cam={cam} dim={slam ? 0.18 : 0}>{today ? <ChatToday s={s} /> : <ChatYesterday s={s} />}</PovPhone>
      <Vignette strength={0.5} />
      {slam && <ZeroSlam s={s} />}
    </AbsoluteFill>;
  }
  // 1c: frustrated human moment, reaction punch-in
  if (s < T_META) {
    return <AbsoluteFill style={{ background: C.ink }}>
      <Photo src="img/facepalm.jpg" iw={2000} ih={3000} s={s} cam={{ zoom: 1.12 * punch(s, T_FACE, 0.2), fx: 0.47, fy: 0.3, shakeAmp: 1.4, seed: 4 }} />
      <Vignette strength={0.55} />
    </AbsoluteFill>;
  }
  // 1d / 1e: Meta photo card slams in, then NEVER FORGETS
  if (s < T_FLASH) {
    const p = easeOutExpo(prog(s, T_META, 0.2));
    const never = s >= T_NEVER;
    const back = easeOutExpo(prog(s, T_NEVER, 0.25));
    const cw = 980, ch = Math.round((cw * 2133) / 3200);
    const sc = lerp(1.35, 1, p) * (1 + 0.03 * prog(s, T_META, 1.4)) * lerp(1, 0.9, back);
    const sh = shake(s, 0.6, 7);
    return <AbsoluteFill style={{ background: C.ink }}>
      <div style={{ position: 'absolute', left: (W - cw) / 2, top: 800 - ch / 2, width: cw, height: ch, borderRadius: 28, overflow: 'hidden',
        transform: `translate(${sh.x}px, ${sh.y}px) scale(${sc}) rotate(${lerp(-3, -1, p)}deg)`, boxShadow: '0 40px 120px rgba(0,0,0,.6)',
        filter: never ? `blur(${back * 5}px) brightness(${1 - back * 0.55})` : undefined }}>
        <Img src={staticFile('img/meta_sign.jpg')} style={{ width: cw, height: ch, objectFit: 'cover' }} />
      </div>
      {!never && <div style={{ position: 'absolute', left: 120, width: 840, top: 800 + ch / 2 + 70, textAlign: 'center', opacity: clamp((s - T_META - 0.15) / 0.15) }}>
        <Label style={{ color: C.white, opacity: 0.75, fontSize: 28 }}>Meta · Oct 12, 2026</Label>
      </div>}
      {never && <Slam s={s} at={T_NEVER} size={215} y={800} from={1.7}>Never<br />forgets.</Slam>}
      {/* camera flash on the slam */}
      <Fill color="#fff" opacity={clamp(1 - (s - T_META) / 0.07) * 0.85} />
    </AbsoluteFill>;
  }
  // 1f: 0.3 s near-black flash on "forgets", bass drop
  return <AbsoluteFill style={{ background: '#060607' }} />;
};

const ZeroSlam: React.FC<{ s: number }> = ({ s }) => {
  const line = (txt: string, at: number, y: number, rot: number) => {
    const p = easeOutExpo(prog(s, at, 0.14));
    return <div style={{ position: 'absolute', left: 0, width: W, top: y, display: 'flex', justifyContent: 'center', transform: `rotate(${rot}deg) scale(${lerp(1.5, 1, p)})`, opacity: clamp((s - at) / 0.04) }}>
      <div style={{ background: C.yellow, padding: '0 34px', fontFamily: F.display, fontSize: 158, lineHeight: 1.08, color: C.ink, textTransform: 'uppercase', boxShadow: '0 18px 40px rgba(0,0,0,.35)' }}>{txt}</div>
    </div>;
  };
  return <>{line('Starting', T_ZERO, 660, -4)}{line('from zero.', T_ZERO + 0.1, 840, -4)}</>;
};

// ---------------- WHAT HAPPENED: two model cards ----------------
const T_CARD_A = 6.74;      // rides in on the camera push (no empty frame after the flash)
const T_CARD_B = b(16);     // 7.869
const T_SAYS = 8.35;        // "Meta says"
const T_MOST = b(19);       // 9.344 "most capable"
const T_BACK = b(21);       // 10.328 pull back to the facts
export const T_BENCH = 6 * BAR; // 11.803 bar 6: "But benchmarks..."

const Chip: React.FC<{ children: React.ReactNode; dark?: boolean; lit?: number }> = ({ children, dark, lit = 0 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, fontFamily: F.ui, fontWeight: 700, fontSize: 27,
    color: dark ? C.white : C.ink, background: dark ? 'rgba(255,255,255,.1)' : '#F1EEE7', boxShadow: lit ? `0 0 0 ${3 * lit}px ${C.yellow}` : undefined, marginRight: 10, marginTop: 10 }}>
    <span style={{ width: 10, height: 10, borderRadius: 5, background: lit ? C.green : C.grey }} />{children}</div>
);

const ModelCard: React.FC<{ dark?: boolean; name: string; chips: string[]; lit: number; tag: string; w: number }> = ({ dark, name, chips, lit, tag, w }) => (
  <div style={{ width: w, borderRadius: 34, padding: '36px 40px 40px', background: dark ? C.ink : C.white, color: dark ? C.white : C.ink,
    boxShadow: dark ? '0 50px 110px rgba(0,0,0,.45)' : '0 34px 80px rgba(40,30,10,.18)' }}>
    <Label style={{ fontSize: 22, color: dark ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.45)' }}><span style={{ color: C.blue }}>●</span> {tag}</Label>
    <div style={{ fontFamily: F.ui, fontWeight: 900, fontSize: dark ? 84 : 74, letterSpacing: '-0.03em', lineHeight: 1.0, marginTop: 18 }}>{name}</div>
    <div style={{ height: 2, background: dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)', margin: '24px 0 10px' }} />
    <div>{chips.map((c) => <Chip key={c} dark={dark} lit={lit}>{c}</Chip>)}</div>
  </div>
);

export const WhatHappened: React.FC<{ s: number }> = ({ s }) => {
  const push = easeOutExpo(prog(s, T_CARDS, 0.5));
  const stageSc = lerp(0.72, 1, push) * (1 + 0.025 * prog(s, T_CARDS, 3));
  const pa = easeOutExpo(prog(s, T_CARD_A, 0.3)), pb = easeOutExpo(prog(s, T_CARD_B, 0.3));
  // zoom toward Card B's claim line, then pull back
  const zin = easeInOut(prog(s, T_MOST - 0.12, 0.22));
  const zout = easeInOut(prog(s, T_BACK, 0.35));
  const big = s >= T_MOST + 0.08 && s < T_BACK + 0.2;
  const lit = easeOut(prog(s, T_BACK + 0.15, 0.3));
  const camZ = 1 + 2.4 * zin * (1 - zout);
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, #FBFAF6 0%, ${C.paper} 55%, ${C.paper2} 100%)` }}>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '600px 1110px', transform: `scale(${stageSc * camZ})`, opacity: big ? 0 : 1 }}>
      {s >= T_SAYS && <div style={{ position: 'absolute', left: 140, top: 330, opacity: easeOut(prog(s, T_SAYS, 0.2)) }}>
        <Label style={{ color: C.ink, fontSize: 30 }}><span style={{ color: C.blue }}>●</span> Meta says</Label>
      </div>}
      <div style={{ position: 'absolute', left: 140, top: 420, transform: `perspective(1600px) translateX(${lerp(-500, 0, pa)}px) rotateY(${lerp(20, 7, pa)}deg)`, opacity: pa }}>
        <ModelCard name="Muse Wonder" tag="New model" chips={['Meta Model API', 'Muse Code']} lit={lit} w={640} />
      </div>
      <div style={{ position: 'absolute', left: 262, top: 760, transform: `perspective(1600px) translateX(${lerp(600, 0, pb)}px) translateZ(${lerp(-200, 40, pb)}px) rotateY(${lerp(-22, -6, pb)}deg)`, opacity: pb }}>
        <ModelCard dark name="Muse Wonder Full" tag="New model" chips={['Muse Code subscribers']} lit={lit} w={640} />
        <div style={{ position: 'absolute', left: 40, bottom: -64, fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.ink, opacity: 0.8 }}>“Our most capable models yet.”</div>
      </div>
    </div>
    {big && <MostCapable s={s} />}
  </AbsoluteFill>;
};

const MostCapable: React.FC<{ s: number }> = ({ s }) => {
  const p = easeOutExpo(prog(s, T_MOST + 0.08, 0.25));
  const out = easeIn(prog(s, T_BACK, 0.2));
  const swipe = easeOut(prog(s, T_MOST + 0.25, 0.25));
  return <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1.25, 1, p) * (1 + 0.04 * prog(s, T_MOST, 1.2)) * lerp(1, 0.6, out)})` }}>
    <div style={{ position: 'absolute', left: 120, width: 840, top: 560, textAlign: 'center', fontFamily: F.display, fontSize: 230, lineHeight: 0.95, color: C.ink, textTransform: 'uppercase' }}>
      Most<br />
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span style={{ position: 'absolute', left: -20, right: -20, top: '18%', bottom: '8%', background: C.yellow, transformOrigin: 'left', transform: `scaleX(${swipe}) skewX(-6deg)`, zIndex: 0 }} />
        <span style={{ position: 'relative' }}>capable</span>
      </span><br />yet
    </div>
    <div style={{ position: 'absolute', left: 120, width: 840, top: 1250, textAlign: 'center' }}><Label style={{ color: C.ink, opacity: 0.7, fontSize: 30 }}>— according to Meta</Label></div>
  </AbsoluteFill>;
};

// ---------------- SET UP THE REAL HOOK: freeze the benchmark chart, cross it out, push it back ----------------
const T_FREEZE = 12.26;     // "aren't"
const T_CROSS = 12.94;      // "actually"
const T_PUSHBACK = 13.24;   // "the interesting part"
export const T_THISIS = b(30); // 14.754

const GROUPS = ['Coding', 'Agents', 'Reasoning'];
const BARS = [[0.8, 0.8, 0.8], [0.76, 0.76, 0.76], [0.82, 0.82, 0.82]]; // equal on purpose: no implied ranking

export const Setup: React.FC<{ s: number }> = ({ s }) => {
  const frozen = s >= T_FREEZE;
  const tGrow = frozen ? T_FREEZE : s; // bars stop dead at the freeze
  const pb = easeInOut(prog(s, T_PUSHBACK, 1.05));
  const dark = easeInOut(prog(s, 13.55, 0.75));
  const freezeKick = frozen ? 1 + 0.035 * (1 - easeOut(prog(s, T_FREEZE, 0.25))) + 0.02 : 1;
  const cross = (at: number, d: string) => {
    const p = easeOut(prog(s, at, 0.13));
    return <path d={d} fill="none" stroke={C.red} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
  };
  return <AbsoluteFill style={{ background: `rgb(${lerp(242, 11, dark)},${lerp(239, 11, dark)},${lerp(232, 12, dark)})` }}>
    {s < T_THISIS && <div style={{ position: 'absolute', inset: 0, transform: `perspective(1400px) translateY(${-140 * pb}px) translateZ(${-1100 * pb}px) rotateX(${24 * pb}deg) scale(${freezeKick})`, opacity: 1 - 0.85 * pb,
      filter: frozen ? `saturate(${lerp(1, 0.25, prog(s, T_FREEZE, 0.15))})` : undefined }}>
      <div style={{ position: 'absolute', left: 130, top: 360, width: 820, height: 900, borderRadius: 36, background: C.white, boxShadow: '0 40px 100px rgba(40,30,10,.2)', padding: '44px 48px', boxSizing: 'border-box' }}>
        <Label style={{ color: C.ink, opacity: 0.5, fontSize: 24 }}>As reported by Meta</Label>
        <div style={{ fontFamily: F.ui, fontWeight: 900, fontSize: 72, letterSpacing: '-0.03em', color: C.ink, marginTop: 10 }}>Benchmarks</div>
        <div style={{ display: 'flex', gap: 22, marginTop: 14, fontFamily: F.ui, fontWeight: 700, fontSize: 25, color: '#555' }}>
          <span><span style={{ color: C.blue }}>■</span> Muse Wonder</span><span><span style={{ color: '#B9B4AA' }}>■</span> Other frontier models</span>
        </div>
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 48, height: 520, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {GROUPS.map((g, gi) => <div key={g} style={{ width: 210, textAlign: 'center' }}>
            <div style={{ height: 440, display: 'flex', gap: 12, alignItems: 'flex-end', justifyContent: 'center' }}>
              {BARS[gi].map((v, bi) => {
                const p = easeOutExpo(prog(tGrow, T_BENCH + 0.04 * (gi * 3 + bi), 0.5));
                const wob = frozen ? 0 : 0.02 * Math.sin(s * 9 + gi * 2 + bi);
                return <div key={bi} style={{ width: 52, height: 430 * (v + wob) * p, borderRadius: 10, background: bi === 0 ? C.blue : '#CFCAC0' }} />;
              })}
            </div>
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: '#666', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{g}</div>
          </div>)}
        </div>
        <div style={{ position: 'absolute', right: 48, top: 54, fontFamily: F.mono, fontSize: 20, color: '#999' }}>Illustration · no scores shown</div>
      </div>
    </div>}
    {s < T_THISIS && <div style={{ position: 'absolute', inset: 0, transform: `perspective(1400px) translateY(${-140 * pb}px) translateZ(${-1100 * pb}px) rotateX(${24 * pb}deg) scale(${freezeKick})`, opacity: 1 - 0.85 * pb }}>
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {cross(T_CROSS, 'M 210 470 C 420 700, 640 920, 880 1180')}
        {cross(T_CROSS + 0.11, 'M 880 450 C 660 690, 450 940, 200 1190')}
      </svg>
    </div>}
    {/* freeze-frame shutter */}
    {frozen && <Fill color="#fff" opacity={clamp(1 - (s - T_FREEZE) / 0.08) * 0.7} />}
    {s >= T_THISIS && <Slam s={s} at={T_THISIS} size={250} y={900} from={1.35}>This is.</Slam>}
  </AbsoluteFill>;
};

export const SETUP_END = DROP;
