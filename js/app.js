/**
 * ==========================================================================
 * PORTFOLIO APPLICATION JAVASCRIPT
 * Muhammad Ubaid Raza - Software Developer | Python & AI Applications
 * Vanilla JS with Progressive Enhancement via GSAP CDN
 * ==========================================================================
 */

/**
 * CONFIGURATION: Contact Form Endpoint
 * FormSubmit AJAX endpoint for asynchronous portfolio message dispatch.
 * When set to an empty string, the form card is hidden and the left card expands.
 */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/ubaid183d9@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initMobileMenu();
  initActiveNav();
  initSmoothScroll();
  initDesktopParallax();
  initMotionAnimations();
});

/**
 * 1. Contact Form Handling & Fallback
 */
function initContactForm() {
  const form = document.getElementById('contactQuickForm');
  const cardRight = document.getElementById('contactCardRight');
  const cardLeft = document.getElementById('contactCardLeft');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusMsg = document.getElementById('formStatusMessage');

  if (!cardRight || !cardLeft) return;

  const hasEndpoint = typeof FORM_ENDPOINT === 'string' && FORM_ENDPOINT.trim().length > 0;

  if (!hasEndpoint) {
    // If FORM_ENDPOINT is an empty string, hide this card and let the left card span full width
    cardRight.style.display = 'none';
    cardLeft.style.gridColumn = '1 / -1';
    return;
  }

  // Ensure card is visible and left card has default column layout
  cardRight.style.display = 'flex';
  cardLeft.style.gridColumn = '';

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    if (statusMsg) {
      statusMsg.className = 'form-status';
      statusMsg.style.display = 'none';
      statusMsg.textContent = '';
    }

    try {
      const formData = new FormData(form);
      formData.set('_subject', 'Portfolio message');
      formData.set('_template', 'table');
      formData.set('_captcha', 'false');

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && (data.success === 'true' || data.success === true)) {
        if (statusMsg) {
          statusMsg.className = 'form-status success';
          statusMsg.style.display = 'block';
          statusMsg.textContent = "Sent. I'll reply within 48 hours.";
        }
        form.reset();
      } else {
        const errorDetail = data && data.message ? data.message : ('Status: ' + response.status);
        throw new Error(errorDetail);
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.className = 'form-status error';
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = 'Could not send. Please email <a href="mailto:ubaid183d9@gmail.com">ubaid183d9@gmail.com</a> directly.';
      }
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

/**
 * 2. Mobile Menu Drawer & Accessibility
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('mobile-open');
  });

  navMenu.querySelectorAll('.nav-link, .btn-nav').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('scroll', () => {
    if (navMenu.classList.contains('mobile-open')) {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }, { passive: true });
}

/**
 * 3. Active Nav Section Spy
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
      currentId = 'contact';
    }

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 4. Smooth Anchor Scrolling (Respects prefers-reduced-motion)
 */
function initSmoothScroll() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = isReducedMotion ? 'auto' : 'smooth';

  const brand = document.getElementById('navBrand');
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior });
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior });
        history.replaceState(null, '', targetId);
      }
    });
  });
}

/**
 * 5. Desktop Subtle Mouse Parallax (4-10px, portrait moving slightly more than card)
 */
function initDesktopParallax() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isFinePointer || isReducedMotion) return;

  const hero = document.getElementById('hero');
  const wrapper = document.getElementById('portraitWrapper');
  if (!hero || !wrapper) return;

  const offsetFrame = document.getElementById('parallaxOffsetFrame');
  const card = document.getElementById('parallaxCard');
  const image = document.getElementById('parallaxImage');

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetX = x * 2;
    targetY = y * 2;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });

  function updateParallax() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // Card and offset frame move 4-5px; portrait image moves slightly more (7-8px)
    if (offsetFrame) {
      offsetFrame.style.transform = `translate(${currentX * 4}px, ${currentY * 4}px)`;
    }
    if (card) {
      card.style.transform = `translate(${currentX * 4}px, ${currentY * 4}px)`;
    }
    if (image) {
      image.style.transform = `translate(calc(-50% + ${currentX * 8}px), ${currentY * 7}px)`;
    }

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }
}

/**
 * 6. Motion Animations (GSAP Reveal under 1 second total, progressive enhancement)
 */
function initMotionAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) {
    return;
  }

  // Check if GSAP is available from CDN
  if (typeof window.gsap !== 'undefined') {
    document.documentElement.classList.add('js-ready');

    // Hero text reveal: "Hi, I'm" then name then title, total under 1 second
    const tl = gsap.timeline();
    tl.fromTo('.hero-intro',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    )
    .fromTo('.hero-name',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
      '-=0.1'
    )
    .fromTo('.hero-title-unbroken',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
      '-=0.12'
    );

    // Section scroll reveal using ScrollTrigger if available
    if (typeof window.ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            once: true
          },
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: 'power2.out'
        });
      });
    } else {
      initIntersectionObserverFallback();
    }
  } else {
    // Fallback if GSAP CDN fails or is blocked
    initIntersectionObserverFallback();
  }
}

/**
 * Fallback section reveal using native IntersectionObserver
 */
function initIntersectionObserverFallback() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach((sec) => observer.observe(sec));
}
