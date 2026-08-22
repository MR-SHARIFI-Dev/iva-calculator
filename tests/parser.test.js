import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, CalculatorError } from '../src/parser.js';

const closeTo = (actual, expected, epsilon = 1e-10) => assert.ok(
  Math.abs(actual - expected) < epsilon,
  `expected ${actual} to be close to ${expected}`
);

test('respects precedence and parentheses', () => {
  assert.equal(calculate('2 + 3 * 4'), 14);
  assert.equal(calculate('(2 + 3) * 4'), 20);
  assert.equal(calculate('2^3^2'), 512);
  assert.equal(calculate('-2^2'), -4);
});

test('supports decimals and scientific notation', () => {
  assert.equal(calculate('.5 + 1.5'), 2);
  assert.equal(calculate('1E3 + 2.5E-2'), 1000.025);
  assert.equal(calculate('2E3'), 2000);
  assert.equal(calculate('2E-3'), 0.002);
  assert.equal(calculate('2E'), 2 * Math.E); // E without a digit is Euler
});

test('lowercase e is always Euler, never exponent notation', () => {
  closeTo(calculate('2e3'), 2 * Math.E * 3);
  closeTo(calculate('2e+3'), 2 * Math.E + 3);
  closeTo(calculate('2e-3'), 2 * Math.E - 3);
  closeTo(calculate('2e'), 2 * Math.E);
});

test('supports constants and implicit multiplication', () => {
  closeTo(calculate('2pi'), 2 * Math.PI);
  assert.equal(calculate('3(4+1)'), 15);
  closeTo(calculate('2e'), 2 * Math.E);
});

test('supports scientific functions and angle modes', () => {
  closeTo(calculate('sin(30)'), 0.5);
  assert.equal(calculate('sin(180)'), 0);
  assert.equal(calculate('cos(90)'), 0);
  closeTo(calculate('sin(pi/2)', { angleMode: 'rad' }), 1);
  assert.equal(calculate('sqrt(81)+log(100)+ln(e)'), 12);
  assert.equal(calculate('abs(-4)+round(2.6)'), 7);
});

test('supports all exposed scientific operations', () => {
  const exactCases = [
    ['2+3', 5], ['7-10', -3], ['6*7', 42], ['8/4', 2], ['2^10', 1024],
    ['5!', 120], ['50% * 200', 100], ['sqrt(144)', 12], ['abs(-9)', 9],
    ['log(1000)', 3], ['ln(e)', 1], ['floor(2.9)', 2], ['ceil(2.1)', 3],
    ['round(2.6)', 3], ['sin(30)', 0.5], ['cos(60)', 0.5], ['tan(45)', 1],
    ['asin(1)', 90], ['acos(0)', 90], ['atan(1)', 45]
  ];
  for (const [expression, expected] of exactCases) {
    closeTo(calculate(expression), expected, 1e-12);
  }
  closeTo(calculate('exp(1)'), Math.E);
  assert.equal(calculate('ans*2', { ans: 21 }), 42);
});

test('rejects unsafe or invalid expressions', () => {
  assert.throws(() => calculate('2/0'), CalculatorError);
  assert.throws(() => calculate('(-1)!'), CalculatorError);
  assert.throws(() => calculate('process.exit()'), CalculatorError);
  assert.throws(() => calculate('sqrt(-1)'), CalculatorError);
  assert.throws(() => calculate('tan(90)'), CalculatorError);
  assert.throws(() => calculate('log(0)'), CalculatorError);
  assert.throws(() => calculate('2 +'), CalculatorError);
});
