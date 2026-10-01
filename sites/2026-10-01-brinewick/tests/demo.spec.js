// Brinewick concept site — smoke tests (Desktop 1280×720 + iPhone 13)
// Run from repo root:  npx http-server -p 8080 -s &  npx playwright test sites/2026-10-01-brinewick/tests
const { test, expect, devices } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PATH = '/sites/2026-10-01-brinewick/';
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
        return route.fulfill({ response });
      } catch (e) {
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
      }
    }
    return route.continue();
  });
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
      await expect(page.locator('h1')).toContainText('Learn to read');
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
      const before = await page.locator('#hero-img').evaluate((el) => getComputedStyle(el).transform);
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
      await page.waitForTimeout(1200);
      const after = await page.locator('#hero-img').evaluate((el) => getComputedStyle(el).transform);
      expect(after).not.toEqual(before);
      // and it reverses back when scrolling up
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1600);
      const back = await page.locator('#hero-img').evaluate((el) => getComputedStyle(el).transform);
      expect(back).not.toEqual(after);
    });

    test('form rejects empty and invalid input, accepts valid', async ({ page }) => {
      await page.goto(BASE + PATH);
      const form = page.locator('#signup');
      await form.scrollIntoViewIfNeeded();
      const submit = form.getByRole('button', { name: 'Send me the swell call' });
      const success = page.locator('#form-success');

      await submit.click();
      await expect(page.locator('#e-name')).toBeVisible();
      await expect(page.locator('#e-email')).toBeVisible();
      await expect(page.locator('#e-level')).toBeVisible();
      await expect(success).toBeHidden();

      await page.fill('#f-name', 'Kai Brine');
      await page.fill('#f-email', 'kai@not-an-email');
      await page.selectOption('#f-level', { index: 1 });
      await submit.click();
      await expect(page.locator('#e-email')).toBeVisible();
      await expect(page.locator('#f-email')).toHaveAttribute('aria-invalid', 'true');
      await expect(success).toBeHidden();

      await page.fill('#f-email', 'kai@example.com');
      await submit.click();
      await expect(success).toBeVisible();
      await expect(page.locator('#e-email')).toBeHidden();
    });

    if (p.mobile) {
      test('hamburger opens, closes and its links navigate', async ({ page }) => {
        await page.goto(BASE + PATH);
        const btn = page.locator('#menu-btn');
        const menu = page.locator('#mobile-menu');
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
        await menu.getByRole('link', { name: 'Lessons' }).click();
        await expect(page).toHaveURL(/#lessons$/);
        await expect(menu).toBeHidden();
        await expect(btn).toHaveAttribute('aria-expanded', 'false');
        await page.waitForTimeout(900);
        const top = await page.locator('#lessons').evaluate((el) => el.getBoundingClientRect().top);
        expect(Math.abs(top)).toBeLessThan(200);
      });

      test('no horizontal overflow at mobile width', async ({ page }) => {
        await page.goto(BASE + PATH, { waitUntil: 'load' });
        for (const y of [0, 800, 2000, 4000, 99999]) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(150);
          const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
          expect(o.sw, `scrollWidth ${o.sw} > clientWidth ${o.cw} at y=${y}`).toBeLessThanOrEqual(o.cw);
        }
      });
    }

    test('screenshots', async ({ page }) => {
      await page.goto(BASE + PATH, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      const dir = process.env.SHOT_DIR || 'test-results';
      await page.screenshot({ path: `${dir}/${p.name}-hero.png` });
      await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      });
      await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${dir}/${p.name}-full.png`, fullPage: true });
    });
  });
}
