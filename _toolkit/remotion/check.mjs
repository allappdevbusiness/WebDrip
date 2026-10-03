// WebDrip toolkit — alignment checker. Renders stills at the start, middle and end of every scene and at
// every transition midpoint for both cuts, logs DOM bounding boxes from the composition and checks them.
// Usage: node --experimental-strip-types check.mjs [feed|tiktok]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import * as L from './src/layout.ts';

const BROWSER = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).map((d) => `/opt/pw-browsers/${d}/chrome-linux/headless_shell`)[0];
const OUT = '/tmp/stills/check'; fs.mkdirSync(OUT, { recursive: true });
const fmts = process.argv[2] ? [process.argv[2]] : ['feed', 'tiktok'];
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });

const inside = (b, r, tol = 0.5) => b.x >= r.x - tol && b.y >= r.y - tol && b.x + b.w <= r.x + r.w + tol && b.y + b.h <= r.y + r.h + tol;
const inter = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const IMPORTANT = ['frame', 'phone', 'tile', 'text', 'logo', 'button', 'subs'];

const report = { pass: true, stills: [] };
for (const fmt of fmts) {
  const id = fmt === 'feed' ? 'Feed' : 'TikTok';
  const comp = await selectComposition({ serveUrl, id, inputProps: { fmt, logBoxes: true }, browserExecutable: BROWSER });
  const frames = [];
  L.SCENES.forEach((s, i) => {
    const st = L.sceneStart(i), en = L.sceneEnd(i);
    const restStart = s === 'hook' ? 66 : s === 'end' ? L.LOGO_HIT + 50 : st + 2 * L.X + 18;
    frames.push({ f: Math.max(0, i === 0 ? 0 : st), kind: 'scene-start', s });
    frames.push({ f: restStart, kind: 'rest', s });
    frames.push({ f: Math.round((restStart + en - 2 * L.X) / 2), kind: 'rest', s });
    frames.push({ f: en - (i === L.SCENES.length - 1 ? 1 : 2 * L.X + 1), kind: 'rest', s });
    if (i > 0) frames.push({ f: L.B[i], kind: 'transition', s });
  });
  const SAFE = L.SAFE[fmt], CAN = { x: 0, y: 0, w: L.CANVAS[fmt].w, h: L.CANVAS[fmt].h };
  for (const fr of frames) {
    let boxes = null;
    const file = `${OUT}/${fmt}-${String(fr.f).padStart(4, '0')}.png`;
    await renderStill({ composition: comp, serveUrl, frame: fr.f, output: file, inputProps: { fmt, logBoxes: true }, browserExecutable: BROWSER,
      onBrowserLog: (log) => { if (log.text.startsWith('BOXES')) boxes = JSON.parse(log.text.slice(5)); } });
    const errs = [];
    if (!boxes) errs.push('no boxes logged');
    else {
      const vis = boxes.filter((b) => b.w > 0 && b.h > 0);
      const rest = fr.kind === 'rest';
      const sceneOf = (b) => b.scene || 'global';
      for (const b of vis) {
        if (!IMPORTANT.includes(b.kind)) continue;
        if (rest && !inside(b, SAFE)) errs.push(`${b.id} outside safe area ${JSON.stringify([b.x, b.y, b.w, b.h])}`);
        if (fr.kind === 'transition' && ['frame', 'phone', 'tile'].includes(b.kind) && !inside(b, CAN, 2)) errs.push(`${b.id} cropped by canvas mid-transition`);
        if (fmt === 'tiktok' && rest) for (const u of L.TT_UI) if (inter(b, u)) errs.push(`${b.id} touches TikTok UI ${JSON.stringify(u)}`);
      }
      if (rest) {
        const tol = fmt === 'tiktok' ? 4 : 2;
        const centred = (b, id) => {
          const lm = b.x - SAFE.x, rm = SAFE.x + SAFE.w - (b.x + b.w);
          if (Math.abs(lm - rm) > tol) errs.push(`${id} not centred (L ${lm.toFixed(1)} / R ${rm.toFixed(1)})`);
        };
        for (const b of vis.filter((x) => ['frame', 'phone', 'tile', 'logo', 'button'].includes(x.kind) && !x.offset)) centred(b, b.id);
        // deliberately offset pieces (split screen, bento halves) must be centred as one group
        const byScene = {};
        for (const b of vis.filter((x) => x.offset)) (byScene[b.scene] = byScene[b.scene] || []).push(b);
        for (const [sc, bs] of Object.entries(byScene)) {
          const x0 = Math.min(...bs.map((b) => b.x)), x1 = Math.max(...bs.map((b) => b.x + b.w));
          centred({ x: x0, w: x1 - x0 }, `${sc} offset group [${bs.map((b) => b.id).join('+')}]`);
        }
        // device screens: correct aspect and fully covered by their video (no gaps)
        for (const sc of vis.filter((x) => x.kind === 'screen')) {
          const want = sc.id === 'phone-screen' ? L.MOB.w / L.MOB.h : L.DESK.w / L.DESK.h;
          if (Math.abs(sc.w / sc.h - want) / want > 0.005) errs.push(`${sc.id} aspect ${(sc.w / sc.h).toFixed(4)} != ${want.toFixed(4)}`);
          const v = vis.filter((x) => x.kind === 'video' && x.scene === sc.scene && inter(x, sc));
          if (!v.some((x) => x.x <= sc.x + 1 && x.y <= sc.y + 1 && x.x + x.w >= sc.x + sc.w - 1 && x.y + x.h >= sc.y + sc.h - 1)) errs.push(`${sc.id} not filled by its clip`);
        }
        // text never overlaps device frames; subtitles never collide with anything important
        const texts = vis.filter((x) => x.kind === 'text' && x.op > 0.05), devs = vis.filter((x) => ['frame', 'phone', 'tile'].includes(x.kind));
        for (const tx of texts) for (const d of devs) if (sceneOf(tx) === sceneOf(d) && inter(tx, d)) errs.push(`${tx.id} overlaps ${d.id}`);
        for (const sb of vis.filter((x) => x.kind === 'subs')) for (const o of vis.filter((x) => IMPORTANT.includes(x.kind) && x.kind !== 'subs')) if (inter(sb, o)) errs.push(`subs collide with ${o.id}`);
        // flat & square during holds
        const sIdx = L.SCENES.indexOf(fr.s); const m = L.sceneMotion(fmt, sIdx, fr.f);
        if (Math.abs(m.rotX) > 0.01 || Math.abs(m.rotY) > 0.01) errs.push(`tilted during hold (${m.rotX.toFixed(2)}, ${m.rotY.toFixed(2)})`);
      }
    }
    const ok = errs.length === 0; if (!ok) report.pass = false;
    report.stills.push({ fmt, frame: fr.f, kind: fr.kind, scene: fr.s, ok, errs, boxes: boxes ? boxes.length : 0 });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${fmt} f${fr.f} ${fr.kind} ${fr.s}${ok ? '' : ' -> ' + errs.join('; ')}`);
  }
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
console.log(report.pass ? 'ALIGNMENT CHECK PASSED' : 'ALIGNMENT CHECK FAILED');
process.exit(report.pass ? 0 : 1);
