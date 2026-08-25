# Inventario Real Screenshots + Tilt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3 illustrated placeholder mockups in the `#producto` ("Inventario hoy") section with real screenshots of the Melray panels, and add a mouse-driven 3D tilt effect plus a brand-colored hover shadow to the 3 mockup cards.

**Architecture:** Static content swap (real `<img>`s replacing hand-built HTML/CSS illustrations, framed via the existing `.producto__mockup-body--media` hook) plus a small vanilla-JS interaction layer (mousemove-driven CSS transform) added to the existing `js/main.js`. No build tools, no new dependencies, no image editing — cropping is done at render time with CSS `object-fit`.

**Tech Stack:** Plain HTML5, CSS3 (existing custom properties in `css/styles.css`), vanilla JS (existing `js/main.js`, same `init*` + `runSafely` pattern already used there). Verification via the Browser pane preview tools against the `melray-static` config in `.claude/launch.json`.

## Global Constraints

- No build tools, frameworks, or new dependencies (per `docs/superpowers/specs/2026-08-18-melray-landing-design.md`).
- The 3 source screenshot files are never edited/cropped — they live at `C:\Users\Usuario\Pictures\Screenshots\` and are copied byte-for-byte into `assets/`. All framing/cropping happens via CSS `object-fit: cover` at render time (spec `docs/superpowers/specs/2026-08-25-inventario-real-screenshots-design.md` §4).
- Exact source → destination mapping (spec §3):
  - `Captura de pantalla 2026-08-25 141248.png` → `assets/mockup-catalogo.png` (Catálogo card)
  - `Captura de pantalla 2026-08-25 141240.png` → `assets/mockup-movimientos.png` (Movimientos card)
  - `Captura de pantalla 2026-08-25 141214.png` → `assets/mockup-consulta.png` (Consulta de stock card)
- Each of the 3 `.producto__mockup` wrappers loses `aria-hidden="true"` (the images are now real content, not decorative) and each `<img>` gets the exact `alt` text specified per-card below (spec §5).
- Do not change the copy in `.producto__text` (the `<h3>`/`<p>` next to each mockup), or the `.producto__row` alternating-layout structure — only the mockup content itself.
- The now-unused illustrated-mockup CSS (`.mockup-catalog__*`, `.mockup-move__*`, `.mockup-lookup__*`, the `mockup-move-in` keyframes and its reduced-motion override) must be removed once the HTML no longer references those classes — dead CSS left behind after a content swap is exactly the kind of thing this project's reviews have flagged before.
- Tilt effect: max ±8°, `perspective(800px)`, applied via `mousemove`/`mouseleave` on `.producto__mockup`, must do nothing when `prefers-reduced-motion: reduce` is set (spec §6).
- Hover shadow: `box-shadow: 0 20px 40px rgba(223, 51, 20, 0.35)` on `.producto__mockup:hover` (spec §7).
- No changes to `initMobileNav`, `initHeaderScroll`, `initScrollReveal`, `initCookieBanner`, `initFooterYear`, or `initReducedMotionVideo` in `js/main.js` — only a new function added, registered the same way as the existing ones.

---

### Task 1: Replace illustrated mockups with real screenshots

**Files:**
- Create: `assets/mockup-catalogo.png`, `assets/mockup-movimientos.png`, `assets/mockup-consulta.png` (copied from `C:\Users\Usuario\Pictures\Screenshots\`, unmodified)
- Modify: `index.html` (the 3 `.producto__mockup` blocks in the `#producto` section)
- Modify: `css/styles.css` (replace the illustrated-mockup CSS block with the new media-framing rules)

**Interfaces:**
- Produces: `.producto__mockup-body--media img` styling (used by no other task — this is the only task touching this CSS).

- [ ] **Step 1: Copy the 3 screenshot files into `assets/`**

```bash
cp "C:\Users\Usuario\Pictures\Screenshots\Captura de pantalla 2026-08-25 141248.png" "C:\Users\Usuario\MELRAY\assets\mockup-catalogo.png"
cp "C:\Users\Usuario\Pictures\Screenshots\Captura de pantalla 2026-08-25 141240.png" "C:\Users\Usuario\MELRAY\assets\mockup-movimientos.png"
cp "C:\Users\Usuario\Pictures\Screenshots\Captura de pantalla 2026-08-25 141214.png" "C:\Users\Usuario\MELRAY\assets\mockup-consulta.png"
ls -la "C:\Users\Usuario\MELRAY\assets\mockup-catalogo.png" "C:\Users\Usuario\MELRAY\assets\mockup-movimientos.png" "C:\Users\Usuario\MELRAY\assets\mockup-consulta.png"
```

