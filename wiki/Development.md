# 🛠 Development / توسعه

> 🇬🇧 Scripts, tooling, and a guide to working on the codebase.
> 🇮🇷 اسکریپت‌ها، ابزارها و راهنمای کار روی کدبیس.

---

## 🇬🇧 English

### Getting set up

```bash
git clone https://github.com/Kourosh242/iva-calculator.git
cd iva-calculator
npm install                 # Playwright + ESLint (devDependencies only)
npx playwright install chromium   # one-time, for e2e tests
```

There are **no runtime dependencies** — `package.json` lists only `devDependencies`. The app runs unchanged from the repo root; there is no compile/build step.

### npm scripts

| Command | What it does |
|---|---|
| `npm run serve` | Serve the folder on `http://localhost:4173` (Python's http.server) |
| `npm test` | Node unit tests (`node --test tests/*.test.js`) |
| `npm run test:e2e` | Playwright browser tests (boots its own server) |
| `npm run lint` | ESLint over `src`, `tests`, `sw.js`, `playwright.config.js` |
| `npm run verify` | `lint && test && test:e2e` — the full gate run by CI |

### Project conventions

- **ES modules everywhere.** `package.json` sets `"type": "module"`. Use `import`/`export`.
- **No `eval` / `Function`.** Enforced by ESLint as hard errors. The parser is the only evaluation path.
- **Pure core, thin shell.** Keep DOM access in `app.js`; keep `parser.js`, `input.js`, `format.js` free of side effects so they stay unit-testable.
- **Strict equality** (`===`) is required by the linter.
- **No unused variables** (except parameters named `_...`).

### The version constant

Version `3.3.1` appears in several places that must stay in sync. The `release.test.js` suite guards this — it fails if the HTML references a stale asset version or the service worker loses its upgrade logic. When bumping a version, update all of:

1. `package.json` → `"version"`
2. `index.html` → title, `?v=` query strings, manifest link
3. `sw.js` → `const VERSION` and the `ASSETS` list
4. `manifest.webmanifest` → theme colors (if palette changes)
5. `tests/e2e.spec.js` and `tests/release.test.js` → the expected version
6. `scripts/*.mjs` → the `?app-version=` query strings
7. Add a `release/vX.Y.Z.md` note and a [Changelog](Changelog.md) entry

### Running the QA simulations

The `scripts/` folder contains throwaway Playwright scripts used during hardening. They drive the app like a real user and print what happens:

```bash
npm run serve &                 # start the server in the background
node scripts/bug-hunt.mjs       # exercise the known tricky scenarios
node scripts/user-session.mjs   # full session: trig, errors, history, reload
node scripts/offline-test.mjs   # verify the service worker + offline calc
node scripts/screenshot.mjs     # regenerate theme screenshots into assets/
```

These are not part of the test suite — they're exploratory tools. Keep them around as living regression checks.

### Debugging tips

- **Live preview not updating?** Check the browser console — a thrown `CalculatorError` during typing is expected and swallowed, but a *different* error would surface there.
- **PWA won't update after a deploy?** The service worker is network-first; a hard reload or closing all tabs forces it. The `activate` handler also navigates stale tabs to the new version.
- **Tests can't find Chromium?** Run `npx playwright install chromium` (or `--with-deps` on Linux CI).

### Linting rules of note

From [`eslint.config.js`](https://github.com/Kourosh242/iva-calculator/blob/main/eslint.config.js):

- `no-eval: error`, `no-new-func: error` — the safety backbone.
- `no-undef: error`, `eqeqeq: always`, `no-implicit-globals: error`.
- DOM globals are declared per environment (`document`, `window`, …) so the core modules lint cleanly without a browser.
- The service worker is linted in a separate script-type environment with its own globals (`self`, `caches`, …).

---

## 🇮🇷 فارسی

### راه‌اندازی

```bash
git clone https://github.com/Kourosh242/iva-calculator.git
cd iva-calculator
npm install                 # Playwright + ESLint (فقط devDependencies)
npx playwright install chromium   # یک‌بار، برای تست‌های e2e
```

هیچ **وابستگی زمان اجرا** وجود ندارد — `package.json` فقط `devDependencies` دارد. برنامه بدون تغییر از ریشهٔ مخزن اجرا می‌شود؛ هیچ مرحلهٔ compile/build وجود ندارد.

### اسکریپت‌های npm

| دستور | کارکرد |
|---|---|
| `npm run serve` | سرو پوشه روی `http://localhost:4173` (http.server پایتون) |
| `npm test` | تست‌های واحد Node |
| `npm run test:e2e` | تست‌های مرورگری Playwright (سرور خودش را بوت می‌کند) |
| `npm run lint` | ESLint روی `src`، `tests`، `sw.js`، `playwright.config.js` |
| `npm run verify` | `lint && test && test:e2e` — همان دریچهٔ کامل که CI اجرا می‌کند |

### قراردادهای پروژه

- **ماژول‌های ES در همه‌جا.** `package.json` مقدار `"type": "module"` دارد. از `import`/`export` استفاده کنید.
- **بدون `eval` / `Function`.** توسط ESLint به‌عنوان خطای سخت اعمال می‌شود. پارسر تنها مسیر ارزیابی است.
- **هستهٔ خالص، پوستهٔ نازک.** دسترسی به DOM را در `app.js` نگه دارید؛ `parser.js`، `input.js`، `format.js` را بدون عارضه جانبی نگه دارید تا قابل تست واحد بمانند.
- **برابری سخت‌گیرانه** (`===`) توسط لینتر الزامی است.
- **بدون متغیر استفاده‌نشده** (به‌جز پارامترهای نام‌گذاری‌شده `_...`).

### ثابت نسخه

نسخهٔ `3.3.1` در چندین مکان ظاهر می‌شود که باید همگام بمانند. مجموعهٔ `release.test.js` این را محافظت می‌کند — اگر HTML به نسخهٔ دارایی قدیمی ارجاع دهد یا سرویس‌ورکر منطق به‌روزرسانی‌اش را از دست بدهد، شکست می‌خورد. هنگام ارتقای نسخه، همهٔ این‌ها را به‌روز کنید:

۱. `package.json` → `"version"`
۲. `index.html` → عنوان، رشته‌های کوئری `?v=`، لینک مانیفست
۳. `sw.js` → `const VERSION` و فهرست `ASSETS`
۴. `manifest.webmanifest` → رنگ‌های تم (اگر پالت تغییر کند)
۵. `tests/e2e.spec.js` و `tests/release.test.js` → نسخهٔ مورد انتظار
۶. `scripts/*.mjs` → رشته‌های کوئری `?app-version=`
۷. یک یادداشت `release/vX.Y.Z.md` و یک مدخل [تاریخچه](Changelog.md) اضافه کنید

### اجرای شبیه‌سازی‌های QA

پوشهٔ `scripts/` شامل اسکریپت‌های یک‌بارمصرف Playwright است که هنگام سخت‌سازی استفاده شده‌اند. این‌ها برنامه را مثل کاربر واقعی راه می‌اندازند و می‌چاپند چه اتفاقی می‌افتد:

```bash
npm run serve &                 # سرور را در پس‌زمینه شروع کنید
node scripts/bug-hunt.mjs       # سناریوهای دشوار شناخته‌شده را امتحان کنید
node scripts/user-session.mjs   # جلسهٔ کامل: مثلثات، خطاها، تاریخچه، ریلود
node scripts/offline-test.mjs   # سرویس‌ورکر + محاسبهٔ آفلاین را تأیید کنید
node scripts/screenshot.mjs     # اسکرین‌شات‌های تم را در assets/ بازتولید کنید
```

این‌ها بخشی از مجموعهٔ تست نیستند — ابزارهای اکتشافی هستند. آن‌ها را به‌عنوان بررسی‌های رگرسیون زنده نگه دارید.

### نکات دیباگ

- **پیش‌نمایش زنده به‌روز نمی‌شود؟** کنسول مرورگر را بررسی کنید — یک `CalculatorError` پرتاب‌شده هنگام تایپ طبیعی و بلعیده‌شده است، اما یک خطای *متفاوت* آنجا ظاهر می‌شود.
- **PWA بعد از استقرار به‌روز نمی‌شود؟** سرویس‌ورکر network-first است؛ یک reload سخت یا بستن همهٔ زبانه‌ها آن را اجبار می‌کند. مدیریت `activate` همچنین زبانه‌های قدیمی را به نسخهٔ جدید هدایت می‌کند.
- **تست‌ها Chromium را پیدا نمی‌کنند؟** `npx playwright install chromium` را اجرا کنید (یا `--with-deps` روی CI لینوکس).

### قوانین لینت قابل‌توجه

از [`eslint.config.js`](https://github.com/Kourosh242/iva-calculator/blob/main/eslint.config.js):

- `no-eval: error`، `no-new-func: error` — ستون فقرات امنیتی.
- `no-undef: error`، `eqeqeq: always`، `no-implicit-globals: error`.
- globals مربوط به DOM به ازای محیط اعلام شده‌اند (`document`، `window`، …) تا ماژول‌های هسته بدون مرورگر تمیز لینت شوند.
- سرویس‌ورکر در یک محیط script-type جداگانه با globals خودش (`self`، `caches`، …) لینت می‌شود.

---

<div align="center">

<sub>⬅️ [Keyboard Shortcuts](Keyboard-Shortcuts.md) · [Testing](Testing.md) ➡️</sub>

</div>
