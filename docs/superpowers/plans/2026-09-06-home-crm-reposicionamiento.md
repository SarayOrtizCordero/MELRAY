# Reposicionamiento Home (CRM primero) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition `index.html` so CRM leads the homepage narrative (hero, product showcase, pricing), with Automatización second and Webs/Paneles-Inventarios lower priority, via a reusable category-nav tab component; add the missing `inventario.html` service page.

**Architecture:** Pure HTML/CSS/JS additions to the existing static site (no build step, no framework). A single reusable `.category-nav` component (vanilla JS tablist, same `hidden`-attribute toggling idiom already used by `mobile-menu`/`cookie-banner`/`plan-modal` in `js/main.js`) is mounted twice — once in the "Producto" section, once in "Planes" — each instance independent.

**Tech Stack:** Static HTML/CSS/vanilla JS (`css/styles.css`, `js/main.js`), no dependencies added.

**Spec:** `docs/superpowers/specs/2026-09-06-home-crm-reposicionamiento-design.md`

## Global Constraints

- No build step, no framework, no new npm dependencies — plain HTML/CSS/JS, matching the rest of the site.
- Follow the existing BEM-ish naming convention (`.block__element--modifier`) used throughout `css/styles.css`.
- Use only existing CSS custom properties from `:root` (colors, spacing, radius, shadows) — no new hardcoded values.
- New interactive behavior must follow the existing pattern: toggle the native `hidden` attribute via vanilla JS (see `initMobileNav`, `initCookieBanner`, `initPlanModal` in `js/main.js`), wrapped in `runSafely()`.
- Preserve the `<!-- SECTION:X --> ... <!-- /SECTION:X -->` HTML comment markers already used to delimit sections in `index.html`; add matching markers around any new section-level markup.
- All copy is in Spanish, matching the existing site's voice (direct, informal "tú").
- Prices already in the spec (997 €, 1.600 €, "A medida") are final — do not invent different numbers.

---

## File Structure

- Modify `index.html` — hero copy, header nav label, Servicios reorder + new card, Producto section → 4 category panels, Planes section → 4 category panels.
- Modify `css/styles.css` — new `.category-nav` component, `.producto__cta`, `.planes__single`, updated `.servicios__grid` breakpoints.
- Modify `js/main.js` — new `initCategoryNav()`, extended `PLAN_DETAILS`.
- Modify `crm.html`, `automatizaciones.html`, `websites.html` — header nav label fix (`Inventario` → `Producto`), for consistency with the renamed anchor.
- Create `inventario.html` — new service page (cloned structure from `crm.html`).
- Modify `sitemap.xml` — add `inventario.html`.
- Create `assets/mockup-crm-pipeline.png`, `assets/mockup-crm-ficha.png`, `assets/mockup-crm-dashboard.png` — real screenshots captured from the live CRM demos.

---

### Task 1: Capture CRM demo screenshots

**Files:**
- Create: `assets/mockup-crm-pipeline.png`
- Create: `assets/mockup-crm-ficha.png`
- Create: `assets/mockup-crm-dashboard.png`

**Interfaces:**
- Produces: three PNG files under `assets/`, referenced by `<img src="/assets/mockup-crm-*.png">` in Task 7.

These three demos already exist and are real, working products — this task only captures static images of them, it does not build anything.

- [ ] **Step 1: Capture the pipeline/kanban view (CRM Básico)**

Using the Playwright browser tools: `browser_navigate` to `https://sarayortizcordero.github.io/CRM-Basico/`, `browser_resize` to width 1280 height 800, wait ~1s for render, then `browser_take_screenshot` with `filename: "mockup-crm-pipeline.png"`, `type: "png"`, `fullPage: false`.

- [ ] **Step 2: Capture the contact-detail + checklist view (CRM Intermedio)**

`browser_navigate` to `https://sarayortizcordero.github.io/CRM-Intermedio/`, same 1280×800 resize, `browser_take_screenshot` with `filename: "mockup-crm-ficha.png"`.

- [ ] **Step 3: Capture the dashboard view (CRM Completo)**

`browser_navigate` to `https://sarayortizcordero.github.io/CRM-Completo/`, same 1280×800 resize, `browser_take_screenshot` with `filename: "mockup-crm-dashboard.png"`.

- [ ] **Step 4: Move the three captured files into `assets/`**

Each of the three `browser_take_screenshot` calls above returns the absolute path it saved the file to, in its tool result. Read that exact path from each of the three results and copy each file into the repo under the matching name:

```bash
cp "<absolute path from the mockup-crm-pipeline.png screenshot result>" assets/mockup-crm-pipeline.png
cp "<absolute path from the mockup-crm-ficha.png screenshot result>" assets/mockup-crm-ficha.png
cp "<absolute path from the mockup-crm-dashboard.png screenshot result>" assets/mockup-crm-dashboard.png
```

- [ ] **Step 5: Verify**

```bash
ls -la assets/mockup-crm-pipeline.png assets/mockup-crm-ficha.png assets/mockup-crm-dashboard.png
```

