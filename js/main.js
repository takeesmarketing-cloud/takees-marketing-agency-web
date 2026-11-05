/**
 * TAKEES MARKETING - MAIN JAVASCRIPT
 * Vanilla JS logic for interactions, navigation, accordions, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  tidyHomeAddress();
  clearLegacyThemePreference();
  initClients();
  initNavigation();
  initFaqAccordion();
  initFormValidation();
  initSmoothScroll();
  initBlogFilter();
  initPricing();
  initTeamMarquee();
  initMarqueeMotion();

  // Premium Marketing Agency Motion Suite
  initHeroHeadlineReveal();
  initHeroBackgroundAccents();
  initNumberCounters();
  initScrollReveals();
  initParallaxEffects();
});

/**
 * Visitors sent on from the old cached home page arrive at /?home
 * (see wp-includes/js/jquery/jquery.min.js); show the address as plain /.
 */
function tidyHomeAddress() {
  if (window.location.pathname === '/' && window.location.search === '?home') {
    history.replaceState(null, '', '/' + window.location.hash);
  }
}

function clearLegacyThemePreference() {
  try {
    localStorage.removeItem('takees-theme');
  } catch (error) {
    console.warn('Unable to clear the saved theme preference.', error);
  }
}

/**
 * Services pricing: the Standard / Plus switch swaps every card (and its
 * WhatsApp message) to the matching plan.
 */
