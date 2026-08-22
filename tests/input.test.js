import test from 'node:test';
import assert from 'node:assert/strict';
import { appendToken, closeOpenParentheses, deleteLastToken, startsNewExpression } from '../src/input.js';

test('strictly ignores every consecutive binary operator', () => {
  assert.equal(appendToken('12+', '*'), '12+');
  assert.equal(appendToken('12*', '/'), '12*');
  assert.equal(appendToken('12/', '+'), '12/');
  assert.equal(appendToken('', '*'), '');
  assert.equal(appendToken('-', '*'), '-');
});

test('survives thousands of repeated and mixed operator presses', () => {
  for (const operator of ['+', '-', '*', '/', '^']) {
    let expression = '42';
    for (let index = 0; index < 10_000; index += 1) {
      expression = appendToken(expression, operator);
    }
    assert.equal(expression, `42${operator}`);
  }

  let mixed = '7+';
  const operators = ['+', '-', '*', '/', '^'];
  for (let index = 0; index < 50_000; index += 1) {
    mixed = appendToken(mixed, operators[index % operators.length]);
  }
  assert.equal(mixed, '7+');
});

test('preserves valid unary minus input', () => {
  assert.equal(appendToken('', '-'), '-');
  assert.equal(appendToken('sqrt(', '-'), 'sqrt(-');
  assert.equal(appendToken('sqrt(-', '*'), 'sqrt(-');
});

test('allows negative exponents and keeps operators strict around them', () => {
  assert.equal(appendToken('2^', '-'), '2^-');
  assert.equal(appendToken('2^-', '*'), '2^-');
  assert.equal(appendToken('2^-', '-'), '2^-');
  assert.equal(appendToken('(2+3)^', '-'), '(2+3)^-');
  assert.equal(appendToken('2^', '*'), '2^');
});

test('prevents duplicate decimal points and invalid postfix input', () => {
  assert.equal(appendToken('1.2', '.'), '1.2');
  assert.equal(appendToken('1+', '.'), '1+0.');
  assert.equal(appendToken('2', '!'), '2!');
  assert.equal(appendToken('2!', '!'), '2!');
});

test('blocks decimals inside scientific notation', () => {
  assert.equal(appendToken('2E3', '.'), '2E3');
  assert.equal(appendToken('2e', '.'), '2e');
  assert.equal(appendToken('1E+21', '.'), '1E+21');
  assert.equal(appendToken('2.5E-10', '.'), '2.5E-10');
});

test('blocks silent implicit multiplication after postfix operators', () => {
  assert.equal(appendToken('5!', '3'), '5!');
  assert.equal(appendToken('5!', 'pi'), '5!');
  assert.equal(appendToken('5!', '('), '5!');
  assert.equal(appendToken('50%', '3'), '50%');
  assert.equal(appendToken('5!', '+'), '5!+');
  assert.equal(appendToken('sin(5!', ')'), 'sin(5!)');
});

test('startsNewExpression covers digits, constants and every function', () => {
  for (const token of ['7', '00', '.', '(', 'pi', 'e', 'ans', 'sqrt(', 'sin(', 'cos(', 'tan(',
    'asin(', 'acos(', 'atan(', 'abs(', 'exp(', 'floor(', 'ceil(', 'round(', 'log(', 'ln(']) {
    assert.equal(startsNewExpression(token), true, token);
  }
  for (const token of ['+', '-', '*', '/', '^', '%', '!']) {
    assert.equal(startsNewExpression(token), false, token);
  }
});

test('validates and completes parentheses', () => {
  assert.equal(appendToken('(2+3', ')'), '(2+3)');
  assert.equal(appendToken('(2+', ')'), '(2+');
  assert.equal(appendToken('2', ')'), '2');
  assert.equal(closeOpenParentheses('sin(30'), 'sin(30)');
  assert.equal(closeOpenParentheses('2*(3+4'), '2*(3+4)');
});

test('backspace removes complete function and named-value tokens', () => {
  assert.equal(deleteLastToken('2+sin('), '2+');
  assert.equal(deleteLastToken('2+ans'), '2+');
  assert.equal(deleteLastToken('2+pi'), '2+');
  assert.equal(deleteLastToken('123'), '12');
  assert.equal(deleteLastToken('asin('), '');
  assert.equal(deleteLastToken('2+acos('), '2+');
  assert.equal(deleteLastToken('atan('), '');
  assert.equal(deleteLastToken('2+e'), '2+');
});

test('a realistic button sequence produces a valid final expression', async () => {
  const { calculate } = await import('../src/parser.js');
  let expression = '';
  for (const token of ['sin(', '3', '0']) expression = appendToken(expression, token);
  expression = closeOpenParentheses(expression); // “=” auto-closes the function call.
  assert.equal(expression, 'sin(30)');
  assert.ok(Math.abs(calculate(expression) - 0.5) < 1e-12);

  expression = '';
  for (const token of ['2', '+', '*', '3']) expression = appendToken(expression, token);
  assert.equal(expression, '2+3'); // The second operator is ignored, never stacked.
  assert.equal(calculate(expression), 5);
});
