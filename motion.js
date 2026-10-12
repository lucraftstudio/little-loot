(() => {
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const targets = '.collection-tile, .product, .section-heading, .unbox, .cards-section, .details';
 if (!reduce && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  const observe = () => document.querySelectorAll(targets).forEach((element, index) => {
   if (element.dataset.motionReady) return;
   element.dataset.motionReady = 'true';
   element.style.setProperty('--reveal-delay', `${(index % 4) * 60}ms`);
   element.classList.add('reveal-item'); observer.observe(element);
  });
  observe();
  new MutationObserver(observe).observe(document.querySelector('.grid'), {childList:true});
 }
 const progress = document.querySelector('.scroll-progress');
 let queued = false;
 const update = () => {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
  queued = false;
 };
 addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, {passive:true});
 update();
})();

// Give each figure a subtle interactive lift without moving the page layout.
(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const grid = document.querySelector('.grid');
 const reset = photo => {photo.style.removeProperty('--tilt-x');photo.style.removeProperty('--tilt-y');};
 grid.addEventListener('pointermove', event => {
  if (reduced.matches || event.pointerType !== 'mouse') return;
  const photo = event.target.closest('.photo');
  if (!photo) return;
  const box = photo.getBoundingClientRect();
  photo.style.setProperty('--tilt-x', `${((event.clientY-box.top)/box.height-.5)*-5}deg`);
  photo.style.setProperty('--tilt-y', `${((event.clientX-box.left)/box.width-.5)*5}deg`);
 });
 grid.addEventListener('pointerout', event => {
  const photo=event.target.closest('.photo');
  if(photo && !photo.contains(event.relatedTarget)) reset(photo);
 });
 const image=document.querySelector('#detail-image');
 const animateImage = () => {
  if(reduced.matches || !image.complete || !image.naturalWidth) return;
  if(image._figureAnimation) image._figureAnimation.cancel();
  image._figureAnimation=image.animate([
   {opacity:0,transform:'translateY(15px) scale(.94)'},
   {opacity:1,transform:'translateY(0) scale(1)'}
  ],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)'});
 };
 image.addEventListener('load',animateImage);
 new MutationObserver(animateImage).observe(document.querySelector('#product-dialog'),{attributes:true,attributeFilter:['open']});
})();
