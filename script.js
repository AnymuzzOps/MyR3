const header = document.querySelector('#site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#primary-menu');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');

const setHeaderState = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1200;
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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      if (entry.target.matches('.metric')) {
        const counter = entry.target.querySelector('[data-count]');
        if (counter && !counter.dataset.animated) {
          counter.dataset.animated = 'true';
          animateCounter(counter);
        }
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
