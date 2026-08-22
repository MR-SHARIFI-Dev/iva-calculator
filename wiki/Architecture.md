# 🏗 Architecture / معماری

> 🇬🇧 How the codebase is organized and why.
> 🇮🇷 کدبیس چگونه سازمان‌دهی شده و چرا.

---

## 🇬🇧 English

### Design goals

1. **No build step, no runtime dependencies.** The app is plain ES modules served as-is.
2. **Pure, testable logic.** The calculation core has zero DOM dependencies, so it is unit-testable in Node.
3. **Safe by construction.** No `eval`/`Function`; the parser is the only evaluation path.
4. **Resilient.** Storage failures and hostile environments must never crash the UI.

### The module split

```
index.html ──► src/app.js   (UI controller & app state — the only module that touches the DOM)
                  │
                  ├──► src/input.js   (pure rules: which token may follow the current expression)
                  ├──► src/format.js  (pure formatting: numbers ↔ display text, pretty expressions)
                  └──► src/parser.js  (pure engine: tokenize → recursive-descent evaluate)

sw.js ───────► Service worker (network-first cache, versioned keys, offline shell)
```

The key decision: **`input.js`, `format.js`, and `parser.js` are pure.** They export functions, hold no state, and never reference `document`, `window`, or `localStorage`. Only `app.js` owns the DOM and persistence. This means the entire calculation pipeline can be exercised in Node without a browser — which is exactly what the unit tests do.

### Module responsibilities

