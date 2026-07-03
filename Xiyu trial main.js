(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Smooth scroll nav dots + scrollspy ---------------- */
  var dotButtons = Array.prototype.slice.call(document.querySelectorAll('.dots button'));
  var dotTargets = dotButtons.map(function(b){ return document.getElementById(b.getAttribute('data-target')); });

  dotButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.getAttribute('data-target'));
      if(target){ target.scrollIntoView({behavior: reduceMotion ? 'auto':'smooth', block:'start'}); }
    });
  });

  function updateScrollspy(){
    var viewMid = window.scrollY + window.innerHeight * 0.4;
    var activeIdx = -1;
    dotTargets.forEach(function(t, i){
      if(t && t.offsetTop <= viewMid){ activeIdx = i; }
    });
    dotButtons.forEach(function(b, i){ b.classList.toggle('active', i === activeIdx); });
  }

  /* ---------------- Ribbon rail engine ---------------- */
  // Builds a smooth vertical-ish path through a section's top edge -> node dots -> bottom edge,
  // reveals it via stroke-dashoffset synced to scroll position, and toggles .active on the
  // matching card/bar once the revealed tip passes that node's position.

  function buildSmoothPath(points){
    if(points.length < 2) return '';
    var d = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
    for(var i=0; i<points.length-1; i++){
      var p0 = points[i], p1 = points[i+1];
      var dy = (p1.y - p0.y) * 0.5;
      var wig = (i % 2 === 0) ? 16 : -16;
      var c1x = p0.x + wig, c1y = p0.y + dy;
      var c2x = p1.x - wig, c2y = p1.y - dy;
      d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ', ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1);
    }
    return d;
  }

  function RibbonRail(sectionId, svgId, pathId){
    this.section = document.getElementById(sectionId);
    this.svg = document.getElementById(svgId);
    this.path = document.getElementById(pathId);
    this.nodes = this.section ? Array.prototype.slice.call(this.section.querySelectorAll('.node-dot')) : [];
    this.cards = this.section ? Array.prototype.slice.call(this.section.querySelectorAll('[data-card]')) : [];
    this.length = 0;
    this.sectionTop = 0;
    this.sectionHeight = 1;
    this.nodeFractions = [];
    if(this.section && this.svg && this.path){ this.measure(); }
  }

  RibbonRail.prototype.measure = function(){
    var secRect = this.section.getBoundingClientRect();
    var scrollY = window.scrollY || window.pageYOffset;
    this.sectionTop = secRect.top + scrollY;
    this.sectionHeight = Math.max(this.section.offsetHeight, 1);

    this.svg.setAttribute('width', secRect.width);
    this.svg.setAttribute('height', secRect.height);
    this.svg.setAttribute('viewBox', '0 0 ' + secRect.width + ' ' + secRect.height);

    var points = [];
    var firstX = secRect.width * 0.5;

    if(this.nodes.length){
      var nodeRects = this.nodes.map(function(n){ return n.getBoundingClientRect(); });
      firstX = (nodeRects[0].left + nodeRects[0].width/2) - secRect.left;
      points.push({x: firstX, y: 0});
      nodeRects.forEach(function(r){
        points.push({
          x: (r.left + r.width/2) - secRect.left,
          y: (r.top + r.height/2) - secRect.top
        });
      });
      var lastX = nodeRects[nodeRects.length-1].left + nodeRects[nodeRects.length-1].width/2 - secRect.left;
      points.push({x: lastX, y: secRect.height});
    } else {
      points.push({x: firstX, y: 0});
      points.push({x: firstX, y: secRect.height});
    }

    this.path.setAttribute('d', buildSmoothPath(points));
    this.length = this.path.getTotalLength();
    this.path.style.strokeDasharray = this.length;
    this.path.style.strokeDashoffset = this.length;
    this.path.style.transition = reduceMotion ? 'none' : 'stroke-dashoffset .12s linear';

    // Pre-compute each card's fraction-of-section-height for activation threshold
    var self = this;
    this.nodeFractions = this.nodes.map(function(n){
      var r = n.getBoundingClientRect();
      var y = (r.top + r.height/2) - secRect.top;
      return Math.min(Math.max(y / self.sectionHeight, 0), 1);
    });
  };

  RibbonRail.prototype.update = function(){
    if(!this.section) return;
    var scrollY = window.scrollY || window.pageYOffset;
    var tipDocY = scrollY + window.innerHeight * 0.55;
    var progress = (tipDocY - this.sectionTop) / this.sectionHeight;
    progress = Math.min(Math.max(progress, 0), 1);

    var offset = this.length * (1 - progress);
    this.path.style.strokeDashoffset = offset;

    for(var i=0; i<this.nodes.length; i++){
      var isActive = progress >= this.nodeFractions[i] - 0.01;
      this.nodes[i].classList.toggle('active', isActive);
      if(this.cards[i]){
        this.cards[i].classList.toggle('active', isActive);
        if(this.cards[i].hasAttribute('role')){
          this.cards[i].setAttribute('aria-expanded', isActive ? 'true' : 'false');
        }
      }
    }
  };

  var rails = [
    new RibbonRail('portfolio', 'svgPortfolio', 'pathPortfolio'),
    new RibbonRail('services', 'svgServices', 'pathServices')
  ];

  /* ---------------- Decorative loop reveal ---------------- */
  var loopDecor = document.getElementById('loopDecor');
  if('IntersectionObserver' in window && loopDecor){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ loopDecor.classList.add('in-view'); }
      });
    }, {threshold:.35});
    io.observe(loopDecor);
  } else if(loopDecor){
    loopDecor.classList.add('in-view');
  }

  /* ---------------- Service bar click-to-expand (manual override) ---------------- */
  var manualOverride = false;
  document.querySelectorAll('.service-bar').forEach(function(bar){
    bar.addEventListener('click', function(){
      manualOverride = true;
      var isActive = bar.classList.contains('active');
      document.querySelectorAll('.service-bar').forEach(function(b){
        b.classList.remove('active');
        b.setAttribute('aria-expanded','false');
      });
      if(!isActive){
        bar.classList.add('active');
        bar.setAttribute('aria-expanded','true');
      }
    });
    bar.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); bar.click(); }
    });
  });

  /* ---------------- Main scroll loop ---------------- */
  var ticking = false;
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(function(){
        rails.forEach(function(r){ r.update(); });
        updateScrollspy();
        ticking = false;
      });
      ticking = true;
    }
  }

  function remeasure(){
    rails.forEach(function(r){ r.measure(); r.update(); });
    updateScrollspy();
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', debounce(remeasure, 150));
  window.addEventListener('load', remeasure);
  document.addEventListener('DOMContentLoaded', remeasure);

  function debounce(fn, wait){
    var t;
    return function(){
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  // Initial pass
  remeasure();
  setTimeout(remeasure, 350); // catch late font swap reflow

  /* ---------------- Diagnose form ---------------- */
  var form = document.getElementById('diagnoseForm');
  var success = document.getElementById('formSuccess');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      Array.prototype.forEach.call(form.elements, function(el){ el.style.display = 'none'; });
      form.querySelectorAll('.field, .field-row, label').forEach(function(el){ el.style.display = 'none'; });
      success.classList.add('show');
    });
  }

})();