Expected: all three files exist and are non-empty (a few hundred KB, similar in size to `assets/mockup-catalogo.png`).

- [ ] **Step 6: Commit**

```bash
git add assets/mockup-crm-pipeline.png assets/mockup-crm-ficha.png assets/mockup-crm-dashboard.png
git commit -m "feat: add CRM demo screenshots for homepage showcase"
```

---

### Task 2: Create `inventario.html` service page + sitemap entry

**Files:**
- Create: `inventario.html`
- Modify: `sitemap.xml`

**Interfaces:**
- Produces: `inventario.html`, linked from the new Servicios card in Task 4 and from the "Ver todo sobre Paneles/Inventarios" link in Task 7.

- [ ] **Step 1: Create `inventario.html` by cloning `crm.html`'s structure**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paneles e Inventarios — Melray</title>
  <meta name="description" content="Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos. Conoce los Paneles e Inventarios de Melray.">
  <link rel="canonical" href="https://melraysystems.com/inventario.html">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="Paneles e Inventarios — Melray">
  <meta property="og:description" content="Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos.">
  <meta property="og:url" content="https://melraysystems.com/inventario.html">
  <meta property="og:image" content="https://melraysystems.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Paneles e Inventarios — Melray">
  <meta name="twitter:description" content="Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos.">

  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#df3314">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Saltar al contenido</a>

  <header class="site-header" id="site-header">
    <div class="container site-header__inner">
      <a href="index.html" class="site-header__logo" aria-label="Melray — inicio">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#fb7b15"/>
              <stop offset="1" stop-color="#df3314"/>
            </linearGradient>
          </defs>
          <path fill="url(#logoGrad)" d="M15 2.3C18.3 6.3 22.2 10.8 22.8 16.2C23.7 11.7 22.2 8.3 20.7 6.3C23.7 8.7 25.8 13.2 25.5 18.3C25.5 25.2 20.9 30.3 15 30.3C9.2 30.3 4.5 25.2 4.5 18.3C4.5 13.8 6.9 10.2 10.2 7.5C9 10.2 9.3 13.2 11.1 15C10.5 10.8 12.3 6.3 15 2.3Z"/>
        </svg>
        <span class="site-header__wordmark">melray</span>
      </a>

      <nav class="site-header__nav" id="primary-nav" aria-label="Navegación principal">
        <ul>
          <li><a href="index.html#producto">Producto</a></li>
          <li><a href="index.html#planes">Planes</a></li>
          <li><a href="index.html#servicios">Servicios</a></li>
        </ul>
      </nav>

      <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary site-header__cta" target="_blank" rel="noopener">Agendar una demo</a>

      <button type="button" class="site-header__toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-menu">
        <span class="visually-hidden">Abrir menú</span>
        <span class="site-header__toggle-bar"></span>
        <span class="site-header__toggle-bar"></span>
        <span class="site-header__toggle-bar"></span>
      </button>
    </div>

    <nav id="mobile-menu" class="mobile-menu" aria-label="Navegación móvil" hidden>
      <ul>
        <li><a href="index.html#producto">Producto</a></li>
        <li><a href="index.html#planes">Planes</a></li>
        <li><a href="index.html#servicios">Servicios</a></li>
        <li><a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <div class="container">
      <a href="index.html" class="service-back"><span aria-hidden="true">←</span> Volver a Melray</a>
    </div>

    <!-- SECTION:SERVICE-HERO -->
    <section class="service-hero">
      <div class="container service-hero__inner reveal">
        <h1>Tu inventario, sin el caos</h1>
        <p class="service-hero__subtitle">Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos.</p>
        <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a>
      </div>
    </section>
    <!-- /SECTION:SERVICE-HERO -->

    <!-- SECTION:SERVICE-FEATURES -->
    <section class="service-features">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="eyebrow">Qué incluye</h2>
        </div>
        <ul class="service-features__grid reveal">
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Catálogo de productos organizado
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Entradas y salidas en segundos
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Stock actualizado por producto
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Historial de movimientos
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Productos más vendidos y sin movimiento
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Planificación de reposiciones
          </li>
        </ul>
      </div>
    </section>
    <!-- /SECTION:SERVICE-FEATURES -->

    <!-- SECTION:SERVICE-DEMO -->
    <section class="service-demo">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="eyebrow">Demo</h2>
        </div>

        <div class="producto__row reveal">
          <div class="producto__mockup">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--media">
              <img src="/assets/mockup-catalogo.png" alt="Captura del panel de inventario Melray mostrando la lista de productos con SKU, proveedor y stock." loading="lazy">
            </div>
          </div>
          <div class="producto__text">
            <h3>Todo tu catálogo. En un solo lugar</h3>
            <p>Organiza tus productos de forma clara, con la información que realmente necesitas. Sin campos porque sí.</p>
          </div>
        </div>

        <div class="producto__row producto__row--reverse reveal">
          <div class="producto__mockup">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--media producto__mockup-body--media-movimientos">
              <img src="/assets/mockup-movimientos.png" alt="Captura del panel de inventario Melray mostrando los productos más vendidos y los productos sin movimiento." loading="lazy">
            </div>
          </div>
          <div class="producto__text">
            <h3>Cada movimiento, bajo control</h3>
            <p>Registra entradas y salidas en segundos y mantén tu inventario actualizado mientras tu negocio se mueve.</p>
          </div>
        </div>

        <div class="producto__row reveal">
          <div class="producto__mockup">
            <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
            <div class="producto__mockup-body producto__mockup-body--media">
              <img src="/assets/mockup-consulta.png" alt="Captura del panel de inventario Melray mostrando el resumen de stock: total de productos, listos para vender y porcentaje disponible." loading="lazy">
            </div>
          </div>
          <div class="producto__text">
            <h3>Lo que tienes. Cuando necesitas saberlo</h3>
            <p>Consulta tu stock actual sin buscar archivos, revisar anotaciones o preguntarte cuándo fue la última vez que alguien actualizó el Excel.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- /SECTION:SERVICE-DEMO -->

    <!-- SECTION:SERVICE-CTA -->
    <section class="service-cta">
      <div class="container">
        <div class="service-cta__card reveal">
          <h2>¿Quieres ver cómo lo hacemos?</h2>
          <p>Cada proyecto es distinto — conversemos sobre el tuyo.</p>
          <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar cotización</a>
        </div>
      </div>
    </section>
    <!-- /SECTION:SERVICE-CTA -->
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <span class="site-header__wordmark">melray</span>
        <p>Tu inventario. Sin el caos.</p>
      </div>
      <nav class="site-footer__links" aria-label="Enlaces legales">
        <a href="mailto:melray@melraysystems.com">melray@melraysystems.com</a>
        <a href="https://www.instagram.com/melray.systems/" target="_blank" rel="noopener">Instagram</a>
        <a href="privacidad.html">Privacidad</a>
        <a href="terminos.html">Términos</a>
        <a href="cookies.html">Cookies</a>
      </nav>
      <p class="site-footer__copy">&copy; <span id="footer-year"></span> Melray. Todos los derechos reservados.</p>
    </div>
  </footer>

  <script src="/js/main.js" defer></script>
