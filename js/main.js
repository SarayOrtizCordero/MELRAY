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
});
