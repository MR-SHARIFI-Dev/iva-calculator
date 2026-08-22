import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const context = await browser.newContext({ serviceWorkers: 'allow' });
const page = await context.newPage();
await page.goto('http://127.0.0.1:4173/?app-version=3.3.1');
await page.waitForTimeout(1500);
const ready = await page.evaluate(async () => {
  try { await navigator.serviceWorker.ready; return true; } catch { return false; }
});
console.log('service worker active:', ready);
await context.setOffline(true);
await page.reload({ waitUntil: 'load' });
await page.getByRole('button', { name: '2', exact: true }).click();
await page.getByRole('button', { name: 'Add' }).click();
await page.getByRole('button', { name: '2', exact: true }).click();
await page.getByRole('button', { name: 'Calculate' }).click();
const result = (await page.locator('#result').textContent()).trim();
const version = (await page.locator('.brand small').textContent()).trim();
console.log('offline result 2+2 =', result);
console.log('offline version label =', version);
await context.setOffline(false);
await browser.close();
