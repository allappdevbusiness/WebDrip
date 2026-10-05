// Tempowick concept site — smoke tests (Desktop 1280×720 + iPhone 13)
// Run from repo root:  npx http-server -p 8080 -s &  npx playwright test automation-v1/2026-10-02-tempowick/tests
const { test, expect, devices } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PATH = '/automation-v1/2026-10-02-tempowick/';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const launchOptions = { executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' };

test.use({ launchOptions, proxy, ignoreHTTPSErrors: true, serviceWorkers: 'block' });

const { defaultBrowserType, ...iPhone } = devices['iPhone 13'];

const profiles = [
  { name: 'desktop', use: { viewport: { width: 1280, height: 720 } }, mobile: false },
  { name: 'iphone13', use: iPhone, mobile: true },
];

// Third-party assets (Tailwind CDN, Google Fonts, Unsplash) go through the
// sandbox egress proxy, whose tunnels occasionally drop. Fetch them with a few
// retries so a transport hiccup isn't reported as a page error; a resource
// that still fails after retries surfaces as a console error as usual.
test.beforeEach(async ({ page }) => {
  await page.route((url) => !/^(localhost|127\.0\.0\.1)$/.test(url.hostname), async (route) => {
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

// A short test can finish while third-party fetches are still in flight.
test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

function collectErrors(page) {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

async function scrollThrough(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(400);
  for (let y = height; y >= 0; y -= 600) {
    await page.mouse.wheel(0, -600);
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

for (const p of profiles) {
  test.describe(p.name, () => {
    test.use(p.use);

    test('loads and scrolls without console errors', async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(BASE + PATH, { waitUntil: 'load' });
      await expect(page.locator('h1')).toContainText('Keep it for life');
      if (p.mobile) {
        // touch devices: scroll programmatically
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y <= h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
        for (let y = h; y >= 0; y -= 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50); }
      } else {
        await scrollThrough(page);
      }
      await page.waitForTimeout(300);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('hero image transform changes on scroll', async ({ page }) => {
      await page.goto(BASE + PATH, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      const before = await page.locator('#heroImg').evaluate((el) => getComputedStyle(el).transform);
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
      await page.waitForTimeout(1200);
      const after = await page.locator('#heroImg').evaluate((el) => getComputedStyle(el).transform);
      expect(after).not.toEqual(before);
      // and it reverses back when scrolling up
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1600);
      const back = await page.locator('#heroImg').evaluate((el) => getComputedStyle(el).transform);
      expect(back).not.toEqual(after);
    });

    test('form rejects empty and invalid input, accepts valid', async ({ page }) => {
      await page.goto(BASE + PATH);
      const form = page.locator('#trialForm');
      await form.scrollIntoViewIfNeeded();
      const submit = form.getByRole('button', { name: /Book my free trial/ });
      const success = page.locator('#formOk');

      await submit.click();
      await expect(page.locator('#nameErr')).toHaveText(/name/);
      await expect(page.locator('#emailErr')).toHaveText(/enter your email/);
      await expect(page.locator('#instrumentErr')).toHaveText(/instrument/);
      await expect(success).toBeHidden();

      await page.fill('#name', 'Robin Ashby');
      await page.fill('#email', 'robin@not-an-email');
      await page.selectOption('#instrument', 'Drums');
      await submit.click();
      await expect(page.locator('#emailErr')).toHaveText(/look right/);
      await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#nameErr')).toHaveText('');
      await expect(success).toBeHidden();

      await page.fill('#email', 'robin@example.com');
      await submit.click();
      await expect(success).toBeVisible();
      await expect(success).toContainText('Robin');
      await expect(page.locator('#emailErr')).toHaveText('');
    });

    if (p.mobile) {
      test('hamburger opens, closes and its links navigate', async ({ page }) => {
        await page.goto(BASE + PATH);
        const btn = page.locator('#burger');
        const menu = page.locator('#mobileMenu');
        await expect(btn).toBeVisible();
        await expect(btn).toHaveAttribute('aria-expanded', 'false');
        await btn.click();
        await expect(btn).toHaveAttribute('aria-expanded', 'true');
        await expect(menu).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(btn).toHaveAttribute('aria-expanded', 'false');
        await expect(menu).toBeHidden();

        await btn.click();
        await expect(menu).toBeVisible();
        await menu.getByRole('link', { name: "Programs" }).click();
        await expect(page).toHaveURL(/#programs$/);
        await expect(menu).toBeHidden();
        await expect(btn).toHaveAttribute('aria-expanded', 'false');
        await page.waitForTimeout(900);
        const top = await page.locator('#programs').evaluate((el) => el.getBoundingClientRect().top);
        expect(Math.abs(top)).toBeLessThan(200);
      });

      test('no horizontal overflow at mobile width', async ({ page }) => {
        await page.goto(BASE + PATH, { waitUntil: 'load' });
        // the layout viewport must stay at device width (no zoom-out from wide content)
        const deviceWidth = page.viewportSize().width;
        for (const y of [0, 800, 2000, 4000, 99999]) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(150);
          const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
          expect(o.sw, `scrollWidth ${o.sw} > clientWidth ${o.cw} at y=${y}`).toBeLessThanOrEqual(o.cw);
          expect(o.cw, `layout viewport ${o.cw} wider than device ${deviceWidth} at y=${y}`).toBeLessThanOrEqual(deviceWidth);
        }
      });
    }


    test('every animated element is fully visible after scrolling to the bottom', async ({ page }) => {
      await page.goto(BASE + PATH, { waitUntil: 'load' });
      await page.waitForTimeout(600);
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= h; y += 300) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(70); }
      await page.waitForTimeout(1800);
      const hidden = await page.evaluate(() => {
        const sel = '[data-reveal], [data-reveal] h2, [data-reveal] h3, [data-reveal] img, .card, h2, h3';
        return [...document.querySelectorAll(sel)].filter((el) => {
          if (el.closest('#top')) return false;
          let o = 1; for (let n = el; n && n !== document.body; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
          const unrevealed = el.matches('[data-reveal]') && !el.classList.contains('in');
          return o < 0.999 || unrevealed;
        }).map((el) => el.tagName + '.' + el.className.slice(0, 40));
      });
      expect(hidden, hidden.join('\n')).toEqual([]);
    });

    test('screenshots', async ({ page }) => {
      await page.goto(BASE + PATH, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      const dir = process.env.SHOT_DIR || 'test-results';
      await page.screenshot({ path: `${dir}/${p.name}-hero.png` });
      await page.evaluate(() => {
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      });
      await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${dir}/${p.name}-full.png`, fullPage: true });
    });
  });
}
