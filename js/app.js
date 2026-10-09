/**
 * ==========================================================================
 * PROJECT I.G.I. // TACTICAL INTELLIGENCE HUD ENGINE
 * Operative: Muhammad Ubaid Raza | Codename: OPERATIVE-01
 * AI Applications & Systems Architect | Bahria University Karachi
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCleanTopNav();
  initOperativeCardTilt();
  initTextPoppingEngine();
  initTacticalCursor();
  initProjectModals();
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initContactForm();
});

/* ==========================================================================
   1. 3D INTERACTIVE OPERATIVE CARD TILT (TACTICAL TARGET LOCK)
   ========================================================================== */
function initOperativeCardTilt() {
  const card = document.getElementById('operativeCard');
  if (!card) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wrapper = card.closest('.operative-card-wrapper') || card;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   2. LETTER-BY-LETTER & WORD-BY-WORD POPPING TEXT ENGINE
   ========================================================================== */
function initTextPoppingEngine() {
  const popElements = document.querySelectorAll('.pop-text');
  if (!popElements.length) return;

  // Split each pop-text element into word and character spans
  popElements.forEach((el) => {
    prepareElementForPopping(el);
  });

  // Stagger animation on scroll into view using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('popped');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  popElements.forEach((el) => {
    // If element is already in the viewport (e.g. hero section), trigger immediately
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight) {
      setTimeout(() => {
        el.classList.add('popped');
      }, 100);
    } else {
      observer.observe(el);
    }
  });
}

/**
 * Splits text nodes inside an element into .pop-word and .pop-char spans
 * preserving any inner markup (e.g. <span class="neon">)
 */
function prepareElementForPopping(el) {
  const childNodes = Array.from(el.childNodes);
  let wordCounter = 0;

  function processTextString(text, extraClass) {
    const tokens = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();

    tokens.forEach((token) => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        fragment.appendChild(document.createTextNode(' '));
        return;
      }

      const wordSpan = document.createElement('span');
      wordSpan.className = 'pop-word' + (extraClass ? ' ' + extraClass : '');

      for (let i = 0; i < token.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'pop-char';
        charSpan.textContent = token[i];
        
        // Stagger formula: Word index delay + character index delay
        const delay = (wordCounter * 110) + (i * 32);
        charSpan.style.animationDelay = `${delay}ms`;
        wordSpan.appendChild(charSpan);
      }

      wordCounter++;
      fragment.appendChild(wordSpan);
    });

    return fragment;
  }

  const newFragment = document.createDocumentFragment();

  childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      newFragment.appendChild(processTextString(node.textContent, ''));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clonedWrapper = node.cloneNode(false);
      clonedWrapper.appendChild(processTextString(node.textContent, node.className));
      newFragment.appendChild(clonedWrapper);
    }
  });

  el.innerHTML = '';
  el.appendChild(newFragment);
}

/* ==========================================================================
   3. TACTICAL TARGET CROSSHAIR CURSOR ENGINE
   ========================================================================== */
function initTacticalCursor() {
  const cursor = document.getElementById('tacticalCursor');
  const trail = document.getElementById('cursorTrail');
  if (!cursor) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = window.innerWidth / 2;
  let trailY = window.innerHeight / 2;

  // Position reticle exactly on mouse coordinate
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursor.style.opacity = '1';
    if (trail) trail.style.opacity = '1';
  });

  // Smooth trailing tracker dot with linear interpolation
  if (trail) {
    function animateTracker() {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;
      requestAnimationFrame(animateTracker);
    }
    animateTracker();
  }

  // Click weapon recoil animation
  window.addEventListener('mousedown', () => {
    cursor.classList.add('recoil');
    setTimeout(() => {
      cursor.classList.remove('recoil');
    }, 150);
  });

  // Target lock-on when hovering interactive elements
  const interactiveTarget = 'a, button, input, textarea, select, .mission-target-node, .project-tactical-card, .trophy-card, .skill-category-card, .timeline-card, [tabindex="0"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTarget)) {
      cursor.classList.add('locked');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTarget)) {
      cursor.classList.remove('locked');
    }
  });

  // Fade out cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    if (trail) trail.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    if (trail) trail.style.opacity = '1';
  });
}

/* ==========================================================================
   4. CLASSIFIED MISSION INTEL MODAL ENGINE
   ========================================================================== */
