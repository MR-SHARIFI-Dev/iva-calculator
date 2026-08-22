# 🔐 Privacy & Security / حریم خصوصی و امنیت

> 🇬🇧 The data model and the security model, in plain language.
> 🇮🇷 مدل داده و مدل امنیت، به زبان ساده.

---

## 🇬🇧 English

Privacy and safety are the two reasons this project exists. This page explains exactly what data is stored, where it goes, and why the calculator cannot be used to run code.

### TL;DR

- **Zero network calls for your data.** Expressions, results, and history never leave your device.
- **No `eval()`, no `Function()`.** A hand-written parser is the only evaluation path.
- **Storage is defensive.** The app keeps working even when `localStorage` is blocked, and stored data is validated on read.

### The data model

Everything is stored in the browser's **`localStorage`**, scoped to the origin:

| Key | Contents | Purpose | When cleared |
|---|---|---|---|
| `iva-history` | JSON array (≤20 entries) of `{ expression, result, time }` | The history panel | "Clear" button, or browser data clear |
| `iva-theme` | `'light' \| 'dark'` | Remembered theme | Browser data clear |
| `iva-angle` | `'deg' \| 'rad'` | Remembered angle mode | Browser data clear |

That's the **entire** data footprint. No accounts, no IDs, no analytics, no cookies set by the app.

> **Service worker cache.** `sw.js` caches the *app shell* (HTML/JS/CSS/icons) so the app works offline. That cache holds only static files you already downloaded — never your calculation data.

### The network model

- The app loads from its host (GitHub Pages or your own server) and Google Fonts.
- **No outbound requests carry your data.** Calculations are performed in-page; nothing about an expression or result is ever sent anywhere.
- The service worker is **network-first**: it prefers fresh files from the network but falls back to cache offline. It does not exfiltrate data.

You can verify this yourself: open your browser's DevTools → **Network** tab, perform calculations, and confirm there are no requests that include your input.

### The security model

The core question for any calculator that takes free text: *can a crafted input execute code?* For IVA Calculator Pro, the answer is **no**, for several reinforcing reasons:

1. **No string-evaluation primitive.** There is no `eval`, no `new Function`, no `setTimeout(string)`, no dynamic `import` of user input. ESLint enforces `no-eval` and `no-new-func` as hard `error`s.
2. **A whitelist, not a sandbox.** Identifiers are matched against a fixed set of function and constant names. Anything else throws `Unknown name`. There is no object the parser resolves names against, so chains like `constructor.constructor(...) ...` are structurally impossible.
3. **Bounded computation.** Inputs are capped at 500 characters; factorials at ≤170; division by zero, bad domains (`sqrt(-1)`, `log(0)`), and `tan(90)` all throw instead of producing `NaN`/`Infinity`.
4. **Auditable surface.** The whole engine is a few hundred lines in one file ([`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js)) with no dependencies to audit.

### Hostile inputs that are safely rejected

| Input | Result |
|---|---|
| `process.exit()` | `Unknown name "process"` |
| `constructor.constructor("...")()` | `Unknown name "constructor"` |
| `(function(){...})()` | `Unexpected character "("` / not a function |
| `2 / 0` | `Division by zero` |
| `(-1)!` | `Factorial needs a non-negative integer` |
| `sqrt(-1)` | `sqrt is undefined for this value` |
| `tan(90)` | `tan is undefined at this angle` |
| a 501-character string | `Expression is too long` |

### Defensive storage

`localStorage` throws in sandboxed `<iframe>`s and some private-browsing modes. The app wraps **every** access in `try/catch`, so:

- A storage failure never crashes the UI — it just doesn't persist.
- History read from storage is **validated and filtered** on load, so corrupted or legacy data is dropped silently instead of breaking the render.

### Privacy-friendly deployment

The GitHub Pages deployment adds no analytics or third-party trackers. The only third-party resource is Google Fonts (preconnected and loaded with `media="print"` then swapped, to avoid render-blocking); you can self-host the fonts if you need a fully self-contained deployment.

### Recommendations for sensitive environments

- For air-gapped use, **install the PWA** and use it offline — no network is needed after first load.
- To clear everything, use the in-app "Clear" button (history) and your browser's site-data clear (theme/angle/cache).
- To audit, read [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) and [`src/app.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/app.js) — together they are the entire data and evaluation surface.

---

## 🇮🇷 فارسی

حریم خصوصی و امنیت دو دلیلی هستند که این پروژه وجود دارد. این صفحه دقیقاً توضیح می‌دهد چه داده‌ای ذخیره، کجا می‌رود و چرا ماشین‌حساب نمی‌تواند برای اجرای کد استفاده شود.

### خلاصه

- **هیچ فراخوانی شبکه‌ای برای داده‌های شما.** عبارت‌ها، نتایج و تاریخچه هرگز دستگاه شما را ترک نمی‌کنند.
- **بدون `eval()`، بدون `Function()`.** یک پارسر دست‌نویس تنها مسیر ارزیابی است.
- **ذخیره‌سازی تدافعی.** برنامه حتی وقتی `localStorage` مسدود است کار می‌کند و دادهٔ ذخیره‌شده هنگام خواندن اعتبارسنجی می‌شود.

### مدل داده

همه‌چیز در **`localStorage`** مرورگر، با دامنهٔ مبدأ ذخیره می‌شود:

| کلید | محتوا | هدف | زمان پاک‌شدن |
|---|---|---|---|
| `iva-history` | آرایهٔ JSON (≤۲۰ مورد) از `{ expression, result, time }` | پنل تاریخچه | دکمهٔ «Clear» یا پاک‌کردن دادهٔ مرورگر |
| `iva-theme` | `'light' \| 'dark'` | تم به‌خاطر‌سپرده‌شده | پاک‌کردن دادهٔ مرورگر |
| `iva-angle` | `'deg' \| 'rad'` | حالت زاویهٔ به‌خاطر‌سپرده‌شده | پاک‌کردن دادهٔ مرورگر |

این **کل** ردپای داده است. بدون حساب کاربری، بدون شناسه، بدون تحلیلات، بدون کوکی تنظیم‌شده توسط برنامه.

> **کش سرویس‌ورکر.** `sw.js` *پوستهٔ برنامه* (HTML/JS/CSS/آیکون‌ها) را کش می‌کند تا برنامه آفلاین کار کند. آن کش فقط فایل‌های استاتیکی را نگه می‌دارد که از قبل دانلود کرده‌اید — هرگز دادهٔ محاسبهٔ شما را.

### مدل شبکه

- برنامه از میزبان خود (GitHub Pages یا سرور خودتان) و Google Fonts بارگذاری می‌شود.
- **هیچ درخواست خروجی داده‌های شما را حمل نمی‌کند.** محاسبات درون صفحه انجام می‌شوند؛ هیچ‌چیز دربارهٔ یک عبارت یا نتیجه هرگز ارسال نمی‌شود.
- سرویس‌ورکر **network-first** است: فایل‌های تازه از شبکه را ترجیح می‌دهد اما در حالت آفلاین به کش برمی‌گردد. داده‌ای را نشت نمی‌دهد.

خودتان می‌توانید تأیید کنید: DevTools مرورگر → زبانهٔ **Network** را باز کنید، محاسبه انجام دهید و تأیید کنید درخواستی که ورودی شما را شامل باشد وجود ندارد.

### مدل امنیت

پرسش محوری برای هر ماشین‌حسابی که متن آزاد می‌پذیرد: *آیا یک ورودی مهندسی‌شده می‌تواند کد اجرا کند؟* برای IVA Calculator Pro پاسخ **خیر** است، به چند دلیل تقویت‌کننده:

۱. **بدون اولیه‌وی ارزیابی رشته‌ای.** هیچ `eval`، هیچ `new Function`، هیچ `setTimeout(string)`، هیچ `import` پویای ورودی کاربر وجود ندارد. ESLint از `no-eval` و `no-new-func` به‌عنوان خطای سخت استفاده می‌کند.
۲. **یک فهرست مجاز، نه یک سندباکس.** شناسه‌ها با یک مجموعهٔ ثابت از نام‌های تابع و ثابت تطبیق داده می‌شوند. هر چیز دیگر `Unknown name` پرتاب می‌کند. شیئی وجود ندارد که پارسر نام‌ها را بر اساس آن حل کند، پس زنجیره‌هایی مثل `constructor.constructor(...) ...` از نظر ساختاری غیرممکن‌اند.
۳. **محاسبهٔ محدود.** ورودی‌ها به ۵۰۰ کاراکتر محدودند؛ فاکتوریل به ≤170؛ تقسیم بر صفر، دامنه‌های بد (`sqrt(-1)`، `log(0)`) و `tan(90)` همگی به‌جای تولید `NaN`/`Infinity` پرتاب می‌کنند.
۴. **سطح قابل‌حسابرسی.** کل موتور چندصد خط در یک فایل ([`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js)) بدون وابستگی برای حسابرسی است.

### ورودی‌های خصمانه‌ای که به‌سلامت رد می‌شوند

| ورودی | نتیجه |
|---|---|
| `process.exit()` | `Unknown name "process"` |
| `constructor.constructor("...")()` | `Unknown name "constructor"` |
| `(function(){...})()` | `Unexpected character "("` / تابع نیست |
| `2 / 0` | `Division by zero` |
| `(-1)!` | `Factorial needs a non-negative integer` |
| `sqrt(-1)` | `sqrt is undefined for this value` |
| `tan(90)` | `tan is undefined at this angle` |
| یک رشتهٔ ۵۰۱ کاراکتری | `Expression is too long` |

### ذخیره‌سازی تدافعی

`localStorage` در `<iframe>`های سندباکس‌شده و برخی حالت‌های مرور خصوصی پرتاب می‌کند. برنامه **هر** دسترسی را در `try/catch` می‌پیچد، پس:

- یک خرابی ذخیره‌سازی هرگز رابط را کرش نمی‌کند — فقط ماندگار نمی‌شود.
- تاریخچهٔ خوانده‌شده از ذخیره‌سازی هنگام بارگذاری **اعتبارسنجی و فیلتر** می‌شود، تا دادهٔ خراب یا قدیمی به‌جای شکستن رندر، بی‌صدا حذف شود.

### استقرار دوستدار حریم خصوصی

استقرار GitHub Pages هیچ تحلیلات یا ردیاب شخص ثالثی اضافه نمی‌کند. تنها منبع شخص ثالث Google Fonts است (preconnect شده و با `media="print"` بارگذاری و سپس تعویض می‌شود، تا رندر را مسدود نکند)؛ اگر به یک استقرار کاملاً خودکفا نیاز دارید می‌توانید فونت‌ها را خود میزبانی کنید.

### توصیه‌ها برای محیط‌های حساس

- برای استفادهٔ قطع‌از‌شبکه، **PWA را نصب** و آفلاین استفاده کنید — بعد از اولین بارگذاری نیازی به شبکه نیست.
- برای پاک‌کردن همه‌چیز، از دکمهٔ «Clear» درون برنامه (تاریخچه) و پاک‌کردن دادهٔ سایت مرورگر (تم/زاویه/کش) استفاده کنید.
- برای حسابرسی، [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) و [`src/app.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/app.js) را بخوانید — این دو با هم کل سطح داده و ارزیابی هستند.

---

<div align="center">

<sub>⬅️ [Contributing](Contributing.md) · [FAQ](FAQ.md) ➡️</sub>

</div>