| Module | Responsibility | State? | DOM? |
|---|---|---|---|
| [`parser.js`](Parser.md) | Tokenize an expression string and evaluate it to a number. Throws `CalculatorError` on invalid input. | none | none |
| [`input.js`](#input-rules) | Decide whether a given token may be appended to the current expression (the "input editor"). | none | none |
| [`format.js`](#formatting) | Convert numbers to display strings (and back) and prettify expressions for the display. | none | none |
| `app.js` | Wire the modules to the DOM: render, keyboard, mouse, history, theme, PWA. | app state | yes |
| `sw.js` | Cache the app shell, serve offline, self-update on new deploys. | cache | no |

### Data flow (one keystroke)

```
user presses a key
      │
      ▼
app.js keydown handler  ──►  input.js appendToken(expr, token)   ← may reject (returns unchanged expr)
      │
      ▼
parser.js calculate(expr, {angleMode, ans})  ──►  number   (wrapped in try/catch for live preview)
      │
      ▼
format.js formatNumber(result)  +  prettyExpression(expr)
      │
      ▼
app.js render()  ──►  DOM (#expression, #result, operator button disabled-states)
```

- **Typing** calls `appendToken` (input rules) then `calculate` for a **live preview**. A failed parse during typing is expected and silently ignored.
- **`=`** calls `closeOpenParentheses` then `calculate`; on success it pushes an entry to history, collapses the editable expression to the formatted result, and sets `justCalculated`.
- **Backspace** calls `deleteLastToken`, which removes a whole function name or named value (e.g. `asin(` or `pi`) in one step, not character by character.

### App state

`app.js` keeps a single `state` object:

```js
const state = {
  expression: '',        // the raw, parser-ready string being edited
  result: 0,             // the current preview/result value
  ans: <last result>,    // reused by the Ans button and ans identifier
  justCalculated: false, // whether "=" was just pressed (controls next-token behavior)
  angleMode: 'deg'|'rad',
  history: [...]         // up to 20 entries: { expression, result, time }
};
```

`justCalculated` is the fulcrum of the "what happens after `=`" logic: an operator continues from the result, while a digit/constant/function **starts a new expression** (decided by `input.js#startsNewExpression`).

### Persistence layer

`localStorage` is wrapped in a tiny `storage` helper where **every** call is `try/catch`-guarded. This keeps the app working in sandboxed `<iframe>`s and private-browsing modes where `localStorage` throws. On boot:

- `iva-theme` → preferred color scheme (falls back to `prefers-color-scheme`).
- `iva-angle` → `deg` (default) or `rad`.
- `iva-history` → JSON array, **validated and filtered** on read so corrupt or legacy data can't break the UI.

### Input rules

`input.js` is a small state machine that keeps the edited expression valid at all times, so the parser is never asked to handle garbage. Highlights:

- Consecutive binary operators are ignored (strict mode) — but `-` is allowed after `(` and `^` for unary negatives and negative exponents.
- Only one decimal point per numeric literal; decimals inside scientific notation (`2E3.`) are blocked.
- `)` is only inserted if there's an unmatched `(`.
- `!` and `%` only attach to things that can be a value, and implicit multiplication is **not** inserted after them.

### Formatting

`format.js` guarantees a **round-trip**: `calculate(formatNumber(x)) ≈ x`. Two rules make this work:

- Scientific output uses an **uppercase `E`** (`1E+21`) so it can never be confused with Euler's `e`.
- `-0` is formatted as `0` so the display never shows a minus sign on zero.

`prettyExpression` is purely cosmetic — it adds spaces around operators, swaps `pi`→`π`, `sqrt`→`√`, and uses the proper minus sign `−` for display, without changing what the parser receives.

### Service worker strategy

`sw.js` uses **versioned cache keys** (`iva-calculator-v3.3.1`) and a **network-first** fetch handler: every request tries the network first and updates the cache on success; if the network fails it falls back to the cache, and for navigation requests it serves a dedicated offline shell. On `activate`, old caches are deleted and open tabs are navigated to the new version once. This avoids the classic "stale PWA hides my bug fix" problem.

### Why no framework?

A scientific calculator's UI is small and stable. A framework would add weight, a build pipeline, and a supply chain — for no real gain. Vanilla ES modules + CSS custom properties deliver the same reactive feel (live preview, theme switching, disabled-state binding) in a few hundred lines that anyone can audit.

---

## 🇮🇷 فارسی

### اهداف طراحی

۱. **بدون build، بدون وابستگی زمان اجرا.** برنامه ماژول‌های ES ساده است که همان‌طور سرو می‌شوند.
۲. **منطق خالص و قابل‌تست.** هستهٔ محاسبه هیچ وابستگی به DOM ندارد، پس در Node قابل تست واحد است.
۳. **امن در ساختار.** بدون `eval`/`Function`؛ پارسر تنها مسیر ارزیابی است.
۴. **تاب‌آور.** خرابی ذخیره‌سازی و محیط‌های خصمانه هرگز نباید رابط را کرش کنند.

### تقسیم ماژول

```
index.html ──► src/app.js   (کنترل‌کنندهٔ رابط و وضعیت — تنها ماژولی که DOM را لمس می‌کند)
                  │
                  ├──► src/input.js   (قوانین خالص: کدام توکن بعد از عبارت فعلی مجاز است)
                  ├──► src/format.js  (قالب‌بندی خالص: اعداد ↔ متن نمایش، زیباسازی عبارت)
                  └──► src/parser.js  (موتور خالص: توکنایز → ارزیابی بازگشتی)

sw.js ───────► سرویس‌ورکر (کش network-first، کلیدهای نسخه‌دار، پوستهٔ آفلاین)
```

تصمیم کلیدی: **`input.js`، `format.js` و `parser.js` خالص هستند.** تابع صادر می‌کنند، حالتی نگه نمی‌دارند و هرگز به `document`، `window` یا `localStorage` ارجاع نمی‌دهند. فقط `app.js` مالک DOM و ماندگاری است. یعنی کل خط لولهٔ محاسبه را می‌توان در Node بدون مرورگر اجرا کرد — دقیقاً همان کاری که تست‌های واحد می‌کنند.

### مسئولیت‌های ماژول‌ها

| ماژول | مسئولیت | حالت؟ | DOM؟ |
|---|---|---|---|
| [`parser.js`](Parser.md) | توکنایز یک رشتهٔ عبارت و ارزیابی آن به عدد. `CalculatorError` هنگام ورودی نامعتبر. | ندارد | ندارد |
| [`input.js`](#قوانین-ورودی) | تصمیم‌گیری دربارهٔ افزودن یک توکن به عبارت فعلی (ویرایشگر ورودی). | ندارد | ندارد |
| [`format.js`](#قالب‌بندی) | تبدیل اعداد به رشتهٔ نمایش (و برعکس) و زیباسازی عبارت‌ها. | ندارد | ندارد |
| `app.js` | اتصال ماژول‌ها به DOM: render، صفحه‌کلید، ماوس، تاریخچه، تم، PWA. | وضعیت برنامه | بله |
| `sw.js` | کش پوستهٔ برنامه، سرو آفلاین، خودبه‌روزرسانی هنگام استقرار. | کش | ندارد |

### جریان داده (یک فشردن کلید)

```
کاربر کلیدی را فشار می‌دهد
      │
      ▼
مدیر keydown در app.js  ──►  input.js appendToken(expr, token)   ← ممکن است رد کند (عبارت را تغییر‌نداده برمی‌گرداند)
      │
      ▼
parser.js calculate(expr, {angleMode, ans})  ──►  عدد   (داخل try/catch برای پیش‌نمایش زنده)
      │
      ▼
format.js formatNumber(result)  +  prettyExpression(expr)
      │
      ▼
app.js render()  ──►  DOM (#expression، #result، حالت غیرفعال دکمه‌های عملگر)
```

- **تایپ** ابتدا `appendToken` (قوانین ورودی) و سپس `calculate` را برای **پیش‌نمایش زنده** صدا می‌زند. شکست پارس هنگام تایپ طبیعی است و بی‌صدا نادیده گرفته می‌شود.
- **`=`** ابتدا `closeOpenParentheses` و سپس `calculate` را صدا می‌زند؛ در صورت موفقیت یک مورد به تاریخچه اضافه می‌کند، عبارت قابل‌ویرایش را به نتیجهٔ قالب‌شده فرومی‌کاهد و `justCalculated` را تنظیم می‌کند.
- **Backspace** از `deleteLastToken` استفاده می‌کند که نام یک تابع کامل یا مقدار نام‌دار (مثل `asin(` یا `pi`) را در یک گام حذف می‌کند، نه کاراکتر‌به‌کاراکتر.

### وضعیت برنامه

`app.js` یک شیء `state` نگه می‌دارد:

```js
const state = {
  expression: '',        // رشتهٔ خام و آمادهٔ پارسر که در حال ویرایش است
  result: 0,             // مقدار پیش‌نمایش/نتیجهٔ فعلی
  ans: <آخرین نتیجه>,    // توسط دکمه Ans و شناسهٔ ans استفاده می‌شود
  justCalculated: false, // آیا دقیقاً «=» فشرده شده (رفتار توکن بعدی را کنترل می‌کند)
  angleMode: 'deg'|'rad',
  history: [...]         // تا ۲۰ مورد: { expression, result, time }
};
```

`justCalculated` محور منطق «بعد از `=` چه اتفاقی بیفتد» است: یک عملگر از نتیجه ادامه می‌دهد، در حالی که یک رقم/ثابت/تابع یک **عبارت جدید** را آغاز می‌کند (که توسط `input.js#startsNewExpression` تصمیم می‌شود).

### لایهٔ ماندگاری

`localStorage` در یک کمک‌کنندهٔ کوچک `storage` پیچیده شده که **هر** فراخوانی آن با `try/catch` محافظت می‌شود. این کار اجرای برنامه را در `<iframe>`های سندباکس‌شده و حالت‌های مرور خصوصی که `localStorage` پرتاب می‌کند، حفظ می‌کند. هنگام بوت:

- `iva-theme` → طرح رنگ ترجیحی (با بازگشت به `prefers-color-scheme`).
- `iva-angle` → `deg` (پیش‌فرض) یا `rad`.
- `iva-history` → آرایهٔ JSON که هنگام خواندن **اعتبارسنجی و فیلتر** می‌شود تا دادهٔ خراب یا قدیمی نتواند رابط را بشکند.

### قوانین ورودی

`input.js` یک ماشین حالت کوچک است که عبارت ویرایش‌شده را همیشه معتبر نگه می‌دارد، تا پارسر هرگز با زباله مواجه نشود. نکات کلیدی:

- عملگرهای دوتایی متوالی نادیده گرفته می‌شوند (حالت سخت‌گیرانه) — اما `-` بعد از `(` و `^` برای منفی یکانی و توان منفی مجاز است.
- فقط یک نقطهٔ اعشار در هر لفظ عددی؛ اعشار داخل نماد علمی (`2E3.`) مسدود می‌شود.
- `)` فقط وقتی درج می‌شود که `(` بازِ جفت‌نشده وجود داشته باشد.
- `!` و `%` فقط به چیزهایی می‌چسبند که می‌توانند مقدار باشند، و ضرب ضمنی بعد از آن‌ها **درج نمی‌شود**.

### قالب‌بندی

`format.js` یک **رفت‌وبرگشت** تضمین می‌کند: `calculate(formatNumber(x)) ≈ x`. دو قانون این کار را ممکن می‌کند:

- خروجی علمی از **`E` بزرگ** استفاده می‌کند (`1E+21`) تا هرگز با `e` اویلر اشتباه نشود.
- `-0` به‌صورت `0` قالب می‌شود تا نمایش هرگز علامت منفی روی صفر نشان ندهد.

`prettyExpression` صرفاً ظاهری است — فاصلهٔ دور عملگرها می‌گذارد، `pi`→`π` و `sqrt`→`√` را تعویض می‌کند و از علامت منفی مناسب `−` برای نمایش استفاده می‌کند، بدون آنکه چیزی که پارسر دریافت می‌کند تغییر کند.

### استراتژی سرویس‌ورکر

`sw.js` از **کلیدهای کش نسخه‌دار** (`iva-calculator-v3.3.1`) و یک مدیریت fetch با رویکرد **network-first** استفاده می‌کند: هر درخواست ابتدا شبکه را امتحان می‌کند و در صورت موفقیت کش را به‌روز می‌کند؛ اگر شبکه شکست خورد به کش برمی‌گردد و برای درخواست‌های ناوبری یک پوستهٔ آفلاین اختصاصی سرو می‌کند. هنگام `activate`، کش‌های قدیمی حذف و زبانه‌های باز یک‌بار به نسخهٔ جدید هدایت می‌شوند. این کار مشکل کلاسیک «PWA قدیمی، رفع باگ مرا پنهان می‌کند» را حل می‌کند.

### چرا بدون فریم‌ورک؟

رابط یک ماشین‌حساب علمی کوچک و پایدار است. یک فریم‌ورک وزن، خط لولهٔ build و یک زنجیرهٔ تأمین اضافه می‌کرد — بدون سود واقعی. ماژول‌های ES خالص + CSS Custom Properties همان حس واکنشی (پیش‌نمایش زنده، تعویض تم، انقیاد حالت غیرفعال) را در چندصد خط delivers می‌کنند که هرکس می‌تواند حسابرسی کند.

---

<div align="center">

<sub>⬅️ [Installation](Installation.md) · [Parser](Parser.md) ➡️</sub>

</div>