const projectsData = {
  'subtitle-gen': {
    title: 'Multilingual Video Subtitle Generator',
    role: 'NEURAL AI / SPEECH RECONNAISSANCE',
    tag: 'CLASSIFIED INTEL // AI',
    stack: ['Python', 'Streamlit', 'Whisper AI', 'FFmpeg', 'PyTorch'],
    desc: 'An AI-powered tactical audio reconnaissance web application that automates subtitle extraction and translation for multi-language video streams. It deploys FFmpeg streaming pipelines, processes speech through OpenAI Whisper neural models, generates synchronized timestamps, and provides translated subtitle payloads across English, Urdu, Spanish, Chinese, and Turkish.',
    features: [
      'Automatic speech recognition with multi-language detection and neural translation',
      'Audio extraction pipeline optimized with streaming FFmpeg sub-processes',
      'Dual output support for industry standard .SRT and .VTT subtitle files',
      'Interactive Streamlit UI with live video preview and synchronized subtitle playback'
    ],
    liveUrl: 'https://built-by-ubaid-multilingual-video-subtitle-generator.streamlit.app/',
    githubUrl: 'https://github.com/UbaidRaza-jpg/Multilingual-Video-Subtitle-Generator'
  },
  'therac-recovery': {
    title: 'THERAC-25 Recovery System',
    role: 'MISSION-CRITICAL RISK SIMULATOR & FAIL-SAFE OVERRIDE',
    tag: 'SYSTEMS PROGRAMMING',
    stack: ['C++', 'Graphs', 'Stacks', 'Linked Lists', 'File Handling'],
    desc: 'A robust risk-validated workflow simulator inspired by the historic Therac-25 radiation hazard case study. Engineered to eliminate race conditions and software faults through state validation graphs, operation rollback stacks, and strict state machine transitions in C++.',
    features: [
      'Graph-based operational state machine preventing unauthorized hazard states',
      'Stack-based rollback mechanism allowing instant recovery upon anomaly detection',
      'Step-by-step risk validator with automated diagnostic logging',
      'Persistent state serialization using custom C++ file handling'
    ],
    liveUrl: null,
    githubUrl: 'https://github.com/UbaidRaza-jpg/Therac-Recovery-System'
  },
  'hostel-mgmt': {
    title: 'Hostel Management System',
    role: 'BASE LOGISTICS & BOOKING ENGINE',
    tag: 'ENTERPRISE ARCHITECTURE',
    stack: ['Java', 'Swing GUI', 'Database / File IO', 'OOP Architecture'],
    desc: 'Java, GUI, and database-backed base facility operations system for resident check-in, check-out, and room booking. Engineered with modular Object-Oriented principles, persistent record storage, dynamic availability checking, and automated expense calculations.',
    features: [
      'Modular OOP design with full encapsulation, inheritance, and clean polymorphism',
      'Room reservation engine with dynamic status updates and conflict avoidance',
      'Automated invoice and expense calculation with itemized billing receipts',
      'Search and filter functionality for rapid resident verification and record persistence'
    ],
    liveUrl: null,
    githubUrl: 'https://github.com/UbaidRaza-jpg/Hostel-Management-System'
  },
  'garden-mgmt': {
    title: 'Garden Management Engine (AVL Tree Architecture)',
    role: 'ARBOREAL CIPHER & SELF-BALANCING AVL ENGINE',
    tag: 'ADVANCED DATA STRUCTURES',
    stack: ['C++', 'AVL Trees', 'Self-Balancing BST', 'Recursive Traversal', 'Tree Rebalancing'],
    desc: 'A high-performance C++ plant and vegetation management engine built around an AVL (Adelson-Velsky and Landis) self-balancing binary search tree. Guarantees strict O(log n) search, insertion, and deletion complexity via dynamic single and double tree rotations (LL, RR, LR, RL). Features recursive depth-first tree traversal for batch growth updates, robust deletion with full rebalancing, and zero memory leaks.',
    features: [
      'Self-balancing AVL tree architecture maintaining strict balance factors (-1, 0, +1) across all node insertions and modifications',
      'Robust delete function with full rebalancing via LL, RR, LR, and RL rotations and in-order successor substitution',
      'Recursive tree traversal engine executing scheduled batch growth updates and calculations',
      'Guaranteed O(log n) worst-case search and retrieval velocity with custom C++ pointer management and zero memory leaks'
    ],
    liveUrl: null,
    githubUrl: 'https://github.com/UbaidRaza-jpg/Effective-Garden-Management'
  }
};

let lastFocusedElementBeforeModal = null;

window.openProjectModal = function(projectId) {
  const modalOverlay = document.getElementById('projectModalOverlay');
  const project = projectsData[projectId];
  if (!project || !modalOverlay) return;

  lastFocusedElementBeforeModal = document.activeElement;
  populateProjectModal(project);
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('projectModalClose');
  if (closeBtn) {
    closeBtn.focus();
  }
};

function closeProjectModal() {
  const modalOverlay = document.getElementById('projectModalOverlay');
  if (!modalOverlay || !modalOverlay.classList.contains('active')) return;

  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') {
    lastFocusedElementBeforeModal.focus();
  }
}

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModalOverlay');
  const closeBtn = document.getElementById('projectModalClose');
  const tacticalNodes = document.querySelectorAll('.mission-target-node, .project-tactical-card');

  if (!modalOverlay || !closeBtn) return;

  tacticalNodes.forEach((el) => {
    const node = el.closest('.mission-target-node') || el;
    const projectId = node.getAttribute('data-project');
    if (!projectId) return;

    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      window.openProjectModal(projectId);
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.openProjectModal(projectId);
      }
    });
  });

  closeBtn.addEventListener('click', closeProjectModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeProjectModal();
    }
  });

  // ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // Focus trap within modal
  modalOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modalOverlay.classList.contains('active')) return;

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const allFocusables = Array.from(modalOverlay.querySelectorAll(focusableSelectors)).filter((elem) => {
      return elem.offsetParent !== null && !elem.disabled && window.getComputedStyle(elem).display !== 'none';
    });

    if (allFocusables.length === 0) return;

    const firstFocusable = allFocusables[0];
    const lastFocusable = allFocusables[allFocusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable || document.activeElement === modalOverlay) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

