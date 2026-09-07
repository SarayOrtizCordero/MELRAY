# Simplificación Home (Automatización, sin pestañas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify `index.html` back into a single-product story built around Automatización — replacing the CRM-led category-nav tabs with a 3-step flow diagram in "Producto" and a WhatsApp/email quote form in "Planes" (renamed "Cotización") — and demote CRM/Websites/Paneles-Inventarios to plain Servicios cards.

**Architecture:** Pure HTML/CSS/JS edits to the existing static site (no build step, no framework, no backend). The category-nav tablist component and the plan-card/plan-modal pricing system are fully removed from `index.html` once nothing references them; two small new components (`.flow-diagram`, `.cotizacion-form`) replace them, following the same vanilla-JS idioms already used elsewhere in `js/main.js` (`hidden`-attribute toggling, `IntersectionObserver`-driven `.reveal`, everything wrapped in `runSafely()`).

**Tech Stack:** Static HTML/CSS/vanilla JS (`css/styles.css`, `js/main.js`), no dependencies added.

**Spec:** `docs/superpowers/specs/2026-09-07-home-automatizacion-simplificacion-design.md`

## Global Constraints

- No build step, no framework, no new npm dependencies, no backend/serverless function — plain HTML/CSS/JS, matching the rest of the site.
- Follow the existing BEM-ish naming convention (`.block__element--modifier`) used throughout `css/styles.css`.
- Use only existing CSS custom properties from `:root` (colors, spacing, radius, shadows) — no new hardcoded values.
- New interactive behavior follows the existing pattern: vanilla JS, wrapped in `runSafely()` (see `js/main.js:292-298`).
- Preserve the `<!-- SECTION:X --> ... <!-- /SECTION:X -->` HTML comment markers already used to delimit sections in `index.html`.
- All copy is in Spanish, matching the existing site's voice (direct, informal "tú").
- WhatsApp number is `5491127041868` and quote-request email is `melray@melraysystems.com` — these are final, do not invent different contact details.
- Delete CSS/JS that becomes fully unused as a result of this change (verified via grep across the whole site before deleting) rather than leaving it dead in the file.
- The 3 real CRM screenshots (`assets/mockup-crm-*.png`) and the CRM pricing data already in `PLAN_DETAILS` (`crm-basico`/`crm-intermedio`/`crm-completo`) are removed from `index.html`'s active code in this plan (per the approved spec) but must not be deleted from git history — they live on in the repo's history for later reuse on `crm.html`.

---

## File Structure

- Modify `index.html` — hero copy + header nav + page metadata, Producto section (tabs → flow diagram), Planes section (tabs/pricing → Cotización form), Servicios reorder, footer tagline.
- Modify `css/styles.css` — remove `.producto__row*`/`.producto__mockup*` (Task 2), remove `.category-nav*`/`.planes__grid`/`.planes__single`/`.plan-card*`/`.plan-modal*` + keyframes (Task 3), add `.flow-diagram*` (Task 2) and `.cotizacion-form*` (Task 3).
- Modify `js/main.js` — remove `initMockupTilt()` (Task 2), remove `initCategoryNav()`, `PLAN_DETAILS`, `initPlanModal()` (Task 3), add `initCotizacionForm()` (Task 3).
- Modify `websites.html`, `automatizaciones.html`, `crm.html`, `inventario.html` — nav label rename only ("Planes" → "Cotización", `#planes` → `#cotizacion`).

---

### Task 1: Hero, header nav and page metadata (index.html)

**Files:**
- Modify: `index.html:6-20` (head metadata), `index.html:36-38` (JSON-LD description), `index.html:61-66` (desktop nav), `index.html:79-86` (mobile nav), `index.html:94-100` (hero copy + actions)

**Interfaces:**
- Produces: header nav items pointing to `#cotizacion` instead of `#planes` (Task 3 creates the section with that id); hero secondary button pointing to `#cotizacion`.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Update `<title>`, meta description, Open Graph and Twitter tags**

Find this block (`index.html:6-20`):

```html
  <title>Melray — Organiza tus clientes. Después, todo lo demás.</title>
  <meta name="description" content="Melray empieza por tu CRM y suma automatización, webs e inventario a medida que tu negocio lo necesita. Herramientas digitales a la medida de tu negocio.">
  <link rel="canonical" href="https://melraysystems.com/">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="Melray — Organiza tus clientes. Después, todo lo demás.">
  <meta property="og:description" content="CRM, automatización, webs e inventario en un solo lugar, a medida de tu negocio.">
  <meta property="og:url" content="https://melraysystems.com/">
  <meta property="og:image" content="https://melraysystems.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Melray — Organiza tus clientes. Después, todo lo demás.">
  <meta name="twitter:description" content="CRM, automatización, webs e inventario en un solo lugar, a medida de tu negocio.">
```

Replace with:

```html
  <title>Melray — Elimina el trabajo repetitivo. Después, todo lo demás.</title>
  <meta name="description" content="Melray empieza por automatizar tus procesos y suma CRM, webs e inventario a medida que tu negocio lo necesita. Herramientas digitales a la medida de tu negocio.">
  <link rel="canonical" href="https://melraysystems.com/">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="Melray — Elimina el trabajo repetitivo. Después, todo lo demás.">
  <meta property="og:description" content="Automatización, CRM, webs e inventario en un solo lugar, a medida de tu negocio.">
  <meta property="og:url" content="https://melraysystems.com/">
  <meta property="og:image" content="https://melraysystems.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Melray — Elimina el trabajo repetitivo. Después, todo lo demás.">
  <meta name="twitter:description" content="Automatización, CRM, webs e inventario en un solo lugar, a medida de tu negocio.">
```

- [ ] **Step 2: Update the JSON-LD `description`**

Find (`index.html:37`):

```html
    "description": "CRM y herramientas digitales a medida (automatización, webs e inventario) para pequeños y medianos negocios.",
```

Replace with:

```html
    "description": "Automatización y herramientas digitales a medida (CRM, webs e inventario) para pequeños y medianos negocios.",
```

- [ ] **Step 3: Rename "Planes" to "Cotización" in the desktop nav**

