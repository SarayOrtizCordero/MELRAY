# Reposicionamiento de la home: CRM como producto principal

**Fecha:** 2026-09-06
**Estado:** Aprobado para pasar a plan de implementación

## Contexto y objetivo

Hasta ahora `index.html` está construida enteramente alrededor del panel de inventario (hero, sección de capturas "Inventario hoy" y "Planes" solo hablan de ese producto). Los otros tres servicios (Websites, CRM, Automatizaciones) son tarjetas secundarias al final de la página que enlazan a páginas propias (`websites.html`, `crm.html`, `automatizaciones.html`).

Melray va a reposicionarse como un estudio que construye varias soluciones digitales según lo que el negocio del cliente necesite, con **CRM como producto de mayor protagonismo**, **Automatización en segundo lugar**, y **Webs y Paneles/Inventarios** como categorías de menor prioridad relativa (en ese orden: Webs antes que Paneles/Inventarios).

Este spec cubre los cuatro cambios necesarios en `index.html` para reflejar ese reposicionamiento, más una página nueva (`inventario.html`) que faltaba.

## Non-goals

- No se rediseña `crm.html`, `automatizaciones.html` ni `websites.html` en este spec (solo se les añaden enlaces de entrada nuevos desde la home).
- No se define un sistema de precios ni CTA nuevo para Automatización o Webs — mantienen cotización a medida.
- No se toca el mascot/hero-video (`mascota-hero.mp4`), la sección "Problema", ni el footer.
- No se migra el sitio a un framework ni se introduce build step: todo sigue siendo HTML/CSS/JS vanilla, siguiendo el patrón ya usado por `plan-modal` en `js/main.js`.

## 1. Hero

Copy nuevo (reemplaza el H1 y el lead actuales):

```html
<h1>Organiza tus clientes. Después, todo lo demás</h1>
<p class="hero__lead">Melray empieza por tu CRM y suma automatización, webs e inventario a medida que tu negocio lo necesita.</p>
```

El resto del hero (video mascota, botones "Agendar una demo" / "Ver planes") no cambia.

## 2. Sección "Servicios" — reorden + nueva tarjeta

Orden final de las tarjetas (antes: Websites, CRM, Automatizaciones):

1. **CRM** → `crm.html`
2. **Automatizaciones** → `automatizaciones.html`
3. **Websites** → `websites.html`
4. **Paneles/Inventarios** *(nueva tarjeta)* → `inventario.html` *(página nueva)*

Copy de la tarjeta nueva:

```html
<article class="servicios__card reveal">
  <h3>Paneles e Inventarios</h3>
  <p>Ordena tu stock, tus movimientos y tu catálogo en un panel simple que se actualiza en segundos.</p>
  <a href="inventario.html" class="servicios__card-link">Ver Paneles <span aria-hidden="true">→</span></a>
</article>
```

`inventario.html` se crea clonando la estructura de `crm.html` (mismo layout: hero de servicio, `service-features` con lista de bullets, `service-demo`, `service-cta`), con:
- H1: "Tu inventario, sin el caos"
- Features: catálogo organizado, entradas/salidas en segundos, stock actualizado, historial de movimientos, productos más vendidos, planificación de reposiciones (tomado del copy ya existente en `producto` y en los teasers de planes de inventario).
- `service-demo`: a diferencia de `crm.html`/`websites.html`/`automatizaciones.html` (que muestran el placeholder "próximamente"), aquí sí hay capturas reales — reutiliza `mockup-catalogo.png`, `mockup-movimientos.png` y `mockup-consulta.png` igual que la pestaña "Paneles/Inventarios" del punto 3.

Se añade también a `sitemap.xml`.

## 3. Sección "Producto" (capturas) — nav por categoría

Se agrega un nav de pestañas encima del contenido actual de `<section class="producto" id="producto">`:

```html
<div class="category-nav" role="tablist" aria-label="Categorías de producto">
  <button class="category-nav__tab" role="tab" aria-selected="true" data-category="crm">CRM</button>
  <button class="category-nav__tab" role="tab" aria-selected="false" data-category="automatizacion">Automatización</button>
  <button class="category-nav__tab" role="tab" aria-selected="false" data-category="webs">Webs</button>
  <button class="category-nav__tab" role="tab" aria-selected="false" data-category="inventario">Paneles/Inventarios</button>
</div>
```

Cada categoría es un `<div role="tabpanel" data-category-panel="...">` que se muestra/oculta con JS vanilla (mismo patrón que `plan-modal` en `js/main.js`: un listener delegado en `.category-nav`, toggla `hidden` y `aria-selected`, sin recargar ni depender de frameworks). **CRM está activo por defecto** al cargar la página.

El eyebrow y el lead de `section-head` cambian con la pestaña activa:

| Categoría | Eyebrow | Lead |
|---|---|---|
| CRM | "CRM hoy" | "Lo que necesitas saber de tus clientes, sin perseguir información." |
| Automatización | "Automatización hoy" | "Menos tareas repetitivas, más tiempo para lo que importa." |
| Webs | "Webs hoy" | "Un sitio que trabaja para tu negocio, no al revés." |
| Paneles/Inventarios | "Inventario hoy" | (el lead actual, sin cambios) |

Contenido de cada panel:

