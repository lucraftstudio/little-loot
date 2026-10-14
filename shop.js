const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const series={ahyeon:{name:'AHYEON',title:'Moments Collection',pack:'assets/img-25.webp',poster:'assets/img-30.webp',set:5,height:'Approx. 10–12 cm, including base',regular:5},aespa:{name:'aespa',title:'WHIPLASH',pack:'assets/aespa-17.webp',poster:'assets/aespa-19.webp',set:4,height:'Approx. 10–12 cm, including base',regular:4},ruka:{name:'RUKA',title:'Street Collection',pack:'assets/ruka-22.webp',poster:'assets/ruka-3.webp',set:6,height:'Height to be confirmed; varies by design',regular:6},moka:{name:'MOKA',title:'Blind Box Collection',pack:'assets/moka-18.webp',poster:'assets/moka-3.webp',set:6,height:'Approx. 10–12 cm, including base',regular:6}};
const $=s=>document.querySelector(s);let selected=null,busy=false,reveals=[],currentResult=null;
const unlockKey='little-loot-unlocked-v1';
// Unlocks belong to the current page visit, matching the reveal shelf.
let unlocked=new Set();
try{localStorage.removeItem(unlockKey);}catch{}
function productKey(p){return p.category+':'+p.name;}
function isLocked(p){return p.tag!=='REGULAR'&&!unlocked.has(productKey(p));}
function unlockProduct(p){unlocked.add(productKey(p));}
const mysteryPixel='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
function randomUnit(){const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]/4294967296;}
function pickProduct(category,roll=randomUnit(),regularRoll=randomUnit()){const pool=products.filter(p=>p.category===category),regular=pool.filter(p=>p.tag==='REGULAR');if(category!=='aespa'){if(roll<.10)return pool.find(p=>p.tag==='SUPER SECRET');if(roll<.30)return pool.find(p=>p.tag==='SECRET');}return regular[Math.min(regular.length-1,Math.floor(regularRoll*regular.length))];}
function chance(p){return p.category==='aespa'?25:p.tag==='SUPER SECRET'?10:p.tag==='SECRET'?20:70/series[p.category].regular;}
function make(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
Object.entries(series).forEach(([key,s])=>{const card=make('article','series-card');const image=make('img');image.src=s.pack;image.alt=s.name+' blind box packaging';image.loading='lazy';const copy=make('div','series-copy');copy.append(make('span','series-label','BLIND BOX SERIES'),make('h3','',s.name+' · '+s.title),make('p','',`${s.regular} regular designs${key==='aespa'?'':' + 2 hidden editions'}`));const formats=make('div','formats');formats.append(make('span','','Single box · random'),make('span','',`Whole set · ${s.set} boxes`));copy.append(formats);const actions=make('div','series-actions');const details=make('button','secondary','VIEW SERIES');details.addEventListener('click',()=>showSeries(key));const draw=make('button','primary','BUY BOXES');draw.addEventListener('click',()=>{openPurchase(key);});actions.append(details,draw);copy.append(actions);card.append(image,copy);$('#series-grid').append(card);});
function showSeries(key){const s=series[key],detail=$('#series-detail');detail.replaceChildren();detail.append(make('p','kicker','BLIND BOX COLLECTION'),make('h2','',s.name+' · '+s.title));const intro=make('div','series-intro');const pack=make('img');pack.src=s.pack;pack.alt=s.name+' packaging';const copy=make('div');copy.append(make('h3','','Single box'),make('p','','1 random figure, base and matching character card'+(key==='ruka'?', plus design-specific accessories.':key==='moka'?', with design-specific accessories and a camera-shaped collector card.':'.')),make('h3','','Whole set'),make('p','',`${s.set} sealed boxes with no repeated regular designs.${key==='aespa'?' One of each character.':' A hidden edition replaces a regular design; hidden editions are not guaranteed.'}`),make('p','',s.height+' · Proposed material: PVC / ABS.'),make('p','fine','Design concept; final specifications to be confirmed.'));intro.append(pack,copy);detail.append(intro,make('h3','','The complete lineup'));const grid=make('div','lineup');products.filter(p=>p.category===key).forEach(p=>{const item=make('button','lineup-item');const img=make('img');const locked=isLocked(p);item.classList.toggle('locked-secret',locked&&p.tag==='SECRET');item.classList.toggle('locked-super',locked&&p.tag==='SUPER SECRET');img.src=locked&&p.tag==='SUPER SECRET'?mysteryPixel:p.image;img.alt=locked?p.tag+' locked design':p.name;img.loading='lazy';item.append(img,make('span','',locked&&p.tag==='SUPER SECRET'?'???':p.name),make('small','',locked?'DRAW TO UNLOCK':p.tag));item.addEventListener('click',()=>showPreview(p));grid.append(item);});detail.append(grid);$('#series-dialog').showModal();}
function showPreview(p){currentResult=p;fillResult(p,false);$('#series-dialog').close();$('#result-dialog').showModal();}
function resetBoxes(){if(busy)return;selected=null;const key=$('#draw-series').value,s=series[key];const grid=$('#box-grid');grid.dataset.series=key;grid.replaceChildren();for(let i=0;i<products.filter(p=>p.category===key).length;i++){const b=make('button','sealed-box');b.setAttribute('aria-label',`Select sealed box ${i+1}`);b.setAttribute('aria-pressed','false');const boxImage=make('img','designed-box-image');boxImage.src=`assets/box-${key}.webp`;boxImage.alt=s.name+' sealed blind box packaging';b.append(boxImage,make('span','box-number','BOX '+String(i+1).padStart(2,'0')));b.addEventListener('click',()=>{if(busy)return;selected=i;grid.querySelectorAll('button').forEach((n,j)=>{n.classList.toggle('selected',i===j);n.setAttribute('aria-pressed',String(i===j));});$('#open-box').disabled=false;$('#open-box').textContent='OPEN BOX '+(i+1);$('#draw-status').textContent='Box '+(i+1)+' selected. Your surprise is sealed.';});grid.append(b);}$('#open-box').disabled=true;$('#open-box').textContent='SELECT A BOX TO OPEN';$('#draw-status').textContent='Pick any sealed box above.';$('#odds-list').innerHTML=key==='aespa'?'<div><span>Each character</span><b>25%</b></div>':`<div><span>Regular designs (combined)</span><b>70%</b></div><div><span>Each regular design</span><b>${(70/s.regular).toFixed(2)}%</b></div><div><span>Secret</span><b>20%</b></div><div><span>Super secret</span><b>10%</b></div>`;}
function fillResult(p,draw){clearRareReveal();const notice=document.querySelector('#rare-win-notice');notice.hidden=true;const s=series[p.category],locked=isLocked(p);$('#result-dialog').classList.toggle('locked-secret',locked&&p.tag==='SECRET');$('#result-dialog').classList.toggle('locked-super',locked&&p.tag==='SUPER SECRET');$('.reveal-head .kicker').textContent=draw?'YOUR BOX IS OPEN':'DESIGN PREVIEW';$('#result-edition').textContent=p.tag;$('#result-edition').className=p.tag==='REGULAR'?'':'rare';$('#result-name').textContent=locked&&p.tag==='SUPER SECRET'?'???':p.name;$('#result-series').textContent=s.name+' · '+s.title;$('#result-description').textContent=locked?(p.tag==='SECRET'?p.description+' Draw this edition to unlock its matching character card.':'A mystery waiting inside a sealed box. Draw this edition to unlock its figure and matching card.'):p.description;$('#result-odds').textContent='Demo reveal probability: '+chance(p).toFixed(2)+'%';const controls=$('#result-image-controls');controls.replaceChildren();const views=[['Figure',p.image],['Character card',p.card]];if(!locked&&p.name==='Snack Hideout'&&p.category==='ruka')views.push(['Detachable design','assets/ruka-21.webp']);if(!locked&&p.category==='moka'&&p.tag==='SUPER SECRET')views.push(['Display detail','assets/moka-17.webp']);views.forEach(([label,src],i)=>{const b=make('button',i===0?'active':'',label);b.addEventListener('click',()=>{controls.querySelectorAll('button').forEach(n=>n.classList.remove('active'));b.classList.add('active');$('#result-image').classList.toggle('blur-card',locked&&p.tag==='SECRET'&&label==='Character card');$('#result-image').src=locked&&p.tag==='SUPER SECRET'?mysteryPixel:src;$('#result-image').alt=locked?'Locked '+label:p.name+' '+label;});controls.append(b);});$('#result-image').classList.remove('blur-card');$('#result-image').src=locked&&p.tag==='SUPER SECRET'?mysteryPixel:p.image;$('#result-image').alt=locked?'Locked figure':p.name;}

function groupReveals(items){const groups=new Map();items.forEach(p=>{const key=productKey(p);if(groups.has(key))groups.get(key).count++;else groups.set(key,{product:p,count:1});});return [...groups.values()];}
function renderRevealCards(container,items){container.replaceChildren();if(!items.length){container.append(make('p','empty','Your first surprise starts with a sealed box.'));return;}groupReveals(items).forEach(({product:p,count})=>{const b=make('button','shelf-item');const img=make('img');img.src=p.image;img.alt=p.name;img.loading='lazy';const badge=make('b','duplicate-count','×'+count);b.append(img,badge,make('span','',p.name),make('small','',series[p.category].name+' · '+p.tag));b.setAttribute('aria-label',p.name+', '+count+' collected');b.addEventListener('click',()=>{const summary=$('#batch-summary-dialog');if(summary.open)summary.close();currentResult=p;fillResult(p,true);$('#result-dialog').showModal();});container.append(b);});}
function renderShelf(){$('#reveal-count').textContent=reveals.length+' reveals · '+groupReveals(reveals).length+' unique designs';renderRevealCards($('#reveal-shelf'),reveals);}
function showBatchSummary(items){$('#batch-summary-count').textContent='本次开箱 '+items.length+' 盒 · '+groupReveals(items).length+' 款公仔';renderRevealCards($('#batch-summary-grid'),items);$('#batch-summary-dialog').showModal();}
$('#draw-again').addEventListener('click',()=>{$('#result-dialog').close();$('#unbox').scrollIntoView({behavior:reduced.matches?'auto':'smooth'});});$('#draw-series').addEventListener('change',resetBoxes);document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}));
const campaigns={
 moka:{image:'assets/banner-moka.webp',heading:'A little moment.\nA lot to love.',copy:'Six regular designs. Two hidden editions.\nDiscover MOKA’s camera-shaped collector cards.',meta:'6 REGULAR + 2 HIDDEN'},
 ruka:{image:'assets/banner-ruka.webp',heading:'Street style.\nLittle surprises.',copy:'Six regular looks. Two hidden editions.\nFind your next street-inspired moment.',meta:'6 REGULAR + 2 HIDDEN'},
 ahyeon:{image:'assets/banner-ahyeon.webp',heading:'Every look.\nA little moment.',copy:'Stage charisma, soft moments and hidden surprises.\nMeet the Moments Collection.',meta:'5 REGULAR + 2 HIDDEN'},
 aespa:{image:'assets/banner-aespa.webp',heading:'Four icons.\nOne collection.',copy:'Winter. Karina. Giselle. Ningning.\nDiscover the WHIPLASH blind box series.',meta:'4 CHARACTER DESIGNS'}
};
let posterIndex=0,posterPause=reduced.matches,posterTimer,hover=false,focus=false;const posterKeys=['moka','ruka','ahyeon','aespa'];function showPoster(){const s=series[posterKeys[posterIndex]];const key=posterKeys[posterIndex],campaign=campaigns[key];$('#hero-poster').src=campaign.image;$('.hero-poster').dataset.campaign=key;$('#campaign-kicker').textContent=s.name+' / '+s.title;$('#campaign-heading').textContent=campaign.heading;$('#campaign-copy').textContent=campaign.copy;$('#campaign-meta').textContent=campaign.meta+' · BY STUPIDSW';$('#campaign-buy').textContent='BUY '+s.name.toUpperCase()+' BOXES';$('#hero-poster').alt=s.name+' collection poster';$('#poster-name').textContent=s.name+' / '+s.title;}function posterSchedule(){clearInterval(posterTimer);if(!posterPause&&!hover&&!focus&&!document.hidden&&!document.querySelector('dialog[open]'))posterTimer=setInterval(()=>{posterIndex=(posterIndex+1)%posterKeys.length;showPoster();},5000);}$('#poster-next').addEventListener('click',()=>{posterIndex=(posterIndex+1)%posterKeys.length;showPoster();posterSchedule();});$('#poster-prev').addEventListener('click',()=>{posterIndex=(posterIndex+posterKeys.length-1)%posterKeys.length;showPoster();posterSchedule();});$('#poster-pause').textContent=posterPause?'Play':'Pause';$('#poster-pause').addEventListener('click',()=>{posterPause=!posterPause;$('#poster-pause').textContent=posterPause?'Play':'Pause';posterSchedule();});$('.hero-poster').addEventListener('mouseenter',()=>{hover=true;posterSchedule();});$('.hero-poster').addEventListener('mouseleave',()=>{hover=false;posterSchedule();});$('.hero-poster').addEventListener('focusin',()=>{focus=true;posterSchedule();});$('.hero-poster').addEventListener('focusout',e=>{if(!$('.hero-poster').contains(e.relatedTarget)){focus=false;posterSchedule();}});document.addEventListener('visibilitychange',posterSchedule);document.querySelectorAll('dialog').forEach(d=>new MutationObserver(posterSchedule).observe(d,{attributes:true,attributeFilter:['open']}));resetBoxes();posterSchedule();

