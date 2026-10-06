// Pendlecrest Watch Works concept site: Playwright checks for all three pages (Desktop 1280x720 + iPhone 13).
// Adapted from _toolkit/demo.spec.js. Run from the repo root with the site served on :8080:
//   npx http-server -p 8080 -s &  TEST_DIR=automation-v2/websites/pendlecrest/tests npx playwright test -c _toolkit/pw.config.js
const { test, expect, devices } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PATH = '/automation-v2/websites/pendlecrest/';
const PAGES = [
  { file: 'index.html', key: 'home', h1: 'Every second, carefully restored.', minSections: 10 },
  { file: 'services.html', key: 'services', h1: 'Prices you can read before you hand it over.', minSections: 8 },
  { file: 'book.html', key: 'book', h1: 'Hand it over at the counter, or post it in.', minSections: 8 },
];
const MIN_WORDS = 1200;

const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' } : undefined;
test.use({ launchOptions: { executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' }, proxy, ignoreHTTPSErrors: true, serviceWorkers: 'block' });

const { defaultBrowserType, ...iPhone } = devices['iPhone 13'];
const profiles = [
  { name: 'desktop', use: { viewport: { width: 1280, height: 720 } }, mobile: false },
  { name: 'iphone13', use: iPhone, mobile: true },
];

const url = (file) => BASE + PATH + file;

// Unsplash images come through the sandbox egress proxy, whose tunnels occasionally drop.
// Fetch them with a few retries so a transport hiccup isn't reported as a page error.
test.beforeEach(async ({ page }) => {
  await page.route((u) => !/^(localhost|127\.0\.0\.1)$/.test(u.hostname), async (route) => {
    for (let i = 0; i < 4; i++) {
      try {
        const response = await route.fetch({ timeout: 20000 });
        return await route.fulfill({ response });
      } catch (e) {
        if (page.isClosed()) return;
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
      }
    }
    return route.continue();
  });
});
test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

function collectErrors(page) {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

async function scrollAll(page, step = 450, wait = 60) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += step) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(wait); }
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(400);
}

const decode = (s) => s
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');

// ---------------------------------------------------------------- page-level checks
for (const pg of PAGES) {
  test.describe(`${pg.key}: built HTML and content`, () => {
    test('raw HTML already contains the headline and every section’s text (prerendered)', async ({ request, page }) => {
      const raw = await (await request.get(url(pg.file))).text();
      expect(raw).not.toContain('<div id="root"></div>');
      const text = decode(raw);
      // the headline is split into letters, so check its aria-label
      expect(raw).toContain(`aria-label="${pg.h1}"`);
      await page.goto(url(pg.file), { waitUntil: 'load' });
      const expected = await page.evaluate(() => {
        const norm = (s) => s.replace(/\s+/g, ' ').trim();
        return [...document.querySelectorAll('main > section')].map((s) => ({
          id: s.id,
          texts: [...s.querySelectorAll('h1, h2, h3, p, li')]
            .filter((el) => !el.closest('[data-widget]') && !el.querySelector('h1, h2, h3, p, li') && !el.closest('[aria-hidden="true"]'))
            .map((el) => norm(el.textContent))
            .filter((t) => t.length > 3),
        }));
      });
      for (const s of expected) {
        expect(s.texts.length, `section #${s.id} has no static text`).toBeGreaterThan(0);
        for (const t of s.texts) expect(text, `#${s.id} missing in raw HTML: ${t.slice(0, 80)}`).toContain(t);
      }
    });

    test('content minimums: sections, words, widgets, FAQ', async ({ page }) => {
      await page.goto(url(pg.file), { waitUntil: 'load' });
      const m = await page.evaluate(() => ({
        sections: document.querySelectorAll('main > section').length,
        words: document.querySelector('main').innerText.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length,
        widgets: [...new Set([...document.querySelectorAll('[data-widget]')].map((e) => e.dataset.widget))],
        faq: document.querySelectorAll('[data-faq]').length,
      }));
      console.log(`${pg.key}: ${m.sections} sections, ${m.words} words, ${m.widgets.length} widgets: ${m.widgets.join(', ')}`);
      expect(m.sections).toBeGreaterThanOrEqual(pg.minSections);
      expect(m.words).toBeGreaterThan(MIN_WORDS);
      expect(m.widgets.length).toBeGreaterThanOrEqual(4);
      if (pg.key === 'services') expect(m.faq).toBeGreaterThanOrEqual(10);
    });

    test('animation minimums: every section animated, 10+ techniques on the page', async ({ page }) => {
      await page.goto(url(pg.file), { waitUntil: 'load' });
      const m = await page.evaluate(() => ({
        missing: [...document.querySelectorAll('main > section')].filter((s) => !s.matches('[data-anim]') && !s.querySelector('[data-anim]')).map((s) => s.id),
        kinds: [...new Set([...document.querySelectorAll('[data-anim]')].map((e) => e.dataset.anim))],
      }));
      console.log(`${pg.key}: ${m.kinds.length} techniques: ${m.kinds.join(', ')}`);
      expect(m.missing, 'sections without data-anim').toEqual([]);
      expect(m.kinds.length).toBeGreaterThanOrEqual(10);
    });

    test('no broken links or anchors', async ({ page, request }) => {
      await page.goto(url(pg.file), { waitUntil: 'load' });
      const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))]);
      const cache = {};
      for (const href of links) {
        if (/^(mailto:|tel:|https?:)/.test(href)) continue;
        const [file, hash] = href.split('#');
        const target = file ? file.replace('./', '') : pg.file;
        if (!cache[target]) {
          const res = await request.get(url(target));
          expect(res.status(), `${href} returns ${res.status()}`).toBe(200);
          cache[target] = await res.text();
        }
        if (hash) expect(cache[target], `${href}: no element with id ${hash}`).toContain(`id="${hash}"`);
      }
    });

    test('meta: unique title, description and Open Graph image', async ({ request }) => {
      const raw = await (await request.get(url(pg.file))).text();
      expect(raw).toMatch(/<title>[^<]{10,}<\/title>/);
      expect(raw).toMatch(/<meta name="description" content="[^"]{40,}"/);
      expect(raw).toMatch(/<meta property="og:image" content="https:\/\/images\.unsplash\.com\/[^"]+"/);
      expect(raw).toMatch(/<meta name="twitter:card"/);
    });
  });
}

