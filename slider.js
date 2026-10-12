(() => {
 const slider=document.querySelector('.figure-slider');
 const track=document.querySelector('#hero-slides');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0, paused=reduced.matches, hover=false, focused=false, timer;
 products.forEach((product,i)=>{
  const slide=document.createElement('article');slide.className='figure-slide';slide.setAttribute('aria-label',`${i+1} of ${products.length}: ${product.name}`);
  const image=document.createElement('img');image.src=product.image;image.alt=`${product.name} collectible figure`;image.loading=i===0?'eager':'lazy';
  const copy=document.createElement('div');copy.className='figure-slide-copy';
  const series=document.createElement('p');series.className='eyebrow';series.textContent=collections[product.category].name;
  const name=document.createElement('h2');name.textContent=product.name;
  const badge=document.createElement('span');badge.className='slider-edition';badge.textContent=product.tag;
  const button=document.createElement('button');button.textContent='View figure';button.className='slide-open';button.addEventListener('click',()=>openProduct(product));
  copy.append(series,name,badge,button);slide.append(image,copy);track.append(slide);
 });
 function render(){
  track.style.transform=`translateX(-${index*100}%)`;
  [...track.children].forEach((slide,i)=>{slide.inert=i!==index;slide.setAttribute('aria-hidden',String(i!==index));});
  document.querySelector('#slide-count').textContent=`${String(index+1).padStart(2,'0')} / ${products.length}`;
 }
 function schedule(){clearInterval(timer);if(!paused&&!hover&&!focused&&!document.hidden&&!document.querySelector('#product-dialog').open)timer=setInterval(()=>{index=(index+1)%products.length;render();},5000);}
 function move(direction){index=(index+direction+products.length)%products.length;render();schedule();}
 document.querySelector('#slide-prev').addEventListener('click',()=>move(-1));
 document.querySelector('#slide-next').addEventListener('click',()=>move(1));
 const pauseButton=document.querySelector('#slide-pause');
 function pauseLabel(){pauseButton.textContent=paused?'Play':'Pause';pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Play automatic slideshow':'Pause automatic slideshow');}
 pauseButton.addEventListener('click',()=>{paused=!paused;pauseLabel();schedule();});
 slider.addEventListener('mouseenter',()=>{hover=true;schedule();});slider.addEventListener('mouseleave',()=>{hover=false;schedule();});
 slider.addEventListener('focusin',()=>{focused=true;schedule();});slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget)){focused=false;schedule();}});
 document.addEventListener('visibilitychange',schedule);
 new MutationObserver(schedule).observe(document.querySelector('#product-dialog'),{attributes:true,attributeFilter:['open']});
 reduced.addEventListener('change',()=>{paused=reduced.matches;pauseLabel();schedule();});
 function swipe(surface,left,right){
  let start=null;
  surface.style.touchAction='pan-y';
  surface.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')start={x:e.clientX,y:e.clientY};});
  surface.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){dx<0?left():right();}});
  surface.addEventListener('pointercancel',()=>{start=null;});
 }
 swipe(slider,()=>move(1),()=>move(-1));
 const gallery=document.querySelector('.detail-swipe-viewport');
 const switchGallery=()=>setDetailView(detailView==='figure'?'cards':'figure');
 document.querySelector('#detail-prev').addEventListener('click',switchGallery);document.querySelector('#detail-next').addEventListener('click',switchGallery);
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();switchGallery();}});
 swipe(gallery,switchGallery,switchGallery);
 render();pauseLabel();schedule();
})();
