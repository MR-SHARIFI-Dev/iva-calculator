# 🤝 Contributing / مشارکت

> 🇬🇧 How to contribute to IVA Calculator Pro.
> 🇮🇷 نحوهٔ مشارکت در IVA Calculator Pro.

---

## 🇬🇧 English

Contributions are welcome — bug reports, fixes, new functions, docs, and translations. This page is the source of truth for the project's conventions; the shorter [`CONTRIBUTING.md`](https://github.com/Kourosh242/iva-calculator/blob/main/CONTRIBUTING.md) is a quick checklist.

### Ground rules

1. **Stay dependency-free.** Do not add runtime dependencies. The app ships zero of them by design.
2. **Never introduce `eval` or `Function`.** These are ESLint `error`s and a hard review block. The parser is the only evaluation path.
3. **Keep the core pure.** DOM access belongs in `app.js`. `parser.js`, `input.js`, `format.js` must stay side-effect-free so they remain unit-testable.
4. **Test what you add.** Every new operator or function gets parser tests; new input rules get input tests; new user-visible behavior gets an e2e test.
5. **Match the style.** ES modules, `===` everywhere, small focused functions, comments that explain *why*.

### Workflow

```bash
# 1. Fork & branch
git checkout -b feat/my-feature

# 2. Make your change, then run the full gate
npm run verify     # lint + unit + e2e

# 3. Commit with a clear message
git commit -m "feat: add cbrt() cube-root function"

# 4. Push and open a PR against main
git push -u origin feat/my-feature
```

Open the PR against the `main` branch. CI must pass before merge.

### Commit message conventions

Use a short prefix so history reads cleanly:

| Prefix | Use for |
|---|---|
| `feat:` | A new user-visible feature |
| `fix:` | A bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `test:` | Adding or correcting tests |
| `chore:` | Tooling, deps, CI, version bumps |

### Adding a new function (worked example: `cbrt`)

1. **Parser** — add `'cbrt'` to the `FUNCTIONS` set in [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) and a branch in the `operations` map of `callFunction`:
   ```js
   cbrt: () => Math.cbrt(value),
   ```
2. **Input** — add `'cbrt'` to `FUNCTION_NAMES` in [`src/input.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/input.js) so backspace removes it as one token.
3. **UI (optional)** — add a button in [`index.html`](https://github.com/Kourosh242/iva-calculator/blob/main/index.html): `<button data-value="cbrt(" class="key scientific">∛</button>`.
4. **Tests** — add cases to `tests/parser.test.js` (e.g. `['cbrt(27)', 3]`).
5. **Docs** — add a row to the function table in [Features](Features.md) and [Parser](Parser.md); add a keyboard row in [Keyboard Shortcuts](Keyboard-Shortcuts.md) if it's clickable.
6. **Changelog** — add an entry under an "Unreleased" or new version heading in [Changelog](Changelog.md).

### Adding a new constant or operator

Follow the same pattern: parser (tokenizer + grammar rule) → input rules → tests → docs. Constants are resolved in `primary()`; operators need a grammar rule and a precedence slot.

### Bumping the version

Version `3.3.1` is referenced in many files that must stay in sync (see [Development](Development.md#the-version-constant)). The `release.test.js` suite will fail if they drift. Create a `release/vX.Y.Z.md` note and a Changelog entry.

### Reporting bugs

Open an [issue](https://github.com/Kourosh242/iva-calculator/issues) and include:

- The exact expression and the steps to reproduce.
- The **expected** vs **actual** result.
- Browser + version, OS, and whether you used the mouse or keyboard.
- Any message shown in the result/status line or browser console.

### Translations

The docs and README are bilingual (English + Persian). If you add a section, please provide both languages. For UI string translations (future work), keep them in one place and update the corresponding docs.

### Code of conduct

Be kind and constructive. Assume good faith. Focus on the work, not the person.

---

## 🇮🇷 فارسی

از مشارکت شما استقبال می‌شود — گزارش باگ، رفع‌ها، توابع جدید، مستندات و ترجمه‌ها. این صفحه مرجع قراردادهای پروژه است؛ [`CONTRIBUTING.md`](https://github.com/Kourosh242/iva-calculator/blob/main/CONTRIBUTING.md) کوتاه‌تر یک چک‌لیست سریع است.

### قوانین اساسی

۱. **بدون‌وابستگی بمانید.** وابستگی زمان اجرا اضافه نکنید. برنامه طبق طراحی هیچ‌کدام ندارد.
۲. **هرگز `eval` یا `Function` وارد نکنید.** این‌ها خطای ESLint و یک مانعٔ سخت در بازبینی هستند. پارسر تنها مسیر ارزیابی است.
۳. **هسته را خالص نگه دارید.** دسترسی DOM متعلق به `app.js` است. `parser.js`، `input.js`، `format.js` باید بدون عارضه جانبی بمانند تا قابل تست واحد باقی بمانند.
۴. **آنچه اضافه می‌کنید را تست کنید.** هر عملگر یا تابع جدید تست‌های پارسر می‌گیرد؛ قوانین ورودی جدید تست ورودی می‌گیرند؛ رفتار جدید قابل‌مشاهده برای کاربر یک تست e2e می‌گیرد.
۵. **با سبک هماهنگ باشید.** ماژول‌های ES، `===` در همه‌جا، توابع کوچک و متمرکز، نظراتی که *چرایی* را توضیح می‌دهند.

### گردش کار

```bash
# ۱. Fork و شاخه
git checkout -b feat/my-feature

# ۲. تغییرتان را اعمال و سپس دریچهٔ کامل را اجرا کنید
npm run verify     # lint + واحد + e2e

# ۳. با پیام روشن commit کنید
git commit -m "feat: add cbrt() cube-root function"

# ۴. push کنید و یک PR علیه main باز کنید
git push -u origin feat/my-feature
```

PR را علیه شاخهٔ `main` باز کنید. CI پیش از merge باید سبز شود.

### قراردادهای پیام commit

از یک پیشوند کوتاه استفاده کنید تا تاریخچه تمیز خوانده شود:

| پیشوند | استفاده برای |
|---|---|
| `feat:` | یک ویژگی جدید قابل‌مشاهده برای کاربر |
| `fix:` | رفع یک باگ |
| `docs:` | فقط مستندات |
| `refactor:` | تغییر کد که نه باگ را رفع می‌کند نه ویژگی اضافه می‌کند |
| `test:` | افزودن یا اصلاح تست‌ها |
| `chore:` | ابزار، وابستگی‌ها، CI، ارتقای نسخه |

### افزودن یک تابع جدید (مثال کار شده: `cbrt`)

۱. **پارسر** — `'cbrt'` را به مجموعهٔ `FUNCTIONS` در [`src/parser.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/parser.js) و یک شاخه به نقشهٔ `operations` در `callFunction` اضافه کنید:
   ```js
   cbrt: () => Math.cbrt(value),
   ```
