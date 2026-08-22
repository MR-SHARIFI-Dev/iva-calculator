# ✨ Features / امکانات

> 🇬🇧 Every feature of IVA Calculator Pro, with examples.
> 🇮🇷 تمام امکانات IVA Calculator Pro به‌همراه مثال.

---

## 🇬🇧 English

### Safe evaluation engine

The single most important feature. Expressions are parsed and evaluated by a hand-written **recursive-descent parser** ([see Parser](Parser.md)). There is no `eval()`, no `new Function()`, and no dynamic code execution path anywhere in the codebase — `no-eval` and `no-new-func` are enforced as hard errors by ESLint. Inputs like `process.exit()` are rejected as *Unknown name*.

### Arithmetic & precedence

Standard operator precedence is fully respected:

| Expression | Result | Rule |
|---|---|---|
| `2 + 3 * 4` | `14` | `*` binds tighter than `+` |
| `(2 + 3) * 4` | `20` | Parentheses override precedence |
| `2^3^2` | `512` | Power is **right-associative** (`2^(3^2)`) |
| `-2^2` | `-4` | Unary minus binds looser than `^` |

### Scientific functions

All of these are first-class, with proper DEG/RAD handling:

| Function | Example | Result |
|---|---|---|
| `sin`, `cos`, `tan` | `sin(30)` | `0.5` |
| `asin`, `acos`, `atan` | `asin(1)` | `90` (DEG) |
| `sqrt` | `sqrt(81)` | `9` |
| `log` (base 10), `ln` (natural) | `log(100) + ln(e)` | `3` |
| `exp` | `exp(1)` | `2.71828182846` |
| `abs` | `abs(-9)` | `9` |
| `floor`, `ceil`, `round` | `round(2.6)` | `3` |

### Powers, factorials & percentages

- `2^10` → `1024`
- `5!` → `120` (factorial of a non-negative integer; `171!` is rejected as too large)
- `50% * 200` → `100` (`%` divides by 100 as a postfix operator)

### Constants and `Ans`