let rareEffectTimer;
function clearRareReveal(){
 clearTimeout(rareEffectTimer);
 const dialog=document.querySelector('#result-dialog');
 dialog.querySelector('.rare-celebration')?.remove();
 dialog.classList.remove('rare-reveal','super-reveal');
}
function playRareReveal(p){
 clearRareReveal();
 if(p.tag==='REGULAR')return;
 const dialog=document.querySelector('#result-dialog'),superRare=p.tag==='SUPER SECRET';
 dialog.classList.add(superRare?'super-reveal':'rare-reveal');
 const notice=document.querySelector('#rare-win-notice');
 notice.hidden=false;notice.className=superRare?'rare-win-notice gold':'rare-win-notice purple';
 notice.textContent=superRare?'★ 恭喜！抽中超级隐藏款 · SUPER SECRET ★':'✦ 恭喜！抽中隐藏款 · SECRET ✦';
 if(reduced.matches)return;
 const layer=make('div','rare-celebration big-celebration');layer.setAttribute('aria-hidden','true');
 const burst=make('div','win-burst');
 const splash=make('div','win-splash');
 splash.append(make('span','win-icon',superRare?'★':'✦'),make('p','win-small','CONGRATULATIONS'),make('h2','win-title',superRare?'超级隐藏款！':'隐藏款！'),make('strong','win-en',superRare?'SUPER SECRET':'SECRET FOUND'),make('p','win-product',p.name));
 layer.append(burst,splash);
 for(let i=0;i<70;i++){
  const particle=make('span','rare-particle',i%4===0?'✦':'');
  particle.style.setProperty('--x',((i*37)%100)+'%');
  particle.style.setProperty('--delay',(i%12)*.11+'s');
  particle.style.setProperty('--turn',(i*53)+'deg');
  layer.append(particle);
 }
 dialog.append(layer);
 rareEffectTimer=setTimeout(()=>{layer.remove();},6200);
}
document.querySelector('#result-dialog').addEventListener('close',clearRareReveal);

document.querySelector('#reset-reveals').addEventListener('click',()=>{
 if(busy)return;
 unlocked.clear();reveals=[];currentResult=null;
 try{localStorage.removeItem(unlockKey);}catch{}
 clearTimeout(rareEffectTimer);
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());
 document.querySelector('#reveal-count').textContent='0 reveals this visit';
 const shelf=document.querySelector('#reveal-shelf');shelf.replaceChildren(make('p','empty','Your first surprise starts with a sealed box.'));
 resetBoxes();
 document.querySelector('#draw-status').textContent='Reset complete. Hidden cards and super secret editions are locked again.';
});

$('#campaign-buy').addEventListener('click',()=>openPurchase(posterKeys[posterIndex]));
document.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{const product=products.find(p=>p.name===button.dataset.feature&&p.category===button.dataset.featureSeries);if(product)showPreview(product);}));
(() => {const hero=$('.hero-poster');let start;hero.style.touchAction='pan-y';hero.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')start={x:e.clientX,y:e.clientY};});hero.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){posterIndex=(posterIndex+(dx<0?1:posterKeys.length-1))%posterKeys.length;showPoster();posterSchedule();}});hero.addEventListener('pointercancel',()=>start=null);})();
showPoster();
