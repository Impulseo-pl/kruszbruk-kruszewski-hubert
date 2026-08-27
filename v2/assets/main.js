/* KRUSZBRUK — demo Impulseo. Wspólny skrypt dla wszystkich podstron. */
(function(){
  'use strict';

  /* nagłówek — cień po przewinięciu */
  var hd = document.querySelector('header.nav');
  if (hd) addEventListener('scroll', function(){ hd.classList.toggle('on', scrollY > 12); }, {passive:true});

  /* menu mobilne */
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  if (burger && menu){
    burger.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ menu.classList.remove('open'); });
    });
  }

  /* wjazd sekcji */
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.rv').forEach(function(el,i){
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  /* liczniki */
  if ('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target, t = parseFloat(el.dataset.c), dec = t % 1 !== 0, s = null;
        (function run(){
          function step(ts){
            s = s || ts;
            var p = Math.min((ts - s) / 1100, 1);
            el.textContent = dec ? (t*p).toFixed(1).replace('.', ',') : Math.round(t*p);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        })();
        cio.unobserve(el);
      });
    }, {threshold:.5});
    document.querySelectorAll('[data-c]').forEach(function(el){ cio.observe(el); });
  }

  /* FAQ */
  document.querySelectorAll('.q').forEach(function(q){
    q.addEventListener('click', function(){ q.classList.toggle('open'); });
  });

  /* lightbox galerii */
  var gal = document.getElementById('gal');
  if (gal){
    var imgs = Array.prototype.slice.call(gal.querySelectorAll('img')), cur = 0;
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = '<span class="x">&times;</span><span class="nv prev">&lsaquo;</span><img alt="Realizacja Kruszbruk"><span class="nv next">&rsaquo;</span>';
    document.body.appendChild(lb);
    var lbimg = lb.querySelector('img');
    function show(){ lbimg.src = imgs[cur].src; lb.classList.add('on'); }
    function close(){ lb.classList.remove('on'); }
    function move(d){ cur = (cur + d + imgs.length) % imgs.length; show(); }
    imgs.forEach(function(im,i){ im.parentElement.addEventListener('click', function(){ cur = i; show(); }); });
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', function(e){ e.stopPropagation(); move(-1); });
    lb.querySelector('.next').addEventListener('click', function(e){ e.stopPropagation(); move(1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
    addEventListener('keydown', function(e){
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    });
  }
})();
