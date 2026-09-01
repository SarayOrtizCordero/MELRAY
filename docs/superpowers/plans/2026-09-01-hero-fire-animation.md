# Hero Fire Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero mascot's autoplay-unreliable `<video>` loop with a real-time WebGL fragment-shader fire effect, clipped to the brand's existing flame silhouette, with the same face drawn as a fixed overlay on top.

**Architecture:** A new `<canvas>` element renders a single full-screen-quad WebGL fragment shader that generates animated fractal noise mapped to the brand's color ramp. The canvas is clipped to the exact flame silhouette already used site-wide as the logo mark, via a CSS `clip-path` referencing an inline `<clipPath>` (no shader-side masking needed). The face (eyes + smile) is a separate small inline SVG positioned on top of the canvas — not part of the shader. `prefers-reduced-motion` and missing-WebGL both fall back to the existing static poster PNG.

**Tech Stack:** Plain WebGL1 (`canvas.getContext('webgl')`), hand-written GLSL ES 1.00 shaders as JS template strings, vanilla JS (matching the rest of `js/main.js`) — no libraries, no build step.

## Global Constraints

- No build tools, frameworks, or new dependencies — raw WebGL only (three.js was evaluated and rejected for this effect; see spec §3).
- The mascot's face (eyes, smile) must remain visually identical to the current brand mascot — same simple style, not procedural, not redesigned (spec §4, §7).
- The effect must run identically on all devices — no mobile-specific simplification or disabling (spec §7, confirmed with the user).
- Fallback for `prefers-reduced-motion: reduce`, missing WebGL support, and no-JS must all show the existing static asset `assets/mascota-hero-poster.png` — no new image assets (spec §5).
- `assets/mascota-hero.mp4` and its poster are left in place, not deleted (spec §6, explicitly out of scope).
- Only these files change: `index.html` (the `.hero__art` block only), `css/styles.css` (new `--color-flame-highlight` token + `.hero-video`/`.hero-fire-*` rules only), `js/main.js` (only `initReducedMotionVideo` removal + bootstrap edit), and the new `js/hero-fire.js`. No other section, page, or file changes (spec §6).

---

### Task 1: WebGL fire shader, hero markup swap, and wiring

**Files:**
- Create: `js/hero-fire.js`
- Modify: `index.html:103-108` (the `.hero__art` block)
- Modify: `index.html` (script tags near the closing `</body>`, currently `<script src="/js/main.js" defer></script>`)
- Modify: `css/styles.css:1-10` (`:root` token block), `css/styles.css:261-274` (`.hero__art`/`.hero-video` rules)
- Modify: `js/main.js:74-82` (`initReducedMotionVideo` function), `js/main.js:220-229` (`DOMContentLoaded` bootstrap block)

