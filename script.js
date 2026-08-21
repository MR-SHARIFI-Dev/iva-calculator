const display=document.getElementById('display');
let expr='';
document.querySelectorAll('button').forEach(b=>{
 b.onclick=()=>{
  let v=b.innerText;
  if(v==='C'){expr=''}
  else if(v==='⌫'){expr=expr.slice(0,-1)}
  else if(v==='='){try{expr=eval(expr).toString()}catch{expr='Error'}}
  else{expr+=v}
  display.innerText=expr||'0';
 }
});
