# Simplificación de la home: Automatización como protagonista, sin pestañas

**Fecha:** 2026-09-07
**Estado:** Aprobado para pasar a plan de implementación

## Contexto y objetivo

El reposicionamiento anterior (`2026-09-06-home-crm-reposicionamiento-design.md`) convirtió `index.html` en un tour de 4 categorías (CRM, Automatización, Webs, Paneles/Inventarios) con pestañas (`category-nav`) repetidas en "Producto" y "Planes", con CRM como pestaña activa por defecto.

El objetivo ahora es lo contrario: simplificar. La home vuelve a contar **una sola historia de producto**, esta vez centrada en **Automatización**, con los demás servicios (CRM, Websites, Paneles/Inventarios) como tarjetas simples en "Servicios" — el mismo patrón que tenía la home original antes de cualquier reposicionamiento, solo que con otro producto como protagonista.

Además, como Automatización no tiene una app de demo en vivo (a diferencia de CRM e Inventario) ni una estructura de precios fija, la sección "Planes" deja de ser una grilla de precios y pasa a ser un **formulario de contacto/cotización**.

## Non-goals

- No se modifica `crm.html`, `websites.html` ni `inventario.html` más allá de su nav (ver sección 7).
- No se añade backend ni función serverless: el envío del formulario es 100% client-side (abre WhatsApp o el cliente de correo con los datos prellenados).
- Las 3 capturas reales de CRM (`mockup-crm-*.png`) y sus 3 planes con precio ya definidos (997€/1.600€/A medida) dejan de usarse en `index.html` pero no se borran: quedan en el historial de git sin wirear a ninguna página, para retomarlos más adelante si se decide darle a `crm.html` su propia sección de precios.
- No se toca el mascot/hero-video, la sección "Problema" ni "¿Quieres ver Melray en acción?".
- No se rediseña la paleta de color, la tipografía global ni el sistema de `.btn`/`.reveal` ya existente.

## 1. Hero + metadata

Nuevo H1 y lead (reemplaza el actual, centrado en CRM):

```html
<h1>Elimina el trabajo repetitivo. Después, todo lo demás</h1>
<p class="hero__subtitle">Melray empieza por automatizar tus procesos y suma CRM, webs e inventario a medida que tu negocio lo necesita.</p>
```

El botón secundario del hero cambia de "Ver planes" a "Ver cotización" (el ancla a la que apunta también cambia, ver sección 7).

Se actualizan en el `<head>` (mismo patrón que usó el spec de CRM): `<title>`, `meta[name=description]`, `og:title`, `og:description`, `twitter:title`, `twitter:description` y la `description` del JSON-LD, todos reemplazando la mención a "Organiza tus clientes"/CRM por la idea de automatización (ej. título: "Melray — Elimina el trabajo repetitivo. Después, todo lo demás.").

## 2. Sección "Producto" — de pestañas a una sola historia

Se elimina por completo el `.category-nav` (tablist + 4 `.category-nav__panel`) de esta sección. En su lugar, la estructura vuelve a ser: un `section-head` único + contenido de Automatización.

Como no hay capturas reales que mostrar, el contenido no son las filas `producto__row` con mockup, sino un **diagrama de flujo de 3 pasos** — nuevo componente `.flow-diagram`, y elemento distintivo de este rediseño:

```html
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
```

Los números (1/2/3) aquí sí encodean información real (es una secuencia temporal literal: primero pasa una cosa, después otra, después otra), a diferencia de un marcador decorativo.

**Comportamiento del diagrama:**
- Desktop (≥768px): los 3 pasos en fila, conectados por una línea horizontal; `.flow-diagram__pulse` es un punto que viaja de izquierda a derecha por cada conector en bucle suave (`@keyframes` con `transform: translateX`).
- Mobile (<768px): los pasos se apilan verticalmente, el conector es una línea vertical, y el pulso viaja de arriba a abajo (`translateY`).
- Se activa (empieza a animarse) cuando `.flow-diagram` recibe `reveal--visible` del `IntersectionObserver` ya existente en `main.js`.
- Con `prefers-reduced-motion: reduce`, el pulso no se anima (mismo patrón que ya sigue `.reveal` en `css/styles.css`).

## 3. Sección "Planes" → "Cotización" (formulario)

Se elimina por completo de esta sección: el `.category-nav` (tablist + 4 paneles), los `.planes__grid`/`.planes__single` con sus `.plan-card`, y el `<dialog class="plan-modal">` con su JS asociado (`PLAN_DETAILS`, `initPlanModal()`).

En su lugar:

```html
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
```

**Comportamiento (nueva función `initCotizacionForm()` en `main.js`, reemplaza a `initPlanModal()`):**
- El `<form>` no tiene `action`/`method`: nunca se envía por HTTP. Un listener `submit` con `event.preventDefault()` evita que Enter dentro de un input recargue la página.
- Al hacer click en cualquiera de los dos botones, primero se llama a `form.reportValidity()`; si hay campos obligatorios vacíos o el email es inválido, el navegador muestra su validación nativa y no se hace nada más.
- Si es válido, se arma un mensaje de texto plano con los valores (omitiendo los campos opcionales vacíos):
  ```
  Hola, quiero cotizar una automatización:
  Nombre: {nombre}
  Negocio: {negocio}
  Email: {email}
  Teléfono: {teléfono}
  Qué necesita automatizar: {necesidad}
  Herramientas actuales: {herramientas}
  ```
