const products = [{"name": "Hot Sauce", "image": "assets/img-36.webp", "tag": "REGULAR", "description": "A bold red look. A little attitude. A moment made for the spotlight.", "category": "ahyeon"}, {"name": "Stage Charisma", "image": "assets/img-22.webp", "tag": "REGULAR", "description": "Black, denim and unmistakable stage presence.", "category": "ahyeon"}, {"name": "Encore Bloom", "image": "assets/img-33.webp", "tag": "REGULAR", "description": "A bright encore in white and silver.", "category": "ahyeon"}, {"name": "Love Signal", "image": "assets/img-35.webp", "tag": "REGULAR", "description": "Pink details and a playful heart-filled moment.", "category": "ahyeon"}, {"name": "Soft Moment", "image": "assets/img-34.webp", "tag": "REGULAR", "description": "A quiet moment in a delicate floral dress.", "category": "ahyeon"}, {"name": "Golden", "image": "assets/img-32.webp", "tag": "SECRET", "description": "A golden stage scene with miniature companions.", "category": "ahyeon"}, {"name": "Eggyeon", "image": "assets/img-31.webp", "tag": "SUPER SECRET", "description": "A playful surprise surrounded by tiny characters.", "category": "ahyeon"}, {"name": "Winter", "image": "assets/aespa-16.webp", "tag": "REGULAR", "description": "A short black hairstyle and layered black stage look.", "category": "aespa"}, {"name": "Karina", "image": "assets/aespa-14.webp", "tag": "REGULAR", "description": "A high ponytail, headband and asymmetric black stage outfit.", "category": "aespa"}, {"name": "Giselle", "image": "assets/aespa-15.webp", "tag": "REGULAR", "description": "Pink hair and a black stage outfit with metallic details.", "category": "aespa"}, {"name": "Ningning", "image": "assets/aespa-13.webp", "tag": "REGULAR", "description": "An updo and a black-and-silver stage look with wide-leg trousers.", "category": "aespa"}];

