# Sección "Inventario hoy" como showcase visual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the text-only `#producto` section of `index.html` ("Inventario hoy") into a visual showcase: 3 alternating rows, each pairing an illustrated app-interface mockup (HTML/CSS, inside a browser-chrome frame) with the existing feature copy.

**Architecture:** Pure HTML + CSS additions to the existing static site (no build tools, no JS). Each mockup is a self-contained block of markup + scoped CSS classes, framed by a shared `.producto__mockup` "browser window" component. No real screenshots/videos exist yet — mockups are illustrated placeholders designed to be swapped for real `<img>`/`<video>` later without touching the row layout.

**Tech Stack:** Plain HTML5, CSS3 (existing custom properties in `css/styles.css`), no new JS. Verification via the Browser pane preview tools against the `melray-static` config in `.claude/launch.json` (`npx serve -l 4173 .`).

## Global Constraints

- No build tools, frameworks, or new dependencies — plain HTML/CSS only, matching the rest of the site (per `docs/superpowers/specs/2026-08-18-melray-landing-design.md`).
- Reuse existing design tokens from `css/styles.css` `:root` only (`--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`) — no new hardcoded colors/fonts except mockup swatch colors, which must be drawn from the existing palette hex values.
- Existing copy in the section (eyebrow, lead, intro paragraph, the 3 `<h3>`/`<p>` pairs, closing line) must not change.
- All mockups are decorative and must carry `aria-hidden="true"` on their outer `.producto__mockup` wrapper.
- Any CSS animation must be disabled under `@media (prefers-reduced-motion: reduce)`, consistent with the existing `.reveal` pattern in `css/styles.css:263-265`.
- Existing `.reveal` scroll-reveal behavior (`js/main.js` `initScrollReveal`, generic `.reveal` selector) must keep working — new row wrappers get the `reveal` class, no JS changes needed or allowed.
- Mobile breakpoint stays at 860px (existing convention across the site). On mobile, every row stacks mockup-above-text, regardless of desktop alternation.

---

### Task 1: Row/frame foundation + Row 1 ("Catálogo") mockup

**Files:**
- Modify: `index.html:147-172` (the whole `#producto` section)
- Modify: `css/styles.css:322-332` (`.producto` rules + shared mobile media query)

**Interfaces:**
- Produces: `.producto__row`, `.producto__row--reverse`, `.producto__text`, `.producto__mockup`, `.producto__mockup-bar`, `.producto__mockup-body` (shared frame classes used by Tasks 2 and 3). `.mockup-catalog__row`, `.mockup-catalog__swatch`, `.mockup-catalog__name`, `.mockup-catalog__sku`, `.mockup-catalog__stock` (Row 1 specific).

- [ ] **Step 1: Replace the `#producto` section HTML**

Read `index.html` first, then replace the current section (lines 147-172, from `<!-- SECTION:PRODUCTO ... -->` through `<!-- /SECTION:PRODUCTO -->`) with:

```html
<!-- SECTION:PRODUCTO Videos y capturas del producto (placeholders ilustrados hasta tener material real) -->
<section class="producto" id="producto">
  <div class="container">
    <div class="section-head reveal">
      <h2 class="eyebrow">Inventario hoy</h2>
      <p class="section-head__lead">Lo que necesitas saber, sin tener que salir a buscarlo.</p>
      <p>Melray pone orden en lo esencial para que sepas qué tienes, qué entra y qué sale, sin hojas de cálculo eternas ni sistemas que necesitas aprender antes de poder usar</p>
    </div>

    <div class="producto__row reveal">
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
      <div class="producto__text">
        <h3>Todo tu catálogo. En un solo lugar.</h3>
        <p>Organiza tus productos de forma clara, con la información que realmente necesitas. Sin campos porque sí.</p>
      </div>
    </div>

    <div class="producto__row producto__row--reverse reveal">
      <div class="producto__mockup" aria-hidden="true">
        <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
        <div class="producto__mockup-body producto__mockup-body--movements"></div>
      </div>
      <div class="producto__text">
        <h3>Cada movimiento, bajo control.</h3>
        <p>Registra entradas y salidas en segundos y mantén tu inventario actualizado mientras tu negocio se mueve.</p>
      </div>
    </div>

    <div class="producto__row reveal">
      <div class="producto__mockup" aria-hidden="true">
        <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
        <div class="producto__mockup-body producto__mockup-body--lookup"></div>
      </div>
      <div class="producto__text">
        <h3>Lo que tienes. Cuando necesitas saberlo.</h3>
        <p>Consulta tu stock actual sin buscar archivos, revisar anotaciones o preguntarte cuándo fue la última vez que alguien actualizó el Excel.</p>
      </div>
    </div>

    <p class="section-closing reveal"><strong>Menos tiempo gestionando. Más tiempo haciendo crecer tu negocio.</strong></p>
  </div>
</section>
<!-- /SECTION:PRODUCTO -->
```

