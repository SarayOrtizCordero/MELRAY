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

  /* Portada: logo → se abre la playa → la marea (video real) sube y baja dos veces → la segunda bajada deja ver la web debajo */
  (function () {
    var intro = document.getElementById('intro');
    var stage = intro && intro.querySelector('.intro__stage');
    var video = document.getElementById('intro-video');
    var canvas = document.getElementById('intro-canvas');
    var logo = document.getElementById('intro-logo');
    var hint = document.getElementById('intro-hint');
    var bar = document.getElementById('bar');
    var web = document.getElementById('intro-web');
    if (!intro || !video || !canvas) return;

    video.pause();
    if (reduce) return;

    /* WebGL: la arena del video se vuelve transparente cuando toca, y debajo queda la web */
    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (e) {}
    var prog, u = {}, tex;
    if (gl) {
      var vs = 'attribute vec2 a; varying vec2 uv; void main(){ uv = vec2(a.x*.5+.5, .5-a.y*.5); gl_Position = vec4(a,0.,1.); }';
      var fs = 'precision mediump float; varying vec2 uv; uniform sampler2D t; uniform vec2 cs; uniform float z; uniform float ty; uniform float key;' +
        'void main(){ vec2 p = vec2(uv.x, (uv.y + ty)); p = vec2(0.5 + (p.x-0.5)/z, p.y/z);' +
        ' vec2 v = vec2(0.5) + (p - vec2(0.5)) * cs;' +
        ' if (v.y > 1.0 || v.y < 0.0 || v.x < 0.0 || v.x > 1.0) { gl_FragColor = vec4(0.); return; }' +
        ' vec4 c = texture2D(t, v); float sand = smoothstep(0.03, 0.13, c.r - c.b); float a = 1.0 - key * sand;' +
        ' gl_FragColor = vec4(c.rgb * a, a); }';
      var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) gl = null;
    }
    if (gl) {
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['t', 'cs', 'z', 'ty', 'key'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.clearColor(0, 0, 0, 0);
      stage.classList.add('gl');
    }

    var cur = { z: 1, ty: 0, key: 0 };
    function fit() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function draw() {
      if (!gl || video.readyState < 2) return;
      fit();
      var vw = video.videoWidth || 16, vh = video.videoHeight || 9;
      var sa = canvas.width / canvas.height, va = vw / vh;
      var cs = sa > va ? [1, va / sa] : [sa / va, 1];
      gl.bindTexture(gl.TEXTURE_2D, tex);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video); } catch (e) { return; }
      gl.uniform1i(u.t, 0); gl.uniform2f(u.cs, cs[0], cs[1]);
      gl.uniform1f(u.z, cur.z); gl.uniform1f(u.ty, cur.ty); gl.uniform1f(u.key, cur.key);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    video.addEventListener('seeked', draw);
    video.addEventListener('loadeddata', function () { measure(); draw(); });

    var current = 0, target = 0, ticking = false, lastT = -1;
    var ZMAX = 2.1;

    function measure() {
      var rect = intro.getBoundingClientRect();
      var span = intro.offsetHeight - window.innerHeight;
      target = clamp(-rect.top / Math.max(span, 1), 0, 1);
      bar.classList.toggle('bar--solid', target >= 0.995);
      bar.classList.toggle('bar--brand', target > 0.3);
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }

    function render(p) {
      var open = ease(seg(p, 0.08, 0.22));
      canvas.style.clipPath = 'circle(' + (open * 78) + '% at 50% 50%)';
      if (!gl) video.style.clipPath = canvas.style.clipPath;

      /* marea: sube (el agua cubre), baja, sube otra vez; en la segunda bajada la arena es transparente y aparece la web */
      var z = 1;
      z += (ZMAX - 1) * ease(seg(p, 0.26, 0.40));
      z -= (ZMAX - 1) * ease(seg(p, 0.40, 0.52));
      z += (ZMAX - 1) * ease(seg(p, 0.52, 0.64));
      z -= (ZMAX - 1) * ease(seg(p, 0.66, 0.78));
      cur.z = z;
      cur.key = p >= 0.64 ? 1 : 0;
      cur.ty = ease(seg(p, 0.78, 0.97)) * 1.05;
      if (!gl) video.style.opacity = String(1 - seg(p, 0.86, 0.98));

      var dur = video.duration;
      if (dur && isFinite(dur)) {
        var t = seg(p, 0.1, 0.92) * (dur - 0.1);
        if (Math.abs(t - lastT) > 0.03) { lastT = t; video.currentTime = t; }
      }
      draw();

      web.style.opacity = p >= 0.6 ? '1' : '0';
      logo.style.opacity = String(1 - seg(p, 0.06, 0.2));
      logo.style.transform = 'scale(' + (1 + seg(p, 0.05, 0.2) * 0.25) + ')';
      hint.style.opacity = String(1 - seg(p, 0, 0.06));
    }

    function frame() {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0005) current = target;
      render(current);
      if (current !== target) requestAnimationFrame(frame); else ticking = false;
    }

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', function () { fit(); measure(); });
    measure();
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
      var nombre = val('nombre'), email = val('email'), tel = val('telefono'), tipo = val('tipo'), pais = val('pais'), msg = val('detalle');
      if (!nombre || !EMAIL.test(email) || tel.length < 6 || !tipo || !pais) { err.hidden = false; return; }
      err.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      var detalle = 'Proyecto: ' + tipo + ' · País: ' + pais + (msg ? ' · ' + msg : '');
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
          var text = 'Hola, soy ' + nombre + ' (' + pais + '). Quiero: ' + tipo + '.' + (msg ? ' ' + msg : '') + ' Mi mail: ' + email + '. WhatsApp: ' + tel + '.';
          wa.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(text);
          fb.hidden = false;
        });
    });
  })();
})();
