// Captures individual, real UI elements of the Marlowick site as transparent PNG layers (desktop 1440 px
// layout at DPR 3). Everything except the target is set to visibility:hidden, so the element is rendered by
// the site's own CSS and fonts, then clipped with a transparent margin that keeps its shadow.
// Usage: node scripts/layers.js   -> public/layers/<name>.png + layers.json (css size, padding)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:8080/automation-v2/websites/marlowick/';
const OUT = path.join(__dirname, '..', 'public', 'layers');
const CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, 'img-cache.json'), 'utf8'));
const DPR = 3;
const L = [
  // [name, selector, scroll-to selector (or 'top'), padding css px]
  ['nav', '#nav', 'top', 0],
  ['logo', '#nav .wd-logo', 'top', 6],
  ['navCta', '#nav .wd-nav-cta', 'top', 24],
  ['kicker', '.wd-hero-copy .wd-kicker', 'top', 6],
  ['heroTitle', '#heroTitle', 'top', 10],
  ['heroLine1', '#heroTitle .wd-line:first-child', 'top', 10],
  ['heroLine2', '#heroTitle .wd-accent', 'top', 10],
  ['lead', '.wd-hero-copy .wd-lead', 'top', 6],
  ['btnBook', '.wd-hero-copy a[href="#visit"]', 'top', 28],
  ['btnSuits', '.wd-hero-copy a[href="#suits"]', 'top', 28],
  ['tagA', '.wd-tag-a', 'top', 28],
  ['tagB', '.wd-tag-b', 'top', 28],
  ['tagC', '.wd-tag-c', 'top', 28],
  ['suitsTitle', '#suitsTitle', '#suits', 8],
  ...[1, 2, 3, 4, 5, 6].map((i) => [`suit${i}`, `#suits li.wd-suit:nth-child(${i})`, `#suits li.wd-suit:nth-child(${i})`, 40]),
  ['hireTitle', '#hireTitle', '#hire', 8],
  ...[1, 2, 3].map((i) => [`plan${i}`, `#hire li.wd-plan:nth-child(${i})`, `#hire ul`, 40]),
  ...[1, 2, 3].map((i) => [`stat${i}`, `.wd-stats .wd-stat:nth-child(${i})`, `.wd-stats`, 40]),
  ['visitTitle', '#visitTitle', '#visit', 8],
  ['form', '#bookForm', '#bookForm', 40],
  ['footerLogo', '.wd-footer .wd-logo', '.wd-footer', 6],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: DPR, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.route((u) => u.hostname === 'images.unsplash.com', (route) => {
    const key = Object.keys(CACHE.urls).find((k) => CACHE.urls[k] === route.request().url());
    return key ? route.fulfill({ path: path.join(__dirname, '..', CACHE.dir, key + '.jpg'), contentType: 'image/jpeg' }) : route.abort();
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none}' });
  await page.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0) && document.fonts.status === 'loaded');
  await page.waitForTimeout(2500);
  const meta = {};
  for (const [name, sel, scrollSel, pad] of L) {
    if (scrollSel === 'top') await page.evaluate(() => window.scrollTo(0, 0));
    else await page.evaluate((s) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 150); }, scrollSel);
    await page.waitForTimeout(scrollSel === 'top' ? 900 : 3200); // reveals and count-ups finish
    await page.evaluate((s) => {
      document.querySelector(s).classList.add('wd-iso');
      const st = document.createElement('style'); st.id = 'iso';
      st.textContent = 'html,body{background:transparent!important} body *{visibility:hidden!important} .wd-iso,.wd-iso *{visibility:visible!important}';
      document.head.appendChild(st);
    }, sel);
    const r = await page.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, sel);
    await page.screenshot({ path: path.join(OUT, name + '.png'), omitBackground: true,
      clip: { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.w + pad * 2, height: r.h + pad * 2 } });
    meta[name] = { selector: sel, cssW: +(r.w + pad * 2).toFixed(2), cssH: +(r.h + pad * 2).toFixed(2), pad, elW: +r.w.toFixed(2), elH: +r.h.toFixed(2), pageX: +r.x.toFixed(2) };
    await page.evaluate((s) => { document.querySelector(s).classList.remove('wd-iso'); document.getElementById('iso').remove(); }, sel);
    process.stdout.write(name + ' ');
  }
  fs.writeFileSync(path.join(OUT, 'layers.json'), JSON.stringify(meta, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
