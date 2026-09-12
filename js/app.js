/**
 * ==========================================================================
 * UCL + REAL MADRID THEMED PORTFOLIO ENGINE
 * Muhammad Ubaid Raza (#1) - AI Applications & Software Developer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initSoundEngine();
  initFutCardTilt();
  initLineupObserver();
  initProjectModals();
  initResumeModal();
  initMobileMenu();
  initContactForm();
  initActiveNav();
  initScrollReveal();
});

/* ==========================================================================
   1. SYNTHESIZED WEB AUDIO ENGINE (Zero External Audio Dependencies)
   ========================================================================== */
let audioCtx = null;
let isSoundEnabled = false;
let ambientGain = null;
let ambientSource = null;

function initSoundEngine() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isSoundEnabled = !isSoundEnabled;
    soundBtn.classList.toggle('active', isSoundEnabled);

    if (isSoundEnabled) {
      soundBtn.innerHTML = '🔊 SOUND ON';
      playRefereeWhistle();
      startStadiumAmbient();
    } else {
      soundBtn.innerHTML = '🔈 SOUND OFF';
      stopStadiumAmbient();
    }
  });
}

// Play a crisp synthetic referee whistle
function playRefereeWhistle() {
  if (!isSoundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(2900, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(2500, now + 0.2);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.error(e);
  }
}

// Subtle UI click / pop sound
function playUIClick() {
  if (!isSoundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.error(e);
  }
}

// Start warm stadium crowd ambiance
function startStadiumAmbient() {
  if (!audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    ambientSource = audioCtx.createBufferSource();
    ambientSource.buffer = noiseBuffer;
    ambientSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 320;
    filter.Q.value = 1.2;

    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.025, audioCtx.currentTime);

    ambientSource.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientSource.start();
  } catch (e) {
    console.error(e);
  }
}

function stopStadiumAmbient() {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
      ambientSource = null;
    } catch (e) {
      console.error(e);
    }
  }
}

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
    playRefereeWhistle();

    pitchSlots.forEach((slot, index) => {
      setTimeout(() => {
        slot.classList.add('popped-in');
        playUIClick();
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
    title: 'Hotel / Hostel Management System',
    role: 'Enterprise Operations & Booking Engine',
    tag: 'ENTERPRISE SOFTWARE',
    stack: ['Java', 'OOP Architecture', 'Swing GUI', 'Relational DB / File IO'],
    desc: 'A comprehensive management system built in Java to streamline facility operations. Handles real-time room availability, guest check-in/check-out workflows, automatic billing, and record persistence using rigorous Object-Oriented principles.',
    features: [
      'Modular OOP design with full encapsulation, inheritance, and clean polymorphism',
      'Room reservation engine with dynamic status updates and conflict avoidance',
      'Automated invoice and expense calculation with itemized billing receipts',
      'Search and filter functionality for rapid guest verification'
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

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModalOverlay');
  const closeBtn = document.getElementById('projectModalClose');
  const projectSlots = document.querySelectorAll('.pitch-player-slot');

  if (!modalOverlay || !closeBtn) return;

  projectSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      const projectId = slot.getAttribute('data-project');
      const project = projectsData[projectId];
      if (!project) return;

      playUIClick();
      populateProjectModal(project);
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
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

  // CTAs
  const liveBtn = document.getElementById('modalLiveLink');
  if (project.liveUrl) {
    liveBtn.href = project.liveUrl;
    liveBtn.style.display = 'inline-flex';
  } else {
    liveBtn.style.display = 'none';
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
      playUIClick();
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
      playUIClick();
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   7. PRESS ROOM / CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('transferInquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playUIClick();

    const name = document.getElementById('senderName').value;
    const organization = document.getElementById('senderOrg').value;
    const subject = document.getElementById('senderSubject').value;
    const message = document.getElementById('senderMessage').value;

    const emailBody = `Sender Name: ${name}\nOrganization/Club: ${organization}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:ubaid183d9@gmail.com?subject=${encodeURIComponent(`[Transfer Inquiry] ${subject}`)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;
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