Expected: `ls` shows all 3 files with non-zero size (roughly 90-150 KB each, matching the source files).

- [ ] **Step 2: Replace the Catálogo mockup (row 1) in `index.html`**

Read `index.html` first, then replace:

```html
          <div class="producto__mockup" aria-hidden="true">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--catalog">
              <div class="mockup-catalog__row">
                <span class="mockup-catalog__swatch" style="background:#fb7b15"></span>
                <span class="mockup-catalog__name">Camiseta básica</span>
                <span class="mockup-catalog__sku">SKU-1042</span>
                <span class="mockup-catalog__stock">86</span>
              </div>
              <div class="mockup-catalog__row">
                <span class="mockup-catalog__swatch" style="background:#df3314"></span>
                <span class="mockup-catalog__name">Zapatillas running</span>
                <span class="mockup-catalog__sku">SKU-2210</span>
                <span class="mockup-catalog__stock">48</span>
              </div>
              <div class="mockup-catalog__row">
                <span class="mockup-catalog__swatch" style="background:#b11e1b"></span>
                <span class="mockup-catalog__name">Gorra clásica</span>
                <span class="mockup-catalog__sku">SKU-0587</span>
                <span class="mockup-catalog__stock">120</span>
              </div>
              <div class="mockup-catalog__row">
                <span class="mockup-catalog__swatch" style="background:#2c1a12"></span>
                <span class="mockup-catalog__name">Mochila urbana</span>
                <span class="mockup-catalog__sku">SKU-3305</span>
                <span class="mockup-catalog__stock">27</span>
              </div>
            </div>
          </div>
```

with:

```html
          <div class="producto__mockup">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--media">
              <img src="/assets/mockup-catalogo.png" alt="Captura del panel de inventario Melray mostrando la lista de productos con SKU, proveedor y stock." loading="lazy">
            </div>
          </div>
```

- [ ] **Step 3: Replace the Movimientos mockup (row 2) in `index.html`**

Replace:

```html
          <div class="producto__mockup" aria-hidden="true">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--movements">
              <div class="mockup-move__row mockup-move__row--in">
                <span class="mockup-move__icon">↓</span>
                <span class="mockup-move__label">Entrada — Camiseta básica</span>
                <span class="mockup-move__qty">+40</span>
                <span class="mockup-move__date">Hoy, 10:12</span>
              </div>
              <div class="mockup-move__row mockup-move__row--out">
                <span class="mockup-move__icon">↑</span>
                <span class="mockup-move__label">Salida — Zapatillas running</span>
                <span class="mockup-move__qty">−12</span>
                <span class="mockup-move__date">Hoy, 09:47</span>
              </div>
              <div class="mockup-move__row mockup-move__row--in mockup-move__row--animated">
                <span class="mockup-move__icon">↓</span>
                <span class="mockup-move__label">Entrada — Gorra clásica</span>
                <span class="mockup-move__qty">+25</span>
                <span class="mockup-move__date">Hoy, 09:03</span>
              </div>
            </div>
          </div>
```

with:

```html
          <div class="producto__mockup">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--media">
              <img src="/assets/mockup-movimientos.png" alt="Captura del panel de inventario Melray mostrando los productos más vendidos y los productos sin movimiento." loading="lazy">
            </div>
          </div>
```

- [ ] **Step 4: Replace the Consulta de stock mockup (row 3) in `index.html`**

Replace:

```html
          <div class="producto__mockup" aria-hidden="true">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--lookup">
              <div class="mockup-lookup__search">🔎 Zapatillas running</div>
              <div class="mockup-lookup__result">
                <span class="mockup-lookup__result-name">Zapatillas running</span>
                <span class="mockup-lookup__result-stock">48</span>
                <span class="mockup-lookup__result-label">unidades en stock</span>
              </div>
            </div>
          </div>
```

with:

```html
          <div class="producto__mockup">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--media">
              <img src="/assets/mockup-consulta.png" alt="Captura del panel de inventario Melray mostrando el resumen de stock: total de productos, listos para vender y porcentaje disponible." loading="lazy">
            </div>
          </div>
```

- [ ] **Step 5: Replace the illustrated-mockup CSS with the media-framing rules**

