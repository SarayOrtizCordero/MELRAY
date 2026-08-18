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

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('contact-form-status');
  const fields = ['name', 'email', 'message'];

  const showError = (field, message) => {
    const input = document.getElementById(`cf-${field}`);
    const error = document.getElementById(`cf-${field}-error`);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
    } else {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    }
  };

  const validate = () => {
    let valid = true;
    fields.forEach((field) => {
      const input = document.getElementById(`cf-${field}`);
      if (!input.value.trim()) {
        showError(field, 'Este campo es obligatorio.');
        valid = false;
      } else if (field === 'email' && !input.validity.valid) {
        showError(field, 'Introduce un email válido.');
        valid = false;
      } else {
        showError(field, '');
      }
    });
    return valid;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) {
      status.textContent = '';
      return;
    }

    const endpoint = form.dataset.formspreeEndpoint;
    status.removeAttribute('data-state');
    status.textContent = 'Enviando...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        status.dataset.state = 'success';
        status.textContent = '¡Gracias! Te contestaremos muy pronto.';
        form.reset();
      } else {
        status.dataset.state = 'error';
        status.textContent = 'Algo falló al enviar. Prueba de nuevo en unos minutos.';
      }
    } catch (err) {
      status.dataset.state = 'error';
      status.textContent = 'No hay conexión. Prueba de nuevo en unos minutos.';
    }
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

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initContactForm();
  initCookieBanner();
  initFooterYear();
});
