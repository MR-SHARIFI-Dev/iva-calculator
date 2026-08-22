<div align="center">

# 🧮 IVA Calculator Pro — Wiki / ویکی

**A private, dependency-free scientific calculator that runs entirely in the browser.**
**یک ماشین‌حساب علمی خصوصی و بدون‌وابستگی که کاملاً داخل مرورگر اجرا می‌شود.**

[![Version](https://img.shields.io/badge/version-3.3.1-f0c94e?logo=semver&logoColor=white)](Changelog.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Kourosh242/iva-calculator/blob/main/LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](Architecture.md)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)](Installation.md)

</div>

---

## 🇬🇧 English

Welcome to the official documentation for **IVA Calculator Pro**. This wiki is the complete, authoritative reference for the project — from a high-level overview down to the grammar of the expression parser.

### What is IVA Calculator Pro?

IVA Calculator Pro is a **modern, secure, dependency-free scientific calculator** built as a Progressive Web App. It evaluates expressions with a hand-written **recursive-descent parser** — never `eval()` or `new Function()` — so untrusted input cannot execute code. Every calculation runs locally and stays on your device.

### At a glance

| | |
|---|---|
| **Evaluation engine** | Hand-written recursive-descent parser ([Parser](Parser.md)) |
| **Runtime dependencies** | `0` — pure vanilla JS, HTML, CSS |
| **Data sent to servers** | `0` bytes ([Privacy & Security](Privacy-and-Security.md)) |
| **Installable / offline** | ✅ PWA with a self-updating service worker |
| **Languages** | Dark + light themes, full keyboard support |
| **Tested** | Unit + end-to-end ([Testing](Testing.md)) |

### Where do I start?

- 🚀 **Just want to run it?** → [Installation](Installation.md)
- 🧠 **Curious how it works?** → [Architecture](Architecture.md) → [Parser](Parser.md)
- 🧩 **Want to use the engine in code?** → [API](API.md)
- ⌨️ **Looking for key bindings?** → [Keyboard Shortcuts](Keyboard-Shortcuts.md)
- 🔐 **Worried about data?** → [Privacy & Security](Privacy-and-Security.md)
- 🛠 **Want to contribute?** → [Development](Development.md) → [Contributing](Contributing.md)
- ❓ **Stuck?** → [FAQ](FAQ.md)

### Feature tour

Trigonometry in DEG/RAD · powers · factorials · percentages · `π` and `e` constants · `Ans` recall · implicit multiplication (`2pi`, `3(4+1)`) · live preview · persistent 20-entry history · dark/light themes · keyboard-first input · installable & offline PWA · accessibility-aware UI. See [Features](Features.md) for the full list with examples.

### Wiki map / نقشهٔ ویکی

| Page | What it covers |
|---|---|
| [Home](Home.md) | This page — overview and navigation |
| [Features](Features.md) | Every feature, explained with examples |
| [Installation](Installation.md) | Prerequisites, running locally, installing as an app |
| [Architecture](Architecture.md) | Modules, data flow, design decisions |
| [Parser](Parser.md) | The grammar, tokenizer, and evaluation algorithm |
| [API](API.md) | The `calculate()` function, options, error types |
| [Keyboard Shortcuts](Keyboard-Shortcuts.md) | Full key map |
| [Development](Development.md) | Scripts, tooling, debugging, PWA testing |
| [Testing](Testing.md) | The test suite and what it covers |
| [Contributing](Contributing.md) | How to add features, rules, PR flow |
| [Privacy & Security](Privacy-and-Security.md) | The data model and threat model |
| [FAQ](FAQ.md) | Common questions and troubleshooting |
| [Changelog](Changelog.md) | Version history |

---

## 🇮🇷 فارسی

به مستندات رسمی **IVA Calculator Pro** خوش آمدید. این ویکی مرجع کامل و معتبر پروژه است — از یک نمای کلی تا دستور زبان پارسر عبارت‌ها.

### IVA Calculator Pro چیست؟

IVA Calculator Pro یک **ماشین‌حساب علمی مدرن، امن و بدون‌وابستگی** است که به‌صورت یک وب‌اپلیکیشن پیشرونده (PWA) ساخته شده است. عبارت‌ها را با یک **پارسر بازگشتی دست‌نویس** ارزیابی می‌کند — نه `eval()` و نه `new Function()` — تا ورودی نامعتبر نتواند کد اجرا کند. تمام محاسبات به‌صورت محلی اجرا و روی دستگاه شما می‌مانند.

### نگاهی گذرا

| | |
|---|---|
| **موتور ارزیابی** | پارسر بازگشتی دست‌نویس ([پارسر](Parser.md)) |
| **وابستگی زمان اجرا** | `۰` — جاوااسکریپت/HTML/CSS خالص |
| **دادهٔ ارسالی به سرور** | `۰` بایت ([حریم خصوصی و امنیت](Privacy-and-Security.md)) |
| **قابل نصب / آفلاین** | ✅ PWA با سرویس‌ورکر خودبه‌روزرسان |
| **زبان‌ها** | تم تاریک + روشن، پشتیبانی کامل صفحه‌کلید |
| **تست‌شده** | واحد + سرتاسری ([تست‌ها](Testing.md)) |

### از کجا شروع کنم؟

- 🚀 **فقط می‌خواهید اجرا کنید؟** → [نصب](Installation.md)
- 🧠 **کنجکاوید چطور کار می‌کند؟** → [معماری](Architecture.md) → [پارسر](Parser.md)
- 🧩 **می‌خواهید موتور را در کد استفاده کنید؟** → [API](API.md)
- ⌨️ **میانبرهای صفحه‌کلید؟** → [میانبرهای صفحه‌کلید](Keyboard-Shortcuts.md)
- 🔐 **نگران داده‌ها هستید؟** → [حریم خصوصی و امنیت](Privacy-and-Security.md)
- 🛠 **می‌خواهید مشارکت کنید؟** → [توسعه](Development.md) → [مشارکت](Contributing.md)
- ❓ **گیر کرده‌اید؟** → [سوالات متداول](FAQ.md)

### مرور امکانات

مثلثات در DEG/RAD · توان · فاکتوریل · درصد · ثابت‌های `π` و `e` · فراخوانی `Ans` · ضرب ضمنی (`2pi`, `3(4+1)`) · پیش‌نمایش زنده · تاریخچهٔ ۲۰تایی ماندگار · تم تاریک/روشن · ورودی مبتنی بر صفحه‌کلید · PWA قابل نصب و آفلاین · رابط آگاه از دسترس‌پذیری. برای فهرست کامل با مثال به [امکانات](Features.md) مراجعه کنید.

---

<div align="center">

<sub>⬅️ [README](https://github.com/Kourosh242/iva-calculator/blob/main/README.md) · [Features](Features.md) ➡️</sub>

</div>
