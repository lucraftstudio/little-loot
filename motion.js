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
