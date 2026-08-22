# 🧩 API Reference / مرجع API

> 🇬🇧 How to use the calculation engine programmatically.
> 🇮🇷 نحوهٔ استفادهٔ برنامه‌نویسی از موتور محاسبه.

---

## 🇬🇧 English

The calculation engine lives in [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) and exports two symbols. The input/format helpers live in [`src/input.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/input.js) and [`src/format.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/format.js). All four are **pure** — no DOM, no side effects, safe to import in Node or any bundler.

### `calculate(expression, options?)` → `number`

Evaluates a math expression string and returns the result. Throws `CalculatorError` on invalid input.

```js
import { calculate } from './src/parser.js';

calculate('2 + 3 * 4');                       // 14
calculate('(2 + 3) * 4');                     // 20
calculate('2^3^2');                           // 512  (right-associative)
calculate('5!');                              // 120
calculate('50% * 200');                       // 100
calculate('2pi');                             // 6.28318530718  (implicit mult)
calculate('sin(30)');                         // 0.5  (DEG by default)
calculate('sin(pi/2)', { angleMode: 'rad' }); // 1
calculate('2E3');                             // 2000 (scientific notation, uppercase E)
calculate('2e3');                             // 16.3096909708  (lowercase e = Euler)
calculate('ans * 2', { ans: 21 });            // 42
```

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `options.angleMode` | `'deg' \| 'rad'` | `'deg'` | Angle unit for trig functions. Anything other than `'rad'` is treated as `'deg'`. |
| `options.ans` | `number` | `0` | The value bound to the `ans` identifier. Non-finite values fall back to `0`. |

#### Throws