۲. **ورودی** — `'cbrt'` را به `FUNCTION_NAMES` در [`src/input.js`](https://github.com/Kourosh242/iva-calculator/blob/main/src/input.js) اضافه کنید تا Backspace آن را به‌عنوان یک توکن حذف کند.
۳. **رابط (اختیاری)** — یک دکمه در [`index.html`](https://github.com/Kourosh242/iva-calculator/blob/main/index.html) اضافه کنید: `<button data-value="cbrt(" class="key scientific">∛</button>`.
۴. **تست‌ها** — مواردی به `tests/parser.test.js` اضافه کنید (مثلاً `['cbrt(27)', 3]`).
۵. **مستندات** — یک ردیف به جدول توابع در [امکانات](Features.md) و [پارسر](Parser.md) اضافه کنید؛ اگر قابل‌کلیک است یک ردیف صفحه‌کلید در [میانبرهای صفحه‌کلید](Keyboard-Shortcuts.md) اضافه کنید.
۶. **تاریخچه** — یک مدخل زیر عنوان «Unreleased» یا نسخهٔ جدید در [تاریخچه](Changelog.md) اضافه کنید.

### افزودن ثابت یا عملگر جدید

همان الگو را دنبال کنید: پارسر (توکنایزر + قانون گرامر) → قوانین ورودی → تست‌ها → مستندات. ثابت‌ها در `primary()` حل می‌شوند؛ عملگرها نیاز به یک قانون گرامر و یک جایگاه تقدم دارند.

### ارتقای نسخه

نسخهٔ `3.3.1` در بسیاری از فایل‌ها ارجاع شده که باید همگام بمانند (به [توسعه](Development.md#ثابت-نسخه) مراجعه کنید). مجموعهٔ `release.test.js` اگر از هم بپاشند شکست می‌خورد. یک یادداشت `release/vX.Y.Z.md` و یک مدخل تاریخچه بسازید.

### گزارش باگ

یک [issue](https://github.com/Kourosh242/iva-calculator/issues) باز کنید و شامل:

- عبارت دقیق و مراحل بازتولید.
- نتیجهٔ **مورد انتظار** در برابر **واقعی**.
- مرورگر + نسخه، سیستم‌عامل، و اینکه از ماوس یا صفحه‌کلید استفاده کردید.
- هر پیام نشان‌داده‌شده در خط نتیجه/وضعیت یا کنسول مرورگر.

### ترجمه‌ها

مستندات و README دوزبانه (انگلیسی + فارسی) هستند. اگر بخشی اضافه می‌کنید، لطفاً هر دو زبان را ارائه دهید. برای ترجمهٔ رشته‌های رابط (کار آینده)، آن‌ها را در یک مکان نگه دارید و مستندات متناظر را به‌روز کنید.

### منشور رفتار

مهربان و سازنده باشید. حسن نیت را فرض کنید. روی کار تمرکز کنید، نه شخص.

---

<div align="center">

<sub>⬅️ [Testing](Testing.md) · [Privacy & Security](Privacy-and-Security.md) ➡️</sub>

</div>
