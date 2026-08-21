const keys=['7','8','9','/','sin(','cos(','tan(','4','5','6','*','sqrt(','1','2','3','-','log(','0','.','+','^','=','C'];
let exp='';
const expr=document.querySelector('#expression');
const result=document.querySelector('#result');
keys.forEach(k=>{
 const b=document.createElement('button');
 b.textContent=k;
 b.onclick=()=>press(k);
 document.querySelector('#keys').appendChild(b);
});
function press(k){
 if(k==='C') exp='';
 else if(k==='='){
  try{result.textContent=calculate(exp)}
  catch(e){result.textContent='Error'}
 }else exp+=k;
 expr.textContent=exp||'0';
}
document.querySelector('#theme').onclick=()=>document.body.classList.toggle('light');
