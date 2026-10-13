// A session contains exactly the selected number of boxes or complete sets.
let openingQueue=[],sessionTotal=0,autoOpening=false,autoTimer=null,batchActive=false,sessionKey=null;
function shuffled(values){const result=values.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(randomUnit()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function makeWholeSet(key,roll=randomUnit()){
 const pool=products.filter(p=>p.category===key),regular=pool.filter(p=>p.tag==='REGULAR');
 const result=regular.slice();
 if(key!=='aespa'&&roll<.30){const rare=pool.find(p=>p.tag===(roll<.10?'SUPER SECRET':'SECRET'));result[Math.floor(randomUnit()*result.length)]=rare;}
 return shuffled(result);
}
function validQuantity(input,max){const value=Number(input.value);if(!Number.isInteger(value)||value<1||value>max){input.setCustomValidity(`Enter a whole number from 1 to ${max}.`);input.reportValidity();return null;}input.setCustomValidity('');return value;}
const originalResetBoxes=resetBoxes;
resetBoxes=function(){if(sessionKey&&sessionKey!==$('#draw-series').value){openingQueue=[];sessionTotal=0;sessionKey=null;}originalResetBoxes();if($('#box-format').value==='set'){const grid=$('#box-grid');while(grid.children.length>series[$('#draw-series').value].set)grid.lastElementChild.remove();}updateBatchButton();};
function updateBatchButton(){
 if(busy)return;
 const mode=$('#pick-mode').value,format=$('#box-format').value;
 const canOpen=openingQueue.length>0&&(mode==='random'||format==='set'||selected!==null);
 $('#open-box').disabled=!canOpen;
 $('#open-box').textContent=openingQueue.length?canOpen?'OPEN NEXT BOX':'SELECT A BOX TO OPEN':'PREPARE BOXES FIRST';
 $('#batch-progress').textContent=sessionTotal?`剩余 ${openingQueue.length} 盒 · 已开 ${sessionTotal-openingQueue.length} / ${sessionTotal}`:'Choose format and quantity, then prepare your boxes.';
}
function showFormat(){
 const key=$('#draw-series').value,s=series[key],whole=$('#box-format').value==='set';
 $('#format-image').src=whole?`assets/set-${key}.webp`:`assets/box-${key}.webp`;
 $('#format-image').alt=s.name+(whole?' whole set packaging':' single box packaging');
 $('#quantity-label').textContent=whole?'3. Quantity (whole sets)':'3. Quantity (single boxes)';
 $('#box-quantity').max=whole?'5':'20';
 if(Number($('#box-quantity').value)>Number($('#box-quantity').max))$('#box-quantity').value='1';
 $('#format-description').textContent=whole?`${s.set} boxes per set · no duplicates within each set.${key==='aespa'?' All 4 characters.':' A rare design can replace one regular design.'}`:'One random figure + base + matching card per box. Single-box results may repeat.';
 $('#pick-mode-row').hidden=whole;
 const note=document.querySelector('.odds>p');note.textContent=whole?'Demo odds per whole set: 70% all regular designs, 20% one secret replacement, 10% one super secret replacement (aespa contains its 4 regular characters). Hidden editions are not guaranteed.':'Demo odds per single box: regular 70%, secret 20%, super secret 10%; aespa each 25%. Each box is independent; results can repeat.';
}
function clearSession(){if(busy||autoOpening)return;openingQueue=[];sessionTotal=0;batchActive=false;selected=null;resetBoxes();showFormat();}
function setControls(disabled){['draw-series','box-format','box-quantity','pick-mode','prepare-boxes','mini-game','reset-reveals'].forEach(id=>$('#'+id).disabled=disabled);$('#draw-again').disabled=disabled;document.querySelectorAll('.series-actions button').forEach(b=>b.disabled=disabled);}
function prepareSession(){
 if(busy||autoOpening)return false;
 const whole=$('#box-format').value==='set',q=validQuantity($('#box-quantity'),whole?5:20);if(q===null)return false;
 const key=$('#draw-series').value;sessionKey=key;openingQueue=[];
 for(let i=0;i<q;i++){if(whole)openingQueue.push(...makeWholeSet(key));else openingQueue.push(pickProduct(key));}
 sessionTotal=openingQueue.length;batchActive=true;selected=null;resetBoxes();showFormat();
 $('#draw-status').textContent=`Ready: ${q} ${whole?'whole set(s)':'single box(es)'} · ${sessionTotal} boxes to open.`;
 return true;
}
function finishAuto(){autoOpening=false;clearTimeout(autoTimer);$('#stop-auto').hidden=true;setControls(false);updateBatchButton();}
function openNext(){
 if(busy||!openingQueue.length)return;
 if(!autoOpening&&$('#box-format').value==='single'&&$('#pick-mode').value==='manual'&&selected===null)return;
 busy=true;setControls(true);$('#open-box').disabled=true;
 const boxes=$('#box-grid').querySelectorAll('button');boxes.forEach(b=>b.disabled=true);
 const chosen=selected===null?Math.floor(randomUnit()*boxes.length):selected;boxes[chosen]?.classList.add('opening');
 $('#draw-status').textContent='Opening…';
 setTimeout(()=>{
  const p=openingQueue.shift();currentResult=p;reveals.unshift(p);unlockProduct(p);fillResult(p,true);renderShelf();$('#result-dialog').showModal();playRareReveal(p);
  busy=false;selected=null;resetBoxes();$('#stop-auto').hidden=!autoOpening;
  if(autoOpening){setControls(true);autoTimer=setTimeout(()=>{if(!autoOpening)return;if(!openingQueue.length){finishAuto();$('#draw-status').textContent='Auto unboxing complete.';return;}$('#result-dialog').close();openNext();},reduced.matches?1200:p.tag==='REGULAR'?1800:6500);}
  else{setControls(false);updateBatchButton();$('#draw-status').textContent=openingQueue.length?'Close the reveal and open your next box.':'All selected boxes opened. Prepare a new session to continue.';}
 },reduced.matches?0:1300);
}
$('#prepare-boxes').addEventListener('click',()=>{if(prepareSession()){$('#purchase-dialog').close();$('#unbox').hidden=false;$('#unbox').scrollIntoView({behavior:reduced.matches?'auto':'smooth'});}});
$('#open-box').addEventListener('click',openNext);
// Selection listeners in shop.js run first, then the session limit is enforced.
$('#box-grid').addEventListener('click',updateBatchButton);
['draw-series','box-format','box-quantity','pick-mode'].forEach(id=>$('#'+id).addEventListener('change',clearSession));
$('#reset-reveals').addEventListener('click',()=>{if(busy)return;finishAuto();openingQueue=[];sessionTotal=0;batchActive=false;resetBoxes();showFormat();$('#unbox').hidden=true;});
$('#mini-game').addEventListener('click',()=>{$('#purchase-dialog').close();$('#game-series').value=$('#draw-series').value;$('#game-dialog').showModal();});
$('#start-game').addEventListener('click',()=>{const q=validQuantity($('#game-quantity'),20);if(q===null)return;$('#game-dialog').close();$('#draw-series').value=$('#game-series').value;$('#box-format').value='single';$('#pick-mode').value='random';$('#box-quantity').value=String(q);if(!prepareSession())return;$('#unbox').hidden=false;$('#unbox').scrollIntoView({behavior:reduced.matches?'auto':'smooth'});autoOpening=true;$('#stop-auto').hidden=false;openNext();});
$('#stop-auto').addEventListener('click',()=>{finishAuto();$('#draw-status').textContent=`Auto opening stopped. ${openingQueue.length} prepared boxes remain.`;});
// Escape/close stops auto playback; manually closing a result never consumes another box.
$('#result-dialog').addEventListener('close',()=>{if(autoOpening&& !busy){finishAuto();}});
showFormat();updateBatchButton();
$('#game-dialog .close').addEventListener('click',()=>$('#game-dialog').close());
$('#game-dialog').addEventListener('click',e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();});

function updatePurchasePhotos(){
 const key=$('#draw-series').value,whole=$('#box-format').value==='set';
 $('#single-format-image').src=`assets/box-${key}.webp`;
 $('#set-format-image').src=`assets/set-${key}.webp`;
 $('#single-format-image').alt=series[key].name+' single box';
 $('#set-format-image').alt=series[key].name+' whole set';
 $('#set-format-count').textContent=series[key].set+' sealed boxes · no duplicates';
 $('#choose-single').classList.toggle('active',!whole);$('#choose-set').classList.toggle('active',whole);
 $('#choose-single').setAttribute('aria-pressed',String(!whole));$('#choose-set').setAttribute('aria-pressed',String(whole));
 $('#purchase-title').textContent=series[key].name+' · Buy Boxes';
}
function openPurchase(key){
 if(busy||autoOpening)return;
 if(openingQueue.length){$('#unbox').hidden=false;$('#unbox').scrollIntoView({behavior:reduced.matches?'auto':'smooth'});$('#draw-status').textContent='Finish your remaining boxes before preparing a new session.';return;}
 $('#draw-series').value=key;$('#box-format').value='single';$('#box-quantity').value='1';$('#pick-mode').value='manual';clearSession();updatePurchasePhotos();$('#purchase-dialog').showModal();
}
$('#purchase-close').addEventListener('click',()=>$('#purchase-dialog').close());
['draw-series','box-format'].forEach(id=>$('#'+id).addEventListener('change',updatePurchasePhotos));
$('#choose-single').addEventListener('click',()=>{$('#box-format').value='single';clearSession();updatePurchasePhotos();});
$('#choose-set').addEventListener('click',()=>{$('#box-format').value='set';clearSession();updatePurchasePhotos();});
$('#game-launch').addEventListener('click',()=>{if(busy||autoOpening)return;if(openingQueue.length){$('#unbox').scrollIntoView({behavior:'smooth'});$('#draw-status').textContent='Finish or Reset the current session before starting the mini game.';return;}$('#game-series').value=$('#draw-series').value;$('#game-dialog').showModal();});
$('#purchase-dialog').addEventListener('click',e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();});
updatePurchasePhotos();
