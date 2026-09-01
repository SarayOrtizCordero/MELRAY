# Páginas de Servicio (CRM, Websites, Automatizaciones) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the three services shown in `#servicios` (Websites, CRM, Automatizaciones) its own static page (`websites.html`, `crm.html`, `automatizaciones.html`) with a hero, a "qué incluye" list, a placeholder demo block, and a quote-booking CTA — linked from a new "Ver X →" link on each `#servicios` card in `index.html`.

**Architecture:** Three new static HTML files at the project root, each reusing the same header/footer markup already used by `index.html`/`privacidad.html` (full nav, pointing back to `index.html#...` anchors) plus four new page-specific sections (`service-hero`, `service-features`, `service-demo`, `service-cta`). One shared CSS block in `css/styles.css` (added in Task 1, reused by Tasks 2–3) plus a small addition to the existing `.servicios__card` CSS for the new card links. No JS changes — `js/main.js`'s existing handlers (`initScrollReveal`, `initHeaderScroll`, `initMobileNav`, `initFooterYear`) already work generically on IDs/classes present on these new pages.

**Tech Stack:** Plain HTML5, CSS3 (existing custom properties in `css/styles.css`), no new JS, no build tools. Verification via the Browser pane preview tools against the `melray-static` config in `.claude/launch.json` (`npx serve -l 4173 .`).

## Global Constraints

- No build tools, frameworks, or new dependencies — plain HTML/CSS only, matching the rest of the site (spec §2, §6).
- Reuse existing design tokens from `css/styles.css` `:root` only (`--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`) — no new hardcoded colors/fonts (spec §6).
- New CSS gets its own namespaced classes (`.service-hero`, `.service-features`, `.service-demo`, `.service-cta`, `.service-back`) — do not reuse or rename `.hero`/`.producto`/etc. from the home page, per the site's convention of one class family per section (spec §6).
- No prices/figures anywhere on these pages — every CTA is "Agendar una demo" or "Agendar cotización" linking to `https://calendly.com/charladeclaridad/demo-melray` (spec §2, §3).
- The demo block is a placeholder only — must contain the exact note text "Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí." and the HTML comment `<!-- DEMO: sustituir por capturas/vídeo reales -->` immediately above the frame markup, so it's easy to find later (spec §3 step 4).
- Full header, matching `index.html`'s nav/CTA/mobile-menu markup verbatim, except: the logo links to `index.html` (not `#top`) and the three nav items link to `index.html#producto`, `index.html#planes`, `index.html#servicios` (not bare `#producto` etc., since these are separate pages) (spec §3 step 1).
- Footer identical to the one in `index.html`/`privacidad.html` (same legal links, same copyright line, same `#footer-year` span for `initFooterYear()`).
- Every reveal-animated block (`service-hero__inner`, `service-features__grid`, `service-demo__frame`, `service-cta__card`) carries the `.reveal` class, matching the rest of the site's scroll-reveal pattern — no changes to `js/main.js` (spec §6).
- `.service-features__grid` is 2 columns on desktop, 1 column at the existing 860px breakpoint (spec §6).
- Each page has its own `<title>`, `<meta name="description">`, `<link rel="canonical">`, and Open Graph tags — no shared/duplicate metadata across pages (spec §4).
- Copy (H1, subtitle, "qué incluye" items) must match spec §4 exactly — do not paraphrase.
- Do not modify `#producto`, `#planes`, or `#producto`'s sibling sections in `index.html` — only the three `.servicios__card` blocks change there. Do not modify `privacidad.html`, `terminos.html`, `cookies.html`, or `js/main.js`.

---

### Task 1: Websites page (`websites.html`) + shared service-page CSS + card link

**Files:**
- Create: `websites.html`
- Modify: `css/styles.css` (new `/* ===== Service pages ===== */` block after the `@media (min-width: 861px) { .servicios__closing { max-width: 900px; } }` rule and before `/* ===== Footer ===== */`; new `.servicios__card-link` rule inside the existing `/* ===== Servicios ===== */` block)
- Modify: `index.html` (Websites card in `#servicios`)

**Interfaces:**
- Produces (CSS classes, consumed by Tasks 2 and 3): `.service-back`, `.service-hero`, `.service-hero__inner`, `.service-hero__subtitle`, `.service-features`, `.service-features__grid`, `.service-features__item`, `.service-features__icon`, `.service-demo`, `.service-demo__frame`, `.service-demo__bar`, `.service-demo__note`, `.service-cta`, `.service-cta__card`, `.servicios__card-link`.

- [ ] **Step 1: Add the shared service-page CSS block**

Read `css/styles.css` first, then find:

