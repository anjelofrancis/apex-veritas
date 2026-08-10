/* eslint-disable no-console */
/**
 * Drives the public site and the portal in a real browser, captures a
 * screenshot per page and reports every console error / failed request.
 *
 * Both dev servers must already be running (web :5174, portal :5173, api :4000).
 *
 *   node scripts/shoot.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const WEB = 'http://localhost:5174';
const PORTAL = 'http://localhost:5173';
const OUT = path.join(__dirname, '..', '.screenshots');

const LOGIN = { email: 'admin@riftvalleycement.co.ke', password: 'Passw0rd!demo' };

const PUBLIC_PAGES = [
  ['home', '/'],
  ['solutions', '/solutions'],
  ['industries', '/industries'],
  ['compliance-hub', '/compliance-hub'],
  ['resources', '/resources'],
  ['templates', '/templates'],
  ['pricing', '/pricing'],
  ['contact', '/contact'],
  ['not-found', '/no-such-page'],
];

/** Attaches error collectors to a page; returns the accumulating array. */
function watch(page, label) {
  const problems = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`[${label}] console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`[${label}] pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    problems.push(`[${label}] request failed: ${req.url()} — ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) problems.push(`[${label}] HTTP ${res.status()}: ${res.url()}`);
  });
  return problems;
}

async function shoot(page, name) {
  await page.waitForLoadState('networkidle').catch(() => {});
  // JPEG rather than PNG — these get read back inline, and PNG screenshots of
  // full pages are large enough to be awkward to pass around.
  await page.screenshot({
    path: path.join(OUT, `${name}.jpg`),
    fullPage: true,
    type: 'jpeg',
    quality: 72,
  });
  const heading = await page.locator('h1').first().textContent().catch(() => null);
  console.log(`  ${name.padEnd(18)} h1: ${heading ? heading.trim().slice(0, 60) : '(none)'}`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const problems = watch(page, 'web');

  console.log('Public site:');
  for (const [name, route] of PUBLIC_PAGES) {
    await page.goto(WEB + route, { waitUntil: 'domcontentloaded' });
    await shoot(page, `web-${name}`);
  }

  // Contact form — fill and submit, confirm the success state renders.
  console.log('\nContact form:');
  await page.goto(`${WEB}/contact`, { waitUntil: 'domcontentloaded' });
  // Fields are labelled implicitly (input nested in <label>), so no ids to target.
  await page.fill('input[type="text"]', 'Browser Smoke Test');
  await page.fill('input[type="email"]', 'smoke@example.com');
  await page.fill('textarea', 'Submitted by the automated smoke test. Safe to delete.');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  await shoot(page, 'web-contact-submitted');

  console.log('\nPortal:');
  const portalProblems = watch(page, 'portal');
  await page.goto(`${PORTAL}/login`, { waitUntil: 'domcontentloaded' });
  await shoot(page, 'portal-login');

  await page.fill('input[type="email"]', LOGIN.email);
  await page.fill('input[type="password"]', LOGIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/portal/, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await shoot(page, 'portal-dashboard');

  // Guard check: clear tokens, reload, expect a bounce back to /login.
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${PORTAL}/portal`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  console.log(`  auth guard: cleared tokens -> landed on ${new URL(page.url()).pathname}`);
  await shoot(page, 'portal-guard-redirect');

  await browser.close();

  const all = [...problems, ...portalProblems];
  console.log(`\nScreenshots in ${OUT}`);
  if (all.length) {
    console.log(`\n${all.length} problem(s):`);
    all.forEach((p) => console.log('  -', p));
  } else {
    console.log('\nNo console errors or failed requests.');
  }
}

main().catch((err) => {
  console.error('Driver failed:', err);
  process.exitCode = 1;
});
