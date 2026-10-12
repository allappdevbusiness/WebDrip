// 0:15.7-0:31.5 — Active Memory (lands on the drop) and Active Focus.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F, H, W, b, BAR, DROP, backOut, clamp, easeIn, easeInOut, easeOut, easeOutExpo, lerp, prog, punch, shake } from './theme';
import { Bubble, ChatHeader, Doodle, Fill, InputBar, Label, Photo, PovPhone, SCREEN, Slam, Vignette, povToFrame } from './util';

// ================= ACTIVE MEMORY =================
const T_AVATAR = b(34);            // 16.721 "the AI can remember..."
const T_CHIPS = [9 * BAR, b(37), b(38), b(39)]; // 17.705 18.197 18.689 19.180
const T_STORE = 10 * BAR;          // 19.672 "across conversations"
export const T_CAL = b(42);        // 20.655 "instead of starting from zero"
const T_FLIP = [b(43), b(44)];     // 21.147 -> DAY 7, 21.639 -> DAY 30
export const T_DAY30 = b(45);      // 22.131 new conversation
const T_REPLAY = b(46);            // 22.623 freeze + doodle
const T_CONTEXT = 22.87;           // IT REMEMBERS CONTEXT.
const T_GROW = 23.62;              // memory dot grows into the workflow node
export const T_FOCUS = 23.95;      // "Then there's Active Focus"

const CHIPS = [
  { t: 'Building a website', x: 150, y: 455 },
  { t: 'Prefers React', x: 590, y: 560 },
  { t: 'Meeting Friday', x: 140, y: 1000 },
  { t: 'Working on Project X', x: 470, y: 1095 },
];
const SLOTS = [{ x: 205, y: 1190 }, { x: 555, y: 1190 }, { x: 205, y: 1256 }, { x: 555, y: 1256 }];
const AV = { x: 540, y: 760 };

const Avatar: React.FC<{ s: number; p: number }> = ({ s, p }) => {
  const breathe = 1 + 0.012 * Math.sin(s * 3);
  const ring = T_CHIPS.reduce((acc, t) => Math.max(acc, s >= t ? 1 - prog(s, t, 0.45) : 0), 0);
  return <div style={{ position: 'absolute', left: AV.x - 160, top: AV.y - 110, width: 320, height: 260, transform: `scale(${lerp(0.6, 1, p) * breathe})`, opacity: p }}>
    <div style={{ position: 'absolute', left: 160 - 68 - 24 * ring, top: 0 - 24 * ring, width: 136 + 48 * ring, height: 136 + 48 * ring, borderRadius: '50%', border: `4px solid rgba(255,225,77,${ring})` }} />
    <div style={{ position: 'absolute', left: 92, top: 0, width: 136, height: 136, borderRadius: '50%', background: C.white }} />
    <div style={{ position: 'absolute', left: 30, top: 150, width: 260, height: 110, borderRadius: '130px 130px 30px 30px', background: C.white }} />
    <div style={{ position: 'absolute', left: 0, width: 320, top: 275, textAlign: 'center' }}><Label style={{ color: C.white, fontSize: 24, opacity: 0.8 }}>You</Label></div>
  </div>;
};

const MemChip: React.FC<{ t: string; style: React.CSSProperties; size?: number }> = ({ t, style, size = 38 }) => (
  <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 12, padding: `${size * 0.32}px ${size * 0.55}px`, borderRadius: 999, background: C.white,
    fontFamily: F.ui, fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(0,0,0,.35)', ...style }}>
    <span style={{ width: size * 0.36, height: size * 0.36, borderRadius: '50%', background: C.yellow, boxShadow: `0 0 0 3px ${C.ink}` }} />{t}
  </div>
);

const Page: React.FC<{ n: string; style?: React.CSSProperties }> = ({ n, style }) => (
  <div style={{ position: 'absolute', left: 604, top: 1380, width: 792, height: 706, borderRadius: '0 0 58px 58px', background: 'linear-gradient(180deg, #F3F5F1 0%, #F1F3EE 70%, #EDEFEA 100%)', ...style }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 84, letterSpacing: '0.2em', color: '#1A1A1A' }}>DAY</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: F.ui, fontWeight: 900, fontSize: 400, letterSpacing: '-0.05em', lineHeight: 1.1, color: '#121212' }}>{n}</div>
  </div>
);