```css
@media (min-width: 861px) {
  .servicios__closing { max-width: 900px; }
}

/* ===== Footer ===== */
```

and replace it with:

```css
@media (min-width: 861px) {
  .servicios__closing { max-width: 900px; }
}

/* ===== Service pages (Websites/CRM/Automatizaciones) ===== */
.service-back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  padding: var(--space-4) 0 0;
}
.service-back:hover { color: var(--color-orange-dark); }

.service-hero { padding: var(--space-7) 0 var(--space-6); text-align: center; }
.service-hero__inner {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
.service-hero__subtitle { font-size: 1.15rem; max-width: 46ch; }

.service-features { padding: var(--space-6) 0; }
.service-features__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3) var(--space-5);
  max-width: 760px;
  margin: 0 auto;
}
.service-features__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--color-text);
}
.service-features__icon {
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
.service-features__icon svg { width: 10px; height: 10px; }

.service-demo { padding: var(--space-6) 0; }
.service-demo__frame {
  max-width: 760px;
  margin: 0 auto;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.service-demo__bar {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border-bottom: 1px solid rgba(44, 26, 18, 0.08);
}
.service-demo__bar span {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgba(44, 26, 18, 0.15);
}
.service-demo__note {
  padding: var(--space-8) var(--space-5);
  text-align: center;
  color: var(--color-text-muted);
}

.service-cta { padding: var(--space-6) 0 var(--space-8); }
.service-cta__card {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

@media (max-width: 860px) {
  .service-features__grid { grid-template-columns: 1fr; }
}

/* ===== Footer ===== */
```

- [ ] **Step 2: Add the `.servicios__card-link` rule**

Find:

```css
.servicios__card h3 { margin-bottom: var(--space-3); }
```

and replace it with:

```css
.servicios__card h3 { margin-bottom: var(--space-3); }
.servicios__card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--color-orange-dark);
  transition: gap var(--transition-base), color var(--transition-base);
}
.servicios__card-link:hover { color: var(--color-red); gap: 9px; }
```

- [ ] **Step 3: Create `websites.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Websites — Melray</title>
  <meta name="description" content="Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos. Conoce el servicio de websites de Melray.">
  <link rel="canonical" href="https://melraysystems.com/websites.html">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="Websites — Melray">
  <meta property="og:description" content="Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.">
  <meta property="og:url" content="https://melraysystems.com/websites.html">
  <meta property="og:image" content="https://melraysystems.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Websites — Melray">
  <meta name="twitter:description" content="Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.">

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
          <li><a href="index.html#producto">Inventario</a></li>
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
      <a href="index.html" class="service-back">← Volver a Melray</a>
    </div>

    <!-- SECTION:SERVICE-HERO -->
    <section class="service-hero">
      <div class="container service-hero__inner reveal">
        <h1>Sitios web que trabajan para tu negocio</h1>
        <p class="service-hero__subtitle">Diseñamos y desarrollamos webs pensadas para tu negocio, tu cliente y tus objetivos — no plantillas genéricas.</p>
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
            Diseño a medida para tu marca
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Optimizadas para velocidad y conversión
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Adaptadas a móvil desde el día uno
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            SEO técnico y estructura pensada para buscadores
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Integración con tus herramientas (calendario, CRM, pagos)
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Mantenimiento y soporte post-lanzamiento
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
        <!-- DEMO: sustituir por capturas/vídeo reales -->
        <div class="service-demo__frame reveal">
          <div class="service-demo__bar"><span></span><span></span><span></span></div>
          <p class="service-demo__note">Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí.</p>
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

- [ ] **Step 4: Add the "Ver Websites →" link to the Websites card in `index.html`**

Read `index.html` first, then find:

```html
          <article class="servicios__card reveal">
            <h3>Websites</h3>
            <p>Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.</p>
          </article>
```

and replace it with:

```html
          <article class="servicios__card reveal">
            <h3>Websites</h3>
            <p>Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.</p>
            <a href="websites.html" class="servicios__card-link">Ver Websites →</a>
          </article>
```

- [ ] **Step 5: Verify visually (desktop)**

Use the Browser pane: `preview_start` with `{name: "melray-static"}`, then `navigate` to `http://localhost:4173/websites.html`. Take a screenshot.

Expected: full header (Inventario/Planes/Servicios nav + "Agendar una demo" CTA), "← Volver a Melray" link below it, hero with H1 "Sitios web que trabajan para tu negocio", a 2-column grid of 6 checked features, a demo placeholder card with the "Estamos preparando…" note, a closing CTA card "¿Quieres ver cómo lo hacemos?", and the same footer as the rest of the site.

