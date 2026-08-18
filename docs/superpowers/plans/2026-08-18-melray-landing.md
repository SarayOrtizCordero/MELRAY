# Melray Landing Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the Melray marketing/landing website — a single-page static site (plus 3 legal pages) presenting the product, plans, brand personality and a contact path for leads.

**Architecture:** Fully static HTML5 + CSS3 + vanilla JS, no build tools or frameworks. One `index.html` landing page built up section by section, shared header/footer markup duplicated across 3 legal pages, self-hosted fonts, inline SVG mascot artwork, deployed to Vercel as a static site.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox, `prefers-reduced-motion`), vanilla JS (`IntersectionObserver`, `fetch`), Formspree (external form endpoint), self-hosted Inter & Open Sans (woff2), Vercel (static hosting).

## Global Constraints

- Only **Regular (400) weight** for both Inter and Open Sans — the brand doc specifies "Inter Regular" and "Open Sans Regular" only. Build visual hierarchy with size/spacing/color, not heavier weights. Do not download or reference 600/700 weight font files.
- Brand palette only — no colors outside `#fb7b15`, `#df3314`, `#b11e1b`, `#faf1e7`, `#f8f4e9`, plus a dark warm neutral for text and white: no blue/purple/yellow accents.
- Idioma: español de España en todo el contenido visible al usuario. Microcopy con spanglish de marca permitido solo donde el spec lo indica (estados de la mascota, CTAs puntuales), nunca en contenido legal.
- No frameworks, no npm packages, no build step. Every file must run by being opened/served as plain static HTML/CSS/JS.
- All interactive JS must degrade gracefully and respect `prefers-reduced-motion: reduce`.
- No fabricated photos of the founders — illustrated/initials avatars only.
- Never create the Formspree account on the user's behalf — the endpoint stays a clearly-marked placeholder until the user supplies their real one.

---

## File Structure

```
/
├── index.html
├── privacidad.html
├── terminos.html
├── cookies.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── favicon.svg
└── fonts/
    ├── inter/inter-400.woff2
    └── open-sans/open-sans-400.woff2
```

- `css/styles.css` — single stylesheet: design tokens, reset, layout, components, animations, responsive rules. Grows task by task, organized in clearly commented blocks per section.
- `js/main.js` — single script, one `init*()` function per behavior, all wired from one `DOMContentLoaded` listener at the bottom.
- `index.html` — grows section by section; each section is inserted after a unique HTML marker comment (`<!-- SECTION:NAME -->`) so later tasks can locate insertion points with `Edit`.
- `privacidad.html` / `terminos.html` / `cookies.html` — built once in Task 10, reusing the final header/footer markup from `index.html`.

---

### Task 1: Scaffold, design tokens, self-hosted fonts, SEO head

**Files:**
- Create: `css/styles.css`
- Create: `fonts/inter/inter-400.woff2`
- Create: `fonts/open-sans/open-sans-400.woff2`
- Create: `assets/favicon.svg`
- Create: `index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`

**Interfaces:**
- Produces: CSS custom properties (`--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--container-width`, `--transition-base`) that every later task's CSS relies on. Produces marker comments in `index.html`: `<!-- SECTION:HEADER -->`, `<!-- SECTION:HERO -->`, `<!-- SECTION:PROBLEMA -->`, `<!-- SECTION:PRODUCTO -->`, `<!-- SECTION:PLANES -->`, `<!-- SECTION:MASCOTA -->`, `<!-- SECTION:NOSOTRAS -->`, `<!-- SECTION:CONTACTO -->`, `<!-- SECTION:FOOTER -->`, each immediately followed by `<!-- /SECTION:NAME -->`.

- [ ] **Step 1: Create folder structure**

```bash
mkdir -p css js assets fonts/inter fonts/open-sans
```

- [ ] **Step 2: Download self-hosted fonts (Regular 400 only)**

```bash
curl -fL -o fonts/inter/inter-400.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2"
curl -fL -o fonts/open-sans/open-sans-400.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-400-normal.woff2"
ls -la fonts/inter fonts/open-sans
```

Expected: both files exist and are non-trivial size (Inter ~15-30KB, Open Sans ~20-40KB typical for a single latin woff2). If either `curl` fails (non-zero exit / 0 bytes), retry once; if it still fails, fall back to downloading the same files manually from https://fonts.google.com/specimen/Inter and https://fonts.google.com/specimen/Open+Sans (Regular weight, woff2) and place them at the same paths before continuing.

- [ ] **Step 3: Write `css/styles.css` — tokens, reset, base typography**

```css
/* ===== Melray design tokens ===== */
:root {
  --color-orange-light: #fb7b15;
  --color-orange-dark: #df3314;
  --color-red: #b11e1b;
  --color-bg: #faf1e7;
  --color-bg-alt: #f8f4e9;
  --color-card: #ffffff;
  --color-text: #2c1a12;
  --color-text-muted: #6b5748;
  --color-white: #ffffff;

  --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --space-7: 4.5rem;
  --space-8: 6rem;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 28px;
  --radius-full: 999px;

  --shadow-sm: 0 2px 8px rgba(177, 30, 27, 0.08);
  --shadow-md: 0 12px 32px rgba(177, 30, 27, 0.14);

  --container-width: 1160px;
  --transition-base: 200ms ease;
  --header-height: 76px;
}

/* ===== Fonts (Regular 400 only — brand spec) ===== */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/open-sans/open-sans-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body, h1, h2, h3, p, figure { margin: 0; }
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; background: none; }
ul { list-style: none; margin: 0; padding: 0; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ===== Base typography ===== */
body {
  font-family: var(--font-body);
  font-weight: 400;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  font-size: 1rem;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 400;
  color: var(--color-text);
  line-height: 1.15;
}

h1 { font-size: clamp(2.25rem, 4.5vw, 3.75rem); letter-spacing: -0.02em; }
h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); letter-spacing: -0.01em; }
h3 { font-size: 1.25rem; }

p { color: var(--color-text-muted); }

.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.eyebrow {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  color: var(--color-orange-dark);
}

/* focus visibility */
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 3px solid var(--color-orange-dark);
  outline-offset: 2px;
}

.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 4: Create `assets/favicon.svg` — simple flame silhouette (no face, legible at 16px)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="favGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fb7b15"/>
      <stop offset="1" stop-color="#df3314"/>
    </linearGradient>
  </defs>
  <path fill="url(#favGrad)" d="M16 1c1 5-4 6-4 10 0-2 2-3 2-5 3 2 5 6 5 10 0 5.5-4.2 10-9 10S1 21.5 1 16c0-4 2-7 4-9-1 3 0 5 2 6-1-2-1-5 1-8 1 3 3 4 4 3-1-2-1-4 0-7 1 3 3 5 4 6z"/>
</svg>
```