- `CalculatorError` for any invalid expression (see the [Parser error taxonomy](Parser.md#error-taxonomy)).
- `CalculatorError` (not a RangeError) for domain errors like `2/0`, `sqrt(-1)`, `tan(90)`, `log(0)`.

### `CalculatorError`

```js
import { calculate, CalculatorError } from './src/parser.js';

try {
  calculate('2 / 0');
} catch (error) {
  if (error instanceof CalculatorError) {
    console.error(error.message);  // "Division by zero"
    console.error(error.position); // null or a character index
  }
}
```

Extends `Error`; sets `name = 'CalculatorError'`; carries an optional `position` (character index) for tokenization/parse errors.

### Input helpers — `src/input.js`

These keep an in-progress expression valid as the user types. They are what `app.js` uses on every keystroke and button press.

```js
import {
  appendToken,
  deleteLastToken,
  closeOpenParentheses,
  isBinaryOperator,
  startsNewExpression
} from './src/input.js';

appendToken('12+', '*');        // '12+'        — consecutive operators ignored (strict)
appendToken('2^', '-');         // '2^-'        — minus allowed after '^' (negative exponent)
appendToken('1.2', '.');        // '1.2'        — duplicate decimal blocked
appendToken('5!', '3');         // '5!'         — implicit mult after postfix blocked
appendToken('(2+3', ')');       // '(2+3)'      — ')' only when an '(' is open

deleteLastToken('2+sin(');      // '2+'         — removes a whole function name
deleteLastToken('2+pi');        // '2+'         — removes a whole named value
deleteLastToken('123');         // '12'

closeOpenParentheses('sin(30'); // 'sin(30)'    — balances '(' on '='

isBinaryOperator('-');          // true
startsNewExpression('7');       // true   (a digit starts a fresh expression after '=')
startsNewExpression('+');       // false  (an operator continues from the previous result)
```

### Format helpers — `src/format.js`

`formatNumber` produces **parser-readable** text, so `calculate(formatNumber(x)) ≈ x` always holds.

```js
import { formatNumber, prettyExpression } from './src/format.js';

formatNumber(0);                // '0'
formatNumber(-0);               // '0'         (never shows a minus on zero)
formatNumber(0.1 + 0.2);        // '0.3'       (precision cleaned to 12 sig figs)
formatNumber(1e20);             // '1E+20'     (uppercase E, never confused with Euler)
formatNumber(2.5e-8);           // '0.000000025'
formatNumber(123456789012);     // '123456789012'

prettyExpression('2+3*4');      // '2 + 3 × 4'
prettyExpression('2pi');        // '2π'
prettyExpression('sqrt(9)');    // '√(9)'
prettyExpression('1E+21');      // '1E+21'
```

`prettyExpression` is **display-only** — it never changes the raw string passed to the parser.

### Node usage example

```js
import { calculate } from './src/parser.js';

const expressions = ['sin(pi/4)^2 + cos(pi/4)^2', '2^10', 'e^(i*pi)'];
for (const expr of expressions) {
  try { console.log(expr, '=>', calculate(expr, { angleMode: 'rad' })); }
  catch (e) { console.log(expr, '=> ERROR:', e.message); }
}
// e^(i*pi) => ERROR: Unknown name "i"
```

> `i` (imaginary unit) is not supported — IVA Calculator works strictly in the **real** domain.

---

## 🇮🇷 فارسی

موتور محاسبه در [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) قرار دارد و دو نماد صادر می‌کند. کمک‌کننده‌های ورودی/قالب در [`src/input.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/input.js) و [`src/format.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/format.js) هستند. هر چهار **خالص** هستند — بدون DOM، بدون عارضه جانبی، ایمن برای import در Node یا هر باندلر.

### `calculate(expression, options?)` → `number`

یک رشتهٔ عبارت ریاضی را ارزیابی و نتیجه را برمی‌گرداند. هنگام ورودی نامعتبر `CalculatorError` پرتاب می‌کند.

```js
import { calculate } from './src/parser.js';

calculate('2 + 3 * 4');                       // 14
calculate('(2 + 3) * 4');                     // 20
calculate('2^3^2');                           // 512  (راست‌پیوند)
calculate('5!');                              // 120
calculate('50% * 200');                       // 100
calculate('2pi');                             // 6.28318530718  (ضرب ضمنی)
calculate('sin(30)');                         // 0.5  (پیش‌فرض DEG)
calculate('sin(pi/2)', { angleMode: 'rad' }); // 1
calculate('2E3');                             // 2000 (نماد علمی، E بزرگ)
calculate('2e3');                             // 16.3096909708  (e کوچک = اویلر)
calculate('ans * 2', { ans: 21 });            // 42
```

#### گزینه‌ها

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `options.angleMode` | `'deg' \| 'rad'` | `'deg'` | واحد زاویه برای توابع مثلثاتی. هر چیزی غیر از `'rad'` به‌عنوان `'deg'` در نظر گرفته می‌شود. |
| `options.ans` | `number` | `0` | مقدار مقید به شناسهٔ `ans`. مقادیر نامتناهی به `0` برمی‌گردند. |

#### پرتاب‌ها

- `CalculatorError` برای هر عبارت نامعتبر (به [طبقه‌بندی خطای پارسر](Parser.md#error-taxonomy) مراجعه کنید).
- `CalculatorError` (نه RangeError) برای خطاهای دامنه مثل `2/0`، `sqrt(-1)`، `tan(90)`، `log(0)`.

### `CalculatorError`

```js
import { calculate, CalculatorError } from './src/parser.js';

try {
  calculate('2 / 0');
} catch (error) {
  if (error instanceof CalculatorError) {
    console.error(error.message);  // "Division by zero"
    console.error(error.position); // null یا یک اندیس کاراکتر
  }
}
```

کلاس `Error` را گسترش می‌دهد؛ `name = 'CalculatorError'`؛ یک `position` اختیاری (اندیس کاراکتر) برای خطاهای توکنایز/پارس دارد.

### کمک‌کننده‌های ورودی — `src/input.js`

این‌ها یک عبارت در حال انجام را هنگام تایپ کاربر معتبر نگه می‌دارند. `app.js` در هر فشردن کلید و دکمه از آن‌ها استفاده می‌کند.

```js
import {
  appendToken,
  deleteLastToken,
  closeOpenParentheses,
  isBinaryOperator,
  startsNewExpression
} from './src/input.js';

appendToken('12+', '*');        // '12+'        — عملگرهای متوالی نادیده (سخت‌گیرانه)
appendToken('2^', '-');         // '2^-'        — منفی بعد از '^' مجاز (توان منفی)
appendToken('1.2', '.');        // '1.2'        — اعشار مضاعف مسدود
appendToken('5!', '3');         // '5!'         — ضرب ضمنی بعد از پسوندی مسدود
appendToken('(2+3', ')');       // '(2+3)'      — ')' فقط وقتی '(' باز است

deleteLastToken('2+sin(');      // '2+'         — کل نام تابع را حذف می‌کند
deleteLastToken('2+pi');        // '2+'         — کل مقدار نام‌دار را حذف می‌کند
deleteLastToken('123');         // '12'

closeOpenParentheses('sin(30'); // 'sin(30)'    — '(' را هنگام '=' موازنه می‌کند

isBinaryOperator('-');          // true
startsNewExpression('7');       // true   (یک رقم بعد از '=' عبارت جدید را آغاز می‌کند)
startsNewExpression('+');       // false  (یک عملگر از نتیجهٔ قبلی ادامه می‌دهد)
```

### کمک‌کننده‌های قالب — `src/format.js`

`formatNumber` متن **قابل‌خواندن برای پارسر** تولید می‌کند، پس `calculate(formatNumber(x)) ≈ x` همیشه برقرار است.

```js
import { formatNumber, prettyExpression } from './src/format.js';

formatNumber(0);                // '0'
formatNumber(-0);               // '0'         (هرگز منفی روی صفر نشان نمی‌دهد)
formatNumber(0.1 + 0.2);        // '0.3'       (دقت به ۱۲ رقم مؤثر پاک می‌شود)
formatNumber(1e20);             // '1E+20'     (E بزرگ، هرگز با اویلر اشتباه نمی‌شود)
formatNumber(2.5e-8);           // '0.000000025'
formatNumber(123456789012);     // '123456789012'

prettyExpression('2+3*4');      // '2 + 3 × 4'
prettyExpression('2pi');        // '2π'
prettyExpression('sqrt(9)');    // '√(9)'
prettyExpression('1E+21');      // '1E+21'
```

`prettyExpression` **صرفاً نمایشی** است — هرگز رشتهٔ خام ارسال‌شده به پارسر را تغییر نمی‌دهد.

### مثال استفاده در Node

```js
import { calculate } from './src/parser.js';

const expressions = ['sin(pi/4)^2 + cos(pi/4)^2', '2^10', 'e^(i*pi)'];
for (const expr of expressions) {
  try { console.log(expr, '=>', calculate(expr, { angleMode: 'rad' })); }
  catch (e) { console.log(expr, '=> ERROR:', e.message); }
}
// e^(i*pi) => ERROR: Unknown name "i"
```

> `i` (یکه موهومی) پشتیبانی نمی‌شود — IVA Calculator منحصراً در دامنهٔ **حقیقی** کار می‌کند.

---

<div align="center">

<sub>⬅️ [Parser](Parser.md) · [Keyboard Shortcuts](Keyboard-Shortcuts.md) ➡️</sub>

</div>