</body>
</html>
```

Note this page's header nav already says "Producto" (not "Inventario") — Task 3 makes the other pages match.

- [ ] **Step 2: Add the sitemap entry**

In `sitemap.xml`, after the `automatizaciones.html` line, add:

```xml
  <url><loc>https://melraysystems.com/inventario.html</loc></url>
```

- [ ] **Step 3: Verify**

Start the preview server (`melray-static`, port 4173) and open `http://localhost:4173/inventario.html`. Confirm the page renders with header, hero, 6 features, 3 real demo screenshots, and footer — no console errors.

- [ ] **Step 4: Commit**

```bash
git add inventario.html sitemap.xml
git commit -m "feat: add inventario.html service page"
```

---

### Task 3: Hero copy + header nav label consistency

**Files:**
- Modify: `index.html` (hero section, header nav)
- Modify: `crm.html`, `automatizaciones.html`, `websites.html` (header nav label only)

**Interfaces:**
- No new interfaces — pure copy/label changes.

- [ ] **Step 1: Update the hero copy in `index.html`**

Inside `<!-- SECTION:HERO -->`, replace:

```html
          <h1>Gestión simple para negocios que no paran de moverse</h1>
          <p class="hero__subtitle">Melray pone orden para que puedas enfocarte en hacerlo crecer</p>
```

with:

```html
          <h1>Organiza tus clientes. Después, todo lo demás</h1>
          <p class="hero__subtitle">Melray empieza por tu CRM y suma automatización, webs e inventario a medida que tu negocio lo necesita.</p>
```

- [ ] **Step 2: Rename the "Inventario" nav label to "Producto" in `index.html`**

In the desktop nav (`#primary-nav`), change:

```html
          <li><a href="#producto">Inventario</a></li>
```

to:

```html
          <li><a href="#producto">Producto</a></li>
```

(The mobile menu already says "Producto" for the same anchor — this just makes the desktop nav match it.)

- [ ] **Step 3: Apply the same label fix to the three existing service pages**

In `crm.html`, `automatizaciones.html`, and `websites.html`, change:

```html
          <li><a href="index.html#producto">Inventario</a></li>
```

to:

```html
          <li><a href="index.html#producto">Producto</a></li>
```

- [ ] **Step 4: Verify**

Start `melray-static` preview, open `http://localhost:4173/`. Confirm the hero shows the new headline/subhead, and the desktop nav says "Producto" (not "Inventario"). Open `crm.html`, `automatizaciones.html`, `websites.html` and confirm their nav also says "Producto".

- [ ] **Step 5: Commit**

```bash
git add index.html crm.html automatizaciones.html websites.html
git commit -m "feat: reposition hero copy around CRM, rename Producto nav label"
```

---

### Task 4: Reorder Servicios cards + add Paneles/Inventarios card