**Interfaces:**
- Produces: `initHeroFire()` (global function in `js/hero-fire.js`, called from `js/main.js`'s bootstrap the same way every other `init*` function is).
- Consumes: existing brand color hex values (`#b11e1b`, `#df3314`, `#fb7b15`), the existing flame-logo SVG path data (from `index.html`'s header logo, copied verbatim), the existing `assets/mascota-hero-poster.png` asset.

- [ ] **Step 1: Add the `--color-flame-highlight` token and replace the `.hero-video` CSS with `.hero-fire-*` rules**

Read `css/styles.css` first, then find (lines 1-10):

```css
:root {
  --color-orange-light: #fb7b15;
  --color-orange-dark: #df3314;
  --color-red: #b11e1b;
  --color-bg: #faf1e7;
  --color-card: #ffffff;
  --color-text: #2c1a12;
  --color-text-muted: #6b5748;
  --color-white: #ffffff;
```

and replace it with:

```css
:root {
  --color-orange-light: #fb7b15;
  --color-orange-dark: #df3314;
  --color-red: #b11e1b;
  --color-flame-highlight: #ffc93c;
  --color-bg: #faf1e7;
  --color-card: #ffffff;
  --color-text: #2c1a12;
  --color-text-muted: #6b5748;
  --color-white: #ffffff;
```

Then find (lines 261-274):

```css
.hero__art { display: flex; justify-content: center; }

.hero-video {
  width: min(320px, 80%);
  height: auto;
  aspect-ratio: 1 / 1;
}

@media (max-width: 860px) {
  .hero { padding: var(--space-6) 0; }
  .hero__inner { grid-template-columns: 1fr; text-align: center; }
  .hero__actions { justify-content: center; }
  .hero-video { width: min(180px, 45%); }
}
```

and replace it with:

```css
.hero__art { display: flex; justify-content: center; }

.hero-fire-stage {
  position: relative;
  width: min(320px, 80%);
  aspect-ratio: 1 / 1;
}

.hero-fire,
.hero-fire-face,
.hero-fire-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-fire { clip-path: url(#hero-fire-clip); }

@media (max-width: 860px) {
  .hero { padding: var(--space-6) 0; }
  .hero__inner { grid-template-columns: 1fr; text-align: center; }
  .hero__actions { justify-content: center; }
  .hero-fire-stage { width: min(180px, 45%); }
}
```

- [ ] **Step 2: Create `js/hero-fire.js`**

```javascript
const HERO_FIRE_VERTEX_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const HERO_FIRE_FRAGMENT_SOURCE = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;
uniform vec3 u_colorRed;
uniform vec3 u_colorOrangeDark;
uniform vec3 u_colorOrangeLight;
uniform vec3 u_colorHighlight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 p = vec2(v_uv.x * 3.0, v_uv.y * 4.0);

  float slow = fbm(p - vec2(0.0, u_time * 1.2));
  float fast = fbm(p * 1.8 + vec2(0.0, -u_time * 2.6));
  float n = slow * 0.65 + fast * 0.35;

  float heightFade = smoothstep(0.0, 1.0, v_uv.y);
  float intensity = clamp(n * 1.3 - heightFade * 0.55, 0.0, 1.0);

  vec3 color;
  if (intensity < 0.35) {
    color = mix(u_colorRed, u_colorOrangeDark, intensity / 0.35);
  } else if (intensity < 0.7) {
    color = mix(u_colorOrangeDark, u_colorOrangeLight, (intensity - 0.35) / 0.35);
  } else {
    color = mix(u_colorOrangeLight, u_colorHighlight, (intensity - 0.7) / 0.3);
  }

  float alpha = smoothstep(0.05, 0.35, intensity);
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

function heroFireShowFallback(canvas, fallback) {
  canvas.hidden = true;
  fallback.hidden = false;
}

function heroFireCreateShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Melray: hero-fire shader compile error', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function heroFireCreateProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Melray: hero-fire program link error', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function heroFireHexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function initHeroFire() {
  const canvas = document.getElementById('hero-fire');
  const fallback = document.querySelector('.hero-fire-fallback');
  if (!canvas || !fallback) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroFireShowFallback(canvas, fallback);
    return;
  }

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    heroFireShowFallback(canvas, fallback);
    return;
  }

  const vertexShader = heroFireCreateShader(gl, gl.VERTEX_SHADER, HERO_FIRE_VERTEX_SOURCE);
  const fragmentShader = heroFireCreateShader(gl, gl.FRAGMENT_SHADER, HERO_FIRE_FRAGMENT_SOURCE);
  if (!vertexShader || !fragmentShader) {
    heroFireShowFallback(canvas, fallback);
    return;
  }

  const program = heroFireCreateProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    heroFireShowFallback(canvas, fallback);
    return;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const colorRedLocation = gl.getUniformLocation(program, 'u_colorRed');
  const colorOrangeDarkLocation = gl.getUniformLocation(program, 'u_colorOrangeDark');
  const colorOrangeLightLocation = gl.getUniformLocation(program, 'u_colorOrangeLight');
  const colorHighlightLocation = gl.getUniformLocation(program, 'u_colorHighlight');

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.uniform3f(colorRedLocation, ...heroFireHexToRgb('#b11e1b'));
  gl.uniform3f(colorOrangeDarkLocation, ...heroFireHexToRgb('#df3314'));
  gl.uniform3f(colorOrangeLightLocation, ...heroFireHexToRgb('#fb7b15'));
  gl.uniform3f(colorHighlightLocation, ...heroFireHexToRgb('#ffc93c'));

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.round(canvas.clientWidth * dpr);
    if (size > 0 && canvas.width !== size) {
      canvas.width = size;
      canvas.height = size;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  let start = null;
  function render(timestamp) {
    if (start === null) start = timestamp;
    const elapsed = (timestamp - start) / 1000;

    resize();
    gl.uniform1f(timeLocation, elapsed);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
```

- [ ] **Step 3: Replace the hero markup in `index.html`**

Read `index.html` first, then find (lines 103-108):

```html
        <div class="hero__art reveal" aria-hidden="true">
          <video class="hero-video" width="600" height="600" autoplay muted loop playsinline poster="/assets/mascota-hero-poster.png">
            <source src="/assets/mascota-hero.mp4" type="video/mp4">
            <img src="/assets/mascota-hero-poster.png" alt="" width="220" height="220">
          </video>
        </div>
```

and replace it with:

```html
        <div class="hero__art reveal" aria-hidden="true">
          <svg width="0" height="0" style="position: absolute;">
            <defs>
              <clipPath id="hero-fire-clip" clipPathUnits="objectBoundingBox">
                <g transform="scale(0.03125)">
                  <path d="M15 2.3C18.3 6.3 22.2 10.8 22.8 16.2C23.7 11.7 22.2 8.3 20.7 6.3C23.7 8.7 25.8 13.2 25.5 18.3C25.5 25.2 20.9 30.3 15 30.3C9.2 30.3 4.5 25.2 4.5 18.3C4.5 13.8 6.9 10.2 10.2 7.5C9 10.2 9.3 13.2 11.1 15C10.5 10.8 12.3 6.3 15 2.3Z"/>
                </g>
              </clipPath>
            </defs>
          </svg>
          <div class="hero-fire-stage">
            <canvas class="hero-fire" id="hero-fire" width="600" height="600"></canvas>
            <svg class="hero-fire-face" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M10.5 16.5C10.5 17.6 11.2 18.5 12.1 18.5C13 18.5 13.7 17.6 13.7 16.5" fill="none" stroke="#2c1a12" stroke-width="1.4" stroke-linecap="round"/>
              <path d="M16.3 16.5C16.3 17.6 17 18.5 17.9 18.5C18.8 18.5 19.5 17.6 19.5 16.5" fill="none" stroke="#2c1a12" stroke-width="1.4" stroke-linecap="round"/>
              <path d="M13 20.3C13.8 21.2 16.2 21.2 17 20.3" fill="none" stroke="#2c1a12" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <img class="hero-fire-fallback" src="/assets/mascota-hero-poster.png" alt="" width="220" height="220" hidden>
          </div>
          <noscript>
            <img src="/assets/mascota-hero-poster.png" alt="" width="220" height="220">
          </noscript>
        </div>
```

Then find, near the end of the file:

```html
  <script src="/js/main.js" defer></script>
```

and replace it with:

```html
  <script src="/js/hero-fire.js" defer></script>
  <script src="/js/main.js" defer></script>
```

- [ ] **Step 4: Wire `initHeroFire` into `js/main.js` and remove the now-obsolete `initReducedMotionVideo`**

Read `js/main.js` first, then find (lines 74-82):

```javascript
function initReducedMotionVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
}

```

and delete it (replace with nothing — remove the whole function including the trailing blank line).

Then find (lines 220-229):

```javascript
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initMockupTilt);
  runSafely(initPlanModal);
});
```

and replace it with:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initHeroFire);
  runSafely(initMockupTilt);
  runSafely(initPlanModal);
});
```

- [ ] **Step 5: Verify the WebGL fire renders correctly (desktop)**

Use the Browser pane: `preview_start` with `{name: "melray-static"}`, then `navigate` to `http://localhost:4173/index.html#top` (hard-reload if the server was already running from earlier work, so the new files are picked up).

