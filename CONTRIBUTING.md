# 🤝 Contributing to IVA Calculator Pro / مشارکت در IVA Calculator Pro

> 🇬🇧 Thanks for your interest in improving IVA Calculator Pro!
> 🇮🇷 از علاقهٔ شما به بهبود IVA Calculator Pro سپاسگزاریم!

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Kourosh242/iva-calculator/pulls)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🇬🇧 English

This is the quick checklist. For the full guide, see the [Contributing wiki page](docs/wiki/Contributing.md).

### Ground rules

1. **Stay dependency-free.** Do not add runtime dependencies — the app ships zero by design.
2. **Never introduce `eval` or `Function`.** These are ESLint `error`s and a hard review block. The parser is the only evaluation path.
3. **Keep the core pure.** DOM access belongs in `app.js`; `parser.js`, `input.js`, `format.js` must stay side-effect-free so they remain unit-testable.
4. **Test what you add.** New operator/function → parser tests. New input rule → input tests. New user-visible behavior → an e2e test.
5. **Match the style.** ES modules, `===` everywhere, small focused functions, comments that explain *why*.

### Workflow

```bash
git checkout -b feat/my-feature
# …make changes…
npm run verify          # lint + unit + e2e — must pass
git commit -m "feat: add cbrt() cube-root function"
git push -u origin feat/my-feature
# open a PR against `main`
```

Use commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

### Adding a function (quick example)

1. Add the name to `FUNCTIONS` and a branch in `callFunction` (`src/parser.js`).
2. Add it to `FUNCTION_NAMES` (`src/input.js`) so backspace removes it as one token.
3. Optionally add a button in `index.html`.
4. Add parser tests in `tests/parser.test.js`.
5. Update the [Features](docs/wiki/Features.md) and [Parser](docs/wiki/Parser.md) tables and the [Changelog](docs/wiki/Changelog.md).

### Reporting bugs

Open an [issue](https://github.com/Kourosh242/iva-calculator/issues) with: the exact expression, steps to reproduce, expected vs actual result, browser + OS, and mouse vs keyboard.

### Code of conduct

Be kind and constructive. Assume good faith. Focus on the work, not the person.

---

## 🇮🇷 فارسی

این یک چک‌لیست سریع است. برای راهنمای کامل به [صفحهٔ مشارکت در ویکی](docs/wiki/Contributing.md) مراجعه کنید.

### قوانین اساسی

۱. **بدون‌وابستگی بمانید.** وابستگی زمان اجرا اضافه نکنید — برنامه طبق طراحی هیچ‌کدام ندارد.
۲. **هرگز `eval` یا `Function` وارد نکنید.** این‌ها خطای ESLint و یک مانعٔ سخت در بازبینی هستند. پارسر تنها مسیر ارزیابی است.
۳. **هسته را خالص نگه دارید.** دسترسی DOM متعلق به `app.js` است؛ `parser.js`، `input.js`، `format.js` باید بدون عارضه جانبی بمانند تا قابل تست واحد باقی بمانند.
۴. **آنچه اضافه می‌کنید را تست کنید.** عملگر/تابع جدید → تست پارسر. قانون ورودی جدید → تست ورودی. رفتار جدید قابل‌مشاهده برای کاربر → یک تست e2e.
۵. **با سبک هماهنگ باشید.** ماژول‌های ES، `===` در همه‌جا، توابع کوچک و متمرکز، نظراتی که *چرایی* را توضیح می‌دهند.

### گردش کار

```bash
git checkout -b feat/my-feature
# …تغییرات…
npm run verify          # lint + واحد + e2e — باید سبز شود
git commit -m "feat: add cbrt() cube-root function"
git push -u origin feat/my-feature
# یک PR علیه `main` باز کنید
```

از پیشوندهای commit استفاده کنید: `feat:`، `fix:`، `docs:`، `refactor:`، `test:`، `chore:`.

### افزودن یک تابع (مثال سریع)

۱. نام را به `FUNCTIONS` و یک شاخه به `callFunction` اضافه کنید (`src/parser.js`).
۲. آن را به `FUNCTION_NAMES` اضافه کنید (`src/input.js`) تا Backspace به‌عنوان یک توکن حذفش کند.
۳. در صورت تمایل یک دکمه در `index.html` اضافه کنید.
۴. تست‌های پارسر در `tests/parser.test.js` اضافه کنید.
۵. جداول [امکانات](docs/wiki/Features.md) و [پارسر](docs/wiki/Parser.md) و [تاریخچه](docs/wiki/Changelog.md) را به‌روز کنید.

### گزارش باگ

یک [issue](https://github.com/Kourosh242/iva-calculator/issues) با موارد زیر باز کنید: عبارت دقیق، مراحل بازتولید، نتیجهٔ مورد انتظار در برابر واقعی، مرورگر + سیستم‌عامل، و ماوس در برابر صفحه‌کلید.

### منشور رفتار

مهربان و سازنده باشید. حسن نیت را فرض کنید. روی کار تمرکز کنید، نه شخص.