**Files:**
- Modify: `index.html` (`<!-- SECTION:SERVICIOS -->`)
- Modify: `css/styles.css` (`.servicios__grid`)

**Interfaces:**
- Consumes: `inventario.html` (created in Task 2).

- [ ] **Step 1: Reorder and extend the Servicios cards in `index.html`**

Replace the `.servicios__grid` contents:

```html
        <div class="servicios__grid">
          <article class="servicios__card reveal">
            <h3>Websites</h3>
            <p>Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.</p>
            <a href="websites.html" class="servicios__card-link">Ver Websites <span aria-hidden="true">→</span></a>
          </article>
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
        </div>
```

with:

```html
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

- [ ] **Step 2: Update the grid CSS for 4 cards**

In `css/styles.css`, change:

```css
.servicios__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
```

to:

```css
.servicios__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }
```

Then, directly above the existing `@media (max-width: 860px) { .servicios__grid { grid-template-columns: 1fr; } }` block, add a new block:

```css
@media (max-width: 1100px) {
  .servicios__grid { grid-template-columns: repeat(2, 1fr); }
}
```

(Source order matters: the existing 860px rule must stay *after* this new 1100px rule so it still wins at narrow widths.)

- [ ] **Step 3: Verify**

Start `melray-static` preview, open `http://localhost:4173/#servicios`. Confirm 4 cards appear in order CRM, Automatizaciones, Websites, Paneles e Inventarios; confirm the "Ver Paneles" link goes to `inventario.html`. Resize to ~900px width (2 columns) and ~500px width (1 column) and confirm the grid reflows without overlap.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: reorder Servicios cards and add Paneles e Inventarios"
```

---

### Task 5: Category-nav shared CSS component

**Files:**
- Modify: `css/styles.css`

**Interfaces:**
- Produces: `.category-nav`, `.category-nav__tab` (styled by `[aria-selected]`), `.producto__cta`, `.planes__single` — consumed by Tasks 7 and 8.

- [ ] **Step 1: Add the category-nav component CSS**

Insert this block right after the `/* ===== Section closing statement ===== */` block (after the `.section-closing strong { color: var(--color-orange-dark); }` rule, before `/* ===== Problema ===== */`):

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

- [ ] **Step 2: Add `.producto__cta`**

In the `/* ===== Producto hoy ===== */` block, right after `.producto__mockup-body--media-movimientos img { transform: scale(1.45); transform-origin: top; }` and before the `@media (max-width: 860px)` block, add:

```css
.producto__cta { text-align: center; margin-top: var(--space-6); }
```

- [ ] **Step 3: Add `.planes__single`**

In the `/* ===== Planes ===== */` block, right after `.planes__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); align-items: stretch; }`, add:

```css
.planes__single { max-width: 480px; margin: 0 auto; }
```

- [ ] **Step 4: Verify**

No visible change yet (nothing references these classes until Tasks 7/8). Run a quick sanity check: open `http://localhost:4173/` in the preview and confirm the page still renders with no CSS errors (check `preview_logs` / browser console).

- [ ] **Step 5: Commit**

```bash
git add css/styles.css
git commit -m "feat: add category-nav shared CSS component"
```

---

### Task 6: Category-nav JS behavior

**Files:**
- Modify: `js/main.js`

**Interfaces:**
- Consumes: DOM markup with `.category-nav`, `.category-nav__tab[data-category]`, `[data-category-panel]` — produced by Tasks 7 and 8.
- Produces: `initCategoryNav()`, registered in the `DOMContentLoaded` listener.

- [ ] **Step 1: Add `initCategoryNav()`**

Insert this function after `initMockupTilt()` and before the `PLAN_DETAILS` constant:

```js
function initCategoryNav() {
  document.querySelectorAll('.category-nav').forEach((nav) => {
    const section = nav.closest('section');
    if (!section) return;

    const tabs = Array.from(nav.querySelectorAll('.category-nav__tab'));
    const panels = Array.from(section.querySelectorAll('[data-category-panel]'));
    if (!tabs.length || !panels.length) return;

    function activate(category, { focusTab = false } = {}) {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.category === category;
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && focusTab) tab.focus();
      });
      panels.forEach((panel) => {
        const isActive = panel.dataset.categoryPanel === category;
        panel.hidden = !isActive;
        if (isActive) {
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
    activate(initial.dataset.category);
  });
}
```

- [ ] **Step 2: Register it in `DOMContentLoaded`**

Change:

