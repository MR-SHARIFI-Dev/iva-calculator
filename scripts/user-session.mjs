// Full user-session simulation against v3.3.1: scientific flows, errors,
// history, persistence, reloads and hostile storage environments.
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`PAGE ERROR: ${e.message}`));

await page.goto(`${BASE}/?app-version=3.3.1`);
const click = (name) => page.getByRole('button', { name, exact: true }).click();
const press = (key) => page.keyboard.press(key);
const snap = async () => ({
  expr: (await page.locator('#expression').textContent()).trim(),
  res: (await page.locator('#result').textContent()).trim(),
  msg: (await page.locator('#message').textContent()).trim()
});
const check = (name, actual, expected) => {
  const ok = actual === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${JSON.stringify(actual)}${ok ? '' : `, expected ${JSON.stringify(expected)}`}`);
};

// 1. Trig in DEG and RAD
await click('sin'); await click('3'); await click('0'); await click('Calculate');
check('sin(30) in DEG', (await snap()).res, '0.5');
await page.locator('#angle-mode').click(); // now RAD
check('toggle shows RAD', await page.locator('#angle-mode').textContent(), 'RAD');
await click('AC'); await click('sin'); await click('3'); await click('0'); await click('Calculate');
check('sin(30) in RAD', (await snap()).res, '-0.988031624093');
await page.locator('#angle-mode').click(); // back to DEG

// 2. tan(90) error path
await click('AC'); await click('tan'); await click('9'); await click('0'); await click('Calculate');
check('tan(90) error', (await snap()).msg, 'tan is undefined at this angle');

// 3. Division by zero
await click('AC'); await click('8'); await click('Divide'); await click('0'); await click('Calculate');
check('8/0 error', (await snap()).msg, 'Division by zero');

// 4. Parentheses + precedence
await click('AC');
await press('('); await press('2'); await press('+'); await press('3'); await press(')');
await press('*'); await press('4'); await press('Enter');
check('(2+3)*4', (await snap()).res, '20');

// 5. Right-associative power
await click('AC');
await press('2'); await press('^'); await press('3'); await press('^'); await press('2'); await press('Enter');
check('2^3^2', (await snap()).res, '512');

// 6. Backspace deletes whole function token
await click('AC'); await click('√'); await click('9');
await page.locator('[data-action="backspace"]').click();
check('backspace removes digit', (await snap()).expr, '√(');
await page.locator('[data-action="backspace"]').click();
check('backspace removes sqrt( token', (await snap()).expr, '0');

// 7. 5! * 2
await click('AC'); await click('5'); await click('x!'); await click('Multiply'); await click('2'); await click('Calculate');
check('5!*2', (await snap()).res, '240');

// 8. sqrt of negative → friendly error
await click('AC'); await click('√'); await click('Subtract'); await click('1'); await click('Calculate');
check('sqrt(-1) error', (await snap()).msg, 'sqrt is undefined for this value');

// 9. History grows and click restores
await click('AC'); await press('1'); await press('2'); await press('+'); await press('8'); await press('Enter');
const historyCount = await page.locator('#history .history-item').count();
check('history has entries', historyCount >= 2, true);
await page.locator('#history .history-item').first().click();
check('history click restores expression', (await snap()).expr, '12 + 8');

// 10. Reload keeps history + Ans and theme
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(300);
const restored = await page.locator('#history .history-item').count();
check('history persists after reload', restored >= 2, true);
await page.locator('.key[data-value="ans"]').click();
check('Ans restores from history', (await snap()).res, '20');

// 11. Clear history button
await click('Clear');
check('clear history empties list', await page.locator('#history .history-item').count(), 0);

// 12. Keyboard Escape clears
await press('4'); await press('Escape');
check('Esc clears', (await snap()).expr, '0');

// 13. Long-held key does not repeat (event.repeat guard)
await page.keyboard.down('9'); await page.waitForTimeout(400); await page.keyboard.up('9');
check('held 9 inserts once', (await snap()).expr, '9');

// 14. Hostile storage: localStorage throws (sandboxed iframe / private mode)
const hostile = await browser.newPage();
const hostileErrors = [];
hostile.on('pageerror', (e) => hostileErrors.push(e.message));
await hostile.addInitScript(() => {
  Object.defineProperty(window, 'localStorage', {
    get() { throw new Error('SecurityError: storage denied'); }
  });
});
await hostile.goto(`${BASE}/?app-version=3.3.1`);
await hostile.getByRole('button', { name: '2', exact: true }).click();
await hostile.getByRole('button', { name: 'Add' }).click();
await hostile.getByRole('button', { name: '2', exact: true }).click();
await hostile.getByRole('button', { name: 'Calculate' }).click();
const hostileResult = (await hostile.locator('#result').textContent()).trim();
check('works when localStorage is denied', hostileResult, '4');
await hostile.locator('#theme').click().catch(() => {});
await hostile.getByRole('button', { name: 'AC', exact: true }).click();
check('no page errors under denied storage', hostileErrors.length, 0);

// 15. Mobile viewport sanity
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${BASE}/?app-version=3.3.1`);
await mobile.getByRole('button', { name: 'sin', exact: true }).click();
await mobile.getByRole('button', { name: '9', exact: true }).click();
await mobile.getByRole('button', { name: '0', exact: true }).click();
await mobile.getByRole('button', { name: 'Calculate' }).click();
check('mobile sin(90)', (await mobile.locator('#result').textContent()).trim(), '1');

console.log('\nPage errors on main page:', errors.length ? errors : 'none');
await browser.close();
