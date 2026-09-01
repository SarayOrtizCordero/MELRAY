# Hero Fire Animation — Design Spec

## 1. Problem

The hero section's mascot (`index.html` `#top`, `.hero__art`) is currently a pre-rendered `<video autoplay muted loop playsinline>` (`assets/mascota-hero.mp4`, 600×600, ~820KB). Two problems:

1. **Autoplay unreliability.** On some browsers/devices, autoplay is blocked, and the visitor is left looking at a video that appears to need a click to "work" — reads as broken, not premium, on the very first thing a visitor sees on the landing page.
2. **Generic motion.** The animation is a fixed loop (the whole flame silhouette moves as one rigid unit, plus a few generic sparkle particles) — it reads as a stock/template effect rather than something designed specifically for this brand, and the loop is perceptibly mechanical (identical every cycle).

## 2. Goal

Replace the video with a real-time, GPU-rendered procedural fire effect that:
- Never fails to "start" (no autoplay policy involved — it's a canvas render loop).
- Looks alive — organic, irregular flame movement that never repeats identically.
- Keeps the existing brand character recognizable (same face — eyes, smile — as used in the logo/favicon/poster).
- Performs uniformly across devices, including budget mobile (ad-campaign traffic skews mobile; page speed affects ad Quality Score).
- Degrades gracefully with zero extra asset work (the existing static poster PNG is the fallback).

## 3. Approach

**Raw WebGL fragment shader, no library dependency.** A single `<canvas>` renders one full-quad fragment shader implementing animated fractal noise (2–3 octaves at different speeds/scales) mapped through a color ramp, masked to the mascot's existing flame silhouette. The face (eyes, smile, cheeks) is a separate fixed layer drawn on top — not procedural — so brand recognition is untouched.

**Why not three.js:** three.js was evaluated (already vendored locally for reference at `PROYECTOS/three.js`) and rejected for this specific use case. It's a 3D scene-graph library; this effect is a single 2D screen-space shader quad, so three.js would add ~100–150KB of unused scene-graph/renderer machinery for no functional benefit here. Raw WebGL achieves the identical visual result at a fraction of the weight. If a future iteration wants true 3D geometry, particle systems, or multiple animated 3D characters, three.js remains the right tool to revisit then — this decision is scoped to this effect, not a permanent rejection of the library.

**Why not Canvas 2D (no WebGL):** a CPU-driven Canvas 2D noise fire (redrawing pixels or many small shapes every frame on the main thread) is more expensive per visual unit than a GPU fragment shader, and harder to keep smooth on low-end mobile — the opposite of the "same animation on every device" requirement.

## 4. Visual & Motion Direction

- **Silhouette:** reuse the existing flame outline (the same multi-tongue shape already used in the logo/favicon/poster) as the shader's alpha mask — no new character shape.
- **Color ramp:** brand tokens only, plus one new token for the hot core:
  - `--color-red` (#b11e1b) → `--color-orange-dark` (#df3314) → `--color-orange-light` (#fb7b15) → new `--color-flame-highlight` (#ffc93c) at the hottest points (tips / core).
  - `--color-flame-highlight` is a new CSS custom property added to `:root` in `css/styles.css` — justified because no existing token reaches into warm-yellow territory, and a fire effect without a hot highlight reads as flat/fake.
- **Motion:** 2–3 layered noise octaves at different scroll speeds/scales, producing upward drift plus irregular flicker. Driven by a continuously increasing time uniform — the animation is procedural, so it never repeats identically (this also resolves the "mechanical loop" complaint independently of the autoplay fix).
- **Glow:** a soft blurred halo behind the flame silhouette, reinforcing warmth (implemented in-shader via a wider, lower-opacity secondary mask pass, or via a CSS `filter: drop-shadow(...)`/`box-shadow` on the canvas — implementer's choice, whichever is cheaper to render at 600×600).
- **Face:** unchanged — same eyes/smile/cheek artwork as the current mascot, positioned identically, drawn as a fixed overlay (inline SVG or the existing artwork extracted as a transparent PNG/SVG) on top of the canvas, not part of the shader.

## 5. Fallback & Accessibility

Three cases, all falling back to the existing static asset `assets/mascota-hero-poster.png` (already brand-correct, zero new asset work):

1. **`prefers-reduced-motion: reduce`:** on init, detect via `window.matchMedia('(prefers-reduced-motion: reduce)')`. If it matches, never start the WebGL render loop — hide the `<canvas>` and show the fallback `<img>` instead. (Showing the static poster is more robust than "freezing" a shader frame, which could land on a visually arbitrary/ugly moment.)
2. **No WebGL support:** attempt `canvas.getContext('webgl') || canvas.getContext('experimental-webgl')`. If both return `null`, hide the canvas and show the fallback `<img>` — same code path as case 1.
3. **No JS:** a `<noscript>` block renders the same fallback `<img>` directly in HTML, matching the pattern the current `<video>` already uses (its own fallback `<img>` inside the `<video>` tag for browsers that don't support the element).

## 6. Integration

**Files:**
- New: `js/hero-fire.js` — GLSL shader source (as template strings), WebGL context setup, render loop, reduced-motion/no-WebGL fallback logic, all inside one `initHeroFire()` function plus small private helpers. Kept in its own file rather than added to `js/main.js` because the shader source and WebGL boilerplate are sizable enough to deserve their own single-responsibility file, per the site's existing one-file-per-concern convention (`main.js` stays the small-interaction-glue file it already is).
- Modify: `index.html` — replace the `<video class="hero-video">` block in `.hero__art` with a `<canvas class="hero-fire" id="hero-fire" width="600" height="600">`, a fixed face overlay layer, a fallback `<img class="hero-fire-fallback" hidden>`, and a `<noscript>` fallback `<img>`. Add `<script src="/js/hero-fire.js" defer>` before the existing `<script src="/js/main.js" defer>` tag.
- Modify: `js/main.js` — remove `initReducedMotionVideo()` (targeted `.hero-video`, which no longer exists) and its `runSafely(initReducedMotionVideo)` call; add `runSafely(initHeroFire)` to the same `DOMContentLoaded` bootstrap block, keeping the site's existing init pattern.
- Modify: `css/styles.css` — add `--color-flame-highlight` to `:root`. Rename/adapt the existing `.hero-video` sizing rules (`width: min(320px, 80%); height: auto; aspect-ratio: 1/1;` and the 860px breakpoint's `width: min(180px, 45%)`) to a `.hero-fire` class covering the canvas (and the face overlay/fallback img sit inside the same sized wrapper via absolute positioning, so they share the canvas's box).

**No changes needed:** `vercel.json` (CSP already covers same-origin scripts/canvas, no new external requests), `middleware.js`, any other page. `assets/mascota-hero.mp4` becomes unused after this change but is left in place (not deleted as part of this task — a separate cleanup decision, out of scope here).

**No build tools, no new dependencies** — matches the rest of the site.

## 7. Non-Goals

- Not redesigning the character (face/proportions stay identical to the current brand mascot — confirmed with the user).
- Not adding three.js or any 3D library (evaluated and rejected for this effect — see §3).
- Not simplifying or disabling the effect specifically on mobile — the shader is designed to be cheap enough to run identically on all devices (confirmed with the user: "misma animación en todos los dispositivos").
- Not touching `assets/mascota-hero.mp4`/poster deletion, other hero copy, or any other section of `index.html`.