**CRM** (3 filas `producto__row`, con capturas reales tomadas de las demos que ya existen en `https://sarayortizcordero.github.io/CRM-Basico/`, `CRM-Intermedio/` y `CRM-Completo/`):
1. Captura del pipeline/kanban (CRM-Básico) — H3 "Tu pipeline, siempre a la vista" / texto sobre ver oportunidades por estado (Nuevo, Contactado, Propuesta, Ganado, Perdido).
2. Captura de la ficha de contacto con checklist de tareas (CRM-Intermedio) — H3 "Cada cliente, con su historial completo" / texto sobre no perder seguimiento de ninguna oportunidad.
3. Captura del dashboard con ingresos y actividad (CRM-Completo) — H3 "Reportes claros de tu actividad comercial" / texto sobre ver de un vistazo cómo va el negocio.

**Paneles/Inventarios** (3 filas): idénticas a las 3 filas que existen hoy en `index.html` (catálogo, movimientos, consulta) — se mueven dentro del nuevo panel sin cambios de copy ni de imagen.

**Automatización** y **Webs** (1 fila cada una, mismo bloque placeholder que ya usan sus páginas de servicio):

```html
<div class="producto__row producto__row--placeholder reveal">
  <div class="producto__mockup">
    <div class="producto__mockup-bar"><span></span><span></span><span></span></div>
    <div class="producto__mockup-body producto__mockup-body--placeholder">
      <p class="service-demo__note">Estamos preparando ejemplos reales de este servicio — pronto podrás verlos aquí.</p>
    </div>
  </div>
  <div class="producto__text">
    <h3>Automatización, categoría por categoría</h3>
    <p><a href="automatizaciones.html">Conoce más sobre Automatización →</a></p>
  </div>
</div>
```

El panel de Webs usa la misma estructura con H3 "Un sitio hecho a tu medida" y el enlace apuntando a `websites.html`.

Al final de cada panel (las 4 categorías), un enlace "Ver todo sobre {categoría} →" a la página de servicio correspondiente (`crm.html`, `automatizaciones.html`, `websites.html`, `inventario.html`).

## 4. Sección "Planes" — mismo nav de categorías

Mismo componente `.category-nav` (reutilizado, mismo JS) encima de `<section class="planes" id="planes">`. CRM activo por defecto.

**Panel CRM** — 3 `plan-card`, mismo layout/HTML que las de Inventario, mismos montos (997 € / 1.600 € / "A medida") como punto de partida:

- **Básico — 997 €** — "Todo lo que necesitas para organizar a tus clientes y no perder ninguna oportunidad."
  - Ficha de contacto por cliente
  - Pipeline visual por estados (Nuevo, Contactado, Propuesta, Ganado, Perdido)
  - Búsqueda y filtro de contactos
  - Vista de pipeline y de tabla
  - CTA: "Ver demo en acción" → `https://sarayortizcordero.github.io/CRM-Basico/`

- **Intermedio — 1.600 €** *(badge "Más elegido")* — "Más contexto de cada cliente para no perder seguimiento de ninguna oportunidad."
  - Todo lo incluido en Básico
  - Historial de actividad por contacto
  - Checklist de tareas por oportunidad
  - Valor estimado por trato
  - CTA: "Ver demo en acción" → `https://sarayortizcordero.github.io/CRM-Intermedio/`

- **Completo — A medida** — "Visión completa de tu actividad comercial, con reportes y automatizaciones incluidas."
  - Todo lo incluido en Básico e Intermedio
  - Dashboard con ingresos, actividad y top clientes
  - Reportes de rendimiento comercial
  - Gestión de empresas y documentos
  - CTA: "Ver demo en acción" → `https://sarayortizcordero.github.io/CRM-Completo/` *(a diferencia del tier "Pro" de Inventario, aquí sí hay una demo real, así que se usa el mismo CTA de demo en vez de "Agendar cotización")*

El modal `plan-modal` existente (que hoy expande el detalle de cada `plan-card` de Inventario vía `data-plan`) se extiende con las mismas claves para los 3 planes de CRM.

**Panel Paneles/Inventarios**: las 3 `plan-card` que ya existen hoy, sin cambios.

**Panel Automatización y Panel Webs**: una única tarjeta de cotización en cada uno:

```html
<article class="plan-card plan-card--quote reveal">
  <h3>Cotización a medida</h3>
  <p class="plan-card__desc">Cada proyecto de [automatización / web] es distinto — conversemos sobre el tuyo.</p>
  <div class="plan-card__footer">
    <p class="plan-card__price">A medida<span class="plan-card__price-note">Cotización según tu negocio</span></p>
    <a href="https://calendly.com/charladeclaridad/demo-melray" class="btn btn--primary" target="_blank" rel="noopener">Agendar cotización</a>
  </div>
</article>
```

## Assets a capturar

Antes de implementar, se deben generar 3 imágenes PNG (mismo tratamiento que `mockup-catalogo.png` etc.: recorte limpio del panel, sin chrome del navegador) a partir de:
- `https://sarayortizcordero.github.io/CRM-Basico/` → vista de pipeline/kanban
- `https://sarayortizcordero.github.io/CRM-Intermedio/` → vista de ficha de contacto + checklist
- `https://sarayortizcordero.github.io/CRM-Completo/` → vista de dashboard

## Testing / verificación

- Verificar en navegador que el nav de categorías cambia el contenido de "Producto" y "Planes" sin recargar, con CRM activo al cargar.
- Verificar `aria-selected` y navegación por teclado (flechas/tab) en el `role="tablist"`.
- Verificar que el modal de planes (`plan-modal`) abre correctamente el detalle de los 3 planes nuevos de CRM.
- Verificar responsive (375px) del nav de pestañas: no debe romper el layout ni tapar contenido.
- Verificar que `inventario.html` se enlaza correctamente desde Servicios y aparece en `sitemap.xml`.