const Calendar: React.FC<{ s: number }> = ({ s }) => {
  const nums = ['1', '7', '30'];
  const idx = s >= T_FLIP[1] ? 2 : s >= T_FLIP[0] ? 1 : 0;
  const flipAt = idx > 0 ? T_FLIP[idx - 1] : -1;
  const fp = flipAt > 0 ? easeIn(prog(s, flipAt, 0.2)) : 1;
  const zoom = 1.42 + 0.34 * easeIn(prog(s, T_CAL, T_DAY30 - T_CAL)); // speed ramp
  return <Photo src="img/calendar_blank.jpg" iw={2000} ih={3000} s={s} cam={{ zoom, fx: 0.5, fy: 0.565, dy: -50, shakeAmp: 0.7, seed: 11 }}>
    <Page n={nums[idx]} />
    {flipAt > 0 && fp < 1 && <>
      <div style={{ position: 'absolute', left: 604, top: 1380, width: 792, height: 706, background: `linear-gradient(180deg, rgba(0,0,0,${0.35 * (1 - fp)}), rgba(0,0,0,0) 60%)` }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 2000, height: 3000, perspective: 2200, perspectiveOrigin: '1000px 1380px' }}>
        <Page n={nums[idx - 1]} style={{ background: 'linear-gradient(180deg, #F3F5F1, #EDEFEA)', transformOrigin: '50% 0', transform: `rotateX(${-100 * fp}deg)`, filter: `brightness(${1 - 0.35 * fp})`, backfaceVisibility: 'hidden' }} />
      </div>
    </>}
  </Photo>;
};

const DAY30_PILLS = ['Prefers React', 'Project X site', 'Meeting Friday', 'Short answers'];
const PILL_POS = [{ x: 18, y: 152 }, { x: 186, y: 152 }, { x: 18, y: 200 }, { x: 196, y: 200 }];
const ChatDay30: React.FC<{ s: number }> = ({ s }) => {
  const msg = 'Welcome back! Want to keep going on the Project X site in React? Your meeting is Friday.';
  const typed = Math.floor(msg.length * clamp((s - (T_DAY30 + 0.32)) / 0.55));
  return <AbsoluteFill style={{ background: '#fff' }}>
    <ChatHeader title="New chat" stamp="DAY 30 · 9:15 AM" />
    <div style={{ position: 'absolute', left: 18, top: 116, fontFamily: F.mono, fontWeight: 700, fontSize: 11.5, letterSpacing: '0.1em', color: '#8A8A8A', opacity: clamp((s - T_DAY30) / 0.12) }}>REMEMBERED FROM EARLIER CHATS</div>
    {DAY30_PILLS.map((t, i) => {
      const p = easeOutExpo(prog(s, T_DAY30 + 0.04 + i * 0.05, 0.3));
      return <div key={t} style={{ position: 'absolute', left: PILL_POS[i].x, top: PILL_POS[i].y, transform: `translateY(${lerp(-260, 0, p)}px)`, opacity: clamp(p * 2),
        display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 999, background: '#FFF6C7', border: '1.5px solid #E8CF4A',
        fontFamily: F.ui, fontWeight: 800, fontSize: 15, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: '#E2B600' }} />{t}</div>;
    })}
    <div style={{ position: 'absolute', left: 0, top: 262, width: SCREEN.w }}>
      {typed > 0 && <Bubble>{msg.slice(0, typed)}</Bubble>}
    </div>
    <InputBar s={s} />
  </AbsoluteFill>;
};
const DAY30_CAM = (s: number) => ({ zoom: 2.0 + 0.06 * prog(s, T_DAY30, 0.5), fx: 0.497, fy: 0.5, shakeAmp: 0.8, seed: 3 });

