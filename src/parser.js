
class Tokenizer {
 constructor(text){this.text=text;this.i=0}
 tokens(){
  let out=[];
  while(this.i<this.text.length){
   let c=this.text[this.i];
   if(/\s/.test(c)){this.i++;continue}
   if(/[0-9.]/.test(c)){
    let n="";
    while(/[0-9.]/.test(this.text[this.i])) n+=this.text[this.i++];
    out.push({t:"num",v:Number(n)});continue;
   }
   if(/[a-zA-Zπ]/.test(c)){
    let w="";
    while(/[a-zA-Zπ]/.test(this.text[this.i])) w+=this.text[this.i++];
    out.push({t:"id",v:w});continue;
   }
   out.push({t:c,v:c});this.i++;
  }
  return out;
 }
}

class Parser {
 constructor(text,deg=true){
  this.t=new Tokenizer(text).tokens();this.i=0;this.deg=deg;
 }
 peek(){return this.t[this.i]}
 eat(){return this.t[this.i++]}
 parse(){let x=this.add();if(this.i<this.t.length)throw Error("Unexpected token");return x}
 add(){
  let x=this.mul();
  while(this.peek()?.v==="+"||this.peek()?.v==="-"){
   let op=this.eat().v,y=this.mul();x=op==="+"?x+y:x-y;
  }return x;
 }
 mul(){
  let x=this.pow();
  while(this.peek()?.v==="*"||this.peek()?.v==="/"){
   let op=this.eat().v,y=this.pow();x=op==="*"?x*y:x/y;
  }return x;
 }
 pow(){
  let x=this.unary();
  if(this.peek()?.v==="^"){this.eat();x=Math.pow(x,this.pow())}
  return x;
 }
 unary(){
  if(this.peek()?.v==="-"){this.eat();return -this.unary()}
  return this.primary();
 }
 primary(){
  let t=this.eat();
  if(!t)throw Error("Incomplete");
  if(t.t==="num")return t.v;
  if(t.v==="π")return Math.PI;
  if(t.v==="e")return Math.E;
  if(t.v==="("){let x=this.add();if(this.eat()?.v!==")")throw Error("Missing )");return x}
  if(t.t==="id"){
   if(this.eat()?.v!=="(")throw Error("Missing (");
   let a=this.add();
   if(this.eat()?.v!==")")throw Error("Missing )");
   return this.fn(t.v,a);
  }
  throw Error("Invalid");
 }
 fn(n,x){
  let r=x;
  if(this.deg){
   if(n==="sin")r=Math.sin(x*Math.PI/180);
   else if(n==="cos")r=Math.cos(x*Math.PI/180);
   else if(n==="tan")r=Math.tan(x*Math.PI/180);
  }else{
   if(n==="sin")r=Math.sin(x);
   if(n==="cos")r=Math.cos(x);
   if(n==="tan")r=Math.tan(x);
  }
  if(n==="sqrt")r=Math.sqrt(x);
  if(n==="cbrt")r=Math.cbrt(x);
  if(n==="log")r=Math.log10(x);
  if(n==="ln")r=Math.log(x);
  if(n==="sinh")r=Math.sinh(x);
  if(n==="cosh")r=Math.cosh(x);
  if(n==="abs")r=Math.abs(x);
  if(n==="fact"){r=1;for(let i=2;i<=x;i++)r*=i}
  return r;
 }
}
function evaluateExpression(x){return new Parser(x).parse()}