Find (`index.html:61-66`):

```html
      <nav class="site-header__nav" id="primary-nav" aria-label="Navegación principal">
        <ul>
          <li><a href="#producto">Producto</a></li>
          <li><a href="#planes">Planes</a></li>
          <li><a href="#servicios">Servicios</a></li>
        </ul>
      </nav>
```

Replace with:

```html
      <nav class="site-header__nav" id="primary-nav" aria-label="Navegación principal">
        <ul>
          <li><a href="#producto">Producto</a></li>
          <li><a href="#cotizacion">Cotización</a></li>
          <li><a href="#servicios">Servicios</a></li>
        </ul>
      </nav>
```

- [ ] **Step 4: Rename "Planes" to "Cotización" in the mobile nav**

Find (`index.html:79-86`):

```html
    <nav id="mobile-menu" class="mobile-menu" aria-label="Navegación móvil" hidden>
      <ul>
        <li><a href="#producto">Producto</a></li>
        <li><a href="#planes">Planes</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a></li>
      </ul>
    </nav>
```

Replace with:

```html
    <nav id="mobile-menu" class="mobile-menu" aria-label="Navegación móvil" hidden>
      <ul>
        <li><a href="#producto">Producto</a></li>
        <li><a href="#cotizacion">Cotización</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a></li>
      </ul>
    </nav>
```

- [ ] **Step 5: Replace the hero H1, lead and secondary button**

Find (`index.html:94-100`):

```html
        <div class="hero__copy reveal">
          <h1>Organiza tus clientes. Después, todo lo demás</h1>
          <p class="hero__subtitle">Melray empieza por tu CRM y suma automatización, webs e inventario a medida que tu negocio lo necesita.</p>
          <div class="hero__actions">
            <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a>
            <a href="#planes" class="btn btn--secondary">Ver planes</a>
          </div>
        </div>
```

Replace with:

```html
        <div class="hero__copy reveal">
          <h1>Elimina el trabajo repetitivo. Después, todo lo demás</h1>
          <p class="hero__subtitle">Melray empieza por automatizar tus procesos y suma CRM, webs e inventario a medida que tu negocio lo necesita.</p>
          <div class="hero__actions">
            <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a>
            <a href="#cotizacion" class="btn btn--secondary">Ver cotización</a>
          </div>
        </div>
```

- [ ] **Step 6: Verify in browser**

Using the Playwright browser tools: `browser_navigate` to the local `index.html` (open the file directly or via a static server), `browser_take_screenshot`. Confirm the H1 reads "Elimina el trabajo repetitivo. Después, todo lo demás", the nav shows "Cotización" (not "Planes"), and the browser tab title shows the new title. Clicking "Cotización" or "Ver cotización" will not scroll anywhere yet (expected — the section still has `id="planes"` until Task 3).

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: reposition hero copy around automatización, rename Planes nav to Cotización"
```

---

### Task 2: Producto section — flow diagram replaces category-nav tabs

**Files:**
- Modify: `index.html:150-301` (entire `<!-- SECTION:PRODUCTO -->` block)
- Modify: `css/styles.css:371-436` (`.producto` block), `css/styles.css:438-454` (shared responsive block)
- Modify: `js/main.js:84-108` (`initMockupTilt`), `js/main.js:300-310` (init list)

**Interfaces:**
- Produces: `.flow-diagram`, `.flow-diagram__step`, `.flow-diagram__number`, `.flow-diagram__connector`, `.flow-diagram__pulse` CSS classes (no other task consumes these — self-contained).
- Consumes: `.reveal`/`.reveal--visible` (existing, `css/styles.css:277-285`), `.producto__cta`/`.servicios__card-link` (existing, unchanged).
- Removes: `.producto__row*`, `.producto__mockup*` CSS and the `initMockupTilt()` JS function — confirmed via `grep -rn "producto__mockup\|producto__row" --include="*.html" .` that after this task's HTML change, nothing in the site references them.

- [ ] **Step 1: Replace the Producto section markup**

Find the entire block from `<!-- SECTION:PRODUCTO Capturas reales del producto -->` (`index.html:150`) through `<!-- /SECTION:PRODUCTO -->` (`index.html:301`) — this includes the `.category-nav` tablist and all 4 `.category-nav__panel` blocks (CRM, Automatización, Webs, Inventario).

Replace the whole thing with:

```html
    <!-- SECTION:PRODUCTO -->
    <section class="producto" id="producto">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="eyebrow">Automatización hoy</h2>
          <p class="section-head__lead">Así es como tus procesos dejan de depender de ti.</p>
          <p>Conectamos tus herramientas para que la información fluya sola entre ellas, sin que tengas que copiarla a mano de un lado a otro.</p>
        </div>

        <div class="flow-diagram reveal" role="list" aria-label="Cómo funciona una automatización de Melray">
          <div class="flow-diagram__step" role="listitem">
            <span class="flow-diagram__number" aria-hidden="true">1</span>
            <h3>Disparador</h3>
            <p>Algo pasa en tu negocio: llega un pedido, un email, se completa un formulario.</p>
          </div>
          <div class="flow-diagram__connector" aria-hidden="true"><span class="flow-diagram__pulse"></span></div>
          <div class="flow-diagram__step" role="listitem">
            <span class="flow-diagram__number" aria-hidden="true">2</span>
            <h3>Automatización</h3>
            <p>Melray lo detecta al instante y actúa: mueve datos, envía mensajes, actualiza sistemas.</p>
          </div>
          <div class="flow-diagram__connector" aria-hidden="true"><span class="flow-diagram__pulse"></span></div>
          <div class="flow-diagram__step" role="listitem">
            <span class="flow-diagram__number" aria-hidden="true">3</span>
            <h3>Resultado</h3>
            <p>Tu equipo se entera sin tocar nada: notificación enviada, tarea creada, cliente atendido.</p>
          </div>
        </div>

        <p class="producto__cta reveal"><a href="automatizaciones.html" class="servicios__card-link">Ver todo sobre Automatización <span aria-hidden="true">→</span></a></p>
      </div>
    </section>
    <!-- /SECTION:PRODUCTO -->
