// Pure number/expression formatting shared by the UI and tests.
// formatNumber must produce text the parser can round-trip: scientific output
// uses an uppercase E so it can never be confused with Euler's constant.

export function formatNumber(value) {
  if (Object.is(value, -0)) return '0';
  const absolute = Math.abs(value);
  if ((absolute !== 0 && absolute < 1e-9) || absolute >= 1e12) {
    return value.toExponential(10).replace(/\.?(0+)(?=e)/, '').replace('e', 'E');
  }
  return Number(value.toPrecision(12)).toLocaleString('en-US', {
    useGrouping: false, maximumFractionDigits: 12
  });
}

export function prettyExpression(value) {
  return value
    .replaceAll('*', ' × ')
    .replaceAll('/', ' ÷ ')
    .replaceAll('+', ' + ')
    .replace(/E \+ /g, 'E+') // keep exponents tight: 1E+21, not 1E + 21
    .replaceAll('-', '−')
    .replace(/([\d)π])−(?!\))/g, '$1 − ') // space binary minus only
    .replace(/(\d)e/g, '$1 × e') // show implicit multiplication with Euler
    .replace(/e(\d)/g, 'e × $1')
    .replace(/(^|[^a-zA-Z])pi(?![a-zA-Z])/g, '$1π') // π after digits too (2pi → 2π)
    .replaceAll('sqrt', '√');
}
