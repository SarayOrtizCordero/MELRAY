# Melray — Páginas de servicio (CRM, Websites, Automatizaciones) (diseño)

Fecha: 2026-09-01
Estado: aprobado por el usuario, pendiente de implementación

## 1. Contexto

La sección `#servicios` de `index.html` (ver `docs/superpowers/specs/2026-08-24-seccion-servicios-design.md`)
presenta tres tarjetas — Websites, CRM, Automatizaciones — con una
descripción corta y sin ningún enlace propio. El usuario quiere que cada
tarjeta lleve a una página independiente y dedicada a ese servicio, con
más información, un bloque de demo (a rellenar con contenido real más
adelante) y un CTA para agendar.

Este es el primero de tres proyectos independientes identificados en la
misma conversación (los otros dos: mejorar el vídeo de la mascota del
hero con una animación de fuego, y un flujo para generar anuncios de
vídeo a partir del contenido de la web con HyperFrames). Cada uno tiene
su propio diseño y plan; este documento cubre solo las páginas de
servicio.

## 2. Alcance

- Tres páginas HTML estáticas nuevas en la raíz del proyecto:
  `websites.html`, `crm.html`, `automatizaciones.html`.
- Un enlace nuevo al final de cada tarjeta en `#servicios` (`index.html`)
  apuntando a su página correspondiente.
- CSS nuevo en `css/styles.css` para las secciones de estas páginas.

Fuera de alcance:
- Contenido real de demo (capturas, vídeo, enlaces a proyectos). Se deja
  un placeholder marcado en el HTML; el usuario lo sustituye después.
- Precios con cifras — estos servicios son a medida, el CTA es agendar
  cotización (mismo patrón que el plan "Pro" en `#planes`).
- Cambios a `js/main.js` — el JS existente (`initScrollReveal`,
  `initMobileNav`, `initHeaderScroll`, `initFooterYear`) ya funciona por
  selección genérica de clases/IDs compartidos y no necesita cambios para
  que estas páginas nuevas funcionen.
- Los otros dos proyectos (vídeo del hero, generador de anuncios).

## 3. Estructura de página (las tres páginas comparten el mismo esqueleto)

1. **Header completo**, igual que `index.html` (logo, nav Inventario/
   Planes/Servicios — todos apuntando de vuelta a `index.html#...` desde
   estas páginas —, CTA "Agendar una demo", menú mobile). Debajo del
   header, un enlace `.service-back` "← Volver a Melray" apuntando a
   `index.html`.
2. **Hero del servicio** (`.service-hero`): H1 + subtítulo + CTA primario
   a Calendly.
3. **Qué incluye** (`.service-features`): grid de puntos con check-icon,
   mismo lenguaje visual que `.plan-card__teaser`.
