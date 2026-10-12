// 0:31.5-1:00 — why Meta cares, the race, the reality check, the closing question.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F, H, W, b, BAR, backOut, clamp, easeIn, easeInOut, easeOut, easeOutExpo, lerp, prog, punch, shake } from './theme';
import { Fill, Label, Photo, Slam, Vignette } from './util';

// ================= WHY META CARES =================
const T_WHY = 16 * BAR;          // 31.475
const T_ANSWER = 31.95;
const T_SHRINK = 17 * BAR;       // 33.443 "Meta doesn't just want another chatbot"
const T_CHATBOT = 34.19;         // punch-in on the word
const T_AGENT = 18 * BAR;        // 35.410 "a personal AI agent"
const T_NODES = [35.9, b(74), b(75), b(76), b(77)].map((t, i) => (i === 0 ? t : t)); // 35.90 36.39 36.89 37.38 37.87
const T_CONTEXT = 37.0;          // "keeps context"
const T_NEWAI = 38.15;           // "actually gets things done"
export const T_RACE = 20 * BAR;  // 39.344

const NODES = [
  { k: 'Email', x: 540, y: 470 }, { k: 'Calendar', x: 820, y: 720 }, { k: 'Code', x: 735, y: 1080 },
  { k: 'Documents', x: 345, y: 1080 }, { k: 'Tasks', x: 260, y: 720 },
];
const CENTER = { x: 540, y: 800 };

