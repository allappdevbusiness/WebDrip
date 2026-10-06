// EyeMax concept site: Playwright checks for all three pages (Desktop 1280x720 + iPhone 13).
// Adapted from _toolkit/demo.spec.js. Run from the repo root with the site served on :8080:
//   npx http-server -p 8080 -s &  TEST_DIR=automation-v2/websites/eyemax/tests npx playwright test -c _toolkit/pw.config.js
const { test, expect, devices } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PATH = '/automation-v2/websites/eyemax/';
const PAGES = [
  { file: 'index.html', key: 'home', h1: 'See well.', minSections: 10 },
  { file: 'services.html', key: 'services', h1: 'Exams, lenses and what they cost', minSections: 8 },
  { file: 'book.html', key: 'book', h1: 'Book a visit', minSections: 8 },
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
      expect(text).toContain(pg.h1);
      await page.goto(url(pg.file), { waitUntil: 'load' });
      const expected = await page.evaluate(() => {
        const norm = (s) => s.replace(/\s+/g, ' ').trim();
        return [...document.querySelectorAll('main > section')].map((s) => ({
          id: s.id,
          texts: [...s.querySelectorAll('h1, h2, h3, p, li')]
            .filter((el) => !el.closest('[data-widget]') && !el.querySelector('h1, h2, h3, p, li'))
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
      console.log(`${pg.key}: ${m.sections} sections, ${m.words} words, widgets: ${m.widgets.join(', ')}`);
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
  });
}

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
        await expect(page.locator('h1')).toContainText(pg.h1.split(' ')[0]);
        await scrollAll(page);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = h; y >= 0; y -= 700) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(40); }
        await page.waitForTimeout(400);
        expect(errors, errors.join('\n')).toEqual([]);
      });

      test(`${pg.key}: every animated element is fully visible after scrolling to the bottom`, async ({ page }) => {
        await page.goto(url(pg.file), { waitUntil: 'load' });
        await page.waitForTimeout(1800); // intro loader finishes
        await scrollAll(page, 300, 70);
        await page.waitForTimeout(1800);
        const hidden = await page.evaluate(() => {
          const sel = '[data-anim], [data-reveal], [data-reveal] h2, [data-reveal] h3, [data-reveal] img, h2, h3';
          return [...document.querySelectorAll(sel)].filter((el) => {
            if (el.closest('#top')) return false;
            if (!el.getClientRects().length) return false; // not rendered at this breakpoint
            const cs = getComputedStyle(el);
            if (cs.visibility === 'hidden') return false; // closed menu
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
        await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 });
        const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
        expect(broken, broken.join('\n')).toEqual([]);
        const external = await page.evaluate(() => [...document.images].filter((i) => !i.src.startsWith(location.origin)).map((i) => i.src));
        expect(external, 'images must be served from the site assets folder').toEqual([]);
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
          await expect(page.locator('h1')).toContainText(next.h1.split(' ')[0]);
        });
      }
    }

    test('desktop nav links move between all three pages', async ({ page }) => {
      test.skip(p.mobile, 'desktop nav only');
      await page.goto(url('index.html'), { waitUntil: 'load' });
      for (const target of [PAGES[1], PAGES[2], PAGES[0]]) {
        await page.locator(`#nav nav a[href="./${target.file}"]`).click();
        await expect(page).toHaveURL(new RegExp(target.file.replace('.', '\\.') + '$'));
        await expect(page.locator('h1')).toContainText(target.h1.split(' ')[0]);
        await expect(page.locator('#nav nav a[aria-current="page"]')).toHaveAttribute('href', `./${target.file}`);
      }
    });

    test('page transition runs between pages, with no unstyled flash', async ({ page, request }) => {
      for (const pg of PAGES) {
        const raw = await (await request.get(url(pg.file))).text();
        const head = raw.slice(0, raw.indexOf('<body'));
        expect(head, `${pg.file}: stylesheet must be render-blocking in <head>`).toMatch(/<link rel="stylesheet"[^>]+\.css">/);
      }
      await page.goto(url('index.html'), { waitUntil: 'load' });
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
      // the new page is styled from its first frame
      const styled = await page.evaluate(() => getComputedStyle(document.getElementById('nav')).position);
      expect(styled).toBe('sticky');
      if (supported) {
        await page.waitForFunction(() => window.__wdVT !== null, null, { timeout: 5000 });
        // either the cross-document view transition ran, or the quick fade fallback did
        const shown = await page.evaluate(() => window.__wdVT === true || document.documentElement.classList.contains('wd-enter'));
        expect(shown).toBe(true);
      }
    });

    // ------------------------------------------------ home widgets
    test('home: hero transform changes on scroll and reverses', async ({ page }) => {
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(600);
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

    test('home: frame filter, search, quiz, before/after, carousel, accordion, open-now, spotlight', async ({ page }) => {
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await page.waitForTimeout(1700);
      // filter + search
      const count = page.locator('#frameCount');
      await expect(count).toHaveText('7 frames shown');
      await page.locator('[data-widget="frame-filter"] button', { hasText: 'titanium' }).click();
      await expect(count).toHaveText('2 frames shown');
      await page.locator('[data-widget="frame-filter"] button', { hasText: 'Any material' }).click();
      await page.fill('#frameSearch', 'tortoise');
      await expect(count).toHaveText('3 frames shown');
      await page.fill('#frameSearch', 'zzzz');
      await expect(page.locator('#frameEmpty')).toBeVisible();
      await page.locator('#frameEmpty button').click();
      await expect(count).toHaveText('7 frames shown');
      // quiz
      for (let i = 0; i < 3; i++) await page.locator('#quiz button').first().click();
      await expect(page.locator('#quizResult li')).toHaveCount(2);
      // before / after
      await page.locator('#baRange').fill('20');
      await expect(page.locator('#baOut')).toHaveText('20% coated view');
      // carousel
      await page.click('#reviewNext');
      await expect(page.locator('#reviewPos')).toHaveText('2 / 4');
      await expect.poll(() => page.locator('#reviewTrack').evaluate((el) => el.style.transform)).toBe('translateX(-100%)');
      // accordion
      const b1 = page.locator('#care-b1');
      await b1.click();
      await expect(b1).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#care-p1')).toHaveAttribute('data-open', 'true');
      await expect(page.locator('#care-b0')).toHaveAttribute('aria-expanded', 'false');
      // open now
      await expect(page.locator('#openStatus')).toHaveText(/Open now|Closed now/);
      // spotlight pause / play
      await page.click('#spotToggle');
      await expect(page.locator('#spotToggle')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#spotImg')).toHaveClass(/wd-paused/);
    });

    // ------------------------------------------------ services widgets
    test('services: pricing toggle, calculator, lens compare, size guide, timeline, FAQ search', async ({ page }) => {
      await page.goto(url('services.html'), { waitUntil: 'load' });
      const price = page.locator('[data-price="Essentials"]');
      await expect(price).toHaveText('$9');
      await page.click('#billYearly');
      await expect(price).toHaveText('$96');
      await page.click('#billMonthly');
      await expect(price).toHaveText('$9');
      // calculator: studio 129 + single 89 + standard 0 + AR 45
      const total = page.locator('#calcTotal');
      await expect(total).toHaveText('$263');
      await page.locator('[data-widget="cost-calculator"] label', { hasText: 'Varifocal standard' }).click();
      await expect(total).toHaveText('$423');
      await page.locator('#extra-photo').check();
      await expect(total).toHaveText('$512');
      await page.locator('#calcPlan').check();
      await expect(total).toHaveText('$435');
      // lens compare
      await page.locator('[data-widget="lens-compare"] button', { hasText: 'Screens' }).click();
      await expect(page.locator('[data-widget="lens-compare"] th[data-best]')).toHaveCount(2);
      // size guide
      await page.locator('[data-size="Lens width"]').fill('56');
      await expect(page.locator('#sizeCode')).toHaveText('56-19-145');
      await expect(page.locator('#sizeFit')).toHaveText(/Large/);
      // process timeline
      await page.click('#stepNext');
      await expect(page.locator('#stepPanel h3')).toHaveText('Pre-tests');
      await page.locator('#step-tab-4').click();
      await expect(page.locator('#stepPanel h3')).toHaveText('Eye health');
      // FAQ search + accordion
      await expect(page.locator('[data-faq]')).toHaveCount(14);
      await page.fill('#faqSearch', 'varifocal');
      await expect(page.locator('#faqCount')).toHaveText(/^[1-9] of 14 questions$/);
      const first = page.locator('[data-faq] button').first();
      await first.click();
      await expect(first).toHaveAttribute('aria-expanded', 'true');
      await page.fill('#faqSearch', '');
      await expect(page.locator('[data-faq]')).toHaveCount(14);
    });

    // ------------------------------------------------ book widgets
    test('book: booking picker, checklist, timetable, map tabs, gallery lightbox', async ({ page }) => {
      await page.goto(url('book.html'), { waitUntil: 'load' });
      const hold = page.locator('#holdBtn');
      await expect(hold).toBeDisabled();
      await page.locator('[data-widget="booking-picker"] label', { hasText: 'Complete exam with OCT' }).click();
      await page.locator('#dayList button').first().click();
      await page.locator('#timeGrid button:not([disabled])').first().click();
      await expect(page.locator('#sumTime')).not.toHaveText('Not chosen');
      await hold.click();
      await expect(page.locator('#holdOk')).toContainText('Reference EM-');
      // checklist
      const boxes = page.locator('[data-widget="checklist"] input[type="checkbox"]');
      const n = await boxes.count();
      for (let i = 0; i < n; i++) await boxes.nth(i).check();
      await expect(page.locator('#checkPct')).toHaveText('100%');
      await expect(page.locator('#checkDone')).toBeVisible();
      // timetable
      await page.click('#tt-Tue');
      await expect(page.locator('#ttPanel')).toContainText("Kids' clinic");
      await page.locator('#tt-Tue').press('ArrowRight');
      await expect(page.locator('#tt-Wed')).toHaveAttribute('aria-selected', 'true');
      // map
      await page.click('#tr-bus');
      await expect(page.locator('#trPanel')).toContainText('Routes 12 and 40');
      // lightbox
      await page.locator('[data-widget="gallery-lightbox"] li button').first().click();
      await expect(page.locator('#lightbox')).toBeVisible();
      await page.click('#lbNext');
      await expect(page.locator('#lightbox figcaption')).toContainText('(2 of 6)');
      await page.keyboard.press('Escape');
      await expect(page.locator('#lightbox')).toBeHidden();
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
      await page.fill('#message', 'Can I bring my own frame for new lenses?');
      await submit.click();
      await expect(page.locator('#emailErr')).toHaveText(/looks incomplete/);
      await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#nameErr')).toHaveText('');
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
        await expect(page.locator('#newsErr')).toHaveText(/Enter your email/);
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
        await page.waitForTimeout(1800);
        const dir = process.env.SHOT_DIR || 'test-results';
        await page.screenshot({ path: `${dir}/${p.name}-${pg.key}-top.png` });
        await page.evaluate(() => {
          document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
          document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
        });
        await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
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
    await page.waitForTimeout(1800);
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
