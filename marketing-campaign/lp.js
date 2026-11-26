/* ==========================================================================
   TAKEES CAMPAIGN LANDING PAGE (/marketing-campaign/)
   Standalone: this file is only loaded by marketing-campaign/index.html.
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '918137890091';

  /* ------------------------------------------------------------------
     CLIENT TESTIMONIALS
     Add real client quotes here (with the client's permission). The
     Testimonials section stays hidden while this list is empty.
     Example:
     { quote: 'Our enquiries doubled in three months…', name: 'Dr. Name',
       role: 'Founder, Clinic Name', logo: '/assets/images/clients/toothent-logo.png' },
     ------------------------------------------------------------------ */
  var TESTIMONIALS = [];

  /* Client logos for the moving strip */
  var LOGOS = [
    ['toothent', 'Toothent'], ['kyma-gold', 'Kyma Gold'], ['feliz-dentistry', 'Feliz Dentistry'],
    ['keycee-constructions', 'Keycee Constructions'], ['the-cakery', 'The Cakery'], ['elor-lighting', 'Elor Lighting'],
    ['vastragni', 'Vastragni'], ['hikaya', 'Hikaya'], ['namma-cafe', 'Namma Cafe'], ['icd', 'iCD'],
    ['aroma-tours-and-travels', 'Aroma Tours and Travels'], ['roomskart', 'Roomskart'], ['snooze-living', 'Snooze Living'],
    ['flyscanner', 'Flyscanner'], ['eqtaad', 'Eqtaad'], ['adaxes', 'Adaxes'], ['sorbete', 'Sorbete'],
    ['specs-mart', 'Specs Mart'], ['zafcon', 'Zafcon'], ['struqta', 'Struqta'], ['dr-febis', 'Dr. Febis'],
    ['cake-studio', 'Cake Studio'], ['wgl', 'WGL'], ['vismaya-greenlines', 'Vismaya Greenlines']
  ];

  /* Our work */
  var B = '/assets/images/works/';
  var WORK = {
    branding: [
      { title: 'Toothent', sub: 'Dental clinic brand identity', img: B + 'toothent/toothent-reception-wall', logo: 'toothent' },
      { title: 'Elor Lighting', sub: 'Premium lighting brand', img: B + 'elor/elor-storefront', logo: 'elor-lighting' },
      { title: 'Vastragni', sub: 'Silk saree brand', img: B + 'vastragni/vastragni-showroom', logo: 'vastragni' },
      { title: 'Hikaya', sub: 'Café brand identity', img: B + 'hikaya/hikaya-wall-sign', logo: 'hikaya' },
      { title: 'Namma Cafe', sub: 'Café signage and social', img: B + 'namma-cafe/namma-cafe-hanging-sign', logo: 'namma-cafe' },
      { title: 'iCD', sub: 'Education brand and campaigns', img: B + 'icd/icd-billboard', logo: 'icd' }
    ],
    websites: [
      { title: 'The Cakery', sub: 'Cake shop website, Kannur', img: B + 'websites/websites-the-cakery-desktop', thumb: B + 'websites/websites-the-cakery-thumb', url: 'https://thecakery.in/' },
      { title: 'Toothent', sub: 'Dental clinic website', img: B + 'websites/websites-toothent-desktop', thumb: B + 'websites/websites-toothent-thumb', url: 'https://toothent.com/' },
      { title: 'Takees Cowork', sub: 'Coworking space website', img: B + 'websites/websites-takees-cowork-desktop', thumb: B + 'websites/websites-takees-cowork-thumb', url: 'https://takeescowork.com/' }
    ],
    posters: [
      ['kyma-gold-wayanad', 'Journey to Wayanad', 'Kyma Gold'],
      ['the-cakery-hazelnut-cake', 'Hazelnut Cake', 'The Cakery'],
      ['flyscanner-azerbaijan', 'Azerbaijan Holiday Offer', 'Flyscanner'],
      ['keycee-why-choose-us', 'Why Choose Us', 'KeyCee Constructions'],
      ['cafe-39-summer-drinks', 'Summer Drinks', 'Café 39'],
      ['snooze-living-check-in', 'Check-in', 'Snooze Living'],
      ['adaxes-bridal-makeup', 'Bridal Makeup', 'Adaxes'],
      ['the-monsoon-pizza', 'Pizza', 'The Monsoon'],
      ['icd-nios-admission', 'NIOS Admission', 'iCD'],
      ['roomskart-property-resale', 'Property Resale', 'Roomskart'],
      ['the-new-store-collections', 'New Collections', 'The New Store'],
      ['takees-estates-investment', 'Long-Term Investment', 'Takees Estates']
    ].map(function (p) {
      return { title: p[1], sub: p[2], img: B + 'posters/posters-' + p[0] };
    })
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };

  /* ------------------------------------------------------------------ Tracking
     Sends events to Google Tag Manager (dataLayer) and the Meta Pixel. */
  function track(event, detail) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: event, lp: 'marketing-campaign' }, detail || {}));
      if (typeof window.fbq === 'function') {
        if (event === 'generate_lead') window.fbq('track', 'Lead');
        else window.fbq('track', 'Contact', { method: detail && detail.method });
      }
    } catch (e) { /* tracking must never break the page */ }
  }

  /* Campaign source (utm_* in the ad link), kept for the visit */
  function campaignInfo() {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var params = new URLSearchParams(window.location.search);
    var info = {};
    keys.forEach(function (k) { if (params.get(k)) info[k] = params.get(k).slice(0, 80); });
    try {
      if (Object.keys(info).length) sessionStorage.setItem('lpCampaign', JSON.stringify(info));
      else info = JSON.parse(sessionStorage.getItem('lpCampaign') || '{}');
    } catch (e) { /* storage blocked */ }
    return info;
  }

  /* ------------------------------------------------------------------ Logos */
  function initLogos() {
    var track = $('#lpLogoTrack');
    if (!track) return;
    var html = LOGOS.map(function (l) {
      return '<img src="/assets/images/clients/' + l[0] + '-logo.png" alt="' + esc(l[1]) + '" loading="lazy" height="46">';
    }).join('');
    // The list is written twice so the strip can loop without a gap
    track.innerHTML = html + html.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');
  }

  /* ------------------------------------------------------------------ Work tabs + viewer */
  var current = { kind: 'branding', index: 0 };

  function renderWork(kind) {
    var grid = $('#lpWork');
    grid.dataset.kind = kind;
    grid.innerHTML = WORK[kind].map(function (w, i) {
      var thumb = (w.thumb || w.img) + '-thumb.webp';
      if (w.thumb) thumb = w.thumb + '.webp';
      if (kind === 'branding') thumb = w.img + '-thumb.webp';
      var logo = w.logo ? '<img class="lp-work-card__logo" src="/assets/images/clients/' + w.logo + '-logo.png" alt="" loading="lazy">' : '';
      return '<button type="button" class="lp-work-card" data-i="' + i + '" style="animation-delay:' + (i * 60) + 'ms" aria-label="' + esc(w.title + ', ' + w.sub) + '">' +
        '<img class="lp-work-card__img" src="' + thumb + '" alt="" loading="lazy">' + logo +
        '<span class="lp-work-card__cap"><b>' + esc(w.title) + '</b><span>' + esc(w.sub) + '</span></span></button>';
    }).join('');
  }

  function initWork() {
    var grid = $('#lpWork');
    if (!grid) return;
    renderWork('branding');
    $$('.lp-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        $$('.lp-tab').forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        current.kind = tab.dataset.tab;
        renderWork(current.kind);
        track('lp_work_tab', { tab: current.kind });
      });
    });
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.lp-work-card');
      if (card) openViewer(Number(card.dataset.i));
    });

    var viewer = $('#lpViewer');
    if (!viewer || typeof viewer.showModal !== 'function') return;
    $('.lp-viewer__close', viewer).addEventListener('click', function () { viewer.close(); });
    $('.lp-viewer__nav--prev', viewer).addEventListener('click', function () { step(-1); });
    $('.lp-viewer__nav--next', viewer).addEventListener('click', function () { step(1); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    var startX = null;
    viewer.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      startX = null;
    });
  }

  function openViewer(i) {
    var viewer = $('#lpViewer');
    if (!viewer || typeof viewer.showModal !== 'function') return;
    current.index = i;
    showItem();
    if (!viewer.open) viewer.showModal();
  }

  function step(d) {
    var list = WORK[current.kind];
    current.index = (current.index + d + list.length) % list.length;
    showItem();
  }

  function showItem() {
    var w = WORK[current.kind][current.index];
    var img = $('#lpViewerImg');
    img.src = w.img + '.webp';
    img.alt = w.title + ', ' + w.sub;
    $('#lpViewerCap').innerHTML = '<b>' + esc(w.title) + '</b> · ' + esc(w.sub) +
      (w.url ? '<a href="' + w.url + '" target="_blank" rel="noopener">Visit website ↗</a>' : '') +
      ' <span style="opacity:.6">(' + (current.index + 1) + ' / ' + WORK[current.kind].length + ')</span>';
  }

  /* ------------------------------------------------------------------ Testimonials */
  function initTestimonials() {
    var section = $('#testimonials');
    if (!section || !TESTIMONIALS.length) return;
    $('#lpQuotes').innerHTML = TESTIMONIALS.map(function (t) {
      return '<figure class="lp-quote"><div class="lp-quote__stars" aria-label="5 stars">★★★★★</div>' +
        '<blockquote>' + esc(t.quote) + '</blockquote><figcaption>' +
        (t.logo ? '<img src="' + t.logo + '" alt="" loading="lazy">' : '') +
        '<div><b>' + esc(t.name) + '</b><span>' + esc(t.role || '') + '</span></div></figcaption></figure>';
    }).join('');
    section.hidden = false;
  }

  /* ------------------------------------------------------------------ Enquiry form
     The site has no mail server, so the enquiry opens in WhatsApp with
     every filled-in field, ready for the visitor to tap Send. */
  function initForm() {
    var form = $('#lpForm');
    if (!form) return;
    var feedback = $('#lpFeedback');
    var labels = { name: 'Name', phone: 'Phone', email: 'Email', business: 'Business', service: 'Service', message: 'Goal' };

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.lp-field');
      if (field) field.classList.remove('is-invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, phone = form.elements.phone, email = form.elements.email;
      var error = '';
      if (!name.value.trim()) { error = 'Please enter your name.'; mark(name); }
      else if (phone.value.replace(/\D/g, '').length < 8) { error = 'Please enter a valid phone number.'; mark(phone); }
      else if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { error = 'Please check your email address.'; mark(email); }
      if (error) {
        feedback.className = 'lp-form__feedback is-error';
        feedback.textContent = error;
        return;
      }

      var lines = ['Hi Takees Marketing, I would like a free strategy call.', ''];
      Object.keys(labels).forEach(function (key) {
        var el = form.elements[key];
        var v = el && el.value.trim();
        if (v) lines.push(labels[key] + ': ' + v);
      });
      var camp = campaignInfo();
      var campText = ['utm_source', 'utm_campaign'].map(function (k) { return camp[k]; }).filter(Boolean).join(' / ');
      lines.push('', 'Sent from the Takees campaign page' + (campText ? ' (' + campText + ')' : ''));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

      track('generate_lead', { method: 'form', service: form.elements.service.value || '' });
      var win = window.open(url, '_blank');
      if (win) win.opener = null;

      feedback.className = 'lp-form__feedback is-ok';
      feedback.textContent = win
        ? 'WhatsApp has opened with your details. Tap Send there and our team will reply soon. '
        : 'Your enquiry is ready. ';
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = win ? 'Open WhatsApp again' : 'Open WhatsApp to send it';
      feedback.appendChild(a);
    });

    function mark(input) {
      input.closest('.lp-field').classList.add('is-invalid');
      input.focus();
    }
  }

  /* ------------------------------------------------------------------ CTA clicks */
  function initClickTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-track]');
      if (!link) return;
      track('lp_contact_click', { method: link.dataset.track });
    });
  }

  /* ------------------------------------------------------------------ Header, mobile bar, reveal */
  function initChrome() {
    var header = $('#lpHeader');
    var bar = $('#lpMobileBar');
    var hero = $('.lp-hero');
    var contact = $('#contact');
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      if (bar && hero) {
        var pastHero = y > hero.offsetHeight * 0.6;
        var atForm = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.6 &&
          contact.getBoundingClientRect().bottom > window.innerHeight * 0.4;
        bar.classList.toggle('is-shown', pastHero && !atForm);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var year = $('#lpYear');
    if (year) year.textContent = new Date().getFullYear();

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.lp-head, .lp-about__copy, .lp-about__media, .lp-service, .lp-case, .lp-why__list li, .lp-stats, .lp-form').forEach(function (el, i) {
      el.classList.add('lp-reveal');
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  }

  campaignInfo();
  initLogos();
  initWork();
  initTestimonials();
  initForm();
  initClickTracking();
  initChrome();
})();
