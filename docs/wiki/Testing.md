# ✅ Testing / تست‌ها

> 🇬🇧 What is tested, how, and how to run it.
> 🇮🇷 چه چیزی تست می‌شود، چگونه، و چطور اجرا شود.

---

## 🇬🇧 English

The project has **three layers** of automated tests, all dependency-light:

1. **Unit tests** — the pure modules, run with Node's built-in `node:test`.
2. **Browser (e2e) tests** — real Chromium interactions, run with Playwright.
3. **Integrity tests** — version/asset consistency, run as part of the unit suite.

### Running the suite

```bash
npm test               # unit + integrity tests (no browser needed)
npm run test:e2e       # Playwright browser tests (needs npx playwright install)
npm run lint           # ESLint — no-eval/no-new-func are errors
npm run verify         # lint + unit + e2e (the CI gate)
```

### Unit tests (`tests/*.test.js`)

Run with `node --test tests/*.test.js`. These import the **pure** modules directly — no DOM, no browser.

#### `parser.test.js`

Exercises [`calculate()`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) across the full surface:

- **Precedence & parentheses** — `2 + 3 * 4 = 14`, `(2+3)*4 = 20`, `2^3^2 = 512`, `-2^2 = -4`.
- **Decimals & scientific notation** — `.5 + 1.5`, `2E3`, `2E-3`, and `2E` (Euler, since no digit follows).
- **The `e`/`E` rule** — `2e3`, `2e+3`, `2e-3`, `2e` all treat lowercase `e` as Euler.
- **Constants & implicit multiplication** — `2pi`, `3(4+1)`, `2e`.
- **Scientific functions & angle modes** — `sin(30)=0.5`, `sin(180)=0`, `cos(90)=0`, `sin(pi/2)` in RAD, `sqrt(81)+log(100)+ln(e)=12`, `abs(-4)+round(2.6)=7`.
- **Every exposed operation** — an exact-cases table covering arithmetic, powers, factorial, percent, sqrt, abs, logs, rounding, all trig, all inverse trig, `exp(1)=e`, and `ans*2`.
- **Unsafe / invalid inputs** — `2/0`, `(-1)!`, `process.exit()`, `sqrt(-1)`, `tan(90)`, `log(0)`, `2 +` all throw `CalculatorError`.

#### `input.test.js`