```js
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

to:

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

- [ ] **Step 3: Verify**

No visible effect yet (no `.category-nav` markup exists until Tasks 7/8). Confirm `http://localhost:4173/` still loads with zero console errors — `initCategoryNav` should no-op cleanly (its `querySelectorAll('.category-nav')` returns an empty list).

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat: add initCategoryNav tablist behavior"
```

---

### Task 7: Restructure "Producto" section into category panels

**Files:**
- Modify: `index.html` (`<!-- SECTION:PRODUCTO -->` … `<!-- /SECTION:PRODUCTO -->`)

**Interfaces:**
- Consumes: `.category-nav`/`.category-nav__tab` CSS (Task 5), `initCategoryNav()` (Task 6), `assets/mockup-crm-*.png` (Task 1).

- [ ] **Step 1: Replace the entire `<!-- SECTION:PRODUCTO -->` block**

Replace everything between `<!-- SECTION:PRODUCTO Capturas reales del producto -->` and `<!-- /SECTION:PRODUCTO -->` with:

```html
    <!-- SECTION:PRODUCTO Capturas reales del producto -->
    <section class="producto" id="producto">
      <div class="container">
        <div class="category-nav" role="tablist" aria-label="Categorías de producto">
          <button type="button" class="category-nav__tab" role="tab" id="producto-tab-crm" aria-selected="true" aria-controls="producto-panel-crm" data-category="crm">CRM</button>
          <button type="button" class="category-nav__tab" role="tab" id="producto-tab-automatizacion" aria-selected="false" aria-controls="producto-panel-automatizacion" data-category="automatizacion" tabindex="-1">Automatización</button>
          <button type="button" class="category-nav__tab" role="tab" id="producto-tab-webs" aria-selected="false" aria-controls="producto-panel-webs" data-category="webs" tabindex="-1">Webs</button>
          <button type="button" class="category-nav__tab" role="tab" id="producto-tab-inventario" aria-selected="false" aria-controls="producto-panel-inventario" data-category="inventario" tabindex="-1">Paneles/Inventarios</button>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="producto-panel-crm" aria-labelledby="producto-tab-crm" data-category-panel="crm">
          <div class="section-head reveal">
            <h2 class="eyebrow">CRM hoy</h2>
            <p class="section-head__lead">Lo que necesitas saber de tus clientes, sin perseguir información.</p>
            <p>Melray centraliza tus contactos y oportunidades para que sepas en qué punto está cada cliente, sin depender de la memoria o de notas sueltas.</p>
          </div>

          <div class="producto__row reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <div class="producto__mockup-body producto__mockup-body--media">
                <img src="/assets/mockup-crm-pipeline.png" alt="Captura del CRM de Melray mostrando el pipeline de oportunidades por estado: Nuevo, Contactado, Propuesta, Ganado y Perdido." loading="lazy">
              </div>
            </div>
            <div class="producto__text">
              <h3>Tu pipeline, siempre a la vista</h3>
              <p>Visualiza cada oportunidad según su estado y sabe en todo momento qué necesita tu atención.</p>
            </div>
          </div>

          <div class="producto__row producto__row--reverse reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <div class="producto__mockup-body producto__mockup-body--media">
                <img src="/assets/mockup-crm-ficha.png" alt="Captura del CRM de Melray mostrando la ficha de un contacto con su historial de actividad y checklist de tareas." loading="lazy">
              </div>
            </div>
            <div class="producto__text">
              <h3>Cada cliente, con su historial completo</h3>
              <p>Consulta el historial de actividad y las tareas pendientes de cada contacto, sin perder seguimiento de ninguna oportunidad.</p>
            </div>
          </div>

          <div class="producto__row reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <div class="producto__mockup-body producto__mockup-body--media">
                <img src="/assets/mockup-crm-dashboard.png" alt="Captura del CRM de Melray mostrando el dashboard con ingresos, actividad reciente y mejores clientes." loading="lazy">
              </div>
            </div>
            <div class="producto__text">
              <h3>Reportes claros de tu actividad comercial</h3>
              <p>Revisa ingresos, actividad reciente y tus mejores clientes en un solo panel, sin armar reportes a mano.</p>
            </div>
          </div>

          <p class="producto__cta reveal"><a href="crm.html" class="servicios__card-link">Ver todo sobre CRM <span aria-hidden="true">→</span></a></p>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="producto-panel-automatizacion" aria-labelledby="producto-tab-automatizacion" data-category-panel="automatizacion" hidden>
          <div class="section-head reveal">
            <h2 class="eyebrow">Automatización hoy</h2>
            <p class="section-head__lead">Menos tareas repetitivas, más tiempo para lo que importa.</p>
            <p>Conectamos tus herramientas para que la información fluya sola entre ellas, sin que tengas que copiarla a mano de un lado a otro.</p>
          </div>

          <div class="producto__row reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <p class="service-demo__note">Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí.</p>
            </div>
            <div class="producto__text">
              <h3>Menos tareas manuales, más tiempo para crecer</h3>
              <p><a href="automatizaciones.html">Conoce más sobre Automatización →</a></p>
            </div>
          </div>

          <p class="producto__cta reveal"><a href="automatizaciones.html" class="servicios__card-link">Ver todo sobre Automatización <span aria-hidden="true">→</span></a></p>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="producto-panel-webs" aria-labelledby="producto-tab-webs" data-category-panel="webs" hidden>
          <div class="section-head reveal">
            <h2 class="eyebrow">Webs hoy</h2>
            <p class="section-head__lead">Un sitio que trabaja para tu negocio, no al revés.</p>
            <p>Diseñamos sitios pensados para tus clientes y tus objetivos, fáciles de mantener y listos para convertir visitas en oportunidades.</p>
          </div>

          <div class="producto__row reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <p class="service-demo__note">Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí.</p>
            </div>
            <div class="producto__text">
              <h3>Sitios web que trabajan para tu negocio</h3>
              <p><a href="websites.html">Conoce más sobre Webs →</a></p>
            </div>
          </div>

          <p class="producto__cta reveal"><a href="websites.html" class="servicios__card-link">Ver todo sobre Webs <span aria-hidden="true">→</span></a></p>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="producto-panel-inventario" aria-labelledby="producto-tab-inventario" data-category-panel="inventario" hidden>
          <div class="section-head reveal">
            <h2 class="eyebrow">Inventario hoy</h2>
            <p class="section-head__lead">Lo que necesitas saber, sin tener que salir a buscarlo.</p>
            <p>Melray pone orden en lo esencial para que sepas qué tienes, qué entra y qué sale, sin hojas de cálculo eternas ni sistemas que necesitas aprender antes de poder usar</p>
          </div>

          <div class="producto__row reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <div class="producto__mockup-body producto__mockup-body--media">
                <img src="/assets/mockup-catalogo.png" alt="Captura del panel de inventario Melray mostrando la lista de productos con SKU, proveedor y stock." loading="lazy">
              </div>
            </div>
            <div class="producto__text">
              <h3>Todo tu catálogo. En un solo lugar</h3>
              <p>Organiza tus productos de forma clara, con la información que realmente necesitas. Sin campos porque sí.</p>
            </div>
          </div>

          <div class="producto__row producto__row--reverse reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <div class="producto__mockup-body producto__mockup-body--media producto__mockup-body--media-movimientos">
                <img src="/assets/mockup-movimientos.png" alt="Captura del panel de inventario Melray mostrando los productos más vendidos y los productos sin movimiento." loading="lazy">
              </div>
            </div>
            <div class="producto__text">
              <h3>Cada movimiento, bajo control</h3>
              <p>Registra entradas y salidas en segundos y mantén tu inventario actualizado mientras tu negocio se mueve.</p>
            </div>
          </div>

          <div class="producto__row reveal">
            <div class="producto__mockup">
              <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
              <div class="producto__mockup-body producto__mockup-body--media">
                <img src="/assets/mockup-consulta.png" alt="Captura del panel de inventario Melray mostrando el resumen de stock: total de productos, listos para vender y porcentaje disponible." loading="lazy">
              </div>
            </div>
            <div class="producto__text">
              <h3>Lo que tienes. Cuando necesitas saberlo</h3>
              <p>Consulta tu stock actual sin buscar archivos, revisar anotaciones o preguntarte cuándo fue la última vez que alguien actualizó el Excel.</p>
            </div>
          </div>

          <p class="section-closing reveal"><strong>Menos tiempo gestionando. Más tiempo haciendo crecer tu negocio.</strong></p>
          <p class="producto__cta reveal"><a href="inventario.html" class="servicios__card-link">Ver todo sobre Paneles/Inventarios <span aria-hidden="true">→</span></a></p>
        </div>
      </div>
    </section>
    <!-- /SECTION:PRODUCTO -->
