// WebDrip toolkit — frame-by-frame site recorder (Playwright + CDP).
// Usage: NODE_PATH=<remotion project>/node_modules node rec.js plan.json
// plan.json: {
//   "url": "http://localhost:8080/<slug>/" (a profile may override it with its own "url"), "out": "/tmp/rec", "fps": 30, "rate": 0.1667,
//   "profiles": [{ "name": "desk", "viewport": {"width":1440,"height":900}, "dpr": 1, "mobile": false,
//     "shots": [{ "name": "hero", "frames": 180, "fresh": true,
//                 "from": 0 | "#id" | "#id+40" | "bottom", "to": ..., "ease": "inout", "holdStart": 20, "holdEnd": 20,
//                 "actions": [{ "frame": 60, "type": "click"|"tap"|"hover"|"fill"|"press"|"eval"|"mouse"|"probe", "selector": "#burger", "value": "x" }] }] }]
// }
// The recorder only drives the scroll position when a shot's "from" and "to" differ (between holdStart and
// holdEnd); otherwise the page scrolls itself (smooth anchor links keep working). Every click/tap/hover target's
// rect and each "probe" (selectors: [...]) is written to <out>/<profile>-<shot>.json with scrollY, so overlays
// (cursor, tap rings, underlines) can be drawn on the real positions. Frame intervals are logged too: if
// "late" frames show up, lower "rate" so each screenshot fits inside one slowed frame.
// Every shot is captured as numbered JPEGs and encoded to <out>/<profile>-<shot>.mp4 (H.264, yuv420p).
// CSS/Web animations are slowed with Animation.setPlaybackRate and each frame waits (1/fps)/rate of real
// time, so reveal animations play at real speed in the clip. Pages that read window.__wdTimeScale
// slow their JS-driven timing (count-ups, lerps) to match.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const plan = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const FPS = plan.fps || 30;
const RATE = plan.rate || 1 / 6;
const FRAME_MS = (1000 / FPS) / RATE;
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;

const ease = {
  linear: (t) => t,
  inout: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  out: (t) => 1 - Math.pow(1 - t, 3),
};

async function resolveY(page, spec) {
  if (typeof spec === 'number') return spec;
  return page.evaluate((s) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (s === 'bottom') return max;
    const m = /^(#[A-Za-z]\w*(?:-[A-Za-z]\w*)*)([+-]\d+)?$/.exec(s);
    const el = document.querySelector(m[1]);
    const y = el.getBoundingClientRect().top + scrollY + (m[2] ? parseInt(m[2], 10) : 0);
    return Math.max(0, Math.min(max, y));
  }, spec);
}

async function retryRoutes(page) {
  // third-party assets go through a flaky egress proxy: retry instead of rendering a broken image
  await page.route((url) => !/^(localhost|127\.0\.0\.1)$/.test(url.hostname), async (route) => {
    for (let i = 0; i < 6; i++) {
      try { const response = await route.fetch({ timeout: 25000 }); return await route.fulfill({ response }); }
      catch (e) { await new Promise((r) => setTimeout(r, 600 * (i + 1))); }
    }
    return route.abort();
  });
}

