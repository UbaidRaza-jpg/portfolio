/**
 * ==========================================================================
 * UCL + REAL MADRID THEMED PORTFOLIO ENGINE
 * Muhammad Ubaid Raza (#1) - AI Applications & Software Developer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initFutCardTilt();
  initLineupObserver();
  initProjectModals();
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initCustomCursor();
  initContactForm();
});

/* ==========================================================================
   2. 3D INTERACTIVE FUT CARD TILT EFFECT
   ========================================================================== */
function initFutCardTilt() {
  const card = document.getElementById('starPlayerCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   3. TACTICAL LINEUP PITCH REVEAL (STAGGERED POP-UP ANIMATION)
   ========================================================================== */
function initLineupObserver() {
  const pitchSlots = document.querySelectorAll('.pitch-player-slot');
  if (!pitchSlots.length) return;

  let hasPopped = false;

  function triggerLineup() {
    if (hasPopped) return;
    hasPopped = true;

    pitchSlots.forEach((slot, index) => {
      setTimeout(() => {
        slot.classList.add('popped-in');
      }, index * 200);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        triggerLineup();
      }
    });
  }, { threshold: 0.1 });

  const lineupSection = document.getElementById('lineup');
  if (lineupSection) {
    observer.observe(lineupSection);
  }
}

/* ==========================================================================
   4. PROJECT DATA & "TECHNICAL REPORT" MODAL ENGINE
   ========================================================================== */
const projectsData = {
  'subtitle-gen': {
    title: 'Multilingual Video Subtitle Generator',
    role: 'AI / Speech-to-Text Flagship Project',
    tag: 'FULL-STACK AI',
    stack: ['Python', 'Streamlit', 'OpenAI Whisper', 'FFmpeg', 'PyTorch'],
    desc: 'An AI-powered web application that automates subtitle generation for multi-language video content. It extracts audio with FFmpeg, processes speech through OpenAI Whisper models, generates synchronized timestamps, and provides translated subtitles across English, Urdu, Spanish, Chinese, and Turkish.',
    features: [
      'Automatic speech recognition with multi-language detection and translation',
      'Audio extraction pipeline optimized with FFmpeg streaming',
      'Dual output support for industry standard .SRT and .VTT subtitle formats',
      'Interactive Streamlit UI with live video preview and instant subtitle playback'
    ],
    liveUrl: 'https://built-by-ubaid-multilingual-video-subtitle-generator.streamlit.app/',
    githubUrl: 'https://github.com/UbaidRaza-jpg/Multilingual-Video-Subtitle-Generator'
  },
  'therac-recovery': {
    title: 'THERAC-25 Recovery System',
    role: 'Mission-Critical Simulator & Safety Verifier',
    tag: 'SYSTEMS PROGRAMMING',
    stack: ['C++', 'Graph Data Structures', 'Stacks', 'Linked Lists', 'File Handling'],
    desc: 'A robust risk-validated workflow simulator inspired by the historic Therac-25 radiation machine case study. Designed to eliminate race conditions and software faults through state validation graphs, operation rollback stacks, and strict state machine transitions.',
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
    role: 'Enterprise Operations & Booking Engine',
    tag: 'ENTERPRISE SOFTWARE',
    stack: ['Java', 'OOP Architecture', 'Swing GUI', 'Relational DB / File IO'],
    desc: 'A comprehensive management system built in Java to streamline facility operations. Handles real-time room availability, resident check-in/check-out workflows, automatic billing, and record persistence using rigorous Object-Oriented principles.',
    features: [
      'Modular OOP design with full encapsulation, inheritance, and clean polymorphism',
      'Room reservation engine with dynamic status updates and conflict avoidance',
      'Automated invoice and expense calculation with itemized billing receipts',
      'Search and filter functionality for rapid resident verification'
    ],
    liveUrl: null,
    githubUrl: 'https://github.com/UbaidRaza-jpg/Hostel-Management-System'
  },
  'garden-mgmt': {
    title: 'Effective Garden Management',
    role: 'Algorithmic Resource & Schedule Engine',
    tag: 'ALGORITHM DESIGN',
    stack: ['C++', 'Data Structures', 'OOP', 'Resource Scheduling'],
    desc: 'An algorithmic management tool developed in C++ to optimize agricultural resources. Calculates hydration requirements, soil care schedules, and growth tracking metrics through computational routines and data structures.',
    features: [
      'Optimized watering algorithms based on environmental factors and plant profiles',
      'Categorized registry using linked data structures for fast lookup',
      'Predictive diagnostic warnings for nutrient replenishment and harvest timing',
      'Minimal memory footprint and fast execution speed in pure C++'
    ],
    liveUrl: null,
    githubUrl: 'https://github.com/UbaidRaza-jpg/Effective-Garden-Management'
  }
};

