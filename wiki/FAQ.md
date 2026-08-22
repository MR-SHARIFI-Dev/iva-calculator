# ❓ FAQ / سوالات متداول

> 🇬🇧 Frequently asked questions and troubleshooting.
> 🇮🇷 سوالات متداول و رفع اشکال.

---

## 🇬🇧 English

### Using the calculator

**Why doesn't `2e3` equal `2000`?**
Lowercase `e` is Euler's number, so `2e3` means `2 × e × 3 ≈ 16.31`. Use uppercase `E` for scientific notation: `2E3 = 2000`, `2E-3 = 0.002`. This keeps the `e` key unambiguous.

**How do I reuse the last result?**
Press `=` to finish, then either press **Ans** or type an operator (the answer continues automatically). Typing a digit starts a brand-new expression.

**Why is a key greyed out?**
Operator buttons disable themselves until there's an operand to act on — the strict-input rule made visible. The exception is `−`, which stays enabled after `(` and `^` so you can enter negatives and negative exponents.

**Why is `5!` followed by `3` ignored?**
Implicit multiplication is intentionally blocked after postfix operators to avoid the classic `5!3 = 360` mistake. Enter an explicit operator (`5! * 3`) if that's what you mean.

**How do I switch between degrees and radians?**
Tap the **DEG** / **RAD** button in the top bar. The choice is remembered. `sin(30)` is `0.5` in DEG and `≈ -0.988` in RAD.

**How much history is kept?**
The last **20** calculations, each with its expression, result, and time. Click any entry to reload it. Use **Clear** to wipe the list.

**Can I use the keyboard?**
Yes — fully. See [Keyboard Shortcuts](Keyboard-Shortcuts.md).

### Installing & offline

**How do I install it as an app?**
Open the deployed site in Chrome/Edge and click the install icon in the address bar. It then runs offline as a standalone app.

**Does it work with no internet?**
Yes. The service worker caches the app shell on first load; later visits work fully offline. The cache is network-first, so when you're online you always get the latest version.

**Why won't the service worker register when I open `index.html` directly?**
Browsers require an `http(s)` origin for service workers. Serve the folder (`npm run serve`) instead of using `file://`.

### Privacy & security

**Is my data sent anywhere?**
No. Expressions, results, and history stay in your browser's `localStorage`. See [Privacy & Security](Privacy-and-Security.md).

**Could a malicious expression run code?**
No. There is no `eval`/`Function`; the parser only recognizes a fixed whitelist of functions and constants. `process.exit()` simply reports *Unknown name*.

**The app forgets my theme/history. Why?**
You may be in a private-browsing mode, a sandboxed iframe, or you cleared site data. Storage failures are handled gracefully (the app keeps working) but won't persist.

### Troubleshooting

**The result shows an error instead of a number.**
The message tells you why — e.g. `Division by zero`, `tan is undefined at this angle`, `Factorial needs a non-negative integer`. Fix the expression or press `AC` and re-enter.

**The live preview stopped updating.**
Check the browser console. A thrown `CalculatorError` while typing is normal and swallowed, but a *different* error would surface there.

**`npm run test:e2e` says it can't find Chromium.**
Run `npx playwright install chromium` (or `--with-deps` on Linux CI).

**I changed the code but the PWA shows the old version.**
The service worker is network-first; a hard reload, or closing all app tabs, forces the update. The `activate` handler also navigates stale tabs to the new version on the next start.

**My localization/translation isn't here.**
The docs and README are English + Persian. Translations of the UI strings are on the roadmap — contributions welcome ([Contributing](Contributing.md)).

---

## 🇮🇷 فارسی

### استفاده از ماشین‌حساب

**چرا `2e3` برابر `2000` نیست؟**
`e` کوچک عدد اویلر است، پس `2e3` یعنی `2 × e × 3 ≈ 16.31`. برای نماد علمی از `E` بزرگ استفاده کنید: `2E3 = 2000`، `2E-3 = 0.002`. این کار کلید `e` را یکپارچه نگه می‌دارد.

**چطور آخرین نتیجه را دوباره استفاده کنم؟**
برای پایان `=` را بزنید، سپس یا **Ans** را بزنید یا یک عملگر تایپ کنید (جواب خودکار ادامه می‌یابد). تایپ یک رقم، عبارت کاملاً جدیدی را آغاز می‌کند.

**چرا یک کلید خاکستری/غیرفعال شده؟**
دکمه‌های عملگر تا زمانی که عملوندی برای اقدام باشد غیرفعال می‌شوند — همان قانون ورودی سخت‌گیرانه، اما قابل‌دیدن. استثنا `−` است که بعد از `(` و `^` فعال می‌ماند تا بتوانید منفی و توان منفی وارد کنید.