function initPricing() {
  const section = document.getElementById('pricing');
  if (!section) return;

  const switches = section.querySelectorAll('.pricing-switch-btn');
  const ctas = section.querySelectorAll('.pricing-cta');

  const setType = (type) => {
    const isPlus = type === 'plus';
    section.classList.toggle('is-plus', isPlus);
    switches.forEach(btn => {
      const active = btn.dataset.planType === type;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    ctas.forEach(cta => {
      const plan = cta.dataset.plan + (isPlus ? ' Plus' : '');
      const url = new URL(cta.href);
      url.searchParams.set('text', `Hi Takees Marketing, I'm interested in the ${plan} plan.`);
      cta.href = url.toString();
    });
  };

  switches.forEach(btn => btn.addEventListener('click', () => setType(btn.dataset.planType)));
}

/**
 * Team marquee: the team grid becomes two rows of cards sliding in opposite
 * directions. Each row holds its cards twice so the slide can loop without a
 * jump. Without JS, or with reduced motion, the plain grid stays.
 */
/**
 * Motion for the sliding rows (team photos, client logos). Each row drifts at
 * its own pace, speeds up while the page is scrolled (and briefly runs the
 * other way when scrolling up), can be dragged or swiped with momentum, and
 * eases to a stop under a mouse. Rows hold their items twice, so the position
 * wraps by one set's width without a visible jump.
 */
function initMarqueeMotion() {
  const tracks = document.querySelectorAll('.team-marquee-track, .clients-marquee-track');
  if (!tracks.length) return;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const rows = Array.from(tracks).map(track => {
    const row = track.parentElement;
    const seconds = parseFloat(track.style.getPropertyValue('--team-duration'))
      || parseFloat(track.style.getPropertyValue('--clients-duration')) || 48;
    return {
      track, row, seconds,
      direction: row.classList.contains('is-reverse') ? 1 : -1,
      setWidth: 0, offset: 0, speed: 0, boost: 0, fling: 0,
      hovered: false, drag: null, visible: true,
    };
  });

  // One set's width: from the first item to the first copy of it
  const measure = state => {
    const items = state.track.children;
    const half = items.length / 2;
    const oldWidth = state.setWidth;
    state.setWidth = items[half].offsetLeft - items[0].offsetLeft;
    if (oldWidth) state.offset *= state.setWidth / oldWidth;
  };
  const wrap = state => {
    const w = state.setWidth;
    if (w > 0) state.offset = ((state.offset % w) + w) % w - w;
  };

  rows.forEach(state => {
    const { row, track } = state;
    track.querySelectorAll('img').forEach(img => { img.draggable = false; });
    measure(state);
    state.offset = state.direction > 0 ? -state.setWidth : 0;
    state.speed = state.setWidth / state.seconds;

    if (finePointer) {
      row.addEventListener('mouseenter', () => { state.hovered = true; });
      row.addEventListener('mouseleave', () => { state.hovered = false; });
    }

    // Drag or swipe sideways; vertical swipes are left to the page scroll
    row.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      state.drag = { x: event.clientX, y: event.clientY, start: state.offset, axis: null, lastX: event.clientX, lastT: event.timeStamp, velocity: 0 };
    });
    row.addEventListener('pointermove', event => {
      const drag = state.drag;
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.axis) {
        if (Math.abs(dx) < 6 && Math.abs(event.clientY - drag.y) < 6) return;
        drag.axis = Math.abs(dx) > Math.abs(event.clientY - drag.y) ? 'x' : 'y';
        if (drag.axis === 'x') {
          row.setPointerCapture(event.pointerId);
          row.classList.add('is-dragging');
        }
      }
      if (drag.axis !== 'x') return;
      const dt = Math.max(event.timeStamp - drag.lastT, 1) / 1000;
      drag.velocity = (event.clientX - drag.lastX) / dt;
      drag.lastX = event.clientX;
      drag.lastT = event.timeStamp;
      state.offset = drag.start + dx;
      wrap(state);
    });
    const endDrag = () => {
      if (state.drag && state.drag.axis === 'x') {
        state.fling = Math.max(-3000, Math.min(3000, state.drag.velocity));
        row.classList.remove('is-dragging');
      }
      state.drag = null;
    };
    row.addEventListener('pointerup', endDrag);
    row.addEventListener('pointercancel', endDrag);
  });

  // Only rows on screen are moved
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = rows.find(s => s.row === entry.target);
        if (state) state.visible = entry.isIntersecting;
      });
    }, { rootMargin: '100px 0px' });
    rows.forEach(state => observer.observe(state.row));
  }

  let scrollKick = 0;
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollKick += window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
  }, { passive: true });
  window.addEventListener('resize', () => rows.forEach(state => { measure(state); wrap(state); }));

  let lastTime = performance.now();
  const frame = now => {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const kick = scrollKick;
    scrollKick = 0;

    rows.forEach(state => {
      const base = state.setWidth / state.seconds;
      // Ease towards the normal pace, or to a stop under the mouse
      const target = state.hovered && !state.drag ? 0 : base;
      state.speed += (target - state.speed) * (1 - Math.exp(-dt * 5));
      // Scrolling adds speed: down pushes the row on, up pulls it back
      state.boost += kick * 6;
      state.boost = Math.max(-base * 10, Math.min(base * 10, state.boost)) * Math.exp(-dt * 3);
      state.fling *= Math.exp(-dt * 2.5);

      if (!state.visible) return;
      // While dragged the row follows the pointer (set in pointermove)
      if (!(state.drag && state.drag.axis === 'x')) {
        state.offset += (state.direction * (state.speed + state.boost) + state.fling) * dt;
        wrap(state);
      }
      state.track.style.transform = `translate3d(${state.offset.toFixed(2)}px, 0, 0)`;
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function initTeamMarquee() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.team-section .container').forEach(container => {
    const grids = container.querySelectorAll('.team-grid');
    const cards = Array.from(container.querySelectorAll('.team-grid > .team-card'));
    if (cards.length < 4) return;

    const wrap = document.createElement('div');
    wrap.className = 'team-marquee-wrap';
    const half = Math.ceil(cards.length / 2);

    [cards.slice(0, half), cards.slice(half)].forEach((rowCards, i) => {
      const row = document.createElement('div');
      row.className = 'team-marquee' + (i === 1 ? ' is-reverse' : '');
      const track = document.createElement('div');
      track.className = 'team-marquee-track';
      track.style.setProperty('--team-duration', `${rowCards.length * 4}s`);

      rowCards.forEach(card => track.appendChild(card));
      rowCards.forEach(card => {
        const copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelectorAll('img').forEach(img => { img.alt = ''; });
        track.appendChild(copy);
      });

      row.appendChild(track);
      wrap.appendChild(row);
    });

    grids[0].before(wrap);
    grids.forEach(grid => grid.remove());
  });
}

/**
 * Toggle visibility of all client logos.
 */
function initClients() {
  const grid = document.getElementById('clientsGrid');
  if (!grid) return;
  // Without motion the plain grid of all clients stays
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // One row of client logos sliding endlessly. The row holds its logos
  // twice so the slide can loop without a jump.
  const cards = Array.from(grid.querySelectorAll('.client-logo'));
  if (cards.length < 4) return;
  // Logos slide in from the side, so load them now rather than when scrolled to
  grid.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
  const wrap = document.createElement('div');
  wrap.className = 'clients-marquee-wrap';
  const row = document.createElement('div');
  row.className = 'clients-marquee';
  const track = document.createElement('ul');
  track.className = 'clients-marquee-track';
  track.setAttribute('aria-label', grid.getAttribute('aria-label'));
  track.style.setProperty('--clients-duration', `${cards.length * 3}s`);

  cards.forEach(card => track.appendChild(card));
  cards.forEach(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach(img => { img.alt = ''; });
    track.appendChild(copy);
  });

  row.appendChild(track);
  wrap.appendChild(row);
  grid.replaceWith(wrap);
}

