// LEGO homepage concept (WebDrip) — Playwright tests, Desktop 1440×900 + iPhone 13.
// Adapted from _toolkit/demo.spec.js. Run from /tmp/video (where @playwright/test is installed):
//   TEST_DIR=<repo>/lego-redesign/tests npx playwright test -c <repo>/_toolkit/pw.config.js
const { test, expect, devices } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PATH = '/lego-redesign/';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' } : undefined;
const launchOptions = { executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' };
test.use({ launchOptions, proxy, serviceWorkers: 'block' });

const { defaultBrowserType, ...iPhone } = devices['iPhone 13'];
const profiles = [
  { name: 'desktop', use: { viewport: { width: 1440, height: 900 } }, mobile: false },
  { name: 'iphone13', use: iPhone, mobile: true },
];

const ORDER = {
  all: ['Game Boy™', 'Mario Kart™ – Mario & Standard Kart', 'Bookstore: Book Nook', 'Hanging Golden Pothos', 'Downton Abbey', 'SpongeBob SquarePants: Bikini Bottom', 'Holiday House', 'LEGO® Ideas Home Alone'],
  gaming: ['Game Boy™', 'Mario Kart™ – Mario & Standard Kart'],
  display: ['Bookstore: Book Nook', 'Hanging Golden Pothos', 'Downton Abbey', 'SpongeBob SquarePants: Bikini Bottom'],
  seasonal: ['Holiday House', 'LEGO® Ideas Home Alone'],
};
const PRICES = { 'Game Boy™': '$59.99', 'Mario Kart™ – Mario & Standard Kart': '$169.99', 'Bookstore: Book Nook': '$149.99', 'Hanging Golden Pothos': '$59.99', 'Downton Abbey': '$349.99', 'SpongeBob SquarePants: Bikini Bottom': '$219.99', 'Holiday House': '$119.99', 'LEGO® Ideas Home Alone': '$299.99' };

function collectErrors(page) {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}
async function open(page) {
  await page.goto(BASE + PATH, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
async function revealAll(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 300) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.waitForTimeout(900);
}
// Sections assemble block by block as they scroll in: wait until nothing in #sets is still animating.
async function settleSets(page) {
  await page.waitForTimeout(100);
  await page.waitForFunction(() => [...document.querySelectorAll('#sets *')].every((el) => el.getAnimations().every((a) => a.playState !== 'running')), null, { timeout: 5000 });
}
async function visibleNames(page) {
  return page.locator('#setGrid .wd-card:not([hidden]) .wd-card__name').allTextContents();
}
// Top of a section relative to the sticky bar's bottom edge, once scrolling has settled.
async function offsetFromHeader(page, id) {
  await page.waitForTimeout(120);
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) break;
    last = y;
    await page.waitForTimeout(120);
  }
  return page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top - document.querySelector('.wd-top').getBoundingClientRect().bottom, id);
}

