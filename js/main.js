/* ═══════════════════════════════════════════════════
   GUM CHILE — JAVASCRIPT PRINCIPAL
   Magic Scroll · Modales · Formulario · Nav · Stats
═══════════════════════════════════════════════════ */

'use strict';

/* ─── 1. NAVBAR SCROLL ─── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-links');
  const links   = document.querySelectorAll('.nav-link');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Scroll-top button
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
})();

/* ─── 2. MAGIC SCROLL — INTERSECTION OBSERVER ─── */
(function initMagicScroll() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ─── 3. STATS COUNTER ANIMATION ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ─── 4. HERO PARTICLES ─── */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 15 : 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    Object.assign(particle.style, {
      position: 'absolute',
      width: `${size}px`, height: `${size}px`,
      borderRadius: '50%',
      background: `rgba(56,189,248,${Math.random() * 0.4 + 0.1})`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float-particle ${Math.random() * 8 + 6}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 5}s`,
    });
    container.appendChild(particle);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-particle {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
      25%       { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
      50%       { transform: translateY(-15px) translateX(-10px); opacity: 0.5; }
      75%       { transform: translateY(-40px) translateX(5px); opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);
})();


/* ─── 5. MODALES ─── */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Scroll modal body to top
  const body = modal.querySelector('.modal-body');
  if (body) body.scrollTop = 0;
  // Reset active nav link
  modal.querySelectorAll('.modal-nav-link').forEach((link, i) => {
    link.classList.toggle('active', i === 0);
  });
  // Trap focus
  const focusable = modal.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  if (focusable.length) focusable[0].focus();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close modal on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    // Close mobile menu
    const navMenu = document.getElementById('nav-links');
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      document.getElementById('nav-toggle').classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// Modal nav active highlight on scroll
document.querySelectorAll('.modal-body').forEach(body => {
  body.addEventListener('scroll', () => {
    const modal = body.closest('.modal-overlay');
    if (!modal) return;
    const sections = body.querySelectorAll('[id]');
    const scrollPos = body.scrollTop + 80;
    let currentId = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    modal.querySelectorAll('.modal-nav-link[href]').forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  });
});

// Make modal nav links smooth-scroll inside the modal body
document.querySelectorAll('.modal-nav-link[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    // Only if it's an in-modal anchor (not a page section)
    const modal = link.closest('.modal-overlay');
    if (!modal) return;
    const target = modal.querySelector(href);
    if (target) {
      e.preventDefault();
      const body = modal.querySelector('.modal-body');
      body.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' });
    }
  });
});

/* ─── 6. PORTFOLIO FILTER ─── */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.classList.remove('hidden');
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  });
})();

/* ─── 7. CONTACT FORM ─── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function showError(fieldId, msg) {
    const err = document.getElementById(`error-${fieldId}`);
    if (err) { err.textContent = msg; err.classList.add('show'); }
    const field = document.getElementById(fieldId);
    if (field) field.style.borderColor = '#f87171';
  }

  function clearError(fieldId) {
    const err = document.getElementById(`error-${fieldId}`);
    if (err) { err.textContent = ''; err.classList.remove('show'); }
    const field = document.getElementById(fieldId);
    if (field) field.style.borderColor = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Real-time validation
  ['name', 'email', 'service', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
    const btn     = document.getElementById('submit-btn');

    if (!name.value.trim() || name.value.trim().length < 3) {
      showError('name', 'Ingresa tu nombre completo (mín. 3 caracteres)'); valid = false;
    } else clearError('name');

    if (!email.value.trim() || !validateEmail(email.value)) {
      showError('email', 'Ingresa un correo electrónico válido'); valid = false;
    } else clearError('email');

    if (!service.value) {
      showError('service', 'Selecciona el servicio de tu interés'); valid = false;
    } else clearError('service');

    if (!message.value.trim() || message.value.trim().length < 20) {
      showError('message', 'Describe tu proyecto o consulta (mín. 20 caracteres)'); valid = false;
    } else clearError('message');

    if (!valid) return;

    // Simulated submission (replace with fetch/EmailJS/FormSpree)
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      }
    }, 1800);
  });
})();

/* ─── 8. SCROLL TO TOP ─── */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── 9. SMOOTH SCROLL (anchor links) ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target && !anchor.closest('.modal-overlay')) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── 10. MOBILE NAV HAMBURGER ANIMATION ─── */
(function initHamburger() {
  const toggle = document.getElementById('nav-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const spans = toggle.querySelectorAll('span');
    const isOpen = document.getElementById('nav-links').classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
})();


