/* IVA Calculator expression parser
 * A small, dependency-free recursive-descent parser. It never uses eval or Function.
 */

export class CalculatorError extends Error {
  constructor(message, position = null) {
    super(message);
    this.name = 'CalculatorError';
    this.position = position;
  }
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sqrt', 'abs', 'ln', 'log', 'exp', 'floor', 'ceil', 'round'
]);

function tokenize(source) {
  if (typeof source !== 'string') throw new CalculatorError('Expression must be text');
  if (source.length > 500) throw new CalculatorError('Expression is too long');

  const input = source
    .replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-')
    .replaceAll('π', 'pi').replaceAll('√', 'sqrt');
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    if (/\s/.test(char)) { i += 1; continue; }

    if (/\d|\./.test(char)) {
      const start = i;
      let sawDigit = false;
      while (/\d/.test(input[i] || '')) { sawDigit = true; i += 1; }
      if (input[i] === '.') {
        i += 1;
        while (/\d/.test(input[i] || '')) { sawDigit = true; i += 1; }
      }
      if (!sawDigit) throw new CalculatorError('Invalid number', start);
      // Scientific notation uses an uppercase E (2E3, 2E-3). A lowercase e is
      // always Euler's constant, so the e key and 2e3 stay unambiguous.
      if (/^E[+-]?\d/.test(input.slice(i))) {
        i += 1;
        if (/[+-]/.test(input[i] || '')) i += 1;
        while (/\d/.test(input[i] || '')) i += 1;
      }
      const value = Number(input.slice(start, i));
      if (!Number.isFinite(value)) throw new CalculatorError('Number is too large', start);
      tokens.push({ type: 'number', value, position: start });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      const start = i;
      while (/[a-zA-Z_]/.test(input[i] || '')) i += 1;
      tokens.push({ type: 'identifier', value: input.slice(start, i).toLowerCase(), position: start });
      continue;
    }

    if ('+-*/^()!%'.includes(char)) {
      tokens.push({ type: char, value: char, position: i });
      i += 1;
      continue;
    }
    throw new CalculatorError(`Unexpected character “${char}”`, i);
  }
  tokens.push({ type: 'eof', position: input.length });
  return tokens;
}

class Parser {
  constructor(source, options) {
    this.tokens = tokenize(source);
    this.index = 0;
    this.angleMode = options.angleMode === 'rad' ? 'rad' : 'deg';
    this.ans = Number.isFinite(options.ans) ? options.ans : 0;
  }

  current() { return this.tokens[this.index]; }
  match(type) {
    if (this.current().type !== type) return false;
    this.index += 1;
    return true;
  }
  expect(type, message) {
    if (!this.match(type)) throw new CalculatorError(message, this.current().position);
  }

  parse() {
    if (this.current().type === 'eof') throw new CalculatorError('Enter an expression');
    const value = this.additive();
    if (this.current().type !== 'eof') {
      throw new CalculatorError('Unexpected input', this.current().position);
    }
    if (!Number.isFinite(value)) throw new CalculatorError('Result is not a finite number');
    return value;
  }

  additive() {
    let value = this.multiplicative();
    while (true) {
      if (this.match('+')) value += this.multiplicative();
      else if (this.match('-')) value -= this.multiplicative();
      else return value;
    }
  }

  multiplicative() {
    let value = this.unary();
    while (true) {
      if (this.match('*')) value *= this.unary();
      else if (this.match('/')) {
        const divisor = this.unary();
        if (divisor === 0) throw new CalculatorError('Division by zero');
        value /= divisor;
      } else if (['number', 'identifier', '('].includes(this.current().type)) {
        value *= this.unary(); // implicit multiplication: 2pi, 3(4+1)
      } else return value;
    }
  }

  unary() {
    if (this.match('+')) return this.unary();
    if (this.match('-')) return -this.unary();
    return this.power();
  }

  power() {
    const base = this.postfix();
    return this.match('^') ? base ** this.unary() : base;
  }

  postfix() {
    let value = this.primary();
    while (true) {
      if (this.match('!')) value = factorial(value);
      else if (this.match('%')) value /= 100;
      else return value;
    }
  }

  primary() {
    const token = this.current();
    if (this.match('number')) return token.value;
    if (this.match('(')) {
      const value = this.additive();
      this.expect(')', 'Missing closing parenthesis');
      return value;
    }
    if (token.type === 'identifier') {
      this.index += 1;
      if (token.value === 'pi') return Math.PI;
      if (token.value === 'e') return Math.E;
      if (token.value === 'ans') return this.ans;
      if (!FUNCTIONS.has(token.value)) {
        throw new CalculatorError(`Unknown name “${token.value}”`, token.position);
      }
      this.expect('(', `Expected “(” after ${token.value}`);
      const argument = this.additive();
      this.expect(')', 'Missing closing parenthesis');
      return this.callFunction(token.value, argument);
    }
    throw new CalculatorError('Expected a number or parenthesis', token.position);
  }

  callFunction(name, value) {
    // ECMAScript trig functions use radians. Convert only at this boundary.
    const toRad = (angle) => this.angleMode === 'deg' ? (angle % 360) * Math.PI / 180 : angle;
    const fromRad = (angle) => this.angleMode === 'deg' ? angle * 180 / Math.PI : angle;
    const cleanTrig = (result) => {
      if (Math.abs(result) < 1e-15) return 0;
      if (Math.abs(result - 1) < 1e-15) return 1;
      if (Math.abs(result + 1) < 1e-15) return -1;
      return result;
    };
    const tangent = () => {
      const angle = toRad(value);
      if (Math.abs(Math.cos(angle)) < 1e-15) {
        throw new CalculatorError('tan is undefined at this angle');
      }
      return cleanTrig(Math.tan(angle));
    };
    const clampUnit = (n) => {
      if (n > 1 && n < 1 + 1e-12) return 1;
      if (n < -1 && n > -1 - 1e-12) return -1;
      return n;
    };
    const operations = {
      sin: () => cleanTrig(Math.sin(toRad(value))),
      cos: () => cleanTrig(Math.cos(toRad(value))),
      tan: tangent,
      asin: () => fromRad(Math.asin(clampUnit(value))),
      acos: () => fromRad(Math.acos(clampUnit(value))),
      atan: () => fromRad(Math.atan(value)), sqrt: () => Math.sqrt(value),
      abs: () => Math.abs(value), ln: () => Math.log(value), log: () => Math.log10(value),
      exp: () => Math.exp(value), floor: () => Math.floor(value),
      ceil: () => Math.ceil(value), round: () => Math.round(value)
    };
    const result = operations[name]();
    if (!Number.isFinite(result)) throw new CalculatorError(`${name} is undefined for this value`);
    return result;
  }
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new CalculatorError('Factorial needs a non-negative integer');
  }
  if (value > 170) throw new CalculatorError('Factorial result is too large');
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}

export function calculate(expression, options = {}) {
  return new Parser(expression, options).parse();
}
