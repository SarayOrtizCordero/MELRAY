# Melray — Capturas reales + tilt 3D en las tarjetas de Inventario (diseño)

Fecha: 2026-08-25
Estado: aprobado por el usuario, pendiente de implementación

## 1. Contexto

La sección "Inventario hoy" (`#producto`) tiene 3 tarjetas mockup
ilustradas con HTML/CSS puro (catálogo, movimientos, consulta de stock),
construidas como placeholder hasta tener capturas reales del producto —
documentado explícitamente en
`docs/superpowers/specs/2026-08-24-seccion-producto-showcase-design.md`
§6 y §6.1 (camino de reemplazo futuro: hook `.producto__mockup-body--media`
con `padding: 0`, y remoción manual de `aria-hidden` al pasar a contenido
real). El usuario ya tiene esas capturas reales — de los paneles
`panel-basico.vercel.app` y `panel-intermedio.vercel.app`, los mismos que
enlazan los botones "Ver demo en acción" — y pidió reemplazar los mockups
ilustrados por esas capturas, además de agregar una interacción de tilt 3D
al pasar el mouse y una sombra de marca.

Restricción de proceso: el usuario compartió las capturas pegándolas en el
chat; no existe una herramienta en este entorno para persistir contenido
pegado en el chat como archivo. Se resolvió pidiéndole la ruta donde ya
estaban guardadas (`C:\Users\Usuario\Pictures\Screenshots`), confirmada
como 7 archivos con timestamp 2026-08-25 14:12–14:14.

## 2. Alcance

- Reemplazar el contenido ilustrado de las 3 `.producto__mockup-body` en
  `index.html` por `<img>` reales.
- Agregar interacción de tilt 3D (JS vanilla, sin librerías) a las 3
  tarjetas `.producto__mockup`.
- Agregar sombra de marca (naranja/rojo) al pasar el mouse.
- Fuera de alcance: recorte/edición de las imágenes fuente (no hay
  herramienta de edición de imágenes en este entorno — el encuadre se
  resuelve con CSS `object-fit`, sin tocar los archivos), cambios al copy
  de las 3 tarjetas, capturas para las otras 4 imágenes que el usuario
  compartió pero no se usan (Proveedores, Añadir producto, Importar Excel
  ×2) — quedan en `Pictures\Screenshots` sin copiar al proyecto.

## 3. Selección y mapeo de capturas

De las 7 capturas en `C:\Users\Usuario\Pictures\Screenshots\`, se usan 3
(confirmado con el usuario):

| Tarjeta | Archivo fuente | Contenido |
|---|---|---|
| "Todo tu catálogo. En un solo lugar." | `Captura de pantalla 2026-08-25 141248.png` | Panel Intermedio, pestaña Productos: tabla con SKU, proveedor, stock |
| "Cada movimiento, bajo control." | `Captura de pantalla 2026-08-25 141240.png` | Panel Intermedio, Dashboard: "Top 5 más vendidos" / "Top 5 sin movimiento" |
| "Lo que tienes. Cuando necesitas saberlo." | `Captura de pantalla 2026-08-25 141214.png` | Panel Básico: tarjetas resumen (Total de productos, Listos para vender, % Disponible) |

Se copian a `assets/` con nombres descriptivos:
`assets/mockup-catalogo.png`, `assets/mockup-movimientos.png`,
`assets/mockup-consulta.png`.

## 4. Encuadre sin editar las imágenes

Las capturas son pantallas completas (~1889px de ancho); la tarjeta donde
se muestran mide ~500-600px. En vez de recortar los archivos (no hay
herramienta disponible), el encuadre se resuelve en CSS:

- El contenedor `.producto__mockup-body--media` tiene una altura fija
  (`320px`) y `overflow: hidden`.
- La `<img>` dentro usa `object-fit: cover; object-position: top;` —
  escala la captura completa y recorta visualmente lo que no cabe,
  mostrando la parte superior (donde está el contenido relevante en las 3
  capturas elegidas). El archivo original nunca se modifica.

## 5. Accesibilidad — quitar `aria-hidden`, agregar `alt`

Las 3 capturas ahora son contenido informativo real, no decorativo. Por
cada una:

- Se quita `aria-hidden="true"` del `.producto__mockup` que la contiene
  (tal como ya anticipaba §6.1 del spec de la sección Producto).
- Se agrega un `alt` descriptivo a cada `<img>`:
  - Catálogo: "Captura del panel de inventario Melray mostrando la lista
    de productos con SKU, proveedor y stock."
  - Movimientos: "Captura del panel de inventario Melray mostrando los
    productos más vendidos y los productos sin movimiento."
  - Consulta: "Captura del panel de inventario Melray mostrando el
    resumen de stock: total de productos, listos para vender y
    porcentaje disponible."

## 6. Tilt 3D al pasar el mouse

Nueva función en `js/main.js` (JS vanilla, sin dependencias), aplicada a
las 3 `.producto__mockup`:

- En `mousemove` sobre la tarjeta: calcula la posición del cursor
  relativa al centro de la tarjeta y aplica
  `transform: perspective(800px) rotateX(±8deg) rotateY(±8deg) scale3d(1.02,1.02,1.02)`
  — la tarjeta se inclina siguiendo al cursor, con un tope de 8°.
- En `mouseleave`: quita el transform inline, volviendo suavemente
  (transición CSS) a la posición neutral.
- Se desactiva por completo si `prefers-reduced-motion: reduce` está
  activo (mismo criterio que ya usa el resto del sitio para
  `.hero-video` y `.reveal`) — no se registran los listeners.
- Sin cambios a `initScrollReveal`, `initMobileNav`, ni ninguna función
  existente de `js/main.js` — se agrega una función nueva
  (`initMockupTilt`) y se registra junto a las demás en el
  `DOMContentLoaded` existente, siguiendo el patrón `runSafely(...)` ya
  usado para cada `init*`.

## 7. Sombra de marca al hover

`.producto__mockup:hover` gana un `box-shadow` con los colores de marca
(mezcla naranja/rojo, p. ej. `0 20px 40px rgba(223, 51, 20, 0.35)`),
reemplazando visualmente la sombra neutra (`--shadow-md`) mientras dura el
hover. Transición suave vía `transition: box-shadow 200ms ease` en la
clase base (ya existe `transition` en algunos componentes del sitio con
este mismo patrón, p. ej. `.plan-card:hover`).

## 8. Detalles técnicos

- Archivos modificados: `index.html` (las 3 tarjetas), `css/styles.css`
  (encuadre + sombra + transición), `js/main.js` (nueva función de tilt).
- Archivos nuevos: `assets/mockup-catalogo.png`,
  `assets/mockup-movimientos.png`, `assets/mockup-consulta.png` (copiados
  desde `Pictures\Screenshots`, sin editar).
- No se toca el copy de las 3 tarjetas (`<h3>`/`<p>` de cada
  `.producto__text`), ni la estructura de filas alternadas
  (`.producto__row`) ya existente.
- No se necesita ningún build tool ni dependencia nueva — sigue la
  restricción "sin build tools" del sitio.

## 9. Riesgos / limitaciones

- Al no poder recortar las imágenes, el encuadre depende de que la parte
  superior de cada captura sea la más relevante — es así para las 3
  elegidas, pero si en el futuro se cambia alguna captura por otra con
  contenido importante más abajo, habrá que ajustar `object-position` o
  recortar el archivo por fuera de este flujo.
- El tilt 3D es un efecto solo de mouse (hover) — en dispositivos táctiles
  no hay `mousemove` continuo, así que las tarjetas se ven y comportan
  como antes (sin tilt), sin necesidad de código adicional para mobile.
