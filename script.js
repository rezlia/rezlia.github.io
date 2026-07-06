// Spine paths: draw progressively as each connector scrolls through the viewport
const spinePaths = Array.from(document.querySelectorAll('.spine-path'));
const spineData = spinePaths.map(path => ({
  path,
  length: path.getTotalLength()
}));
spineData.forEach(({path, length}) => {
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
});
function updateSpine(){
  const vh = window.innerHeight;
  spineData.forEach(({path, length}) => {
    const rect = path.getBoundingClientRect();
    let progress = (vh - rect.top) / (vh + rect.height);
    progress = Math.max(0, Math.min(1, progress));
    path.style.strokeDashoffset = length * (1 - progress);
  });
}
let spineTicking = false;
function onSpineScroll(){
  if(!spineTicking){
    requestAnimationFrame(()=>{ updateSpine(); spineTicking = false; });
    spineTicking = true;
  }
}
const reduceMotionSpine = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotionSpine){
  spineData.forEach(({path}) => { path.style.strokeDasharray = 'none'; path.style.strokeDashoffset = 0; });
} else {
  window.addEventListener('scroll', onSpineScroll, {passive:true});
  window.addEventListener('resize', updateSpine);
  updateSpine();
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target);} });
}, {threshold:0.12});
revealEls.forEach(el=>io.observe(el));

// Nav dots: click to scroll + scroll-spy
const navdots = document.querySelectorAll('.navdot');
navdots.forEach(dot=>{
  dot.addEventListener('click', ()=>{
    const id = dot.getAttribute('data-target');
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  });
});
const sectionIds = ['hero','work','services','formula','contact'];
const spyIo = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const idx = sectionIds.indexOf(e.target.id);
      navdots.forEach((d,i)=> d.classList.toggle('is-active', i===idx));
    }
  });
}, {threshold:0.5});
sectionIds.forEach(id=>{ const el=document.getElementById(id); if(el) spyIo.observe(el); });

// Portfolio interactive preview
const projRows = document.querySelectorAll('.proj-row');
const stackCards = document.querySelectorAll('.stack-card');
function setActiveProject(key){
  projRows.forEach(r=> r.classList.toggle('is-active', r.dataset.proj===key));
  stackCards.forEach(c=>{
    if(c.dataset.proj===key){
      c.style.transform = 'translateY(0) rotate(0deg) scale(1.02)';
      c.style.zIndex = 5;
      c.style.opacity = 1;
    } else {
      c.style.transform = 'translateY(40px) rotate(-2deg) scale(0.94)';
      c.style.zIndex = 1;
      c.style.opacity = 0.35;
    }
  });
}
projRows.forEach(row=>{
  row.addEventListener('mouseenter', ()=> setActiveProject(row.dataset.proj));
  row.addEventListener('click', ()=> setActiveProject(row.dataset.proj));
});

// Services accordion behavior
const serviceList = document.getElementById('serviceList');
const servicesMore = document.getElementById('servicesMore');
const servicePills = document.querySelectorAll('.service-pill');
const detailPanels = document.querySelectorAll('.service-detail');

function openService(key){
  serviceList.classList.add('is-hidden');
  servicesMore.classList.add('is-hidden');
  detailPanels.forEach(p=> p.classList.toggle('is-open', p.id === 'detail-'+key));
}
function closeServices(){
  serviceList.classList.remove('is-hidden');
  servicesMore.classList.remove('is-hidden');
  detailPanels.forEach(p=> p.classList.remove('is-open'));
}
servicePills.forEach(pill=>{
  pill.addEventListener('click', (ev)=>{ ev.stopPropagation(); openService(pill.dataset.service); });
});
detailPanels.forEach(panel=>{
  panel.addEventListener('click', ()=> closeServices());
});
document.getElementById('moreServicesLink').addEventListener('click', (ev)=>{ ev.preventDefault(); });

// Diagnose quiz -> recommendation
const serviceNames = {
  narrative: 'Narrative Builder',
  brand: 'Brand Identity Builder',
  explainer: 'Explainer Builder',
  monthly: 'Monthly Content Builder'
};
const diagnoseForm = document.getElementById('diagnoseForm');
const diagnoseResult = document.getElementById('diagnoseResult');
const recName = document.getElementById('recName');
const recLink = document.getElementById('recLink');
diagnoseForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const key = document.getElementById('q1').value;
  recName.textContent = serviceNames[key] || 'Narrative Builder';
  recLink.onclick = (e)=>{
    e.preventDefault();
    document.getElementById('services').scrollIntoView({behavior:'smooth'});
    setTimeout(()=> openService(key || 'narrative'), 500);
  };
  diagnoseResult.classList.add('is-visible');
  diagnoseResult.scrollIntoView({behavior:'smooth', block:'nearest'});
});