- `π` / `pi` → `3.14159265359`
- `e` → `2.71828182846` (Euler's number)
- `Ans` / `ans` → the result of the previous successful calculation. Typing `*2` after `=` continues from the answer; typing a digit starts fresh.

> **`e` vs `E`:** lowercase `e` is **always** Euler's number. Use uppercase `E` for scientific notation (`2E3` = 2000). This is what keeps the `e` key unambiguous.

### Implicit multiplication

You can omit `×` in the common cases:

| Typed | Parsed as |
|---|---|
| `2pi` | `2 * pi` |
| `3(4+1)` | `3 * (4+1)` |
| `2π(3)` | `2 * π * 3` |

> Implicit multiplication is **not** allowed after a postfix operator. Pressing `5`, `x!`, `3` does **not** produce `5! * 3` — it ignores the `3` and waits for an explicit operator. This prevents the classic "5!3 = 360" footgun.

### Live preview

As you type, the result line updates in real time. Incomplete expressions simply show the last valid preview instead of erroring.

### DEG / RAD modes

A single toggle switches every trig function between **degrees** (default) and **radians**. The choice is persisted in `localStorage`.

### Persistent history

The last **20** calculations are kept in `localStorage`, each with the original expression, the result, and a timestamp. Click any entry to reload it into the display. *Clear* wipes the list. Stored data is validated on read, so corrupted or old-format entries are silently dropped.

### Dark & light themes

A premium **gold-on-black** dark theme plus a soft **cream/gold** light theme. Your preference is remembered and respects your OS `prefers-color-scheme` on first visit.

### Full keyboard support

Type naturally — digits, operators, parentheses, `!`, `%`, `^`. `Enter`/`=` calculates, `Backspace` deletes the last token, `Esc`/`Delete` clears. The on-screen key pulses to mirror each keystroke. See [Keyboard Shortcuts](Keyboard-Shortcuts.md).

### Installable, offline PWA

Add it to your home screen / desktop. A service worker provides a **network-first** cache with a graceful offline fallback, and versioned cache keys mean a deployed fix is never hidden by a stale cache. See [Installation](Installation.md).

### Accessibility & responsiveness

Semantic HTML, ARIA labels on every control, `role="status"` for result messages, `prefers-reduced-motion` support, and a layout that adapts from a 390 px phone to a wide desktop. Disabled operator buttons are visibly styled (not just hidden) so the state is clear.

### Hardened input

Invalid input is blocked **before** it reaches the parser: consecutive binary operators are ignored, duplicate decimals are prevented, decimals inside scientific notation are rejected, and a 500-character cap protects the display.

---

## 🇮🇷 فارسی

### موتور ارزیابی امن

مهم‌ترین امکان. عبارت‌ها توسط یک **پارسر بازگشتی دست‌نویس** تحلیل و ارزیابی می‌شوند ([پارسر را ببینید](Parser.md)). هیچ `eval()`، هیچ `new Function()` و هیچ مسیر اجرای پویایی در کل کد وجود ندارد — `no-eval` و `no-new-func` به‌عنوان خطای سخت توسط ESLint اعمال می‌شوند. ورودی‌هایی مثل `process.exit()` به‌عنوان «Unknown name» رد می‌شوند.

### حساب و تقدم عملگرها

تقدم استاندارد عملگرها کاملاً رعایت می‌شود:

| عبارت | نتیجه | قانون |
|---|---|---|
| `2 + 3 * 4` | `14` | `*` قوی‌تر از `+` است |
| `(2 + 3) * 4` | `20` | پرانتز تقدم را تغییر می‌دهد |
| `2^3^2` | `512` | توان **راست‌پیوند** است (`2^(3^2)`) |
| `-2^2` | `-4` | منفی یکانی ضعیف‌تر از `^` است |

### توابع علمی

همهٔ این‌ها درجه اول هستند، با مدیریت صحیح DEG/RAD:

| تابع | مثال | نتیجه |
|---|---|---|
| `sin`, `cos`, `tan` | `sin(30)` | `0.5` |
| `asin`, `acos`, `atan` | `asin(1)` | `90` (درجه) |
| `sqrt` | `sqrt(81)` | `9` |
| `log` (پایه ۱۰), `ln` (طبیعی) | `log(100) + ln(e)` | `3` |
| `exp` | `exp(1)` | `2.71828182846` |
| `abs` | `abs(-9)` | `9` |
| `floor`, `ceil`, `round` | `round(2.6)` | `3` |

### توان، فاکتوریل و درصد

- `2^10` → `1024`
- `5!` → `120` (فاکتوریل یک عدد صحیح نامنفی؛ `171!` به‌خاطر بزرگی رد می‌شود)
- `50% * 200` → `100` (`%` به‌عنوان عملگر پسوندی بر ۱۰۰ تقسیم می‌کند)

### ثابت‌ها و `Ans`

- `π` / `pi` → `3.14159265359`
- `e` → `2.71828182846` (عدد اویلر)
- `Ans` / `ans` → نتیجهٔ آخرین محاسبهٔ موفق. تایپ `*2` بعد از `=` از جواب ادامه می‌دهد؛ تایپ یک رقم، عبارت جدید را آغاز می‌کند.

> **`e` در برابر `E`:** `e` کوچک **همیشه** عدد اویلر است. برای نماد علمی از `E` بزرگ استفاده کنید (`2E3` = 2000). این کار کلید `e` را یکپارچه نگه می‌دارد.

### ضرب ضمنی

در موارد رایج می‌توانید `×` را حذف کنید:

| تایپ‌شده | به‌صورت |
|---|---|
| `2pi` | `2 * pi` |
| `3(4+1)` | `3 * (4+1)` |
| `2π(3)` | `2 * π * 3` |

> ضرب ضمنی بعد از عملگر پسوندی **مجاز نیست**. فشردن `5`، `x!`، `3` باعث `5! * 3` **نمی‌شود** — `3` را نادیده می‌گیرد و منتظر یک عملگر صریح می‌ماند. این کار خطای کلاسیک «5!3 = 360» را حذف می‌کند.

### پیش‌نمایش زنده

هنگام تایپ، خط نتیجه در لحظه به‌روز می‌شود. عبارت‌های ناقص صرفاً آخرین پیش‌نمایش معتبر را نشان می‌دهند، نه خطا.

### حالت‌های DEG / RAD

یک دکمه هر تابع مثلثاتی را بین **درجه** (پیش‌فرض) و **رادیان** جابه‌جا می‌کند. انتخاب در `localStorage` ذخیره می‌شود.

### تاریخچهٔ ماندگار

آخرین **۲۰** محاسبه در `localStorage` نگه داشته می‌شوند — هرکدام با عبارت اصلی، نتیجه و مهر زمانی. روی هر مورد کلیک کنید تا در نمایشگر بارگذاری شود. *Clear* فهرست را پاک می‌کند. دادهٔ ذخیره‌شده هنگام خواندن اعتبارسنجی می‌شود تا ورودی‌های خراب یا قدیمی بی‌صدا حذف شوند.

### تم تاریک و روشن

تم تاریک لوکس **طلایی-بر-مشکی** به‌اضافهٔ تم روشن نرم **کرم/طلایی**. ترجیح شما به‌خاطر سپرده می‌شود و در اولین بازدید از `prefers-color-scheme` سیستم‌عامل پیروی می‌کند.

### پشتیبانی کامل صفحه‌کلید

طبیعی تایپ کنید — ارقام، عملگرها، پرانتزها، `!`، `%`، `^`. `Enter`/`=` محاسبه، `Backspace` حذف آخرین توکن، `Esc`/`Delete` پاک‌سازی. کلید روی صفحه برای انعکاس هر فشردن، پالس می‌زند. به [میانبرهای صفحه‌کلید](Keyboard-Shortcuts.md) مراجعه کنید.

### PWA قابل نصب و آفلاین

آن را به صفحهٔ خانه/دسکتاپ اضافه کنید. سرویس‌ورکر یک کش **network-first** با جایگزین آفلاین ظریف ارائه می‌دهد و کلیدهای کش نسخه‌دار به این معناست که یک اصلاح مستقرشده هرگز پشت کش قدیمی پنهان نمی‌ماند. به [نصب](Installation.md) مراجعه کنید.

### دسترس‌پذیری و واکنش‌گرایی

HTML معنایی، برچسب‌های ARIA روی هر کنترل، `role="status"` برای پیام‌های نتیجه، پشتیبانی از `prefers-reduced-motion` و چیدمانی که از گوشی ۳۹۰ پیکسلی تا دسکتاپ پهن سازگار است. دکمه‌های عملگر غیرفعال به‌صورت بصری استایل می‌گیرند (فقط پنهان نمی‌شوند) تا وضعیت روشن باشد.

### ورودی سخت‌گیرانه

ورودی نامعتبر **پیش از** رسیدن به پارسر مسدود می‌شود: عملگرهای دوتایی متوالی نادیده گرفته می‌شوند، اعشار مضاعف پیشگیری می‌شود، اعشار داخل نماد علمی رد می‌شود و سقف ۵۰۰ کاراکتری از نمایشگر محافظت می‌کند.

---

<div align="center">

<sub>⬅️ [Home](Home.md) · [Installation](Installation.md) ➡️</sub>

</div>
