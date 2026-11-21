(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('rm');

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  /* Año del pie */
  var year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();

  /* Aviso de cookies */
  (function () {
    var banner = document.getElementById('cookie-banner');
    var btn = document.getElementById('cookie-banner-accept');
    if (!banner || !btn) return;
    var KEY = 'melray_cookie_notice_dismissed';
    var seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!seen) banner.hidden = false;
    btn.addEventListener('click', function () {
      banner.hidden = true;
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
    });
  })();

  /* Entradas al hacer scroll */
  (function () {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  })();

  /* Portada: logo → recorrido por la playa → inmersión en el mar → web */
  (function () {
    var intro = document.getElementById('intro');
    var video = document.getElementById('intro-video');
    var sea = document.getElementById('intro-sea');
    var logo = document.getElementById('intro-logo');
    var scrim = intro.querySelector('.intro__scrim');
    var hint = document.getElementById('intro-hint');
    var bar = document.getElementById('bar');
    if (!intro || !video) return;

    if (video.play) { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); }
    if (reduce) return;

    var current = 0, target = 0, ticking = false;

    function measure() {
      var rect = intro.getBoundingClientRect();
      var span = intro.offsetHeight - window.innerHeight;
      target = clamp(-rect.top / Math.max(span, 1), 0, 1);
      bar.classList.toggle('bar--solid', target >= 0.995);
      bar.classList.toggle('bar--brand', target > 0.34);
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }

    function render(p) {
      /* 0–.12 fondo liso con el logo · .12–.34 el video se abre desde el centro · .34–.7 recorrido · .7–1 se mete en el mar y oscurece */
      var open = ease(seg(p, 0.12, 0.34));
      video.style.clipPath = 'circle(' + (open * 78) + '% at 50% 50%)';

      var dive = ease(seg(p, 0.55, 1));
      var scale = 1 + dive * 3.4;
      var drift = -seg(p, 0.12, 0.6) * 3;
      video.style.transform = 'translate3d(' + drift + '%,0,0) scale(' + scale + ')';
      scrim.style.opacity = String(open);

      sea.style.opacity = String(Math.pow(seg(p, 0.72, 0.98), 1.2));

      logo.style.opacity = String(1 - seg(p, 0.1, 0.3));
      logo.style.transform = 'scale(' + (1 + seg(p, 0.08, 0.3) * 0.25) + ')';

      hint.style.opacity = String(1 - seg(p, 0, 0.06));
    }

    function frame() {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0005) current = target;
      render(current);
      if (current !== target) requestAnimationFrame(frame); else ticking = false;
    }

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    render(current);
  })();

  /* Formulario → /api/demo (SMTP) con WhatsApp de respaldo */
  (function () {
    var form = document.getElementById('contacto-form');
    if (!form) return;
    var err = document.getElementById('form-error');
    var ok = document.getElementById('form-ok');
    var fb = document.getElementById('form-fallback');
    var wa = document.getElementById('form-wa');
    var btn = document.getElementById('form-submit');
    var NUM = '34644888144';
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var val = function (n) { return form.elements[n].value.trim(); };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nombre = val('nombre'), email = val('email'), tel = val('telefono'), tipo = val('tipo'), msg = val('detalle');
      if (!nombre || !EMAIL.test(email) || tel.length < 6 || !tipo) { err.hidden = false; return; }
      err.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      var detalle = tipo + (msg ? ' — ' + msg : '');
      var payload = { origen: 'demo', nombre: nombre, email: email, telefono: tel, detalle: detalle, empresa_web: val('empresa_web') };
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, 10000);

      fetch('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; })
        .then(function (sent) {
          clearTimeout(timer);
          form.hidden = true;
          if (sent) { ok.hidden = false; return; }
          var text = 'Hola, soy ' + nombre + '. Necesito: ' + tipo + '.' + (msg ? ' ' + msg : '') + ' Mi mail: ' + email + '. WhatsApp: ' + tel + '.';
          wa.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(text);
          fb.hidden = false;
        });
    });
  })();
})();
