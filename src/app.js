import { calculate, CalculatorError } from './parser.js?v=3.3.0';
import { appendToken, closeOpenParentheses, deleteLastToken, isBinaryOperator, startsNewExpression } from './input.js?v=3.3.0';
import { formatNumber, prettyExpression } from './format.js?v=3.3.0';

const $ = (selector) => document.querySelector(selector);
const expressionElement = $('#expression');
const resultElement = $('#result');
const messageElement = $('#message');
const historyElement = $('#history');
const emptyHistoryElement = $('#empty-history');
const angleModeButton = $('#angle-mode');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const brandLogo = document.querySelector('.brand img');
const operatorButtons = document.querySelectorAll('.key.operator');

// localStorage throws in sandboxed iframes and some private-browsing modes;
// every access is guarded so the calculator never crashes on storage failure.
const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
  }
};

const savedHistory = readHistory();

const state = {
  expression: '',
  result: 0,
  ans: Number.isFinite(savedHistory[0]?.result) ? savedHistory[0].result : 0,
  justCalculated: false,
  angleMode: storage.get('iva-angle') === 'rad' ? 'rad' : 'deg',
  history: savedHistory
};

let timeFormatter = null;
let pulseTimer = 0;
let pulsedButton = null;

function readHistory() {
  try {
    const value = JSON.parse(storage.get('iva-history') || '[]');
    if (!Array.isArray(value)) return [];
    // Only keep well-formed entries; corrupt or old-format data is dropped.
    return value
      .filter((entry) => entry && typeof entry === 'object'
        && typeof entry.expression === 'string' && entry.expression.length <= 500
        && Number.isFinite(entry.result)
        && typeof entry.time === 'number')
      .map((entry) => ({ expression: entry.expression, result: entry.result, time: entry.time }))
      .slice(0, 20);
  } catch { return []; }
}

function render(options = {}) {
  expressionElement.textContent = state.expression ? prettyExpression(state.expression) : '0';
  resultElement.textContent = formatNumber(state.result);
  const angleLabel = state.angleMode.toUpperCase();
  if (angleModeButton.textContent !== angleLabel) angleModeButton.textContent = angleLabel;
  expressionElement.scrollLeft = expressionElement.scrollWidth;
  updateOperatorButtons();
  if (options.history) renderHistory();
}

function updateOperatorButtons() {
  const last = state.expression.at(-1) || '';
  const awaitingOperand = isBinaryOperator(last) || last === '.';
  const blockOthers = awaitingOperand || !state.expression || last === '(';
  operatorButtons.forEach((button) => {
    const value = button.dataset.value;
    // Minus may start a negative number, including after “(” and “^” (2^-2).
    const mayStartNegative = value === '-' && (!state.expression || last === '(' || last === '^');
    const disabled = blockOthers && !mayStartNegative;
    if (button.disabled !== disabled) button.disabled = disabled;
  });
}

const KEY_ALIASES = { '×': '*', '÷': '/', '−': '-' };

function input(rawValue) {
  const value = KEY_ALIASES[rawValue] || rawValue;
  messageElement.textContent = '';
  messageElement.classList.remove('success');
  if (state.justCalculated) {
    state.expression = startsNewExpression(value) ? '' : formatNumber(state.result);
  }
  state.justCalculated = false;
  state.expression = appendToken(state.expression, value);
  livePreview();
  render();
}

function livePreview() {
  if (!state.expression) { state.result = 0; return; }
  try {
    state.result = calculate(state.expression, { angleMode: state.angleMode, ans: state.ans });
  } catch { /* Incomplete expressions are normal while typing. */ }
}

function evaluate() {
  if (!state.expression || state.justCalculated) return;
  try {
    const completedExpression = closeOpenParentheses(state.expression);
    const value = calculate(completedExpression, { angleMode: state.angleMode, ans: state.ans });
    const entry = { expression: completedExpression, result: value, time: Date.now() };
    state.result = value;
    state.ans = value;
    // “=” finalizes the calculation: the editable expression becomes the answer.
    state.expression = formatNumber(value);
    state.justCalculated = true;
    state.history.unshift(entry);
    state.history = state.history.slice(0, 20);
    storage.set('iva-history', JSON.stringify(state.history));
    messageElement.textContent = 'Result';
    messageElement.classList.add('success');
    render({ history: true });
  } catch (error) {
    messageElement.classList.remove('success');
    messageElement.textContent = error instanceof CalculatorError ? error.message : 'Could not calculate this expression';
    render();
  }
}

function clear() {
  state.expression = '';
  state.result = 0;
  state.justCalculated = false;
  messageElement.textContent = '';
  messageElement.classList.remove('success');
  render();
}

