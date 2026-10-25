import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs';

const launch = { headless: true };
if (process.env.POCKET_PAL_BROWSER) launch.executablePath = process.env.POCKET_PAL_BROWSER;
else if (!existsSync(chromium.executablePath()) && process.platform === 'win32') {
  const edge = path.join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe');
  if (existsSync(edge)) launch.executablePath = edge;
}
const browser = await chromium.launch(launch);
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce', acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const guideUrl = pathToFileURL(path.resolve('index.html')).href;
const stat = key => page.locator(`#stat-${key}`).innerText().then(Number);
await fs.mkdir('artifacts', { recursive: true });
try {
  await page.goto(guideUrl);
  assert(page.url().endsWith('/README.html'), 'Root entry must open the guide');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#mission-setup').waitFor();
  assert.equal(await page.locator('.mission').count(), 10);
  assert.equal(await page.locator('#workbench-content .workbench-steps li').count(), 10);
  assert.equal(await page.locator('.snippet').count(), 16);
  assert.equal(await page.locator('#question-list details').count(), 15);
  await page.locator('#mission-setup .snippet').first().locator('summary').click();
  await page.locator('[data-copy-block="snippet-first-screen"]').click();
  await page.locator('#toast').filter({ hasText: /Copied|Text selected/ }).waitFor({ state: 'visible' });
  await page.locator('#mission-setup .snippet').first().locator('summary').click();
  await page.locator('#feed').click(); await page.locator('#play').click();
  assert.deepEqual(await Promise.all(['hunger', 'happiness', 'energy'].map(stat)), [15, 85, 60]);
  await page.locator('#sleep').click();
  assert(await page.locator('#feed').isDisabled()); assert(await page.locator('#play').isDisabled());
  await page.locator('#tick').click();
  assert.deepEqual(await Promise.all(['hunger', 'happiness', 'energy'].map(stat)), [17, 85, 70]);
  await page.locator('#reset-demo').click();
  for (let i = 0; i < 8; i++) await page.locator('#tick').click();
  assert.equal(await page.locator('#pet-mood').innerText(), 'Feeling hungry');
  assert((await page.locator('#pet-art').getAttribute('src')).includes('hungry'));
  for (let i = 0; i < 100; i++) await page.locator('#tick').evaluate(el => el.click());
  assert.deepEqual(await Promise.all(['hunger', 'happiness', 'energy'].map(stat)), [100, 0, 0]);
  assert(await page.locator('#play').isDisabled());
  await page.locator('#sleep').click();
  for (let i = 0; i < 12; i++) await page.locator('#tick').evaluate(el => el.click());
  assert.equal(await stat('energy'), 100);
  assert.equal(await page.locator('#pet-mood').innerText(), 'Shh… sleeping');
  await page.locator('#reset-demo').click();
  await page.locator('#feed').click(); await page.locator('#feed').click();
  assert.equal(await stat('hunger'), 0); assert(await page.locator('#feed').isDisabled());
  await page.locator('#complete-setup').check();
  await page.locator('#acceptance-0').check();
  await page.reload();
  assert(await page.locator('#complete-setup').isChecked()); assert(await page.locator('#acceptance-0').isChecked());
  assert.equal(await page.locator('#progress-percent').innerText(), '10%');
  assert.equal(await page.locator('#progress-xp').innerText(), '100 XP');
  await page.locator('#map-ship').click();
  assert.equal(await page.locator('#mission-ship').getAttribute('open'), '');
  assert.equal(await page.locator('#mission-ship > summary').evaluate(el => document.activeElement === el), true);
  await page.locator('#expand-all').click();
  assert.equal(await page.locator('.mission[open]').count(), 10);
  await page.locator('#expand-all').click();
  assert.equal(await page.locator('.mission[open]').count(), 0);
  await page.locator('#mission-setup > summary').focus(); await page.keyboard.press('Enter');
  assert(await page.locator('#mission-setup').getAttribute('open') !== null);
  await page.locator('[data-copy="setup"]').click();
  await page.locator('#toast').filter({ hasText: /Copied|Text selected/ }).waitFor({ state: 'visible' });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-progress').click();
  const download = await downloadPromise;
  const file = path.resolve('artifacts/progress.md'); await download.saveAs(file);
  const exported = await fs.readFile(file, 'utf8'); assert(exported.includes('- [x] Get your launchpad ready'));
  page.once('dialog', dialog => dialog.dismiss()); await page.locator('#clear-progress').click();
  assert.equal(await page.locator('#progress-percent').innerText(), '10%');
  page.once('dialog', dialog => dialog.accept()); await page.locator('#clear-progress').click();
  assert.equal(await page.locator('#progress-percent').innerText(), '0%');
  await page.evaluate(() => localStorage.setItem('pocket-pal-quadri-guide-v1', '{broken'));
  await page.reload(); assert(await page.locator('#storage-note').innerText().then(t => t.includes('could not be read')));
  await page.locator('#complete-setup').check();
  assert.equal(await page.locator('#progress-percent').innerText(), '10%');
  // Also exercise the explicit no-storage fallback.
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }); });
  const blockedPage = await blocked.newPage(); await blockedPage.goto(guideUrl);
  await blockedPage.locator('#complete-setup').check();
  assert.equal(await blockedPage.locator('#progress-percent').innerText(), '10%');
  assert((await blockedPage.locator('#storage-note').innerText()).includes('unavailable'));
  await blocked.close();
  await page.evaluate(() => localStorage.clear()); await page.reload();
  for (const width of [375, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    if (width === 375) {
      await page.locator('#mission-model').evaluate(el => { el.open = true; });
      await page.locator('#mission-model .snippet').first().evaluate(el => { el.open = true; });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert(!overflow, `Layout overflow at ${width}px`);
    if (width === 375) {
      await page.locator('#mission-model .snippet').first().evaluate(el => { el.open = false; });
      await page.locator('#mission-model').evaluate(el => { el.open = false; });
    }
    const brokenImages = await page.locator('img').evaluateAll(imgs => imgs.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
    assert.deepEqual(brokenImages, []);
    if (width === 375 || width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `artifacts/guide-${width}.png`, fullPage: true });
      await page.screenshot({ path: `artifacts/hero-${width}.png`, fullPage: false });
    }
  }
  // Test real motion independently of the reduced-motion functional checks.
  const lively = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'no-preference' });
  const animated = await lively.newPage(); await animated.goto(guideUrl);
  await animated.locator('#pet-art').waitFor();
  assert.equal(await animated.locator('#pet-art').evaluate(el => getComputedStyle(el).animationName), 'pal-bob');
  assert.equal(await animated.locator('#motion-toggle').getAttribute('aria-pressed'), 'false');
  const frame1 = await animated.locator('.concept-preview>img').screenshot();
  await animated.waitForTimeout(650);
  const frame2 = await animated.locator('.concept-preview>img').screenshot();
  assert(!frame1.equals(frame2), 'The concept GIF must visibly animate');
  await animated.locator('#play').click();
  assert.equal(await animated.locator('#pet-reaction').innerText(), '✦ LET’S GO!');
  await animated.locator('#motion-toggle').click();
  assert.equal(await animated.locator('#pet-art').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
  assert((await animated.locator('.concept-preview>img').getAttribute('src')).endsWith('-poster.png'));
  await animated.locator('#motion-toggle').click();
  assert((await animated.locator('.concept-preview>img').getAttribute('src')).endsWith('.gif'));
  await lively.close();
  await page.goto(pathToFileURL(path.resolve('dist/index.html')).href);
  assert.equal(await page.locator('.mission').count(), 10, 'Packaged guide must work at a nested base path');
  assert.deepEqual(errors, []);
  console.log('Passed: root launch, pet rules, mission map, XP, saved progress, keyboard use, export/reset, storage recovery, 4 viewport widths, visible GIF/CSS motion, pause/resume and packaged nested paths.');
} finally { await browser.close(); }