async function openPage(browser, prof) {
  const ctx = await browser.newContext({
    viewport: prof.viewport, deviceScaleFactor: prof.dpr || 1, isMobile: !!prof.mobile, hasTouch: !!prof.mobile,
    ignoreHTTPSErrors: true, serviceWorkers: 'block', reducedMotion: 'no-preference',
    userAgent: prof.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined,
  });
  const page = await ctx.newPage();
  await retryRoutes(page);
  await page.addInitScript((r) => { window.__wdTimeScale = r; }, RATE);
  await page.goto(prof.url || plan.url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none} *{scrollbar-width:none!important;caret-color:transparent}' });
  // load every image now (lazy ones too) and wait for fonts, retrying failed images
  for (let attempt = 0; attempt < 4; attempt++) {
    await page.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; if (i.complete && !i.naturalWidth) { const s = i.src; i.src = ''; i.src = s; } }));
    try {
      await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0) && document.fonts.status === 'loaded', null, { timeout: 30000 });
      break;
    } catch (e) { if (attempt === 3) throw new Error('images did not load: ' + e.message); }
  }
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: RATE });
  return { ctx, page, cdp };
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium',
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' } : undefined,
  });
  for (const prof of plan.profiles) {
    let session = null;
    for (const shot of prof.shots) {
      const id = `${prof.name}-${shot.name}`;
      if (only && !only.includes(id)) continue;
      if (!session || shot.fresh) { if (session) await session.ctx.close(); session = await openPage(browser, prof); }
      const { page } = session;
      const dir = path.join(plan.out, id);
      fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
      const y0 = await resolveY(page, shot.from ?? 0);
      await page.evaluate((y) => window.scrollTo(0, y), y0);
      if (shot.settleMs) await page.waitForTimeout(shot.settleMs);
      const y1 = await resolveY(page, shot.to ?? shot.from ?? 0);
      const hs = shot.holdStart || 0, he = shot.holdEnd || 0, n = shot.frames;
      const fn = ease[shot.ease || 'inout'];
      const acts = (shot.actions || []).slice();
      const log = { id, fps: FPS, rate: RATE, viewport: prof.viewport, events: [], late: 0, maxGapMs: 0 };
      const rectOf = (sel) => page.evaluate((q) => { const e = document.querySelector(q); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, scrollY: window.scrollY }; }, sel);
      const drive = y0 !== y1;
      let last = Date.now();
      for (let f = 0; f < n; f++) {
        for (const a of acts.filter((x) => x.frame === f)) {
          if (a.selector && a.type !== 'probe') log.events.push({ frame: f, type: a.type, selector: a.selector, rect: await rectOf(a.selector) });
          if (a.type === 'probe') { const rects = {}; for (const q of a.selectors) rects[q] = await rectOf(q); log.events.push({ frame: f, type: 'probe', label: a.label, rects }); }
          else if (a.type === 'click') await page.click(a.selector, { force: true });
          else if (a.type === 'tap') await page.tap(a.selector);
          else if (a.type === 'hover') await page.hover(a.selector, { force: true });
          else if (a.type === 'fill') await page.fill(a.selector, a.value);
          else if (a.type === 'press') await page.keyboard.press(a.value);
          else if (a.type === 'eval') await page.evaluate(a.value);
          else if (a.type === 'mouse') await page.mouse.move(a.x, a.y, { steps: a.steps || 1 });
        }
        if (drive) {
          const t = Math.min(1, Math.max(0, (f - hs) / Math.max(1, n - hs - he - 1)));
          const y = y0 + (y1 - y0) * fn(t);
          // wait two animation frames so the new scroll position is painted before the screenshot
          await page.evaluate((v) => new Promise((r) => { window.scrollTo(0, v); requestAnimationFrame(() => requestAnimationFrame(r)); }), y);
        }
        const wait = FRAME_MS - (Date.now() - last);
        if (wait > 0) await page.waitForTimeout(wait);
        else if (f > 0) log.late++;
        const now = Date.now();
        if (f > 0) log.maxGapMs = Math.max(log.maxGapMs, now - last);
        last = now;
        await page.screenshot({ path: path.join(dir, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
      }
      const outFile = path.join(plan.out, id + '.mp4');
      const scale = prof.outWidth ? ['-vf', `scale=${prof.outWidth}:-2:flags=lanczos`] : [];
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'), ...scale,
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outFile]);
      fs.writeFileSync(path.join(plan.out, id + '.json'), JSON.stringify(log, null, 1));
      console.log('recorded', id, n, 'frames', Math.round(y0), '->', Math.round(y1), 'late frames', log.late, 'max gap', log.maxGapMs, 'ms (target', Math.round(FRAME_MS), ')');
    }
    if (session) await session.ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