test('titles differ across pages, and sw.js precaches pages, bundles and photos', async ({ request }) => {
  const titles = new Set();
  for (const pg of PAGES) titles.add((await (await request.get(url(pg.file))).text()).match(/<title>([^<]+)<\/title>/)[1]);
  expect(titles.size).toBe(3);
  const sw = await (await request.get(url('sw.js'))).text();
  expect(sw).toContain("pendlecrest-v1");
  for (const pg of PAGES) expect(sw).toContain(`./${pg.file}`);
  expect(sw).toMatch(/\.\/assets\/[\w-]+\.js/);
  expect(sw).toMatch(/\.\/assets\/[\w-]+\.css/);
  expect(sw).toContain('https://images.unsplash.com/');
});

test('site-wide minimums: 12+ widget types and 20+ animation techniques', async ({ page }) => {
  const widgets = new Set();
  const kinds = new Set();
  for (const pg of PAGES) {
    await page.goto(url(pg.file), { waitUntil: 'load' });
    (await page.evaluate(() => [...document.querySelectorAll('[data-widget]')].map((e) => e.dataset.widget))).forEach((w) => widgets.add(w));
    (await page.evaluate(() => [...document.querySelectorAll('[data-anim]')].map((e) => e.dataset.anim))).forEach((k) => kinds.add(k));
  }
  console.log(`site: ${widgets.size} widget types, ${kinds.size} animation techniques`);
  expect(widgets.size).toBeGreaterThanOrEqual(12);
  expect(kinds.size).toBeGreaterThanOrEqual(20);
});