Note: the "Movimientos" and "Lookup" mockup bodies are intentionally empty at this point (blank frame) — Tasks 2 and 3 fill them in. This is expected, not a bug.

- [ ] **Step 2: Replace the `.producto` CSS block**

In `css/styles.css`, replace lines 322-332:

```css
.producto { padding: var(--space-8) 0; }
.producto__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
.producto__item {
  padding: var(--space-4);
  border-left: 3px solid var(--color-orange-light);
}
.producto__item h3 { margin-bottom: var(--space-3); }

@media (max-width: 860px) {
  .problema__grid, .producto__grid { grid-template-columns: 1fr; }
}
```

with:

```css
.producto { padding: var(--space-8) 0; }

.producto__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: center;
  margin-bottom: var(--space-7);
}
.producto__row:last-of-type { margin-bottom: var(--space-6); }
.producto__row--reverse .producto__mockup { order: 2; }
.producto__row--reverse .producto__text { order: 1; }
.producto__text h3 { margin-bottom: var(--space-3); }

.producto__mockup {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.producto__mockup-bar {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border-bottom: 1px solid rgba(44, 26, 18, 0.08);
}
.producto__mockup-bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(44, 26, 18, 0.15);
}
.producto__mockup-body { padding: var(--space-5); }

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
  font-weight: 700;
  color: var(--color-orange-dark);
  background: rgba(251, 123, 21, 0.1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}

@media (max-width: 860px) {
  .problema__grid { grid-template-columns: 1fr; }
  .producto__row {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }
  .producto__row--reverse .producto__mockup,
  .producto__row--reverse .producto__text { order: initial; }
}
```

- [ ] **Step 3: Verify visually (desktop)**

Use the Browser pane: `preview_start` with `{name: "melray-static"}`, then `navigate` to `http://localhost:4173/index.html#producto`. Take a screenshot.

Expected: Row 1 shows the catalog mockup (browser-chrome frame with 4 product rows, colored swatches, stock pill) on the **left**, text on the right. Rows 2 and 3 show an empty browser-chrome frame (blank body) — expected at this stage. Row 2's frame should be on the **right** (text on left), row 3's frame on the **left** again.

- [ ] **Step 4: Verify visually (mobile)**

`resize_window` to `preset: "mobile"`, reload, screenshot.

Expected: all 3 rows stack with the mockup frame above the text, same order for all three (no left/right alternation on mobile).

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add alternating row layout and catalog mockup to producto section"
```

---

### Task 2: "Cada movimiento, bajo control." mockup (Row 2)

**Files:**
- Modify: `index.html` (the empty `<div class="producto__mockup-body producto__mockup-body--movements"></div>` from Task 1)
- Modify: `css/styles.css` (append after the Task 1 catalog mockup CSS block, before the `@media (max-width: 860px)` block)

**Interfaces:**
- Consumes: `.producto__mockup-body` padding from Task 1 (no override needed).
- Produces: `.mockup-move__row`, `.mockup-move__row--in`, `.mockup-move__row--out`, `.mockup-move__row--animated`, `.mockup-move__icon`, `.mockup-move__qty`, `.mockup-move__date`, keyframes `mockup-move-in`.

- [ ] **Step 1: Fill in the movements mockup HTML**

Read `index.html`, then replace:

```html
<div class="producto__mockup-body producto__mockup-body--movements"></div>
```

with:

```html
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
```

- [ ] **Step 2: Add the movements mockup CSS**

In `css/styles.css`, insert this block right after the `.mockup-catalog__stock` rule from Task 1, and before the `@media (max-width: 860px)` block:

```css
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
  font-weight: 700;
  color: var(--color-white);
}
.mockup-move__row--in .mockup-move__icon { background: var(--color-orange-light); }
.mockup-move__row--out .mockup-move__icon { background: var(--color-red); }
.mockup-move__qty { font-weight: 700; }
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
```

- [ ] **Step 3: Verify visually**

`preview_start` with `{name: "melray-static"}` (reuse if already running), `navigate` to `http://localhost:4173/index.html#producto`. Screenshot, and take a second screenshot ~1.5s later (`computer` action `wait` then `screenshot`) to confirm the third row visibly fades/slides in on a loop.