Check `read_console_messages` with `onlyErrors: true` — expected: no errors (confirms `main.js`'s guarded functions don't throw on this page's DOM).

- [ ] **Step 6: Verify visually (mobile) and check navigation round-trip**

`resize_window` to `preset: "mobile"`, reload, screenshot. Expected: header collapses to hamburger menu (open it to confirm the 3 nav items + CTA appear), features grid stacks to 1 column.

Then verify the round-trip: `navigate` to `http://localhost:4173/index.html#servicios`, `find` the "Ver Websites →" link, click it, confirm the URL is now `.../websites.html`. Click "← Volver a Melray", confirm it lands back on `index.html`.

Use `get_page_text` on `websites.html` and confirm these exact strings are present:
- "Sitios web que trabajan para tu negocio"
- "Diseño a medida para tu marca"
- "Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí."
- "¿Quieres ver cómo lo hacemos?"

- [ ] **Step 7: Commit**

```bash
git add websites.html css/styles.css index.html
git commit -m "feat: add websites.html service page with link from servicios card"
```

---

### Task 2: CRM page (`crm.html`) + card link

**Files:**
- Create: `crm.html`
- Modify: `index.html` (CRM card in `#servicios`)

**Interfaces:**
- Consumes (from Task 1): `.service-back`, `.service-hero`, `.service-hero__inner`, `.service-hero__subtitle`, `.service-features`, `.service-features__grid`, `.service-features__item`, `.service-features__icon`, `.service-demo`, `.service-demo__frame`, `.service-demo__bar`, `.service-demo__note`, `.service-cta`, `.service-cta__card`, `.servicios__card-link`.

- [ ] **Step 1: Create `crm.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRM — Melray</title>
  <meta name="description" content="Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado. Conoce el CRM de Melray.">
  <link rel="canonical" href="https://melraysystems.com/crm.html">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="CRM — Melray">
  <meta property="og:description" content="Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.">
  <meta property="og:url" content="https://melraysystems.com/crm.html">
  <meta property="og:image" content="https://melraysystems.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="CRM — Melray">
  <meta name="twitter:description" content="Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.">

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
          <li><a href="index.html#producto">Inventario</a></li>
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
      <a href="index.html" class="service-back">← Volver a Melray</a>
    </div>

    <!-- SECTION:SERVICE-HERO -->
    <section class="service-hero">
      <div class="container service-hero__inner reveal">
        <h1>Un CRM simple para no perder ni un cliente</h1>
        <p class="service-hero__subtitle">Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
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
            Ficha única por cliente con todo su historial
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Seguimiento de oportunidades y su estado
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Recordatorios para no dejar nada en el aire
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Vista clara de tu pipeline comercial
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Integración con tus canales de contacto
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Reportes simples de tu actividad comercial
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
        <!-- DEMO: sustituir por capturas/vídeo reales -->
        <div class="service-demo__frame reveal">
          <div class="service-demo__bar"><span></span><span></span><span></span></div>
          <p class="service-demo__note">Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí.</p>
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

- [ ] **Step 2: Add the "Ver CRM →" link to the CRM card in `index.html`**

Find:

```html
          <article class="servicios__card reveal">
            <h3>CRM</h3>
            <p>Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
          </article>
```

and replace it with:

```html
          <article class="servicios__card reveal">
            <h3>CRM</h3>
            <p>Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
            <a href="crm.html" class="servicios__card-link">Ver CRM →</a>
          </article>
```

- [ ] **Step 3: Verify visually (desktop + mobile) and navigation round-trip**

Same procedure as Task 1 Step 5–6, targeting `http://localhost:4173/crm.html`. Expected H1: "Un CRM simple para no perder ni un cliente". Confirm `read_console_messages` shows no errors, the mobile features grid stacks to 1 column, and clicking "Ver CRM →" from `index.html#servicios` navigates to `crm.html` and "← Volver a Melray" returns to `index.html`.

`get_page_text` must include:
- "Un CRM simple para no perder ni un cliente"
- "Ficha única por cliente con todo su historial"
- "Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí."

- [ ] **Step 4: Commit**

```bash
git add crm.html index.html
git commit -m "feat: add crm.html service page with link from servicios card"
```

---

### Task 3: Automatizaciones page (`automatizaciones.html`) + card link

**Files:**
- Create: `automatizaciones.html`
- Modify: `index.html` (Automatizaciones card in `#servicios`)

**Interfaces:**
- Consumes (from Task 1): same CSS classes as Task 2.

- [ ] **Step 1: Create `automatizaciones.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Automatizaciones — Melray</title>
  <meta name="description" content="Conectamos tus herramientas y automatizamos procesos para reducir el trabajo repetitivo. Conoce el servicio de automatizaciones de Melray.">
  <link rel="canonical" href="https://melraysystems.com/automatizaciones.html">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="Automatizaciones — Melray">
  <meta property="og:description" content="Conectamos tus herramientas y automatizamos procesos para reducir el trabajo repetitivo.">
  <meta property="og:url" content="https://melraysystems.com/automatizaciones.html">
  <meta property="og:image" content="https://melraysystems.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Automatizaciones — Melray">
  <meta name="twitter:description" content="Conectamos tus herramientas y automatizamos procesos para reducir el trabajo repetitivo.">

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
          <li><a href="index.html#producto">Inventario</a></li>
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
      <a href="index.html" class="service-back">← Volver a Melray</a>
    </div>

    <!-- SECTION:SERVICE-HERO -->
    <section class="service-hero">
      <div class="container service-hero__inner reveal">
        <h1>Menos tareas manuales, más tiempo para crecer</h1>
        <p class="service-hero__subtitle">Conectamos tus herramientas y automatizamos procesos para reducir el trabajo repetitivo.</p>
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
            Conexión entre las herramientas que ya usas
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Automatización de tareas repetitivas
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Notificaciones y alertas automáticas
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Flujos a medida según tu operación
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Reducción de errores manuales
          </li>
          <li class="service-features__item">
            <span class="service-features__icon"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Escalable a medida que crece tu negocio
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
        <!-- DEMO: sustituir por capturas/vídeo reales -->
        <div class="service-demo__frame reveal">
          <div class="service-demo__bar"><span></span><span></span><span></span></div>
          <p class="service-demo__note">Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí.</p>
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

- [ ] **Step 2: Add the "Ver Automatizaciones →" link to the Automatizaciones card in `index.html`**

Find:

```html
          <article class="servicios__card reveal">
            <h3>Automatizaciones</h3>
            <p>Conectamos herramientas y automatizamos procesos para reducir tareas manuales y hacer tus operaciones más eficientes.</p>
          </article>
```

and replace it with:

```html
          <article class="servicios__card reveal">
            <h3>Automatizaciones</h3>
            <p>Conectamos herramientas y automatizamos procesos para reducir tareas manuales y hacer tus operaciones más eficientes.</p>
            <a href="automatizaciones.html" class="servicios__card-link">Ver Automatizaciones →</a>
          </article>
```

- [ ] **Step 3: Verify visually (desktop + mobile) and navigation round-trip**

Same procedure as Task 1 Step 5–6, targeting `http://localhost:4173/automatizaciones.html`. Expected H1: "Menos tareas manuales, más tiempo para crecer". Confirm `read_console_messages` shows no errors, the mobile features grid stacks to 1 column, and clicking "Ver Automatizaciones →" from `index.html#servicios` navigates to `automatizaciones.html` and "← Volver a Melray" returns to `index.html`.

`get_page_text` must include:
- "Menos tareas manuales, más tiempo para crecer"
- "Conexión entre las herramientas que ya usas"
- "Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí."

- [ ] **Step 4: Final full-site check**

Reload `http://localhost:4173/index.html#servicios`, screenshot the Servicios section: all 3 cards now show their "Ver X →" link. Click through all 3 links (Websites, CRM, Automatizaciones) and confirm each lands on the right page with no console errors.

- [ ] **Step 5: Commit**

```bash
git add automatizaciones.html index.html
git commit -m "feat: add automatizaciones.html service page with link from servicios card"
```

---

## Self-Review Notes

- **Spec coverage:** Page skeleton (spec §3) → each task's Step 1 (header/back-link/hero/features/demo/cta/footer, identical structure). Content per page (spec §4) → Task 1/2/3 Step 1 (exact H1/subtitle/features copy, page-specific meta/OG/canonical). Card links (spec §5) → Task 1/2/3's card-edit step. CSS namespacing/tokens/breakpoint/reuse of `.btn`/`.plan-card__teaser-icon`-style check icon (spec §6) → Task 1 Steps 1–2. Placeholder demo note + HTML comment (spec §3 step 4, §6) → present verbatim in every page's SERVICE-DEMO section.
- **Placeholder scan:** No TBD/TODO. The only intentionally-unfinished content is the demo block, which is explicitly in scope as a placeholder per the spec (not a plan gap) and is marked as such in the page itself.
- **Type/consistency check:** All `.service-*` classes used in Tasks 2–3's HTML (`.service-back`, `.service-hero__inner`, `.service-features__grid`, `.service-features__item`, `.service-features__icon`, `.service-demo__frame`, `.service-demo__bar`, `.service-demo__note`, `.service-cta__card`) match exactly what Task 1 Step 1 defines in CSS — no naming drift. `.servicios__card-link` used in all three card-edit steps matches the single definition in Task 1 Step 2.
