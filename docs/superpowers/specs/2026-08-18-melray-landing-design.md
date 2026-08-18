# Melray — Landing web de marca y producto (diseño)

Fecha: 2026-08-18
Estado: aprobado por el usuario, pendiente de implementación

## 1. Contexto

Melray es un sistema de gestión de inventario simple e inteligente para ecommerce
y tiendas de ropa pequeñas/medianas que hoy gestionan stock con Excel o papel.
Las co-founders (Melisa, Argentina — desarrollo de producto; Sarai, España —
contacto con clientes) necesitan una web para presentar el producto, sus planes
y captar contacto/interés de clientes potenciales, mientras terminan de validar
precios y el Plan Pro (visión futura, aún no disponible).

Toda la base de marca (misión, visión, valores, personalidad, tono de voz,
paleta, tipografías, mascota "el fueguito" y su sistema de expresiones) está
detallada en el documento de marca compartido por el usuario y se resume en
las secciones relevantes de este spec.

## 2. Alcance

- **Etapa**: híbrida. Web de venta ya con estructura completa (planes, producto,
  contacto), pero con precios "a consultar" y el Plan Pro marcado como
  "Próximamente", reflejando que el producto sigue en validación.
- **Páginas**:
  - `index.html` — landing única, scroll con navegación por anclas.
  - `privacidad.html`, `terminos.html`, `cookies.html` — páginas legales
    (necesarias por RGPD/LOPDGDD al recoger datos vía formulario).
- Fuera de alcance: blog/contenido educativo, área de cliente/login, backend
  propio, cualquier integración de pago.

## 3. Arquitectura técnica

Sitio estático plano, sin frameworks ni build tools, tal como se pidió
(HTML5 + CSS3 + JS vanilla). Despliegue en Vercel como sitio estático
(zero-config).

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
│   ├── favicon.svg (+ variantes .png/.ico)
│   ├── og-image.png
│   └── mascota/  (SVGs: feliz, durmiendo, on-fire, pensando, con-café)
└── fonts/
    ├── inter/ (woff2 autoalojado)
    └── open-sans/ (woff2 autoalojado)
```

El header y footer se duplican en las 3 páginas legales (sin sistema de
plantillas): son solo 3 páginas simples y evita añadir tooling.

Las fuentes (Inter Regular, Open Sans Regular) se autoalojan en vez de cargarse
desde Google Fonts, para evitar transferencias de IP a servidores de Google
(cuestión RGPD) y mejorar rendimiento/privacidad.

## 4. Estructura de la landing (`index.html`)

1. **Header fijo** — logo (SVG del fueguito + wordmark "melray"), navegación
   por anclas (Producto · Planes · Nosotras · Contacto), CTA "Hablar con
   nosotras", menú hamburguesa en móvil. Se compacta visualmente al hacer
   scroll.
2. **Hero** — titular "Tu negocio está creciendo. Tu Excel no." + subtítulo
   "Tu inventario. Sin el caos." + CTA doble (Contactar / Ver planes) +
   mascota animada (flotación suave + parpadeo).
3. **El problema** — 3 puntos breves sobre el caos de gestionar stock con
   Excel/papel, para conectar con el dolor real antes de presentar la
   solución.
4. **Producto hoy** — qué resuelve Melray ahora mismo: productos, entradas y
   salidas, stock actual, control básico. Con iconografía simple.
5. **Planes** — 3 tarjetas:
   - **Básico**: control esencial (productos, entradas/salidas, stock
     actual). CTA "Precio a consultar" → ancla al formulario de contacto.
   - **Intermedio**: todo lo anterior + Top 5 más vendidos, Top 5 con menos
     movimiento, información de proveedores. CTA "Precio a consultar".
   - **Pro**: evaluación financiera, rentabilidad, predicciones,
     automatizaciones, IA. Marcado visualmente como **"Próximamente"**
     (badge/estado deshabilitado, sin CTA de contacto directo).
6. **La mascota / personalidad** — showcase de 4-5 expresiones del fueguito
   con su copy de marca asociado (p. ej. "Nos quedan 8. Maybe we should do
   something about that." para stock bajo; "Este lleva 93 días chillin'."
   para sin movimiento; "Okayyy, este está on fire." para muy vendido). Es el
   gancho diferencial de marca en la web.
7. **Nosotras** — Melisa (Argentina, desarrollo de producto) y Sarai (España,
   contacto con clientes), como co-founders. Avatares ilustrados (iniciales o
   icono estilizado con la paleta de marca) — no se generan fotos realistas
   de las fundadoras.
8. **CTA final / formulario de contacto** — campos: nombre, email, negocio
   (opcional), mensaje. Envío vía Formspree (servicio externo). El usuario
   deberá crear su propia cuenta gratuita en formspree.io y proporcionar el
   endpoint del formulario — la creación de cuentas de terceros no la puede
   hacer el asistente. Hasta entonces, el formulario queda maquetado y
   validado en cliente, apuntando a un endpoint placeholder claramente
   señalado en el código.
9. **Footer** — logo, enlace a Instagram, enlaces a las 3 páginas legales,
   copyright.

## 5. Diseño visual

- **Colores** (paleta de marca, ya definida):
  - `#fb7b15` naranja claro — acentos, hover
  - `#df3314` naranja oscuro — CTAs primarios
  - `#b11e1b` rojo — detalles, subrayados (como en el logo "melray")
  - `#faf1e7` / `#f8f4e9` — fondos (light orange)
  - Texto: gris oscuro neutro (no negro puro) para buen contraste sobre
    fondos cálidos.