- [ ] **Step 5: Write `index.html` — full head + skeleton body**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Melray — Tu inventario. Sin el caos.</title>
  <meta name="description" content="Melray es el sistema de gestión de inventario simple e inteligente para ecommerce y tiendas que todavía usan Excel o papel. Controla tu stock sin complicaciones.">
  <link rel="canonical" href="https://melray.com/">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Melray">
  <meta property="og:title" content="Melray — Tu inventario. Sin el caos.">
  <meta property="og:description" content="Gestión de inventario simple e inteligente para ecommerce y tiendas pequeñas y medianas.">
  <meta property="og:url" content="https://melray.com/">
  <meta property="og:image" content="https://melray.com/assets/favicon.svg">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Melray — Tu inventario. Sin el caos.">
  <meta name="twitter:description" content="Gestión de inventario simple e inteligente para ecommerce y tiendas pequeñas y medianas.">

  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="stylesheet" href="/css/styles.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Melray",
    "url": "https://melray.com/",
    "logo": "https://melray.com/assets/favicon.svg",
    "description": "Sistema de gestión de inventario simple e inteligente para ecommerce y tiendas pequeñas y medianas.",
    "sameAs": ["https://instagram.com/melray"]
  }
  </script>
</head>
<body>
  <!-- SECTION:HEADER -->
  <!-- /SECTION:HEADER -->

  <main>
    <!-- SECTION:HERO -->
    <!-- /SECTION:HERO -->

    <!-- SECTION:PROBLEMA -->
    <!-- /SECTION:PROBLEMA -->

    <!-- SECTION:PRODUCTO -->
    <!-- /SECTION:PRODUCTO -->

    <!-- SECTION:PLANES -->
    <!-- /SECTION:PLANES -->

    <!-- SECTION:MASCOTA -->
    <!-- /SECTION:MASCOTA -->

    <!-- SECTION:NOSOTRAS -->
    <!-- /SECTION:NOSOTRAS -->

    <!-- SECTION:CONTACTO -->
    <!-- /SECTION:CONTACTO -->
  </main>

  <!-- SECTION:FOOTER -->
  <!-- /SECTION:FOOTER -->

  <script src="/js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 6: Create `robots.txt` and `sitemap.xml`**

```
User-agent: *
Allow: /
Sitemap: https://melray.com/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://melray.com/</loc></url>
  <url><loc>https://melray.com/privacidad.html</loc></url>
  <url><loc>https://melray.com/terminos.html</loc></url>
  <url><loc>https://melray.com/cookies.html</loc></url>
</urlset>
```

- [ ] **Step 7: Verify in browser**

Open `index.html` in the Browser pane (via `preview_start` pointing at the local file, or a simple static server if `file://` blocks font/script loading — if so run `npx serve .` or `python -m http.server` from the project root and open `http://localhost:<port>/`). Confirm:
- Page loads with no console errors (`read_console_messages`).
- `document.fonts` shows Inter and Open Sans loaded (check via `javascript_tool`: `[...document.fonts].map(f => f.family)`).
- Background color of `<body>` is `#faf1e7`.
- Favicon renders in the browser tab.

- [ ] **Step 8: Commit**

```bash
git add css/styles.css fonts assets/favicon.svg index.html robots.txt sitemap.xml
git commit -m "feat: scaffold Melray landing with design tokens, fonts and SEO head"
```

---

### Task 2: Header & navigation

**Files:**
- Modify: `index.html` (insert into `SECTION:HEADER`)
- Modify: `css/styles.css` (append header block)
- Modify: `js/main.js` (create file, add `initMobileNav`, `initHeaderScroll`)

**Interfaces:**
- Consumes: design tokens from Task 1 (`--color-*`, `--space-*`, `--header-height`, `--transition-base`).
- Produces: `.site-header` component, `#mobile-menu` nav, JS functions `initMobileNav()` and `initHeaderScroll()` exported for the shared `init()` in Task 8's final wiring (each task calls its own `init*` inside a growing `DOMContentLoaded` listener — see Step 4).

- [ ] **Step 1: Insert header markup** (replace the `<!-- SECTION:HEADER --><!-- /SECTION:HEADER -->` pair in `index.html`)

```html
<!-- SECTION:HEADER -->
<header class="site-header" id="site-header">
  <div class="container site-header__inner">
    <a href="#top" class="site-header__logo" aria-label="Melray — inicio">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fb7b15"/>
            <stop offset="1" stop-color="#df3314"/>
          </linearGradient>
        </defs>
        <path fill="url(#logoGrad)" d="M16 1c1 5-4 6-4 10 0-2 2-3 2-5 3 2 5 6 5 10 0 5.5-4.2 10-9 10S1 21.5 1 16c0-4 2-7 4-9-1 3 0 5 2 6-1-2-1-5 1-8 1 3 3 4 4 3-1-2-1-4 0-7 1 3 3 5 4 6z"/>
      </svg>
      <span class="site-header__wordmark">melray</span>
    </a>

    <nav class="site-header__nav" id="primary-nav" aria-label="Navegación principal">
      <ul>
        <li><a href="#producto">Producto</a></li>
        <li><a href="#planes">Planes</a></li>
        <li><a href="#nosotras">Nosotras</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>

    <a href="#contacto" class="btn btn--primary site-header__cta">Hablar con nosotras</a>

    <button type="button" class="site-header__toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-menu">
      <span class="visually-hidden">Abrir menú</span>
      <span class="site-header__toggle-bar"></span>
      <span class="site-header__toggle-bar"></span>
      <span class="site-header__toggle-bar"></span>
    </button>
  </div>

  <nav id="mobile-menu" class="mobile-menu" aria-label="Navegación móvil" hidden>
    <ul>
      <li><a href="#producto">Producto</a></li>
      <li><a href="#planes">Planes</a></li>
      <li><a href="#nosotras">Nosotras</a></li>
      <li><a href="#contacto">Contacto</a></li>
      <li><a href="#contacto" class="btn btn--primary">Hablar con nosotras</a></li>
    </ul>
  </nav>
</header>
<!-- /SECTION:HEADER -->
```

- [ ] **Step 2: Append header + button CSS to `css/styles.css`**

```css
/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.btn--primary {
  background: var(--color-red);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}
.btn--primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn--secondary {
  background: transparent;
  color: var(--color-orange-dark);
  border: 1.5px solid var(--color-orange-dark);
}
.btn--secondary:hover { background: var(--color-orange-dark); color: var(--color-white); }

/* ===== Header ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 241, 231, 0.9);
  backdrop-filter: blur(8px);
  height: var(--header-height);
  transition: height var(--transition-base), box-shadow var(--transition-base);
}
.site-header.is-scrolled {
  height: 60px;
  box-shadow: var(--shadow-sm);
}
.site-header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-5);
}
.site-header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-right: auto;
}
.site-header__wordmark {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-text);
}
.site-header__nav ul { display: flex; gap: var(--space-5); }
.site-header__nav a { font-family: var(--font-heading); font-size: 0.95rem; }
.site-header__nav a:hover { color: var(--color-orange-dark); }
.site-header__toggle { display: none; flex-direction: column; gap: 4px; padding: var(--space-2); }
.site-header__toggle-bar { width: 22px; height: 2px; background: var(--color-text); }

.mobile-menu {
  background: var(--color-bg);
  border-top: 1px solid rgba(0,0,0,0.06);
  padding: var(--space-4);
}
.mobile-menu ul { display: flex; flex-direction: column; gap: var(--space-4); }
.mobile-menu a { font-family: var(--font-heading); font-size: 1.1rem; }

@media (max-width: 860px) {
  .site-header__nav, .site-header__cta { display: none; }
  .site-header__toggle { display: flex; }
}
```

- [ ] **Step 3: Create `js/main.js` with nav + header-scroll behavior and the shared init wiring**

```javascript
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.hidden = isOpen;
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  });
}

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
});
```

