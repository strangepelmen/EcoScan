// =============================================
// ECOSCAN — UI Utilities
// Header scroll, burger menu, reveal, toasts
// =============================================

// HEADER SCROLL EFFECT
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// BURGER MENU
const burger = document.getElementById('burger');
const mainNav = document.getElementById('main-nav');

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mainNav?.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mainNav?.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (mainNav?.classList.contains('open') &&
      !mainNav.contains(e.target) && !burger?.contains(e.target)) {
    burger?.classList.remove('open');
    mainNav?.classList.remove('open');
  }
});

// REVEAL ANIMATIONS
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// NOTIFICATIONS
function showToast(message, type = 'success') {
  document.querySelectorAll('.eco-toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = `eco-toast eco-toast--${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}