```

- [ ] **Step 2: Remove the now-dead `.producto__row`/`.producto__mockup` CSS and add `.flow-diagram` CSS**

Find (`css/styles.css:371-436`):

```css
/* ===== Producto hoy ===== */
.producto { padding: var(--space-8) 0; }

.producto__row {
  display: flex;
  gap: var(--space-6);
  align-items: center;
  margin-bottom: var(--space-7);
}
.producto__row:last-of-type { margin-bottom: var(--space-6); }
.producto__row--reverse .producto__mockup { order: 2; }
.producto__row--reverse .producto__text { order: 1; }
.producto__text { flex: 2 1 0; }
.producto__text h3 { margin-bottom: var(--space-3); }

.producto__mockup {
  flex: 3 1 0;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 200ms ease, transform 150ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .producto__mockup:hover {
    box-shadow: 0 20px 40px rgba(223, 51, 20, 0.35);
  }
}
@media (hover: none) {
  .producto__mockup {
    box-shadow: 0 16px 34px rgba(223, 51, 20, 0.2);
  }
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
.producto__mockup-body--media {
  padding: 0;
  height: 480px;
  overflow: hidden;
}
.producto__mockup-body--media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}
.producto__mockup-body--media-movimientos {
  height: 286px;
}
.producto__mockup-body--media-movimientos img {
  transform: scale(1.45);
  transform-origin: top;
}
.producto__cta { text-align: center; margin-top: var(--space-6); }
```

Replace with:

```css
/* ===== Producto hoy ===== */
.producto { padding: var(--space-8) 0; }
.producto__cta { text-align: center; margin-top: var(--space-6); }

/* ===== Flow diagram (cómo funciona una automatización) ===== */
.flow-diagram {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
}
.flow-diagram__step {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}
.flow-diagram__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-orange-dark);
  color: var(--color-white);
  font-family: var(--font-heading);
  font-size: 1.1rem;
}
.flow-diagram__step p { margin: 0; }

