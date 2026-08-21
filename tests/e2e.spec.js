import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/?app-version=3.3.0');
  await expect(page.locator('.brand small')).toContainText('v3.3.0');
});

test('blocks repeated operators through mouse and keyboard input', async ({ page }) => {
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Add' }).click();

  for (const name of ['Add', 'Subtract', 'Multiply', 'Divide']) {
    await expect(page.getByRole('button', { name })).toBeDisabled();
  }

  // Physical keyboard presses are a second independent input path.
  for (let index = 0; index < 1_000; index += 1) await page.keyboard.press('*');
  await expect(page.locator('#expression')).toHaveText('2 + ');

  await page.getByRole('button', { name: '3', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Multiply' })).toBeEnabled();
  await expect(page.locator('#expression')).toHaveText('2 + 3');
});

test('equals finalizes a scientific function and collapses the expression', async ({ page }) => {
  await page.getByRole('button', { name: 'sin', exact: true }).click();
  await page.getByRole('button', { name: '3', exact: true }).click();
  await page.getByRole('button', { name: '0', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate' }).click();

  await expect(page.locator('#expression')).toHaveText('0.5');
  await expect(page.locator('#result')).toHaveText('0.5');
  await expect(page.locator('#message')).toHaveText('Result');
  await expect(page.locator('#history')).toContainText('sin(30)');
});

test('light theme keeps operator controls visible and persists', async ({ page }) => {
  const theme = page.locator('#theme');
  const currentTheme = await page.locator('html').getAttribute('data-theme');
  if (currentTheme !== 'light') await theme.click();

  const operator = page.getByRole('button', { name: 'Add' });
  const colors = await operator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor, opacity: style.opacity };
  });
  expect(colors.color).not.toBe(colors.background);
  expect(colors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(colors.opacity).toBe('0.58'); // disabled at the start, but still visibly styled

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('the e key means Euler, never exponent notation', async ({ page }) => {
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'e', exact: true }).click();
  await page.getByRole('button', { name: '3', exact: true }).click();
  await expect(page.locator('#result')).toHaveText('16.3096909708');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#expression')).toHaveText('16.3096909708');
  await expect(page.locator('#history')).toContainText('2 × e × 3');
});

test('supports negative exponents through buttons and keyboard', async ({ page }) => {
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'xʸ' }).click();
  await expect(page.getByRole('button', { name: 'Subtract' })).toBeEnabled();
  await page.getByRole('button', { name: 'Subtract' }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#expression')).toHaveText('0.25');

  await page.getByRole('button', { name: 'AC', exact: true }).click();
  await page.keyboard.press('3'); await page.keyboard.press('^');
  await page.keyboard.press('-'); await page.keyboard.press('2');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#expression')).toHaveText('0.111111111111');
});

test('digits and constants after factorial or percent are ignored', async ({ page }) => {
  await page.keyboard.press('5');
  await page.getByRole('button', { name: 'x!' }).click();
  await page.keyboard.press('3');
  await expect(page.locator('#expression')).toHaveText('5!');
});

test('Space does not re-fire the focused key', async ({ page }) => {
  await page.getByRole('button', { name: '7', exact: true }).click();
  await page.keyboard.press(' ');
  await expect(page.locator('#expression')).toHaveText('7');
});

test('huge formatted results survive continuation', async ({ page }) => {
  for (let index = 0; index < 20; index += 1) await page.keyboard.press('9');
  await page.getByRole('button', { name: 'Multiply' }).click();
  await page.keyboard.press('1'); await page.keyboard.press('0');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#expression')).toHaveText('1E+21');
  await expect(page.locator('#result')).toHaveText('1E+21');
  await page.keyboard.press('+');
  await page.keyboard.press('1');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('#expression')).toHaveText('1E+21');
  await expect(page.locator('#result')).toHaveText('1E+21');
});
