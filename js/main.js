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

function initReducedMotionVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
}

// NOTE: still called below — inventario.html's own SECTION:SERVICE-DEMO
// still uses .producto__mockup cards and relies on this tilt effect, even
// though the homepage Producto section no longer does. See task-2-report.md.
function initMockupTilt() {
  const cards = document.querySelectorAll('.producto__mockup');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const MAX_TILT = 8;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * MAX_TILT;
      const rotateX = -((y - midY) / midY) * MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initCategoryNav() {
  document.querySelectorAll('.category-nav').forEach((nav) => {
    const section = nav.closest('section');
    if (!section) return;

    const tabs = Array.from(nav.querySelectorAll('.category-nav__tab'));
    const panels = Array.from(section.querySelectorAll('[data-category-panel]'));
    if (!tabs.length || !panels.length) return;

    function activate(category, { focusTab = false, reveal = true } = {}) {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.category === category;
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && focusTab) tab.focus();
      });
      panels.forEach((panel) => {
        const isActive = panel.dataset.categoryPanel === category;
        panel.hidden = !isActive;
        if (isActive && reveal) {
          panel.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal--visible'));
        }
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.category));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const dir = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + dir + tabs.length) % tabs.length;
        activate(tabs[nextIndex].dataset.category, { focusTab: true });
      });
    });

    const initial = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    activate(initial.dataset.category, { reveal: false });
  });
}

const PLAN_DETAILS = {
  basico: {
    badge: null,
    name: 'Básico',
    desc: 'Todo lo que necesitas para dejar de adivinar y empezar a tener el control de tu negocio.',
    detail: null,
    features: ['Catálogo de productos organizado', 'Entradas y salidas', 'Stock actualizado por producto', 'Historial de movimientos', 'Búsqueda y consulta rápida', 'Información esencial de cada producto', 'Control y seguimiento de inventario'],
    price: '997 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://panel-basico.vercel.app/',
    ctaClass: 'btn--secondary',
    accent: false,
  },
  intermedio: {
    badge: 'Más elegido',
    name: 'Intermedio',
    desc: 'Más funcionalidades para entender cómo se está moviendo tu inventario.',
    detail: 'Gestiona tu stock, ten una lectura más clara del movimiento de tus productos y la información que necesitas para planificar tus próximas compras.',
    features: ['Todo lo incluido en Básico', 'Productos más vendidos', 'Productos con menor movimiento', 'Seguimiento del rendimiento', 'Información y datos de proveedores', 'Productos asociados a cada proveedor', 'Referencia de tus compras habituales', 'Información clave para planificar reposiciones'],
    price: '1.600 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://panel-intermedio.vercel.app/',
    ctaClass: 'btn--primary',
    accent: true,
  },
  pro: {
    badge: null,
    name: 'Pro',
    desc: 'Una visión financiera completa para gestionar y anticiparte.',
    detail: 'Análisis financiero, evolución del negocio y herramientas inteligentes para entender tus números, detectar tendencias y optimizar decisiones y procesos.',
    features: ['Todo lo incluido en Básico e Intermedio', 'Costes y rentabilidad por producto', 'Márgenes y análisis de beneficio', 'Evolución financiera del negocio', 'Comparativas entre períodos', 'Análisis de tendencias', 'Predicciones y recomendaciones', 'Proyección de necesidades de stock', 'Automatización de procesos', 'Integraciones con proveedores', 'Inteligencia artificial aplicada a tu negocio'],
    price: 'A medida',
    priceNote: 'Cotización según tu negocio',
    cta: 'Agendar cotización',
    ctaHref: 'https://calendly.com/charladeclaridad/demo-melray',
    ctaClass: 'btn--secondary',
    accent: false,
  },
  'crm-basico': {
    badge: null,
    name: 'Básico',
    desc: 'Todo lo que necesitas para organizar a tus clientes y no perder ninguna oportunidad.',
    detail: null,
    features: ['Ficha de contacto por cliente', 'Pipeline visual por estados (Nuevo, Contactado, Propuesta, Ganado, Perdido)', 'Búsqueda y filtro de contactos', 'Vista de pipeline y de tabla', 'Resumen de contactos por estado', 'Registro de nuevas oportunidades'],
    price: '997 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://sarayortizcordero.github.io/CRM-Basico/',
    ctaClass: 'btn--secondary',
    accent: false,
  },
  'crm-intermedio': {
    badge: 'Más elegido',
    name: 'Intermedio',
    desc: 'Más contexto de cada cliente para no perder seguimiento de ninguna oportunidad.',
    detail: 'Da seguimiento a cada oportunidad con su historial completo y sabe cuánto vale lo que tienes en curso.',
    features: ['Todo lo incluido en Básico', 'Historial de actividad por contacto', 'Checklist de tareas por oportunidad', 'Valor estimado por trato', 'Seguimiento de ingresos potenciales por etapa', 'Vista de detalle ampliada por contacto'],
    price: '1.600 €',
    priceNote: 'Valor de implementación',
    cta: 'Ver demo en acción',
    ctaHref: 'https://sarayortizcordero.github.io/CRM-Intermedio/',
    ctaClass: 'btn--primary',
    accent: true,
  },
  'crm-completo': {
    badge: null,
    name: 'Completo',
    desc: 'Visión completa de tu actividad comercial, con reportes y automatizaciones incluidas.',
    detail: 'Visión completa de tu actividad comercial, con reportes y automatizaciones para anticiparte en vez de reaccionar.',
    features: ['Todo lo incluido en Básico e Intermedio', 'Dashboard con ingresos, actividad y top clientes', 'Reportes de rendimiento comercial', 'Gestión de empresas y documentos', 'Navegación completa por módulos (Contactos, Empresas, Documentos, Automatizaciones, Reportes)', 'Automatizaciones integradas al proceso comercial'],
    price: 'A medida',
    priceNote: 'Cotización según tu negocio',
    cta: 'Ver demo en acción',
    ctaHref: 'https://sarayortizcordero.github.io/CRM-Completo/',
    ctaClass: 'btn--secondary',
    accent: false,
  },
};

