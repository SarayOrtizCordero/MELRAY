# Sección Servicios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Más allá del inventario" (services) section to the Melray landing page — `#servicios`, between `#planes` and `#demo` — presenting Websites, CRM, and Automatizaciones as additional offerings, plus a nav link to it.

**Architecture:** Pure HTML + CSS additions to the existing static site (no build tools, no JS changes). One new `<section>` in `index.html`, one new nav `<li>` in each of the two existing nav menus (desktop + mobile), and one new CSS block in `css/styles.css` reusing existing design tokens — same pattern every other section of the site already follows.

**Tech Stack:** Plain HTML5, CSS3 (existing custom properties in `css/styles.css`), no new JS. Verification via the Browser pane preview tools against the `melray-static` config in `.claude/launch.json` (`npx serve -l 4173 .`).

## Global Constraints

- No build tools, frameworks, or new dependencies — plain HTML/CSS only, matching the rest of the site (per `docs/superpowers/specs/2026-08-18-melray-landing-design.md`).
- Reuse existing design tokens from `css/styles.css` `:root` only (`--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`) — no new hardcoded colors/fonts.
- New CSS gets its own namespaced classes (`.servicios`, `.servicios__grid`, `.servicios__card`, `.servicios__closing`) — do not reuse or rename `.problema__card`/`.plan-card`/etc., matching the site's existing convention of one class family per section (per spec `docs/superpowers/specs/2026-08-24-seccion-servicios-design.md` §5).
- Copy must be exact as specified below — all "vos" forms from the original brief already converted to "tú" forms, and "más eficiente" already corrected to "más eficientes" (spec §3). Do not reintroduce vos forms.
- The CTA link is `https://cal.com/TU-ENLACE-AQUI` — the same placeholder every other CTA on the site already uses (spec §2). Do not invent a different link.
- Nav order must be Inventario → Planes → Servicios → Demo, in both the desktop nav (`#primary-nav`) and the mobile nav (`#mobile-menu`) — matching the actual scroll order of the sections on the page (spec §4, corrected post-review: the original text said "Inventario → Servicios → Planes → Demo," which contradicted the section's real placement between Planes and Demo and caused a real navigation bug).
- Section must use the `.reveal` class on `.section-head`, each card, and the closing block, matching every other section's scroll-reveal pattern. No JS changes — `initScrollReveal()` in `js/main.js` already selects `.reveal` generically.
- Grid stacks to 1 column at the existing 860px breakpoint, same as `.problema__grid` and `.planes__grid`.
- Do not modify `#producto` or `#planes` sections, or any other existing file besides `index.html` and `css/styles.css`.

---

### Task 1: Add the `#servicios` section, nav links, and CSS

**Files:**
- Modify: `index.html` (nav — two spots; new section between `#planes` and `#demo`)
- Modify: `css/styles.css` (new block after the `.planes` media query, before `/* ===== Demo CTA ===== */`)

**Interfaces:**
- Produces: `.servicios`, `.servicios__grid`, `.servicios__card`, `.servicios__closing` (CSS classes, not consumed by any other task — this is the only task in this plan).

- [ ] **Step 1: Add "Servicios" to the desktop nav**

Note: corrected post-review to place "Servicios" after "Planes", matching
the real scroll order of the page — the first version of this plan put it
before "Planes," which contradicted where the section actually sits
(between Planes and Demo) and caused a real navigation bug (clicking
"Servicios" scrolled past "Planes").

Read `index.html` first, then replace:

```html
      <nav class="site-header__nav" id="primary-nav" aria-label="Navegación principal">
        <ul>
          <li><a href="#producto">Inventario</a></li>
          <li><a href="#planes">Planes</a></li>
          <li><a href="#demo">Demo</a></li>
        </ul>
      </nav>
```

with:

```html
      <nav class="site-header__nav" id="primary-nav" aria-label="Navegación principal">
        <ul>
          <li><a href="#producto">Inventario</a></li>
          <li><a href="#planes">Planes</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#demo">Demo</a></li>
        </ul>
      </nav>
```

- [ ] **Step 2: Add "Servicios" to the mobile nav**

Replace:

```html
    <nav id="mobile-menu" class="mobile-menu" aria-label="Navegación móvil" hidden>
      <ul>
        <li><a href="#producto">Producto</a></li>
        <li><a href="#planes">Planes</a></li>
        <li><a href="#demo">Demo</a></li>
        <li><a href="https://cal.com/TU-ENLACE-AQUI" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a></li>
      </ul>
    </nav>
```

with:

```html
    <nav id="mobile-menu" class="mobile-menu" aria-label="Navegación móvil" hidden>
      <ul>
        <li><a href="#producto">Producto</a></li>
        <li><a href="#planes">Planes</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#demo">Demo</a></li>
        <li><a href="https://cal.com/TU-ENLACE-AQUI" class="btn btn--primary" target="_blank" rel="noopener">Agendar una demo</a></li>
      </ul>
    </nav>
```

- [ ] **Step 3: Insert the `#servicios` section between Planes and Demo**

Replace:

```html
    </section>
    <!-- /SECTION:PLANES -->

    <!-- SECTION:DEMO -->
```

with:

```html
    </section>
    <!-- /SECTION:PLANES -->

    <!-- SECTION:SERVICIOS -->
    <section class="servicios" id="servicios">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="eyebrow">Más allá del inventario</h2>
          <p class="section-head__lead">Melray no es solo un sistema de inventario.</p>
          <p>Creamos soluciones digitales que acompañan las distintas necesidades de tu negocio para hacer tu día a día más simple.</p>
        </div>
        <div class="servicios__grid">
          <article class="servicios__card reveal">
            <h3>Websites</h3>
            <p>Diseñamos y desarrollamos sitios web pensados para tu negocio, tu cliente y tus objetivos.</p>
          </article>
          <article class="servicios__card reveal">
            <h3>CRM</h3>
            <p>Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
          </article>
          <article class="servicios__card reveal">
            <h3>Automatizaciones</h3>
            <p>Conectamos herramientas y automatizamos procesos para reducir tareas manuales y hacer tus operaciones más eficientes.</p>
          </article>
        </div>
        <div class="servicios__closing reveal">
          <p>¿No sabes exactamente qué necesitas? Empecemos por entender tu negocio.</p>
          <a href="https://cal.com/TU-ENLACE-AQUI" class="btn btn--primary" target="_blank" rel="noopener">Agendar una reunión</a>
        </div>
      </div>
    </section>
    <!-- /SECTION:SERVICIOS -->

    <!-- SECTION:DEMO -->
```

- [ ] **Step 4: Add the `.servicios` CSS block**

In `css/styles.css`, find this block:

```css
@media (max-width: 860px) {
  .planes__grid { grid-template-columns: 1fr; }
}

/* ===== Demo CTA ===== */
```

and replace it with:

```css
@media (max-width: 860px) {
  .planes__grid { grid-template-columns: 1fr; }
}

/* ===== Servicios ===== */
.servicios { padding: var(--space-8) 0; }
.servicios__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.servicios__card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}
.servicios__card h3 { margin-bottom: var(--space-3); }
.servicios__closing {
  max-width: 640px;
  margin: var(--space-7) auto 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.servicios__closing p {
  font-family: var(--font-heading);
  color: var(--color-text);
}
.servicios__closing a { margin-top: var(--space-5); }

@media (max-width: 860px) {
  .servicios__grid { grid-template-columns: 1fr; }
}

/* ===== Demo CTA ===== */
```

- [ ] **Step 5: Verify visually (desktop)**

Use the Browser pane: `preview_start` with `{name: "melray-static"}`, then `navigate` to `http://localhost:4173/index.html#servicios`. Take a screenshot.

Expected: header nav shows "Inventario, Planes, Servicios, Demo" in that order. The new section renders below Planes and above the "Okay. Hay una forma más simple" Demo section: eyebrow "Más allá del inventario", 3 white cards in a row (Websites, CRM, Automatizaciones), and a centered closing line + "Agendar una reunión" button below the cards.

- [ ] **Step 6: Verify visually (mobile) and check copy**

`resize_window` to `preset: "mobile"`, reload, screenshot. Expected: nav includes "Servicios" in the mobile menu (open it via the hamburger toggle to confirm), and the 3 cards stack in a single column.

Then use `get_page_text` and confirm the following exact strings are present, with no "vos" forms anywhere on the page:
- "Más allá del inventario"
- "Melray no es solo un sistema de inventario."
- "Centraliza clientes, conversaciones y oportunidades"
- "más eficientes" (not "más eficiente")
- "¿No sabes exactamente qué necesitas?"
- "Agendar una reunión"

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add servicios section (websites, CRM, automatizaciones) with nav link"
```

---

## Self-Review Notes

- **Spec coverage:** Structure/content (spec §3) → Step 3. Nav (spec §4) → Steps 1-2. CSS namespacing/tokens/breakpoint (spec §5) → Step 4. Copy adapted to Spain Spanish + grammar fix → verified explicitly in Step 6. No changes to `#producto`/`#planes` → confirmed by Step 3's diff being an insertion only, not a modification of surrounding sections.
- **Placeholder scan:** No TBD/TODO; every step has full code. The CTA link is intentionally the same placeholder used sitewide (spec §2), not a gap.
- **Type/consistency check:** Class names introduced (`.servicios`, `.servicios__grid`, `.servicios__card`, `.servicios__closing`) are declared once in Step 4's CSS and match exactly what Step 3's HTML uses — no naming drift.