- **Tipografía**: Inter (titulares) + Open Sans (cuerpo). Jerarquía clara,
  tamaños generosos, buen interlineado.
- **Mascota**: SVG inline recreado (gradiente naranja→rojo, ojos y sonrisa
  simples), con variantes de expresión reutilizables como componentes SVG.
- **Animaciones**: scroll-reveal (fade + slide al entrar en viewport vía
  IntersectionObserver), flotación suave de la mascota (CSS keyframes),
  parpadeo periódico, header compactado al hacer scroll, elevación en hover
  de tarjetas de planes, transición suave del menú móvil. Todas las
  animaciones respetan `prefers-reduced-motion: reduce`.
- **Tono de copy**: español de España como idioma principal; toques de
  spanglish/personalidad de marca en microcopy y estados (no en contenido
  crítico de comprensión), siguiendo el documento de marca.

## 6. SEO y metadatos

- `<title>` y `<meta name="description">` específicos por página.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:type`,
  `og:locale=es_ES`) y Twitter Cards.
- JSON-LD `Organization` con nombre, logo y descripción de Melray.
- `lang="es"`, canonical URL por página.
- `sitemap.xml` y `robots.txt`.
- Favicon en varios tamaños (SVG + PNG fallback + ICO).
- Texto alternativo descriptivo en todas las imágenes/SVGs con contenido
  informativo.
- HTML semántico: `header`/`nav`/`main`/`section`/`footer`, un único `h1`
  por página, jerarquía de encabezados correcta.

## 7. Accesibilidad

- Contraste AA verificado para texto sobre los fondos cálidos de marca.
- Foco visible (`:focus-visible`) en todos los elementos interactivos.
- Formulario con `<label>` asociados, mensajes de error accesibles
  (`aria-live` donde corresponda), navegable por teclado.
- Menú móvil operable por teclado y con `aria-expanded`.
- Sitio responsive mobile-first (breakpoints: móvil, tablet, desktop).

## 8. Legal (páginas RGPD)

- `privacidad.html`, `terminos.html`, `cookies.html`: plantillas estándar en
  español adaptadas a RGPD/LOPDGDD, con placeholders para datos identificativos
  de la empresa (razón social, NIF, dirección) que las fundadoras deberán
  rellenar. Se señalará explícitamente en el propio documento entregado que
  estas plantillas son un punto de partida y no sustituyen la revisión de
  un profesional legal.
- Página de cookies: se documenta honestamente que, salvo cookies técnicas
  necesarias, no se usa analítica ni tracking de terceros por ahora. Se
  incluye un aviso de cookies discreto y no bloqueante (banner dismissible
  vía `localStorage`) para dejar la puerta abierta a analítica futura sin
  rehacer la página.

## 9. Formulario de contacto — detalle técnico

- Validación en cliente (HTML5 `required`, `type=email`, mensajes de error
  accesibles).
- Envío vía `fetch` a un endpoint de Formspree (`https://formspree.io/f/XXXXX`,
  placeholder hasta que el usuario cree su cuenta).
- Estado de éxito/error mostrado inline sin recargar la página.
- Sin almacenamiento de datos en el propio sitio (no hay backend).

## 10. Despliegue

- Vercel, proyecto estático (sin `vercel.json` salvo que se necesiten
  redirects/headers específicos).
- Se generará una URL de vista previa para validar antes de producción.
- Dominio propio: pendiente de decisión de las fundadoras (fuera de alcance
  de este spec; se documentará cómo conectarlo cuando lo tengan).

## 11. Testing / verificación antes de dar por terminado

- Revisión visual en el navegador embebido: desktop, tablet y móvil.
- Verificación de navegación por anclas, menú móvil, formulario (estado
  éxito/error simulado), animaciones y `prefers-reduced-motion`.
- Verificación de metadatos (title/description/OG) por página.
- Comprobación de contraste de color en los textos principales.
- Sin pruebas automatizadas (no aplica: no hay lógica de negocio, es un
  sitio de contenido/marketing).

## 12. Fuera de alcance (explícito)

- Blog o sección de contenido educativo ("Melray Knows Stuff").
- Cualquier backend propio, base de datos o autenticación.
- Precios reales/definitivos de los planes.
- Contenido o calendario de Instagram (documentado en el brief de marca,
  pero no parte de esta web).
- Creación de cuentas de terceros (Formspree) en nombre del usuario.
