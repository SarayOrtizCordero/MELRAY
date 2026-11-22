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

  /* Formulario → /api/demo (correo por SMTP) con WhatsApp de respaldo */
  (function () {
    var form = $('#contacto-form'); if (!form) return;
    var err = $('#form-error'), ok = $('#form-ok'), fb = $('#form-fallback'), wa = $('#form-wa'), btn = $('#form-submit');
    var NUM = '34644888144', EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var val = function (n) { return form.elements[n].value.trim(); };
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nombre = val('nombre'), tel = val('telefono'), email = val('email');
      if (!nombre || tel.length < 6 || !EMAIL.test(email)) { err.hidden = false; return; }
      err.hidden = true; btn.disabled = true; btn.textContent = 'Enviando…';
      var tipo = val('tipo'), msg = val('detalle');
      var detalle = (tipo ? 'Tipo de alojamiento: ' + tipo : '') + (msg ? (tipo ? ' · ' : '') + msg : '');
      var payload = { origen: 'demo', nombre: nombre, telefono: tel, email: email, instagram: val('instagram'), web: val('web'), detalle: detalle, empresa_web: val('empresa_web') };
      var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 10000);
      fetch('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal })
        .then(function (r) { return r.ok; }).catch(function () { return false; })
        .then(function (sent) {
          clearTimeout(timer); form.hidden = true;
          if (sent) { ok.hidden = false; return; }
          var text = 'Hola, soy ' + nombre + '. Quiero ver cómo quedaría la web de mi alojamiento.' + (val('instagram') ? ' Instagram o web: ' + val('instagram') + '.' : '') + (val('web') ? ' Fotos y videos: ' + val('web') + '.' : '') + ' Mi mail: ' + email + '. WhatsApp: ' + tel + '.';
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

  /* 1. WhatsApp */
  var t = 9.6, s2 = $('#s2');
  appear(s2, t); words(s2, t); tl.from($('.lead', s2), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + .9)
    .fromTo($('.phone', s2), { y: 150, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, t + .3)
    .from($$('.m', s2), { autoAlpha: 0, y: 24, stagger: .5, duration: .5, ease: 'power2.out' }, t + 1.2)
    .from($$('.ph-photos img', s2), { autoAlpha: 0, y: -30, stagger: .16, duration: .4, ease: 'power2.out' }, t + 1.9);
  var cnt = { n: 0 }, snd = $('.snd', s2);
  tl.to(cnt, { n: 37, duration: 1.6, onUpdate: function () { snd.textContent = 'Enviando ' + Math.round(cnt.n) + ' de 37…'; } }, t + 2)
    .to($('.stor .bar i', s2), { width: '96%', duration: 1.6 }, t + 2);
  leave(s2, t + 3.7);

  /* 2. Portales */
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
  tl.from($('.lead', s6), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + 1.2)
    .from($('#ver', s6), { autoAlpha: 0, y: 20, duration: .5, ease: 'power2.out' }, t + 1.6)
    .fromTo($('.vf', s6), { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, t + .5)
    .to(vst, { p: 1, duration: 4.4, onUpdate: function () { if (vdur) { var x = vst.p * (vdur - 0.05); if (Math.abs(x - vlast) > 0.02) { vlast = x; vid.currentTime = x; } } } }, t + .6);
  leave(s6, t + 4.6); tl.to(S, { soft: 0.14, duration: .8, ease: 'power2.inOut' }, t + 4.6);

  /* 6. 2027 */
  t += 5.2; var s8 = $('#s8');
  appear(s8, t); words(s8, t); tl.from($('.lead', s8), { autoAlpha: 0, y: 24, duration: .6, ease: 'power2.out' }, t + 1);
  leave(s8, t + 2.8);

  /* 7. Qué tiene tu web */
  t += 3.2; var s9 = $('#s9');
  appear(s9, t); words(s9, t); tl.from($$('.bn li', s9), { autoAlpha: 0, x: -70, stagger: .35, duration: .7, ease: 'power3.out' }, t + .6);
  leave(s9, t + 3.5);

  /* 8. Cómo empezamos */
  t += 4.0; var s10 = $('#s10');
  appear(s10, t); words(s10, t); tl.from($$('.steps li', s10), { autoAlpha: 0, y: 60, stagger: .35, duration: .7, ease: 'power3.out' }, t + .7);
  leave(s10, t + 3.3);

  /* Altura según la duración, barra de avance y barra superior */
  var PER = 60;
  film.style.height = (tl.duration() * PER + 100) + 'vh';
  var prog = $('#prog'), bar = $('#bar');
  var st = ScrollTrigger.create({
    animation: tl, trigger: film, start: 'top top', end: 'bottom bottom', scrub: 1.2,
    onUpdate: function (s) { if (prog) prog.style.transform = 'scaleX(' + s.progress + ')'; var seen = tl.time() > 4.2; bar.classList.toggle('bar--brand', seen); bar.classList.toggle('bar--solid', seen); }
  });

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
