// ===== FREE FIRE TOURNAMENT - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. PARTICLE BACKGROUND ----
  const particleContainer = document.getElementById('particles');
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--dur', (4 + Math.random() * 8) + 's');
    p.style.setProperty('--delay', (Math.random() * 8) + 's');
    p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
    p.style.background = Math.random() > 0.5
      ? 'rgba(255,112,0,0.8)'
      : 'rgba(255,210,0,0.6)';
    particleContainer.appendChild(p);
  }


  // ---- 2. NAVBAR SCROLL + ACTIVE LINKS ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Scroll to top button
    const scrollTop = document.getElementById('scrollTop');
    if (window.scrollY > 400) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }

    // Scroll animations
    checkAnimations();
  });


  // ---- 3. HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
    });
  });


  // ---- 4. SCROLL-TRIGGERED ANIMATIONS ----
  function checkAnimations() {
    const animEls = document.querySelectorAll('[data-anim]');
    animEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  // Initial check
  checkAnimations();


  // ---- 5. ANIMATED STAT COUNTER ----
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let counted = false;

  function animateCounters() {
    if (counted) return;
    const heroSection = document.querySelector('.hero');
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      counted = true;
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = Math.floor(eased * target);
          el.textContent = current.toLocaleString('bn-BD');
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target.toLocaleString('bn-BD');
          }
        }

        requestAnimationFrame(updateCount);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters(); // run on load too


  // ---- 6. COUNTDOWN TIMER ----
  // Tournament date: June 10, 2026
  const tournamentDate = new Date('2026-06-10T16:00:00+06:00');

  function updateCountdown() {
    const now = new Date();
    const diff = tournamentDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '০০';
      document.getElementById('cd-hours').textContent = '০০';
      document.getElementById('cd-mins').textContent = '০০';
      document.getElementById('cd-secs').textContent = '০০';
      document.querySelector('.countdown-label').textContent = '🔥 টুর্নামেন্ট শুরু হয়ে গেছে!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = toBanglaNum(days);
    document.getElementById('cd-hours').textContent = toBanglaNum(hours);
    document.getElementById('cd-mins').textContent = toBanglaNum(mins);
    document.getElementById('cd-secs').textContent = toBanglaNum(secs);
  }

  function toBanglaNum(num) {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).padStart(2, '0').replace(/\d/g, d => digits[d]);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ---- 7. REGISTRATION FORM ----
  const regForm = document.getElementById('regForm');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModal = document.getElementById('closeModal');

  // Store registrations locally
  let registrations = JSON.parse(localStorage.getItem('ff_registrations') || '[]');

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const teamName = document.getElementById('teamName').value.trim();
    const leaderName = document.getElementById('leaderName').value.trim();
    const gameId = document.getElementById('gameId').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const members = document.getElementById('members').value.trim();
    const division = document.getElementById('division').value;

    // Validation
    if (!teamName || !leaderName || !gameId || !phone || !members) {
      shakeForm();
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(phone)) {
      showFieldError(document.getElementById('phone'), 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)');
      return;
    }

    // Save
    const entry = {
      id: Date.now(),
      teamName, leaderName, gameId, phone, members, division,
      time: new Date().toLocaleString('bn-BD')
    };

    registrations.push(entry);
    localStorage.setItem('ff_registrations', JSON.stringify(registrations));

    // Show success modal
    modalOverlay.classList.add('active');

    // Reset form
    regForm.reset();

    // Add success animation to button
    const btn = regForm.querySelector('.submit-btn span');
    btn.textContent = '✅ নিবন্ধন সফল!';
    setTimeout(() => { btn.textContent = 'নিবন্ধন সম্পন্ন করুন'; }, 3000);
  });

  closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  function shakeForm() {
    regForm.style.animation = 'none';
    regForm.offsetHeight; // reflow
    regForm.style.animation = 'shake .4s ease';
    regForm.addEventListener('animationend', () => {
      regForm.style.animation = '';
    }, { once: true });
  }

  function showFieldError(field, msg) {
    field.style.borderColor = '#ff3a1a';
    field.style.boxShadow = '0 0 0 3px rgba(255,58,26,0.2)';
    field.focus();

    const existing = field.nextElementSibling;
    if (existing && existing.classList.contains('field-err')) {
      existing.remove();
    }

    const err = document.createElement('span');
    err.classList.add('field-err');
    err.style.cssText = 'color:#ff3a1a;font-size:.8rem;margin-top:.2rem;display:block';
    err.textContent = msg;
    field.insertAdjacentElement('afterend', err);

    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow = '';
      const errEl = field.nextElementSibling;
      if (errEl && errEl.classList.contains('field-err')) errEl.remove();
    }, { once: true });
  }

  // Add shake keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);


  // ---- 8. INPUT FOCUS EFFECTS ----
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').querySelector('label').style.color = 'var(--fire-orange)';
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').querySelector('label').style.color = '';
    });
  });


  // ---- 9. SCROLL TO TOP BUTTON ----
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ---- 10. SMOOTH SCROLL FOR NAV LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });


  // ---- 11. PRIZE CARD TILT EFFECT ----
  const prizeCards = document.querySelectorAll('.prize-card');
  prizeCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 12;
      const yPct = (y / rect.height - 0.5) * 12;
      card.style.transform = `perspective(600px) rotateX(${-yPct}deg) rotateY(${xPct}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s ease';
    });
  });


  // ---- 12. INFO CARD HOVER GLOW ----
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,112,0,0.08) 0%, var(--dark-card) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });


  // ---- 13. PAGE LOAD ANIMATION ----
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

});