/**
 * Blog Category Filter
 */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (!filterBtns.length || !blogCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      blogCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Navigation & Mobile Drawer
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // Lock scrolling on html, not body: overflow on body breaks the sticky header
      document.documentElement.style.overflowY = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          menuToggle.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.documentElement.style.overflowY = '';
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open') && 
          !navMenu.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.documentElement.style.overflowY = '';
      }
    });
  }

  // Active state highlighting based on current page
  highlightActiveNav();
}

function highlightActiveNav() {
  // Links use clean addresses (/, /about, /services …)
  const currentPath = '/' + window.location.pathname.split('/').pop().replace(/\.html$/, '').replace(/^index$/, '');
  const navLinks = document.querySelectorAll('.nav-link');

  // Pages without their own menu item (e.g. /blog-details) keep the
  // active link set in their markup.
  const hasMatch = [...navLinks].some(link => link.getAttribute('href') === currentPath);
  if (!hasMatch) return;

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPath);
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });
}

/**
 * Front-end Contact Form Validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('.contact-form, #heroForm, #contactPageForm');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"], #fullName, #name');
      const phoneInput = form.querySelector('input[name="phone"], #phone');
      const emailInput = form.querySelector('input[name="email"], #email');
      const feedbackEl = form.querySelector('.form-feedback') || createFeedbackEl(form);

      let isValid = true;
      let errorMessage = '';

      // Validate Name
      if (nameInput && !nameInput.value.trim()) {
        isValid = false;
        errorMessage = 'Please enter your full name.';
        nameInput.focus();
      }
      // Validate Phone (at least 8 digits)
      else if (phoneInput && !validatePhone(phoneInput.value.trim())) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number (min 8 digits).';
        phoneInput.focus();
      }
      // Validate Email (if present)
      else if (emailInput && !validateEmail(emailInput.value.trim())) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
        emailInput.focus();
      }

      if (!isValid) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = errorMessage;
        feedbackEl.style.display = 'block';
        return;
      }

      // The site has no server-side mail, so the enquiry is sent through
      // WhatsApp to the same number as the page's WhatsApp button
      const whatsappUrl = buildEnquiryWhatsAppUrl(form);
      const opened = window.open(whatsappUrl, '_blank');
      if (opened) opened.opener = null;

      feedbackEl.className = 'form-feedback success';
      feedbackEl.replaceChildren(document.createTextNode(opened
        ? 'WhatsApp has opened with your details. Tap Send there so our team receives your enquiry. '
        : 'Your details are ready to send on WhatsApp. '));
      const sendLink = document.createElement('a');
      sendLink.href = whatsappUrl;
      sendLink.target = '_blank';
      sendLink.rel = 'noopener';
      sendLink.textContent = opened ? 'Open WhatsApp again' : 'Open WhatsApp to send';
      feedbackEl.append(sendLink);
      feedbackEl.style.display = 'block';
    });
  });
}

/**
 * Builds a wa.me link whose message lists every filled-in form field.
 */