- [ ] **Step 4: Verify in browser**

Reload the page. Resize to mobile (`resize_window` preset `mobile`). Click the hamburger (`nav-toggle`): confirm `aria-expanded` flips to `"true"` and the mobile menu becomes visible (`read_page` or `find` to confirm `#mobile-menu` is no longer `hidden`). Click a mobile menu link and confirm the menu closes. Resize to desktop, scroll down 100px, confirm `.site-header` gains class `is-scrolled` (`javascript_tool`: `document.getElementById('site-header').classList.contains('is-scrolled')`).

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: add responsive header with mobile nav and scroll-shrink"
```

---

### Task 3: Hero section with animated mascot

**Files:**
- Modify: `index.html` (insert into `SECTION:HERO`)
- Modify: `css/styles.css` (append hero block)

**Interfaces:**
- Consumes: `.btn` classes and tokens from Tasks 1-2.
- Produces: `.mascot--float` and `.mascot__eye`/`.mascot__mouth` classes reused conceptually (not by exact selector) by Task 6's expression showcase — Task 6 defines its own scoped classes, no shared JS dependency.

- [ ] **Step 1: Insert hero markup**

```html
<!-- SECTION:HERO -->
<section class="hero" id="top">
  <div class="container hero__inner">
    <div class="hero__copy reveal">
      <p class="eyebrow">Gestión de inventario, sin complicaciones</p>
      <h1>Tu negocio está creciendo.<br>Tu Excel no.</h1>
      <p class="hero__subtitle">Tu inventario. Sin el caos. Melray te ayuda a controlar tu stock sin depender de hojas de cálculo ni procesos manuales.</p>
      <div class="hero__actions">
        <a href="#contacto" class="btn btn--primary">Hablar con nosotras</a>
        <a href="#planes" class="btn btn--secondary">Ver planes</a>
      </div>
    </div>

    <div class="hero__art reveal" aria-hidden="true">
      <svg class="mascot mascot--float" width="220" height="240" viewBox="0 0 200 220">
        <defs>
          <linearGradient id="heroFlameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fb7b15"/>
            <stop offset="1" stop-color="#df3314"/>
          </linearGradient>
        </defs>
        <path fill="#b11e1b" d="M150 30c6 20-10 26-10 40 12-4 18-16 18-28 10 14 14 30 10 46 20-8 28-30 20-52-4 20-14 24-20 18 8-10 6-24-4-34-2 10-8 16-14 10z"/>
        <path fill="url(#heroFlameGrad)" d="M100 10c8 30-24 34-24 58 0-10 10-18 10-28 16 12 26 34 26 56 0 30-23 54-49 54S38 126 38 96c0-22 12-40 22-50-6 16 0 28 12 34-8-12-8-28 4-44 6 16 16 22 22 16-6-12-6-24 2-42z"/>
        <ellipse class="mascot__eye" cx="70" cy="128" rx="6" ry="8" fill="#2c1a12"/>
        <ellipse class="mascot__eye" cx="102" cy="128" rx="6" ry="8" fill="#2c1a12"/>
        <path class="mascot__mouth" d="M74 148c8 8 20 8 28 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
      </svg>
    </div>
  </div>
</section>
<!-- /SECTION:HERO -->
```

- [ ] **Step 2: Append hero CSS with float animation and reduced-motion guard**

```css
/* ===== Hero ===== */
.hero { padding: var(--space-8) 0; overflow: hidden; }
.hero__inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--space-6);
  align-items: center;
}
.hero__subtitle { font-size: 1.15rem; margin-top: var(--space-3); max-width: 46ch; }
.hero__actions { display: flex; gap: var(--space-3); margin-top: var(--space-5); flex-wrap: wrap; }
.hero__art { display: flex; justify-content: center; }

.mascot--float { animation: mascotFloat 4.5s ease-in-out infinite; }
@keyframes mascotFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-14px) rotate(-1.5deg); }
}
.mascot__eye { animation: mascotBlink 5.5s ease-in-out infinite; transform-origin: center; }
@keyframes mascotBlink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@media (prefers-reduced-motion: reduce) {
  .mascot--float, .mascot__eye { animation: none; }
}

@media (max-width: 860px) {
  .hero__inner { grid-template-columns: 1fr; text-align: center; }
  .hero__actions { justify-content: center; }
  .hero__art { order: -1; }
}
```

- [ ] **Step 3: Verify in browser**

Reload, confirm the hero renders with headline, subtitle and CTAs. Zoom into the mascot SVG (`computer` action `zoom`) to confirm the flame shape and face render correctly. Confirm via `javascript_tool` that `getComputedStyle(document.querySelector('.mascot--float')).animationName` is `mascotFloat`. Toggle `prefers-reduced-motion` via `resize_window` `colorScheme`-style flag is not available for reduced-motion, so instead verify the CSS rule exists by inspecting the stylesheet text for `prefers-reduced-motion` (already covered by Task 1's global rule, which also disables this animation).

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add hero section with animated flame mascot"
```

---

### Task 4: "El problema" + "Producto hoy" sections with scroll-reveal

**Files:**
- Modify: `index.html` (insert into `SECTION:PROBLEMA` and `SECTION:PRODUCTO`)
- Modify: `css/styles.css` (append sections + `.reveal` component)
- Modify: `js/main.js` (add `initScrollReveal`)

**Interfaces:**
- Produces: `.reveal` / `.reveal--visible` classes, used by every subsequent section (Tasks 5-8 mark their containers `class="... reveal"`).
- Consumes: nothing new beyond Task 1 tokens.

- [ ] **Step 1: Insert "El problema" and "Producto hoy" markup**

```html
<!-- SECTION:PROBLEMA -->
<section class="problema" id="problema">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">¿Te suena?</p>
      <h2>Gestionar el stock no debería ser un misterio</h2>
    </div>
    <div class="problema__grid">
      <div class="problema__card reveal">
        <p class="problema__quote">"Creo que… tengo que mirar el Excel."</p>
        <p>Nadie sabe con certeza cuánto stock queda hasta que alguien abre la hoja de cálculo.</p>
      </div>
      <div class="problema__card reveal">
        <p class="problema__quote">Vendiste el último. Nadie actualizó el Excel. Again.</p>
        <p>Las ventas y el inventario real se desincronizan constantemente.</p>
      </div>
      <div class="problema__card reveal">
        <p class="problema__quote">17 unidades de algo que pensabas agotado.</p>
        <p>El stock parado en un rincón es dinero parado que nadie está viendo.</p>
      </div>
    </div>
  </div>
</section>
<!-- /SECTION:PROBLEMA -->
```

```html
<!-- SECTION:PRODUCTO -->
<section class="producto" id="producto">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Producto hoy</p>
      <h2>Lo esencial, resuelto de verdad</h2>
      <p>Melray empieza simple a propósito: lo justo para que dejes el Excel, sin curva de aprendizaje.</p>
    </div>
    <div class="producto__grid">
      <div class="producto__item reveal">
        <h3>Productos</h3>
        <p>Da de alta y organiza tu catálogo sin campos innecesarios.</p>
      </div>
      <div class="producto__item reveal">
        <h3>Entradas y salidas</h3>
        <p>Registra cada movimiento de stock en segundos.</p>
      </div>
      <div class="producto__item reveal">
        <h3>Stock actual</h3>
        <p>Sabe exactamente cuánto tienes de cada producto, siempre.</p>
      </div>
      <div class="producto__item reveal">
        <h3>Control básico</h3>
        <p>Todo lo necesario para dejar de depender de hojas sueltas.</p>
      </div>
    </div>
  </div>
</section>
<!-- /SECTION:PRODUCTO -->
```

