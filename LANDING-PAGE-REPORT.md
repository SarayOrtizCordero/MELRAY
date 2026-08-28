# Informe de Landing Page — melraysystems.com

**Página revisada:** `/` (index.html), servida localmente desde el estado actual del repo (commit `587caf8`) y desplegada en `https://melraysystems.com/`.

**Nota de alcance:** No encontré ninguna carpeta `ads/`, `campaign-brief.md`, ni creatividades de anuncios en este repo, y no hay ninguna cuenta de plataformas publicitarias conectada en esta sesión. Por eso, esta auditoría trata la home como su propia landing page y evalúa el "Message Match" contra la promesa del propio SEO/meta de la página, no contra un anuncio real en curso. Si tienes campañas activas en Google/Meta/TikTok apuntando aquí, vuelve a correr esto pasándome el copy del anuncio para poder puntuar el Message Match contra el titular/oferta real.

## Salud de la Landing Page

```
Message Match:    ██████░░░░  55/100
Velocidad:        ███████░░░  70/100
Móvil:            █████░░░░░  50/100
Señales de confianza: ████░░░░░░  35/100
Calidad del formulario: █████████░  85/100
```

**Puntuación ponderada: 59/100 — Nota D** (roza la C, que empieza en 60)

`(55×0.25) + (70×0.25) + (50×0.20) + (35×0.15) + (85×0.15) = 59.25`

---

## 🚨 Prioridad máxima (arreglar antes de invertir en ads)

### 1. Cero tracking de conversión — hoy la inversión en ads va a ciegas
No encontré GA4, tag de Google Ads, Meta Pixel/CAPI ni Pixel/Events API de TikTok en ningún sitio de `index.html` o `js/main.js`. Tampoco hay captura de `gclid`/`fbclid`/`ttclid`, ni se guardan los UTM para pasarlos al flujo de reserva de Calendly.

**Por qué esto pesa más que cualquier puntuación de arriba:** sin un píxel que dispare al reservar en Calendly (o como mínimo un evento de "Reserva agendada"), los algoritmos de Google y Meta no tienen ninguna señal para optimizar la entrega hacia quienes convierten, el Smart Bidding/Advantage+ no tiene de qué aprender, y tú no tienes forma de saber qué campaña/palabra clave/anuncio generó una demo agendada. Esto debería resolverse antes de cualquier gasto en ads, independientemente del diseño de la página.

**Solución:** añade el tag de Google Ads/GA4 y el Meta Pixel en el `<head>`, dispara un evento de conversión con el evento `calendly.event_scheduled` que Calendly manda por `postMessage` (lo expone de forma nativa, no hace falta ninguna librería extra), y guarda `gclid`/`fbclid`/los UTM en `sessionStorage` para poder registrarlos junto a cada reserva.

### 2. El banner de cookies tapa el CTA principal al cargar en móvil
Lo medí directamente en el navegador a 375×812 (viewport tipo iPhone): el banner de cookies se renderiza en `top: 529px, bottom: 788px`. El botón principal del hero, "Agendar una demo", está en `top: 753px, bottom: 811px` — **totalmente dentro del área del banner.** Un visitante móvil que llega por primera vez desde un anuncio no puede ver ni tocar el CTA principal hasta que primero descarta el banner.

Como el 75%+ de los clics en ads vienen de móvil, esto solo podría estarte costando una parte importante de las conversiones específicamente en tráfico de pago (el tráfico orgánico que ya descartó el banner vía `localStorage` no lo sufre — pero sí cada clic nuevo de un anuncio).

**Solución:** reduce el banner a una barra inferior más fina que no invada la zona del CTA, o reubícalo para que no tape la acción principal del "fold" (por ejemplo, arriba, o con menos texto).

