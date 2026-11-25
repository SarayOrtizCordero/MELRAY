(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) root.classList.add('rm');
  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var mod = function (v, d) { return ((v % d) + d) % d; };
  var smooth = function (a, b, v) { var x = clamp((v - a) / ((b - a) || 1), 0, 1); return x * x * (3 - 2 * x); };

  /* Año del pie y aviso de cookies */
  var year = $('#footer-year'); if (year) year.textContent = new Date().getFullYear();
  (function () {
    var banner = $('#cookie-banner'), btn = $('#cookie-banner-accept'); if (!banner || !btn) return;
    var KEY = 'melray_cookie_notice_dismissed', seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!seen) banner.hidden = false;
    btn.addEventListener('click', function () { banner.hidden = true; try { localStorage.setItem(KEY, '1'); } catch (e) {} });
  })();

  /* ───────── Embudo en tres pasos → /api/demo (correo por SMTP) con WhatsApp de respaldo ───────── */
  (function () {
    var form = $('#funnel'); if (!form) return;
    var NUM = '34644888144', EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var steps = $$('.step', form), dots = $$('.dots i', form), stepno = $('#stepno');
    var pvImg = $('#pv-img'), pvCap = $('#pv-cap');
    var ans = { tipo: '', objetivo: '' };
    var err = $('#form-error'), ok = $('#form-ok'), fb = $('#form-fallback'), wa = $('#form-wa'), btn = $('#form-submit');
    var val = function (n) { return form.elements[n].value.trim(); };
    function go(n) {
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      dots.forEach(function (d, i) { d.classList.toggle('on', i < n); });
      stepno.textContent = 'Paso ' + n + ' de 3';
      var first = $('.step[data-step="' + n + '"] .chip, .step[data-step="' + n + '"] input', form); if (first && n === 3) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
    }
    $$('.step[data-step="1"] .chip', form).forEach(function (c) {
      c.addEventListener('click', function () {
        $$('.step[data-step="1"] .chip', form).forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel');
        ans.tipo = c.getAttribute('data-v');
        if (pvImg) { pvImg.style.opacity = 0; setTimeout(function () { pvImg.src = c.getAttribute('data-img'); pvImg.style.opacity = 1; }, 220); }
        if (pvCap) pvCap.textContent = 'Un ejemplo para ' + ans.tipo.toLowerCase();
        setTimeout(function () { go(2); }, 320);
      });
    });
    $$('.step[data-step="2"] .chip', form).forEach(function (c) {
      c.addEventListener('click', function () {
        $$('.step[data-step="2"] .chip', form).forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel');
        ans.objetivo = c.getAttribute('data-v'); setTimeout(function () { go(3); }, 320);
      });
    });
    $$('.back', form).forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-back')); }); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nombre = val('nombre'), tel = val('telefono'), email = val('email');
      if (!nombre || tel.length < 6 || !EMAIL.test(email)) { err.hidden = false; return; }
      err.hidden = true; btn.disabled = true; btn.textContent = 'Enviando…';
      var detalle = 'Negocio: ' + (ans.tipo || '—') + ' · Quiere que su web: ' + (ans.objetivo || '—');
      var payload = { origen: 'demo', nombre: nombre, telefono: tel, email: email, instagram: val('instagram'), web: '', detalle: detalle, empresa_web: val('empresa_web') };
      var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 10000);
      fetch('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal })
        .then(function (r) { return r.ok; }).catch(function () { return false; })
        .then(function (sent) {
          clearTimeout(timer); form.hidden = true;
          if (sent) { ok.hidden = false; return; }
          var text = 'Hola, soy ' + nombre + '. Quiero ver cómo quedaría la web de mi negocio (' + (ans.tipo || 'sin especificar') + '). ' + (ans.objetivo ? 'Quiero que mi web: ' + ans.objetivo.toLowerCase() + '. ' : '') + (val('instagram') ? 'Instagram o web: ' + val('instagram') + '. ' : '') + 'Mi email: ' + email + '. WhatsApp: ' + tel + '.';
          wa.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(text); fb.hidden = false;
        });
    });
  })();

  if (reduce || !window.gsap) { root.classList.add('rm'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Scroll suave */
  var lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { duration: 1.6 });
    });
  });

  /* Barra: aparece el logo al bajar */
  var bar = $('#bar');
  ScrollTrigger.create({ start: 120, end: 99999, onUpdate: function (s) { var d = window.scrollY > 120; bar.classList.toggle('bar--brand', d); bar.classList.toggle('bar--solid', d); } });

  /* ───────── Humo (WebGL): una capa fija que se mueve con el scroll y reacciona al cursor ───────── */
  var canvas = $('#fog'), gl = null, U = {}, mouse = { x: .5, y: .5, tx: .5, ty: .5, on: 0 }, S = { amt: .85, drift: 0 };
  try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (e) {}
  if (gl) {
    var vs = 'attribute vec2 a; varying vec2 uv; void main(){ uv = vec2(a.x*.5+.5, .5-a.y*.5); gl_Position = vec4(a,0.,1.); }';
    var fs = [
      'precision highp float; varying vec2 uv; uniform vec2 res; uniform float time; uniform vec2 mouse; uniform float mon; uniform float amt; uniform float drift;',
      'float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }',
      'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y); }',
      'float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*noise(p); p = p*2.03 + vec2(1.7, 9.2); a *= .5; } return v; }',
      'void main(){',
      ' float asp = res.x/res.y; vec2 p = vec2(uv.x*asp, uv.y)*1.35; float t = time;',
      ' p.y += drift*.0006;',
      ' vec2 md = uv - mouse; md.x *= asp; float m = exp(-dot(md,md)*14.) * mon;',
      ' p += md * m * 0.9;',
      ' vec2 q = vec2(fbm(p + vec2(0., -t*.05)), fbm(p + vec2(5.2,1.3) + t*.04));',
      ' vec2 r = vec2(fbm(p + 3.*q + vec2(1.7,9.2) - t*.06), fbm(p + 3.*q + vec2(8.3,2.8) + t*.05));',
      ' float f = fbm(p + 3.2*r);',
      ' float d = smoothstep(.27, .8, f + m*.18);',
      ' vec3 warm = vec3(1.0,.64,.40), pink = vec3(1.0,.58,.70), teal = vec3(.48,.84,.86), lilac = vec3(.76,.68,.96);',
      ' vec3 col = mix(mix(warm, pink, q.x), mix(teal, lilac, q.y), smoothstep(.25,.85,r.x));',
      ' float a = d * amt * .72;',
      ' gl_FragColor = vec4(col * a, a); }'
    ].join('\n');
    var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) gl = null;
    else {
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['res', 'time', 'mouse', 'mon', 'amt', 'drift'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      gl.clearColor(0, 0, 0, 0);
    }
  }
  if (!gl) { root.classList.add('rm'); return; }
  var tsum = 20, last = performance.now(), boost = 0, lastY = 0;
  function fit() {
    var s = window.innerWidth < 700 ? 0.28 : 0.4;
    var w = Math.max(2, Math.round(window.innerWidth * s)), h = Math.max(2, Math.round(window.innerHeight * s));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  window.addEventListener('pointermove', function (e) { mouse.tx = e.clientX / window.innerWidth; mouse.ty = e.clientY / window.innerHeight; mouse.on = 1; }, { passive: true });
  window.addEventListener('pointerleave', function () { mouse.on = 0; });
  gsap.ticker.add(function () {
    if (document.hidden) return;
    var now = performance.now(), dt = Math.min(now - last, 50); last = now;
    var y = window.scrollY; boost += Math.abs(y - lastY) * 0.004; lastY = y; boost *= 0.92;
    tsum += dt / 1000 * (0.55 + Math.min(boost, 3));
    mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
    fit();
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform1f(U.time, tsum);
    gl.uniform2f(U.mouse, mouse.x, mouse.y); gl.uniform1f(U.mon, mouse.on); gl.uniform1f(U.amt, S.amt); gl.uniform1f(U.drift, y);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });

  /* ───────── Titulares y textos que salen de la niebla (palabra por palabra, del desenfoque a nítido) ───────── */
  $$('.sp').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/); h.textContent = '';
    words.forEach(function (w) { var a = document.createElement('span'); a.className = 'w'; a.textContent = w; h.appendChild(a); h.appendChild(document.createTextNode(' ')); });
    h.style.opacity = '1';
    gsap.fromTo($$('.w', h), { autoAlpha: 0, y: 46, filter: 'blur(14px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: h, start: 'top 82%' } });
  });
  $$('.em').forEach(function (el, i) {
    var inHero = !!el.closest('.hero');
    gsap.fromTo(el, { autoAlpha: 0, y: 34, filter: 'blur(12px)', scale: .985 }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'power3.out', delay: inHero ? 0.15 + i * 0.12 : 0.1, scrollTrigger: inHero ? null : { trigger: el, start: 'top 88%' } });
  });
  /* El humo se intensifica en la portada y en la frase de la IA */
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: function (s) { S.amt = 0.55 + 0.4 * (1 - s.progress); } });
  ScrollTrigger.create({ trigger: '.beat--ia', start: 'top 70%', end: 'bottom 30%', onToggle: function (s) { gsap.to(S, { amt: s.isActive ? 1 : 0.55, duration: 1.2, overwrite: 'auto' }); } });

  /* ───────── Galería en espiral (adaptada de React Bits «InfiniteSpiral»): sube y gira con el scroll ───────── */
  (function () {
    var sec = $('#webs'), stage = $('#spiral'), items = $$('.card', stage), label = $('#spiral-label'); if (!sec || !items.length) return;
    var count = items.length, half = count / 2, progress = 0, target = 0, auto = 0, vis = true, lastLabel = -1;
    var cfg = { turn: 7, centerScale: 1.18, edgeFade: .34, edgeBlur: 5, persp: 1500 };
    var W, H, R, SP, FIT;
    function measure() {
      var vw = window.innerWidth, vh = window.innerHeight, mob = vw < 700;
      W = clamp(vw * (mob ? .74 : .34), 250, 520); H = W * .625;
      R = Math.min(vw * (mob ? .26 : .19), 330); SP = H * (mob ? .86 : .66); FIT = 1;
      items.forEach(function (c) { c.style.width = W + 'px'; c.style.height = H + 'px'; });
    }
    measure(); window.addEventListener('resize', measure);
    ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: function (s) { target = s.progress * count * 1.05; } });
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { threshold: 0 }).observe(sec);
    var prev = performance.now();
    gsap.ticker.add(function () {
      if (!vis) return;
      var now = performance.now(), dt = Math.min((now - prev) / 1000, .05); prev = now;
      auto += (0.06 - auto) * (1 - Math.exp(-dt * 4)); target += auto * dt;
      progress += (target - progress) * (1 - Math.exp(-dt * 7));
      var fadeStart = clamp(1 - cfg.edgeFade, 0, .98), best = 99, bi = 0;
      items.forEach(function (c, i) {
        var off = mod(i - progress + half, count) - half;
        var edge = Math.min(Math.abs(off) / Math.max(half, 1), 1);
        var op = 1 - smooth(fadeStart, 1, edge);
        var focus = 1 - Math.min(Math.abs(off) / (cfg.turn * .65), 1);
        var sc = 1 + (cfg.centerScale - 1) * focus;
        var ang = off * (360 / cfg.turn) * Math.PI / 180;
        var x = Math.sin(ang) * R, z = Math.cos(ang) * R;
        var ds = clamp(cfg.persp / Math.max(cfg.persp - z, 1), .72, 1.45);
        var blur = cfg.edgeBlur * smooth(.35, 1, edge);
        c.style.transform = 'translate(-50%, -50%) translate3d(' + x.toFixed(1) + 'px,' + (off * SP).toFixed(1) + 'px,0) rotateY(' + (-ang * 28 / Math.PI * 1).toFixed(1) + 'deg) scale(' + (sc * ds * FIT).toFixed(3) + ')';
        c.style.opacity = op.toFixed(3);
        c.style.filter = blur > .05 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
        c.style.zIndex = String(Math.round((z / R + 1) / 2 * 1000) + i);
        if (Math.abs(off) < best) { best = Math.abs(off); bi = i; }
      });
      if (label && bi !== lastLabel) { lastLabel = bi; label.textContent = items[bi].querySelector('span').textContent; }
    });
  })();

  $$('.panel').forEach(function (el) { gsap.fromTo(el, { y: 60 }, { y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
