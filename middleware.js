import { next } from '@vercel/functions';

const MAINTENANCE_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Melray — Volvemos enseguida</title>
<style>
  :root {
    --color-orange-light: #fb7b15;
    --color-orange-dark: #df3314;
    --color-bg: #faf1e7;
    --color-text: #2c1a12;
    --color-text-muted: #6b5748;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-align: center;
    padding: 1.5rem;
  }
  .card { max-width: 420px; }
  .card svg { margin: 0 auto 1.5rem; display: block; }
  h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; }
  p { font-size: 1rem; line-height: 1.5; color: var(--color-text-muted); }
</style>
</head>
<body>
  <div class="card">
    <svg width="56" height="56" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fb7b15"/>
          <stop offset="1" stop-color="#df3314"/>
        </linearGradient>
      </defs>
      <path fill="url(#logoGrad)" d="M15 2.3C18.3 6.3 22.2 10.8 22.8 16.2C23.7 11.7 22.2 8.3 20.7 6.3C23.7 8.7 25.8 13.2 25.5 18.3C25.5 25.2 20.9 30.3 15 30.3C9.2 30.3 4.5 25.2 4.5 18.3C4.5 13.8 6.9 10.2 10.2 7.5C9 10.2 9.3 13.2 11.1 15C10.5 10.8 12.3 6.3 15 2.3Z"/>
      </svg>
    <h1>Estamos poniendo esto en orden.</h1>
    <p>Volvemos enseguida.</p>
  </div>
</body>
</html>`;

export const config = {
  runtime: 'nodejs',
};

export default function middleware(request) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return new Response(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '3600',
      },
    });
  }
  return next();
}