- [ ] **Step 2: Append CSS for both sections plus the `.reveal` component**

```css
/* ===== Scroll reveal ===== */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.reveal--visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* ===== Section head ===== */
.section-head { max-width: 640px; margin: 0 auto var(--space-6); text-align: center; }
.section-head p { margin-top: var(--space-2); }

/* ===== Problema ===== */
.problema { padding: var(--space-8) 0; }
.problema__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
.problema__card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}
.problema__quote { font-family: var(--font-heading); color: var(--color-orange-dark); margin-bottom: var(--space-2); }

/* ===== Producto hoy ===== */
.producto { padding: var(--space-8) 0; background: var(--color-bg-alt); }
.producto__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.producto__item {
  padding: var(--space-4);
  border-left: 3px solid var(--color-orange-light);
}
.producto__item h3 { margin-bottom: var(--space-2); }

@media (max-width: 860px) {
  .problema__grid, .producto__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Add `initScrollReveal` to `js/main.js` and wire it into the existing init block**

```javascript
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}
```

Update the bottom of `js/main.js` to also call it:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
});
```

- [ ] **Step 4: Verify in browser**

Reload the page, confirm hero content is visible immediately (it's above the fold — check whether it needs `reveal--visible` on load; if the hero cards start hidden and never reveal because they're already in viewport, confirm the `IntersectionObserver` fires immediately for on-screen elements — this is expected default behavior). Scroll down to the "Producto hoy" grid and confirm each `.producto__item` gains class `reveal--visible` as it enters the viewport (`javascript_tool`: query `.reveal:not(.reveal--visible)` length before/after scrolling).

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: add problema/producto sections with scroll-reveal"
```

---

### Task 5: Planes section

**Files:**
- Modify: `index.html` (insert into `SECTION:PLANES`)
- Modify: `css/styles.css` (append planes block)

**Interfaces:**
- Consumes: `.btn`, `.reveal`, `.section-head` from previous tasks.

- [ ] **Step 1: Insert planes markup**

```html
<!-- SECTION:PLANES -->
<section class="planes" id="planes">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Planes</p>
      <h2>Empieza simple. Crece cuando lo necesites.</h2>
    </div>

    <div class="planes__grid">
      <article class="plan-card reveal">
        <h3>Básico</h3>
        <p class="plan-card__desc">Control esencial de inventario.</p>
        <ul class="plan-card__features">
          <li>Productos</li>
          <li>Entradas y salidas</li>
          <li>Stock actual</li>
          <li>Control básico</li>
        </ul>
        <p class="plan-card__price">Precio a consultar</p>
        <a href="#contacto" class="btn btn--secondary">Hablar con nosotras</a>
      </article>

      <article class="plan-card plan-card--highlight reveal">
        <p class="plan-card__badge">Más elegido</p>
        <h3>Intermedio</h3>
        <p class="plan-card__desc">Control + información para decidir mejor.</p>
        <ul class="plan-card__features">
          <li>Todo lo de Básico</li>
          <li>Top 5 productos más vendidos</li>
          <li>Top 5 con menos movimiento</li>
          <li>Información de proveedores</li>
        </ul>
        <p class="plan-card__price">Precio a consultar</p>
        <a href="#contacto" class="btn btn--primary">Hablar con nosotras</a>
      </article>

      <article class="plan-card plan-card--future reveal">
        <p class="plan-card__badge plan-card__badge--future">Próximamente</p>
        <h3>Pro</h3>
        <p class="plan-card__desc">Evaluación financiera del negocio.</p>
        <ul class="plan-card__features">
          <li>Costos y rentabilidad por producto</li>
          <li>Comparativas entre períodos</li>
          <li>Predicciones y recomendaciones</li>
          <li>Automatizaciones e IA</li>
        </ul>
        <p class="plan-card__price">Visión futura de Melray</p>
      </article>
    </div>
  </div>
