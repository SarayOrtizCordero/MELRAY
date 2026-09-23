function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.hidden = isOpen;
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  });
}

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const STORAGE_KEY = document.documentElement.getAttribute('data-theme-key') || 'melray-theme';

  const syncButton = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-checked', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  };
  syncButton();

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(STORAGE_KEY, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    }
    syncButton();
  });
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-banner-accept');
  if (!banner || !acceptBtn) return;

  const STORAGE_KEY = 'melray_cookie_notice_dismissed';

  if (!localStorage.getItem(STORAGE_KEY)) {
    banner.hidden = false;
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    banner.hidden = true;
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function initCotizacionForm() {
  const form = document.getElementById('cotizacion-form');
  const whatsappBtn = document.getElementById('cotizacion-whatsapp');
  const emailBtn = document.getElementById('cotizacion-email');
  if (!form || !whatsappBtn || !emailBtn) return;

  const WHATSAPP_NUMBER = '5491127041868';
  const EMAIL_TO = 'melray@melraysystems.com';

  form.addEventListener('submit', (event) => event.preventDefault());

  function buildMessage() {
    const nombre = form.nombre.value.trim();
    const negocio = form.negocio.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const necesidad = form.necesidad.value.trim();
    const herramientas = form.herramientas.value.trim();

    const lines = ['Hola, quiero cotizar una automatización:', `Nombre: ${nombre}`];
    if (negocio) lines.push(`Negocio: ${negocio}`);
    lines.push(`Email: ${email}`, `Teléfono: ${telefono}`, `Qué necesita automatizar: ${necesidad}`);
    if (herramientas) lines.push(`Herramientas actuales: ${herramientas}`);

    return { nombre, message: lines.join('\n') };
  }

  whatsappBtn.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const { message } = buildMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
  });

  emailBtn.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const { nombre, message } = buildMessage();
    const subject = `Cotización de automatización — ${nombre}`;
    window.location.href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}

function initDemosToggle() {
  const toggle = document.getElementById('demos-toggle');
  const grid = document.getElementById('demos-grid');
  if (!toggle || !grid) return;
  const label = toggle.querySelector('.demos__toggle-label');

  toggle.addEventListener('click', () => {
    const expanded = grid.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? toggle.dataset.less : toggle.dataset.more;
  });
}

function initDemoForm() {
  const form = document.getElementById('demo-form');
  const confirmBox = document.getElementById('demo-confirm');
  if (!form || !confirmBox) return;

  const WHATSAPP_NUMBER = '5491127041868';
  const submitBtn = document.getElementById('demo-submit');
  const noteSent = document.getElementById('demo-note-sent');
  const noteFallback = document.getElementById('demo-note-fallback');
  const waSent = document.getElementById('demo-wa-sent');
  const waFallback = document.getElementById('demo-wa-fallback');

  const field = (name) => form.elements[name].value.trim();
  const payload = () => ({
    nombre: field('nombre'),
    instagram: field('instagram'),
    web: field('web'),
    telefono: field('telefono'),
    email: field('email'),
    detalle: field('detalle'),
    empresa_web: field('empresa_web'),
  });

  function whatsappUrl(data) {
    const lines = ['Hola, quiero mi demo personalizada:', `Nombre: ${data.nombre}`];
    if (data.instagram) lines.push(`Instagram: ${data.instagram}`);
    if (data.web) lines.push(`Web actual: ${data.web}`);
    lines.push(`WhatsApp / teléfono: ${data.telefono}`, `Correo: ${data.email}`);
    if (data.detalle) lines.push(`Detalle: ${data.detalle}`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  // El envío real es POST /api/demo (correo por SMTP). Si falla —o si la
  // función aún no está configurada— se abre WhatsApp con el mensaje escrito.
  async function sendByEmail(data) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      return response.ok;
    } catch (err) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = payload();
    const label = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    form.classList.add('is-sending');

    const sent = await sendByEmail(data);
    const wa = whatsappUrl(data);

    if (sent) {
      waSent.href = wa;
    } else {
      waFallback.href = wa;
      noteSent.hidden = true;
      noteFallback.hidden = false;
      const link = document.createElement('a');
      link.href = wa;
      link.target = '_blank';
      link.rel = 'noopener';
      link.click();
    }

    form.hidden = true;
    form.classList.remove('is-sending');
    submitBtn.disabled = false;
    submitBtn.textContent = label;
    confirmBox.hidden = false;
    confirmBox.focus();
  });
}

function runSafely(fn) {
  try {
    fn();
  } catch (err) {
    console.error(`Melray: ${fn.name} failed`, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  runSafely(initMobileNav);
  runSafely(initThemeToggle);
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initCotizacionForm);
  runSafely(initDemosToggle);
  runSafely(initDemoForm);
});