### 3. El CTA principal está justo en el borde del fold en móvil — incluso sin el banner
Independientemente del banner de cookies, el borde inferior del CTA del hero está en `811px` dentro de un viewport de `812px` de alto. Los dispositivos reales tienen elementos del navegador (barra de direcciones, etc.) que reducen el viewport *utilizable* muy por debajo de la altura total de pantalla, así que en la mayoría de los móviles reales este CTA ya queda por debajo del fold. El video decorativo de la mascota (`261px`) se renderiza antes que el titular en móvil, empujando todo hacia abajo.

**Solución:** reduce o elimina el espacio vertical que ocupa el video en móvil, o reordena para que el titular + CTA aparezcan más arriba.

---

## Evaluación de Message Match — 55/100 (Coincidencia parcial)

- El `<title>` y la meta description arrancan con **"inventario"** ("Tu inventario. Sin el caos.", "sistema de gestión de inventario"), pero el `<h1>` de la página es genérico: *"Gestión simple para negocios que no paran de moverse"* — nunca dice "inventario". Un visitante que hace clic en un anuncio de búsqueda para la palabra clave "gestión de inventario" llega a un titular que no confirma visualmente que está en el lugar correcto, lo cual también juega en contra del componente de Landing Page Experience del Quality Score de Google.
- La claridad de la oferta está bien: "Agendar una demo" aparece en el header, el hero y una sección dedicada — el texto del CTA es consistente en toda la web (positivo).
- No hay inserción dinámica de palabras clave, ni variantes por geo/audiencia, ni estructura de test A/B — está bien para una sola página evergreen, pero significa que todas las campañas/palabras clave comparten el mismo titular sin importar la coincidencia.

**Recomendación:** añade "inventario" (o la palabra clave concreta por la que pujas) en el H1 o en el subtítulo, justo encima del fold.

## Evaluación de Velocidad — 70/100 (zona de aviso, estimado)

No se ejecutó ningún trace de Lighthouse/Core Web Vitals (no hubo throttling de red real en esta sesión) — esto es una estimación a partir del análisis estático + servidor local, no una puntuación de laboratorio de CWV.

**Bien:**
- Las capturas de producto por debajo del fold usan `loading="lazy"` — confirmado que no se descargan en la carga inicial.
- Las fuentes están auto-alojadas en `.woff2` con `font-display: swap`.
- No hay scripts de terceros aparte de Calendly (sin chats, sin heatmaps, sin tags de ads todavía — ver el hueco de tracking arriba).
- El peso *inicial* total de la página es moderado.

**Avisos:**
- El video de la mascota del hero (`mascota-hero.mp4`, 841 KB) se reproduce automáticamente al cargar la página sin ningún tipo de throttling por `preload` ni comprobación de conexión/ahorro de datos — en un aterrizaje desde un anuncio en 4G, eso es una parte importante del presupuesto de bytes inicial gastado en un elemento decorativo antes incluso de que se muestre la oferta.
- Las tres capturas de producto en PNG (95–147 KB cada una) no están comprimidas a WebP/AVIF. Como tienen lazy load no afectan a la carga inicial, pero siguen pesando 2–3 veces más de lo necesario para quien llegue a esa sección.
- El widget embebido de Calendly (sección "servicios") carga su propio JS/CSS/iframe — es esperable, pero conviene saber que es un bloque fijo de 700px de alto que tardará su tiempo en pintarse cuando se haga scroll hasta ahí.

## Experiencia Móvil — 50/100

Medido en un viewport de 375×812:

