# IVA Calculator Pro

![IVA Calculator Banner](assets/banner.png)

A polished, dependency-free scientific calculator that runs entirely in the browser. IVA uses a real recursive-descent expression parser—no `eval`, no server, and no calculation data leaving the device.

## Features

- Safe expression parser with standard operator precedence
- Arithmetic, parentheses, powers (including negative exponents), factorials and percentages
- Trigonometric functions with DEG/RAD modes
- `sqrt`, `log`, `ln`, `abs`, rounding functions, π, e and Ans
- Implicit multiplication such as `2pi` and `3(4+1)`
- Live result preview, explicit `=` finalization and clear error messages
- Strict guarded input with disabled pending operators, key-repeat protection and malformed-decimal prevention
- Persistent, reusable calculation history
- Keyboard controls and responsive mobile layout
- Dark/light theme saved across visits
- Installable PWA with offline support
- Accessible controls and reduced-motion support
- Automated parser tests and GitHub Pages deployment

> **Notation:** the `e` key means Euler's number (2.718…), so `2e3` is 2 × e × 3 ≈ 16.31. Scientific notation uses an uppercase `E`: `2E3` is 2000 and `2E-3` is 0.002.

## Demo

[MR-SHARIFI-Dev.github.io/iva-calculator](https://MR-SHARIFI-Dev.github.io/iva-calculator/)

## Run locally

No build step or dependencies are required.

```bash
npm run serve
```

Open `http://localhost:4173`. ES modules require an HTTP server, so opening `index.html` directly via `file://` is not recommended.

## Tests

Node.js 20.19 or newer is required for the development toolchain.

```bash
npm install
npx playwright install chromium
npm run verify   # ESLint + Node tests + real Chromium interaction tests
```

On a minimal Linux environment, Playwright may also require `npx playwright install-deps chromium`. The browser application itself still has no runtime dependencies.

## Parser API

```js
import { calculate } from './src/parser.js';

calculate('2 + 3 * 4');                         // 14
calculate('sin(30)', { angleMode: 'deg' });     // 0.5
calculate('ans * 2', { ans: 21 });              // 42
calculate('2E3');                               // 2000 (uppercase E = scientific notation)
calculate('2e3');                               // 16.31… (lowercase e = Euler × 3)
```

Invalid input throws `CalculatorError` with a user-readable message and, when available, a source position.

## Keyboard

| Key | Action |
|---|---|
| `0–9`, operators, parentheses | Enter expression |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete one character |
| `Escape` or `Delete` | Clear |

## Project structure

```text
index.html             App markup
src/app.js             UI state and interactions
src/parser.js          Tokenizer and expression parser
src/input.js           Pure input-guard rules
src/format.js          Pure number/expression formatting
src/style.css          Responsive theme and components
tests/*.test.js        Node test suites
tests/e2e.spec.js      Real-browser interaction tests
scripts/               User-session simulations
manifest.webmanifest   Install metadata
sw.js                  Offline service worker
```

## Security and privacy

Expressions are parsed locally with a fixed grammar. Arbitrary JavaScript execution is not used. History and preferences are stored only in browser `localStorage` and can be cleared from the interface.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions and reproducible bug reports are welcome.

## License

[MIT](LICENSE)
