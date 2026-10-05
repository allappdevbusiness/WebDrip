// Captures real desktop and mobile states of the Marlowick site as PNG stills plus element rects (CSS px).
// Usage: node scripts/stills.js   (site served at http://127.0.0.1:8080/automation-v2/websites/marlowick/)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const URL = process.env.SITE || 'http://127.0.0.1:8080/automation-v2/websites/marlowick/';
const OUT = path.join(__dirname, '..', 'public', 'cap');
const CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, 'img-cache.json'), 'utf8'));
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;

const PROFILES = {
  desk: { viewport: { width: 1440, height: 900 }, dpr: 2, mobile: false },
  mob: { viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
};

async function open(browser, prof) {
  const ctx = await browser.newContext({
    viewport: prof.viewport, deviceScaleFactor: prof.dpr, isMobile: prof.mobile, hasTouch: prof.mobile, serviceWorkers: 'block',
    userAgent: prof.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined,
  });
  const page = await ctx.newPage();
  await page.route((u) => u.hostname === 'images.unsplash.com', (route) => {
    const key = Object.keys(CACHE.urls).find((k) => CACHE.urls[k] === route.request().url());
    return key ? route.fulfill({ path: path.join(__dirname, '..', CACHE.dir, key + '.jpg'), contentType: 'image/jpeg' }) : route.abort();
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none} *{scrollbar-width:none!important;caret-color:transparent}' });
  await page.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0) && document.fonts.status === 'loaded', null, { timeout: 60000 });
  await page.waitForTimeout(2500); // hero intro animations
  return { ctx, page };
}
const rects = (page, sels) => page.evaluate((q) => Object.fromEntries(q.map((s) => {
  const e = document.querySelector(s); if (!e) return [s, null];
  const b = e.getBoundingClientRect(); return [s, { x: b.x, y: b.y, w: b.width, h: b.height }];
})), sels);
// scroll so a selector's top sits at `offset` px, then wait for reveal / count-up animations to finish
async function scrollTo(page, sel, offset = 0, wait = 2600) {
  await page.evaluate(([s, o]) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - o); }, [sel, offset]);
  await page.waitForTimeout(wait);
}
async function shot(page, name, sels, extra = {}) {
  if (only && !only.includes(name)) return;
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  const meta = { name, viewport: page.viewportSize(), scrollY: await page.evaluate(() => scrollY), rects: await rects(page, sels), ...extra };
  fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(meta, null, 1));
  console.log('shot', name);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  // ---------- desktop ----------
  let { ctx, page } = await open(browser, PROFILES.desk);
  const heroSel = ['#heroTitle', '.wd-hero-copy a[href="#visit"]', '.wd-hero-copy a[href="#suits"]', '#nav', '.wd-logo', '.wd-hero-frame', '.wd-tag-a', '.wd-tag-b', '.wd-tag-c'];
  await shot(page, 'desk-hero', heroSel);
  // the hero's own scroll-driven camera: photo frame pushed in part-way and fully
  for (const p of [0.35, 1]) {
    await page.evaluate((f) => { const s = document.querySelector('#top'); window.scrollTo(0, (s.offsetHeight - innerHeight) * f); }, p);
    await page.waitForTimeout(2600);
    await shot(page, `desk-hero-p${Math.round(p * 100)}`, heroSel);
  }
  const cardSel = [...Array(6)].flatMap((_, i) => [`#suits li.wd-suit:nth-child(${i + 1})`, `#suits li.wd-suit:nth-child(${i + 1}) img`, `#suits li.wd-suit:nth-child(${i + 1}) h3`]);
  await scrollTo(page, '#suits', -10);
  await shot(page, 'desk-suits-head', ['#suitsTitle', ...cardSel]);
  await scrollTo(page, '#suits ul', 110);
  await shot(page, 'desk-suits-row1', cardSel);
  await scrollTo(page, '#suits li.wd-suit:nth-child(4)', 110);
  await shot(page, 'desk-suits-row2', cardSel);
  const planSel = [1, 2, 3].flatMap((i) => [`#hire li.wd-plan:nth-child(${i})`, `#hire li.wd-plan:nth-child(${i}) h3`, `#hire li.wd-plan:nth-child(${i}) .wd-plan-price`]);
  await scrollTo(page, '#hire', -10);
  await shot(page, 'desk-hire-head', ['#hireTitle', '.wd-hire-photo', ...planSel]);
  await scrollTo(page, '#hire ul', 120, 3200);
  await shot(page, 'desk-hire-plans', planSel);
  await scrollTo(page, '#fittings', -10);
  await shot(page, 'desk-fittings', ['#fittings h2']);
  await scrollTo(page, '#visit', -10);
  await shot(page, 'desk-visit-head', ['#visitTitle', '#bookForm']);
  await scrollTo(page, '#bookForm', 140);
  await shot(page, 'desk-form', ['#bookForm', '#occasion', '#name', '#email', '#bookForm button[type=submit]']);
  await ctx.close();

  // ---------- mobile ----------
  ({ ctx, page } = await open(browser, PROFILES.mob));
  await shot(page, 'mob-hero', heroSel.concat(['#burger']));
  await page.tap('#burger'); await page.waitForTimeout(1200);
  await shot(page, 'mob-menu', ['#burger', '#mobileMenu', '#mobileMenu a[href="#suits"]', '#mobileMenu a[href="#visit"].wd-btn'], { ariaExpanded: await page.getAttribute('#burger', 'aria-expanded') });
  await page.tap('#burger'); await page.waitForTimeout(1200);
  await page.evaluate(() => { const s = document.querySelector('#top'); window.scrollTo(0, (s.offsetHeight - innerHeight) * 0.35); }); await page.waitForTimeout(2600);
  await shot(page, 'mob-hero-p35', heroSel);
  await scrollTo(page, '#suits', -10);
  await shot(page, 'mob-suits-head', ['#suitsTitle', ...cardSel]);
  await scrollTo(page, '#suits li.wd-suit:nth-child(1)', 80);
  await shot(page, 'mob-suit1', cardSel);
  await scrollTo(page, '#suits li.wd-suit:nth-child(4)', 80);
  await shot(page, 'mob-suit4', cardSel);
  await scrollTo(page, '#hire li.wd-plan:nth-child(2)', 80, 3200);
  await shot(page, 'mob-plan2', planSel);
  await scrollTo(page, '#bookForm', 80);
  await shot(page, 'mob-form', ['#bookForm', '#occasion', '#name', '#email']);
  await page.selectOption('#occasion', 'Black tie'); await page.waitForTimeout(400);
  await shot(page, 'mob-form-blacktie', ['#bookForm', '#occasion'], { occasion: await page.inputValue('#occasion') });
  await ctx.close();
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