function populateProjectModal(project) {
  document.getElementById('modalProjectTitle').textContent = project.title;
  document.getElementById('modalProjectRole').textContent = project.role;
  document.getElementById('modalProjectTag').textContent = project.tag;
  document.getElementById('modalProjectDesc').textContent = project.desc;

  // Tech stack
  const stackContainer = document.getElementById('modalProjectStack');
  stackContainer.innerHTML = project.stack
    .map(tech => `<span class="tech-tag">${tech}</span>`)
    .join('');

  // Features list
  const featuresContainer = document.getElementById('modalProjectFeatures');
  featuresContainer.innerHTML = project.features
    .map(feat => `<li>${feat}</li>`)
    .join('');

  // Prominent Live Streamlit Banner & CTAs
  const liveCallout = document.getElementById('modalLiveCallout');
  const calloutBtn = document.getElementById('modalCalloutBtn');
  const liveBtn = document.getElementById('modalLiveLink');

  if (project.liveUrl) {
    if (liveCallout) liveCallout.style.display = 'flex';
    if (calloutBtn) calloutBtn.href = project.liveUrl;
    if (liveBtn) {
      liveBtn.href = project.liveUrl;
      liveBtn.style.display = 'inline-flex';
    }
  } else {
    if (liveCallout) liveCallout.style.display = 'none';
    if (calloutBtn) calloutBtn.removeAttribute('href');
    if (liveBtn) {
      liveBtn.style.display = 'none';
      liveBtn.removeAttribute('href');
    }
  }

  const githubBtn = document.getElementById('modalGithubLink');
  if (githubBtn) {
    if (project.githubUrl) {
      githubBtn.href = project.githubUrl;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
      githubBtn.removeAttribute('href');
    }
  }
}

/* ==========================================================================
   5. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   6. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ========================================================================== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navAnchors.length) return;

  window.addEventListener('scroll', () => {
    let current = 'hero';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      current = 'contact';
    }

    navAnchors.forEach((a) => {
      a.classList.remove('active');
      const href = a.getAttribute('href');
      if (current === 'hero' && (href === '#' || a.id === 'navAboutMe' || href === '#hero')) {
        a.classList.add('active');
      } else if (href === `#${current}`) {
        a.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. CLEAN TOP-LEVEL NAVIGATION
   ========================================================================== */
function initCleanTopNav() {
  function stripHeroHash() {
    if (window.location.hash === '#hero') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  stripHeroHash();
  window.addEventListener('hashchange', stripHeroHash);

  const topLinks = document.querySelectorAll('.brand-logo, #navAboutMe, a[href="#hero"], .back-to-top-btn');
  topLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', window.location.pathname + window.location.search);

      const navAnchors = document.querySelectorAll('.nav-links a');
      navAnchors.forEach(a => a.classList.remove('active'));
      const aboutMe = document.getElementById('navAboutMe');
      if (aboutMe) aboutMe.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. SCROLL REVEAL ANIMATION ENGINE
   ========================================================================== */
function initScrollReveal() {
  const revealTargets = [
    ...document.querySelectorAll('.trophy-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.skill-category-card'),
    ...document.querySelectorAll('.contact-dossier-card'),
    ...document.querySelectorAll('.contact-form-box'),
    ...document.querySelectorAll('.mission-target-node')
  ];

  revealTargets.forEach((el) => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   9. ASYNC SECURE TRANSMISSION FORM DISPATCH
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('transferInquiryForm');
  const statusMsg = document.getElementById('formStatusMessage');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '[TRANSMITTING SECURE PACKET...]';
    submitBtn.disabled = true;

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
          statusMsg.style.display = 'block';
          statusMsg.style.background = 'rgba(0, 255, 102, 0.1)';
          statusMsg.style.border = '1px solid var(--border-neon)';
          statusMsg.style.color = 'var(--neon-green)';
          statusMsg.innerHTML = '<strong>TRANSMISSION LOGGED SUCCESSFULLY.</strong> Operative Muhammad Ubaid Raza will review debrief and establish contact via secure email.';
        }
        form.reset();
      } else {
        throw new Error('Server response was not ok');
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = 'rgba(255, 50, 50, 0.15)';
        statusMsg.style.border = '1px solid #ff3333';
        statusMsg.style.color = '#ff6666';
        statusMsg.innerHTML = 'Transmission failed. Transmit directly to field comms: <strong>ubaid183d9@gmail.com</strong>';
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      setTimeout(() => {
        if (statusMsg) {
          statusMsg.style.transition = 'opacity 0.5s ease';
          statusMsg.style.opacity = '0';
          setTimeout(() => {
            statusMsg.style.display = 'none';
            statusMsg.style.opacity = '1';
          }, 500);
        }
      }, 7000);
    }
  });
}