In `css/styles.css`, find this block (starts right after `.producto__mockup-bar span { ... }` and ends right before the `@media (max-width: 860px)` block that has `.problema__grid`):

```css
.producto__mockup-body { padding: var(--space-5); }
.producto__mockup-body--media { padding: 0; }

/* Catálogo mockup (row 1) */
.mockup-catalog__row {
  display: grid;
  grid-template-columns: 20px 1fr auto auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid rgba(44, 26, 18, 0.06);
  font-family: var(--font-heading);
  font-size: 0.85rem;
}
.mockup-catalog__row:last-child { border-bottom: none; }
.mockup-catalog__swatch { width: 20px; height: 20px; border-radius: var(--radius-sm); }
.mockup-catalog__name { color: var(--color-text); }
.mockup-catalog__sku { color: var(--color-text-muted); font-size: 0.75rem; }
.mockup-catalog__stock {
  color: var(--color-orange-dark);
  background: rgba(251, 123, 21, 0.1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}

/* Movimientos mockup (row 2) */
.mockup-move__row {
  display: grid;
  grid-template-columns: 24px 1fr auto auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid rgba(44, 26, 18, 0.06);
  font-family: var(--font-heading);
  font-size: 0.85rem;
}
.mockup-move__row:last-child { border-bottom: none; }
.mockup-move__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
}
.mockup-move__row--in .mockup-move__icon { background: var(--color-orange-light); }
.mockup-move__row--out .mockup-move__icon { background: var(--color-red); }
.mockup-move__row--in .mockup-move__qty { color: var(--color-orange-dark); }
.mockup-move__row--out .mockup-move__qty { color: var(--color-red); }
.mockup-move__date { color: var(--color-text-muted); font-size: 0.75rem; }

.mockup-move__row--animated {
  animation: mockup-move-in 3.2s ease-in-out infinite;
}
@keyframes mockup-move-in {
  0%, 15% { opacity: 0; transform: translateY(10px); }
  30%, 85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .mockup-move__row--animated { animation: none; opacity: 1; transform: none; }
}

/* Consulta de stock mockup (row 3) */
.mockup-lookup__search {
  font-family: var(--font-body);
  color: var(--color-text-muted);
  background: var(--color-bg);
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
}
.mockup-lookup__result { text-align: center; padding: var(--space-4) 0; }
.mockup-lookup__result-name {
  display: block;
  font-family: var(--font-heading);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.mockup-lookup__result-stock {
  display: block;
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--color-orange-dark);
  line-height: 1;
}
.mockup-lookup__result-label {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-top: var(--space-2);
}
```

with:

```css
.producto__mockup-body { padding: var(--space-5); }
.producto__mockup-body--media {
  padding: 0;
  height: 320px;
  overflow: hidden;
}
.producto__mockup-body--media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}
```

- [ ] **Step 6: Verify visually (desktop)**

Use the Browser pane: `preview_start` with `{name: "melray-static"}`, then `navigate` to `http://localhost:4173/index.html#producto`. Take a screenshot.

Expected: all 3 mockup frames show real screenshots of the Melray panel (a product table, a dashboard with two ranked lists, and a stat-cards row), cropped to a fixed height with the top of each screenshot visible — no broken images, no oversized/overflowing images, no leftover illustrated content (no colored swatches, no arrow icons, no "🔎" search pill).

- [ ] **Step 7: Verify visually (mobile) and accessibility**

`resize_window` to `preset: "mobile"`, reload, screenshot — confirm the 3 images still display cropped/contained (no horizontal overflow) when the rows stack to 1 column.

Then use `javascript_tool` to confirm accessibility:

```js
document.querySelectorAll('.producto__mockup').length === 3
  && [...document.querySelectorAll('.producto__mockup')].every(el => !el.hasAttribute('aria-hidden'))
  && [...document.querySelectorAll('.producto__mockup img')].every(img => img.alt && img.alt.length > 10)
```

Expected: `true` — confirms `aria-hidden` was removed from all 3 wrappers and all 3 images have real `alt` text.

- [ ] **Step 8: Commit**

```bash
git add assets/mockup-catalogo.png assets/mockup-movimientos.png assets/mockup-consulta.png index.html css/styles.css
git commit -m "feat: replace illustrated inventario mockups with real product screenshots"
```

---

### Task 2: Add tilt-on-hover and brand shadow to the mockup cards

