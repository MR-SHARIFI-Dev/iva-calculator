import { chromium } from '@playwright/test';
const browser = await chromium.launch();

const capture = async (colorScheme, viewport, path) => {
  const page = await browser.newPage({
    viewport,
    colorScheme,
    deviceScaleFactor: 1
  });
  await page.addInitScript((scheme) => {
    try { localStorage.setItem('iva-theme', scheme === 'light' ? 'light' : 'dark'); } catch {}
  }, colorScheme);
  await page.goto('http://127.0.0.1:4173/?app-version=3.3.0');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'e', exact: true }).click();
  await page.getByRole('button', { name: '3', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path, fullPage: true });
  await page.close();
};

await capture('dark', { width: 1180, height: 900 }, 'assets/screenshots/v3.3.0-dark.png');
await capture('dark', { width: 1180, height: 900 }, 'assets/screenshots/desktop.png');
await capture('light', { width: 1180, height: 900 }, 'assets/screenshots/v3.3.0-light.png');
await capture('dark', { width: 390, height: 844 }, 'assets/screenshots/mobile.png');
await browser.close();
console.log('screenshots saved');