4. **Demo** (`.service-demo`): marco tipo mockup (mismo patrón que
   `.producto__mockup`) conteniendo un placeholder con nota visible
   ("Estamos preparando ejemplos reales de este servicio — pronto podrás
   verlos aquí.") y un comentario HTML `<!-- DEMO: sustituir por
   capturas/vídeo reales -->` para que sea fácil de encontrar y
   reemplazar.
5. **Cierre / CTA** (`.service-cta`): mismo patrón que `.ver-accion__card`
   — mensaje corto + botón "Agendar cotización" a
   `https://calendly.com/charladeclaridad/demo-melray`.
6. **Footer**, idéntico al de `index.html`/páginas legales.

## 4. Contenido por página

### Websites (`websites.html`)
- `<title>`: "Websites — Melray"
- H1: "Sitios web que trabajan para tu negocio"
- Subtítulo: "Diseñamos y desarrollamos webs pensadas para tu negocio, tu
  cliente y tus objetivos — no plantillas genéricas."
- Qué incluye: diseño a medida para tu marca · optimizadas para
  velocidad y conversión · adaptadas a móvil desde el día uno · SEO
  técnico y estructura pensada para buscadores · integración con tus
  herramientas (calendario, CRM, pagos) · mantenimiento y soporte
  post-lanzamiento

### CRM (`crm.html`)
- `<title>`: "CRM — Melray"
- H1: "Un CRM simple para no perder ni un cliente"
- Subtítulo: "Centraliza clientes, conversaciones y oportunidades para
  tener un proceso comercial claro y organizado."
- Qué incluye: ficha única por cliente con todo su historial ·
  seguimiento de oportunidades y su estado · recordatorios para no dejar
  nada en el aire · vista clara de tu pipeline comercial · integración
  con tus canales de contacto · reportes simples de tu actividad
  comercial

### Automatizaciones (`automatizaciones.html`)
- `<title>`: "Automatizaciones — Melray"
- H1: "Menos tareas manuales, más tiempo para crecer"
- Subtítulo: "Conectamos tus herramientas y automatizamos procesos para
  reducir el trabajo repetitivo."
- Qué incluye: conexión entre las herramientas que ya usas ·
  automatización de tareas repetitivas · notificaciones y alertas
  automáticas · flujos a medida según tu operación · reducción de
  errores manuales · escalable a medida que crece tu negocio

Cada página lleva sus propios `<meta name="description">`,
`<link rel="canonical">` y Open Graph tags (mismo patrón que
`index.html`), con URL `https://melraysystems.com/<archivo>.html`.

## 5. Cambios en `index.html`

Cada `.servicios__card` gana un enlace al final:

```html
<article class="servicios__card reveal">
  <h3>CRM</h3>
  <p>Centraliza clientes, conversaciones y oportunidades para tener un proceso comercial claro y organizado.</p>
  <a href="crm.html" class="servicios__card-link">Ver CRM →</a>
</article>
```

(Análogo para Websites → `websites.html` y Automatizaciones →
`automatizaciones.html`.)

## 6. Detalles técnicos (CSS)

Se crean clases con espacio de nombres propio, sin reutilizar `.hero`,
`.producto`, etc. de la home (esas tienen reglas muy específicas —
p. ej. `.hero__art` posiciona el vídeo de la mascota — y mezclarlas
arriesga romper la home). Se reutilizan los design tokens existentes
(`--color-card`, `--radius-md`, `--shadow-sm`, `--space-*`,
`--font-heading`) y las clases de botón ya existentes (`.btn`,
`.btn--primary`, `.btn--secondary`).

- `.service-back` — enlace de texto simple bajo el header.
- `.service-hero` / `.service-hero__inner` — hero centrado, sin
  ilustración, padding vertical igual a `.hero`.
- `.service-features` / `.service-features__grid` — grid de 2 columnas
  en escritorio (los items son cortos, no necesitan 3 columnas como
  `.problema__grid`), 1 columna bajo el breakpoint de 860px (mismo
  breakpoint que el resto del sitio); cada item reutiliza el icono
  check SVG inline que ya usa `.plan-card__teaser-icon`.
- `.service-demo` / `.service-demo__frame` / `.service-demo__note` —
  mismo look de tarjeta con barra superior de puntos que
  `.producto__mockup` / `.producto__mockup-bar`, con `.service-demo__note`
  centrado dentro mostrando el texto placeholder.
- `.service-cta` — mismo patrón visual que `.ver-accion__card`
  (tarjeta centrada, sombra, CTA primario).
- `.servicios__card-link` — enlace con flecha al final de cada tarjeta
  de servicio en la home, estilo texto (no botón), color
  `--color-orange-dark`, con estado hover.
- Todos los bloques con animación de entrada llevan `.reveal`, igual que
  el resto del sitio (sin cambios en `js/main.js`).

## 7. Riesgos / limitaciones

- Tres archivos HTML nuevos duplican el boilerplate de header/footer
  (mismo trade-off ya aceptado en `privacidad.html`/`terminos.html`/
  `cookies.html` — no hay build tool en este proyecto para evitarlo).
- El bloque de demo queda visualmente "vacío" hasta que el usuario
  añada el contenido real; se decidió mostrar una nota explícita en vez
  de dejarlo en blanco para que no parezca un error.
- Sin cambios de infraestructura (Vercel, CSP) — son páginas estáticas
  del mismo origen, ya cubiertas por las reglas existentes en
  `vercel.json`.