Dismiss the cookie banner if present, then take a screenshot. Expected:
- A flame-shaped shape in the hero's right-hand art slot, in the same position/size the video used to occupy, colored in reds/oranges/yellow (not a plain box — the CSS `clip-path` must be visibly clipping it to the flame silhouette, not showing a rectangle).
- The simple eyes + smile face visible on top of the fire, roughly centered in the lower-middle of the flame shape.
- No `<video>` element and no visible fallback `<img>` (the canvas should be the thing rendering).

Take a second screenshot 1-2 seconds after the first (use `computer` with `action: "wait"` then `action: "screenshot"`) and confirm the fire pattern has visibly changed between the two screenshots (proves it's animating, not a static image).

Check `read_console_messages` with `onlyErrors: true` — expected: no errors (confirms the shaders compiled and linked without `heroFireCreateShader`/`heroFireCreateProgram` logging a compile/link error).

- [ ] **Step 6: Verify mobile sizing**

`resize_window` to `preset: "mobile"`, reload, screenshot. Expected: the flame is visibly smaller (matching the `min(180px, 45%)` breakpoint rule) but still clipped to the flame silhouette with the face visible, not stretched or distorted. Reset with `resize_window` `preset: "desktop"` afterward.

- [ ] **Step 7: Verify the no-JS and reduced-motion fallback code paths by inspection**

The Browser pane's available tools cannot force `prefers-reduced-motion` or disable JavaScript for a live page load, so these two fallback paths can't be exercised end-to-end in this environment. Instead:
- Re-read `initHeroFire` in `js/hero-fire.js` and confirm the `prefers-reduced-motion` check and the `!gl` check both call `heroFireShowFallback(canvas, fallback)` and `return` before any WebGL calls are made — i.e., neither path can throw before the fallback is shown.
- Confirm the `<noscript>` block added in Step 3 contains a real `<img>` pointing at `/assets/mascota-hero-poster.png` (not the canvas), so a no-JS visitor sees the static mascot.
- Note this manual-inspection limitation in the task's self-review/report rather than claiming live verification of these two paths.

- [ ] **Step 8: Commit**

```bash
git add js/hero-fire.js index.html css/styles.css js/main.js
git commit -m "feat: replace hero mascot video with a real-time WebGL fire shader"
```

---

## Self-Review Notes

- **Spec coverage:** §3 (raw WebGL, no library) → Task 1 Step 2 (hand-written GLSL, no imports). §4 (silhouette reuse, brand colors, new highlight token, motion, glow-via-color-ramp, fixed face) → Step 1 (token), Step 2 (color uniforms + noise motion), Step 3 (clip-path reusing the exact logo path data, face SVG). §5 (three fallback cases) → Step 2 (`initHeroFire`'s reduced-motion/no-WebGL checks), Step 3 (`<noscript>` block). §6 (file list, script tag order, `main.js` bootstrap edit, CSS token/rule changes, no other files touched) → Steps 1-4 match exactly. §7 (non-goals: no redesign, no three.js, no mobile-specific simplification, no other file changes) → respected throughout; Task only touches the four files the constraints list.
- **Placeholder scan:** No TBD/TODO. Step 7 is explicit about a genuine tooling limitation (can't emulate `prefers-reduced-motion` or disable JS in the Browser pane) rather than faking a verification step — this is a documented constraint, not an unfinished plan step.
- **Type/consistency check:** `initHeroFire` is the exact name used in both `js/hero-fire.js` (Step 2) and the `runSafely(initHeroFire)` call added to `js/main.js` (Step 4). The canvas `id="hero-fire"` (Step 3) matches `document.getElementById('hero-fire')` in Step 2. The fallback `<img class="hero-fire-fallback">` (Step 3) matches `document.querySelector('.hero-fire-fallback')` in Step 2 and the `.hero-fire-fallback` CSS rule (Step 1). The clip-path id `hero-fire-clip` (Step 3's inline `<clipPath>`) matches `clip-path: url(#hero-fire-clip)` (Step 1's CSS). The flame path `d` attribute in Step 3 is copied verbatim from `index.html`'s existing header logo `<path>`, scaled by the group's `transform="scale(0.03125)"` (= 1/32, matching the path's `viewBox="0 0 32 32"` origin) rather than hand-converting each coordinate — avoids transcription errors in a 40-plus-number path.
