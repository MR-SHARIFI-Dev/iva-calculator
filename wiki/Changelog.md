# 📜 Changelog / تاریخچهٔ تغییرات

> 🇬🇧 Notable changes per release. Full per-version notes live in [`release/`](https://github.com/Kourosh242/iva-calculator/blob/main/release).
> 🇮🇷 تغییرات قابل‌توجه هر نسخه. یادداشت‌های کامل هر نسخه در [`release/`](https://github.com/Kourosh242/iva-calculator/blob/main/release).

---

## 🇬🇧 English

### v3.3.1 — 2026-08-22

- **Luxury Gold & Black theme** — premium gold-on-black redesign with matching dark + light variants: deep neutral-charcoal blacks (no olive cast), gold-bordered keys with bevel highlights, true-gold operators with high-contrast dark glyphs, gold result/brand typography.
- **New icon set** — the app icon, favicon, apple-touch icon, banner, poster, and social preview now all use the IVA emblem. The manifest exposes 64/192/512 px icons with `any maskable` support.
- **Version bumped to 3.3.1** across HTML, service worker, manifest, package metadata, scripts, and tests (cache key upgraded so installed PWAs refresh automatically).
- **Color polish (QA pass)** — key contrast figures (text/key 13.4, muted/surface 7.7, accent/key 9.6) all exceed WCAG.
- **QA hardening** — 29 automated user-flow checks + edge cases pass with zero console errors.

### v3.3.0

- **Euler vs scientific notation conflict fixed.** Lowercase `e` is always Euler's number; scientific notation uses uppercase `E`. (`2e3` = 2 × e × 3 ≈ 16.31; `2E3` = 2000.)
- **Negative exponents reachable.** `2^-2` works via button and keyboard; minus is enabled after `^` and `(`.
- **No silent implicit multiplication after postfix operators.** A digit/constant/parenthesis right after `!` or `%` is ignored.
- **Space no longer re-fires a focused key.**
- **Crash-proof storage** — every `localStorage` access is guarded; corrupt/legacy history is validated and filtered on read.
- **`2π` display fix** (word-boundary regex bug).
- Scientific-notation results now survive continuation after `=` (`1E+21`).

### v3.2.0 — Input hardening & cache fix

- Binary operators strictly ignored while another is pending.
- Operator buttons visibly disabled until an operand is entered.
- Held keyboard keys ignored via `KeyboardEvent.repeat` protection.
- Expressions capped at 500 characters at the input boundary.

### v3.1.0

- Increased arithmetic-operator contrast in both themes.
- Prevented stacked binary operators (selecting a second replaces the first).
- Made `=` finalize the calculation, collapse the expression to its result, and save the original expression in history.
- Automatically closes valid open function parentheses when `=` is pressed.

### v3.0.0 — Pro Engine

- Replaced dynamic JavaScript execution with a **safe recursive-descent parser**.
- Added scientific functions, DEG/RAD modes, factorial, percent, constants, and `Ans`.
- Rebuilt the responsive UI with persistent theme and calculation history.
- Added keyboard support, accessibility improvements, and useful parser errors.
- Added PWA install/offline support and an automated test suite.

### v2.0.0 — IVA Pro Engine

Engine rewrite introducing the modern evaluation core.

### v1.1.0 — Scientific Mode

Added scientific functions and constants.

### v1.0.0 — Initial release

First public release of the calculator.

---

## 🇮🇷 فارسی

### v3.3.1 — ۲۰۲۶-۰۸-۲۲

- **تم لوکس طلایی-مشکی** — بازطراحی لوکس طلایی-بر-مشکی با نسخه‌های تاریک + روشن هماهنگ: مشکی‌های زغالی خنثی (بدون ته‌رنگ زیتونی)، کلیدهای با بوردر طلایی و لبهٔ برجسته، عملگرهای طلای خالص با گلیف تیره پرکنتراست، تایپوگرافی نتیجه/برند طلایی.
- **مجموعهٔ آیکون‌های جدید** — آیکون برنامه، فاوآیکون، apple-touch-icon، بنر، پوستر و تصویر شبکه‌های اجتماعی همگی از آرم IVA استفاده می‌کنند. مانیفست آیکون‌های ۶۴/۱۹۲/۵۱۲ پیکسلی با پشتیبانی `any maskable` دارد.
- **ارتقای نسخه به 3.3.1** در HTML، سرویس‌ورکر، مانیفست، متادیتای پکیج، اسکریپت‌ها و تست‌ها (کلید کش ارتقا یافت تا PWA نصب‌شده خودکار آپدیت شود).
- **پالایش رنگ (مرحلهٔ QA)** — ارقام کنتراست کلیدی (متن/کلید ۱۳.۴، محو/سطح ۷.۷، اکسنت/کلید ۹.۶) همگی بالاتر از WCAG.
- **سخت‌سازی QA** — ۲۹ بررسی خودکار جریان کاربری + سناریوهای مرزی بدون هیچ خطای کنسول.

### v3.3.0

- **رفض تعارض عدد اویلر و نماد علمی.** `e` کوچک همیشه عدد اویلر است؛ نماد علمی از `E` بزرگ استفاده می‌کند. (`2e3` = 2 × e × 3 ≈ 16.31؛ `2E3` = 2000.)
- **توان منفی در دسترس.** `2^-2` با دکمه و کیبورد کار می‌کند؛ منفی بعد از `^` و `(` فعال است.
- **بدون ضرب ضمنی خاموش بعد از عملگرهای پسوندی.** رقم/ثابت/پرانتز بلافاصله بعد از `!` یا `%` نادیده گرفته می‌شود.
- **Space دیگر دکمهٔ فوکوس‌شده را دوباره فعال نمی‌کند.**
- **ذخیره‌سازی ضد‌کرش** — هر دسترسی `localStorage` محافظت شده؛ تاریخچهٔ خراب/قدیمی هنگام خواندن اعتبارسنجی و فیلتر می‌شود.
- **رفع نمایش `2π`** (باگ مرز کلمه در regex).
- نتایج نماد علمی حالا در ادامه بعد از `=` دوام می‌آورند (`1E+21`).

### v3.2.0 — سخت‌سازی ورودی و رفع کش

- عملگرهای دوتایی در حالت معلق به‌سختی نادیده گرفته می‌شوند.
- دکمه‌های عملگر تا واردشدن عملوند به‌صورت بصری غیرفعال می‌شوند.
- کلیدهای نگه‌داشته‌شدهٔ کیبورد با محافظت `KeyboardEvent.repeat` نادیده گرفته می‌شوند.
- عبارت‌ها در مرز ورودی به ۵۰۰ کاراکتر محدود شدند.

### v3.1.0

- افزایش کنتراست عملگرهای حساب در هر دو تم.
- جلوگیری از پشته‌شدن عملگرهای دوتایی (انتخاب دومی، اولی را جایگزین می‌کند).
- `=` محاسبه را نهایی، عبارت را به نتیجه فرومی‌کاهد و عبارت اصلی را در تاریخچه ذخیره می‌کند.
- بستن خودکار پرانتزهای تابع بازِ معتبر هنگام فشردن `=`.

### v3.0.0 — موتور Pro

- جایگزینی اجرای پویای جاوااسکریپت با یک **پارسر بازگشتی امن**.
- افزودن توابع علمی، حالت‌های DEG/RAD، فاکتوریل، درصد، ثابت‌ها و `Ans`.
- بازسازی رابط واکنش‌گرا با تم ماندگار و تاریخچهٔ محاسبه.
- افزودن پشتیبانی کیبورد، بهبود دسترس‌پذیری و خطاهای مفید پارسر.
- افزودن پشتیبانی نصب/آفلاین PWA و یک مجموعهٔ تست خودکار.

### v2.0.0 — موتور IVA Pro

بازنویسی موتور با معرفی هستهٔ ارزیابی مدرن.

### v1.1.0 — حالت علمی

افزودن توابع علمی و ثابت‌ها.

### v1.0.0 — انتشار اولیه

اولین انتشار عمومی ماشین‌حساب.

---

<div align="center">

<sub>⬅️ [FAQ](FAQ.md) · [Home](Home.md)</sub>

</div>