</section>
<!-- /SECTION:PLANES -->
```

- [ ] **Step 2: Append planes CSS**

```css
/* ===== Planes ===== */
.planes { padding: var(--space-8) 0; }
.planes__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); align-items: stretch; }
.plan-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.plan-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
.plan-card--highlight { border: 2px solid var(--color-orange-dark); }
.plan-card--future { opacity: 0.85; }
.plan-card__badge {
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
.plan-card__badge--future { background: var(--color-text-muted); }
.plan-card__features { display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
.plan-card__features li { padding-left: var(--space-4); position: relative; color: var(--color-text); }
.plan-card__features li::before {
  content: "";
  position: absolute; left: 0; top: 0.5em;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-orange-light);
}
.plan-card__price { font-family: var(--font-heading); color: var(--color-text-muted); }

@media (max-width: 860px) {
  .planes__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify in browser**

Reload, scroll to `#planes`. Confirm 3 cards render, the "Intermedio" card is visually highlighted, and the "Pro" card shows the "Próximamente" badge with no CTA button (only `.plan-card__price` text). Click "Hablar con nosotras" on the Básico card and confirm the page scrolls to `#contacto` (empty section for now, fine).

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add planes section with Basico/Intermedio/Pro cards"
```

---

### Task 6: Mascota / personalidad showcase

**Files:**
- Modify: `index.html` (insert into `SECTION:MASCOTA`)
- Modify: `css/styles.css` (append mascota showcase block)

**Interfaces:**
- Consumes: `.reveal`, `.section-head` tokens.
- Produces: nothing consumed by later tasks (self-contained showcase).

- [ ] **Step 1: Insert markup with 5 inline mascot expression variants**

```html
<!-- SECTION:MASCOTA -->
<section class="mascota-showcase" id="personalidad">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Así habla Melray</p>
      <h2>Un poquito de personalidad no le hace mal a nadie</h2>
    </div>

    <div class="mascota-showcase__grid">
      <figure class="mascota-showcase__item reveal">
        <svg width="96" height="104" viewBox="0 0 200 220" role="img" aria-label="Mascota Melray preocupada">
          <defs><linearGradient id="mGrad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7b15"/><stop offset="1" stop-color="#df3314"/></linearGradient></defs>
          <path fill="url(#mGrad1)" d="M100 10c8 30-24 34-24 58 0-10 10-18 10-28 16 12 26 34 26 56 0 30-23 54-49 54S38 126 38 96c0-22 12-40 22-50-6 16 0 28 12 34-8-12-8-28 4-44 6 16 16 22 22 16-6-12-6-24 2-42z"/>
          <path d="M60 118l14 6M112 118l-14 6" stroke="#2c1a12" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="70" cy="130" rx="5" ry="7" fill="#2c1a12"/>
          <ellipse cx="102" cy="130" rx="5" ry="7" fill="#2c1a12"/>
          <path d="M76 150c6-4 16-4 22 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>
        <figcaption>"Nos quedan 8. Maybe we should do something about that."</figcaption>
      </figure>

      <figure class="mascota-showcase__item reveal">
        <svg width="96" height="104" viewBox="0 0 200 220" role="img" aria-label="Mascota Melray durmiendo">
          <defs><linearGradient id="mGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7b15"/><stop offset="1" stop-color="#df3314"/></linearGradient></defs>
          <path fill="url(#mGrad2)" d="M100 10c8 30-24 34-24 58 0-10 10-18 10-28 16 12 26 34 26 56 0 30-23 54-49 54S38 126 38 96c0-22 12-40 22-50-6 16 0 28 12 34-8-12-8-28 4-44 6 16 16 22 22 16-6-12-6-24 2-42z"/>
          <path d="M62 128c6-4 12-4 16 0M96 128c6-4 12-4 16 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M80 150c6 4 14 4 20 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
          <text x="128" y="60" font-family="Inter, sans-serif" font-size="22" fill="#df3314">Z z</text>
        </svg>
        <figcaption>"Este lleva 93 días chillin'."</figcaption>
      </figure>

      <figure class="mascota-showcase__item reveal">
        <svg width="96" height="104" viewBox="0 0 200 220" role="img" aria-label="Mascota Melray on fire, muy contenta">
          <defs><linearGradient id="mGrad3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7b15"/><stop offset="1" stop-color="#df3314"/></linearGradient></defs>
          <path fill="#b11e1b" d="M150 20c8 22-10 28-10 44 14-6 20-18 20-32 10 16 12 34 6 52 22-10 28-34 18-58-4 22-14 26-22 20 8-12 4-28-8-38-2 10-6 18-4 12z"/>
          <path fill="url(#mGrad3)" d="M100 10c8 30-24 34-24 58 0-10 10-18 10-28 16 12 26 34 26 56 0 30-23 54-49 54S38 126 38 96c0-22 12-40 22-50-6 16 0 28 12 34-8-12-8-28 4-44 6 16 16 22 22 16-6-12-6-24 2-42z"/>
          <path d="M62 126c6 6 12 6 18 0M94 126c6 6 12 6 18 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M74 146c8 10 22 10 30 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>
        <figcaption>"Okayyy, este está on fire."</figcaption>
      </figure>

      <figure class="mascota-showcase__item reveal">
        <svg width="96" height="104" viewBox="0 0 200 220" role="img" aria-label="Mascota Melray pensando">
          <defs><linearGradient id="mGrad4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7b15"/><stop offset="1" stop-color="#df3314"/></linearGradient></defs>
          <path fill="url(#mGrad4)" d="M100 10c8 30-24 34-24 58 0-10 10-18 10-28 16 12 26 34 26 56 0 30-23 54-49 54S38 126 38 96c0-22 12-40 22-50-6 16 0 28 12 34-8-12-8-28 4-44 6 16 16 22 22 16-6-12-6-24 2-42z"/>
          <ellipse cx="66" cy="128" rx="5" ry="7" fill="#2c1a12"/>
          <ellipse cx="98" cy="124" rx="5" ry="7" fill="#2c1a12"/>
          <path d="M76 150h18" stroke="#2c1a12" stroke-width="4" stroke-linecap="round"/>
          <circle cx="130" cy="70" r="4" fill="#df3314"/>
          <circle cx="142" cy="58" r="3" fill="#df3314"/>
          <circle cx="152" cy="48" r="2" fill="#df3314"/>
        </svg>
        <figcaption>"¿Qué debería reponer esta semana?"</figcaption>
      </figure>

      <figure class="mascota-showcase__item reveal">
        <svg width="96" height="104" viewBox="0 0 200 220" role="img" aria-label="Mascota Melray con café">
          <defs><linearGradient id="mGrad5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7b15"/><stop offset="1" stop-color="#df3314"/></linearGradient></defs>
          <path fill="url(#mGrad5)" d="M100 10c8 30-24 34-24 58 0-10 10-18 10-28 16 12 26 34 26 56 0 30-23 54-49 54S38 126 38 96c0-22 12-40 22-50-6 16 0 28 12 34-8-12-8-28 4-44 6 16 16 22 22 16-6-12-6-24 2-42z"/>
          <ellipse cx="70" cy="128" rx="5" ry="7" fill="#2c1a12"/>
          <ellipse cx="102" cy="128" rx="5" ry="7" fill="#2c1a12"/>
          <path d="M74 148c8 8 20 8 28 0" stroke="#2c1a12" stroke-width="4" stroke-linecap="round" fill="none"/>
          <rect x="118" y="150" width="26" height="20" rx="3" fill="#ffffff" stroke="#b11e1b" stroke-width="3"/>
          <path d="M144 154c8 0 8 12 0 12" fill="none" stroke="#b11e1b" stroke-width="3"/>
        </svg>
        <figcaption>"Buen nivel de stock. We love to see it."</figcaption>
      </figure>
    </div>
  </div>
</section>
<!-- /SECTION:MASCOTA -->
```

- [ ] **Step 2: Append CSS**

```css
/* ===== Mascota showcase ===== */
.mascota-showcase { padding: var(--space-8) 0; background: var(--color-bg-alt); }
.mascota-showcase__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
}
.mascota-showcase__item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}
.mascota-showcase__item svg { margin: 0 auto; }
.mascota-showcase__item figcaption {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

@media (max-width: 860px) {
  .mascota-showcase__grid { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 3: Verify in browser**

Scroll to `#personalidad`, zoom into the grid, confirm the 5 expressions render distinctly (worried eyebrows, sleeping "Zz", excited on-fire flame accents, thinking dots, coffee cup). Confirm each `<svg>` has a descriptive `aria-label` via `read_page`.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add mascot personality showcase section"
```

---

### Task 7: Nosotras (founders) section

**Files:**
- Modify: `index.html` (insert into `SECTION:NOSOTRAS`)
- Modify: `css/styles.css` (append founders block)

- [ ] **Step 1: Insert markup with illustrated initials avatars**

```html
<!-- SECTION:NOSOTRAS -->
<section class="nosotras" id="nosotras">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Nosotras</p>
      <h2>Dos co-founders. Un mismo objetivo.</h2>
    </div>

    <div class="nosotras__grid">
      <article class="founder-card reveal">
        <div class="founder-card__avatar" aria-hidden="true">M</div>
        <h3>Melisa</h3>
        <p class="founder-card__role">Desarrollo de producto · Argentina</p>
        <p>Construye Melray de punta a punta: del código al diseño de cada decisión de producto.</p>
      </article>

      <article class="founder-card reveal">
        <div class="founder-card__avatar founder-card__avatar--alt" aria-hidden="true">S</div>
        <h3>Sarai</h3>
        <p class="founder-card__role">Contacto con clientes · España</p>
        <p>Habla con cada cliente potencial para entender qué necesita realmente su negocio.</p>
      </article>
    </div>
  </div>
</section>
<!-- /SECTION:NOSOTRAS -->
```

- [ ] **Step 2: Append CSS**

```css
/* ===== Nosotras ===== */
.nosotras { padding: var(--space-8) 0; }
.nosotras__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); max-width: 760px; margin: 0 auto; }
.founder-card { text-align: center; }
.founder-card__avatar {
  width: 88px; height: 88px;
  margin: 0 auto var(--space-3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-white);
  background: linear-gradient(160deg, var(--color-orange-light), var(--color-orange-dark));
}
.founder-card__avatar--alt { background: linear-gradient(160deg, var(--color-orange-dark), var(--color-red)); }
.founder-card__role { font-family: var(--font-heading); color: var(--color-orange-dark); margin-top: var(--space-1); }

@media (max-width: 640px) {
  .nosotras__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify in browser**

Scroll to `#nosotras`, confirm both founder cards render with initials avatars ("M" and "S"), correct country/role labels.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add founders section"
```

---

### Task 8: Contact form with Formspree integration

**Files:**
- Modify: `index.html` (insert into `SECTION:CONTACTO`)
- Modify: `css/styles.css` (append form block)
- Modify: `js/main.js` (add `initContactForm`, wire into init)

**Interfaces:**
- Produces: `<form id="contact-form">` with `data-formspree-endpoint` attribute holding the placeholder URL — this is the single place the user edits once they have a real Formspree form ID.

- [ ] **Step 1: Insert markup**

```html
<!-- SECTION:CONTACTO -->
<section class="contacto" id="contacto">
  <div class="container contacto__inner">
    <div class="section-head reveal">
      <p class="eyebrow">Hablemos</p>
      <h2>Cuéntanos sobre tu negocio</h2>
      <p>Respondemos personalmente. Sin bots, sin esperas eternas.</p>
    </div>

    <form id="contact-form" class="contact-form reveal" data-formspree-endpoint="https://formspree.io/f/TU_FORM_ID" novalidate>
      <div class="contact-form__row">
        <label for="cf-name">Nombre</label>
        <input type="text" id="cf-name" name="name" required autocomplete="name">
        <span class="contact-form__error" id="cf-name-error" aria-live="polite"></span>
      </div>

      <div class="contact-form__row">
        <label for="cf-email">Email</label>
        <input type="email" id="cf-email" name="email" required autocomplete="email">
        <span class="contact-form__error" id="cf-email-error" aria-live="polite"></span>
      </div>

      <div class="contact-form__row">
        <label for="cf-business">Tu negocio (opcional)</label>
        <input type="text" id="cf-business" name="business" autocomplete="organization">
      </div>

      <div class="contact-form__row">
        <label for="cf-message">Mensaje</label>
        <textarea id="cf-message" name="message" rows="4" required></textarea>
        <span class="contact-form__error" id="cf-message-error" aria-live="polite"></span>
      </div>

      <button type="submit" class="btn btn--primary contact-form__submit">Enviar mensaje</button>

      <p class="contact-form__status" id="contact-form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
<!-- /SECTION:CONTACTO -->
```

- [ ] **Step 2: Append form CSS**

```css
/* ===== Contacto ===== */
.contacto { padding: var(--space-8) 0; background: var(--color-bg-alt); }
.contacto__inner { max-width: 560px; }
.contact-form { display: flex; flex-direction: column; gap: var(--space-4); margin-top: var(--space-5); }
.contact-form__row { display: flex; flex-direction: column; gap: var(--space-2); }
.contact-form label { font-family: var(--font-heading); font-size: 0.9rem; }
.contact-form input, .contact-form textarea {
  font-family: var(--font-body);
  font-size: 1rem;
  padding: var(--space-3);
  border: 1.5px solid rgba(44, 26, 18, 0.15);
  border-radius: var(--radius-sm);
  background: var(--color-card);
  color: var(--color-text);
}
.contact-form input:invalid[aria-invalid="true"],
.contact-form textarea:invalid[aria-invalid="true"] {
  border-color: var(--color-red);
}
.contact-form__error { color: var(--color-red); font-size: 0.85rem; min-height: 1.2em; }
.contact-form__submit { align-self: flex-start; margin-top: var(--space-2); }
.contact-form__status { font-family: var(--font-heading); }
.contact-form__status[data-state="success"] { color: var(--color-orange-dark); }
.contact-form__status[data-state="error"] { color: var(--color-red); }
```

- [ ] **Step 3: Add `initContactForm` to `js/main.js`**

```javascript
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('contact-form-status');
  const fields = ['name', 'email', 'message'];

  const showError = (field, message) => {
    const input = document.getElementById(`cf-${field}`);
    const error = document.getElementById(`cf-${field}-error`);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
    } else {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    }
  };

  const validate = () => {
    let valid = true;
    fields.forEach((field) => {
      const input = document.getElementById(`cf-${field}`);
      if (!input.value.trim()) {
        showError(field, 'Este campo es obligatorio.');
        valid = false;
      } else if (field === 'email' && !input.validity.valid) {
        showError(field, 'Introduce un email válido.');
        valid = false;
      } else {
        showError(field, '');
      }
    });
    return valid;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) {
      status.textContent = '';
      return;
    }

    const endpoint = form.dataset.formspreeEndpoint;
    status.removeAttribute('data-state');
    status.textContent = 'Enviando...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        status.dataset.state = 'success';
        status.textContent = '¡Gracias! Te contestaremos muy pronto.';
        form.reset();
      } else {
        status.dataset.state = 'error';
        status.textContent = 'Algo falló al enviar. Prueba de nuevo en unos minutos.';
      }
    } catch (err) {
      status.dataset.state = 'error';
      status.textContent = 'No hay conexión. Prueba de nuevo en unos minutos.';
    }
  });
}
```

Update the init block:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initContactForm();
});
```