| Chequeo | Resultado |
|---|---|
| Scroll horizontal | ✅ Ninguno (confirma que el fix reciente del footer sigue funcionando) |
| Tamaño de fuente del body | ✅ 16px |
| Área táctil del menú hamburguesa | ❌ 38×30px — por debajo del mínimo de 48×48px |
| Altura táctil de los enlaces del footer | ❌ ~26px cada uno — por debajo de 48px, y muy juntos |
| CTA fijo en el header | ❌ `display: none` por debajo de 860px — el botón "Agendar una demo" del header desaparece por completo en móvil, sin ningún CTA persistente que lo sustituya. La única forma de reservar es hacer scroll hasta un CTA o abrir el menú hamburguesa. |
| Teléfono como enlace `tel:` | No aplica — no hay teléfono en la página |
| Interstitials que bloquean el contenido | ❌ El banner de cookies bloquea el CTA en la primera carga (ver Prioridad #2) |

**Recomendación:** o bien recuperar un CTA compacto en el header móvil (aunque sea solo un ícono), o añadir una barra de CTA fija en la parte inferior para móvil, ya que los CTA dentro del contenido no están garantizados por encima del fold.

## Señales de Confianza — 35/100

**Presentes:**
- Marcado schema.org de tipo `Organization` (ayuda al SEO, no es confianza visible)
- Email de contacto real y visible, y enlace a Instagram en el footer
- Páginas de Privacidad/Términos/Cookies existen y están enlazadas

**Ausentes (todos los elementos de confianza "por encima del fold" del checklist):**
- No hay número de clientes, puntuación de reseñas ni testimonio en ningún punto de la página
- No hay logos de clientes
- No hay sellos de seguridad/garantía cerca de los CTA
- No hay casos de éxito ni métricas con nombre — los enlaces "Ver demo en acción" llevan a instancias de demo del producto (`panel-basico.vercel.app`, etc.), no a prueba social

Esto es coherente con un producto en etapa temprana/pre-lanzamiento, así que puede ser más un tema de madurez del producto que de construcción de la landing — pero para tráfico de ads en concreto (visitantes más "fríos" que el orgánico o de referidos), la ausencia total de prueba social por encima del fold es la palanca más grande que queda, después del tracking y del problema del fold en móvil.

## Optimización del Formulario — 85/100

No hay un formulario de captación tradicional — la acción de conversión es reservar directamente a través de un widget de Calendly embebido/enlazado. Esto está cerca de la mejor práctica para tráfico de ads de la parte alta del embudo: cero campos personalizados que rellenar antes de agendar, y el propio flujo de Calendly (nombre + email) es un patrón de baja fricción ya muy probado.

**Huecos:**
- No se pasan los UTM/click-IDs al enlace de Calendly (relacionado con el hueco de tracking — Calendly admite parámetros `utm_*` de forma nativa; hoy se pierden).
- No hay pre-relleno de ningún dato conocido (no aplica al no haber formulario, pero conviene tenerlo en cuenta si en algún momento añades una pregunta de cualificación).

---

## Quick Wins, ordenados por impacto esperado

| # | Arreglo | Por qué |
|---|---|---|
| 1 | Disparar un evento de conversión al reservar en Calendly + añadir píxeles de GA4/Google Ads/Meta, y pasar `gclid`/`fbclid`/UTM en la URL de Calendly | Hoy la inversión en ads es imposible de medir u optimizar — el arreglo de mayor impacto, y no está reflejado en la puntuación de arriba |
| 2 | Evitar que el banner de cookies tape el CTA del hero en móvil | Bloquea directamente la acción de conversión principal para todo visitante nuevo en móvil |
| 3 | Subir el titular + CTA por encima del fold en móvil (reducir/reordenar el video del hero) | El tráfico de ads es 75%+ móvil; el CTA hoy está justo en el borde o por debajo del fold |
| 4 | Añadir "inventario" (o la palabra clave por la que pujas) en el H1 | Mejora el Message Match / Quality Score en campañas de búsqueda |
| 5 | Recuperar un CTA compacto en el header móvil, o añadir una barra de CTA fija en móvil | Elimina la fricción de "hacer scroll o abrir el menú para convertir" en móvil |
| 6 | Añadir al menos un elemento de confianza por encima del fold (número de clientes, una frase de testimonio, o una valoración) | El tráfico frío de ads convierte menos sin prueba social |
| 7 | Agrandar las áreas táctiles del hamburguesa y de los enlaces del footer a ≥48×48px | Usabilidad móvil / menos toques fallidos |
| 8 | Convertir las capturas PNG a WebP y considerar diferir el video del hero en conexiones móviles/ahorro de datos | Reduce el tiempo de carga en tráfico móvil de ads |