Exercises the input rules in [`input.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/input.js):

- Strict ignoring of consecutive binary operators (single + a 10,000-iteration and 50,000-iteration stress loop).
- Preserving valid unary minus (`-`, after `(`, after `^`).
- Negative exponents (`2^-`) and strict operators around them.
- Duplicate-decimal and postfix guards.
- Decimals blocked inside scientific notation.
- Implicit multiplication blocked after postfix operators (`5!3`, `50%3`).
- `startsNewExpression` coverage for digits, constants, and every function.
- Parenthesis completion and validation.
- Whole-token backspace for functions and named values.
- A realistic end-to-end button sequence that yields a valid, calculable expression.

#### `format.test.js`

Exercises [`format.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/format.js):

- **Round-trip property** — `calculate(formatNumber(x)) ≈ x` for a range including `0`, `±1e20`, `2.5e-8`, `0.1+0.2`, `123456789012`, and thresholds `3e-9`/`5e12`.
- **Uppercase `E`** in scientific output so Euler stays unambiguous (`1E+20`, `2.5E-10`, `-1E+15`).
- **`prettyExpression`** rendering of Euler, exponents, unary minus, `π`, `√`, and partial inputs.

#### `release.test.js`

Integrity checks guarding the release process:

- The HTML references **only versioned, current** assets (`app.js?v=3.3.1`, `style.css?v=3.3.1`) and shows the build version in the brand label.
- The service worker has an explicit, non-stale upgrade path (`VERSION`, `skipWaiting`, `clients.claim`, `caches.delete`, `client.navigate`, network-first `fetch`).

### Browser tests (`tests/e2e.spec.js`)

Real Chromium, driven by Playwright, against the served app. They verify behavior that unit tests *can't* — DOM, keyboard, persistence, theming:

- Repeated operators are blocked through **both** mouse and 1,000 physical key presses.
- `=` finalizes a scientific function, collapses the expression, and records history.
- The light theme keeps operator controls visible and **persists** across reload.
- The `e` key means Euler (never scientific notation) end-to-end.
- Negative exponents work via buttons **and** keyboard.
- Digits/constants after `!`/`%` are ignored.
- `Space` does not re-fire the focused key.
- Huge formatted results (`1E+21`) survive continuation.

The Playwright config boots its own `python3 -m http.server` on `127.0.0.1:4173` with `serviceWorkers: 'allow'`, so the suite is self-contained.

### CI

[`.github/workflows/deploy.yml`](https://github.com/Kourosh242/iva-calculator/blob/main/.github/workflows/deploy.yml) runs `npm ci`, lint, unit tests, installs Chromium with `--with-deps`, runs e2e, and only then builds/deploys to GitHub Pages. A failure at any stage halts the deploy.

### Adding a test

- **New parser behavior** → add a case to `parser.test.js` (mirrors the existing exact-cases table).
- **New input rule** → add a case to `input.test.js`.
- **New user-visible behavior** → add an e2e test in `e2e.spec.js`.

Every new operator or function **must** come with parser tests (see [Contributing](Contributing.md)).

---

## 🇮🇷 فارسی

این پروژه **سه لایه** تست خودکار دارد که همگی سبک و کم‌وابستگی هستند:

۱. **تست‌های واحد** — ماژول‌های خالص، با `node:test` داخلی Node.
۲. **تست‌های مرورگری (e2e)** — تعاملات واقعی Chromium، با Playwright.
۳. **تست‌های یکپارچگی** — سازگاری نسخه/دارایی، به‌عنوان بخشی از مجموعهٔ واحد.

### اجرای مجموعه

```bash
npm test               # تست‌های واحد + یکپارچگی (بدون نیاز به مرورگر)
npm run test:e2e       # تست‌های مرورگری Playwright (نیازمند npx playwright install)
npm run lint           # ESLint — no-eval/no-new-func خطا هستند
npm run verify         # lint + واحد + e2e (دریچهٔ CI)
```

### تست‌های واحد (`tests/*.test.js`)

با `node --test tests/*.test.js` اجرا می‌شوند. این‌ها مستقیماً ماژول‌های **خالص** را import می‌کنند — بدون DOM، بدون مرورگر.

#### `parser.test.js`

[`calculate()`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) را در کل سطح ممیزی می‌کند:

- **تقدم و پرانتز** — `2 + 3 * 4 = 14`، `(2+3)*4 = 20`، `2^3^2 = 512`، `-2^2 = -4`.
- **اعشار و نماد علمی** — `.5 + 1.5`، `2E3`، `2E-3` و `2E` (اویلر، چون رقم‌ای در پی نیست).
- **قانون `e`/`E`** — `2e3`، `2e+3`، `2e-3`، `2e` همگی `e` کوچک را به‌عنوان اویلر در نظر می‌گیرند.
- **ثابت‌ها و ضرب ضمنی** — `2pi`، `3(4+1)`، `2e`.
- **توابع علمی و حالت‌های زاویه** — `sin(30)=0.5`، `sin(180)=0`، `cos(90)=0`، `sin(pi/2)` در RAD، `sqrt(81)+log(100)+ln(e)=12`، `abs(-4)+round(2.6)=7`.
- **هر عملیات در معرض نمایش** — یک جدول موارد دقیق شامل حساب، توان، فاکتوریل، درصد، sqrt، abs، لگاریتم‌ها، گردکردن، کل مثلثات، کل مثلثات معکوس، `exp(1)=e` و `ans*2`.
- **ورودی‌های ناامن/نامعتبر** — `2/0`، `(-1)!`، `process.exit()`، `sqrt(-1)`، `tan(90)`، `log(0)`، `2 +` همگی `CalculatorError` پرتاب می‌کنند.

#### `input.test.js`

قوانین ورودی در [`input.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/input.js) را ممیزی می‌کند:

- نادیده‌گیری سخت‌گیرانهٔ عملگرهای دوتایی متوالی (تکی + یک حلقهٔ ۱۰,۰۰۰تایی و ۵۰,۰۰۰تایی).
- حفظ منفی یکانی معتبر (`-`، بعد از `(`، بعد از `^`).
- توان‌های منفی (`2^-`) و عملگرهای سخت‌گیرانه دور آن‌ها.
- محافظ‌های اعشار-مضاعف و پسوندی.
- مسدودشدن اعشار داخل نماد علمی.
- مسدودشدن ضرب ضمنی بعد از عملگرهای پسوندی (`5!3`، `50%3`).
- پوشش `startsNewExpression` برای ارقام، ثابت‌ها و هر تابع.
- تکمیل و اعتبارسنجی پرانتز.
- Backspace توکن‌کامل برای توابع و مقادیر نام‌دار.
- یک دنبالهٔ واقعی دکمه‌ها که یک عبارت معتبر و قابل‌محاسبه می‌سازد.

#### `format.test.js`

[`format.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/format.js) را ممیزی می‌کند:

- **ویژگی رفت‌وبرگشت** — `calculate(formatNumber(x)) ≈ x` برای بازه‌ای شامل `0`، `±1e20`، `2.5e-8`، `0.1+0.2`، `123456789012` و آستانه‌های `3e-9`/`5e12`.
- **`E` بزرگ** در خروجی علمی تا اویلر یکپارچه بماند (`1E+20`، `2.5E-10`، `-1E+15`).
- **رندر `prettyExpression`** از اویلر، توان‌ها، منفی یکانی، `π`، `√` و ورودی‌های جزئی.

#### `release.test.js`

بررسی‌های یکپارچگی که فرآیند انتشار را محافظت می‌کنند:

- HTML فقط به دارایی‌های **نسخه‌دار و فعلی** ارجاع می‌دهد (`app.js?v=3.3.1`، `style.css?v=3.3.1`) و نسخهٔ build را در برچسب برند نشان می‌دهد.
- سرویس‌ورکر یک مسیر به‌روزرسانی صریح و غیر‌قدیمی دارد (`VERSION`، `skipWaiting`، `clients.claim`، `caches.delete`، `client.navigate`، `fetch` از نوع network-first).

### تست‌های مرورگری (`tests/e2e.spec.js`)

Chromium واقعی، هدایت‌شده با Playwright، علیه برنامهٔ سرو‌شده. این‌ها رفتارهایی را بررسی می‌کنند که تست‌های واحد *نمی‌توانند* — DOM، صفحه‌کلید، ماندگاری، تم:

- عملگرهای تکراری از **هر دو** مسیر ماوس و ۱,۰۰۰ فشردن فیزیکی مسدود می‌شوند.
- `=` یک تابع علمی را نهایی، عبارت را فرومی‌کاهد و تاریخچه را ثبت می‌کند.
- تم روشن کنترل‌های عملگر را مرئی نگه می‌دارد و در ریلود **ماندگار** است.
- کلید `e` سرتاسری به معنای اویلر است (هرگز نماد علمی).
- توان‌های منفی با دکمه‌ها **و** صفحه‌کلید کار می‌کنند.
- ارقام/ثابت‌ها بعد از `!`/`%` نادیده گرفته می‌شوند.
- `Space` دکمهٔ فوکوس‌شده را دوباره فعال نمی‌کند.
- نتایج قالب‌شدهٔ بزرگ (`1E+21`) در ادامه دوام می‌آورند.

پیکربندی Playwright `python3 -m http.server` خودش را روی `127.0.0.1:4173` با `serviceWorkers: 'allow'` بوت می‌کند، پس مجموعه خودکفاست.

### CI

[`.github/workflows/deploy.yml`](https://github.com/Kourosh242/iva-calculator/blob/main/.github/workflows/deploy.yml) دستورات `npm ci`، lint، تست‌های واحد، نصب Chromium با `--with-deps`، e2e را اجرا و سپس build/deploy به GitHub Pages می‌کند. شکست در هر مرحله، استقرار را متوقف می‌کند.

### افزودن تست

- **رفتار جدید پارسر** → موردی به `parser.test.js` اضافه کنید (آینهٔ جدول موارد دقیق موجود).
- **قانون ورودی جدید** → موردی به `input.test.js` اضافه کنید.
- **رفتار جدید قابل‌مشاهده برای کاربر** → یک تست e2e در `e2e.spec.js` اضافه کنید.

هر عملگر یا تابع جدید **باید** با تست‌های پارسر همراه شود (به [مشارکت](Contributing.md) مراجعه کنید).

---

<div align="center">

<sub>⬅️ [Development](Development.md) · [Contributing](Contributing.md) ➡️</sub>

</div>