window.openProjectModal = function(projectId) {
  const modalOverlay = document.getElementById('projectModalOverlay');
  const project = projectsData[projectId];
  if (!project || !modalOverlay) return;

  populateProjectModal(project);
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModalOverlay');
  const closeBtn = document.getElementById('projectModalClose');
  const tacticalCards = document.querySelectorAll('.pitch-player-slot, .project-tactical-card');

  if (!modalOverlay || !closeBtn) return;

  tacticalCards.forEach((el) => {
    const slot = el.closest('.pitch-player-slot') || el;
    const projectId = slot.getAttribute('data-project');
    if (!projectId) return;

    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      window.openProjectModal(projectId);
    });
  });

  closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
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
    if (liveCallout && calloutBtn) {
      liveCallout.style.display = 'flex';
      calloutBtn.href = project.liveUrl;
    }
    if (liveBtn) {
      liveBtn.href = project.liveUrl;
      liveBtn.style.display = 'inline-flex';
    }
  } else {
    if (liveCallout) {
      liveCallout.style.display = 'none';
    }
    if (liveBtn) {
      liveBtn.style.display = 'none';
    }
  }

  const githubBtn = document.getElementById('modalGithubLink');
  if (project.githubUrl) {
    githubBtn.href = project.githubUrl;
    githubBtn.style.display = 'inline-flex';
  } else {
    githubBtn.style.display = 'none';
  }
}

/* ==========================================================================
   5. SCOUT DOSSIER (UPDATED SOFTWARE ENGINEER RESUME MODAL)
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resumeModalOverlay');
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('resumeModalClose');
  const printBtn = document.getElementById('printResumeBtn');

  if (!resumeModal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
          resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
          // Ensure modal stays visible and body scroll is restored before printing
      resumeModal.classList.add('active');
      document.body.style.overflow = '';
      // Small delay to let the browser settle before opening print dialog
      setTimeout(() => {
        window.print();
        // Restore scroll lock after print dialog closes
        document.body.style.overflow = 'hidden';
      }, 120);
    });
  }
}

/* ==========================================================================
   6. MOBILE NAVIGATION MENU
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
   8. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ========================================================================== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navAnchors.length) return;

  window.addEventListener('scroll', () => {
    let current = 'hero';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    // Force highlight "Contact" if user is at the absolute bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      current = 'contact';
    }

    navAnchors.forEach((a) => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  });
}



/* ==========================================================================
   9. SCROLL REVEAL ANIMATION ENGINE
   ========================================================================== */
function initScrollReveal() {
  // Auto-apply scroll-reveal class to trophy cards and timeline items
  const revealTargets = [
    ...document.querySelectorAll('.trophy-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.skill-category-card'),
    ...document.querySelectorAll('.contact-dossier-card'),
    ...document.querySelectorAll('.contact-form-box')
  ];

  revealTargets.forEach((el) => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => observer.observe(el));
}


/* ==========================================================================
   10. CUSTOM MOUSE CURSOR ENGINE
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const trail = document.getElementById('cursorTrail');
  if (!dot || !trail) return;

  // Only run on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = window.innerWidth / 2;
  let trailY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    
    trail.style.transform = `translate(calc(${trailX}px - 50%), calc(${trailY}px - 50%))`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Add hover effect for all clickable elements
  const clickables = document.querySelectorAll('a, button, input, textarea, .card-project, .fut-card, .project-tactical-card, .pitch-player-slot');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      trail.style.width = '48px';
      trail.style.height = '48px';
      trail.style.backgroundColor = 'rgba(0, 240, 255, 0.15)';
      trail.style.borderColor = 'rgba(0, 240, 255, 0.8)';
      dot.style.backgroundColor = 'var(--gold-primary)';
    });
    el.addEventListener('mouseleave', () => {
      trail.style.width = '32px';
      trail.style.height = '32px';
      trail.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
      trail.style.borderColor = 'rgba(0, 240, 255, 0.5)';
      dot.style.backgroundColor = 'var(--ucl-cyan)';
    });
  });
}

/* ==========================================================================
   9. ASYNC CONTACT INQUIRY ENGINE (SEAMLESS IN-PAGE DISPATCH)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('transferInquiryForm');
  const statusMsg = document.getElementById('formStatusMessage');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'DISPATCHING INQUIRY... ⚡';
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
          statusMsg.style.background = 'rgba(0, 240, 255, 0.1)';
          statusMsg.style.border = '1px solid var(--border-ucl)';
          statusMsg.style.color = 'var(--ucl-cyan)';
          statusMsg.innerHTML = '⚽ <strong>Inquiry Dispatched Successfully!</strong> Muhammad Ubaid Raza will review and respond directly to your email.';
        }
        form.reset();
      } else {
        throw new Error('Server response was not ok');
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = 'rgba(239, 68, 68, 0.15)';
        statusMsg.style.border = '1px solid #ef4444';
        statusMsg.style.color = '#fca5a5';
        statusMsg.innerHTML = '⚠️ Transmission failed. Please email directly at <strong>ubaid183d9@gmail.com</strong>';
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