function initPlanModal() {
  const dialog = document.getElementById('plan-modal');
  const section = document.querySelector('.planes');
  if (!dialog || !section || typeof dialog.showModal !== 'function') return;

  const closeBtn = document.getElementById('plan-modal-close');
  const badgeEl = document.getElementById('plan-modal-badge');
  const badgeLabelEl = document.getElementById('plan-modal-badge-label');
  const titleEl = document.getElementById('plan-modal-title');
  const descEl = document.getElementById('plan-modal-desc');
  const detailEl = document.getElementById('plan-modal-detail');
  const featuresEl = document.getElementById('plan-modal-features');
  const priceEl = document.getElementById('plan-modal-price');
  const priceNoteEl = document.getElementById('plan-modal-price-note');
  const ctaEl = document.getElementById('plan-modal-cta');
  if (!closeBtn || !badgeEl || !badgeLabelEl || !titleEl || !descEl || !detailEl || !featuresEl || !priceEl || !priceNoteEl || !ctaEl) return;

  function openPlan(id) {
    const plan = PLAN_DETAILS[id];
    if (!plan) return;

    badgeEl.hidden = !plan.badge;
    if (plan.badge) badgeLabelEl.textContent = plan.badge;

    titleEl.textContent = plan.name;
    descEl.textContent = plan.desc;

    detailEl.hidden = !plan.detail;
    if (plan.detail) detailEl.textContent = plan.detail;

    featuresEl.replaceChildren(...plan.features.map((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));

    priceEl.textContent = plan.price;
    priceNoteEl.textContent = plan.priceNote;

    ctaEl.textContent = plan.cta;
    ctaEl.href = plan.ctaHref;
    ctaEl.classList.remove('btn--primary', 'btn--secondary');
    ctaEl.classList.add(plan.ctaClass);

    dialog.classList.toggle('plan-modal--accent', plan.accent);
    dialog.showModal();
  }

  section.querySelectorAll('.plan-card__more').forEach((btn) => {
    btn.addEventListener('click', () => openPlan(btn.dataset.plan));
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  section.classList.add('plans-js-ready');
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
  runSafely(initHeaderScroll);
  runSafely(initScrollReveal);
  runSafely(initCookieBanner);
  runSafely(initFooterYear);
  runSafely(initReducedMotionVideo);
  runSafely(initMockupTilt);
  runSafely(initCategoryNav);
  runSafely(initPlanModal);
});
