# Melray — Modo mantenimiento con página 503 (diseño)

Fecha: 2026-08-24
Estado: aprobado por el usuario, pendiente de implementación

## 1. Contexto

Melray es un sitio estático (HTML/CSS/JS vanilla, sin frameworks ni build
tools, per `docs/superpowers/specs/2026-08-18-melray-landing-design.md`)
desplegado en Vercel con integración de GitHub (deploy automático en cada
push a `master`, configurado el 2026-08-24). El usuario pidió una "página
405" para cuando el sitio "no funcione o esté fuera de servicio"; se
clarificó con el usuario que el código correcto para ese caso es **503
Service Unavailable** (405 es "Método no permitido", no aplica aquí).

## 2. Alcance

- Un mecanismo para poner todo el sitio en modo mantenimiento bajo demanda,
  sirviendo una página de marca con status HTTP 503 en cualquier ruta.
- Activación/desactivación sin cambiar código ni hacer un nuevo commit: un
  toggle vía variable de entorno en el dashboard de Vercel.
- Fuera de alcance: páginas de error para otros códigos (404, 500), lógica
  de reintentos automáticos, notificaciones de estado, cualquier backend o
  base de datos.

## 3. Mecanismo: Vercel Routing Middleware

Un único archivo `middleware.js` en la raíz del proyecto implementa el
modo mantenimiento:

- **JavaScript plano, sin dependencias npm ni `package.json`** — respeta la
  restricción de "sin build tools" del sitio. No se importa `@vercel/functions`;
  el contrato usado es el más simple posible: devolver un `Response` para
  interceptar la petición, o no devolver nada (`undefined`) para dejarla
  pasar sin modificar.
- **Runtime `nodejs`** (Fluid Compute) — es la recomendación actual de
  Vercel por defecto sobre `edge`, que ya no ofrece ventaja para este caso.
- Sin `matcher` explícito: por defecto Routing Middleware corre en todas las
  rutas, que es exactamente el comportamiento deseado (cualquier URL del
  sitio debe devolver la página de mantenimiento mientras el modo esté
  activo).
- Lógica: si `process.env.MAINTENANCE_MODE === 'true'`, responde con la
  página de mantenimiento embebida, `status: 503` y header
  `Retry-After: 3600`. En cualquier otro caso, no hace nada (deja pasar la
  petición normal).

### 3.1. Activación

Se activa/desactiva seteando la variable de entorno `MAINTENANCE_MODE` a
`"true"`/`"false"` (o eliminándola) en Vercel → Settings → Environment
Variables, sin tocar código. Queda pendiente de verificar durante la
implementación si Vercel recoge el nuevo valor al instante o si hace falta
disparar un redeploy (p. ej. desde el dashboard, sin cambios de código) para
que la función lo tome — en cualquier caso, el usuario nunca edita código
para activar/desactivar el modo.

## 4. La página de mantenimiento (standalone)

Contenido embebido como string dentro de `middleware.js` — **no depende de
`css/styles.css` ni de las fuentes autoalojadas** (`.woff2`), para que no
pueda romperse por su cuenta durante una caída real:

- Logo de la llama de Melray: el mismo SVG con gradiente que ya usa el
  header (`index.html:47-55`), inline, sin depender de ningún archivo
  externo.
- Mensaje breve en el tono de marca ya establecido en el resto del sitio
  (directo, cálido, sin jerga): **"Estamos poniendo esto en orden. Volvemos
  enseguida."**
- Sin CTAs, formularios, ni enlaces — nada que dependa de que el resto del
  sitio funcione.
- CSS inline con los mismos tokens de color de marca
  (`#faf1e7` fondo, `#2c1a12` texto, `#fb7b15`/`#df3314` acento del logo),
  pero con pila de fuentes de sistema (`-apple-system, 'Segoe UI',
  sans-serif`) en vez de `@font-face` a los woff2 autoalojados, para no
  depender de que esos archivos carguen.
- `<title>` de la página: "Melray — Volvemos enseguida".
- `lang="es"` y `viewport` meta tag, igual que el resto del sitio.

## 5. Detalles técnicos

- Un solo archivo nuevo: `middleware.js` en la raíz del repo (mismo nivel
  que `index.html`).
- No se modifica `index.html`, `css/styles.css`, `js/main.js` ni ningún
  archivo existente.
- No se necesita `vercel.json` ni `vercel.ts` para este mecanismo — Routing
  Middleware se activa automáticamente al detectar `middleware.js` en la
  raíz, sin configuración adicional.
- El HTML de la página de mantenimiento se genera con un template literal
  de JavaScript dentro de `middleware.js` (única fuente de la verdad — no
  hay un `503.html` estático separado que deba mantenerse sincronizado).

## 6. Riesgos / limitaciones

- Si `MAINTENANCE_MODE` requiere un redeploy para tomar efecto (por
  confirmar en implementación), activar el modo no es 100% instantáneo,
  pero sigue sin requerir cambios de código — solo el toggle de la
  variable y un redeploy sin cambios (o el propio commit que crea
  `middleware.js`, que ya deja el mecanismo listo para usarse después).
- El modo mantenimiento cubre todo el sitio sin excepción (todas las
  rutas) — no hay forma de dejar una sola página accesible mientras está
  activo. Aceptado como comportamiento deseado dado el alcance definido.