- **Enviar por WhatsApp**: `window.open('https://wa.me/5491127041868?text=' + encodeURIComponent(mensaje), '_blank', 'noopener')`.
- **Enviar por email**: `window.location.href = 'mailto:melray@melraysystems.com?subject=' + encodeURIComponent('Cotización de automatización — ' + nombre) + '&body=' + encodeURIComponent(mensaje)`.

**Nuevo CSS (`.cotizacion-form*`)**: layout en grid de 2 columnas en desktop (los campos `--full` ocupan las 2), 1 columna en mobile; inputs/textarea con el mismo tratamiento visual que el resto del sitio (fondo `--color-card`, borde sutil, foco visible con el color de acento), mismo `--space-*` que el resto de la sección.

## 4. Sección "Servicios" — reorden

Orden final de las tarjetas (antes: CRM, Automatizaciones, Websites, Paneles/Inventarios):

1. **Automatizaciones** → `automatizaciones.html`
2. **CRM** → `crm.html`
3. **Websites** → `websites.html`
4. **Paneles/Inventarios** → `inventario.html`

Se reutiliza el copy ya existente de cada tarjeta (sin cambios de texto, solo de orden). El único texto que cambia es el lead de la sección:

```html
<h2 class="section-head__lead">Construimos las herramientas digitales que tu negocio necesita, empezando por tu automatización.</h2>
```

## 5. Footer tagline

El footer dice hoy "Tu inventario. Sin el caos." — quedó así desde antes del reposicionamiento de CRM y ya no describe el producto protagonista (ni CRM ni ahora Automatización). Se actualiza a una línea corta en el mismo tono del nuevo H1:

```html
<p>Automatiza lo repetitivo. Enfócate en crecer.</p>
```

(Si al revisar el spec prefieres mantener el tagline actual o usar otro texto, es un cambio de una línea — avísalo en la revisión.)

## 6. Limpieza de código

Como nada fuera de `index.html` usa estos componentes (verificado con grep sobre todo el sitio):

- **`css/styles.css`**: se eliminan las reglas `.category-nav*`, `.planes__grid`, `.planes__single`, `.plan-card*` y `.plan-modal*` (con sus `@keyframes plan-modal-pop`/`plan-modal-fade`). Se agregan `.flow-diagram*` y `.cotizacion-form*`.
- **`js/main.js`**: se eliminan `initCategoryNav()`, `PLAN_DETAILS` e `initPlanModal()` junto con sus llamadas de inicialización. Se agrega `initCotizacionForm()` y su llamada.
- **`index.html`**: se eliminan las 4 `producto__row` de CRM/Webs/Inventario/placeholder-automatización (con sus referencias a `mockup-crm-*.png`, `mockup-catalogo.png`, etc.) y el `<dialog id="plan-modal">`.

Los archivos `mockup-crm-*.png` en `assets/` no se borran (quedan sin referenciar, disponibles para cuando se retome contenido de CRM).

## 7. Nav label + ancla: "Planes" → "Cotización"

El ancla `#planes` pasa a llamarse `#cotizacion` (la sección cambia de propósito: ya no son planes con precio, es un formulario). Se actualiza en **las 5 páginas del sitio** (cada una tiene el link duplicado en nav desktop y nav mobile, más el botón "Ver planes" del hero solo en `index.html`):

| Archivo | Ocurrencias a cambiar |
|---|---|
| `index.html` | nav desktop, nav mobile, botón hero "Ver planes" → "Ver cotización", `id="planes"` → `id="cotizacion"` |
| `websites.html` | nav desktop, nav mobile |
| `automatizaciones.html` | nav desktop, nav mobile |
| `crm.html` | nav desktop, nav mobile |
| `inventario.html` | nav desktop, nav mobile |

En todos los casos: texto visible "Planes" → "Cotización", `href="index.html#planes"` (o `href="#planes"` en `index.html`) → `...#cotizacion`.

## Testing / verificación

- Verificar que los campos obligatorios (nombre, email, teléfono, necesidad) bloquean el envío si están vacíos, y que un email con formato inválido también lo bloquea.
- Verificar que "Enviar por WhatsApp" abre `wa.me/5491127041868` en una pestaña nueva con el mensaje prellenado y los datos correctos.
- Verificar que "Enviar por email" abre el cliente de correo con asunto y cuerpo prellenados.
- Verificar que presionar Enter dentro de un input de texto no recarga la página.
- Verificar el diagrama de flujo en desktop (fila horizontal, pulso viajando) y en mobile 375px (apilado vertical, pulso vertical), y que se congela con `prefers-reduced-motion: reduce`.
- Verificar que los enlaces "Cotización" en las 5 páginas apuntan a `index.html#cotizacion` (o `#cotizacion` dentro de la propia home) y hacen scroll al formulario.
- Verificar responsive 375px de la sección Servicios reordenada.
- Grep final para confirmar que no quedan referencias a `category-nav`, `plan-modal`, `plan-card`, `PLAN_DETAILS`, `initCategoryNav` o `initPlanModal` en el código.
- Revisar accesibilidad del formulario: cada `label` asociado a su `input`/`textarea` por `for`/`id`, foco visible, orden de tabulación lógico.
