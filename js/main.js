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

function initDemoForm() {
  const form = document.getElementById('demo-form');
  const confirmBox = document.getElementById('demo-confirm');
  if (!form || !confirmBox) return;

  // No hay backend todavía: al enviar, se abre WhatsApp con los datos ya
  // escritos. Si más adelante se conecta un endpoint, reemplazar el bloque
  // marcado abajo y mantener el mensaje de confirmación.
  const WHATSAPP_NUMBER = '5491127041868';

  function buildMessage() {
    const field = (name) => form.elements[name].value.trim();
    const lines = ['Hola, quiero mi demo personalizada:', `Nombre: ${field('nombre')}`];
    if (field('instagram')) lines.push(`Instagram: ${field('instagram')}`);
    if (field('web')) lines.push(`Web actual: ${field('web')}`);
    lines.push(`WhatsApp / teléfono: ${field('telefono')}`, `Correo: ${field('email')}`);
    if (field('detalle')) lines.push(`Detalle: ${field('detalle')}`);
    return lines.join('\n');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    // --- envío: reemplazar este bloque si se conecta un backend ---
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
    // --- fin envío ---

    form.hidden = true;
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
  runSafely(initDemoForm);
});
