(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('rm');

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  var FIELD_VS = 'attribute vec2 a; varying vec2 uv; void main(){ uv = vec2(a.x*.5+.5, .5-a.y*.5); gl_Position = vec4(a,0.,1.); }';
  var FIELD_FS = [
        'precision highp float; varying vec2 uv; uniform vec2 res; uniform float time; uniform float open; uniform float wipe;',
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
        ' float R = open * 1.35;',
        ' float a = 1. - smoothstep(R - .02, R + .02, d);',
        ' float Wr = wipe * 1.45;',
        ' float hole = wipe <= .001 ? 1. : smoothstep(Wr - .035, Wr + .035, d);',
        ' a *= hole;',
        ' gl_FragColor = vec4(col * a, a); }'
      ].join('\n');

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

  /* Portada: logo → de la llama nace un campo de color en movimiento (motion graphic en tiempo real) → un iris blanco se abre en el centro y deja ver la web */
  (function () {
    var intro = document.getElementById('intro');
    var stage = intro && intro.querySelector('.intro__stage');
    var canvas = document.getElementById('intro-canvas');
    var logo = document.getElementById('intro-logo');
    var hint = document.getElementById('intro-hint');
    var bar = document.getElementById('bar');
    var web = document.getElementById('intro-web');
    if (!intro || !canvas) return;
    if (reduce) return;

    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (e) {}
    var prog, u = {};
    if (gl) {
      var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, FIELD_VS));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FIELD_FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) gl = null;
    }
    if (gl) {
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['res', 'time', 'open', 'wipe'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });
      gl.clearColor(0, 0, 0, 0);
    } else {
      /* sin WebGL: se muestra directamente la web */
      web.style.opacity = '1'; logo.style.display = 'none'; hint.style.display = 'none'; canvas.style.display = 'none';
      return;
    }

    var state = { open: 0, wipe: 0, p: 0 };
    var running = false;
    function fit() {
      var scale = 0.6;
      var w = Math.max(2, Math.round(stage.clientWidth * scale)), h = Math.max(2, Math.round(stage.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function draw(now) {
      fit();
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, now / 1000 * 0.55 + state.p * 2.5);
      gl.uniform1f(u.open, state.open);
      gl.uniform1f(u.wipe, state.wipe);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function loop(now) {
      if (!running) return;
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0004) current = target;
      apply(current);
      draw(now);
      requestAnimationFrame(loop);
    }

    var current = 0, target = 0;
    function apply(p) {
      state.p = p;
      state.open = ease(seg(p, 0.06, 0.42));
      state.wipe = ease(seg(p, 0.64, 0.97));
      web.style.opacity = p >= 0.62 ? '1' : '0';
      logo.style.opacity = String(1 - seg(p, 0.08, 0.3));
      logo.style.transform = 'scale(' + (1 + seg(p, 0.05, 0.3) * 0.35) + ')';
      hint.style.opacity = String(1 - seg(p, 0, 0.06));
    }

    function measure() {
      var rect = intro.getBoundingClientRect();
      var span = intro.offsetHeight - window.innerHeight;
      target = clamp(-rect.top / Math.max(span, 1), 0, 1);
      bar.classList.toggle('bar--solid', target >= 0.995);
      bar.classList.toggle('bar--brand', target > 0.3);
      var visible = rect.bottom > 0;
      if (visible && !running) { running = true; requestAnimationFrame(loop); }
      if (!visible) running = false;
    }

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    apply(0);
  })();

  /* Flujo de color: el mismo campo de la portada corre detrás de toda la web y se acelera cuando scrolleás */
  (function () {
    var canvas = document.getElementById('flow');
    var intro = document.getElementById('intro');
    if (!canvas || !intro || reduce) return;
    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: false, antialias: false }); } catch (e) {}
    if (!gl) { canvas.style.display = 'none'; return; }
    var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, FIELD_VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FIELD_FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var u = {};
    ['res', 'time', 'open', 'wipe'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

    var boost = 0, lastY = window.scrollY, tsum = 40, last = performance.now();
    function fit() {
      var s = window.innerWidth < 700 ? 0.28 : 0.4;
      var w = Math.max(2, Math.round(window.innerWidth * s)), h = Math.max(2, Math.round(window.innerHeight * s));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }
    function frame(now) {
      requestAnimationFrame(frame);
      var dt = Math.min(now - last, 50); last = now;
      if (document.hidden) return;
      if (intro.getBoundingClientRect().bottom > 0) return; /* la portada tiene su propio campo */
      var y = window.scrollY; boost += Math.abs(y - lastY) * 0.004; lastY = y; boost *= 0.92;
      tsum += dt / 1000 * (0.35 + Math.min(boost, 3));
      fit();
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, tsum);
      gl.uniform1f(u.open, 3.0);
      gl.uniform1f(u.wipe, 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  })();

  /* Titulares que entran palabra por palabra */
  (function () {
    document.querySelectorAll('h2.reveal').forEach(function (h) {
      var i = 0, last = null, nodes = Array.prototype.slice.call(h.childNodes);
      h.textContent = '';
      var add = function (el) {
        var w = document.createElement('span'); w.className = 'w';
        var inner = document.createElement('span'); inner.style.setProperty('--i', i++);
        inner.appendChild(el); last = inner; w.appendChild(inner); h.appendChild(w); h.appendChild(document.createTextNode(' '));
      };
      nodes.forEach(function (n) {
        if (n.nodeType === 3) n.textContent.split(/\s+/).filter(Boolean).forEach(function (word) {
          if (/^[.,;:!?]+$/.test(word) && last) { h.removeChild(h.lastChild); last.appendChild(document.createTextNode(word)); h.appendChild(document.createTextNode(' ')); }
          else add(document.createTextNode(word));
        });
        else add(n);
      });
    });
  })();

  /* Marcos de los ejemplos: inclinación con el mouse y fotos que se desplazan al scrollear */
  (function () {
    var frames = document.querySelectorAll('.marco');
    if (!frames.length || reduce) return;
    frames.forEach(function (m) {
      m.addEventListener('mousemove', function (e) {
        var r = m.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        m.style.setProperty('--ry', (x * 7) + 'deg'); m.style.setProperty('--rx', (-y * 7) + 'deg');
      });
      m.addEventListener('mouseleave', function () { m.style.setProperty('--ry', '0deg'); m.style.setProperty('--rx', '0deg'); });
    });
    function par() {
      frames.forEach(function (m) {
        var r = m.getBoundingClientRect();
        var c = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        m.style.setProperty('--py', (c * -30) + 'px');
      });
    }
    window.addEventListener('scroll', par, { passive: true }); par();
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
