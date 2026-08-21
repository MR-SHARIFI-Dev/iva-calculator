
class Parser{
constructor(input){this.input=input;this.pos=0}
parse(){
 let v=this.expression();
 if(this.pos<this.input.length) throw Error("Unexpected token");
 return v;
}
expression(){
 let v=this.term();
 while(this.peek()=="+"||this.peek()=="-"){
  let op=this.next(); let r=this.term();
  v=op=="+"?v+r:v-r;
 }
 return v;
}
term(){
 let v=this.power();
 while(this.peek()=="*"||this.peek()=="/"){
  let op=this.next();let r=this.power();
  v=op=="*"?v*r:v/r;
 }
 return v;
}
power(){
 let v=this.factor();
 if(this.peek()=="^"){this.next();v=Math.pow(v,this.power())}
 return v;
}
factor(){
 this.skip();
 if(this.peek()=="("){
  this.next();let v=this.expression();this.next();return v;
 }
 let n="";
 while(/[0-9.]/.test(this.peek()))n+=this.next();
 if(n)return Number(n);
 throw Error("Invalid expression");
}
peek(){return this.input[this.pos]}
next(){return this.input[this.pos++]}
skip(){while(this.peek()==" ")this.pos++}
}
function calculate(x){return new Parser(x).parse()}
