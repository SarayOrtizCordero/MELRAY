# Melray — Sección "Más allá del inventario" (Servicios) (diseño)

Fecha: 2026-08-24
Estado: aprobado por el usuario, pendiente de implementación

## 1. Contexto

El usuario quiere comunicar en la landing que Melray no es solo el sistema
de inventario que ya vende (secciones "Inventario hoy" y "Planes"), sino
que también ofrece otros servicios digitales: websites, CRM y
automatizaciones. El contenido lo aportó el usuario en español de
Argentina (formas "vos": "Centralizá", "sabés", "necesitás") y pidió
adaptarlo a español de España, consistente con el resto del sitio (ya
adaptado en un commit previo: "adapt to Spain Spanish, switch to
demo-booking model").

## 2. Alcance

- Una nueva sección `#servicios` en `index.html`, entre `#planes` y
  `#demo`.
- Un enlace nuevo en la navegación (escritorio y mobile) apuntando a esa
  sección.
- Fuera de alcance: precios para estos servicios (el CTA es agendar una
  reunión, no comprar un plan), cambios a las secciones Inventario o
  Planes existentes, un enlace de Cal.com específico para esta reunión
  (se reutiliza el mismo placeholder `https://cal.com/TU-ENLACE-AQUI` que
  ya usan los demás CTAs del sitio).

## 3. Estructura y contenido

Sigue el mismo patrón de `.section-head` que ya usan "Inventario hoy" y
"Planes" (eyebrow + lead + párrafo intro), seguido de un grid de 3
tarjetas (mismo lenguaje visual que la sección "Problema": tarjetas
blancas con sombra, sin iconos), y un cierre centrado con CTA:

```
Eyebrow:  Más allá del inventario
Lead:     Melray no es solo un sistema de inventario.
Intro:    Creamos soluciones digitales que acompañan las distintas
          necesidades de tu negocio para hacer tu día a día más simple.

Tarjeta 1 — Websites
  Diseñamos y desarrollamos sitios web pensados para tu negocio, tu
  cliente y tus objetivos.

Tarjeta 2 — CRM
  Centraliza clientes, conversaciones y oportunidades para tener un
  proceso comercial claro y organizado.

Tarjeta 3 — Automatizaciones
  Conectamos herramientas y automatizamos procesos para reducir tareas
  manuales y hacer tus operaciones más eficientes.

Cierre:   ¿No sabes exactamente qué necesitas? Empecemos por entender tu
          negocio.
CTA:      Agendar una reunión → https://cal.com/TU-ENLACE-AQUI
```

Todo el texto aportado por el usuario en formas "vos" se adapta a "tú"
(Centralizá → Centraliza, sabés → sabes, necesitás → necesitas), y se
corrige la concordancia de número en la tarjeta de Automatizaciones
("más eficiente" → "más eficientes", concuerda con "operaciones").

## 4. Navegación

Se agrega un ítem "Servicios" al menú de navegación, tanto en
`.site-header__nav` (escritorio) como en `#mobile-menu` (mobile),
enlazando a `#servicios`.

> **Corrección post-revisión (2026-08-24):** esta sección decía
> originalmente que el ítem se ubica "entre Inventario y Planes", con la
> justificación (incorrecta) de que era "el mismo orden en que las
> secciones aparecen en la página". Eso contradecía la §2, que ubica la
> sección "entre `#planes` y `#demo`" — el orden real de scroll es
> Inventario → Planes → Servicios → Demo. Una revisión final detectó que
> el menú implementado según el texto original (Inventario → Servicios →
> Planes → Demo) no coincidía con el orden real de las secciones,
> generando un bug de navegación (el link "Servicios" saltaba el scroll
> por delante de "Planes"). Corregido: el orden del nav es
> **Inventario → Planes → Servicios → Demo**, coincidiendo con el orden
> real de scroll de la página.

## 5. Detalles técnicos

- Nuevas clases CSS con espacio de nombres propio (`.servicios`,
  `.servicios__grid`, `.servicios__card`, `.servicios__closing`),
  reutilizando los design tokens existentes (`--color-card`,
  `--radius-md`, `--shadow-sm`, `--space-*`, `--font-heading`) — mismo
  patrón que usa cada sección del sitio hoy (no existe una clase
  "genérica" de tarjeta compartida entre `.problema__card`,
  `.producto__mockup`, etc., así que esta sección sigue esa convención en
  vez de introducir una).
- Grid de 3 columnas en escritorio, apilado a 1 columna en el breakpoint
  existente de 860px (mismo breakpoint que usan `.problema__grid` y
  `.producto__row`).
- El bloque de cierre (`.servicios__closing`) centra el párrafo y el
  botón, replicando el patrón ya usado en `.demo-cta__inner`.
- El botón reutiliza la clase `.btn.btn--primary` ya existente (mismo
  estilo que "Agendar una demo").
- Los elementos con scroll-reveal existente (`.reveal`) se aplican al
  `.section-head`, cada tarjeta, y el bloque de cierre — mismo patrón que
  el resto del sitio.
- No se modifica `js/main.js` (JS existente, `initScrollReveal` ya
  selecciona `.reveal` genéricamente, sin cambios necesarios).
- No se modifican las secciones `#producto` ni `#planes`.

## 6. Riesgos / limitaciones

Ninguno relevante — es contenido estático nuevo, mismo patrón que
secciones existentes, sin mecanismos nuevos (a diferencia del middleware
de mantenimiento del mismo día, esto no toca infraestructura de Vercel).
