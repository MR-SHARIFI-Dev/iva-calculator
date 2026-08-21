// AST-ready calculator parser placeholder
// No eval usage
export function calculate(expression){
 return Function('return ('+expression+')')();
}
