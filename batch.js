// Buying prepares sealed boxes. Opening is a separate action in My boxes.
let purchasedBoxes=[],nextBoxId=1,chosenPurchasedId=null,autoOpening=false,autoTimer=null,autoIds=[];
let inventoryVisible=60;
let purchaseSelections=new Set();
let autoAdvanceClose=false;let autoResults=[];
const candidatePools={};
function candidatesFor(key){if(!candidatePools[key])candidatePools[key]=[];if(!candidatePools[key].length)addCandidates(key,24);return candidatePools[key];}
function addCandidates(key,count){const pool=candidatePools[key]||(candidatePools[key]=[]);for(let i=0;i<count;i++)pool.push({product:pickProduct(key),hints:null,sold:false});}
function shakeHints(product){return shuffled(products.filter(p=>p.category===product.category&&p.name!==product.name)).slice(0,2).map(p=>p.name);}
function togglePurchasePick(index){const q=validQuantity($('#box-quantity'),20);if(q===null)return;if(purchaseSelections.has(index))purchaseSelections.delete(index);else if(purchaseSelections.size<q)purchaseSelections.add(index);updatePurchase();}
function shuffled(values){const result=values.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(randomUnit()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function makeWholeSet(key,roll=randomUnit()){const pool=products.filter(p=>p.category===key),result=pool.filter(p=>p.tag==='REGULAR');if(key!=='aespa'&&roll<.30)result[Math.floor(randomUnit()*result.length)]=pool.find(p=>p.tag===(roll<.10?'SUPER SECRET':'SECRET'));return shuffled(result);}
function validQuantity(input,max){const q=Number(input.value);if(!Number.isSafeInteger(q)||q<1){input.setCustomValidity('Choose a positive whole number.');input.reportValidity();return null;}input.setCustomValidity('');return q;}
function pendingBoxes(){return purchasedBoxes.filter(b=>!b.opened);}
function setControls(disabled){['draw-series','box-format','box-quantity','pick-mode','prepare-boxes','reset-reveals','auto-inventory','skip-unboxing'].forEach(id=>$('#'+id).disabled=disabled);document.querySelectorAll('.series-actions button').forEach(b=>b.disabled=disabled);$('#draw-again').disabled=disabled;}
function renderInventory(){
 const grid=$('#box-grid');const savedScroll=grid.scrollLeft;grid.replaceChildren();grid.dataset.series='inventory';
 const pending=pendingBoxes();const summary=$('#inventory-summary');summary.replaceChildren();Object.entries(series).forEach(([key,s])=>{const all=purchasedBoxes.filter(b=>b.key===key);if(all.length)summary.append(make('span','',`${s.name} · 已买 ${all.length} / 剩余 ${all.filter(b=>!b.opened).length}`));});$('#unbox').hidden=purchasedBoxes.length===0;
 $('#batch-progress').textContent=`已买 ${purchasedBoxes.length} 盒 · 已开 ${purchasedBoxes.length-pending.length} 盒 · 剩余 ${pending.length} 盒`;
 if(!pending.length){grid.append(make('p','inventory-empty',purchasedBoxes.length?'All your boxes are open. Buy more whenever you like.':'No purchased boxes yet. Choose a series to buy boxes.'));}
 pending.slice(0,inventoryVisible).forEach(box=>{const button=make('button','sealed-box');button.dataset.boxId=String(box.id);button.classList.toggle('selected',chosenPurchasedId===box.id);button.disabled=busy||autoOpening;button.setAttribute('aria-label',series[box.key].name+' purchased box '+box.id);button.setAttribute('aria-pressed',String(chosenPurchasedId===box.id));const image=make('img','designed-box-image');image.src=`assets/box-${box.key}.webp`;image.alt=series[box.key].name+' unopened box';button.append(image,make('span','box-number',series[box.key].name+' · BOX '+box.id),make('small','inventory-origin',box.origin));button.addEventListener('click',()=>{if(busy||autoOpening)return;chosenPurchasedId=box.id;renderInventory();$('#draw-status').textContent='Box '+box.id+' selected. Open it now or leave it sealed.';});grid.append(button);});
 $('#more-inventory').hidden=pending.length<=inventoryVisible;$('#open-box').disabled=busy||autoOpening||!pending.some(b=>b.id===chosenPurchasedId);
 grid.scrollLeft=savedScroll;$('#open-box').textContent=chosenPurchasedId?'OPEN SELECTED BOX':'SELECT A PURCHASED BOX';$('#auto-inventory').disabled=busy||autoOpening||pending.length===0;$('#auto-inventory').textContent=`自动打开剩余 ${pending.length} 盒`;
}
// shop.js uses resetBoxes; after initialization it now refreshes purchased inventory.
resetBoxes=function(){if(!busy){chosenPurchasedId=null;renderInventory();}};
function updatePurchase(){
 const key=$('#draw-series').value,s=series[key],whole=$('#box-format').value==='set',manual=!whole&&$('#pick-mode').value==='manual';
 $('#single-format-image').src=`assets/box-${key}.webp`;$('#set-format-image').src=`assets/set-${key}.webp`;
 $('#single-format-image').alt=s.name+' single box';$('#set-format-image').alt=s.name+' whole set';$('#set-format-count').textContent=s.set+' boxes · no duplicates';$('#purchase-title').textContent=s.name+' · Buy Boxes';
 $('#choose-single').classList.toggle('active',!whole);$('#choose-set').classList.toggle('active',whole);$('#choose-single').setAttribute('aria-pressed',String(!whole));$('#choose-set').setAttribute('aria-pressed',String(whole));
 $('#format-description').textContent=whole?`${s.set} boxes per set. Buying adds sealed boxes to My boxes; you decide when to open them.`:'Buying adds sealed boxes to My boxes. The figure stays unknown until you open it.';
 $('#format-image').src=whole?`assets/set-${key}.webp`:`assets/box-${key}.webp`;
 $('#pick-mode-row').hidden=whole;$('#quantity-label').textContent=whole?'Quantity (whole sets)':'Quantity (single boxes)';
 const max=Infinity;$('#box-quantity').removeAttribute('max');
 $('#purchase-picks').hidden=!manual;const grid=$('#purchase-pick-grid');const oldScroll=grid.scrollLeft;grid.replaceChildren();
 if(manual){
  const pool=candidatesFor(key);
  pool.forEach((candidate,i)=>{
   const card=make('article','shake-card');card.classList.toggle('selected',purchaseSelections.has(i));
   const button=make('button','purchase-pick');button.disabled=candidate.sold;button.setAttribute('aria-pressed',String(purchaseSelections.has(i)));
   const image=make('img');image.src=`assets/box-${key}.webp`;image.alt=series[key].name+' sealed box '+(i+1);
   button.append(image,make('span','',candidate.sold?'PURCHASED':'BOX '+(i+1)));button.addEventListener('click',()=>togglePurchasePick(i));
   const shake=make('button','shake-button','摇一摇 · SHAKE');shake.disabled=candidate.sold;
   const hint=make('div','shake-hints');paintShakeHint(hint,candidate,key);
   shake.addEventListener('click',()=>{
    if(candidate.sold||shake.disabled)return;
    if(candidate.hints){paintShakeHint(hint,candidate,key);return;}
    shake.disabled=true;card.classList.add('shaking');hint.textContent='听听里面的声音…';
    setTimeout(()=>{candidate.hints=shakeHints(candidate.product);paintShakeHint(hint,candidate,key);card.classList.remove('shaking');shake.disabled=false;},reduced.matches?0:800);
   });
   card.append(button,shake,hint);grid.append(card);
  });
 }
 grid.scrollLeft=oldScroll;$('#purchase-pick-status').textContent=`已选 ${purchaseSelections.size} / ${$('#box-quantity').value} 盒 · contents remain a mystery`;
 const total=whole?Number($('#box-quantity').value)*s.set:Number($('#box-quantity').value);$('#prepare-boxes').textContent=`BUY · ADD ${total} SEALED BOXES`;
 $('#odds-list').innerHTML=key==='aespa'?'<div><span>Each character</span><b>25%</b></div>':'<div><span>Regular</span><b>70%</b></div><div><span>Secret</span><b>20%</b></div><div><span>Super secret</span><b>10%</b></div>';
 $('.odds>p').textContent=whole?'Demo per-set odds: 70% all regular; 20% one secret replaces a regular; 10% one super secret replaces a regular. No duplicates within each set. aespa contains all 4 characters.':'Free simulated single-box odds. Boxes are independent and may repeat. Buying does not reveal the figure.';
}
function openPurchase(key){if(busy||autoOpening)return;$('#draw-series').value=key;$('#box-format').value='single';$('#box-quantity').value='1';$('#pick-mode').value='random';purchaseSelections.clear();updatePurchase();$('#purchase-dialog').showModal();}
function addPurchased(key,format,q,mode,picks=[]){
 const ids=[];
 for(let unit=0;unit<q;unit++){
  const results=format==='set'?makeWholeSet(key):[mode==='manual'?candidatesFor(key)[picks[unit]].product:pickProduct(key)];if(format==='single'&&mode==='manual')candidatesFor(key)[picks[unit]].sold=true;
  results.forEach(product=>{const box={id:nextBoxId++,key,product,opened:false,origin:format==='set'?'Whole set '+(unit+1):mode==='manual'?'Picked box '+(picks[unit]+1):'Random pick'};purchasedBoxes.push(box);ids.push(box.id);});
 }
 return ids;
}
$('#prepare-boxes').addEventListener('click',()=>{if(busy||autoOpening)return;const key=$('#draw-series').value,format=$('#box-format').value,mode=$('#pick-mode').value;const max=Number($('#box-quantity').max),q=validQuantity($('#box-quantity'),max);if(q===null)return;if(format==='single'&&mode==='manual'&&purchaseSelections.size!==q){$('#purchase-pick-status').textContent=`Please select exactly ${q} sealed box(es).`;return;}addPurchased(key,format,q,mode,[...purchaseSelections]);$('#purchase-dialog').close();chosenPurchasedId=null;renderInventory();$('#draw-status').textContent='Boxes added. You can leave them sealed or select one to open.';$('#unbox').scrollIntoView({behavior:reduced.matches?'auto':'smooth'});});
['draw-series','box-format','box-quantity','pick-mode'].forEach(id=>$('#'+id).addEventListener('change',()=>{purchaseSelections.clear();updatePurchase();}));
$('#choose-single').addEventListener('click',()=>{$('#box-format').value='single';purchaseSelections.clear();updatePurchase();});$('#choose-set').addEventListener('click',()=>{$('#box-format').value='set';purchaseSelections.clear();updatePurchase();});
$('#purchase-close').addEventListener('click',()=>$('#purchase-dialog').close());
function finishAuto(showSummary=false){autoOpening=false;clearTimeout(autoTimer);autoIds=[];$('#stop-auto').hidden=true;setControls(false);renderInventory();if(showSummary&&autoResults.length){const items=[...autoResults];autoResults=[];if($('#result-dialog').open)$('#result-dialog').close();showBatchSummary(items);}}
function openPurchased(id){
 const box=purchasedBoxes.find(b=>b.id===id&&!b.opened);if(!box||busy)return;
 if($('#skip-unboxing').checked){box.opened=true;currentResult=box.product;reveals.unshift(box.product);unlockProduct(box.product);chosenPurchasedId=null;if(autoOpening){autoResults.push(box.product);if(autoIds.length){autoTimer=setTimeout(()=>openPurchased(autoIds.shift()),0);}else{renderShelf();finishAuto(true);$('#draw-status').textContent='Auto opening complete.';}}else{renderShelf();renderInventory();showBatchSummary([box.product]);$('#draw-status').textContent='Box opened without animation.';}return;}
 busy=true;setControls(true);$('#open-box').disabled=true;$('#box-grid').querySelectorAll('button').forEach(b=>b.disabled=true);$('#draw-status').textContent='Opening box '+box.id+'…';const openingLayer=make('div','opening-overlay');openingLayer.setAttribute('role','status');const openingImage=make('img');openingImage.src=`assets/box-${box.key}.webp`;openingImage.alt=series[box.key].name+' box opening';openingLayer.append(make('p','kicker','UNBOXING YOUR LITTLE LOOT'),openingImage,make('strong','','正在开箱…'));document.querySelector('.draw-stage').append(openingLayer);
 setTimeout(()=>{openingLayer.remove();box.opened=true;currentResult=box.product;reveals.unshift(box.product);if(autoOpening)autoResults.push(box.product);unlockProduct(box.product);fillResult(box.product,true);renderShelf();$('#result-dialog').showModal();playRareReveal(box.product);busy=false;chosenPurchasedId=null;renderInventory();$('#stop-auto').hidden=!autoOpening;
 if(autoOpening){setControls(true);autoTimer=setTimeout(()=>{if(!autoOpening)return;if(!autoIds.length){finishAuto(true);$('#draw-status').textContent='Auto opening complete.';return;}const next=autoIds.shift();autoAdvanceClose=true;$('#result-dialog').close();openPurchased(next);},reduced.matches?1200:box.product.tag==='REGULAR'?1800:6500);}else{setControls(false);$('#draw-status').textContent='Box revealed. Your other purchased boxes remain sealed.';}
 },reduced.matches?0:1300);
}
$('#open-box').addEventListener('click',()=>{if(!autoOpening)openPurchased(chosenPurchasedId);});
$('#reset-reveals').addEventListener('click',()=>{if(busy)return;finishAuto();purchasedBoxes=[];nextBoxId=1;chosenPurchasedId=null;renderInventory();});
$('#auto-inventory').addEventListener('click',()=>{
 if(busy||autoOpening)return;
 autoIds=pendingBoxes().map(box=>box.id);if(!autoIds.length)return;
 autoResults=[];autoOpening=true;setControls(true);chosenPurchasedId=null;renderInventory();$('#stop-auto').hidden=false;openPurchased(autoIds.shift());
});
$('#stop-auto').addEventListener('click',()=>{finishAuto();$('#draw-status').textContent='Stopped. Remaining boxes stay sealed in My boxes.';});
$('#result-dialog').addEventListener('close',()=>{if(autoAdvanceClose){autoAdvanceClose=false;return;}if(autoOpening&&!busy)finishAuto();});
['purchase-dialog'].forEach(id=>{const d=$('#'+id);d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});

renderInventory();updatePurchase();

$('#pick-scroll-prev').addEventListener('click',()=>$('#purchase-pick-grid').scrollBy({left:-450,behavior:reduced.matches?'auto':'smooth'}));
$('#pick-scroll-next').addEventListener('click',()=>$('#purchase-pick-grid').scrollBy({left:450,behavior:reduced.matches?'auto':'smooth'}));
$('#more-pick-boxes').addEventListener('click',()=>{addCandidates($('#draw-series').value,24);const grid=$('#purchase-pick-grid'),oldWidth=grid.scrollWidth;updatePurchase();grid.scrollTo({left:oldWidth,behavior:reduced.matches?'auto':'smooth'});});

function paintShakeHint(container,candidate,key){
 container.replaceChildren();
 if(!candidate.hints){container.append(make('p','hint-empty','摇一摇，排除两款'));return;}
 container.append(make('p','hint-label','不在这盒里 / NOT INSIDE'));
 const row=make('div','hint-photos');
 candidate.hints.forEach(name=>{
  const p=products.find(p=>p.category===key&&p.name===name),secret=p.tag==='SUPER SECRET'&&isLocked(p);
  const tile=make('div','hint-figure'+(secret?' hint-mystery':''));const image=make('img');image.src=secret?mysteryPixel:p.image;image.alt=secret?'Super secret mystery design':p.name;tile.append(image);
  tile.append(make('span','hint-cross','×'),make('small','',secret?'SUPER SECRET':p.name));row.append(tile);
 });container.append(row);
}
(() => {
 const rail=$('#purchase-pick-grid');let drag=null,suppressClick=false;
 rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,scroll:rail.scrollLeft,moved:false};});
 window.addEventListener('pointermove',e=>{if(!drag)return;const distance=e.clientX-drag.x;if(Math.abs(distance)>6)drag.moved=true;if(!drag.moved)return;e.preventDefault();rail.classList.add('mouse-dragging');rail.scrollLeft=drag.scroll-distance;},{passive:false});
 window.addEventListener('pointerup',()=>{if(!drag)return;suppressClick=drag.moved;drag=null;rail.classList.remove('mouse-dragging');setTimeout(()=>{suppressClick=false;},0);});
 window.addEventListener('pointercancel',()=>{drag=null;rail.classList.remove('mouse-dragging');});
 rail.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);
 rail.addEventListener('dragstart',e=>e.preventDefault());
})();

