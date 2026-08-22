import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from '../src/parser.js';
import { formatNumber, prettyExpression } from '../src/format.js';

test('formatted numbers parse back to the same value', () => {
  for (const value of [0, 1e20, -1e20, 2.5e-8, 0.1 + 0.2, 42, 123456789012, 1e-7, 3e-9, 5e12]) {
    const text = formatNumber(value);
    const roundTrip = calculate(text);
    assert.ok(Math.abs(roundTrip - value) <= Math.abs(value) * 1e-9,
      `${value} -> ${text} -> ${roundTrip}`);
  }
  assert.equal(formatNumber(-0), '0');
});

test('scientific output uses uppercase E so Euler stays unambiguous', () => {
  assert.equal(formatNumber(1e20), '1E+20');
  assert.equal(formatNumber(2.5e-10), '2.5E-10');
  assert.equal(formatNumber(2.5e-8), '0.000000025');
  assert.equal(formatNumber(-1e15), '-1E+15');
  assert.equal(formatNumber(3e-10), '3E-10');
  assert.equal(formatNumber(3e-9), '0.000000003');
  assert.equal(formatNumber(0.1 + 0.2), '0.3');
});

test('prettyExpression renders Euler, exponents and unary minus clearly', () => {
  assert.equal(prettyExpression('2+3*4'), '2 + 3 × 4');
  assert.equal(prettyExpression('2-3'), '2 − 3');
  assert.equal(prettyExpression('2e3'), '2 × e × 3');
  assert.equal(prettyExpression('2e'), '2 × e');
  assert.equal(prettyExpression('1E+21'), '1E+21');
  assert.equal(prettyExpression('2E-3'), '2E−3');
  assert.equal(prettyExpression('2^-3'), '2^−3');
  assert.equal(prettyExpression('-5'), '−5');
  assert.equal(prettyExpression('(-5)'), '(−5)');
  assert.equal(prettyExpression('2pi'), '2π');
  assert.equal(prettyExpression('sin(pi)'), 'sin(π)');
  assert.equal(prettyExpression('sqrt(9)'), '√(9)');
  assert.equal(prettyExpression('2+'), '2 + ');
  assert.equal(prettyExpression('50%'), '50%');
  assert.equal(prettyExpression('5!'), '5!');
});
