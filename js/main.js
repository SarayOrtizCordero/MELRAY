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
});