const Icon: React.FC<{ k: string }> = ({ k }) => {
  const st = { fill: 'none', stroke: C.ink, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return <svg width={64} height={64} viewBox="0 0 64 64">
    {k === 'Email' && <><rect x={6} y={14} width={52} height={36} rx={6} {...st} /><path d="M8 18 L32 36 L56 18" {...st} /></>}
    {k === 'Calendar' && <><rect x={8} y={12} width={48} height={44} rx={6} {...st} /><path d="M8 26 H56 M22 6 V16 M42 6 V16" {...st} /><circle cx={24} cy={40} r={3} fill={C.ink} /><circle cx={40} cy={40} r={3} fill={C.ink} /></>}
    {k === 'Code' && <path d="M22 18 L8 32 L22 46 M42 18 L56 32 L42 46 M36 12 L28 52" {...st} />}
    {k === 'Documents' && <><path d="M16 6 H38 L50 18 V58 H16 Z" {...st} /><path d="M38 6 V18 H50 M24 32 H42 M24 42 H42" {...st} /></>}
    {k === 'Tasks' && <><rect x={8} y={8} width={48} height={48} rx={8} {...st} /><path d="M18 33 L28 43 L46 22" {...st} /></>}
  </svg>;
};

export const WhyMeta: React.FC<{ s: number }> = ({ s }) => {
  const iris = easeInOut(prog(s, T_WHY, 0.3));
  const shrink = easeInOut(prog(s, T_SHRINK, 0.4));
  const agent = easeInOut(prog(s, T_AGENT + 0.08, 0.32));
  const collapse = easeIn(prog(s, T_RACE - 0.2, 0.25));
  const win = { cx: 540, cy: lerp(780, 560, shrink), sc: lerp(lerp(0.92, 1, iris), 0.46, shrink) * (1 - agent) };
  const chatPunch = punch(s, T_CHATBOT, 0.2);
  const oldOut = 1 - easeOut(prog(s, T_AGENT, 0.12));
  return <AbsoluteFill style={{ background: C.green }}>
    <div style={{ position: 'absolute', left: 540 - 1400 * iris, top: 960 - 1400 * iris, width: 2800 * iris, height: 2800 * iris, borderRadius: '50%', background: C.paper }} />
    {/* the ordinary chatbot window */}
    {win.sc > 0.01 && <div style={{ position: 'absolute', left: 150, top: 330, width: 780, height: 900, borderRadius: 34, background: C.white, boxShadow: '0 40px 100px rgba(40,30,10,.18)', overflow: 'hidden',
      transformOrigin: '390px 450px', transform: `translate(${win.cx - 540}px, ${win.cy - 780}px) scale(${win.sc})` }}>
      <div style={{ height: 86, borderBottom: '2px solid #EEE', display: 'flex', alignItems: 'center', gap: 12, padding: '0 30px' }}>
        {['#E0DED8', '#E0DED8', '#E0DED8'].map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
        <div style={{ marginLeft: 20, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: C.ink }}>Chat</div>
      </div>
      <div style={{ padding: '50px 36px', fontFamily: F.ui, fontWeight: 600, fontSize: 40, lineHeight: 1.3 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#1F1F23', color: '#fff', borderRadius: 30, padding: '20px 28px', maxWidth: 520 }}>What's the capital of Australia?</div></div>
        {s >= T_ANSWER && <div style={{ marginTop: 34, display: 'flex' }}><div style={{ background: '#F1F0EC', color: C.ink, borderRadius: 30, padding: '20px 28px' }}>{'Canberra.'.slice(0, Math.ceil(9 * clamp((s - T_ANSWER) / 0.25)))}</div></div>}
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 30, height: 84, borderRadius: 42, border: '2px solid #E4E2DC', display: 'flex', alignItems: 'center', padding: '0 32px', fontFamily: F.ui, fontSize: 32, color: '#A7A49C' }}>Ask anything</div>
    </div>}
    {/* OLD AI: label + quote */}
    {s >= T_SHRINK + 0.15 && oldOut > 0 && <div style={{ opacity: oldOut * easeOut(prog(s, T_SHRINK + 0.15, 0.2)) }}>
      <div style={{ position: 'absolute', left: 120, width: 840, top: 880, transform: `translateY(${-50 - 30 * (1 - oldOut)}%) scale(${chatPunch * lerp(0.8, 1, oldOut)})`, textAlign: 'center', fontFamily: F.display, fontSize: 168, lineHeight: 1, color: C.ink, textTransform: 'uppercase' }}>Chatbot</div>
      <div style={{ position: 'absolute', left: 120, width: 840, top: 990, textAlign: 'center' }}>
        <Label style={{ color: C.ink, opacity: 0.5, fontSize: 26 }}>Old AI</Label>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 54, color: C.ink, marginTop: 8 }}>“Answer my question.”</div>
      </div>
    </div>}
    {/* NEW AI: an agent connected to the things you work in (concept, not a feature list) */}
    {s >= T_AGENT && <div style={{ position: 'absolute', inset: 0, transformOrigin: `${CENTER.x}px ${CENTER.y}px`, transform: `scale(${1 - collapse})`, opacity: 1 - collapse }}>
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {NODES.map((n, i) => {
          const p = easeOut(prog(s, T_NODES[i], 0.22));
          return s >= T_NODES[i] ? <line key={i} x1={CENTER.x} y1={CENTER.y} x2={lerp(CENTER.x, n.x, p)} y2={lerp(CENTER.y, n.y, p)} stroke={C.ink} strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" /> : null;
        })}
        {s >= T_CONTEXT && <circle cx={CENTER.x} cy={CENTER.y} r={lerp(120, 178, easeOutExpo(prog(s, T_CONTEXT, 0.4)))} fill="none" stroke={C.yellow} strokeWidth={14}
          strokeDasharray="30 22" transform={`rotate(${(s - T_CONTEXT) * 40} ${CENTER.x} ${CENTER.y})`} />}
      </svg>
      <div style={{ position: 'absolute', left: CENTER.x - 125, top: CENTER.y - 125, width: 250, height: 250, borderRadius: 125, background: C.ink, transform: `scale(${backOut(agent)})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, color: C.white, fontSize: 74, lineHeight: 0.95, textTransform: 'uppercase', textAlign: 'center' }}>
        <span style={{ color: C.yellow }}>AI</span>Agent
      </div>
      {NODES.map((n, i) => {
        if (s < T_NODES[i]) return null;
        const p = backOut(prog(s, T_NODES[i], 0.26));
        return <div key={n.k} style={{ position: 'absolute', left: n.x - 70, top: n.y - 70, width: 140, transform: `scale(${clamp(p, 0, 1.3)})`, textAlign: 'center' }}>
          <div style={{ width: 140, height: 140, borderRadius: 32, background: C.white, boxShadow: '0 16px 36px rgba(40,30,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon k={n.k} /></div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 32, color: C.ink, marginTop: 10, marginLeft: -60, marginRight: -60, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{n.k}</div>
        </div>;
      })}
      <div style={{ position: 'absolute', left: 120, width: 840, top: 330, textAlign: 'center', opacity: easeOut(prog(s, T_AGENT + 0.3, 0.3)) }}>
        <Label style={{ color: C.ink, opacity: 0.45, fontSize: 20 }}>Concept illustration · not a list of current features</Label>
      </div>
      {s >= T_NEWAI && <>
        <div style={{ position: 'absolute', left: 120, width: 840, top: 235, textAlign: 'center', fontFamily: F.ui, fontWeight: 700, fontSize: 36, color: '#8E8A80', opacity: easeOut(prog(s, T_NEWAI, 0.2)) }}>
          Old AI: <span style={{ textDecoration: 'line-through', textDecorationThickness: 4 }}>“Answer my question.”</span>
        </div>
        <div style={{ position: 'absolute', left: 120, width: 840, top: 1255, textAlign: 'center', transform: `translateY(-50%) scale(${lerp(1.25, 1, easeOutExpo(prog(s, T_NEWAI, 0.18)))})` }}>
          <span style={{ fontFamily: F.ui, fontWeight: 900, fontSize: 58, color: C.ink, background: C.yellow, padding: '6px 22px', borderRadius: 10 }}>New AI: “Handle this goal.”</span>
        </div>
      </>}
    </div>}
  </AbsoluteFill>;
};

// ================= COMPETITION =================
const T_NAMES = 39.83;
const T_HEAD = b(82);            // 40.328 FRONTIER AI RACE
const CUTS = [21 * BAR, b(85), b(86), b(87)]; // 41.311 41.803 42.295 42.787
const CATS = ['Coding', 'Agents', 'Memory', 'Reasoning'];
const T_WIDE = 22 * BAR;         // 43.279
export const T_REALITY = 44.35;
const LANES = [{ k: 'Meta', c: C.blue, said: 39.83 }, { k: 'OpenAI', c: '#E8E8E8', said: 42.31 }, { k: 'Anthropic', c: '#E8E8E8', said: 43.47 }];
const LANE_Y = [760, 960, 1160];

export const Race: React.FC<{ s: number }> = ({ s }) => {
  const draw = easeOutExpo(prog(s, T_RACE, 0.35));
  let cut = -1; CUTS.forEach((t, i) => { if (s >= t) cut = i; });
  if (s >= T_WIDE) cut = 4;
  const segStart = cut < 0 ? T_RACE + 0.2 : cut < 4 ? CUTS[cut] : T_WIDE;
  // every lane runs level: no leader is implied (no independent scores exist yet)
  const run = (i: number) => {
    const base = lerp(cut < 0 ? 0.08 : 0.3, 0.84, easeOut(prog(s, segStart, cut < 4 ? 0.48 : 0.9)));
    return clamp(base + 0.03 * Math.sin(s * 7 + i * 2.1) * (1 - prog(s, T_WIDE + 0.5, 0.4)), 0, 0.9);
  };
  const frame = [
    'none',
    'perspective(1600px) scale(1.2) translate(70px, 0px)',
    'perspective(1600px) rotateY(-16deg) scale(1.02)',
    'perspective(1600px) scale(1.16) translate(-40px, 20px)',
    'perspective(1600px) rotateX(24deg) scale(1.05)',
    'none',
  ][cut + 1];
  const label = cut >= 0 && cut < 4 ? CATS[cut] : null;
  const x0 = 150, x1 = 900;
  return <AbsoluteFill style={{ background: C.ink }}>
    <div style={{ position: 'absolute', inset: 0, transform: frame, transformOrigin: '540px 960px' }}>
      {/* finish line */}
      <div style={{ position: 'absolute', left: x1 + 10, top: 660, width: 14, height: 600, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 14px, #111 14px 28px)', opacity: 0.85 * draw }} />
      <div style={{ position: 'absolute', left: x1 - 40, top: 575, width: 120, textAlign: 'center', fontFamily: F.display, fontSize: 80, color: C.yellow, opacity: draw }}>?</div>
      {LANES.map((l, i) => {
        const y = LANE_Y[i]; const r = run(i);
        const lit = 1 - prog(s, l.said, 0.6);
        return <div key={l.k}>
          <div style={{ position: 'absolute', left: x0, top: y + 80, width: (x1 - x0) * draw, height: 2, background: 'rgba(255,255,255,.14)' }} />
          <div style={{ position: 'absolute', left: x0, top: y - 9, width: (x1 - x0) * r * draw, height: 18, borderRadius: 9, background: l.c, boxShadow: `0 0 24px ${l.c}55` }} />
          <div style={{ position: 'absolute', left: x0 + (x1 - x0) * r * draw - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: l.c, boxShadow: `0 0 0 6px ${C.ink}` }} />
          <div style={{ position: 'absolute', left: x0, top: y - 78, fontFamily: F.ui, fontWeight: 900, fontSize: 46, letterSpacing: '0.02em', textTransform: 'uppercase',
            color: s >= l.said && lit > 0 ? C.yellow : C.white, opacity: easeOut(prog(s, T_NAMES + i * 0.08, 0.2)) }}>{l.k}</div>
        </div>;
      })}
    </div>
    {/* header / category word */}
    {label
      ? <div key={label} style={{ position: 'absolute', left: 120, width: 840, top: 360, transform: `translateY(-50%) scale(${lerp(1.25, 1, easeOutExpo(prog(s, segStart, 0.12)))})`, textAlign: 'center', fontFamily: F.display, fontSize: 172, lineHeight: 1, color: C.yellow, textTransform: 'uppercase' }}>{label}</div>
      : s >= T_HEAD && <div style={{ position: 'absolute', left: 120, width: 840, top: 360, transform: `translateY(-50%) scale(${lerp(1.3, 1, easeOutExpo(prog(s, cut === 4 ? T_WIDE : T_HEAD, 0.15)))})`, textAlign: 'center', fontFamily: F.display, fontSize: 132, lineHeight: 0.95, color: C.white, textTransform: 'uppercase' }}>Frontier<br />AI race</div>}
    {/* the agent web's dotted links collapse into the three lanes */}
    {s < T_RACE + 0.3 && <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - prog(s, T_RACE, 0.3) }}>
      {LANE_Y.map((y, i) => <line key={i} x1={540} y1={800} x2={lerp(540, 900, draw)} y2={lerp(800, y, draw)} stroke={C.yellow} strokeWidth={5} strokeDasharray="4 12" />)}
    </svg>}
  </AbsoluteFill>;
};

// ================= REALITY CHECK =================
const T_CATCH = 44.69;
const T_REPORT = 45.6;
const T_SRC = 46.82;             // "Meta's"
const T_STAMP = b(96.5);         // 47.459 "testing"
const T_PULL = 47.8;
const T_WAIT = b(99);            // 48.689
export const T_END = 51.9;

export const Reality: React.FC<{ s: number }> = ({ s }) => {
  if (s < T_REPORT) {
    return <AbsoluteFill style={{ background: C.ink }}>
      <Photo src="img/skeptic.jpg" iw={2000} ih={3000} s={s} cam={{ zoom: 1.1 * punch(s, T_CATCH, 0.2), fx: 0.5, fy: 0.38, shakeAmp: 0.9, seed: 12 }} filter="saturate(.55) contrast(1.05)" />
      <Vignette strength={0.5} />
      <div style={{ position: 'absolute', left: 140, top: 200, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: C.ink, borderRadius: 8, opacity: easeOut(prog(s, T_REALITY + 0.05, 0.15)) }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: C.yellow }} /><Label style={{ color: C.white, fontSize: 26 }}>Reality check</Label>
      </div>
    </AbsoluteFill>;
  }
  const pull = easeInOut(prog(s, T_PULL, 0.85));
  const stamp = easeOutExpo(prog(s, T_STAMP, 0.1));
  const kick = s >= T_STAMP ? shake(s * 4, 2.5 * (1 - prog(s, T_STAMP, 0.3)), 3) : { x: 0, y: 0, r: 0 };
  const push = 1 + 0.035 * prog(s, T_REPORT, T_END - T_REPORT);
  const rows = ['Coding', 'Agents', 'Professional tasks'];
  return <AbsoluteFill style={{ background: '#141416' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 2px, transparent 2px)', backgroundSize: '44px 44px' }} />
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 700px', transform: `translate(${kick.x}px, ${kick.y - 175 * pull}px) scale(${lerp(1, 0.76, pull) * push})`,
      opacity: easeOut(prog(s, T_REPORT, 0.15)) }}>
      <div style={{ position: 'absolute', left: 170, top: 380, width: 740, height: 640, borderRadius: 26, background: '#F7F5F0', boxShadow: '0 40px 100px rgba(0,0,0,.5)', padding: '46px 48px', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ position: 'absolute', left: -10, right: -10, top: -4, bottom: -4, background: C.yellow, transformOrigin: 'left', transform: `scaleX(${easeOut(prog(s, T_SRC, 0.22))})`, borderRadius: 4 }} />
          <Label style={{ position: 'relative', color: C.ink, opacity: s >= T_SRC ? 1 : 0.45, fontSize: 22 }}><span style={{ color: C.blue }}>●</span> Source: Meta</Label>
        </div>
        <div style={{ fontFamily: F.ui, fontWeight: 900, fontSize: 70, letterSpacing: '-0.03em', color: C.ink, marginTop: 10, lineHeight: 1 }}>Meta benchmarks</div>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: '#77736A', marginTop: 12 }}>Muse Wonder vs. leading models</div>
        <div style={{ marginTop: 44 }}>
          {rows.map((r, i) => <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26 }}>
            <div style={{ width: 230, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: '#666', textTransform: 'uppercase' }}>{r}</div>
            <div style={{ flex: 1, height: 26, borderRadius: 13, background: '#E7E3DA', overflow: 'hidden' }}>
              <div style={{ width: `${[78, 70, 74][i]}%`, height: '100%', background: '#CFC9BC', filter: 'blur(5px)' }} />
            </div>
          </div>)}
        </div>
      </div>
      {s >= T_STAMP && <div style={{ position: 'absolute', left: 175, width: 730, top: 700, display: 'flex', justifyContent: 'center', transform: `translateY(-50%) rotate(-9deg) scale(${lerp(1.7, 1, stamp)})`, opacity: clamp((s - T_STAMP) / 0.04) }}>
        <div style={{ border: `9px solid ${C.red}`, borderRadius: 18, padding: '10px 30px 4px', fontFamily: F.display, fontSize: 112, lineHeight: 1.05, color: C.red, textTransform: 'uppercase',
          background: 'rgba(255,59,48,.06)', mixBlendMode: 'multiply', WebkitMaskImage: 'repeating-linear-gradient(115deg, #000 0 9px, rgba(0,0,0,.82) 9px 12px)' }}>Internal testing</div>
      </div>}
    </div>
    {s >= T_WAIT && <div style={{ position: 'absolute', left: 120, width: 840, top: 1000, textAlign: 'center', transformOrigin: '420px 150px',
      transform: `translateY(${lerp(30, 0, easeOutExpo(prog(s, T_WAIT, 0.3)))}px) scale(${1 + 0.07 * easeOutExpo(prog(s, b(103), 0.3)) + 0.02 * prog(s, b(103), 1.3)})`, opacity: easeOut(prog(s, T_WAIT, 0.2)) }}>
      <Label style={{ color: C.yellow, fontSize: 26 }}>Status</Label>
      <div style={{ fontFamily: F.display, fontSize: 100, lineHeight: 1.0, color: C.white, textTransform: 'uppercase', marginTop: 10 }}>Waiting for<br />independent tests</div>
      <div style={{ position: 'relative', margin: '26px auto 0', width: 420, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, height: '100%', width: 140, borderRadius: 4, background: C.yellow, left: ((s - T_WAIT) * 260) % 560 - 140 }} />
      </div>
    </div>}
  </AbsoluteFill>;
};

// ================= END: the question =================
const MEMS = ['Building a website', 'Prefers React', 'Meeting Friday', 'Project X', 'Short answers', 'Budget: $0'];
const T_FADE = 55.0;
const T_Q = b(115);              // 56.557 "would you actually want that?"
const T_YN = b(117);             // 57.541
const T_FOLLOW = b(118);         // 58.033

export const End: React.FC<{ s: number }> = ({ s }) => {
  const inP = easeOutExpo(prog(s, T_END, 0.4));
  const gone = easeInOut(prog(s, T_FADE + 1.0, 0.6)); // AI node fades last
  const push = 1 + 0.04 * prog(s, T_END, 8) + 0.14 * easeInOut(prog(s, 27 * BAR, 0.6));
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 44%, #1B1B1F 0%, ${C.ink} 65%)` }}>
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '540px 840px' }}>
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - easeIn(prog(s, T_FADE, 1.2))) * inP }}>
        <ellipse cx={540} cy={840} rx={370} ry={170} fill="none" stroke="rgba(255,225,77,.35)" strokeWidth={3} strokeDasharray="6 14" />
        <ellipse cx={540} cy={840} rx={370} ry={360} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={3} strokeDasharray="6 14" />
      </svg>
      {MEMS.map((m, i) => {
        const a = s * 0.75 + (i / MEMS.length) * Math.PI * 2;
        const depth = (Math.sin(a) + 1) / 2; // 0 back, 1 front
        const x = 540 + Math.cos(a) * 300, y = 840 + Math.sin(a) * (i % 2 ? 360 : 170);
        const appearP = easeOutExpo(prog(s, T_END + 0.12 * i, 0.35));
        const fade = 1 - easeIn(prog(s, T_FADE + i * 0.16, 0.45));
        return <div key={m} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${lerp(0.72, 1.05, depth) * appearP})`, opacity: lerp(0.45, 1, depth) * fade * appearP, zIndex: depth > 0.5 ? 3 : 1,
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 999, background: C.white, fontFamily: F.ui, fontWeight: 800, fontSize: 40, color: C.ink, whiteSpace: 'nowrap' }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.yellow, boxShadow: `0 0 0 3px ${C.ink}` }} />{m}</div>;
      })}
      <div style={{ position: 'absolute', left: 540 - 115, top: 840 - 115, width: 230, height: 230, borderRadius: 115, background: C.yellow, zIndex: 2, transform: `scale(${inP * (1 - gone) * (1 + 0.03 * Math.sin(s * 4))})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 100, color: C.ink, boxShadow: '0 0 80px rgba(255,225,77,.35)' }}>AI</div>
    </div>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 960px', transform: `scale(${1 + 0.045 * prog(s, T_Q, 60 - T_Q)})` }}>
    {s >= T_Q && <Slam s={s} at={T_Q} size={176} y={760} from={1.4}><span style={{ whiteSpace: 'nowrap' }}>Would you</span><br />use it?</Slam>}
    {s >= T_YN && <div style={{ position: 'absolute', left: 120, width: 840, top: 1060, textAlign: 'center', transform: `translateY(-50%) scale(${lerp(1.4, 1, easeOutExpo(prog(s, T_YN, 0.15)))})`,
      fontFamily: F.display, fontSize: 150, lineHeight: 1, textTransform: 'uppercase', color: C.white }}>
      <span style={{ color: C.yellow }}>Yes</span> / No?</div>}
    {s >= T_FOLLOW && <div style={{ position: 'absolute', left: 120, width: 840, top: 1238, textAlign: 'center', fontFamily: F.ui, fontWeight: 700, fontSize: 36, color: 'rgba(255,255,255,.72)', opacity: easeOut(prog(s, T_FOLLOW, 0.3)) }}>
      Follow for daily AI updates.</div>}
    </div>
  </AbsoluteFill>;
};