function buildEnquiryWhatsAppUrl(form) {
  const pageButton = document.querySelector('.floating-whatsapp[href*="wa.me/"]');
  const number = pageButton ? pageButton.getAttribute('href').match(/wa\.me\/(\d+)/)[1] : '918137890091';

  const fieldNames = { name: 'Name', phone: 'Phone', email: 'Email', service: 'Service', goal: 'Goal', message: 'Message' };
  const lines = ['Hi Takees Marketing, I would like to get in touch.', ''];
  form.querySelectorAll('input[name], select[name], textarea[name]').forEach(field => {
    const value = field.value.trim();
    if (!value || field.type === 'hidden') return;
    const label = form.querySelector(`label[for="${field.id}"]`);
    const name = fieldNames[field.name] || (label ? label.textContent.replace(/[*:]/g, '').trim() : field.name);
    lines.push(`${name}: ${value}`);
  });
  lines.push('', `Sent from ${window.location.href.split(/[?#]/)[0]}`);

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function createFeedbackEl(form) {
  const div = document.createElement('div');
  div.className = 'form-feedback';
  form.appendChild(div);
  return div;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Allow optional +, digits, spaces, hyphens, min 8 digits
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{8,15}$/.test(clean);
}

/**
 * Smooth scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * ==========================================================================
 * PREMIUM MARKETING AGENCY MOTION SUITE
 * ==========================================================================
 */

/**
 * 1. H1 Word-by-Word Reveal & Upward Fade
 */
function initHeroHeadlineReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const headings = document.querySelectorAll('h1');
  if (!headings.length) return;

  headings.forEach(heading => {
    if (heading.dataset.wordWrapped) return;
    heading.dataset.wordWrapped = 'true';

    // Preserve child elements or split text cleanly
    const nodes = Array.from(heading.childNodes);
    let wordCounter = 0;
    const fragment = document.createDocumentFragment();

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim().length === 0) {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.style.setProperty('--word-idx', wordCounter++);
            inner.textContent = word;
            wrap.appendChild(inner);
            fragment.appendChild(wrap);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        fragment.appendChild(node.cloneNode(true));
      } else {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.style.setProperty('--word-idx', wordCounter++);
        inner.innerHTML = node.outerHTML;
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
      }
    });

    heading.innerHTML = '';
    heading.appendChild(fragment);

    requestAnimationFrame(() => {
      heading.classList.add('is-revealed');
    });
  });
}

/**
 * 2. Hero Background Glow
 */
function initHeroBackgroundAccents() {
  const heroes = document.querySelectorAll('.dark-hero');
  if (!heroes.length) return;

  heroes.forEach(hero => {
    // Subtle animated radial purple glow orb (kept on all hero sections)
    if (!hero.querySelector('.hero-bg-glow')) {
      const glow = document.createElement('div');
      glow.className = 'hero-bg-glow';
      glow.setAttribute('aria-hidden', 'true');
      hero.prepend(glow);
    }
  });
}

/**
 * 3. Count-up Animation for Statistics & Achievements
 */
function initNumberCounters() {
  const statCards = document.querySelectorAll('.stat-card, .achievement-card, .counter-item, .stat-number');
  if (!statCards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const numEl = card.classList.contains('stat-number') ? card : card.querySelector('.stat-number, .achievement-number, .counter-number');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          animateCountUp(numEl);
        }
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  statCards.forEach(card => observer.observe(card));
}

function animateCountUp(el) {
  const originalText = el.textContent.trim();
  const match = originalText.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
  if (!match) return;

  const prefix = match[1] || '';
  const rawNumber = parseFloat(match[2].replace(/,/g, ''));
  const suffix = match[3] || '';
  const isDecimal = match[2].includes('.');

  if (isNaN(rawNumber)) return;

  const duration = 1300;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = rawNumber * easeProgress;

    const formattedValue = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue).toLocaleString();
    el.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = originalText;
    }
  }

  requestAnimationFrame(update);
}

/**
 * 4. Staggered Scroll Entrance Animations for Cards & Headings
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(`
    .feature-card,
    .service-card,
    .service-detail-card,
    .service-item-box,
    .blog-card,
    .team-card,
    .stat-card,
    .achievement-card,
    .discipline-item,
    .ai-directory-card,
    .founder-wrap,
    .contact-card,
    .section-title-wrap,
    .why-takees-header,
    .disciplines-header,
    .prompt-col-title,
    .ai-prompt-studio-card,
    .contact-benefit-card,
    .clients-title,
    .client-logo
  `);

  if (!revealElements.length) return;

  // Compute staggered delay index per grid container
  const gridContainers = document.querySelectorAll('.cards-grid-4, .team-grid, .stats-grid-5, .disciplines-row, .ai-catalog-grid, .blog-grid, .services-grid, .services-grid-8, .contact-benefits-grid-4, .blogs-grid-3, .bangalore-process-grid, .clients-logo-row');
  gridContainers.forEach(container => {
    Array.from(container.children).forEach((child, idx) => {
      child.style.setProperty('--stagger-index', container.classList.contains('clients-logo-row') ? idx : idx % 6);
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. Parallax Scroll Movement for Visual Cards & Images
 */
function initParallaxEffects() {
  const parallaxEls = document.querySelectorAll('.founder-img-box, .prompt-image-container, .achievement-img-box');
  if (!parallaxEls.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const winHeight = window.innerHeight;
        parallaxEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < winHeight && rect.bottom > 0) {
            const centerY = rect.top + rect.height / 2;
            const offset = (centerY - winHeight / 2) * -0.04;
            el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