const collections = {
 ahyeon:{name:'AHYEON · Moments Collection',lineup:'5 regular · 1 secret · 1 super secret',count:7,hero:'assets/img-30.webp',pack:'assets/img-25.webp',cards:'assets/img-23.webp',rule:'A hidden edition replaces one regular design. Hidden editions are not guaranteed in a whole set.',set:'5 blind boxes with no duplicate designs within one sealed set. Without a hidden edition, collect all 5 regular designs.',concept:'BABYMONSTER-inspired design concept'},
 aespa:{name:'aespa · WHIPLASH Blind Box Collection',lineup:'4 character designs',count:4,hero:'assets/aespa-19.webp',pack:'assets/aespa-17.webp',cards:'assets/aespa-18.webp',rule:'A whole set contains one of each of the four characters, with no repeats.',set:'4 blind boxes. One of each character: Winter, Karina, Giselle and Ningning. No repeats.',concept:'aespa WHIPLASH design concept'}
};
const dialog=document.querySelector('#product-dialog');
let category='all', filter='all', currentProduct=null, pageBox='single';
const text=(selector,value)=>{document.querySelector(selector).textContent=value;};
function toggleButtons(selector,key,value){document.querySelectorAll(selector).forEach(b=>{const on=b.dataset[key]===value;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});}
function renderProducts(){
 const scoped=products.filter(p=>category==='all'||p.category===category);
 const filtered=scoped.filter(p=>filter==='all'||(filter==='regular'?p.tag==='REGULAR':p.tag!=='REGULAR'));
 const grid=document.querySelector('.grid');grid.replaceChildren();
 filtered.forEach(p=>{
  const button=document.createElement('button');button.className='product';button.dataset.product=String(products.indexOf(p));button.setAttribute('aria-label',`View ${p.name}`);
  const photo=document.createElement('div');photo.className='photo';
  const image=document.createElement('img');image.src=p.image;image.alt=`${p.name} collectible figure`;image.loading='lazy';photo.append(image);
  const badge=document.createElement('span');badge.className='badge'+(p.tag==='REGULAR'?'':' rare');badge.textContent=p.tag;photo.append(badge);
  const plus=document.createElement('span');plus.className='plus';plus.textContent='+';photo.append(plus);
  const caption=document.createElement('div');caption.className='product-caption';
  const series=document.createElement('span');series.textContent=p.category==='aespa'?'aespa / WHIPLASH':'AHYEON / MOMENTS';
  const title=document.createElement('h3');title.textContent=p.name;const sub=document.createElement('p');sub.textContent=collections[p.category].name;
  caption.append(series,title,sub);button.append(photo,caption);button.addEventListener('click',()=>openProduct(p));grid.append(button);
 });
 if(!filtered.length){const empty=document.createElement('p');empty.className='empty-category';empty.textContent='No hidden editions in this collection. Select All figures or Regular to explore its designs.';grid.append(empty);}
 text('[data-filter="all"] span',scoped.length);text('[data-filter="regular"] span',scoped.filter(p=>p.tag==='REGULAR').length);text('[data-filter="hidden"] span',scoped.filter(p=>p.tag!=='REGULAR').length);
 text('#category-count',`${filtered.length} figures · ${category==='all'?'2 collections':collections[category].name}`);
 toggleButtons('[data-filter]','filter',filter);
}
function updateCollection(){
 const c=collections[category==='all'?'ahyeon':category];
 document.querySelector('.hero-image > img').src=c.hero;document.querySelector('.hero-image > img').alt=c.name+' collection display';
 document.querySelector('.packaging img').src=c.pack;document.querySelector('.packaging img').alt=c.name+' packaging';
 document.querySelector('.cards-section img').src=c.cards;document.querySelector('.cards-section img').alt=c.name+' character cards';
 text('#collection-spec-name',c.name);text('#collection-spec-lineup',c.lineup);text('#collection-rule-note',c.rule);
 text('#collection-card-copy',`Each single box in ${c.name} includes a matching character card, alongside the figure and base.`);
 text('.unbox-copy .eyebrow',category==='all'?'AHYEON · MOMENTS / BOX DETAILS':c.name.toUpperCase());
 text('.cards-section .eyebrow',c.name.toUpperCase()+' / CHARACTER CARDS');
 setPageBox('single');
}
function setPageBox(format){pageBox=format;const c=collections[category==='all'?'ahyeon':category];toggleButtons('[data-box]','box',format);text('#box-title',format==='set'?(c.count===4?'Four boxes. Four characters.':'Five boxes. More moments.'):'One box. One surprise.');text('#box-description',format==='set'?c.set:`1 random figure, a base and a matching character card. ${c.lineup}.`);}
function openProduct(p){currentProduct=p;const c=collections[p.category];text('#detail-name',p.name);text('#detail-tag',p.tag);text('#detail-description',p.description);text('#detail-series',c.name);text('#detail-lineup',c.lineup);text('#detail-edition',p.tag==='REGULAR'?(p.category==='aespa'?'Character design · one of four':'Regular design · one of five'):p.tag==='SECRET'?'Secret edition':'Super secret edition');text('#detail-rule-note',c.rule);text('#detail-concept-note',`${c.concept}. Final specifications are to be confirmed. Sizes vary by design; colours and finishes are visual references. Display props and scene backgrounds are not included unless specified.`);setDetailView('figure');setDetailBox('single');dialog.showModal();dialog.scrollTop=0;}
function setDetailView(view){if(!currentProduct)return;const c=collections[currentProduct.category],cards=view==='cards';document.querySelector('#detail-image').src=cards?c.cards:currentProduct.image;document.querySelector('#detail-image').alt=cards?c.name+' collection character cards':currentProduct.name+' figure design';text('#gallery-caption',cards?'Collection card designs · one matching card per single box':'Figure design reference');toggleButtons('[data-detail-view]','detailView',view);}
function setDetailBox(format){if(!currentProduct)return;const c=collections[currentProduct.category],whole=format==='set';text('#detail-box-title',whole?(currentProduct.category==='aespa'?'Four boxes. No repeated characters.':'Five boxes. No duplicate designs.'):'One box. One surprise.');text('#detail-box-description',whole?c.set:`1 random figure, a base and a matching character card. ${c.lineup}.`);toggleButtons('[data-detail-box]','detailBox',format);}
document.querySelector('#category-select').addEventListener('change',e=>{category=e.target.value;filter='all';renderProducts();updateCollection();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;renderProducts();}));
document.querySelectorAll('[data-box]').forEach(b=>b.addEventListener('click',()=>setPageBox(b.dataset.box)));
document.querySelectorAll('[data-detail-box]').forEach(b=>b.addEventListener('click',()=>setDetailBox(b.dataset.detailBox)));
document.querySelectorAll('[data-detail-view]').forEach(b=>b.addEventListener('click',()=>setDetailView(b.dataset.detailView)));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
renderProducts();updateCollection();