function backspace() {
  state.expression = deleteLastToken(state.expression);
  state.justCalculated = false;
  messageElement.textContent = '';
  messageElement.classList.remove('success');
  livePreview();
  render();
}

function formatHistoryTime(timestamp) {
  try {
    timeFormatter ||= new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
    return timeFormatter.format(timestamp);
  } catch {
    return '';
  }
}

function restoreHistoryEntry(index) {
  const entry = state.history[index];
  if (!entry) return;
  state.expression = entry.expression;
  state.result = entry.result;
  state.justCalculated = false;
  messageElement.textContent = '';
  render();
}

function renderHistory() {
  historyElement.replaceChildren();
  emptyHistoryElement.hidden = state.history.length > 0;
  const fragment = document.createDocumentFragment();
  state.history.forEach((entry, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'history-item';
    button.dataset.index = String(index);
    const when = formatHistoryTime(entry.time);
    button.innerHTML = `<span>${escapeHtml(prettyExpression(entry.expression))}</span><strong>= ${escapeHtml(formatNumber(entry.result))}</strong>${when ? `<time>${escapeHtml(when)}</time>` : ''}`;
    item.append(button);
    fragment.append(item);
  });
  historyElement.append(fragment);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function pulseButton(button) {
  if (!button) return;
  if (pulsedButton && pulsedButton !== button) pulsedButton.classList.remove('is-pressed');
  pulsedButton = button;
  button.classList.add('is-pressed');
  window.clearTimeout(pulseTimer);
  pulseTimer = window.setTimeout(() => {
    button.classList.remove('is-pressed');
    if (pulsedButton === button) pulsedButton = null;
  }, 90);
}

$('#keys').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.value) input(button.dataset.value);
  else if (button.dataset.action === 'equals') evaluate();
  else if (button.dataset.action === 'clear') clear();
  else if (button.dataset.action === 'backspace') backspace();
});

historyElement.addEventListener('click', (event) => {
  const button = event.target.closest('.history-item');
  if (!button) return;
  restoreHistoryEntry(Number(button.dataset.index));
});

function applyTheme(theme) {
  const light = theme === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  $('#theme').innerHTML = light
    ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 4.2 13.2 7h3.1l-2.5 1.9.9 3-2.7-1.8L9.3 11.9l.9-3L7.7 7h3.1L12 4.2ZM12 1l1.8 4.4h4.7l-3.8 2.8 1.5 4.5L12 10.7 7.8 12.7l1.5-4.5-3.8-2.8h4.7L12 1Zm0 13a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>'
    : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13.1 3.1a8.5 8.5 0 1 0 7.8 13.3A7 7 0 0 1 13.1 3.1Z"/></svg>';
  $('#theme').setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  $('#theme').title = light ? 'Switch to dark theme' : 'Switch to light theme';
  if (themeColorMeta) themeColorMeta.content = light ? '#efe8f8' : '#05030c';
  if (brandLogo) brandLogo.src = light ? 'assets/logo-dark.svg' : 'assets/logo.svg';
}

$('#theme').addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  storage.set('iva-theme', nextTheme);
});

$('#angle-mode').addEventListener('click', () => {
  state.angleMode = state.angleMode === 'deg' ? 'rad' : 'deg';
  storage.set('iva-angle', state.angleMode);
  livePreview();
  render();
});

$('#clear-history').addEventListener('click', () => {
  state.history = [];
  storage.remove('iva-history');
  renderHistory();
});

const KEY_SELECTOR = {
  Enter: '[data-action="equals"]',
  '=': '[data-action="equals"]',
  Backspace: '[data-action="backspace"]',
  Escape: '[data-action="clear"]',
  Delete: '[data-action="clear"]'
};

document.addEventListener('keydown', (event) => {
  if (event.repeat) { event.preventDefault(); return; }
  // Space would otherwise re-activate the last clicked button and duplicate it.
  if (event.key === ' ') { event.preventDefault(); return; }
  const key = KEY_ALIASES[event.key] || event.key;
  if (/^[0-9.+\-*/^()%!]$/.test(key)) {
    event.preventDefault();
    pulseButton(document.querySelector(`.key[data-value="${CSS.escape(key)}"]`));
    input(key);
  }
  else if (KEY_SELECTOR[key]) {
    event.preventDefault();
    pulseButton(document.querySelector(KEY_SELECTOR[key]));
    if (key === 'Enter' || key === '=') evaluate();
    else if (key === 'Backspace') backspace();
    else clear();
  }
});

const preferredTheme = storage.get('iva-theme') ||
  (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(preferredTheme);

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=3.3.0', { updateViaCache: 'none' }).catch(() => {}));
}

render({ history: true });
