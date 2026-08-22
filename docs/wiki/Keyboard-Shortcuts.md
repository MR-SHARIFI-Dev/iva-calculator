# ⌨️ Keyboard Shortcuts / میانبرهای صفحه‌کلید

> 🇬🇧 Every keyboard binding and the on-screen key map.
> 🇮🇷 تمام میانبرهای صفحه‌کلید و نقشهٔ کلیدهای روی صفحه.

---

## 🇬🇧 English

IVA Calculator Pro is fully operable from the keyboard. The on-screen keys also pulse on each keystroke, so you always see what was registered.

### General keys

| Key | Action | Notes |
|---|---|---|
| `0`–`9` | Digit input | |
| `00` | Two zeros | on-screen button only (type `0` twice on a keyboard) |
| `.` | Decimal point | one per numeric literal; blocked inside scientific notation |
| `+` `-` `*` `/` | Binary operators | consecutive operators are ignored (strict mode) |
| `^` | Power | right-associative; exponent parsed as unary so `2^-2` works |
| `%` | Percent (postfix) | divides by 100 |
| `!` | Factorial (postfix) | non-negative integers, ≤ 170 |
| `(` `)` | Parentheses | `)` only inserted when an `(` is open |
| `Enter` or `=` | Calculate | also auto-closes open parentheses |
| `Backspace` | Delete last token | removes a whole function/constant in one step |
| `Esc` or `Delete` | Clear all | |
| `×` `÷` `−` | Aliases for `*` `/` `-` | for keyboards with these glyphs |
| `Space` | Ignored | prevents re-firing a focused button |

### Typing scientific expressions

There are no dedicated keyboard keys for functions, so type them as text after the parentheses open. The on-screen function buttons insert them with their `(` already included.

| To compute… | On-screen buttons | Keyboard equivalent |
|---|---|---|
| `sin(30)` | `sin` `3` `0` `=` | type the full expression, or click `sin` then type `30` |
| `sqrt(81)` | `√` `8` `1` `=` | `sqrt(81)=` |
| `2^10` | `2` `xʸ` `1` `0` `=` | `2^10=` |
| `5!` | `5` `x!` `=` | `5!=` |
| `2pi` | `2` `π` `=` | `2pi=` (implicit multiplication) |
| `2e3` (Euler) | `2` `e` `3` `=` | `2e3=` → `2 × e × 3` |
| `2E3` (scientific) | — | `2E3=` → `2000` |
| `Ans` reuse | `Ans` `*` `2` `=` | after `=`, typing an operator continues from the answer |

### On-screen key map

| Zone | Keys |
|---|---|
| **Function bar (top)** | `asin` · `acos` · `atan` · `abs` · `exp` · `floor` · `ceil` · `round` |
| **Scientific row** | `sin` · `cos` · `tan` · `log` · `ln` · `√` · `xʸ` · `π` · `e` · `x!` · `Ans` |
| **Numeric pad** | `7 8 9` · `4 5 6` · `1 2 3` · `0 00 .` |
| **Operators** | `÷ × − +` |
| **Utilities** | `AC` · `⌫` (backspace) · `(` · `)` · `%` |
| **Equals** | `=` |
| **Toolbar** | `DEG`/`RAD` toggle · theme (☾/☀) |

### Behavior notes

- **Held keys are ignored.** `KeyboardEvent.repeat` is checked so a held `+` cannot stack operators.
- **Operator buttons disable themselves** until an operand is present (except `-` after `(` or `^`). This makes the strict-input rule visible, not just functional.
- **After `=`**, typing an operator continues from the result; typing a digit, constant, or function starts a fresh expression.

---

## 🇮🇷 فارسی

IVA Calculator Pro کاملاً با صفحه‌کلید قابل‌اجرا است. کلیدهای روی صفحه نیز با هر فشردن پالس می‌زنند، تا همیشه ببینید چه چیزی ثبت شده است.

### کلیدهای عمومی