- [ ] **Step 4: Verify in browser**

Scroll to `#contacto`. Click "Enviar mensaje" with all fields empty: confirm inline error text appears under Nombre, Email and Mensaje, and `aria-invalid="true"` is set on those inputs (`read_page`). Fill Nombre and Mensaje, leave Email as `notanemail`: confirm the email-specific error ("Introduce un email válido.") shows. Fill all fields validly and submit: since the endpoint is still the placeholder, expect the `fetch` to fail or 404 — confirm the status message switches to the error state ("Algo falló..." or "No hay conexión...") rather than silently doing nothing, proving the success/error UI wiring works. This confirms the form is ready to work correctly once a real Formspree endpoint is set.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: add contact form with client-side validation and Formspree wiring"
```

---

### Task 9: Cookie banner + footer

**Files:**
- Modify: `index.html` (insert into `SECTION:FOOTER`, add cookie banner markup just before `</body>`)
- Modify: `css/styles.css` (append footer + cookie banner block)
- Modify: `js/main.js` (add `initCookieBanner`, wire into init)

- [ ] **Step 1: Insert footer markup**

```html
<!-- SECTION:FOOTER -->
<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      <span class="site-header__wordmark">melray</span>
      <p>Tu inventario. Sin el caos.</p>
    </div>
    <nav class="site-footer__links" aria-label="Enlaces legales">
      <a href="https://instagram.com/melray" target="_blank" rel="noopener">Instagram</a>
      <a href="privacidad.html">Privacidad</a>
      <a href="terminos.html">Términos</a>
      <a href="cookies.html">Cookies</a>
    </nav>
    <p class="site-footer__copy">&copy; <span id="footer-year"></span> Melray. Todos los derechos reservados.</p>
  </div>
</footer>
<!-- /SECTION:FOOTER -->
```

- [ ] **Step 2: Insert cookie banner just before `</script>` closing tags, i.e. right before `<script src="/js/main.js" defer></script>`**

```html
<div class="cookie-banner" id="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies" hidden>
  <p>Usamos solo cookies técnicas necesarias para que la web funcione. No usamos cookies de analítica ni de terceros por ahora. Más info en nuestra <a href="cookies.html">política de cookies</a>.</p>
  <button type="button" class="btn btn--primary" id="cookie-banner-accept">Entendido</button>
