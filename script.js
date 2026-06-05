document.documentElement.classList.add('js-enabled');
const header = document.querySelector('#site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#primary-menu');
const revealItems = document.querySelectorAll('.reveal');

const closeMenu = () => {
  if (!navToggle || !navMenu) return;

  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú principal');
  document.body.classList.remove('menu-open');
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
};

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || 0);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const revealElement = (element) => {
  element.classList.add('visible');

  if (!element.matches('.metric')) return;

  const counter = element.querySelector('[data-count]');
  if (counter && !counter.dataset.animated) {
    counter.dataset.animated = 'true';
    animateCounter(counter);
  }
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');

    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú principal' : 'Abrir menú principal');
    document.body.classList.toggle('menu-open', isOpen);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach(revealElement);
}
