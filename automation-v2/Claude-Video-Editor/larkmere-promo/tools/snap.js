// static element captures of the real Larkmere site (mobile dpr3 + desktop dpr2)
const { chromium } = require('playwright');
const OUT = process.argv[2];
const URL = 'http://127.0.0.1:8080/automation-v1/2026-10-02-larkmere/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' } });
  const open = async (vp, dpr, mobile) => {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, serviceWorkers: 'block', ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
    await page.evaluate(() => document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')));
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0) && document.fonts.status === 'loaded', null, { timeout: 60000 });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none}' });
    // reveal everything so element captures are in their final state
    await page.evaluate(() => { document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('in')); document.querySelectorAll('[data-count]').forEach((e) => (e.textContent = e.dataset.count)); });
    await page.waitForTimeout(1500);
    return { ctx, page };
  };
  const m = await open({ width: 390, height: 844 }, 3, true);
  await m.page.screenshot({ path: `${OUT}/m-hero.png` });
  const els = { 'm-card-posy': '#bouquets article:nth-of-type(1)', 'm-card-love': '#bouquets article:nth-of-type(2)', 'm-card-wild': '#bouquets article:nth-of-type(3)', 'm-wed-card1': '#weddings article:nth-of-type(1)', 'm-wed-card3': '#weddings article:nth-of-type(3)', 'm-ws-card1': '#workshops article:nth-of-type(1)', 'm-ws-card3': '#workshops article:nth-of-type(3)', 'm-spot': '#spot', 'm-order-list': '#order ul', 'm-form': '#orderForm' };
  for (const [k, sel] of Object.entries(els)) { const e = await m.page.$(sel); await e.scrollIntoViewIfNeeded(); await m.page.waitForTimeout(400); await e.screenshot({ path: `${OUT}/${k}.png` }); }
  for (const id of ['bouquets', 'weddings', 'grown', 'workshops', 'order']) { await m.page.evaluate((q) => document.getElementById(q).scrollIntoView(), id); await m.page.waitForTimeout(700); await m.page.screenshot({ path: `${OUT}/m-view-${id}.png` }); }
  const geo = await m.page.evaluate(() => { const r = (q) => { const b = document.querySelector(q).getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height }; };
    return { posy: r('#bouquets article:nth-of-type(1)'), posyImg: r('#bouquets article:nth-of-type(1) img'), grownH2: r('#spotTitle'), spot: r('#spot'), docH: document.documentElement.scrollHeight }; });
  console.log(JSON.stringify(geo));
  await m.ctx.close();
  const d = await open({ width: 1440, height: 900 }, 2, false);
  await d.page.screenshot({ path: `${OUT}/d-hero.png` });
  for (const id of ['bouquets', 'weddings', 'grown', 'workshops', 'order']) { await d.page.evaluate((q) => document.getElementById(q).scrollIntoView(), id); await d.page.waitForTimeout(700); await d.page.screenshot({ path: `${OUT}/d-view-${id}.png` }); }
  await d.ctx.close(); await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
