/**
 * ==========================================================================
 * PORTFOLIO APPLICATION JAVASCRIPT
 * Muhammad Ubaid Raza - Software Developer | Python & AI Applications
 * Plain Vanilla JS only (No external dependencies)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initContactForm();
  initSmoothScroll();
});

/**
 * 1. Mobile Menu Toggle & Accessibility
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

  // Close when clicking nav links
  navMenu.querySelectorAll('.nav-link, .btn-nav').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when scrolling page
  window.addEventListener('scroll', () => {
    if (navMenu.classList.contains('mobile-open')) {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }, { passive: true });
}

/**
 * 2. Active Section Spy on Scroll
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

    // If near bottom, activate contact
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
 * 3. Smooth Scrolling & Hash Handling
 */
function initSmoothScroll() {
  const brand = document.getElementById('navBrand');
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  }

  // Anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', targetId);
      }
    });
  });
}

/**
 * 4. Asynchronous Contact Form Dispatch (FormSubmit)
 */
function initContactForm() {
  const form = document.getElementById('transferInquiryForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusMsg = document.getElementById('formStatusMessage');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validity check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending Message...';
    submitBtn.disabled = true;

    if (statusMsg) {
      statusMsg.className = 'form-status';
      statusMsg.style.display = 'none';
      statusMsg.textContent = '';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        if (statusMsg) {
          statusMsg.className = 'form-status success';
          statusMsg.textContent = 'Message sent successfully. Thank you for reaching out, Muhammad Ubaid Raza will review and respond promptly.';
        }
        form.reset();
      } else {
        throw new Error('Server returned an error');
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.className = 'form-status error';
        statusMsg.innerHTML = 'Unable to send message via form. Please email directly at: <a href="mailto:ubaid183d9@gmail.com" style="color: inherit; text-decoration: underline; font-weight: 600;">ubaid183d9@gmail.com</a>';
      }
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      // Auto fade message after 8 seconds
      setTimeout(() => {
        if (statusMsg && statusMsg.classList.contains('success')) {
          statusMsg.style.transition = 'opacity 0.4s ease';
          statusMsg.style.opacity = '0';
          setTimeout(() => {
            statusMsg.className = 'form-status';
            statusMsg.style.display = 'none';
            statusMsg.style.opacity = '1';
          }, 400);
        }
      }, 8000);
    }
  });
}