export const Memory: React.FC<{ s: number }> = ({ s }) => {
  // A: the drop — ACTIVE MEMORY on highlighter yellow
  if (s < T_AVATAR) {
    const hit = shake(s, 3.5 * (1 - prog(s, DROP, 0.5)), 5);
    return <AbsoluteFill style={{ background: C.yellow }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${hit.x}px, ${hit.y}px)` }}>
        <div style={{ position: 'absolute', left: 0, width: W, top: 520, textAlign: 'center', opacity: clamp((s - DROP - 0.1) / 0.1) }}>
          <Label style={{ color: C.ink, fontSize: 30 }}>New in Muse Wonder · 01</Label>
        </div>
        <Slam s={s} at={DROP} size={218} y={900} color={C.ink} from={1.8}>Active<br />Memory.</Slam>
      </div>
    </AbsoluteFill>;
  }
  // B: a person, the things worth remembering, stored into memory
  if (s < T_CAL) {
    const pa = easeOutExpo(prog(s, T_AVATAR, 0.3));
    const store = (i: number) => easeInOut(prog(s, T_STORE + i * 0.06, 0.38));
    const panel = easeOutExpo(prog(s, T_STORE - 0.05, 0.3));
    const saved = easeOut(prog(s, T_STORE + 0.55, 0.2));
    return <AbsoluteFill style={{ background: C.ink }}>
      <Photo src="img/typing_ots.jpg" iw={2000} ih={3000} s={s} cam={{ zoom: 1.08 + 0.06 * prog(s, T_AVATAR, 4), fx: 0.5, fy: 0.5, shakeAmp: 0.4, seed: 6 }} filter="brightness(.38) blur(5px) saturate(.8)" />
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {CHIPS.map((c, i) => {
          const p = easeOut(prog(s, T_CHIPS[i], 0.2)) * (1 - store(i));
          const cx = c.x + 150, cy = c.y + 30;
          return s >= T_CHIPS[i] ? <line key={i} x1={AV.x} y1={AV.y} x2={lerp(AV.x, cx, p)} y2={lerp(AV.y, cy, p)} stroke="rgba(255,225,77,.55)" strokeWidth={3} strokeDasharray="8 10" /> : null;
        })}
      </svg>
      <Avatar s={s} p={pa * lerp(1, 0.55, panel)} />
      {/* memory panel */}
      <div style={{ position: 'absolute', left: 170, top: 1110, width: 740, height: 225, borderRadius: 30, background: 'rgba(255,255,255,.08)', border: '2px solid rgba(255,225,77,.7)',
        transform: `scale(${lerp(0.85, 1, panel)})`, opacity: panel, boxShadow: saved ? `0 0 ${40 * saved}px rgba(255,225,77,.35)` : undefined }}>
        <div style={{ position: 'absolute', left: 28, top: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
          <Label style={{ color: C.yellow, fontSize: 24 }}>Memory</Label>
          <Label style={{ color: C.white, opacity: 0.55 * saved, fontSize: 20 }}>· kept across chats ✓</Label>
        </div>
      </div>
      {CHIPS.map((c, i) => {
        if (s < T_CHIPS[i]) return null;
        const p = backOut(prog(s, T_CHIPS[i], 0.28));
        const st = store(i);
        const x = lerp(c.x, SLOTS[i].x, st), y = lerp(c.y, SLOTS[i].y, st);
        return <MemChip key={i} t={c.t} size={lerp(38, 25, st)} style={{ left: x, top: y, transform: `scale(${lerp(0.4, 1, clamp(p, 0, 1.2))})`, transformOrigin: 'left center', opacity: clamp(p * 2) }} />;
      })}
    </AbsoluteFill>;
  }
  // C: tactile flip calendar, DAY 1 -> 7 -> 30 (speed-ramped push)
  if (s < T_DAY30) {
    return <AbsoluteFill style={{ background: C.ink }}><Calendar s={s} /><Vignette strength={0.55} /></AbsoluteFill>;
  }
  // D: same real phone, day 30: memories reconnect instead of an empty chat; sports-replay freeze + doodle
  const frozen = s >= T_REPLAY;
  const camS = frozen ? T_REPLAY : s;
  const cam = DAY30_CAM(camS);
  const pill = povToFrame(PILL_POS[0].x + 14, PILL_POS[0].y + 15, camS, cam);
  const tip = povToFrame(PILL_POS[0].x + 132, PILL_POS[0].y + 28, camS, cam);
  const grow = easeIn(prog(s, T_GROW, T_FOCUS - T_GROW));
  return <AbsoluteFill style={{ background: C.ink }}>
    <PovPhone s={camS} cam={cam} filter={frozen ? `saturate(${lerp(1, 0.3, prog(s, T_REPLAY, 0.12))}) contrast(1.05)` : undefined}><ChatDay30 s={frozen ? T_REPLAY + 0.95 : s} /></PovPhone>
    <Vignette strength={0.45} />
    {frozen && <>
      <Fill color="#fff" opacity={clamp(1 - (s - T_REPLAY) / 0.06) * 0.6} />
      <div style={{ position: 'absolute', left: 140, top: 190, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: C.ink, borderRadius: 8, opacity: clamp((s - T_REPLAY) / 0.05) }}>
        <span style={{ width: 16, height: 16, borderRadius: 8, background: C.red }} /><Label style={{ color: C.white, fontSize: 26 }}>Replay</Label>
      </div>
      <Doodle s={s} at={T_REPLAY + 0.05} color={C.red} path={`M 640 925 C 760 820, 700 ${tip.y + 90}, ${tip.x + 22} ${tip.y + 14} M ${tip.x + 22} ${tip.y + 14} l 12 50 M ${tip.x + 22} ${tip.y + 14} l 52 -16`} note="remembered!" noteX={400} noteY={1010} />
      <div style={{ position: 'absolute', left: 0, width: W, top: 1075, display: 'flex', justifyContent: 'center', opacity: clamp((s - T_CONTEXT) / 0.05) }}>
        <div style={{ background: C.ink, padding: '18px 40px 22px', transform: `rotate(-2deg) scale(${lerp(1.3, 1, easeOutExpo(prog(s, T_CONTEXT, 0.15)))})`, textAlign: 'center',
          fontFamily: F.display, fontSize: 118, lineHeight: 1.0, color: C.white, textTransform: 'uppercase', boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}>
          It remembers<br /><span style={{ color: C.yellow }}>context.</span>
        </div>
      </div>
    </>}
    {/* the remembered dot grows into Active Focus' first workflow node */}
    {grow > 0 && <div style={{ position: 'absolute', left: pill.x - 2400 * grow, top: pill.y - 2400 * grow, width: 4800 * grow, height: 4800 * grow, borderRadius: '50%', background: C.yellow }} />}
  </AbsoluteFill>;
};

// ================= ACTIVE FOCUS =================
const T_TITLE = b(50);       // 24.590 "Active Focus"
const T_GOAL = b(51);        // 25.082
const T_N1 = 13 * BAR;       // 25.574 STEP 1
const T_N2 = b(53);          // 26.066 STEP 2
const T_ERR = b(53.5);       // 26.312 "stuck" -> ERROR
const T_REROUTE = 26.62;     // path physically changes direction
const T_TRY = 14 * BAR;      // 27.541 "try"
const T_NEW = b(57);         // 28.033 "another approach"
export const T_SUCCESS = 15 * BAR; // 29.508
const T_REACT = 29.8;        // human reaction punch-in
const T_GIVEUP = 30.13;      // AI THAT DOESN'T JUST GIVE UP.
const T_PUSH = 30.95;        // push through the SUCCESS card
export const T_WHY = 16 * BAR; // 31.475

const N = { n1: [230, 650], n2: [230, 830], err: [230, 1010], tr: [590, 830], nw: [590, 1010], ok: [590, 1200] };
const SEG = {
  a: `M 230 650 L 230 830`, b: `M 230 830 L 230 1010`,
  c: `M 230 830 C 350 830, 430 760, 590 830`, d: `M 590 830 L 590 1010`,
  e: `M 590 1010 C 470 1050, 470 1080, 590 1100 S 710 1160, 590 1200`,
};

const Node: React.FC<{ at: number; s: number; pos: number[]; color: string; step?: string; label: string; icon?: string; labelColor?: string }> = ({ at, s, pos, color, step, label, icon, labelColor }) => {
  const on = s >= at; const p = backOut(prog(s, at, 0.25));
  if (s < at - 0.35) return null;
  const pre = clamp((s - (at - 0.35)) / 0.2);
  return <div style={{ opacity: on ? 1 : pre * 0.6 }}>
    <div style={{ position: 'absolute', left: pos[0] - 30, top: pos[1] - 30, width: 60, height: 60, borderRadius: 30, border: `4px solid ${on ? color : 'rgba(255,255,255,.25)'}`,
      background: on ? color : C.ink, transform: `scale(${on ? lerp(0.6, 1, clamp(p, 0, 1.3)) : 1})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.ui, fontWeight: 900, fontSize: 30, color: C.ink, boxShadow: on ? `0 0 ${30}px ${color}` : undefined }}>{on ? icon : ''}</div>
    <div style={{ position: 'absolute', left: pos[0] + 52, top: pos[1] - 40, opacity: on ? 1 : 0 }}>
      {step && <Label style={{ color: on ? color : C.white, fontSize: 20, opacity: 0.85 }}>{step}</Label>}
      <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 40, color: labelColor ?? C.white, lineHeight: 1.1, marginTop: step ? 2 : 14, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  </div>;
};

