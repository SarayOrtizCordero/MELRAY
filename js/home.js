(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) root.classList.add('rm');

  /* Año del pie */
  var year = $('#footer-year'); if (year) year.textContent = new Date().getFullYear();

  /* Aviso de cookies */
  (function () {
    var banner = $('#cookie-banner'), btn = $('#cookie-banner-accept'); if (!banner || !btn) return;
    var KEY = 'melray_cookie_notice_dismissed', seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!seen) banner.hidden = false;
    btn.addEventListener('click', function () { banner.hidden = true; try { localStorage.setItem(KEY, '1'); } catch (e) {} });
  })();

  /* ───────── Embudo en cuatro pasos → /api/demo (correo por SMTP) con WhatsApp de respaldo ───────── */
  (function () {
    var form = $('#funnel'); if (!form) return;
    var NUM = '34644888144', EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var steps = $$('.step', form), dots = $$('.dots i', form), stepno = $('#stepno');
    var ans = { tipo: '', web: '', cuando: '' };
    var err = $('#form-error'), ok = $('#form-ok'), fb = $('#form-fallback'), wa = $('#form-wa'), btn = $('#form-submit');
    var val = function (n) { return form.elements[n].value.trim(); };
    function go(n) {
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      dots.forEach(function (d, i) { d.classList.toggle('on', i < n); });
      stepno.textContent = 'Paso ' + n + ' de 4';
      var first = $('.step[data-step="' + n + '"] input', form); if (first && n === 4) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
    }
    [['1', 'tipo', 2], ['2', 'web', 3], ['3', 'cuando', 4]].forEach(function (p) {
      var sel = '.step[data-step="' + p[0] + '"] .opt';
      $$(sel, form).forEach(function (c) {
        c.addEventListener('click', function () {
          $$(sel, form).forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel');
          ans[p[1]] = c.getAttribute('data-v'); setTimeout(function () { go(p[2]); }, 320);
        });
      });
    });
    $$('.back', form).forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-back')); }); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nombre = val('nombre'), tel = val('telefono'), email = val('email');
      if (!nombre || tel.length < 6 || !EMAIL.test(email)) { err.hidden = false; return; }
      err.hidden = true; btn.disabled = true; btn.textContent = 'Enviando…';
      var detalle = 'Negocio: ' + (ans.tipo || '—') + ' · Web hoy: ' + (ans.web || '—') + ' · La necesita: ' + (ans.cuando || '—');
      var payload = { origen: 'demo', nombre: nombre, telefono: tel, email: email, instagram: val('instagram'), web: val('web'), detalle: detalle, empresa_web: val('empresa_web') };
      var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 10000);
      fetch('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal })
        .then(function (r) { return r.ok; }).catch(function () { return false; })
        .then(function (sent) {
          clearTimeout(timer); form.hidden = true;
          if (sent) { ok.hidden = false; return; }
          var text = 'Hola, soy ' + nombre + '. Quiero ver cómo quedaría la web de mi negocio (' + (ans.tipo || 'sin especificar') + '). ' + (ans.web ? ans.web + '. ' : '') + (ans.cuando ? 'La necesito: ' + ans.cuando.toLowerCase() + '. ' : '') + (val('instagram') ? 'Instagram o web: ' + val('instagram') + '. ' : '') + 'Mi email: ' + email + '. WhatsApp: ' + tel + '.';
          wa.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(text); fb.hidden = false;
        });
    });
  })();

  if (reduce || !window.gsap) { root.classList.add('rm'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Scroll suave */
  var lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id === '#ejemplos') return;
      var t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { duration: 1.6 });
    });
  });

  /* Titulares palabra por palabra */
  $$('.sp').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/); h.textContent = '';
    words.forEach(function (w) { var a = document.createElement('span'); a.className = 'w'; var b = document.createElement('span'); b.textContent = w; a.appendChild(b); h.appendChild(a); h.appendChild(document.createTextNode(' ')); });
  });

  /* ───────── Campo de color (WebGL), una sola capa para toda la página ───────── */
  var canvas = $('#field'), gl = null;
  var tsum = 30, last = performance.now(), boost = 0, lastY = 0;
  try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (e) {}
  var U = {};
  if (gl) {
    var vs = 'attribute vec2 a; varying vec2 uv; void main(){ uv = vec2(a.x*.5+.5, .5-a.y*.5); gl_Position = vec4(a,0.,1.); }';
    var fs = [
      'precision highp float; varying vec2 uv; uniform vec2 res; uniform float time; uniform float open; uniform float wipe; uniform float soft;',
      'float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }',
      'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);',
      ' return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y); }',
      'float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a*noise(p); p = p*2.02 + vec2(1.7, 9.2); a *= .5; } return v; }',
      'vec3 palette(float t){',
      ' vec3 c0 = vec3(1.00,.94,.78); vec3 c1 = vec3(1.00,.70,.22); vec3 c2 = vec3(.98,.42,.18);',
      ' vec3 c3 = vec3(.99,.62,.55); vec3 c4 = vec3(.20,.78,.74); vec3 c5 = vec3(.52,.84,1.00);',
      ' t = clamp(t, 0., 1.) * 5.;',
      ' if (t < 1.) return mix(c0, c1, smoothstep(0.,1.,t));',
      ' if (t < 2.) return mix(c1, c2, smoothstep(0.,1.,t-1.));',
      ' if (t < 3.) return mix(c2, c3, smoothstep(0.,1.,t-2.));',
      ' if (t < 4.) return mix(c3, c4, smoothstep(0.,1.,t-3.));',
      ' return mix(c4, c5, smoothstep(0.,1.,t-4.)); }',
      'void main(){',
      ' vec2 p = (uv - .5) * vec2(res.x/res.y, 1.); float d = length(p);',
      ' vec2 q = p*1.5; float t = time;',
      ' vec2 w = vec2(fbm(q + vec2(0., t*.6)), fbm(q + vec2(5.2,1.3) - t*.5));',
      ' vec2 w2 = vec2(fbm(q + 3.*w + vec2(1.7,9.2) + t*.3), fbm(q + 3.*w + vec2(8.3,2.8) - t*.25));',
      ' float f = fbm(q + 3.*w2);',
      ' float k = clamp(f*1.25 + .4*length(w2) - .12 + .12*sin(t + d*4.), 0., 1.);',
      ' vec3 col = palette(k);',
      ' col += .16 * pow(max(1. - d*1.2, 0.), 2.) * vec3(1., .85, .6);',
      ' float R = open * 1.35; float a = 1. - smoothstep(R - .02, R + .02, d);',
      ' float Wr = wipe * 1.45; float hole = wipe <= .001 ? 1. : smoothstep(Wr - .035, Wr + .035, d);',
      ' a *= hole; float tot = clamp(a + soft * (1. - a), 0., 1.);',
      ' gl_FragColor = vec4(col * tot, tot); }'
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
      ['res', 'time', 'open', 'wipe', 'soft'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      gl.clearColor(0, 0, 0, 0);
    }
  }
  function fit() {
    var s = window.innerWidth < 700 ? 0.3 : 0.42;
    var w = Math.max(2, Math.round(window.innerWidth * s)), h = Math.max(2, Math.round(window.innerHeight * s));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; if (gl) gl.viewport(0, 0, w, h); }
  }
  var S = { open: 0, wipe: 0, soft: 0 };
  function draw(now) {
    if (!gl || document.hidden) return;
    var dt = Math.min(now - last, 50); last = now;
    var y = window.scrollY; boost += Math.abs(y - lastY) * 0.004; lastY = y; boost *= 0.92;
    tsum += dt / 1000 * (0.5 + Math.min(boost, 3));
    fit();
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform1f(U.time, tsum);
    gl.uniform1f(U.open, S.open); gl.uniform1f(U.wipe, S.wipe); gl.uniform1f(U.soft, S.soft);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  if (gl) gsap.ticker.add(function () { draw(performance.now()); });
  else { root.classList.add('rm'); return; }

  /* ───────── La película: una línea de tiempo continua ───────── */
  var film = $('#film'), tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  function words(el, t) { return tl.fromTo($$('.sp .w > span', el), { yPercent: 118 }, { yPercent: 0, stagger: .07, duration: .7, ease: 'power3.out' }, t + .15); }
  function appear(sel, t, d) { return tl.fromTo(sel, { autoAlpha: 0 }, { autoAlpha: 1, duration: d || .4 }, t); }
  function leave(sel, t) { return tl.to(sel, { autoAlpha: 0, duration: .5, ease: 'power2.in' }, t); }

  /* Apertura: la llama se encoge, nace el color y un iris blanco abre la primera frase */
  tl.to('#hint0', { autoAlpha: 0, duration: .4 }, .05)
    .to('#ilogo', { scale: .08, rotation: -16, duration: 1.3, ease: 'power2.in' }, .2)
    .set('#ilogo', { autoAlpha: 0 }, 1.5)
    .to(S, { open: 1, duration: 3, ease: 'power2.inOut' }, .3)
    .fromTo('#hero', { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, 3.4)
    .to(S, { wipe: 1, duration: 2.6, ease: 'power2.inOut' }, 3.6)
    .to(S, { soft: 0.14, duration: 1.2 }, 6.4)
    .to('#hero', { autoAlpha: 0, y: -40, duration: .7, ease: 'power2.in' }, 9.0);

  /* 2. Portales */
  var t = 9.6, s2 = $('#s2');
  appear(s2, t); words(s2, t); tl.from($('.lead', s2), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + .9)
    .fromTo($('.phone', s2), { y: 150, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, t + .3)
    .from($$('.m', s2), { autoAlpha: 0, y: 24, stagger: .5, duration: .5, ease: 'power2.out' }, t + 1.2)
    .from($$('.ph-files .fl', s2), { autoAlpha: 0, y: -20, stagger: .2, duration: .4, ease: 'power2.out' }, t + 1.9);
  var cnt = { n: 0 }, snd = $('.snd', s2);
  tl.to(cnt, { n: 37, duration: 1.6, onUpdate: function () { snd.textContent = 'Enviando ' + Math.round(cnt.n) + ' de 37…'; } }, t + 2)
    .to($('.stor .bar i', s2), { width: '96%', duration: 1.6 }, t + 2);
  leave(s2, t + 3.7);

  t += 4.0; var s3 = $('#s3');
  appear(s3, t); words(s3, t); tl.from($('.lead', s3), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + .9)
    .from($$('.pc', s3), { autoAlpha: 0, y: 50, stagger: .12, duration: .6, ease: 'power3.out' }, t + .5)
    .fromTo($('.pc.me', s3), { boxShadow: '0 0 0 0 rgba(251,123,21,0)' }, { boxShadow: '0 0 0 10px rgba(251,123,21,.28)', duration: .7 }, t + 1.8);
  leave(s3, t + 3.4);

  /* 3. La web que ya tienen */
  t += 3.8; var s4 = $('#s4');
  appear(s4, t); words(s4, t); tl.from($('.lead', s4), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + .9)
    .from($('.w1', s4), { x: -90, y: 30, rotation: -6, autoAlpha: 0, duration: .9, ease: 'power3.out' }, t + .4)
    .from($('.w2', s4), { x: 90, rotation: 6, autoAlpha: 0, duration: .9, ease: 'power3.out' }, t + .9)
    .from($('.chip', s4), { y: 40, autoAlpha: 0, duration: .6, ease: 'power2.out' }, t + 1.6)
    .to($('.chip', s4), { x: 8, duration: .08, repeat: 5, yoyo: true }, t + 2.3);
  leave(s4, t + 3.4);

  /* 4. Lo que quiere quien va a reservar */
  t += 3.8; var s5 = $('#s5');
  appear(s5, t); words(s5, t); tl.from($('.lead', s5), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + 1.2);
  leave(s5, t + 3.1);

  /* 5. La solución: color a pleno, video que avanza con el scroll */
  t += 3.4; var s6 = $('#s6'), vid = $('#solvid'), vst = { p: 0 }, vdur = vid.readyState >= 1 ? vid.duration : 0, vlast = -1;
  vid.pause(); vid.addEventListener('loadedmetadata', function () { vdur = vid.duration; });
  tl.to(S, { soft: 0.93, duration: .8, ease: 'power2.inOut' }, t - .2);
  appear(s6, t + .3); words(s6, t + .3);
  tl.from($('#ver', s6), { autoAlpha: 0, y: 20, duration: .5, ease: 'power2.out' }, t + 1.6)
    .fromTo($('.vf', s6), { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, t + .5)
    .to(vst, { p: 1, duration: 4.4, onUpdate: function () { if (vdur) { var x = vst.p * (vdur - 0.05); if (Math.abs(x - vlast) > 0.02) { vlast = x; vid.currentTime = x; } } } }, t + .6);
  leave(s6, t + 4.6); tl.to(S, { soft: 0.14, duration: .8, ease: 'power2.inOut' }, t + 4.6);

  /* 6. 2027 */
  t += 5.2; var s8 = $('#s8');
  appear(s8, t); words(s8, t);
  leave(s8, t + 2.8);

  /* 7. Urgencia antes del formulario */
  t += 3.2; var s10 = $('#s10');
  appear(s10, t); words(s10, t);
  tl.from($('.lead', s10), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + 1.3)
    .from($('#urg', s10), { autoAlpha: 0, y: 20, duration: .5, ease: 'power2.out' }, t + 1.8);
  t += 3.4;

  /* Altura según la duración, barra de avance y barra superior */
  var PER = 60;
  film.style.height = (tl.duration() * PER + 100) + 'vh';
  var prog = $('#prog'), bar = $('#bar');
  var st = ScrollTrigger.create({
    animation: tl, trigger: film, start: 'top top', end: 'bottom bottom', scrub: 1.2,
    onUpdate: function (s) { if (prog) prog.style.transform = 'scaleX(' + s.progress + ')'; var seen = tl.time() > 4.2; bar.classList.toggle('bar--brand', seen); bar.classList.toggle('bar--solid', seen); }
  });

  (function () {
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
  if (!gl) return;
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

  })();

  /* ───────── Galería en espiral (adaptada de React Bits «InfiniteSpiral»): sube y gira con el scroll ───────── */
  (function () {
    var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); }, mod = function (v, d) { return ((v % d) + d) % d; }, smooth = function (a, b, v) { var x = clamp((v - a) / ((b - a) || 1), 0, 1); return x * x * (3 - 2 * x); };
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


  /* Cierre: el color vuelve a pleno detrás del formulario */
  ScrollTrigger.create({
    trigger: '#contacto', start: 'top 80%', end: 'bottom top',
    onEnter: function () { gsap.to(S, { soft: 0.93, duration: 1, overwrite: 'auto' }); },
    onLeaveBack: function () { gsap.to(S, { soft: 0.14, duration: 1, overwrite: 'auto' }); },
  });
  $$('.rv-in').forEach(function (el) { gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }); });

  /* El video queda en memoria para que al avanzar el scroll no se trabe */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var src = (vid.querySelector('source') || {}).src; if (!src) return;
      fetch(src).then(function (r) { return r.blob(); }).then(function (b) {
        var cur = vid.currentTime || 0; vid.src = URL.createObjectURL(b); vid.load();
        vid.addEventListener('loadedmetadata', function () { try { vid.currentTime = cur; } catch (e) {} }, { once: true });
      }).catch(function () {});
    }, 1500);
    ScrollTrigger.refresh();
  });
})();