</div>
```

- [ ] **Step 3: Append footer + cookie banner CSS**

```css
/* ===== Footer ===== */
.site-footer { padding: var(--space-6) 0; border-top: 1px solid rgba(44, 26, 18, 0.08); }
.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: space-between;
  align-items: center;
}
.site-footer__brand p { margin-top: var(--space-1); }
.site-footer__links { display: flex; gap: var(--space-4); }
.site-footer__links a:hover { color: var(--color-orange-dark); }
.site-footer__copy { width: 100%; color: var(--color-text-muted); font-size: 0.85rem; margin-top: var(--space-3); }

/* ===== Cookie banner ===== */
.cookie-banner {
  position: fixed;
  bottom: var(--space-4);
  left: var(--space-4);
  right: var(--space-4);
  max-width: 560px;
  margin: 0 auto;
  background: var(--color-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  z-index: 200;
}
.cookie-banner p { flex: 1 1 280px; font-size: 0.9rem; }
```

- [ ] **Step 4: Add `initCookieBanner` to `js/main.js`**

```javascript
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-banner-accept');
  if (!banner || !acceptBtn) return;

  const STORAGE_KEY = 'melray_cookie_notice_dismissed';

  if (!localStorage.getItem(STORAGE_KEY)) {
    banner.hidden = false;
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    banner.hidden = true;
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
```

Update the init block:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initContactForm();
  initCookieBanner();
  initFooterYear();
});
```

- [ ] **Step 5: Verify in browser**

Reload with a clean `localStorage` (`javascript_tool`: `localStorage.clear()` then reload). Confirm the cookie banner appears. Click "Entendido": confirm it hides and `localStorage.getItem('melray_cookie_notice_dismissed')` is `"true"`. Reload again: confirm the banner stays hidden. Confirm the footer shows the current year and all 4 links (Instagram, Privacidad, Términos, Cookies).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: add footer and dismissible cookie notice"
```

---

### Task 10: Legal pages (privacidad, términos, cookies)

**Files:**
- Create: `privacidad.html`
- Create: `terminos.html`
- Create: `cookies.html`
- Modify: `css/styles.css` (append `.legal` content block)

**Interfaces:**
- Consumes: final header/footer markup from `index.html` (copy verbatim, adjust internal `href`s to `index.html#anchor` since these pages live at the site root alongside `index.html`, and mark the current page's nav link, if desired, with `aria-current="page"` — optional, not required for functionality).

- [ ] **Step 1: Create `privacidad.html`** (header/footer copied from the finished `index.html`, `href="#producto"` etc. changed to `href="index.html#producto"`)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Política de Privacidad — Melray</title>
  <meta name="description" content="Política de privacidad de Melray: qué datos recogemos a través del formulario de contacto y cómo los tratamos.">
  <link rel="canonical" href="https://melray.com/privacidad.html">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="site-header" id="site-header">
    <div class="container site-header__inner">
      <a href="index.html" class="site-header__logo" aria-label="Melray — inicio">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7b15"/><stop offset="1" stop-color="#df3314"/></linearGradient></defs>
          <path fill="url(#logoGrad)" d="M16 1c1 5-4 6-4 10 0-2 2-3 2-5 3 2 5 6 5 10 0 5.5-4.2 10-9 10S1 21.5 1 16c0-4 2-7 4-9-1 3 0 5 2 6-1-2-1-5 1-8 1 3 3 4 4 3-1-2-1-4 0-7 1 3 3 5 4 6z"/>
        </svg>
        <span class="site-header__wordmark">melray</span>
      </a>
      <a href="index.html#contacto" class="btn btn--primary site-header__cta">Hablar con nosotras</a>
    </div>
  </header>

  <main class="legal">
    <div class="container legal__content">
      <h1>Política de Privacidad</h1>
      <p><em>Última actualización: 18 de agosto de 2026.</em></p>

      <p><strong>Responsable del tratamiento:</strong> [Razón social de Melray], con NIF [pendiente de completar] y domicilio en [dirección pendiente de completar]. Email de contacto: [email de contacto pendiente de completar].</p>

      <p>Este documento es una plantilla de partida y debe ser revisada por un profesional legal antes de su publicación definitiva, adaptando los datos identificativos de la empresa.</p>

      <h2>1. Qué datos recogemos</h2>
      <p>A través del formulario de contacto de esta web recogemos: nombre, email, nombre del negocio (opcional) y el mensaje que nos escribas. No recogemos ningún otro dato personal de forma automática más allá de las cookies técnicas necesarias descritas en nuestra <a href="cookies.html">política de cookies</a>.</p>

      <h2>2. Para qué usamos tus datos</h2>
      <p>Usamos los datos exclusivamente para responder a tu consulta y, si nos das tu consentimiento expreso, para contactarte sobre novedades de Melray. No cedemos tus datos a terceros salvo al proveedor del propio formulario (Formspree), que actúa como encargado del tratamiento para la gestión técnica del envío del mensaje.</p>

      <h2>3. Base legal</h2>
      <p>El tratamiento se basa en tu consentimiento, otorgado al enviar el formulario de contacto (art. 6.1.a RGPD).</p>

      <h2>4. Cuánto tiempo conservamos tus datos</h2>
      <p>Conservamos los datos del formulario el tiempo necesario para atender tu consulta y, como máximo, durante 24 meses desde el último contacto, salvo que nos pidas su eliminación antes.</p>

      <h2>5. Tus derechos</h2>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [email de contacto pendiente de completar]. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <span class="site-header__wordmark">melray</span>
        <p>Tu inventario. Sin el caos.</p>
      </div>
      <nav class="site-footer__links" aria-label="Enlaces legales">
        <a href="https://instagram.com/melray" target="_blank" rel="noopener">Instagram</a>
        <a href="privacidad.html" aria-current="page">Privacidad</a>
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

- [ ] **Step 2: Create `terminos.html`** (same header/footer shell as Step 1, `aria-current="page"` moved to the "Términos" link, `<title>Términos y Condiciones — Melray</title>`, `<main class="legal">` content:)

```html
<div class="container legal__content">
  <h1>Términos y Condiciones</h1>
  <p><em>Última actualización: 18 de agosto de 2026.</em></p>
  <p>Estos términos regulan el uso de esta web informativa de Melray. Es una plantilla de partida y debe ser revisada por un profesional legal antes de su publicación definitiva.</p>

  <h2>1. Objeto</h2>
  <p>Esta web tiene fines informativos y comerciales: presentar Melray, sus planes y permitir el contacto con las fundadoras. Actualmente no permite la contratación online del servicio.</p>

  <h2>2. Propiedad intelectual</h2>
  <p>Los textos, marca, logotipo, mascota y demás contenidos de esta web son propiedad de [Razón social de Melray] y no pueden reproducirse sin autorización.</p>

  <h2>3. Uso del formulario de contacto</h2>
  <p>Al enviar el formulario de contacto declaras que los datos aportados son veraces y aceptas nuestra <a href="privacidad.html">política de privacidad</a>.</p>

  <h2>4. Limitación de responsabilidad</h2>
  <p>Melray no garantiza la disponibilidad continua e ininterrumpida de esta web y no se hace responsable de decisiones tomadas únicamente en base al contenido informativo aquí publicado.</p>

  <h2>5. Legislación aplicable</h2>
  <p>Estos términos se rigen por la legislación española.</p>
</div>
```

- [ ] **Step 3: Create `cookies.html`** (same shell, `aria-current="page"` on "Cookies" link, `<title>Política de Cookies — Melray</title>`, content:)

```html
<div class="container legal__content">
  <h1>Política de Cookies</h1>
  <p><em>Última actualización: 18 de agosto de 2026.</em></p>

  <h2>Qué cookies usamos</h2>
  <p>Esta web utiliza únicamente <strong>cookies técnicas necesarias</strong> para su funcionamiento: concretamente, una entrada en el almacenamiento local del navegador (`localStorage`) que recuerda si ya has visto el aviso de cookies, para no volver a mostrártelo.</p>

  <h2>Qué no usamos (todavía)</h2>
  <p>Actualmente no utilizamos cookies de analítica, publicidad ni de terceros. Si en el futuro incorporamos herramientas de analítica, actualizaremos esta página y te pediremos tu consentimiento antes de activarlas.</p>

  <h2>Cómo gestionar las cookies</h2>
  <p>Puedes borrar la información guardada por esta web en cualquier momento desde la configuración de tu navegador, en el apartado de datos de sitios web o almacenamiento local.</p>
</div>
```

- [ ] **Step 4: Append `.legal` content styling**

```css
/* ===== Legal pages ===== */
.legal { padding: var(--space-7) 0 var(--space-8); }
.legal__content { max-width: 720px; }
.legal__content h1 { margin-bottom: var(--space-3); }
.legal__content h2 { margin-top: var(--space-6); margin-bottom: var(--space-2); font-size: 1.4rem; }
.legal__content p { margin-bottom: var(--space-3); }
.legal__content a { color: var(--color-orange-dark); text-decoration: underline; }
```

- [ ] **Step 5: Verify in browser**

Open each of the 3 legal pages directly. Confirm header/footer render identically to `index.html` (logo, CTA, footer links), the correct footer link has `aria-current="page"`, and the "Melray — inicio" logo link and header CTA correctly navigate back to `index.html`. Confirm no `console` errors.

- [ ] **Step 6: Commit**

```bash
git add privacidad.html terminos.html cookies.html css/styles.css
git commit -m "feat: add privacy, terms and cookies legal pages"
```

---

### Task 11: Full-site QA pass (responsive, accessibility, console)

**Files:**
- Modify: `css/styles.css` (fix any issues found — exact rules depend on findings, see step 1)
- Modify: `index.html`, `privacidad.html`, `terminos.html`, `cookies.html` (fix any markup issues found)

No new features in this task — it is a verification-and-fix pass. Every check below must be run in the Browser pane against the live local site (served via `preview_start`, not `file://`, so `fetch`/module-relative paths behave like production).

- [ ] **Step 1: Responsive check at 3 breakpoints**

Use `resize_window` with presets `mobile` (375x812), `tablet` (768x1024) and `desktop` (1280x800) on `index.html` and each legal page. For each breakpoint, scroll through the full page and confirm: no horizontal scrollbar/overflow, header nav collapses correctly below 860px, all grids (`planes__grid`, `producto__grid`, `problema__grid`, `mascota-showcase__grid`, `nosotras__grid`) reflow to single/double column on mobile, text remains legible (no clipped/overlapping content), the cookie banner doesn't obscure the contact form's submit button. Fix any overflow or overlap issues found by adjusting the relevant CSS rules from earlier tasks (edit `css/styles.css` directly, no new selectors needed unless a genuine gap is found).

- [ ] **Step 2: Keyboard navigation check**

On `index.html`, press Tab repeatedly from the top of the page and confirm: focus order follows visual order (logo → nav links → header CTA → nav toggle on mobile → hero CTAs → ... → contact form fields → submit → cookie banner accept button → footer links), every focused element shows the `:focus-visible` outline defined in Task 1, the mobile menu toggle is reachable and operable with Enter/Space when the menu is visible.

- [ ] **Step 3: Console and network check**

On every page (`index.html`, `privacidad.html`, `terminos.html`, `cookies.html`), use `read_console_messages` with `onlyErrors: true` and confirm zero errors. Use `read_network_requests` and confirm the two font files and `styles.css`/`main.js` return 200 (not 404) — a 404 here means a path typo from an earlier task; fix the `href`/`src` attribute or file location.

- [ ] **Step 4: Metadata check**

For each page, run `get_page_text` and also inspect `document.title` and the `content` attribute of `meta[name="description"]` via `javascript_tool`. Confirm every page has a unique, non-empty title and description (the legal pages already have unique ones from Task 10; `index.html` was set in Task 1).

- [ ] **Step 5: Contrast spot-check**

Via `javascript_tool`, read `getComputedStyle` background/color pairs for: `.btn--primary` (white text on `--color-red`), `.eyebrow` (`--color-orange-dark` on `--color-bg`), body text (`--color-text` on `--color-bg`). These were computed to pass WCAG AA during design (4.5:1+ for the button, much higher for the others) — this step is a sanity check that no earlier task accidentally changed a color value away from the token, not a redesign step.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: QA pass — responsive, accessibility and console fixes"
```

If no fixes were needed, skip the commit (nothing to commit is fine here — do not create an empty commit).

---

### Task 12: Deploy to Vercel

**Files:** none (deployment step only).

- [ ] **Step 1: Deploy a preview**

Use the `vercel:deploy` skill (or `vercel deploy` via the Vercel CLI if already installed) from the project root to create a preview deployment. This is a static project — no framework preset/build command is required.

- [ ] **Step 2: Verify the live preview**

Open the returned preview URL in the Browser pane. Repeat a condensed version of Task 11's checks: page loads with no console errors, hero/planes/contact sections render correctly, legal pages load at their `/privacidad.html`, `/terminos.html`, `/cookies.html` paths, fonts load (no fallback-font flash beyond expected `font-display: swap` behavior).

- [ ] **Step 3: Report the preview URL to the user**

Share the preview URL and explicitly remind the user of the two follow-ups only they can complete: (1) create a Formspree account and replace `data-formspree-endpoint` in `index.html`'s contact form with their real endpoint, (2) fill in the legal-page placeholders (razón social, NIF, dirección, email de contacto) with real company data, ideally after legal review. Ask whether they want the preview promoted to production and/or a custom domain connected — do not promote to production without explicit confirmation.

---

## Self-Review Notes

- **Spec coverage:** every section from the design spec (§4 landing sections, §5 visual system, §6 SEO, §7 accessibility, §8 legal, §9 form, §10 deploy, §11 QA) maps to a task above. §12 (out of scope) is respected — no blog, no backend, no real prices, no Instagram content, no Formspree account creation.
- **Placeholder scan:** the only intentional placeholders left in the *output* (not the plan) are the Formspree endpoint and the legal-page company identifiers — both are explicitly required to stay as placeholders per the spec (§8, §9, §12) and are called out to the user in Task 12 Step 3, not silently left.
- **Type/class consistency:** `.reveal`/`.reveal--visible` (Task 4) is reused verbatim by Tasks 5-9's markup. `.btn`/`.btn--primary`/`.btn--secondary` (Task 2) reused by Tasks 3, 5, 8, 9. `js/main.js`'s `DOMContentLoaded` listener is amended (not replaced) task by task — each task's step shows the full updated listener body to prevent an implementer from dropping earlier calls.