export const Focus: React.FC<{ s: number }> = ({ s }) => {
  // the yellow fill shrinks into node 1
  const shrink = easeInOut(prog(s, T_FOCUS, 0.4));
  const titleP = easeOutExpo(prog(s, T_TITLE, 0.18));
  const dock = easeInOut(prog(s, T_TITLE + 0.42, 0.3));
  const errShake = s >= T_ERR ? shake(s * 3, 3.2 * (1 - prog(s, T_ERR, 0.4)), 9) : { x: 0, y: 0, r: 0 };
  const seg = (d: string, from: number, dur: number, color: string, dim = 1) => {
    const p = easeInOut(prog(s, from, dur));
    return s >= from ? <path d={d} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={dim} /> : null;
  };
  // progress of the goal bar
  const goal = s < T_N1 ? 0 : s < T_N2 ? 0.12 : s < T_TRY ? 0.25 : s < T_NEW ? 0.45 : s < T_SUCCESS ? lerp(0.6, 0.95, prog(s, T_NEW, T_SUCCESS - T_NEW)) : 1;
  const errBack = prog(s, T_ERR, 0.3); // dot recoils from the wall
  const okP = backOut(prog(s, T_SUCCESS, 0.3));
  const push = easeIn(prog(s, T_PUSH, T_WHY - T_PUSH));
  const showCard = s >= T_SUCCESS;
  if (s >= T_REACT && s < T_GIVEUP) {
    return <AbsoluteFill style={{ background: C.ink }}>
      <Photo src="img/celebrate.jpg" iw={2000} ih={3000} s={s} cam={{ zoom: 1.2 * punch(s, T_REACT, 0.2), fx: 0.45, fy: 0.42, shakeAmp: 1.6, seed: 8 }} />
      <Vignette strength={0.5} />
    </AbsoluteFill>;
  }
  return <AbsoluteFill style={{ background: C.ink }}>
    <Photo src="img/code_laptop.jpg" iw={2000} ih={3000} s={s} cam={{ zoom: 1.1 + 0.08 * prog(s, T_FOCUS, 7), fx: 0.5, fy: 0.5, shakeAmp: 0.3 }} filter="brightness(.22) blur(3px) saturate(.6)" />
    {/* faint mission-control grid */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.045) 2px, transparent 2px)', backgroundSize: '90px 90px' }} />
    <div style={{ position: 'absolute', inset: 0, transform: `translate(${errShake.x}px, ${errShake.y}px) scale(${1 + push * 0.04})`, opacity: showCard ? lerp(1, 0.35, easeOut(prog(s, T_SUCCESS, 0.3))) * (1 - easeOut(prog(s, T_GIVEUP, 0.2))) : 1 }}>
      {/* goal card */}
      {s >= T_GOAL && <div style={{ position: 'absolute', left: 140, top: 340, width: 800, height: 175, borderRadius: 28, background: C.ink2, border: '2px solid rgba(255,255,255,.12)',
        transform: `translateY(${lerp(40, 0, easeOutExpo(prog(s, T_GOAL, 0.3)))}px)`, opacity: easeOut(prog(s, T_GOAL, 0.2)) }}>
        <div style={{ position: 'absolute', left: 36, top: 26 }}><Label style={{ color: C.yellow, fontSize: 22 }}>Goal</Label></div>
        <div style={{ position: 'absolute', left: 36, top: 58, fontFamily: F.ui, fontWeight: 800, fontSize: 56, color: C.white, letterSpacing: '-0.02em' }}>Build landing page</div>
        <div style={{ position: 'absolute', left: 36, right: 36, bottom: 22, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.12)' }}>
          <div style={{ width: `${goal * 100}%`, height: '100%', borderRadius: 5, background: goal >= 1 ? C.green : C.yellow }} />
        </div>
      </div>}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* ghost route */}
        {s >= T_GOAL && <path d="M 230 650 L 230 1200" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={10} strokeLinecap="round" strokeDasharray="2 18" />}
        {s >= T_REROUTE && [SEG.c, SEG.d, SEG.e].map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={10} strokeLinecap="round" strokeDasharray="2 18" opacity={easeOut(prog(s, T_REROUTE, 0.3))} />)}
        {seg(SEG.a, T_N1, T_N2 - T_N1, C.white)}
        {seg(SEG.b, T_N2, T_ERR - T_N2, s >= T_ERR ? C.red : C.white, s >= T_ERR ? lerp(1, 0.45, errBack) : 1)}
        {seg(SEG.c, T_REROUTE, T_TRY - T_REROUTE, C.white)}
        {seg(SEG.d, T_TRY, T_NEW - T_TRY, C.white)}
        {seg(SEG.e, T_NEW, T_SUCCESS - T_NEW, C.white)}
        {/* obstacles the line weaves through */}
        {s >= T_NEW - 0.2 && <g opacity={easeOut(prog(s, T_NEW - 0.2, 0.25))}>
          <rect x={640} y={1035} width={70} height={46} rx={10} fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" strokeWidth={3} />
          <rect x={468} y={1118} width={70} height={46} rx={10} fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" strokeWidth={3} />
        </g>}
      </svg>
      {s >= T_GOAL && <>
        <Node s={s} at={T_N1} pos={N.n1} color={C.white} step="Step 1" label="Research" icon="1" />
        <Node s={s} at={T_N2} pos={N.n2} color={C.white} step="Step 2" label="Generate" icon="2" />
        <Node s={s} at={T_ERR} pos={N.err} color={C.red} label="Error" icon="✕" labelColor={s >= T_ERR ? C.red : C.white} />
        <Node s={s} at={T_TRY} pos={N.tr} color={C.amber} label="Try again" icon="↻" />
        <Node s={s} at={T_NEW} pos={N.nw} color={C.amber} label="New approach" icon="→" />
        <Node s={s} at={T_SUCCESS} pos={N.ok} color={C.green} label="Success" icon="✓" />
      </>}
      {s >= T_ERR && s < T_REROUTE + 0.3 && <div style={{ position: 'absolute', left: 140, top: 1065, fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: C.red, opacity: 1 - prog(s, T_REROUTE, 0.3) }}>build failed · retrying</div>}
    </div>
    {/* title slam, then docks as the header */}
    {s >= T_TITLE && <div style={{ position: 'absolute', left: 120, width: 840, top: lerp(900, 225, dock), transform: `translateY(-50%) scale(${lerp(1.6, 1, titleP) * lerp(1, 0.52, dock)})`, textAlign: 'center',
      fontFamily: F.display, fontSize: 220, lineHeight: 0.92, color: C.white, textTransform: 'uppercase', opacity: showCard ? 1 - easeOut(prog(s, T_GIVEUP - 0.05, 0.1)) : 1 }}>
      {dock < 0.5 ? <>Active<br />Focus.</> : <span style={{ whiteSpace: 'nowrap' }}>Active Focus.</span>}
    </div>}
    {/* SUCCESS card (camera pushes through it into the next section) */}
    {showCard && <div style={{ position: 'absolute', left: 190, top: 720, width: 700, height: 300, borderRadius: 40, background: C.green, transformOrigin: '540px 870px',
      transform: `scale(${lerp(0.5, 1, clamp(okP, 0, 1.2)) * (1 + 14 * push * push)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 40px 100px rgba(34,197,94,.35)' }}>
      <div style={{ fontFamily: F.display, fontSize: 150, lineHeight: 1, color: C.ink, opacity: 1 - push * 3 }}>✓ SUCCESS</div>
      <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 36, color: C.ink, opacity: 0.75 * (1 - push * 3), marginTop: 8 }}>Landing page built</div>
    </div>}
    {s >= T_GIVEUP && <div style={{ position: 'absolute', left: 120, width: 840, top: 400, transform: `translateY(-50%) scale(${lerp(1.3, 1, easeOutExpo(prog(s, T_GIVEUP, 0.15)))})`, textAlign: 'center',
      fontFamily: F.display, fontSize: 118, lineHeight: 0.98, color: C.white, textTransform: 'uppercase', opacity: (1 - push * 2.5) * clamp((s - T_GIVEUP) / 0.05) }}>
      AI that doesn't<br /><span style={{ color: C.green }}>just give up.</span>
    </div>}
    {/* opening: yellow fill shrinking into node 1 */}
    {shrink < 1 && <div style={{ position: 'absolute', left: lerp(540, N.n1[0], shrink) - lerp(1500, 30, shrink), top: lerp(960, N.n1[1], shrink) - lerp(1500, 30, shrink),
      width: 2 * lerp(1500, 30, shrink), height: 2 * lerp(1500, 30, shrink), borderRadius: '50%', background: C.yellow }} />}
  </AbsoluteFill>;
};
