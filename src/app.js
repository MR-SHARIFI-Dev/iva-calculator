
const keys=["sin(","cos(","tan(","sinh(","cosh(","log(","ln(","sqrt(","cbrt(","fact(","π","e","^","(",")","7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","=","C"];
let exp="";
const expr=document.querySelector("#expr"), result=document.querySelector("#result");
keys.forEach(k=>{let b=document.createElement("button");b.textContent=k;b.onclick=()=>go(k);document.querySelector("#keys").appendChild(b)});
function go(k){
 if(k==="C")exp="";
 else if(k==="="){try{let r=evaluateExpression(exp);result.textContent=r;save(exp+" = "+r)}catch(e){result.textContent=e.message}}
 else exp+=k;
 expr.textContent=exp||"0";
}
function save(x){let h=JSON.parse(localStorage.h||"[]");h.unshift(x);localStorage.h=JSON.stringify(h);render()}
function render(){history.innerHTML=(JSON.parse(localStorage.h||"[]")).map(x=>"<li>"+x+"</li>").join("")}
clear.onclick=()=>{localStorage.removeItem("h");render()}
theme.onclick=()=>document.body.classList.toggle("light")
render();