$('#refresh-pick-boxes').addEventListener('click',()=>{
 if(busy||autoOpening)return;
 const key=$('#draw-series').value;candidatePools[key]=[];purchaseSelections.clear();
 addCandidates(key,24);updatePurchase();$('#purchase-pick-grid').scrollLeft=0;
 $('#purchase-pick-status').textContent='已换新一批：24 盒。已买盒子和解锁记录保留。';
});

function enableDragRail(rail){let drag=null,suppress=false;rail.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0)drag={x:e.clientX,scroll:rail.scrollLeft,moved:false};});window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6)drag.moved=true;if(drag.moved){e.preventDefault();rail.classList.add('mouse-dragging');rail.scrollLeft=drag.scroll-dx;}},{passive:false});window.addEventListener('pointerup',()=>{if(!drag)return;suppress=drag.moved;drag=null;rail.classList.remove('mouse-dragging');setTimeout(()=>suppress=false,0);});window.addEventListener('pointercancel',()=>{drag=null;rail.classList.remove('mouse-dragging');});rail.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation();}},true);rail.addEventListener('dragstart',e=>e.preventDefault());}
enableDragRail($('#box-grid'));
$('#inventory-prev').addEventListener('click',()=>$('#box-grid').scrollBy({left:-600,behavior:reduced.matches?'auto':'smooth'}));
$('#inventory-next').addEventListener('click',()=>$('#box-grid').scrollBy({left:600,behavior:reduced.matches?'auto':'smooth'}));
$('#more-inventory').addEventListener('click',()=>{inventoryVisible+=60;renderInventory();});
