# Melray — Sección "Inventario hoy" como showcase visual (diseño)

Fecha: 2026-08-21
Estado: aprobado por el usuario, pendiente de implementación

## 1. Contexto

La sección `#producto` de `index.html` (título visible "Inventario hoy") hoy es
puro texto: 3 columnas con título + descripción de features, sin ningún
elemento visual. El propio HTML ya trae un comentario dejado por el usuario
anticipando esto: `<!-- SECTION:PRODUCTO Donde iran videos y demás de los
productos, enseñándolo -->`.

El objetivo es convertir esta sección en un showcase del producto (el
software de inventario) con imágenes/video de la interfaz, no solo texto.

Restricción clave: **todavía no existen capturas de pantalla ni videos reales
de la app** en el repo (`assets/` solo tiene el video/poster de la mascota del
hero). El usuario decidió no bloquear el diseño por eso: se construyen
mockups ilustrados de la interfaz con HTML/CSS, pensados para ser
reemplazados por `<img>`/`<video>` reales más adelante sin rehacer el layout.

## 2. Alcance

- Rediseño de la sección `#producto` en `index.html` y sus estilos en
  `css/styles.css`.
- Los 3 mensajes de producto ya existentes (catálogo, movimientos, consulta de
  stock) se mantienen tal cual — el copy no se toca, solo se le agrega
  acompañamiento visual.
- Fuera de alcance: capturas/videos reales de la app (se integrarán en una
  iteración futura, cuando existan), cambios de copy, cambios a otras
  secciones de la landing.

## 3. Estructura visual

3 filas alternadas (`.producto__row`), una por feature, alternando el lado del
mockup (izquierda/derecha) fila a fila. En mobile (mismo breakpoint existente,
860px) se apilan: mockup arriba, texto abajo, mismo orden de lectura en las
3 filas.

Cada mockup vive dentro de un marco tipo "ventana de navegador" (barra
superior con 3 puntos, como un browser chrome) para que se lea inequívocamente
como "vista de la app", usando la paleta ya definida en `styles.css`
(`--color-bg`, `--color-card`, `--color-orange-light/dark`, `--color-red`,
`--color-text`) — nunca placeholders grises genéricos.

## 4. Contenido de cada mockup (ilustrado, HTML/CSS puro)

1. **"Todo tu catálogo. En un solo lugar."** — mockup de tabla de catálogo:
   filas de producto con miniatura de color, nombre, SKU y stock.
2. **"Cada movimiento, bajo control."** — mockup de timeline de
   entradas/salidas: filas con flecha ↑/↓, cantidad y fecha. Incluye una
   animación sutil en loop (una fila entra con fade/slide) para sugerir
   movimiento sin necesitar un video real.
3. **"Lo que tienes. Cuando necesitas saberlo."** — mockup de panel de
   consulta: buscador + tarjeta de resultado con el stock actual en grande.

## 5. Detalles técnicos

- Nueva clase `.producto__row` (grid de 2 columnas) reemplaza
  `.producto__grid`; modificador (`.producto__row--reverse` o vía
  `:nth-child(even)`) controla la alternancia de lado.
- Los mockups son bloques HTML/CSS puros, sin imágenes pesadas ni
  dependencias externas.
- Respetan la clase `.reveal` existente para el scroll-reveal, y la animación
  de "fila entrando" en el mockup 2 se desactiva bajo
  `prefers-reduced-motion: reduce` (mismo patrón que `.reveal` ya usa en
  `styles.css`).
- Sin JS nuevo: toda la animación de los mockups es CSS (`@keyframes`).
- El copy de la sección (eyebrow, lead, párrafo intro, cierre) no cambia.

## 6. Camino de reemplazo futuro

Cuando existan capturas/videos reales, cada mockup se reemplaza por un
`<img>` o `<video>` dentro del mismo marco de "ventana de navegador",
manteniendo `.producto__row` sin cambios estructurales.
