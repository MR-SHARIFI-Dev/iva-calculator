
const keys=["7","8","9","/","sin","cos","tan",
"4","5","6","*","log",
"1","2","3","-","ln",
"0",".","(",")","+","^","π","e","!","√","=","C"];

let exp="";
let memory=[];
let result=0;

const display=document.querySelector("#expression");
const output=document.querySelector("#result");

keys.forEach(k=>{
let b=document.createElement("button");
b.textContent=k;
b.onclick=()=>press(k);
document.querySelector("#keys").appendChild(b);
});

function press(k){
 if(k==="C") exp="";
 else if(k==="="){
  try{
   result=calculate(exp.replaceAll("π","3.1415926535").replaceAll("e","2.718281828"));
   output.textContent=result;
   saveHistory(exp+" = "+result);
  }catch(e){output.textContent=e.message}
 }
 else exp+=k;
 display.textContent=exp||"0";
}

function saveHistory(x){
let h=JSON.parse(localStorage.history||"[]");
h.unshift(x);
localStorage.history=JSON.stringify(h.slice(0,100));
renderHistory();
}
function renderHistory(){
history.innerHTML=(JSON.parse(localStorage.history||"[]"))
.map(x=>"<li>"+x+"</li>").join("");
}
clearHistory.onclick=()=>{localStorage.removeItem("history");renderHistory()}
theme.onclick=()=>document.body.classList.toggle("light");
exportHistory.onclick=()=>navigator.clipboard.writeText(localStorage.history||"[]");
renderHistory();