**Files:**
- Modify: `css/styles.css` (`.producto__mockup` rule — add transition + hover shadow)
- Modify: `js/main.js` (new `initMockupTilt` function, registered in `DOMContentLoaded`)

**Interfaces:**
- Consumes: `.producto__mockup` elements produced by Task 1 (same 3 elements, now containing real `<img>`s instead of illustrations — the tilt/shadow effect applies to the whole card, independent of what's inside it).
- Produces: nothing consumed by any other task — this is the last task in this plan.

- [ ] **Step 1: Add the hover shadow and transition to `.producto__mockup`**

Read `css/styles.css` first, then replace:

```css
.producto__mockup {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
```

with:

```css
.producto__mockup {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 200ms ease, transform 150ms ease;
}
.producto__mockup:hover {
  box-shadow: 0 20px 40px rgba(223, 51, 20, 0.35);
}
```

- [ ] **Step 2: Add the tilt effect to `js/main.js`**

Read `js/main.js` first, then replace:

```js
function initReducedMotionVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
}

function runSafely(fn) {
```

with:

```js
function initReducedMotionVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
}

function initMockupTilt() {
  const cards = document.querySelectorAll('.producto__mockup');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MAX_TILT = 8;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * MAX_TILT;
      const rotateX = -((y - midY) / midY) * MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function runSafely(fn) {
```

- [ ] **Step 3: Register `initMockupTilt` in the `DOMContentLoaded` handler**

Replace:

```js
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
});
```

with:

```js
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initMockupTilt);
});
```

- [ ] **Step 4: Verify the tilt effect works interactively**

`preview_start` with `{name: "melray-static"}` (reuse if running), `navigate` to `http://localhost:4173/index.html#producto`.

Use `computer` with action `hover` at a coordinate near the top-left corner of the first `.producto__mockup` card (the Catálogo screenshot), then use `javascript_tool` to read the applied transform:

```js
document.querySelector('.producto__mockup').style.transform
```

Expected: a non-empty string starting with `perspective(800px) rotateX(` — confirms the mousemove handler is firing and applying a tilt.

Then move the mouse away from the card (e.g. `hover` at a coordinate far outside all `.producto__mockup` elements, like the page's top-left corner) and re-check:

```js
document.querySelector('.producto__mockup').style.transform
```

Expected: `""` (empty string) — confirms `mouseleave` reset the transform.

Take a screenshot while hovering near a card corner to visually confirm the shadow and tilt are both visible.

- [ ] **Step 5: Verify the reduced-motion guard at the source level**

The Browser pane cannot force `prefers-reduced-motion` directly (same limitation noted in earlier plans for this project). Verify by reading `js/main.js` and confirming `initMockupTilt` contains the line `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;` before any `addEventListener` call — this guarantees no tilt listeners are ever attached for users with that preference set, matching the pattern already used in `initReducedMotionVideo`.

- [ ] **Step 6: Commit**

```bash
git add css/styles.css js/main.js
git commit -m "feat: add mouse-tilt and brand shadow hover effect to inventario mockup cards"
```

---

## Self-Review Notes

- **Spec coverage:** Screenshot copy + HTML swap (spec §3) → Task 1 Steps 1-4. CSS framing without editing source images (spec §4) → Task 1 Step 5. Accessibility (`aria-hidden` removal, `alt` text, spec §5) → Task 1 Steps 2-4 (inline) and verified in Step 7. Tilt effect (spec §6) → Task 2 Steps 2-4. Hover shadow (spec §7) → Task 2 Step 1. No build tools / no changes to existing `init*` functions (spec §8) → Global Constraints, and Task 2 Step 2's diff only adds a new function, never edits an existing one.
- **Placeholder scan:** No TBD/TODO; every step has full code or an exact command.
- **Type/consistency check:** `.producto__mockup-body--media` is defined once (Task 1 Step 5) and consumed by all 3 `<img>` wrappers (Task 1 Steps 2-4) with matching class names. `initMockupTilt` is defined in Task 2 Step 2 and registered by the exact same name in Task 2 Step 3 — no naming drift. The dead-CSS removal in Task 1 Step 5 removes exactly the classes (`mockup-catalog__*`, `mockup-move__*`, `mockup-lookup__*`) that Task 1 Steps 2-4 stop referencing — verified by cross-checking the "old" HTML blocks in Steps 2-4 against the "old" CSS block in Step 5: every class name matches.