| کلید | عملکرد | توضیح |
|---|---|---|
| `0`–`9` | ورودی رقم | |
| `00` | دو صفر | فقط دکمهٔ روی صفحه (روی صفحه‌کلید دو بار `0` بزنید) |
| `.` | اعشار | یکی در هر لفظ عددی؛ داخل نماد علمی مسدود |
| `+` `-` `*` `/` | عملگرهای دوتایی | عملگرهای متوالی نادیده گرفته می‌شوند (حالت سخت‌گیرانه) |
| `^` | توان | راست‌پیوند؛ توان به‌صورت یکانی تفسیر می‌شود پس `2^-2` کار می‌کند |
| `%` | درصد (پسوندی) | بر ۱۰۰ تقسیم می‌کند |
| `!` | فاکتوریل (پسوندی) | اعداد صحیح نامنفی، ≤ 170 |
| `(` `)` | پرانتز | `)` فقط وقتی `(` باز است درج می‌شود |
| `Enter` یا `=` | محاسبه | همچنین پرانتزهای باز را می‌بندد |
| `Backspace` | حذف آخرین توکن | یک تابع/ثابت کامل را در یک گام حذف می‌کند |
| `Esc` یا `Delete` | پاک‌سازی همه | |
| `×` `÷` `−` | معادل `*` `/` `-` | برای صفحه‌کلیدهایی با این گلیف‌ها |
| `Space` | نادیده | از فعال‌سازی دوبارهٔ دکمهٔ فوکوس‌شده جلوگیری می‌کند |

### تایپ عبارت‌های علمی

کلیدهای اختصاصی برای توابع روی صفحه‌کلید وجود ندارد، پس آن‌ها را به‌صورت متن بعد از بازشدن پرانتز تایپ کنید. دکمه‌های تابع روی صفحه، آن‌ها را با `(`شان درج می‌کنند.

| برای محاسبهٔ… | دکمه‌های روی صفحه | معادل صفحه‌کلید |
|---|---|---|
| `sin(30)` | `sin` `3` `0` `=` | کل عبارت را تایپ کنید، یا `sin` را بزنید و سپس `30` |
| `sqrt(81)` | `√` `8` `1` `=` | `sqrt(81)=` |
| `2^10` | `2` `xʸ` `1` `0` `=` | `2^10=` |
| `5!` | `5` `x!` `=` | `5!=` |
| `2pi` | `2` `π` `=` | `2pi=` (ضرب ضمنی) |
| `2e3` (اویلر) | `2` `e` `3` `=` | `2e3=` → `2 × e × 3` |
| `2E3` (علمی) | — | `2E3=` → `2000` |
| استفادهٔ `Ans` | `Ans` `*` `2` `=` | بعد از `=`، تایپ یک عملگر از جواب ادامه می‌دهد |

### نقشهٔ کلیدهای روی صفحه

| ناحیه | کلیدها |
|---|---|
| **نوار تابع (بالا)** | `asin` · `acos` · `atan` · `abs` · `exp` · `floor` · `ceil` · `round` |
| **ردیف علمی** | `sin` · `cos` · `tan` · `log` · `ln` · `√` · `xʸ` · `π` · `e` · `x!` · `Ans` |
| **صفحهٔ اعداد** | `7 8 9` · `4 5 6` · `1 2 3` · `0 00 .` |
| **عملگرها** | `÷ × − +` |
| **ابزارها** | `AC` · `⌫` (backspace) · `(` · `)` · `%` |
| **مساوی** | `=` |
| **نوار ابزار** | کلید `DEG`/`RAD` · تم (☾/☀) |

### نکات رفتاری

- **کلیدهای نگه‌داشته‌شده نادیده گرفته می‌شوند.** `KeyboardEvent.repeat` بررسی می‌شود تا یک `+` نگه‌داشته‌شده نتواند عملگرها را بپشته کند.
- **دکمه‌های عملگر تا زمانی که عملوندی نباشد غیرفعال می‌شوند** (به‌جز `-` بعد از `(` یا `^`). این کار قانون ورودی سخت‌گیرانه را قابل‌دیدن می‌کند، نه فقط کاربردی.
- **بعد از `=`**، تایپ یک عملگر از نتیجه ادامه می‌دهد؛ تایپ یک رقم، ثابت یا تابع، عبارت جدیدی را آغاز می‌کند.

---

<div align="center">

<sub>⬅️ [API](API.md) · [Development](Development.md) ➡️</sub>

</div>