// ---------------------------------------------------------------- per-device checks
for (const p of profiles) {
  test.describe(p.name, () => {
    test.use(p.use);

    for (const pg of PAGES) {
      test(`${pg.key}: no console errors on load or scrolling down and back up`, async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto(url(pg.file), { waitUntil: 'load' });
        await expect(page.locator('h1')).toHaveAttribute('aria-label', pg.h1);
        await page.waitForTimeout(500);
        await scrollAll(page);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = h; y >= 0; y -= 700) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(40); }
        await page.waitForTimeout(400);
        expect(errors, errors.join('\n')).toEqual([]);
      });

      test(`${pg.key}: every animated element is fully visible after scrolling to the bottom`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        await page.waitForTimeout(1900); // intro loader and header animations finish
        await scrollAll(page, 300, 70);
        await page.waitForTimeout(1800);
        const hidden = await page.evaluate(() => {
          const sel = '[data-anim], [data-reveal], [data-reveal] h2, [data-reveal] h3, [data-reveal] img, h2, h3';
          return [...document.querySelectorAll(sel)].filter((el) => {
            if (el.closest('#top')) return false;
            if (!el.getClientRects().length) return false; // not rendered at this breakpoint
            const cs = getComputedStyle(el);
            if (cs.visibility === 'hidden') return false; // inactive pinned-story panel, closed menu
            let o = 1;
            for (let n = el; n && n !== document.body; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
            const unrevealed = el.matches('[data-reveal]') && !el.classList.contains('in');
            return o < 0.999 || unrevealed;
          }).map((el) => `${el.tagName}[${el.dataset.anim || ''}] ${(el.textContent || '').trim().slice(0, 40)}`);
        });
        expect(hidden, hidden.join('\n')).toEqual([]);
      });

      test(`${pg.key}: images load and nothing is broken`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')));
        await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 45000 });
        const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
        expect(broken, broken.join('\n')).toEqual([]);
      });

      test(`${pg.key}: nav highlights the current page and links to all three`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        const scope = p.mobile ? '#mobileMenu' : '#nav nav';
        if (p.mobile) await page.click('#burger');
        for (const other of PAGES) {
          await expect(page.locator(`${scope} a[href="./${other.file}"]`)).toHaveCount(1);
        }
        await expect(page.locator(`${scope} a[aria-current="page"]`)).toHaveAttribute('href', `./${pg.file}`);
      });

      test(`${pg.key}: buttons and links are at least 44px tall where they are controls`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        const small = await page.evaluate(() => [...document.querySelectorAll('.wd-btn, .wd-chip, #burger')]
          .filter((el) => el.getClientRects().length && el.offsetHeight < 44)
          .map((el) => `${el.textContent.trim().slice(0, 30)} ${el.offsetHeight}`));
        expect(small, small.join('\n')).toEqual([]);
      });

      if (p.mobile) {
        test(`${pg.key}: no horizontal overflow at mobile width`, async ({ page }) => {
          await page.goto(url(pg.file), { waitUntil: 'load' });
          const deviceWidth = page.viewportSize().width;
          const h = await page.evaluate(() => document.documentElement.scrollHeight);
          for (let y = 0; y <= h + 800; y += 800) {
            await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);
            await page.waitForTimeout(80);
            const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
            expect(o.sw, `scrollWidth ${o.sw} > clientWidth ${o.cw} at y=${y}`).toBeLessThanOrEqual(o.cw);
            expect(o.cw).toBeLessThanOrEqual(deviceWidth);
          }
        });

        test(`${pg.key}: hamburger opens, closes on Esc and its links navigate`, async ({ page }) => {
          await page.goto(url(pg.file), { waitUntil: 'load' });
          await page.waitForTimeout(1800);
          const btn = page.locator('#burger');
          const menu = page.locator('#mobileMenu');
          await expect(btn).toHaveAttribute('aria-expanded', 'false');
          await expect(menu).toBeHidden();
          await btn.click();
          await expect(btn).toHaveAttribute('aria-expanded', 'true');
          await expect(menu).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(btn).toHaveAttribute('aria-expanded', 'false');
          await expect(menu).toBeHidden();
          await btn.click();
          const next = PAGES[(PAGES.indexOf(pg) + 1) % PAGES.length];
          await menu.locator(`a[href="./${next.file}"]`).click();
          await expect(page).toHaveURL(new RegExp(next.file.replace('.', '\\.') + '$'));
          await expect(page.locator('h1')).toHaveAttribute('aria-label', next.h1);
        });
      }
    }

    test('desktop nav links move between all three pages', async ({ page }) => {
      test.skip(p.mobile, 'desktop nav only');
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(1800);
      for (const target of [PAGES[1], PAGES[2], PAGES[0]]) {
        await page.locator(`#nav nav a[href="./${target.file}"]`).click();
        await expect(page).toHaveURL(new RegExp(target.file.replace('.', '\\.') + '$'));
        await expect(page.locator('h1')).toHaveAttribute('aria-label', target.h1);
        await expect(page.locator('#nav nav a[aria-current="page"]')).toHaveAttribute('href', `./${target.file}`);
        await page.waitForTimeout(target.key === 'home' ? 1800 : 300);
      }
    });

    test('page transition runs between pages, with no unstyled flash', async ({ page, request }) => {
      for (const pg of PAGES) {
        const raw = await (await request.get(url(pg.file))).text();
        const head = raw.slice(0, raw.indexOf('<body'));
        expect(head, `${pg.file}: stylesheet must be render-blocking in <head>`).toMatch(/<link rel="stylesheet"[^>]+\.css">/);
      }
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(1800);
      const css = await page.evaluate(() => [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.cssText.includes('view-transition')); } catch { return false; } }));
      expect(css, '@view-transition rule present').toBe(true);
      const supported = await page.evaluate(() => 'CSSViewTransitionRule' in window);
      if (p.mobile) {
        await page.click('#burger');
        await page.locator('#mobileMenu a[href="./services.html"]').click();
      } else {
        await page.locator('#nav nav a[href="./services.html"]').click();
      }
      await page.waitForURL(/services\.html$/);
      const styled = await page.evaluate(() => getComputedStyle(document.getElementById('nav')).position);
      expect(styled).toBe('sticky');
      if (supported) {
        await page.waitForFunction(() => window.__wdVT !== null, null, { timeout: 5000 });
        const shown = await page.evaluate(() => window.__wdVT === true || document.documentElement.classList.contains('wd-enter'));
        expect(shown).toBe(true);
      }
    });

    // ------------------------------------------------ home widgets
    test('home: hero transform changes on scroll and reverses', async ({ page }) => {
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(800);
      const tf = () => page.locator('#heroImg').evaluate((el) => getComputedStyle(el).transform);
      const before = await tf();
      await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.6, behavior: 'instant' }));
      await page.waitForTimeout(1200);
      const after = await tf();
      expect(after).not.toEqual(before);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1600);
      expect(await tf()).not.toEqual(after);
    });

    test('home: symptom checker, service filter, before/after, carousel, open-now, spotlight', async ({ page }) => {
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(1800);
      // symptom checker
      await expect(page.locator('#symEmpty')).toBeVisible();
      await page.click('[data-sym="gaining"]');
      await page.click('[data-sym="mist"]');
      await expect(page.locator('#symResult li')).toHaveCount(2);
      await expect(page.locator('#symResult li').first()).toContainText('Urgent dry-out');
      await page.click('[data-sym="mist"]');
      await expect(page.locator('#symResult li')).toHaveCount(1);
      // service filter + search
      const count = page.locator('#svcCount');
      await expect(count).toHaveText('10 services shown');
      await page.locator('[data-widget="service-filter"] button', { hasText: 'Quartz' }).click();
      await expect(count).toHaveText('2 services shown');
      await page.locator('[data-widget="service-filter"]').getByRole('button', { name: 'All', exact: true }).click();
      await page.fill('#svcSearch', 'pocket');
      await expect(count).toHaveText('1 service shown');
      await page.fill('#svcSearch', 'zzzz');
      await expect(page.locator('#svcEmpty')).toBeVisible();
      await page.locator('#svcEmpty button').click();
      await expect(count).toHaveText('10 services shown');
      // before / after
      await page.locator('#baRange').fill('20');
      await expect(page.locator('#baOut')).toHaveText('20% before view');
      // carousel
      await page.click('#reviewNext');
      await expect(page.locator('#reviewPos')).toHaveText('2 / 5');
      await expect.poll(() => page.locator('#reviewTrack').evaluate((el) => el.style.transform)).toBe('translateX(-100%)');
      await page.click('#reviewPrev');
      await page.click('#reviewPrev');
      await expect(page.locator('#reviewPos')).toHaveText('5 / 5');
      // open now
      await expect(page.locator('#openStatus')).toHaveText(/Open now|Closed now/);
      // spotlight pause / play
      await page.click('#spotToggle');
      await expect(page.locator('#spotToggle')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#spotImg')).toHaveClass(/wd-paused/);
      await page.click('#spotToggle');
      await expect(page.locator('#spotImg')).not.toHaveClass(/wd-paused/);
    });

    test('home: pinned process story changes step as you scroll (desktop)', async ({ page }) => {
      test.skip(p.mobile, 'pinned only on desktop');
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(1800);
      const top = await page.locator('#process').evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
      const h = await page.locator('#process').evaluate((el) => el.offsetHeight);
      await page.evaluate((y) => window.scrollTo({ top: y + 10, behavior: 'instant' }), top);
      await page.waitForTimeout(400);
      await expect(page.locator('#process ol > li').first()).toHaveAttribute('data-active', 'true');
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top + (h - 720) * 0.75);
      await page.waitForTimeout(400);
      await expect(page.locator('#process ol > li').nth(4)).toHaveAttribute('data-active', 'true');
      await expect(page.locator('#process ol > li').first()).toHaveAttribute('data-active', 'false');
    });

    // ------------------------------------------------ services widgets
    test('services: price tabs, tier toggle, calculator, turnaround, water guide, glossary, FAQ', async ({ page }) => {
      await page.goto(url('services.html'), { waitUntil: 'load' });
      await page.waitForTimeout(600);
      // price tabs
      await page.click('#pt-repairs');
      await expect(page.locator('#ptPanel')).toContainText('Mainspring replacement');
      await page.locator('#pt-repairs').press('ArrowRight');
      await expect(page.locator('#pt-restoration')).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('#ptPanel')).toContainText('Part made on the lathe');
      // tier toggle
      const auto = page.locator('[data-tier-price="Automatic"]');
      await expect(auto).toHaveText('£265');
      await page.click('#tier-heritage');
      await expect(auto).toHaveText('£345');
      await expect(page.locator('[data-widget="tier-toggle"] li[data-has="true"]')).toHaveCount(9);
      await page.click('#tier-standard');
      await expect(auto).toHaveText('£265');
      // calculator: automatic 265
      const total = page.locator('#calcTotal');
      await expect(total).toHaveText('£265');
      await page.locator('[data-widget="estimate-calculator"] label', { hasText: 'Chronograph' }).click();
      await expect(total).toHaveText('£365');
      await page.locator('[data-widget="estimate-calculator"] label', { hasText: 'New sapphire' }).click();
      await expect(total).toHaveText('£525');
      await page.locator('[data-widget="estimate-calculator"] label', { hasText: 'Express' }).click();
      await expect(total).toHaveText('£585');
      await page.locator('[data-widget="estimate-calculator"] label', { hasText: 'Quartz' }).click();
      await expect(total).toHaveText('£355');
      // turnaround
      await expect(page.locator('#taResult')).toHaveText('18–26 days');
      await expect(page.locator('#taDates')).toHaveText(/^Between /);
      await page.selectOption('#taParts', 'order');
      await expect(page.locator('#taResult')).toHaveText('28–36 days');
      await page.selectOption('#taJob', 'quick');
      await expect(page.locator('#taResult')).toHaveText('Done while you wait');
      // water guide
      await page.locator('[data-widget="water-guide"] button', { hasText: 'Scuba diving' }).click();
      await expect(page.locator('#waterNeed')).toContainText('ISO 6425');
      // glossary accordion
      const b1 = page.locator('#gl-b1');
      await b1.click();
      await expect(b1).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#gl-p1')).toHaveAttribute('data-open', 'true');
      await expect(page.locator('#gl-p1')).toBeVisible();
      await expect(page.locator('#gl-b0')).toHaveAttribute('aria-expanded', 'false');
      // FAQ search + accordion
      await expect(page.locator('[data-faq]')).toHaveCount(14);
      await page.fill('#faqSearch', 'polish');
      await expect(page.locator('#faqCount')).toHaveText(/^[1-9] of 14 questions$/);
      const first = page.locator('[data-faq] button').first();
      await first.click();
      await expect(first).toHaveAttribute('aria-expanded', 'true');
      await page.fill('#faqSearch', 'qqqqq');
      await expect(page.locator('#faqEmpty')).toBeVisible();
      await page.fill('#faqSearch', '');
      await expect(page.locator('[data-faq]')).toHaveCount(14);
    });

    test('services: horizontal walk-through moves sideways on scroll (desktop)', async ({ page }) => {
      test.skip(p.mobile, 'scroll-driven only on desktop; mobile swipes natively');
      await page.goto(url('services.html'), { waitUntil: 'load' });
      const top = await page.locator('#inside').evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
      const h = await page.locator('#inside').evaluate((el) => el.offsetHeight);
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top + 5);
      await page.waitForTimeout(300);
      const a = await page.locator('#inside ol').evaluate((el) => el.getBoundingClientRect().left);
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top + (h - 720) * 0.8);
      await page.waitForTimeout(300);
      const b = await page.locator('#inside ol').evaluate((el) => el.getBoundingClientRect().left);
      expect(b).toBeLessThan(a - 300);
    });

    // ------------------------------------------------ book widgets
    test('book: booking picker, quiz, checklist, timetable, lightbox, directions, tracker', async ({ page }) => {
      await page.goto(url('book.html'), { waitUntil: 'load' });
      await page.waitForTimeout(600);
      // booking picker
      const hold = page.locator('#holdBtn');
      await expect(hold).toBeDisabled();
      await page.locator('[data-widget="booking-picker"] label', { hasText: 'Free inspection' }).click();
      await expect(page.locator('#sumSvc')).toHaveText('Free inspection and estimate');
      await page.locator('#dayList button').first().click();
      await page.locator('#timeGrid button:not([disabled])').first().click();
      await expect(page.locator('#sumTime')).not.toHaveText('Not chosen');
      await expect(hold).toBeEnabled();
      await hold.click();
      await expect(page.locator('#holdOk')).toContainText('Reference PW-');
      // quiz
      for (let i = 0; i < 3; i++) await page.locator('#quiz button').first().click();
      await expect(page.locator('#quizResult h3')).toHaveText('Battery and seal check first');
      await page.click('#quizRestart');
      await page.locator('#quiz button', { hasText: 'Automatic or hand-wound' }).click();
      await page.locator('#quiz button', { hasText: 'Running fast or slow' }).click();
      await page.locator('#quiz button', { hasText: 'Getting it back quickly' }).click();
      await expect(page.locator('#quizResult h3')).toHaveText('Demagnetise and regulate, same day');
      // checklist
      const boxes = page.locator('[data-widget="postal-checklist"] input[type="checkbox"]');
      const n = await boxes.count();
      for (let i = 0; i < n; i++) await boxes.nth(i).check();
      await expect(page.locator('#checkPct')).toHaveText('100%');
      await expect(page.locator('#checkDone')).toBeVisible();
      await boxes.first().uncheck();
      await expect(page.locator('#checkPct')).toHaveText('83%');
      // timetable
      await page.click('#tt-Mon');
      await expect(page.locator('#ttPanel')).toContainText('Bench day');
      await page.locator('#tt-Mon').press('ArrowRight');
      await expect(page.locator('#tt-Tue')).toHaveAttribute('aria-selected', 'true');
      await page.click('#tt-Thu');
      await expect(page.locator('#ttPanel')).toContainText('until 7pm');
      // lightbox
      await page.locator('[data-widget="gallery-lightbox"] li button').first().click();
      await expect(page.locator('#lightbox')).toBeVisible();
      await page.click('#lbNext');
      await expect(page.locator('#lightbox figcaption')).toContainText('(2 of 6)');
      await page.keyboard.press('Escape');
      await expect(page.locator('#lightbox')).toHaveCount(0);
      // directions
      await page.click('#tr-bus');
      await expect(page.locator('#trPanel')).toContainText('Routes 7 and 22');
      // tracker
      await page.fill('#ticket', 'abc');
      await page.locator('#trackForm button[type="submit"]').click();
      await expect(page.locator('#ticketErr')).toContainText('PW-2417');
      await page.fill('#ticket', 'PW-9999');
      await page.locator('#trackForm button[type="submit"]').click();
      await expect(page.locator('#ticketErr')).toContainText('can’t find PW-9999');
      await page.fill('#ticket', 'pw-2417');
      await page.locator('#trackForm button[type="submit"]').click();
      await expect(page.locator('#trackStage')).toContainText('Now: On the bench');
      await expect(page.locator('#ticketErr')).toHaveText('');
    });

    test('book: contact form rejects empty and invalid input, accepts valid', async ({ page }) => {
      await page.goto(url('book.html'), { waitUntil: 'load' });
      const submit = page.locator('#contactForm button[type="submit"]');
      await submit.click();
      await expect(page.locator('#nameErr')).toHaveText(/name/);
      await expect(page.locator('#emailErr')).toHaveText(/enter your email/);
      await expect(page.locator('#messageErr')).toHaveText(/more/);
      await expect(page.locator('#contactOk')).toHaveCount(0);
      await page.fill('#name', 'Robin');
      await page.fill('#email', 'robin@not-an-email');
      await page.fill('#message', 'My watch stops overnight. Is that a service?');
      await submit.click();
      await expect(page.locator('#emailErr')).toHaveText(/looks incomplete/);
      await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#nameErr')).toHaveText('');
      await expect(page.locator('#contactOk')).toHaveCount(0);
      await page.fill('#email', 'robin@example.com');
      await submit.click();
      await expect(page.locator('#contactOk')).toBeVisible();
      await expect(page.locator('#emailErr')).toHaveText('');
    });

    for (const pg of PAGES) {
      test(`${pg.key}: newsletter rejects empty and invalid email, accepts valid`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        const form = page.locator('#newsForm');
        await form.scrollIntoViewIfNeeded();
        const submit = page.locator('#newsForm button[type="submit"]');
        await submit.click();
        await expect(page.locator('#newsErr')).toHaveText(/enter your email/);
        await page.fill('#newsEmail', 'sam@nowhere');
        await submit.click();
        await expect(page.locator('#newsErr')).toHaveText(/looks incomplete/);
        await expect(page.locator('#newsOk')).toHaveCount(0);
        await page.fill('#newsEmail', 'sam@example.com');
        await submit.click();
        await expect(page.locator('#newsOk')).toBeVisible();
        await expect(page.locator('#newsErr')).toHaveText('');
      });
    }

    for (const pg of PAGES) {
      test(`${pg.key}: screenshots`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        await page.waitForTimeout(2000);
        const dir = process.env.SHOT_DIR || 'test-results';
        await page.screenshot({ path: `${dir}/${p.name}-${pg.key}-top.png` });
        await page.evaluate(() => {
          document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
          document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
        });
        await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 45000 });
        await page.waitForTimeout(800);
        await page.screenshot({ path: `${dir}/${p.name}-${pg.key}-full.png`, fullPage: true });
      });
    }
  });
}

// Smoothness: average frame rate while scrolling each page top to bottom on desktop.
for (const pg of PAGES) {
  test(`desktop ${pg.key}: scrolling stays at 50fps or better`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(url(pg.file), { waitUntil: 'load' });
    await page.waitForTimeout(1900);
    const fps = await page.evaluate(() => new Promise((resolve) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const times = [];
      let last = 0;
      let y = 0;
      function step(t) {
        if (last) times.push(t - last);
        last = t;
        y = Math.min(max, y + 30);
        window.scrollTo({ top: y, behavior: 'instant' });
        if (y < max) requestAnimationFrame(step);
        else {
          const avg = times.reduce((a, b) => a + b, 0) / times.length;
          resolve(1000 / avg);
        }
      }
      requestAnimationFrame(step);
    }));
    console.log(`${pg.key}: ${fps.toFixed(1)} fps average while scrolling`);
    expect(fps).toBeGreaterThanOrEqual(50);
  });
}