```

- [ ] **Step 2: Verify in the browser**

Start `melray-static` preview, open `http://localhost:4173/#producto`.
- Confirm the CRM tab is active by default and shows 3 rows with the new screenshots.
- Click "Automatización" — confirm it shows the placeholder row and the eyebrow/lead change to "Automatización hoy".
- Click "Webs" and "Paneles/Inventarios" — confirm each shows its own content (Paneles/Inventarios should look identical to what the section looked like before this task).
- With a tab focused, press the right/left arrow keys — confirm focus and active panel move between tabs.
- Check the browser console for errors (`read_console_messages`).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add category tabs to Producto section (CRM, Automatización, Webs, Inventario)"
```

---

### Task 8: Restructure "Planes" section into category panels + CRM pricing

**Files:**
- Modify: `index.html` (`<!-- SECTION:PLANES -->` … `<!-- /SECTION:PLANES -->`)
- Modify: `js/main.js` (`PLAN_DETAILS`)

**Interfaces:**
- Consumes: `.category-nav` CSS/JS (Tasks 5–6), `.planes__single` (Task 5), existing `initPlanModal()`/`PLAN_DETAILS` mechanism.
- Produces: three new `PLAN_DETAILS` keys (`crm-basico`, `crm-intermedio`, `crm-completo`) consumed by the modal.

- [ ] **Step 1: Extend `PLAN_DETAILS` in `js/main.js`**

Add these three entries inside the `PLAN_DETAILS` object (after `pro: { ... },` and before the closing `};`):

```js
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
```

- [ ] **Step 2: Replace the `<!-- SECTION:PLANES -->` grid markup in `index.html`**

Replace the `<div class="planes__grid">...</div>` block (the one directly inside `<section class="planes" id="planes">`, containing the Básico/Intermedio/Pro cards) with the category nav + 4 panels. The `<dialog class="plan-modal" ...>` block that follows stays exactly as-is, untouched, still a direct child of `<section class="planes" id="planes">` after the panels.

```html
        <div class="category-nav" role="tablist" aria-label="Categorías de planes">
          <button type="button" class="category-nav__tab" role="tab" id="planes-tab-crm" aria-selected="true" aria-controls="planes-panel-crm" data-category="crm">CRM</button>
          <button type="button" class="category-nav__tab" role="tab" id="planes-tab-automatizacion" aria-selected="false" aria-controls="planes-panel-automatizacion" data-category="automatizacion" tabindex="-1">Automatización</button>
          <button type="button" class="category-nav__tab" role="tab" id="planes-tab-webs" aria-selected="false" aria-controls="planes-panel-webs" data-category="webs" tabindex="-1">Webs</button>
          <button type="button" class="category-nav__tab" role="tab" id="planes-tab-inventario" aria-selected="false" aria-controls="planes-panel-inventario" data-category="inventario" tabindex="-1">Paneles/Inventarios</button>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="planes-panel-crm" aria-labelledby="planes-tab-crm" data-category-panel="crm">
          <div class="planes__grid">
            <article class="plan-card reveal">
              <h3>Básico</h3>
              <p class="plan-card__desc">Todo lo que necesitas para organizar a tus clientes y no perder ninguna oportunidad.</p>
              <ul class="plan-card__teaser">
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Ficha de contacto por cliente</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Pipeline visual por estados</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Búsqueda y filtro de contactos</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Vista de pipeline y de tabla</li>
              </ul>
              <button type="button" class="plan-card__more" data-plan="crm-basico">
                Ver todo lo incluido
                <svg class="plan-card__more-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="plan-card__footer">
                <p class="plan-card__price">997 €<span class="plan-card__price-note">Valor de implementación</span></p>
                <a href="https://sarayortizcordero.github.io/CRM-Basico/" class="btn btn--secondary" target="_blank" rel="noopener">Ver demo en acción</a>
              </div>
            </article>

            <article class="plan-card plan-card--highlight reveal">
              <p class="plan-card__badge">
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="currentColor"/></svg>
                Más elegido
              </p>
              <h3>Intermedio</h3>
              <p class="plan-card__desc">Más contexto de cada cliente para no perder seguimiento de ninguna oportunidad.</p>
              <ul class="plan-card__teaser">
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Todo lo incluido en Básico</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Historial de actividad por contacto</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Checklist de tareas por oportunidad</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Valor estimado por trato</li>
              </ul>
              <button type="button" class="plan-card__more" data-plan="crm-intermedio">
                Ver todo lo incluido
                <svg class="plan-card__more-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="plan-card__footer">
                <p class="plan-card__price">1.600 €<span class="plan-card__price-note">Valor de implementación</span></p>
                <a href="https://sarayortizcordero.github.io/CRM-Intermedio/" class="btn btn--primary" target="_blank" rel="noopener">Ver demo en acción</a>
              </div>
            </article>

            <article class="plan-card reveal">
              <h3>Completo</h3>
              <p class="plan-card__desc">Visión completa de tu actividad comercial, con reportes y automatizaciones incluidas.</p>
              <ul class="plan-card__teaser">
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Todo lo incluido en Básico e Intermedio</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Dashboard con ingresos y actividad</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Reportes de rendimiento comercial</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Gestión de empresas y documentos</li>
              </ul>
              <button type="button" class="plan-card__more" data-plan="crm-completo">
                Ver todo lo incluido
                <svg class="plan-card__more-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="plan-card__footer">
                <p class="plan-card__price">A medida<span class="plan-card__price-note">Cotización según tu negocio</span></p>
                <a href="https://sarayortizcordero.github.io/CRM-Completo/" class="btn btn--secondary" target="_blank" rel="noopener">Ver demo en acción</a>
              </div>
            </article>
          </div>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="planes-panel-automatizacion" aria-labelledby="planes-tab-automatizacion" data-category-panel="automatizacion" hidden>
          <div class="planes__single">
            <article class="plan-card reveal">
              <h3>Cotización a medida</h3>
              <p class="plan-card__desc">Cada proyecto de automatización es distinto — conversemos sobre el tuyo.</p>
              <div class="plan-card__footer">
                <p class="plan-card__price">A medida<span class="plan-card__price-note">Cotización según tu negocio</span></p>
                <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar cotización</a>
              </div>
            </article>
          </div>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="planes-panel-webs" aria-labelledby="planes-tab-webs" data-category-panel="webs" hidden>
          <div class="planes__single">
            <article class="plan-card reveal">
              <h3>Cotización a medida</h3>
              <p class="plan-card__desc">Cada proyecto de un sitio web es distinto — conversemos sobre el tuyo.</p>
              <div class="plan-card__footer">
                <p class="plan-card__price">A medida<span class="plan-card__price-note">Cotización según tu negocio</span></p>
                <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar cotización</a>
              </div>
            </article>
          </div>
        </div>

        <div class="category-nav__panel" role="tabpanel" id="planes-panel-inventario" aria-labelledby="planes-tab-inventario" data-category-panel="inventario" hidden>
          <div class="planes__grid">
            <article class="plan-card reveal">
              <h3>Básico</h3>
              <p class="plan-card__desc">Todo lo que necesitas para dejar de adivinar y empezar a tener el control de tu negocio.</p>
              <ul class="plan-card__teaser">
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Catálogo de productos organizado</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Entradas y salidas en segundos</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Stock actualizado por producto</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Historial de movimientos</li>
              </ul>
              <button type="button" class="plan-card__more" data-plan="basico">
                Ver todo lo incluido
                <svg class="plan-card__more-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="plan-card__footer">
                <p class="plan-card__price">997 €<span class="plan-card__price-note">Valor de implementación</span></p>
                <a href="https://panel-basico.vercel.app/" class="btn btn--secondary" target="_blank" rel="noopener">Ver demo en acción</a>
              </div>
            </article>

            <article class="plan-card plan-card--highlight reveal">
              <p class="plan-card__badge">
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="currentColor"/></svg>
                Más elegido
              </p>
              <h3>Intermedio</h3>
              <p class="plan-card__desc">Más funcionalidades para entender cómo se está moviendo tu inventario.</p>
              <ul class="plan-card__teaser">
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Todo lo incluido en Básico</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Productos más vendidos</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Información y datos de proveedores</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Planificación de reposiciones</li>
              </ul>
              <button type="button" class="plan-card__more" data-plan="intermedio">
                Ver todo lo incluido
                <svg class="plan-card__more-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="plan-card__footer">
                <p class="plan-card__price">1.600 €<span class="plan-card__price-note">Valor de implementación</span></p>
                <a href="https://panel-intermedio.vercel.app/" class="btn btn--primary" target="_blank" rel="noopener">Ver demo en acción</a>
              </div>
            </article>

            <article class="plan-card reveal">
              <h3>Pro</h3>
              <p class="plan-card__desc">Una visión financiera completa para gestionar y anticiparte.</p>
              <ul class="plan-card__teaser">
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Todo lo incluido en Básico e Intermedio</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Costes y rentabilidad por producto</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Predicciones y recomendaciones con IA</li>
                <li><span class="plan-card__teaser-icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Automatización de procesos</li>
              </ul>
              <button type="button" class="plan-card__more" data-plan="pro">
                Ver todo lo incluido
                <svg class="plan-card__more-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="plan-card__footer">
                <p class="plan-card__price">A medida<span class="plan-card__price-note">Cotización según tu negocio</span></p>
                <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--secondary" target="_blank" rel="noopener">Agendar cotización</a>
              </div>
            </article>
          </div>
        </div>
