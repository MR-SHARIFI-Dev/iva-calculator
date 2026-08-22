# 🧠 Expression Parser / پارسر عبارت

> 🇬🇧 The grammar, tokenizer, and recursive-descent evaluator that powers every calculation.
> 🇮🇷 دستور زبان، توکنایزر و ارزیاب بازگشتی که هر محاسبه را پیش می‌برد.

---

## 🇬🇧 English

IVA Calculator Pro evaluates expressions with a hand-written **recursive-descent parser** in [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js). It deliberately avoids `eval()` and `new Function()` so that untrusted input can never execute code. This page documents the grammar, the tokenizer, the evaluation algorithm, and the safety properties.

> **Public entry point:** `calculate(expression, options)` → `number`.
> **Error type:** `CalculatorError` (extends `Error`, carries an optional `position`).

### Why not `eval`?

`eval` (and `new Function`) execute arbitrary strings as JavaScript. Even sandboxed, this is a security liability and makes errors opaque. A custom parser:

- **Cannot run code** — there is no code-execution primitive. `process.exit()` is just an "Unknown name".
- **Has bounded input** — expressions over 500 characters are rejected up front.
- **Reports precise errors** — with character positions where useful.

### Pipeline

```
expression string
      │
      ▼
  tokenize()     ──►  array of tokens { type, value, position }
      │
      ▼
  Parser.parse() ──►  recursive-descent walk → number
      │
      ▼
  (Number.isFinite check) ──►  number  |  throws CalculatorError
```

### The grammar

The parser implements this operator-precedence grammar (tightest binding at the bottom):

```
expression  := additive
additive    := multiplicative  ( ('+' | '-') multiplicative )*
multiplicative := unary  ( ('*' | '/') unary
                            | unary-lookahead )*        ← implicit multiplication
unary       := ('+' | '-') unary | power
power       := postfix ('^' unary)?                     ← right-associative, binds to unary
postfix     := primary ( '!' | '%' )*
primary     := number | '(' additive ')'
             | 'pi' | 'e' | 'ans'
             | func '(' additive ')'
func        := sin | cos | tan | asin | acos | atan
             | sqrt | abs | ln | log | exp | floor | ceil | round
```

Notable properties:

- **Power is right-associative.** `2^3^2` parses as `2^(3^2) = 512`.
- **Power binds tighter than unary minus.** `-2^2` is `-(2^2) = -4`.
- **Power's exponent is parsed as `unary`**, so `2^-2` works without a special case (the leading `-` is a unary sign).
- **Implicit multiplication** lives in the multiplicative rule: after a value, if the next token starts another value (number/identifier/`(`), it's an implicit multiply. So `2pi`, `3(4+1)`, `2e3` all multiply.
- **`!` and `%` are postfix** and may repeat (`5!!`, though it'll overflow quickly).

### The tokenizer

`tokenize(source)` normalizes input and emits typed tokens:

1. **Normalize display characters:** `×→*`, `÷→/`, `−→-`, `π→pi`, `√→sqrt`.
2. **Numbers:** digits with optional single `.`, and optional scientific suffix `E[+-]?digits`. Importantly, **scientific notation uses uppercase `E`** — a lowercase `e` is *never* part of a number, so it's always Euler's constant. `2E3` = 2000; `2e3` = `2 × e × 3`.
3. **Identifiers:** runs of letters/underscore, lowercased — matched against the function set and the constants `pi`/`e`/`ans`.
4. **Operators:** one of `+ - * / ^ ( ) ! %`.
5. **eof** sentinel at the end.
6. **Bounded:** rejects inputs > 500 chars, invalid numbers, numbers too large to be finite, and unexpected characters (with the offending character quoted in the message).

### Angle handling

ECMAScript's trig functions use radians. The parser converts **only at the function-call boundary** in `callFunction`:

- `toRad(x)` = `deg` mode ? `(x % 360) * π/180` : `x`
- `fromRad(x)` = `deg` mode ? `x * 180/π` : `x`

`sin`/`cos` pass `toRad`; `asin`/`acos`/`atan` pass `fromRad`. A tiny `cleanTrig` snaps near-zero/±1 floating-point noise to exact values, and `clampUnit` forgives inputs like `asin(1.0000000000001)`.

### Functions reference

| Function | Behavior | Example | Result |
|---|---|---|---|
| `sin`, `cos`, `tan` | trig (angle-mode aware); `tan` rejects 90°/π/2 | `sin(30)` | `0.5` |
| `asin`, `acos`, `atan` | inverse trig (returns in angle mode); input clamped to [-1,1] | `asin(1)` | `90` (DEG) |
| `sqrt` | square root; rejects negatives | `sqrt(81)` | `9` |
| `abs` | absolute value | `abs(-9)` | `9` |
| `ln` | natural log; rejects ≤ 0 | `ln(e)` | `1` |
| `log` | base-10 log; rejects ≤ 0 | `log(100)` | `2` |
| `exp` | e^x | `exp(1)` | `2.718…` |
| `floor`, `ceil`, `round` | rounding | `round(2.6)` | `3` |
| `!` (postfix) | factorial; non-negative integers only, ≤ 170 | `5!` | `120` |
| `%` (postfix) | divide by 100 | `50%` | `0.5` |
| `^` | power (right-assoc) | `2^10` | `1024` |
| `pi`, `e`, `ans` | constants / last result | `2*pi` | `6.283…` |

### Error taxonomy

All errors are instances of `CalculatorError` and carry a human-readable message (and a `position` where relevant). The UI maps any non-`CalculatorError` exception to a generic *"Could not calculate this expression"*.

| Condition | Message |
|---|---|
| Empty input | `Enter an expression` |
| Too long (>500 chars) | `Expression is too long` |
| Non-text input | `Expression must be text` |
| Bad number / huge number | `Invalid number` / `Number is too large` |
| Unknown identifier | `Unknown name "<name>"` |
| Unknown character | `Unexpected character "<char>"` |
| Trailing tokens | `Unexpected input` |
| Missing `)` / `(` | `Missing closing parenthesis` / `Expected "(" after <fn>` |
| Division by zero | `Division by zero` |
| Bad factorial | `Factorial needs a non-negative integer` / `Factorial result is too large` |
| `tan` at 90°/π/2 | `tan is undefined at this angle` |
| Non-finite result | `<fn> is undefined for this value` / `Result is not a finite number` |

### Security properties

- **No string evaluation.** There is no `eval`, no `Function`, no `setTimeout(string)`. Property access chains like `constructor.constructor` are impossible because identifiers can only be the whitelisted functions/constants.
- **Whitelisted identifiers.** An identifier that isn't a known constant or function throws immediately — it is never resolved against any object.
- **Bounded resource use.** The 500-character cap and the factorial cap (`≤170`) prevent runaway computation.
- **Enforced by lint.** `eslint.config.js` makes `no-eval` and `no-new-func` hard `error`s, so a future change can't silently reintroduce them.

### Extending the parser

To add a function (e.g. `cbrt`):

1. Add the name to the `FUNCTIONS` set and the `operations` map in `callFunction`.
2. Add a keyboard `data-value="cbrt("` button in `index.html` if it should be clickable.
3. Add `cbrt` to `FUNCTION_NAMES` in `input.js` so backspace removes it as one token.
4. Add unit tests in `tests/parser.test.js`.

See [Contributing](Contributing.md).

---

## 🇮🇷 فارسی

IVA Calculator Pro عبارت‌ها را با یک **پارسر بازگشتی دست‌نویس** در [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) ارزیابی می‌کند. این پارسر عمداً از `eval()` و `new Function()` پرهیز می‌کند تا ورودی نامعتبر هرگز نتواند کد اجرا کند. این صفحه دستور زبان، توکنایزر، الگوریتم ارزیابی و ویژگی‌های امنیتی را مستند می‌کند.

> **نقطهٔ ورود عمومی:** `calculate(expression, options)` → `number`.
> **نوع خطا:** `CalculatorError` (کلاس `Error` را گسترش می‌دهد و `position` اختیاری دارد).

### چرا نه `eval`؟

`eval` (و `new Function`) رشته‌های دلخواه را به‌عنوان جاوااسکریپت اجرا می‌کنند. حتی در حالت سندباکس‌شده این یک مسئولیت امنیتی است و خطاها را مبهم می‌کند. یک پارسر سفارشی:

- **نمی‌تواند کد اجرا کند** — هیچ اولیه‌وی اجرای کدی وجود ندارد. `process.exit()` فقط یک «Unknown name» است.
- **ورودی محدود دارد** — عبارت‌های بیش از ۵۰۰ کاراکتر از همان ابتدا رد می‌شوند.
- **خطاهای دقیق گزارش می‌دهد** — با موقعیت کاراکتر در صورت لزوم.

### خط لوله

```
رشتهٔ عبارت
      │
      ▼
  tokenize()     ──►  آرایه‌ای از توکن‌ها { type, value, position }
      │
      ▼
  Parser.parse() ──►  پیمایش بازگشتی → عدد
      │
      ▼
  (بررسی Number.isFinite) ──►  عدد  |  پرتاب CalculatorError
```

### دستور زبان

پارسر این دستور زبان با تقدم عملگرها را پیاده‌سازی می‌کند (محکم‌ترین پیوند در پایین):

```
expression  := additive
additive    := multiplicative  ( ('+' | '-') multiplicative )*
multiplicative := unary  ( ('*' | '/') unary
                            | پیش‌نمایی-unary )*        ← ضرب ضمنی
unary       := ('+' | '-') unary | power
power       := postfix ('^' unary)?                     ← راست‌پیوند، به unary می‌چسبد
postfix     := primary ( '!' | '%' )*
primary     := number | '(' additive ')'
             | 'pi' | 'e' | 'ans'
             | func '(' additive ')'
func        := sin | cos | tan | asin | acos | atan
             | sqrt | abs | ln | log | exp | floor | ceil | round
```

ویژگی‌های قابل‌توجه:

- **توان راست‌پیوند است.** `2^3^2` به‌صورت `2^(3^2) = 512` تفسیر می‌شود.
- **توان محکم‌تر از منفی یکانی می‌چسبد.** `-2^2` یعنی `-(2^2) = -4`.
- **توانِ توان به‌صورت `unary` تفسیر می‌شود**، پس `2^-2` بدون مورد خاص کار می‌کند (`-` ابتدا یک علامت یکانی است).
- **ضرب ضمنی** در قانون ضرب قرار دارد: بعد از یک مقدار، اگر توکن بعدی مقدار دیگری را آغاز کند (عدد/شناسه/`(`)، یک ضرب ضمنی است. پس `2pi`، `3(4+1)`، `2e3` همگی ضرب می‌شوند.
- **`!` و `%` پسوندی‌اند** و می‌توانند تکرار شوند (`5!!`، هرچند زود سرریز می‌شود).

### توکنایزر

`tokenize(source)` ورودی را نرمال‌سازی و توکن‌های نوع‌دار صادر می‌کند:

۱. **نرمال‌سازی کاراکترهای نمایش:** `×→*`، `÷→/`، `−→-`، `π→pi`، `√→sqrt`.
۲. **اعداد:** ارقام با یک `.` اختیاری و پسوند علمی اختیاری `E[+-]?digits`. مهم اینکه **نماد علمی از `E` بزرگ استفاده می‌کند** — `e` کوچک هرگز بخشی از عدد نیست، پس همیشه عدد اویلر است. `2E3` = 2000؛ `2e3` = `2 × e × 3`.
۳. **شناسه‌ها:** دنباله‌ای از حروف/زیرخط، با حروف کوچک — با مجموعهٔ توابع و ثابت‌های `pi`/`e`/`ans` تطبیق داده می‌شوند.
۴. **عملگرها:** یکی از `+ - * / ^ ( ) ! %`.
۵. **sentinel eof** در انتها.
۶. **محدود:** ورودی‌های بیش از ۵۰۰ کاراکتر، اعداد نامعتبر، اعداد بیش از حد بزرگ برای متناهی‌بودن و کاراکترهای غیرمنتظره را رد می‌کند (با نقل کاراکتر مخرب در پیام).

### مدیریت زاویه

توابع مثلثاتی ECMAScript از رادیان استفاده می‌کنند. پارسر **فقط در مرز فراخوانی تابع** در `callFunction` تبدیل می‌کند:

- `toRad(x)` = حالت `deg` ? `(x % 360) * π/180` : `x`
- `fromRad(x)` = حالت `deg` ? `x * 180/π` : `x`

`sin`/`cos` از `toRad` و `asin`/`acos`/`atan` از `fromRad` استفاده می‌کنند. یک `cleanTrig` کوچک نویز نزدیک‌به‌صفر/±۱ را به مقادیر دقیق می‌چسباند و `clampUnit` ورودی‌هایی مثل `asin(1.0000000000001)` را می‌بخشد.

### مرجع توابع

| تابع | رفتار | مثال | نتیجه |
|---|---|---|---|
| `sin`, `cos`, `tan` | مثلثات (آگاه از حالت زاویه)؛ `tan` 90°/π/2 را رد می‌کند | `sin(30)` | `0.5` |
| `asin`, `acos`, `atan` | مثلثات معکوس (به‌زاویهٔ حالت فعلی برمی‌گردد)؛ ورودی به [-1,1] محدود | `asin(1)` | `90` (درجه) |
| `sqrt` | ریشهٔ دوم؛ منفی را رد می‌کند | `sqrt(81)` | `9` |
| `abs` | قدرمطلق | `abs(-9)` | `9` |
| `ln` | لگاریتم طبیعی؛ ≤ 0 را رد می‌کند | `ln(e)` | `1` |
| `log` | لگاریتم پایه ۱۰؛ ≤ 0 را رد می‌کند | `log(100)` | `2` |
| `exp` | e^x | `exp(1)` | `2.718…` |
| `floor`, `ceil`, `round` | گردکردن | `round(2.6)` | `3` |
| `!` (پسوندی) | فاکتوریل؛ فقط اعداد صحیح نامنفی، ≤ 170 | `5!` | `120` |
| `%` (پسوندی) | تقسیم بر ۱۰۰ | `50%` | `0.5` |
| `^` | توان (راست‌پیوند) | `2^10` | `1024` |
| `pi`, `e`, `ans` | ثابت‌ها / آخرین نتیجه | `2*pi` | `6.283…` |

### طبقه‌بندی خطاها

همهٔ خطاها نمونه‌ای از `CalculatorError` هستند و پیام قابل‌خواندن (و `position` در صورت لزوم) دارند. رابط هر استثنای غیر-`CalculatorError` را به یک پیام عمومی «Could not calculate this expression» نگاشت می‌کند.

| شرط | پیام |
|---|---|
| ورودی خالی | `Enter an expression` |
| بیش از حد طولانی (›۵۰۰ کاراکتر) | `Expression is too long` |
| ورودی غیرمتنی | `Expression must be text` |
| عدد بد / عدد بزرگ | `Invalid number` / `Number is too large` |
| شناسهٔ ناشناخته | `Unknown name "<name>"` |
| کاراکتر ناشناخته | `Unexpected character "<char>"` |
| توکن‌های اضافی | `Unexpected input` |
| فقدان `)` / `(` | `Missing closing parenthesis` / `Expected "(" after <fn>` |
| تقسیم بر صفر | `Division by zero` |
| فاکتوریل بد | `Factorial needs a non-negative integer` / `Factorial result is too large` |
| `tan` در 90°/π/2 | `tan is undefined at this angle` |
| نتیجهٔ نامتناهی | `<fn> is undefined for this value` / `Result is not a finite number` |

### ویژگی‌های امنیتی

- **بدون ارزیابی رشته‌ای.** هیچ `eval`، هیچ `Function`، هیچ `setTimeout(string)` وجود ندارد. زنجیره‌های دسترسی به ویژگی مثل `constructor.constructor` غیرممکن‌اند چون شناسه‌ها فقط می‌توانند توابع/ثابت‌های فهرست‌مجاز باشند.
- **شناسه‌های فهرست‌مجاز.** شناسه‌ای که ثابت یا تابع شناخته‌شده نیست، بلافاصله خطا می‌دهد — هرگز بر اساس هیچ شیئی حل نمی‌شود.
- **مصرف منبع محدود.** سقف ۵۰۰ کاراکتر و سقف فاکتوریل (`≤170`) از محاسبهٔ فراری جلوگیری می‌کنند.
- **اعمال‌شده با lint.** `eslint.config.js` از `no-eval` و `no-new-func` به‌عنوان `error` سخت استفاده می‌کند، تا یک تغییر آینده نتواند بی‌صدا آن‌ها را بازگرداند.

### گسترش پارسر

برای افزودن یک تابع (مثلاً `cbrt`):

۱. نام را به مجموعهٔ `FUNCTIONS` و نقشهٔ `operations` در `callFunction` اضافه کنید.
۲. اگر باید قابل‌کلیک باشد، یک دکمه با `data-value="cbrt("` در `index.html` اضافه کنید.
۳. `cbrt` را به `FUNCTION_NAMES` در `input.js` اضافه کنید تا Backspace آن را به‌عنوان یک توکن حذف کند.
۴. تست‌های واحد در `tests/parser.test.js` اضافه کنید.

به [مشارکت](Contributing.md) مراجعه کنید.

---

<div align="center">

<sub>⬅️ [Architecture](Architecture.md) · [API](API.md) ➡️</sub>

</div>
