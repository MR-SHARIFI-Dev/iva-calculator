// Pure input rules shared by the UI and tests.
const BINARY_OPERATORS = new Set(['+', '-', '*', '/', '^']);
// Longer names first so “asin(” is not trimmed as if it were “sin(”.
const FUNCTION_NAMES = [
  'asin', 'acos', 'atan', 'sqrt', 'abs', 'exp',
  'floor', 'ceil', 'round', 'sin', 'cos', 'tan', 'log', 'ln'
];
const FUNCTION_CALL = new RegExp(`(?:${FUNCTION_NAMES.join('|')})\\($`);
const NAMED_VALUE = /(?:pi|ans|e)$/;

export function isBinaryOperator(value) {
  return BINARY_OPERATORS.has(value);
}

// Tokens that must start a fresh expression after “=” (instead of continuing
// from the previous result). Covers digits, decimals, parentheses, constants
// and every scientific function name, including asin/abs/exp/floor/ceil/round.
export function startsNewExpression(token) {
  return /^[a-zA-Z0-9.(]/.test(String(token));
}

export function appendToken(expression, token) {
  const value = String(token);
  const last = expression.at(-1) || '';

  // Keep the display and parser bounded even under automated/held input.
  if (expression.length + value.length > 500) return expression;

  if (isBinaryOperator(value)) {
    // A leading minus is a unary sign. Other operators need a left operand.
    if (!expression) return value === '-' ? '-' : expression;
    // Minus may also follow “(” or “^” (a negative exponent); nothing else may.
    if (last === '(' || last === '^') return value === '-' ? expression + '-' : expression;
    // Do not stack two unary minuses at the start, after “(” or after “^”.
    if (last === '-' && (expression.length === 1 || expression.at(-2) === '(' || expression.at(-2) === '^')) {
      return expression;
    }
    // Strict mode: once an operator is present, every further operator is ignored
    // until an operand is entered. This also handles rapid clicks and key presses.
    if (isBinaryOperator(last)) return expression;
    if (last === '.') return expression;
    return expression + value;
  }

  if (value === '.') {
    // Scientific notation is a single literal (1E+21). A trailing “+” inside
    // the exponent must not be treated as a new operand that accepts “0.”.
    if (/(?:\d+\.?\d*|\.\d+)E[+-]?\d*$/i.test(expression) || /(?:^|[+\-*/^(])[0-9.]*e$/i.test(expression)) {
      return expression;
    }
    // Only one decimal separator is allowed in the current numeric literal.
    const numberTail = expression.match(/(?:^|[+\-*/^(])([0-9.]*)$/)?.[1] ?? '';
    if (numberTail.includes('.')) return expression;
    if (!expression || isBinaryOperator(last) || last === '(') return expression + '0.';
    if (!/\d/.test(last)) return expression;
    return expression + '.';
  }

  if (value === ')') {
    const opens = (expression.match(/\(/g) || []).length;
    const closes = (expression.match(/\)/g) || []).length;
    if (opens <= closes || !expression || isBinaryOperator(last) || last === '(' || last === '.') return expression;
    return expression + ')';
  }

  if (value === '!' || value === '%') {
    if (!canEndValue(expression) || last === '!' || last === '%') return expression;
    return expression + value;
  }

  // Nothing may silently continue an implicit multiplication after a postfix
  // operator (5!3, 5!pi, 5!(2)). Require an explicit operator instead.
  if ((last === '!' || last === '%') && /^[a-zA-Z0-9.(]/.test(value)) return expression;

  return expression + value;
}

export function closeOpenParentheses(expression) {
  const opens = (expression.match(/\(/g) || []).length;
  const closes = (expression.match(/\)/g) || []).length;
  return expression + ')'.repeat(Math.max(0, opens - closes));
}

export function deleteLastToken(expression) {
  if (FUNCTION_CALL.test(expression)) return expression.replace(FUNCTION_CALL, '');
  if (NAMED_VALUE.test(expression)) return expression.replace(NAMED_VALUE, '');
  return expression.slice(0, -1);
}

function canEndValue(expression) {
  return /(?:\d|\)|pi|e|ans)$/.test(expression);
}