Expected: Row 2 (right-hand frame) shows 3 movement rows with orange down-arrow / red up-arrow icons, +40 / −12 / +25 quantities, and the third row animating in and out on a loop.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add movements timeline mockup with reduced-motion-safe animation"
```

---

### Task 3: "Lo que tienes. Cuando necesitas saberlo." mockup (Row 3)

**Files:**
- Modify: `index.html` (the empty `<div class="producto__mockup-body producto__mockup-body--lookup"></div>` from Task 1)
- Modify: `css/styles.css` (append after the Task 2 movements mockup CSS block, before the `@media (max-width: 860px)` block)

**Interfaces:**
- Consumes: `.producto__mockup-body` padding from Task 1.
- Produces: `.mockup-lookup__search`, `.mockup-lookup__result`, `.mockup-lookup__result-name`, `.mockup-lookup__result-stock`, `.mockup-lookup__result-label`.

- [ ] **Step 1: Fill in the lookup mockup HTML**

Read `index.html`, then replace:

```html
<div class="producto__mockup-body producto__mockup-body--lookup"></div>
```

with:

```html
<div class="producto__mockup-body producto__mockup-body--lookup">
  <div class="mockup-lookup__search">🔎 Zapatillas running</div>
  <div class="mockup-lookup__result">
    <span class="mockup-lookup__result-name">Zapatillas running</span>
    <span class="mockup-lookup__result-stock">48</span>
    <span class="mockup-lookup__result-label">unidades en stock</span>
  </div>
</div>
```

- [ ] **Step 2: Add the lookup mockup CSS**

In `css/styles.css`, insert this block right after the `@media (prefers-reduced-motion: reduce)` block from Task 2, and before the `@media (max-width: 860px)` block:

```css
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
  font-weight: 700;
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

- [ ] **Step 3: Verify visually**

`preview_start` with `{name: "melray-static"}`, `navigate` to `http://localhost:4173/index.html#producto`, screenshot.

Expected: Row 3 (left-hand frame) shows a search pill ("🔎 Zapatillas running") and, below it, a centered result card with "Zapatillas running", a large "48", and "unidades en stock".

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add stock lookup mockup to producto section"
```

---

### Task 4: Final QA pass (responsive, reduced motion, accessibility)

**Files:**
- Modify (only if issues are found): `index.html`, `css/styles.css`

**Interfaces:**
- Consumes: everything produced in Tasks 1-3. No new classes produced.

- [ ] **Step 1: Full desktop pass**

`preview_start` `{name: "melray-static"}`, `navigate` to `http://localhost:4173/index.html#producto`. Take a full-section screenshot.

Check: all 3 rows render with real content (no empty frames left over), alternation is left-right-left, spacing between rows looks even (no cramped or oversized gaps), the section-closing line still renders below row 3.

- [ ] **Step 2: Full mobile pass**

`resize_window` `{preset: "mobile"}`, reload the page, screenshot.

Check: all 3 rows stack mockup-above-text in the same order, no horizontal overflow/scrollbar introduced by the mockup tables (use `read_page` or `javascript_tool` with `document.documentElement.scrollWidth <= document.documentElement.clientWidth` to confirm no overflow).

- [ ] **Step 3: Accessibility check**

`read_page` (or `javascript_tool` with `document.querySelectorAll('.producto__mockup').length === 3 && [...document.querySelectorAll('.producto__mockup')].every(el => el.getAttribute('aria-hidden') === 'true')`).

Expected: `true` — confirms all 3 mockup frames are hidden from assistive tech and the adjacent `<h3>`/`<p>` remain the only accessible content for each row.

- [ ] **Step 4: Reduced-motion source check**

Since the Browser pane cannot force `prefers-reduced-motion` directly, verify at the source level: read `css/styles.css` and confirm the `@media (prefers-reduced-motion: reduce) { .mockup-move__row--animated { animation: none; ... } }` block from Task 2 is present and unchanged.

- [ ] **Step 5: Fix and commit if needed**

If any check in Steps 1-4 fails, fix the issue in `index.html`/`css/styles.css`, re-run the failing check, then:

```bash
git add index.html css/styles.css
git commit -m "fix: address producto showcase QA findings"
```

If all checks pass with no changes needed, no commit is required for this task.

---

## Self-Review Notes

- **Spec coverage:** Row layout/alternation (spec §3) → Task 1. Per-mockup content (spec §4, all 3 mockups) → Tasks 1-3. Technical details — shared frame class, `.reveal` reuse, reduced-motion guard, no new JS (spec §5) → Tasks 1-2. Copy unchanged (spec §3/§5) → verified in every task's diff (no `<h3>`/`<p>` text touched). Future replacement path (spec §6) → mockups are isolated inside `.producto__mockup`, swappable without touching `.producto__row`.
- **Placeholder scan:** No TBD/TODO; every step has full code. The one intentionally-empty state (rows 2/3 mockup bodies after Task 1) is explicitly called out as expected, not a gap, and is filled by name in Tasks 2-3.
- **Type/class consistency:** `.producto__mockup-body--movements` and `--lookup` are declared as selectors in the HTML from Task 1 and matched exactly in Tasks 2-3's HTML replacements. All CSS class names introduced in "Produces" are used verbatim in each task's HTML.