**چرا بعد از `5!` کلید `3` نادیده گرفته می‌شود؟**
ضرب ضمنی بعد از عملگرهای پسوندی عمداً مسدود شده تا خطای کلاسیک `5!3 = 360` رخ ندهد. اگر منظورتان این است، یک عملگر صریح وارد کنید (`5! * 3`).

**چطور بین درجه و رادیان جابه‌جا شوم؟**
دکمهٔ **DEG**/**RAD** را در نوار بالا بزنید. انتخاب به‌خاطر سپرده می‌شود. `sin(30)` در DEG برابر `0.5` و در RAD تقریباً `-0.988` است.

**چقدر تاریخچه نگه داشته می‌شود؟**
آخرین **۲۰** محاسبه، هرکدام با عبارت، نتیجه و زمانش. روی هر مورد کلیک کنید تا بارگذاری شود. برای پاک‌کردن فهرست از **Clear** استفاده کنید.

**آیا می‌توانم از صفحه‌کلید استفاده کنم؟**
بله — کاملاً. به [میانبرهای صفحه‌کلید](Keyboard-Shortcuts.md) مراجعه کنید.

### نصب و آفلاین

**چطور آن را به‌عنوان اپلیکیشن نصب کنم؟**
سایت مستقرشده را در Chrome/Edge باز کنید و آیکون نصب در نوار آدرس را بزنید. سپس آفلاین به‌عنوان اپلیکیشن مستقل اجرا می‌شود.

**آیا بدون اینترنت کار می‌کند؟**
بله. سرویس‌ورکر در اولین بارگذاری پوستهٔ برنامه را کش می‌کند؛ بازدیدهای بعدی کاملاً آفلاین کار می‌کنند. کش network-first است، پس وقتی آنلاین هستید همیشه آخرین نسخه را می‌گیرید.

**چرا هنگام باز کردن مستقیم `index.html` سرویس‌ورکر ثبت نمی‌شود؟**
مرورگرها برای سرویس‌ورکر به یک مبدأ `http(s)` نیاز دارند. به‌جای `file://` پوشه را سرو کنید (`npm run serve`).

### حریم خصوصی و امنیت

**آیا داده‌هایم جایی ارسال می‌شود؟**
خیر. عبارت‌ها، نتایج و تاریخچه در `localStorage` مرورگر شما می‌مانند. به [حریم خصوصی و امنیت](Privacy-and-Security.md) مراجعه کنید.

**آیا یک عبارت مخرب می‌تواند کد اجرا کند؟**
خیر. هیچ `eval`/`Function` وجود ندارد؛ پارسر فقط یک فهرست مجاز ثابت از توابع و ثابت‌ها را تشخیص می‌دهد. `process.exit()` صرفاً *Unknown name* را گزارش می‌کند.

**برنامه تم/تاریخچه‌ام را فراموش می‌کند. چرا؟**
ممکن است در حالت مرور خصوصی، یک iframe سندباکس‌شده باشید یا دادهٔ سایت را پاک کرده باشید. خرابی‌های ذخیره‌سازی با ظرافت مدیریت می‌شوند (برنامه به کار ادامه می‌دهد) اما ماندگار نمی‌شوند.

### رفع اشکال

**نتیجه به‌جای عدد، خطا نشان می‌دهد.**
پیام دلیل را می‌گوید — مثلاً `Division by zero`، `tan is undefined at this angle`، `Factorial needs a non-negative integer`. عبارت را اصلاح کنید یا `AC` را بزنید و دوباره وارد کنید.

**پیش‌نمایش زنده به‌روزرسانی را متوقف کرده.**
کنسول مرورگر را بررسی کنید. یک `CalculatorError` پرتاب‌شده هنگام تایپ طبیعی و بلعیده‌شده است، اما یک خطای *متفاوت* آنجا ظاهر می‌شود.

**`npm run test:e2e` می‌گوید Chromium را پیدا نمی‌کند.**
`npx playwright install chromium` را اجرا کنید (یا `--with-deps` روی CI لینوکس).

**کد را تغییر دادم اما PWA نسخهٔ قدیمی را نشان می‌دهد.**
سرویس‌ورکر network-first است؛ یک reload سخت یا بستن همهٔ زبانه‌های اپ، به‌روزرسانی را اجبار می‌کند. مدیریت `activate` همچنین زبانه‌های قدیمی را در شروع بعدی به نسخهٔ جدید هدایت می‌کند.

**بومی‌سازی/ترجمهٔ من اینجا نیست.**
مستندات و README انگلیسی + فارسی هستند. ترجمهٔ رشته‌های رابط در نقشه راه است — از مشارکت استقبال می‌شود ([مشارکت](Contributing.md)).

---

<div align="center">

<sub>⬅️ [Privacy & Security](Privacy-and-Security.md) · [Changelog](Changelog.md) ➡️</sub>

</div>
