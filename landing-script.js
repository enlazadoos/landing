/* =========================================================
   ENLAZADOS · LANDING PAGE · SCRIPT
========================================================= */

/* ── CONFIGURACIÓN ──────────────────────────────────────
   Sustituye este valor por tu URL de Formspree o EmailJS
   Ejemplo Formspree: 'https://formspree.io/f/XXXXXXXX'
   Ejemplo EmailJS: configura el bloque de envío más abajo
========================================================= */
const CONTACT_ENDPOINT = 'TU_ENDPOINT_AQUI';

/* =========================================================
   NAV: scroll shadow + burger menu
========================================================= */
const nav      = document.querySelector('.nav');
const burger   = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', isOpen);
  mobileMenu.classList.toggle('is-open', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

/* Cierra el menú al hacer clic en un enlace */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* =========================================================
   ANIMACIÓN DE ENTRADA AL HACER SCROLL
   Las secciones aparecen suavemente al entrar en viewport
========================================================= */
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

/* Añade la clase de animación a elementos clave */
const animatedEls = document.querySelectorAll(
  '.step-card, .tpl-card, .include-item, .price-card'
);

animatedEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  fadeObserver.observe(el);
});

/* Cuando es visible, aplica el estado final */
const styleTag = document.createElement('style');
styleTag.textContent = `.is-visible { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(styleTag);

/* =========================================================
   FORMULARIO DE CONTACTO
========================================================= */
const contactForm   = document.getElementById('contactForm');
const submitBtn     = document.getElementById('contactSubmit');
const formResult    = document.getElementById('formResult');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  /* Validación básica */
  const nombre = contactForm.nombre.value.trim();
  const email  = contactForm.email.value.trim();

  if (!nombre) {
    showResult('Por favor, indica vuestros nombres.', true);
    contactForm.nombre.focus();
    return;
  }

  if (!email || !email.includes('@')) {
    showResult('Por favor, introduce un correo electrónico válido.', true);
    contactForm.email.focus();
    return;
  }

  /* Estado de carga */
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';
  formResult.className = 'form-result';
  formResult.textContent = '';

  /* Recoge los datos */
  const data = {
    nombre,
    email,
    fecha:   contactForm.fecha?.value   || '',
    plan:    contactForm.plan?.value    || '',
    mensaje: contactForm.mensaje?.value?.trim() || '',
  };

  /* ── ENVÍO ──────────────────────────────────────────────
     Opción A — Formspree (recomendado, gratis hasta 50/mes):
       1. Crea cuenta en formspree.io
       2. Crea un nuevo formulario
       3. Pega la URL en CONTACT_ENDPOINT arriba

     Opción B — EmailJS (si prefieres sin backend):
       Comenta el bloque fetch y usa emailjs.send(...)

     Opción C — Google Apps Script (como en las plantillas):
       Mismo patrón que el script de RSVP
  ========================================================= */
  try {
    if (CONTACT_ENDPOINT === 'TU_ENDPOINT_AQUI') {
      /* Modo demo: simula éxito sin endpoint real */
      await new Promise(r => setTimeout(r, 900));
      showResult('¡Mensaje recibido! Os respondo en menos de 24 h.', false);
      contactForm.reset();
    } else {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showResult('¡Mensaje recibido! Os respondo en menos de 24 h.', false);
        contactForm.reset();
      } else {
        throw new Error('Error al enviar el formulario.');
      }
    }
  } catch (err) {
    showResult('Hubo un problema al enviar. Escríbenos directamente a hola@enlazados.es', true);
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'enviar mensaje';
  }
});

function showResult(msg, isError) {
  formResult.textContent = msg;
  formResult.className   = 'form-result ' + (isError ? 'is-error' : 'is-ok');
  formResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* =========================================================
   SMOOTH SCROLL para navegación
   (Por si el browser no soporta scroll-behavior: smooth)
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