for (const p of profiles) {
  test.describe(p.name, () => {
    test.use(p.use);

    test('loads, scrolls, all images and fonts load, no console errors', async ({ page }) => {
      const errors = collectErrors(page);
      await open(page);
      await expect(page.locator('h1')).toHaveText('What will you build next?');
      await revealAll(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const imgs = await page.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0 })));
      expect(imgs.filter((i) => !i.ok), JSON.stringify(imgs)).toEqual([]);
      const fonts = await page.evaluate(() => ({
        barlow: document.fonts.check('700 40px "Barlow Condensed"'),
        dm: document.fonts.check('400 20px "DM Sans"') && document.fonts.check('700 20px "DM Sans"'),
        loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
      }));
      expect(fonts.barlow && fonts.dm, JSON.stringify(fonts)).toBe(true);
      expect(fonts.loaded.length).toBeGreaterThanOrEqual(2);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('notice, wordmark and footer credit are present', async ({ page }) => {
      await open(page);
      const notice = page.locator('.wd-notice');
      await expect(notice).toHaveText('Unofficial concept redesign. Not affiliated with LEGO.');
      expect(parseFloat(await notice.evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
      await page.evaluate(() => window.scrollTo(0, 2000));
      await expect(notice).toBeInViewport();
      await expect(page.locator('.wd-wordmark__name')).toHaveText('LEGO');
      const credit = page.getByRole('link', { name: 'Concept design by WebDrip' });
      await expect(credit).toHaveAttribute('href', 'https://getwebdrip.com');
      const meet = page.getByRole('link', { name: 'Book a meeting at getwebdrip.com' });
      await expect(meet).toHaveAttribute('target', '_blank');
      await expect(meet).toHaveAttribute('rel', /noopener/);
      expect(await page.locator('form, input, textarea, select').count()).toBe(0);
    });

    test('filters show the right counts and sets, by pointer and keyboard', async ({ page }) => {
      await open(page);
      const count = page.locator('#setCount');
      await expect(count).toHaveText('8 sets in this concept');
      expect(await visibleNames(page)).toEqual(ORDER.all);
      await expect(page.locator('.wd-filter[data-filter="all"]')).toHaveAttribute('aria-pressed', 'true');
      await page.evaluate(() => window.scrollTo(0, document.getElementById('sets').getBoundingClientRect().top + scrollY - document.querySelector('.wd-top').offsetHeight));
      await settleSets(page);
      const groupTop = async () => page.locator('.wd-filters').evaluate((el) => el.getBoundingClientRect().top);
      for (const f of ['gaming', 'display', 'seasonal', 'all']) {
        const before = await groupTop();
        const btn = page.locator(`.wd-filter[data-filter="${f}"]`);
        await btn.click();
        await expect(count).toHaveText(`${ORDER[f].length} sets in this concept`);
        expect(await visibleNames(page)).toEqual(ORDER[f]);
        await expect(btn).toHaveAttribute('aria-pressed', 'true');
        expect(await page.locator('.wd-filter[aria-pressed="true"]').count()).toBe(1);
        expect(Math.abs((await groupTop()) - before)).toBeLessThanOrEqual(1);
        const prices = await page.locator('#setGrid .wd-card:not([hidden]) .wd-card__price').allTextContents();
        expect(prices).toEqual(ORDER[f].map((n) => PRICES[n]));
      }
      // keyboard
      await page.locator('.wd-filter[data-filter="gaming"]').focus();
      await page.keyboard.press('Enter');
      await expect(count).toHaveText('2 sets in this concept');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');
      await expect(count).toHaveText('4 sets in this concept');
      expect(await visibleNames(page)).toEqual(ORDER.display);
      // layout: 4 columns for All on desktop, 2 centred for Gaming; one column on mobile
      await page.locator('.wd-filter[data-filter="gaming"]').click();
      await page.waitForTimeout(400);
      const boxes = await page.locator('#setGrid .wd-card:not([hidden])').evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ x: r.x, w: r.width, y: r.y })));
      const vw = page.viewportSize().width;
      if (!p.mobile) {
        const mid = (boxes[0].x + boxes[1].x + boxes[1].w) / 2;
        expect(Math.abs(mid - vw / 2)).toBeLessThanOrEqual(2);
        expect(boxes[0].y).toBe(boxes[1].y);
      } else {
        expect(boxes[1].y).toBeGreaterThan(boxes[0].y);
      }
    });

    test('quick view opens, traps focus, locks scroll and closes three ways', async ({ page }) => {
      await open(page);
      await page.locator('#sets').scrollIntoViewIfNeeded();
      await page.locator('.wd-filter[data-filter="gaming"]').click();
      const trigger = page.locator('[data-quick="game-boy"]');
      const dialog = page.getByRole('dialog', { name: 'Game Boy™' });
      for (const how of ['escape', 'back', 'close']) {
        await trigger.click();
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('#qvPrice')).toHaveText('$59.99');
        await expect(dialog.locator('#qvInterest')).toHaveText('Gaming');
        await expect(dialog).toContainText('Concept preview only. No purchase is made here.');
        await expect(dialog.locator('#qvImg')).toHaveAttribute('src', 'assets/product-game-boy.webp');
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');
        expect(await page.evaluate(() => document.querySelector('.wd-top').getBoundingClientRect().top)).toBe(0);
        const y0 = await page.evaluate(() => scrollY);
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(150);
        expect(await page.evaluate(() => scrollY)).toBe(y0);
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('Tab');
          expect(await page.evaluate(() => !!document.activeElement.closest('.wd-qv__panel'))).toBe(true);
        }
        await page.waitForTimeout(300);
        const box = await dialog.boundingBox();
        const vp = page.viewportSize();
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(vp.height + 1);
        if (p.mobile) expect(Math.abs(box.y + box.height - vp.height)).toBeLessThanOrEqual(1);
        else expect(Math.abs(box.x + box.width / 2 - vp.width / 2)).toBeLessThanOrEqual(1);
        if (how === 'escape') await page.keyboard.press('Escape');
        if (how === 'back') await dialog.getByRole('button', { name: 'Back to sets' }).click();
        if (how === 'close') await dialog.getByRole('button', { name: 'Close' }).click();
        await expect(page.locator('#quickView')).toBeHidden();
        await expect(trigger).toBeFocused();
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
      }
      await expect(page.locator('#setCount')).toHaveText('2 sets in this concept');
      // a photo product uses the same image in the dialog
      await page.locator('.wd-filter[data-filter="display"]').click();
      await page.locator('[data-quick="golden-pothos"]').click();
      await expect(page.getByRole('dialog', { name: 'Hanging Golden Pothos' })).toBeVisible();
      await expect(page.locator('#qvPrice')).toHaveText('$59.99');
      await expect(page.locator('#qvInterest')).toHaveText('Display');
      await page.keyboard.press('Escape');
    });

    test('in-page navigation scrolls to the right sections and keeps the filter', async ({ page }) => {
      await open(page);
      await page.locator('#sets').scrollIntoViewIfNeeded();
      await page.locator('.wd-filter[data-filter="gaming"]').click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByRole('link', { name: 'Find my next build' }).click();
      expect(Math.abs(await offsetFromHeader(page, 'sets'))).toBeLessThanOrEqual(2);
      await expect(page.locator('#setCount')).toHaveText('2 sets in this concept');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByRole('link', { name: 'Explore gifts' }).click();
      expect(Math.abs(await offsetFromHeader(page, 'gifts'))).toBeLessThanOrEqual(2);
      await page.getByRole('button', { name: 'Explore the selection' }).click();
      expect(Math.abs(await offsetFromHeader(page, 'sets'))).toBeLessThanOrEqual(2);
      await expect(page.locator('#setCount')).toHaveText('8 sets in this concept');
      await page.locator('.wd-filter[data-filter="seasonal"]').click();
      await page.getByRole('button', { name: 'Browse gift ideas' }).scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: 'Browse gift ideas' }).click();
      expect(Math.abs(await offsetFromHeader(page, 'sets'))).toBeLessThanOrEqual(2);
      await expect(page.locator('#setCount')).toHaveText('8 sets in this concept');
      await page.getByRole('link', { name: 'See the inspiration' }).scrollIntoViewIfNeeded();
      await page.getByRole('link', { name: 'See the inspiration' }).click();
      expect(Math.abs(await offsetFromHeader(page, 'inspiration'))).toBeLessThanOrEqual(2);
      if (!p.mobile) {
        for (const [name, id] of [['Sets', 'sets'], ['Gifts', 'gifts'], ['Discover', 'discover'], ['About this concept', 'about-concept']]) {
          await page.locator('.wd-nav').getByRole('link', { name, exact: true }).click();
          const off = await offsetFromHeader(page, id);
          const atBottom = await page.evaluate(() => Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight) < 2);
          expect(Math.abs(off) <= 2 || atBottom, `${id} offset ${off}`).toBe(true);
        }
      }
      await page.locator('.wd-wordmark').click();
      await page.waitForFunction(() => scrollY === 0);
      expect(page.url()).toBe(BASE + PATH);
    });

    test('tap targets are at least 44px and focus is visible', async ({ page }) => {
      await open(page);
      await revealAll(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      const small = await page.evaluate(() => [...document.querySelectorAll('a, button')].filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || el.classList.contains('wd-skip') || el.closest('[hidden]')) return false;
        return r.height < 44 || r.width < 44;
      }).map((el) => el.textContent.trim() + ' ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height)));
      expect(small, small.join('\n')).toEqual([]);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
      expect(outline).toBe('solid');
    });

    test('text meets WCAG AA contrast', async ({ page }) => {
      await open(page);
      await revealAll(page);
      const fails = await page.evaluate(() => {
        const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] === undefined ? 1 : m[3] }; };
        const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c.a > 0.5) return c; } return { r: 255, g: 255, b: 255 }; };
        const out = [];
        document.querySelectorAll('body *').forEach((el) => {
          if (el.closest('[hidden]') || el.closest('.wd-sr') || el.closest('.wd-skip')) return;
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!own) return;
          const cs = getComputedStyle(el);
          const fg = parse(cs.color), bg = bgOf(el);
          const L1 = lum(fg), L2 = lum(bg);
          const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
          const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
          if (ratio < need) out.push(el.textContent.trim().slice(0, 30) + ' ' + ratio.toFixed(2));
        });
        return out;
      });
      expect(fails, fails.join('\n')).toEqual([]);
    });

    test('every animated element is visible after scrolling', async ({ page }) => {
      await open(page);
      await revealAll(page);
      await page.waitForTimeout(800);
      const hidden = await page.evaluate(() => [...document.querySelectorAll('.wd-reveal, .wd-card, h2, h3, img')].filter((el) => {
        if (el.closest('[hidden]')) return false;
        let o = 1; for (let n = el; n && n !== document.body; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
        return o < 0.999;
      }).map((el) => el.tagName + '.' + el.className));
      expect(hidden, hidden.join('\n')).toEqual([]);
    });

    if (p.mobile) {
      test('menu sheet opens, closes and its links navigate', async ({ page }) => {
        await open(page);
        const btn = page.getByRole('button', { name: 'Menu' });
        const sheet = page.locator('#menuSheet');
        await expect(btn).toHaveAttribute('aria-expanded', 'false');
        await btn.tap();
        await expect(sheet).toBeVisible();
        await expect(btn).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('.wd-notice')).toBeInViewport({ ratio: 1 });
        await page.waitForTimeout(500);
        const sheetTop = await sheet.locator('.wd-sheet__panel').evaluate((el) => el.getBoundingClientRect().top);
        const barBottom = await page.locator('.wd-top').evaluate((el) => el.getBoundingClientRect().bottom);
        expect(Math.abs(sheetTop - barBottom)).toBeLessThanOrEqual(1);
        expect(await sheet.locator('.wd-sheet__link').allTextContents()).toEqual(['Sets', 'Gifts', 'Discover', 'About this concept']);
        await page.keyboard.press('Escape');
        await expect(sheet).toBeHidden();
        await expect(btn).toBeFocused();
        await btn.tap();
        await sheet.getByRole('button', { name: 'Close' }).tap();
        await expect(sheet).toBeHidden();
        await expect(btn).toBeFocused();
        await btn.tap();
        await sheet.getByRole('link', { name: 'Sets' }).tap();
        await expect(sheet).toBeHidden();
        expect(Math.abs(await offsetFromHeader(page, 'sets'))).toBeLessThanOrEqual(2);
        await expect(page.locator('#setCount')).toHaveText('8 sets in this concept');
        expect(page.url()).toBe(BASE + PATH);
        // the recorded path: Gaming, then Game Boy quick view as a bottom sheet
        await settleSets(page);
        await page.locator('.wd-filter[data-filter="gaming"]').tap();
        await expect(page.locator('#setCount')).toHaveText('2 sets in this concept');
        await settleSets(page);
        const qbtn = page.locator('[data-quick="game-boy"]');
        await expect(qbtn).toBeInViewport({ ratio: 1 });
        await qbtn.tap();
        await expect(page.getByRole('dialog', { name: 'Game Boy™' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Back to sets' })).toBeInViewport({ ratio: 1 });
      });

      test('no horizontal overflow at mobile width', async ({ page }) => {
        await open(page);
        const deviceWidth = page.viewportSize().width;
        for (const y of [0, 800, 2000, 4000, 99999]) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(150);
          const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
          expect(o.sw, `scrollWidth ${o.sw} at y=${y}`).toBeLessThanOrEqual(o.cw);
          expect(o.cw).toBeLessThanOrEqual(deviceWidth);
        }
      });
    }

    test.describe('reduced motion', () => {
      test.use({ reducedMotion: 'reduce' });
      test('content is visible at once and filters swap instantly', async ({ page }) => {
        await open(page);
        const o = await page.locator('#inspoTitle').evaluate((el) => getComputedStyle(el).opacity);
        expect(o).toBe('1');
        await page.locator('#sets').scrollIntoViewIfNeeded();
        await page.locator('.wd-filter[data-filter="seasonal"]').click();
        expect(await visibleNames(page)).toEqual(ORDER.seasonal);
        expect(await page.locator('#setGrid .wd-card').evaluateAll((els) => els.flatMap((e) => e.getAnimations()).length)).toBe(0);
      });
    });

    test.describe('without JavaScript', () => {
      test.use({ javaScriptEnabled: false });
      test('all content stays visible', async ({ page }) => {
        await page.goto(BASE + PATH, { waitUntil: 'load' });
        const hidden = await page.evaluate(() => [...document.querySelectorAll('.wd-reveal')].filter((el) => getComputedStyle(el).opacity !== '1').length);
        expect(hidden).toBe(0);
        expect(await page.locator('#setGrid .wd-card:visible').count()).toBe(8);
      });
    });

    test('screenshots', async ({ page }) => {
      await open(page);
      const dir = process.env.SHOT_DIR || '/tmp/shots';
      await page.screenshot({ path: `${dir}/${p.name}-hero.png` });
      await revealAll(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${dir}/${p.name}-full.png`, fullPage: true });
    });
  });
}
