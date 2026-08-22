# 📦 Installation / نصب

> 🇬🇧 How to run, build, and install IVA Calculator Pro.
> 🇮🇷 نحوهٔ اجرا، build و نصب IVA Calculator Pro.

---

## 🇬🇧 English

### Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Node.js** | `>= 20.19` (CI uses 22) | Running the test suite and ESLint |
| **npm** | comes with Node | Installing dev dependencies |
| **Python 3** | any recent version | The zero-config local web server (`npm run serve`) |

> The app itself needs **no build step and no runtime dependencies**. Node and npm are only used for the developer toolchain (tests, linter, browser automation). You can also serve the folder with any static server.

### Quick start

```bash
# 1. Clone
git clone https://github.com/Kourosh242/iva-calculator.git
cd iva-calculator

# 2. Install dev tooling (Playwright + ESLint)
npm install

# 3. Serve locally on http://localhost:4173
npm run serve
```

Open **http://localhost:4173** in your browser.

### Why a local server?

You *can* open `index.html` directly with `file://`, but two things need a real HTTP origin:

1. **The service worker** — browsers refuse to register a service worker from `file://`, so offline/PWA support is disabled.
2. **ES modules** — `src/app.js` loads the other modules via `import`. Some browsers restrict module loading over `file://`.

`npm run serve` runs `python3 -m http.server 4173`, which is enough for both.

### Verifying it works

```bash
npm run verify     # lint + unit tests + Playwright e2e
```

If Playwright complains it can't find a browser, install it once:

```bash
npx playwright install chromium
```

### Installing as an app (PWA)

1. Serve or visit the deployed site over **https** (required for service workers).
2. In Chrome or Edge, click the **install** icon in the address bar (or *Menu → Install IVA Calculator Pro*).
3. The app launches in its own window / home-screen icon and runs **fully offline**.

The service worker pre-caches the app shell on first load. Subsequent visits are **network-first** (you always get the latest deployed version when online), with the cached shell used automatically when offline.

### Deploying

The repository is a static site — the root folder *is* the build output. Any static host works:

- **GitHub Pages** — already configured via [`.github/workflows/deploy.yml`](https://github.com/Kourosh242/iva-calculator/blob/main/.github/workflows/deploy.yml). Pushing to `main` runs tests, then publishes the repo root to Pages.
- **Netlify / Vercel / Cloudflare Pages** — point the host at the repo root; no build command is needed.
- **Any static server** — `npm run serve`, or upload the folder.

### npm scripts

| Script | What it does |
|---|---|
| `npm run serve` | Serve the folder on `http://localhost:4173` |
| `npm test` | Node unit tests (`node --test tests/*.test.js`) |
| `npm run test:e2e` | Playwright browser tests |
| `npm run lint` | ESLint (`src`, `tests`, `sw.js`, config) |
| `npm run verify` | `lint && test && test:e2e` |

---

## 🇮🇷 فارسی

### پیش‌نیازها

| ابزار | نسخه | چرا |
|---|---|---|
| **Node.js** | `>= 20.19` (CI از ۲۲ استفاده می‌کند) | اجرای مجموعهٔ تست و ESLint |
| **npm** | همراه Node | نصب وابستگی‌های توسعه |
| **Python 3** | هر نسخهٔ اخیر | سرور وب محلی بدون‌پیکربندی (`npm run serve`) |

> خود برنامه **بدون مرحلهٔ build و بدون وابستگی زمان اجرا** است. Node و npm فقط برای ابزار توسعه (تست‌ها، لینتر، اتوماسیون مرورگر) استفاده می‌شوند. می‌توانید پوشه را با هر سرور استاتیک هم سرو کنید.

### شروع سریع

```bash
# ۱. کلون
git clone https://github.com/Kourosh242/iva-calculator.git
cd iva-calculator

# ۲. نصب ابزار توسعه (Playwright + ESLint)
npm install

# ۳. سرو روی http://localhost:4173
npm run serve
```

آدرس **http://localhost:4173** را در مرورگر باز کنید.

### چرا سرور محلی؟

می‌توانید `index.html` را مستقیماً با `file://` باز کنید، اما دو چیز به یک مبدأ HTTP واقعی نیاز دارند:

۱. **سرویس‌ورکر** — مرورگرها از `file://` سرویس‌ورکر ثبت نمی‌کنند، پس پشتیبانی آفلاین/PWA غیرفعال می‌شود.
۲. **ماژول‌های ES** — `src/app.js` سایر ماژول‌ها را با `import` بارگذاری می‌کند. برخی مرورگرها بارگذاری ماژول روی `file://` را محدود می‌کنند.

`npm run serve` دستور `python3 -m http.server 4173` را اجرا می‌کند که برای هر دو کافی است.

### تأیید کارکرد

```bash
npm run verify     # lint + تست واحد + e2e در Playwright
```

اگر Playwright گفت مرورگر پیدا نمی‌شود، یک‌بار نصبش کنید:

```bash
npx playwright install chromium
```

### نصب به‌عنوان اپلیکیشن (PWA)

۱. سایت را روی **https** سرو یا باز کنید (برای سرویس‌ورکر الزامی است).
۲. در Chrome یا Edge روی آیکون **install** در نوار آدرس کلیک کنید (یا *Menu → Install IVA Calculator Pro*).
۳. برنامه در پنجره/آیکون صفحهٔ خانهٔ خودش باز می‌شود و **کاملاً آفلاین** اجرا می‌شود.

سرویس‌ورکر در اولین بارگذاری، پوستهٔ برنامه را پیش‌کش می‌کند. بازدیدهای بعدی **network-first** هستند (در حالت آنلاین همیشه آخرین نسخهٔ مستقر را می‌گیرید) و هنگام آفلاین بودن به‌صورت خودکار از پوستهٔ کش‌شده استفاده می‌کنند.

### استقرار

این مخزن یک سایت استاتیک است — پوشهٔ ریشه **خروجی build** است. هر میزبان استاتیک کار می‌کند:

- **GitHub Pages** — از طریق [`.github/workflows/deploy.yml`](https://github.com/Kourosh242/iva-calculator/blob/main/.github/workflows/deploy.yml) پیکربندی شده است. push به `main` تست‌ها را اجرا و سپس ریشهٔ مخزن را روی Pages منتشر می‌کند.
- **Netlify / Vercel / Cloudflare Pages** — میزبان را به ریشهٔ مخزن اشاره دهید؛ نیازی به دستور build نیست.
- **هر سرور استاتیک** — `npm run serve` یا آپلود پوشه.

### اسکریپت‌های npm

| اسکریپت | کارکرد |
|---|---|
| `npm run serve` | سرو پوشه روی `http://localhost:4173` |
| `npm test` | تست‌های واحد Node |
| `npm run test:e2e` | تست‌های مرورگری Playwright |
| `npm run lint` | ESLint |
| `npm run verify` | `lint && test && test:e2e` |

---

<div align="center">

<sub>⬅️ [Features](Features.md) · [Architecture](Architecture.md) ➡️</sub>

</div>