```

- [ ] **Step 3: Verify in the browser**

Start `melray-static` preview, open `http://localhost:4173/#planes`.
- Confirm CRM's 3 plan cards show by default (997 €/1.600 €/A medida).
- Click each CRM card's "Ver todo lo incluido" — confirm the modal opens with the right title/features/price/CTA, and the CTA link points to the matching `sarayortizcordero.github.io` URL.
- Click "Automatización" and "Webs" tabs — confirm each shows a single centered "Cotización a medida" card.
- Click "Paneles/Inventarios" — confirm the 3 original inventory cards still work exactly as before (including their own "Ver todo lo incluido" modal).

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: add category tabs to Planes section with CRM pricing tiers"
```

---

### Task 9: Full verification pass

**Files:**
- None (verification only — fix forward in the relevant file if something fails).

- [ ] **Step 1: Desktop pass**

Start `melray-static` preview at `http://localhost:4173/`. Walk the whole page top to bottom: hero copy, Servicios card order, Producto tabs (all 4), Planes tabs (all 4, including CRM modal), footer. Check `read_console_messages` for errors after each interaction.

- [ ] **Step 2: Mobile pass**

`resize_window` to the `mobile` preset (375×812). Repeat the walk-through: confirm the category-nav tabs wrap/scroll sensibly and don't overlap other content, confirm the Servicios grid is 1 column, confirm tapping a tab still works (touch = click).

- [ ] **Step 3: Keyboard pass**

Tab to the Producto category-nav with the keyboard, use arrow keys to move between tabs, confirm focus and `aria-selected` move together and the visible panel updates. Repeat for the Planes category-nav.

- [ ] **Step 4: Cross-page links**

From `index.html`, click through to `crm.html`, `automatizaciones.html`, `websites.html`, `inventario.html` and back (via "Volver a Melray"). Confirm all header nav links and the "Ver todo sobre..." links from Task 7 resolve correctly.

- [ ] **Step 5: Fix any issues found**

If any step above fails, fix it in the relevant file (`index.html`, `css/styles.css`, or `js/main.js`) and re-run that step until it passes. Commit each fix separately with a `fix:` message.

- [ ] **Step 6: Final commit**

If Steps 1–4 all passed with no fixes needed, no commit is required for this task — it's a verification-only pass.
