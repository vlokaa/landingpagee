document.documentElement.classList.add('js');

const header = document.getElementById('header');
const burger = document.getElementById('burger');
const links = document.getElementById('links');

// Header turns solid after scrolling
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Reveal elements as they scroll into view (staggered inside grids)
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const siblings = [...en.target.parentElement.querySelectorAll(':scope > .rv')];
    en.target.style.transitionDelay = siblings.indexOf(en.target) * 0.12 + 's';
    en.target.classList.add('in');
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// Highlight the nav link of the section in view
const navLinks = [...links.querySelectorAll('a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['services', 'craft', 'gallery', 'book'].forEach(id => spy.observe(document.getElementById(id)));

// Booking form
const form = document.getElementById('bookForm');
const msg = document.getElementById('msg');
const dateInput = document.getElementById('date');
dateInput.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [form.name, form.service, form.date];
  let ok = true;
  fields.forEach(f => {
    const bad = !f.value.trim();
    f.classList.toggle('bad', bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = 'Please fill in all fields.'; return; }
  msg.textContent = `Thanks, ${form.name.value.trim()}! Your ${form.service.value} request for ${form.date.value} is in. We will confirm shortly.`;
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();