.flow-diagram__connector {
  position: relative;
  width: 2px;
  height: var(--space-6);
  margin: 0 auto;
  background: rgba(44, 26, 18, 0.12);
}
.flow-diagram__pulse {
  position: absolute;
  left: 50%;
  top: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-orange-dark);
  transform: translateX(-50%);
  animation: flow-pulse-vertical 2.4s ease-in-out infinite;
}
@keyframes flow-pulse-vertical {
  0% { top: 0; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .flow-diagram__pulse { animation: none; opacity: 0; }
}

@media (min-width: 768px) {
  .flow-diagram { flex-direction: row; align-items: stretch; }
  .flow-diagram__step { flex: 1; }
  .flow-diagram__connector {
    width: var(--space-6);
    height: 2px;
    margin: auto 0;
    flex-shrink: 0;
  }
  .flow-diagram__pulse {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    animation: flow-pulse-horizontal 2.4s ease-in-out infinite;
  }
  @keyframes flow-pulse-horizontal {
    0% { left: 0; opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }
}
```

- [ ] **Step 3: Remove the now-dead responsive `.producto__row`/`.producto__mockup` rules from the shared 860px media query**

Find (`css/styles.css:438-454`):

```css
@media (max-width: 860px) {
  .problema__grid { grid-template-columns: 1fr; }
  .producto__row {
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }
  .producto__row--reverse .producto__mockup,
  .producto__row--reverse .producto__text { order: initial; }
  .producto__mockup, .producto__text { flex: none; width: 100%; }
  .producto__mockup-body--media { height: 170px; }
  .producto__mockup-body--media-movimientos {
    height: auto;
    aspect-ratio: 1907 / 520;
  }
  .producto__mockup-body--media-movimientos img { transform: none; }
}
```

Replace with:

```css
@media (max-width: 860px) {
  .problema__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Remove the now-dead `initMockupTilt()` function**

Find (`js/main.js:84-108`):

```js
function initMockupTilt() {
  const cards = document.querySelectorAll('.producto__mockup');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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

```

Delete it entirely (replace with nothing — remove the whole function and the blank line after it).

- [ ] **Step 5: Remove the `initMockupTilt` call**

Find (`js/main.js:300-310`):

```js
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initMockupTilt);
  runSafely(initCategoryNav);
  runSafely(initPlanModal);
});
```

Replace with:

```js
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initCategoryNav);
  runSafely(initPlanModal);
});
```

(`initCategoryNav`/`initPlanModal` stay for now — the Planes section still uses them until Task 3.)

- [ ] **Step 6: Verify no remaining references**

```bash
grep -rn "producto__mockup\|producto__row\|initMockupTilt" --include="*.html" --include="*.js" --include="*.css" .
```

Expected: no matches.

- [ ] **Step 7: Verify in browser**

`browser_navigate` to `index.html`, scroll to `#producto`. Confirm: eyebrow reads "Automatización hoy", 3 numbered steps (1/2/3: Disparador/Automatización/Resultado) are visible, connected by a line with a small dot animating along it. `browser_resize` to width 375 height 800 and confirm the 3 steps stack vertically with a vertical connector. Confirm the "Ver todo sobre Automatización →" link points to `automatizaciones.html`.

- [ ] **Step 8: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: replace Producto category tabs with a single automation flow diagram"
```

---

### Task 3: Planes → Cotización — quote form replaces pricing tabs

**Files:**
- Modify: `index.html:304-506` (entire `<!-- SECTION:PLANES -->` block, `id="planes"` → `id="cotizacion"`)
- Modify: `css/styles.css:314-341` (`.category-nav*`, now fully dead), `css/styles.css` (`.planes__grid`/`.planes__single`/`.plan-card*`/`.plan-modal*` block, ~178 lines starting right after `.planes { padding: var(--space-8) 0; }`)
- Modify: `js/main.js:110-149` (`initCategoryNav`), `js/main.js:151-230` (`PLAN_DETAILS`), `js/main.js:232-290` (`initPlanModal`), `js/main.js` init list

**Interfaces:**
- Produces: `initCotizacionForm()` in `js/main.js`; DOM ids `cotizacion-form`, `cot-nombre`, `cot-negocio`, `cot-email`, `cot-telefono`, `cot-necesidad`, `cot-herramientas`, `cotizacion-whatsapp`, `cotizacion-email`; section `id="cotizacion"` (consumed by Task 6's nav links on the other 4 pages, and by Task 1's hero button / nav, already pointing at `#cotizacion`).
- Consumes: `.btn`/`.btn--primary`/`.btn--secondary` (existing, `css/styles.css:151-172`), `.section-head`/`.eyebrow` (existing), `runSafely()` (existing, `js/main.js:292-298`), the global `input:focus-visible`/`textarea:focus-visible` rule (existing, `css/styles.css:119-122`).
- Removes: `.category-nav*` CSS, `initCategoryNav()`, `PLAN_DETAILS`, `initPlanModal()`, `.planes__grid`/`.planes__single`/`.plan-card*`/`.plan-modal*` CSS — confirmed via `grep -rn "category-nav\|plan-card\|plan-modal\|PLAN_DETAILS" --include="*.html" --include="*.js" .` that nothing outside this section used them.

- [ ] **Step 1: Replace the Planes section markup with the Cotización form**

Find the entire block from `<!-- SECTION:PLANES -->` (`index.html:303`) through `<!-- /SECTION:PLANES -->` (`index.html:507`) — this includes the `.category-nav` tablist, the CRM/Inventario `.planes__grid` panels, the Automatización/Webs `.planes__single` quote-card panels, and the `<dialog class="plan-modal">`.

Replace the whole thing with:

```html
    <!-- SECTION:PLANES -->
    <section class="planes" id="cotizacion">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="eyebrow">Cotización</h2>
          <p class="section-head__lead">Cuéntanos qué te gustaría automatizar y te respondemos con una propuesta.</p>
        </div>

        <form class="cotizacion-form reveal" id="cotizacion-form" novalidate>
          <div class="cotizacion-form__grid">
            <div class="cotizacion-form__field">
              <label for="cot-nombre">Nombre completo *</label>
              <input type="text" id="cot-nombre" name="nombre" required autocomplete="name">
            </div>
            <div class="cotizacion-form__field">
              <label for="cot-negocio">Negocio</label>
              <input type="text" id="cot-negocio" name="negocio" autocomplete="organization">
            </div>
            <div class="cotizacion-form__field">
              <label for="cot-email">Email *</label>
              <input type="email" id="cot-email" name="email" required autocomplete="email">
            </div>
            <div class="cotizacion-form__field">
              <label for="cot-telefono">Teléfono *</label>
              <input type="tel" id="cot-telefono" name="telefono" required autocomplete="tel">
            </div>
            <div class="cotizacion-form__field cotizacion-form__field--full">
              <label for="cot-necesidad">¿Qué te gustaría automatizar? *</label>
              <textarea id="cot-necesidad" name="necesidad" rows="4" required></textarea>
            </div>
            <div class="cotizacion-form__field cotizacion-form__field--full">
              <label for="cot-herramientas">Herramientas que ya usás</label>
              <input type="text" id="cot-herramientas" name="herramientas" placeholder="Ej. Excel, WhatsApp Business, Notion...">
            </div>
          </div>
          <div class="cotizacion-form__actions">
            <button type="button" class="btn btn--primary" id="cotizacion-whatsapp">Enviar por WhatsApp</button>
            <button type="button" class="btn btn--secondary" id="cotizacion-email">Enviar por email</button>
          </div>
        </form>
      </div>
    </section>
    <!-- /SECTION:PLANES -->
```

- [ ] **Step 2: Remove the now-dead `.category-nav*` CSS**

Find (`css/styles.css:314-341`):

```css
/* ===== Category nav (shared: Producto + Planes) ===== */
.category-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}
.category-nav__tab {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid rgba(44, 26, 18, 0.12);
  background: var(--color-card);
  color: var(--color-text-muted);
  transition: background var(--transition-base), color var(--transition-base), border-color var(--transition-base);
}
.category-nav__tab:hover { color: var(--color-orange-dark); border-color: var(--color-orange-dark); }
.category-nav__tab[aria-selected="true"] {
  background: var(--color-orange-dark);
  border-color: var(--color-orange-dark);
  color: var(--color-white);
}

@media (max-width: 600px) {
  .category-nav__tab { flex: 1 1 auto; text-align: center; padding: var(--space-2) var(--space-3); font-size: 0.85rem; }
}

```

Delete it entirely (remove the whole block, including the blank line after it).

- [ ] **Step 3: Replace the pricing/modal CSS with `.cotizacion-form` CSS**

Find the block starting right after `.planes { padding: var(--space-8) 0; }` and ending right before `/* ===== Servicios ===== */` — i.e. everything from `.planes__grid { ... }` through the closing `}` of `@keyframes plan-modal-fade`:

```css
.planes__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); align-items: stretch; }
.planes__single { max-width: 480px; margin: 0 auto; }
.plan-card {
  position: relative;
  background: var(--color-card);
  border: 1px solid rgba(44, 26, 18, 0.06);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.plan-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
.plan-card--highlight {
  background: linear-gradient(180deg, #fff6ee 0%, var(--color-card) 55%);
  border: 2px solid var(--color-orange-dark);
  box-shadow: 0 16px 40px rgba(177, 30, 27, 0.16);
  transform: translateY(-14px);
}
.plan-card--highlight:hover { transform: translateY(-20px); }
.plan-card__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  align-self: flex-start;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--color-orange-dark);
  color: var(--color-white);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}
.plan-card__badge svg { width: 11px; height: 11px; flex-shrink: 0; }
.plan-card__features { display: flex; flex-direction: column; gap: var(--space-3); }
.plan-card__features li { padding-left: var(--space-4); position: relative; color: var(--color-text); }
.plan-card__features li::before {
  content: "";
  position: absolute; left: 0; top: 0.5em;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-orange-light);
}

.plan-card__teaser { display: flex; flex-direction: column; gap: var(--space-3); }
.plan-card__teaser li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--color-text);
  font-size: 0.92rem;
}
.plan-card__teaser-icon {
  flex-shrink: 0;
  width: 18px; height: 18px;
  margin-top: 2px;
  border-radius: 50%;
  background: rgba(251, 123, 21, 0.14);
  color: var(--color-orange-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}
.plan-card__teaser-icon svg { width: 10px; height: 10px; }

/* Hidden until JS confirms it can open the detail modal — with JS off,
   the card simply shows its teaser features and nothing else breaks. */
.plan-card__more {
  display: none;
  align-items: center;
  gap: var(--space-2);
  align-self: flex-start;
  font-family: var(--font-heading);
  font-size: 0.88rem;
  color: var(--color-orange-dark);
  transition: color var(--transition-base), gap var(--transition-base);
}
.plan-card__more:hover { color: var(--color-red); gap: 9px; }
.plan-card__more-icon { width: 13px; height: 13px; flex-shrink: 0; }
.plans-js-ready .plan-card__more { display: inline-flex; }

/* Anchors price + CTA to the card's bottom edge, so cards with a
   slightly shorter description still line up with their siblings. */
.plan-card__footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: auto;
}

.plan-card__price {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  letter-spacing: -0.02em;
  color: var(--color-orange-dark);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(44, 26, 18, 0.1);
}
.plan-card--highlight .plan-card__price { color: var(--color-red); }
.plan-card__price-note {
  display: block;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: normal;
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

@media (max-width: 860px) {
  .planes__grid { grid-template-columns: 1fr; }
  .plan-card--highlight, .plan-card--highlight:hover { transform: none; }
}

/* ===== Plan detail modal ===== */
.plan-modal {
  position: fixed;
  inset: 0;
  margin: auto;
  border: none;
  padding: 0;
  border-radius: var(--radius-lg);
  box-shadow: 0 24px 60px rgba(44, 26, 18, 0.28);
  max-width: 600px;
  width: calc(100% - var(--space-6) * 2);
  max-height: calc(100vh - var(--space-6) * 2);
  background: var(--color-card);
}
.plan-modal::backdrop { background: rgba(44, 26, 18, 0.55); }
.plan-modal[open] { animation: plan-modal-pop 200ms ease; }
.plan-modal[open]::backdrop { animation: plan-modal-fade 180ms ease; }
.plan-modal__panel {
  position: relative;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: calc(100vh - var(--space-6) * 2);
  overflow-y: auto;
}
.plan-modal__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  background: rgba(44, 26, 18, 0.06);
  transition: background var(--transition-base);
}
.plan-modal__close:hover { background: rgba(44, 26, 18, 0.12); }
.plan-modal__close svg { width: 16px; height: 16px; }
.plan-modal #plan-modal-title { padding-right: var(--space-6); }
.plan-modal--accent #plan-modal-price { color: var(--color-red); }

@keyframes plan-modal-pop {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes plan-modal-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

Replace with:

```css
.cotizacion-form { max-width: 720px; margin: 0 auto; }
.cotizacion-form__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
.cotizacion-form__field { display: flex; flex-direction: column; gap: var(--space-2); }
.cotizacion-form__field--full { grid-column: 1 / -1; }
.cotizacion-form__field label {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--color-text);
}
.cotizacion-form__field input,
.cotizacion-form__field textarea {
  font: inherit;
  color: var(--color-text);
  background: var(--color-card);
  border: 1px solid rgba(44, 26, 18, 0.15);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
}
.cotizacion-form__field textarea { resize: vertical; min-height: 110px; }
.cotizacion-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

@media (max-width: 640px) {
  .cotizacion-form__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Remove `initCategoryNav()`, `PLAN_DETAILS` and `initPlanModal()`, add `initCotizacionForm()`**

Find (`js/main.js:110-290`, the full span from `function initCategoryNav()` through the closing `}` of `initPlanModal()`):

```js
function initCategoryNav() {
  document.querySelectorAll('.category-nav').forEach((nav) => {
    const section = nav.closest('section');
    if (!section) return;

    const tabs = Array.from(nav.querySelectorAll('.category-nav__tab'));
    const panels = Array.from(section.querySelectorAll('[data-category-panel]'));
    if (!tabs.length || !panels.length) return;

    function activate(category, { focusTab = false, reveal = true } = {}) {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.category === category;
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && focusTab) tab.focus();
      });
      panels.forEach((panel) => {
        const isActive = panel.dataset.categoryPanel === category;
        panel.hidden = !isActive;
        if (isActive && reveal) {
          panel.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal--visible'));
        }
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.category));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const dir = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + dir + tabs.length) % tabs.length;
        activate(tabs[nextIndex].dataset.category, { focusTab: true });
      });
    });

    const initial = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    activate(initial.dataset.category, { reveal: false });
  });
}

const PLAN_DETAILS = {
  basico: {
    badge: null,
    name: 'Básico',
    desc: 'Todo lo que necesitas para dejar de adivinar y empezar a tener el control de tu negocio.',
    detail: null,
    features: ['Catálogo de productos organizado', 'Entradas y salidas', 'Stock actualizado por producto', 'Historial de movimientos', 'Búsqueda y consulta rápida', 'Información esencial de cada producto', 'Control y seguimiento de inventario'],
    price: '997 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://panel-basico.vercel.app/',
    ctaClass: 'btn--secondary',
    accent: false,
  },
  intermedio: {
    badge: 'Más elegido',
    name: 'Intermedio',
    desc: 'Más funcionalidades para entender cómo se está moviendo tu inventario.',
    detail: 'Gestiona tu stock, ten una lectura más clara del movimiento de tus productos y la información que necesitas para planificar tus próximas compras.',
    features: ['Todo lo incluido en Básico', 'Productos más vendidos', 'Productos con menor movimiento', 'Seguimiento del rendimiento', 'Información y datos de proveedores', 'Productos asociados a cada proveedor', 'Referencia de tus compras habituales', 'Información clave para planificar reposiciones'],
    price: '1.600 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://panel-intermedio.vercel.app/',
    ctaClass: 'btn--primary',
    accent: true,
  },
  pro: {
    badge: null,
    name: 'Pro',
    desc: 'Una visión financiera completa para gestionar y anticiparte.',
    detail: 'Análisis financiero, evolución del negocio y herramientas inteligentes para entender tus números, detectar tendencias y optimizar decisiones y procesos.',
    features: ['Todo lo incluido en Básico e Intermedio', 'Costes y rentabilidad por producto', 'Márgenes y análisis de beneficio', 'Evolución financiera del negocio', 'Comparativas entre períodos', 'Análisis de tendencias', 'Predicciones y recomendaciones', 'Proyección de necesidades de stock', 'Automatización de procesos', 'Integraciones con proveedores', 'Inteligencia artificial aplicada a tu negocio'],
    price: 'A medida',
    priceNote: 'Cotización según tu negocio',
    cta: 'Agendar cotización',
    ctaHref: 'https://calendly.com/charladeclaridad/demo-melray',
    ctaClass: 'btn--secondary',
    accent: false,
  },
  'crm-basico': {
    badge: null,
    name: 'Básico',
    desc: 'Todo lo que necesitas para organizar a tus clientes y no perder ninguna oportunidad.',
    detail: null,
    features: ['Ficha de contacto por cliente', 'Pipeline visual por estados (Nuevo, Contactado, Propuesta, Ganado, Perdido)', 'Búsqueda y filtro de contactos', 'Vista de pipeline y de tabla', 'Resumen de contactos por estado', 'Registro de nuevas oportunidades'],
    price: '997 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://sarayortizcordero.github.io/CRM-Basico/',
    ctaClass: 'btn--secondary',
    accent: false,
  },
  'crm-intermedio': {
    badge: 'Más elegido',
    name: 'Intermedio',
    desc: 'Más contexto de cada cliente para no perder seguimiento de ninguna oportunidad.',
    detail: 'Da seguimiento a cada oportunidad con su historial completo y sabe cuánto vale lo que tienes en curso.',
    features: ['Todo lo incluido en Básico', 'Historial de actividad por contacto', 'Checklist de tareas por oportunidad', 'Valor estimado por trato', 'Seguimiento de ingresos potenciales por etapa', 'Vista de detalle ampliada por contacto'],
    price: '1.600 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://sarayortizcordero.github.io/CRM-Intermedio/',
    ctaClass: 'btn--primary',
    accent: true,
  },
  'crm-completo': {
    badge: null,
    name: 'Completo',
    desc: 'Visión completa de tu actividad comercial, con reportes y automatizaciones incluidas.',
    detail: 'Visión completa de tu actividad comercial, con reportes y automatizaciones para anticiparte en vez de reaccionar.',
    features: ['Todo lo incluido en Básico e Intermedio', 'Dashboard con ingresos, actividad y top clientes', 'Reportes de rendimiento comercial', 'Gestión de empresas y documentos', 'Navegación completa por módulos (Contactos, Empresas, Documentos, Automatizaciones, Reportes)', 'Automatizaciones integradas al proceso comercial'],
    price: 'A medida',
    priceNote: 'Cotización según tu negocio',
    cta: 'Ver demo en acción',
    ctaHref: 'https://sarayortizcordero.github.io/CRM-Completo/',
    ctaClass: 'btn--secondary',
    accent: false,
  },
};

function initPlanModal() {
  const dialog = document.getElementById('plan-modal');
  const section = document.querySelector('.planes');
  if (!dialog || !section || typeof dialog.showModal !== 'function') return;

  const closeBtn = document.getElementById('plan-modal-close');
  const badgeEl = document.getElementById('plan-modal-badge');
  const badgeLabelEl = document.getElementById('plan-modal-badge-label');
  const titleEl = document.getElementById('plan-modal-title');
  const descEl = document.getElementById('plan-modal-desc');
  const detailEl = document.getElementById('plan-modal-detail');
  const featuresEl = document.getElementById('plan-modal-features');
  const priceEl = document.getElementById('plan-modal-price');
  const priceNoteEl = document.getElementById('plan-modal-price-note');
  const ctaEl = document.getElementById('plan-modal-cta');
  if (!closeBtn || !badgeEl || !badgeLabelEl || !titleEl || !descEl || !detailEl || !featuresEl || !priceEl || !priceNoteEl || !ctaEl) return;

  function openPlan(id) {
    const plan = PLAN_DETAILS[id];
    if (!plan) return;

    badgeEl.hidden = !plan.badge;
    if (plan.badge) badgeLabelEl.textContent = plan.badge;

    titleEl.textContent = plan.name;
    descEl.textContent = plan.desc;

    detailEl.hidden = !plan.detail;
    if (plan.detail) detailEl.textContent = plan.detail;

    featuresEl.replaceChildren(...plan.features.map((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));

    priceEl.textContent = plan.price;
    priceNoteEl.textContent = plan.priceNote;

    ctaEl.textContent = plan.cta;
    ctaEl.href = plan.ctaHref;
    ctaEl.classList.remove('btn--primary', 'btn--secondary');
    ctaEl.classList.add(plan.ctaClass);

    dialog.classList.toggle('plan-modal--accent', plan.accent);
    dialog.showModal();
  }

  section.querySelectorAll('.plan-card__more').forEach((btn) => {
    btn.addEventListener('click', () => openPlan(btn.dataset.plan));
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  section.classList.add('plans-js-ready');
}
```

Replace with:

```js
function initCotizacionForm() {
  const form = document.getElementById('cotizacion-form');
  const whatsappBtn = document.getElementById('cotizacion-whatsapp');
  const emailBtn = document.getElementById('cotizacion-email');
  if (!form || !whatsappBtn || !emailBtn) return;

  const WHATSAPP_NUMBER = '5491127041868';
  const EMAIL_TO = 'melray@melraysystems.com';

  form.addEventListener('submit', (event) => event.preventDefault());

  function buildMessage() {
    const nombre = form.nombre.value.trim();
    const negocio = form.negocio.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const necesidad = form.necesidad.value.trim();
    const herramientas = form.herramientas.value.trim();

    const lines = ['Hola, quiero cotizar una automatización:', `Nombre: ${nombre}`];
    if (negocio) lines.push(`Negocio: ${negocio}`);
    lines.push(`Email: ${email}`, `Teléfono: ${telefono}`, `Qué necesita automatizar: ${necesidad}`);
    if (herramientas) lines.push(`Herramientas actuales: ${herramientas}`);

    return { nombre, message: lines.join('\n') };
  }

  whatsappBtn.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const { message } = buildMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  emailBtn.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const { nombre, message } = buildMessage();
    const subject = `Cotización de automatización — ${nombre}`;
    window.location.href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}
```

- [ ] **Step 5: Update the init list**

Find (`js/main.js`, end of file):

```js
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initCategoryNav);
  runSafely(initPlanModal);
});
```

Replace with:

```js
document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initCotizacionForm);
});
```

- [ ] **Step 6: Verify no remaining references**

```bash
grep -rn "category-nav\|plan-card\|plan-modal\|PLAN_DETAILS\|initCategoryNav\|initPlanModal" --include="*.html" --include="*.js" --include="*.css" .
```

Expected: no matches.

- [ ] **Step 7: Verify in browser**

`browser_navigate` to `index.html`, scroll to `#cotizacion`. Confirm the eyebrow reads "Cotización" and the form shows 6 fields (Nombre, Negocio, Email, Teléfono, textarea, Herramientas) plus two buttons.

Test validation: `browser_click` "Enviar por WhatsApp" with all fields empty — expect the browser's native validation bubble on "Nombre completo" (no navigation happens).

Test the happy path: fill Nombre="Ana Test", Email="ana@test.com", Teléfono="600111222", "¿Qué te gustaría automatizar?"="Enviar recordatorios de pago", then `browser_click` "Enviar por WhatsApp" — expect a new tab/window opens to a `https://wa.me/5491127041868?text=...` URL containing "Ana Test" and "Enviar recordatorios de pago" (use `browser_evaluate` or inspect the opened tab's URL). Then test "Enviar por email" the same way and confirm the browser attempts to open a `mailto:melray@melraysystems.com?subject=...` URL.

Confirm pressing Enter inside the "Nombre completo" input does not reload the page.

- [ ] **Step 8: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: replace Planes pricing tabs with a WhatsApp/email quote form"
```

---

### Task 4: Servicios — reorder cards, update section lead

**Files:**
- Modify: `index.html` (`<!-- SECTION:SERVICIOS -->` block, section-head lead + 4 `.servicios__card` order)

**Interfaces:**
- Consumes: existing `.servicios__grid`/`.servicios__card`/`.servicios__card-link` CSS (unchanged), existing `crm.html`/`automatizaciones.html`/`websites.html`/`inventario.html` (unchanged).

- [ ] **Step 1: Update the section lead and reorder the 4 cards**

Find:

```html
        <div class="section-head reveal">
          <h2 class="section-head__lead">Construimos las herramientas digitales que tu negocio necesita, empezando por tu CRM.</h2>
          <p>Creamos soluciones digitales que acompañan las distintas necesidades de tu negocio para hacer tu día a día más simple.</p>
        </div>
        <div class="servicios__grid">
          <article class="servicios__card reveal">
            <h3>CRM</h3>
            <p>Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
            <a href="crm.html" class="servicios__card-link">Ver CRM <span aria-hidden="true">→</span></a>
          </article>
          <article class="servicios__card reveal">
            <h3>Automatizaciones</h3>
            <p>Conectamos herramientas y automatizamos procesos para reducir tareas manuales y hacer tus operaciones más eficientes.</p>
            <a href="automatizaciones.html" class="servicios__card-link">Ver Automatizaciones <span aria-hidden="true">→</span></a>
          </article>
          <article class="servicios__card reveal">
            <h3>Websites</h3>
            <p>Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.</p>
            <a href="websites.html" class="servicios__card-link">Ver Websites <span aria-hidden="true">→</span></a>
          </article>
          <article class="servicios__card reveal">
            <h3>Paneles e Inventarios</h3>
            <p>Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos.</p>
            <a href="inventario.html" class="servicios__card-link">Ver Paneles <span aria-hidden="true">→</span></a>
          </article>
        </div>
```

Replace with:

```html
        <div class="section-head reveal">
          <h2 class="section-head__lead">Construimos las herramientas digitales que tu negocio necesita, empezando por tu automatización.</h2>
          <p>Creamos soluciones digitales que acompañan las distintas necesidades de tu negocio para hacer tu día a día más simple.</p>
        </div>
        <div class="servicios__grid">
          <article class="servicios__card reveal">
            <h3>Automatizaciones</h3>
            <p>Conectamos herramientas y automatizamos procesos para reducir tareas manuales y hacer tus operaciones más eficientes.</p>
            <a href="automatizaciones.html" class="servicios__card-link">Ver Automatizaciones <span aria-hidden="true">→</span></a>
          </article>
          <article class="servicios__card reveal">
            <h3>CRM</h3>
            <p>Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
            <a href="crm.html" class="servicios__card-link">Ver CRM <span aria-hidden="true">→</span></a>
          </article>
          <article class="servicios__card reveal">
            <h3>Websites</h3>
            <p>Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.</p>
            <a href="websites.html" class="servicios__card-link">Ver Websites <span aria-hidden="true">→</span></a>
          </article>
          <article class="servicios__card reveal">
            <h3>Paneles e Inventarios</h3>
            <p>Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos.</p>
            <a href="inventario.html" class="servicios__card-link">Ver Paneles <span aria-hidden="true">→</span></a>
          </article>
        </div>
```

- [ ] **Step 2: Verify in browser**

`browser_navigate` to `index.html`, scroll to `#servicios`. Confirm the card order left-to-right (or top-to-bottom on mobile) is: Automatizaciones, CRM, Websites, Paneles e Inventarios. Confirm the lead sentence ends in "...empezando por tu automatización."

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: reorder Servicios cards with Automatizaciones first"
```

---

### Task 5: Footer tagline

**Files:**
- Modify: `index.html` (`<!-- SECTION:FOOTER -->` block)

**Interfaces:**
- Consumes: nothing. Produces: nothing consumed elsewhere (footer is self-contained).

- [ ] **Step 1: Replace the stale "Tu inventario" tagline**

Find:

```html
      <div class="site-footer__brand">
        <span class="site-header__wordmark">melray</span>
        <p>Tu inventario. Sin el caos.</p>
      </div>
```

Replace with:

```html
      <div class="site-footer__brand">
        <span class="site-header__wordmark">melray</span>
        <p>Automatiza lo repetitivo. Enfócate en crecer.</p>
      </div>
```

- [ ] **Step 2: Verify in browser**

`browser_navigate` to `index.html`, scroll to the footer. Confirm the tagline under "melray" now reads "Automatiza lo repetitivo. Enfócate en crecer."

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: update footer tagline to match automation-led positioning"
```

---

### Task 6: Nav rename on the other 4 pages

**Files:**
- Modify: `websites.html:49,67`, `automatizaciones.html:49,67`, `crm.html:49,67`, `inventario.html:49,67`

**Interfaces:**
- Consumes: `#cotizacion` section id, produced by Task 3.

The exact same two lines appear in all 4 files, at lines 49 (desktop nav, 10-space indent) and 67 (mobile nav, 8-space indent):

```html
          <li><a href="index.html#planes">Planes</a></li>
```

```html
        <li><a href="index.html#planes">Planes</a></li>
```

Each becomes (same indentation, text and href updated):

```html
          <li><a href="index.html#cotizacion">Cotización</a></li>
```

```html
        <li><a href="index.html#cotizacion">Cotización</a></li>
```

- [ ] **Step 1: Apply the rename to `websites.html:49` and `websites.html:67`**

Replace the line-49 block and the line-67 block in `websites.html` as shown above.

- [ ] **Step 2: Apply the rename to `automatizaciones.html:49` and `automatizaciones.html:67`**

Replace the line-49 block and the line-67 block in `automatizaciones.html` as shown above.

- [ ] **Step 3: Apply the rename to `crm.html:49` and `crm.html:67`**

Replace the line-49 block and the line-67 block in `crm.html` as shown above.

- [ ] **Step 4: Apply the rename to `inventario.html:49` and `inventario.html:67`**

Replace the line-49 block and the line-67 block in `inventario.html` as shown above.

- [ ] **Step 5: Verify no remaining references**

```bash
grep -rn "#planes" --include="*.html" .
```

Expected: no matches anywhere in the repo.

- [ ] **Step 6: Verify in browser**

For each of `websites.html`, `automatizaciones.html`, `crm.html`, `inventario.html`: `browser_navigate` to the file, confirm the desktop nav shows "Cotización" (not "Planes"), `browser_click` it, confirm it navigates to `index.html#cotizacion` and the page scrolls to the quote form. Repeat by opening the mobile menu (`browser_resize` to width 375) and clicking "Cotización" there too.

- [ ] **Step 7: Commit**

```bash
git add websites.html automatizaciones.html crm.html inventario.html
git commit -m "fix: rename Planes nav link to Cotización across service pages"
```

---

### Task 7: Full verification pass

**Files:** none (verification only).

**Interfaces:** Consumes everything produced by Tasks 1–6.

- [ ] **Step 1: Full-page visual check on desktop**

`browser_navigate` to `index.html`, `browser_resize` to width 1280 height 900. `browser_take_screenshot` of the full page (hero, Producto flow diagram, Cotización form, Servicios, footer). Confirm nothing overlaps and the flow diagram's connecting line reaches both neighboring steps cleanly.

- [ ] **Step 2: Full-page visual check on mobile (375px)**

`browser_resize` to width 375 height 800. Re-check the same sections: hero stacks, flow diagram stacks vertically, Cotización form fields go to 1 column, Servicios cards stack to 1 column.

- [ ] **Step 3: Reduced-motion check on the flow diagram**

In Chrome DevTools: open the Rendering tab (⋮ menu → More tools → Rendering), set "Emulate CSS media feature prefers-reduced-motion" to "reduce", then reload `index.html#producto`. Confirm `.flow-diagram__pulse` is no longer visible/animating (the global reduced-motion rule at `css/styles.css:63-70` plus the `.flow-diagram__pulse` override at the end of Task 2's added CSS set `animation: none; opacity: 0;`). Turn the emulation back off afterward.

- [ ] **Step 4: Keyboard/accessibility spot-check on the form**

`browser_navigate` to `index.html#cotizacion`. Use `browser_click` on "Nombre completo" then verify Tab order moves through Negocio → Email → Teléfono → textarea → Herramientas → Enviar por WhatsApp → Enviar por email (via `browser_snapshot`/`browser_evaluate` reading `document.activeElement` after each Tab, or by reading the accessibility tree). Confirm every input has a visible focus outline (the existing global `:focus-visible` rule).

- [ ] **Step 5: Cross-link check**

From `index.html`, click through to `crm.html`, `automatizaciones.html`, `websites.html`, `inventario.html` and back (via "Volver a Melray"). From each, click "Cotización" in the nav and confirm it lands on `index.html#cotizacion`.

- [ ] **Step 6: Final dead-code grep**

```bash
grep -rn "category-nav\|plan-card\|plan-modal\|PLAN_DETAILS\|initCategoryNav\|initPlanModal\|initMockupTilt\|producto__mockup\|producto__row\|#planes" --include="*.html" --include="*.js" --include="*.css" .
```

Expected: no matches anywhere in the repo.

- [ ] **Step 7: Confirm CRM content is preserved in git history, not deleted from disk**

```bash
git log --oneline --all | grep -i "crm demo screenshots\|crm pricing"
ls assets/mockup-crm-pipeline.png assets/mockup-crm-ficha.png assets/mockup-crm-dashboard.png
```

Expected: the commit(s) that added the CRM screenshots still exist in history, and the PNG files are still present on disk under `assets/` (just unreferenced by any HTML/CSS/JS after Task 3).

- [ ] **Step 8: Update plan checkboxes and do a final commit if anything was fixed during verification**

If Steps 1–7 required any fixes, commit them individually with a descriptive message before considering the plan done. If everything passed as-is, no commit is needed for this task.
