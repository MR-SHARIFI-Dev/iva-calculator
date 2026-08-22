// Bug-hunt: drive the app like a real user and print what happens.
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`PAGE ERROR: ${e.message}`));

await page.goto(`${BASE}/?app-version=3.3.1`);

const click = async (name) => page.getByRole('button', { name, exact: true }).click();
const clickOrNote = async (name, label) => {
  const button = page.getByRole('button', { name, exact: true });
  const disabled = await button.isDisabled();
  if (disabled) { console.log(`   !! button "${label}" is DISABLED here`); return false; }
  await button.click();
  return true;
};
const press = async (key) => page.keyboard.press(key);
const display = async () => ({
  expr: (await page.locator('#expression').textContent()).trim(),
  result: (await page.locator('#result').textContent()).trim(),
  message: (await page.locator('#message').textContent()).trim()
});

// Scenario 1: Euler button — press 2, e, 3, =
await click('AC');
await click('2'); await click('e'); await click('3'); await click('Calculate');
console.log('SCENARIO 1 [2, e, 3, =]  ->', JSON.stringify(await display()));
console.log('   Expected ~16.31 (2 × e × 3). Anything else is a bug.');

// Scenario 2: negative exponent — press 2, x^y, −, 2, =
await click('AC');
await click('2'); await click('xʸ');
await clickOrNote('Subtract', '−');
await press('-'); // keyboard path too
console.log('SCENARIO 2 [2, xʸ, −(button+key), 2, =] ->', JSON.stringify(await display()));
console.log('   Expected 2^-2 = 0.25. Blocked input is a bug.');

// Scenario 3: after =, pressing a scientific button must start a fresh expression
await click('AC');
await click('5'); await click('Calculate');
await click('sin');
console.log('SCENARIO 3 [5, =, sin(]  -> expression =', JSON.stringify(await display()));
console.log('   Expected a FRESH expression "sin(". "5 × sin(" means the whitelist is broken.');

// Scenario 4: factorial followed by a digit (implicit multiplication trap)
await click('AC');
await click('5'); await click('x!'); await click('3'); await click('Calculate');
console.log('SCENARIO 4 [5, x!, 3, =]  ->', JSON.stringify(await display()));
console.log('   Expected the digit after ! to be ignored (or a clear expression), not a silent 360.');

// Scenario 5: decimal after operator then operator again
await click('AC');
await click('1'); await click('Add'); await click('.');
console.log('SCENARIO 5 [1, +, .]  ->', JSON.stringify(await display()));
console.log('   Expected 1+0.');

// Scenario 6: keyboard scientific notation typed manually (lowercase e must mean Euler now)
await click('AC');
await click('2'); await click('e'); await click('3');
console.log('SCENARIO 6 [2, e, 3] preview ->', JSON.stringify(await display()));
console.log('   Expected ~16.31. 2000 means the Euler/e-notation conflict is unfixed.');

// Scenario 7: double-press of a focused button via Space (native activation duplicate)
await click('AC');
await click('7');
await press(' ');
console.log('SCENARIO 7 [7, Space]  ->', JSON.stringify(await display()));
console.log('   Expected a single 7. Two 7s means Space re-fires the focused button.');

// Scenario 8: 10^20 formatted result must survive continuation
await click('AC');
for (let i = 0; i < 20; i += 1) await press('9');
// 99999999999999999999 * 10
await click('Multiply');
await click('1'); await click('0'); await click('Calculate');
console.log('SCENARIO 8 [huge number =] ->', JSON.stringify(await display()));
await click('Add'); await click('1'); await click('Calculate');
console.log('SCENARIO 8b [continue +1 =] ->', JSON.stringify(await display()));
console.log('   Expected the huge value + 1, not garbage.');

// Scenario 9: percent display and postfix
await click('AC');
await click('5'); await click('0'); await click('%'); await click('Calculate');
console.log('SCENARIO 9 [50 % =] ->', JSON.stringify(await display()));
console.log('   Expected 0.5.');

console.log('\nPage errors:', errors.length ? errors : 'none');
await browser.close();
