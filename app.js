const products = [["Hot Sauce", 36, "REGULAR", "A bold red look. A little attitude. A moment made for the spotlight."], ["Stage Charisma", 22, "REGULAR", "Black, denim and unmistakable stage presence."], ["Encore Bloom", 33, "REGULAR", "A bright encore in white and silver."], ["Love Signal", 35, "REGULAR", "Pink details and a playful heart-filled moment."], ["Soft Moment", 34, "REGULAR", "A quiet moment in a delicate floral dress."], ["Golden", 32, "SECRET", "A golden stage scene with miniature companions."], ["Eggyeon", 31, "SUPER SECRET", "A playful surprise surrounded by tiny characters."]];
const dialog = document.querySelector('#product-dialog');
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
 const [name, image, tag, description] = products[Number(button.dataset.product)];
 document.querySelector('#detail-image').src = `assets/img-${image}.webp`;
 document.querySelector('#detail-image').alt = `AHYEON ${name} collectible figure`;
 document.querySelector('#detail-name').textContent = name;
 document.querySelector('#detail-tag').textContent = tag;
 document.querySelector('#detail-description').textContent = description;
 document.querySelector('#detail-edition').textContent = tag === 'REGULAR' ? 'Regular design · one of five' : tag === 'SECRET' ? 'Secret edition · Golden' : 'Super secret edition · Eggyeon';
 currentFigureImage = `assets/img-${image}.webp`;
 currentFigureName = name;
 setDetailView('figure');
 setDetailBox('single');
 dialog.showModal();
 dialog.scrollTop = 0;
}));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.querySelectorAll('[data-product]').forEach(p => { const n=Number(p.dataset.product);p.hidden=button.dataset.filter==='regular'?n>4:button.dataset.filter==='hidden'?n<5:false; });
}));
document.querySelectorAll('[data-box]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-box]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 const set=button.dataset.box==='set';
 document.querySelector('#box-title').textContent=set?'Five boxes. More moments.':'One box. One surprise.';
 document.querySelector('#box-description').textContent=set?'5 blind boxes with no duplicate designs within one sealed set. Without a hidden edition, collect all 5 regular designs.':'1 random figure set, a base and a matching character card. Discover one of 5 regular designs or a hidden edition.';
}));

let currentFigureImage = '';
let currentFigureName = '';
function setDetailView(view) {
 const cards = view === 'cards';
 document.querySelector('#detail-image').src = cards ? 'assets/img-23.webp' : currentFigureImage;
 document.querySelector('#detail-image').alt = cards ? 'AHYEON collection character cards and common card back' : `AHYEON ${currentFigureName} figure design`;
 document.querySelector('#gallery-caption').textContent = cards ? 'Collection card designs · one matching card included per single box' : 'Figure design reference';
 document.querySelectorAll('[data-detail-view]').forEach(b => {const active=b.dataset.detailView===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}
function setDetailBox(format) {
 const whole = format === 'set';
 document.querySelector('#detail-box-title').textContent = whole ? 'Five boxes. No duplicate designs.' : 'One box. One surprise.';
 document.querySelector('#detail-box-description').textContent = whole ? '5 blind boxes in one sealed set. Without a hidden edition, the set contains all 5 regular designs. A hidden edition replaces one regular design.' : '1 random figure set, a base and a matching character card. The collection includes 5 regular designs and 2 hidden editions.';
 document.querySelectorAll('[data-detail-box]').forEach(b => {const active=b.dataset.detailBox===format;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}
 document.querySelectorAll('[data-detail-view]').forEach(b => b.addEventListener('click',()=>setDetailView(b.dataset.detailView)));
 document.querySelectorAll('[data-detail-box]').forEach(b => b.addEventListener('click',()=>setDetailBox(b.dataset.detailBox)));
