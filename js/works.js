/* Works page: category tabs, an endless sliding row of work cards (centred, running off both
   edges, auto-sliding), dots, arrows, drag/swipe and a detail view.
   The work itself comes from window.TAKEES_WORKS (js/works-data.js). */
(function () {
  const LABELS = {
    branding: 'Branding',
    websites: 'Websites',
    posters: 'Posters',
    videos: 'Videos',
  };
  const SINGULAR = {
    posters: 'Poster',
    websites: 'Website',
    branding: 'Branding',
    videos: 'Video',
  };
  const AUTO_MS = 3500;        // time each card stays in the centre
  const SLIDE_MS = 700;        // length of one slide

  // Posters/websites/videos, plus one "brand" card per brand for the Branding tab
  const brands = (window.TAKEES_BRANDS || []).filter(b => b && b.name).map(b => ({
    kind: 'brand',
    category: 'branding',
    title: b.name,
    logo: b.logo,
    description: b.description,
    designs: (b.designs || []).filter(d => d && d.image),
    cover: b.cover,
    theme: b.theme,
  })).map(b => ({ ...b, cover: b.cover || (b.designs[0] && b.designs[0].image) || '' }));
  const works = (window.TAKEES_WORKS || []).filter(w => w && w.title && w.category && w.category !== 'branding').concat(brands);
  const MIN_LOOP = 5;          // fewer cards than this: shown once, no repeats (centred if they fit)
  const tabsEl = document.getElementById('worksTabs');
  const track = document.getElementById('worksTrack');
  const dotsEl = document.getElementById('worksDots');
  const prevBtn = document.getElementById('worksPrev');
  const nextBtn = document.getElementById('worksNext');
  const emptyEl = document.getElementById('worksEmpty');
  const dialog = document.getElementById('workDialog');
  if (!track) return;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const label = c => LABELS[c] || c.charAt(0).toUpperCase() + c.slice(1);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
  // A website on a laptop, with the phone version standing in front of it
  const deviceMockup = (w, eager, small) => `<span class="device-scene">
      <span class="device-laptop">
        <span class="device-laptop__screen"><span class="device-laptop__cam" aria-hidden="true"></span>${media(w, eager, small)}</span>
        <span class="device-laptop__base" aria-hidden="true"></span>
      </span>
      ${w.phone ? `<span class="device-phone" aria-hidden="true"><img src="${esc(small && w.phoneThumb ? w.phoneThumb : w.phone)}" alt="" ${eager ? '' : 'loading="lazy"'} decoding="async" draggable="false"></span>` : ''}
    </span>`;
  const media = (w, eager, small) => w.image && !w.placeholder
    ? `<img src="${esc(small && w.thumb ? w.thumb : w.image)}" alt="${esc(w.alt || `${w.title}${w.client ? ' for ' + w.client : ''} by Takees Marketing`)}" ${eager ? '' : 'loading="lazy"'} decoding="async" draggable="false">`
    : `<span class="work-placeholder" aria-hidden="true"><span class="work-placeholder__label">${esc(SINGULAR[w.category] || label(w.category))}</span><span class="work-placeholder__note">Coming soon</span></span>`;

  // ---------- Category tabs ----------
  const order = Object.keys(LABELS);
  const cats = [...new Set(works.map(w => w.category))].sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
  // No "All" tab: the first category is shown first
  let current = cats[0] || '';
  if (tabsEl) {
    tabsEl.innerHTML = cats
      .map(c => `<button type="button" class="works-tab${c === current ? ' is-active' : ''}" data-cat="${esc(c)}" aria-pressed="${c === current}">${esc(label(c))}</button>`).join('');
    tabsEl.addEventListener('click', e => {
      const btn = e.target.closest('.works-tab');
      if (!btn || btn.dataset.cat === current) return;
      current = btn.dataset.cat;
      tabsEl.querySelectorAll('.works-tab').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      render();
    });
    if (cats.length < 2) tabsEl.hidden = true;
  }

  // ---------- Endless row ----------
  // The row holds several copies of the cards; the middle copy is the "real" one and the
  // copies either side fill the edges. After sliding into a copy, it jumps back unseen.
  const rail = document.createElement('div');
  rail.className = 'works-rail';
  track.appendChild(rail);

  let shown = [];   // works in the current tab
  let n = 0;        // number of real cards
  let sets = 1;     // copies of the card set in the row
  let pos = 0;      // index of the centred card within the whole row
  let step = 0;     // card width + gap
  let offset = 0;   // translateX of the row when pos is centred
  let looping = false;
  let fitsAll = false; // short list that fits the screen: no sliding at all

  const cardEls = () => rail.children;

  const designCount = b => b.designs.length ? `${b.designs.length} design${b.designs.length === 1 ? '' : 's'}` : 'Coming soon';

  function cardHTML(w, realIndex, copy) {
    const hidden = copy ? ' aria-hidden="true" tabindex="-1"' : '';
    if (w.kind === 'brand') {
      // Showcase card: a design fills the card, the brand's logo sits on top in white,
      // name and design count along the bottom
      const lazy = !copy && realIndex < 4 ? '' : 'loading="lazy"';
      const has = w.designs.length > 0;
      return `<button type="button" class="work-card work-card--brand${has && w.cover ? ' has-cover' : (w.theme ? ' brand-theme-' + esc(w.theme) : '')}" data-index="${realIndex}"${hidden} aria-label="${esc(w.title)}: ${has ? 'see the branding work' : 'designs coming soon'}">
        ${has && w.cover ? `<span class="brand-card__bg"><img src="${esc(w.cover)}" alt="" ${lazy} decoding="async" draggable="false"></span>` : ''}
        <span class="brand-card__shade" aria-hidden="true"></span>
        <span class="brand-card__logo">${w.logo ? `<img src="${esc(w.logo)}" alt="${esc(w.title)} logo" ${lazy} decoding="async" draggable="false">` : `<span class="brand-card__logo-name">${esc(w.title)}</span>`}</span>
        <span class="brand-card__info">
          <span class="brand-card__cat">Branding</span>
          <span class="brand-card__name">${esc(w.title)}</span>
          <span class="brand-card__meta">
            <span class="brand-card__count">${esc(designCount(w))}</span>
            ${has ? '<span class="brand-card__go">View work <span aria-hidden="true">→</span></span>' : ''}
          </span>
        </span>
      </button>`;
    }
    return `<button type="button" class="work-card${w.category === 'posters' && !w.placeholder ? ' work-card--poster' : ''}${w.site ? ' work-card--site' : ''}${(w.category === 'posters' || w.site) && !w.placeholder ? ' work-card--overlay' : ''}" data-index="${realIndex}"${hidden} aria-label="${esc(w.title)}${w.client ? ', ' + esc(w.client) : ''}: view details">
        <span class="work-card__media">${w.site ? `<span class="site-card__glow" aria-hidden="true" style="background-image:url('${esc(w.thumb || w.image)}')"></span>${deviceMockup(w, !copy && realIndex < 4, true)}` : media(w, !copy && realIndex < 4, true)}</span>
        ${(w.category === 'posters' || w.site) && !w.placeholder ? '<span class="poster-card__go" aria-hidden="true">↗</span>' : ''}
        <span class="work-card__body">
          <span class="work-card__cat">${esc(label(w.category))}</span>
          <span class="work-card__title">${esc(w.title)}</span>
          ${w.client ? `<span class="work-card__client">${esc(w.client)}</span>` : ''}
        </span>
      </button>`;
  }

  function measure() {
    const c = cardEls();
    if (c.length > 1) step = c[1].offsetLeft - c[0].offsetLeft;
    else if (c.length) step = c[0].offsetWidth;
  }

  // Number of copies so there are always cards beyond both edges of the screen
  function setsNeeded() {
    if (n < 2) return 1;
    const perScreen = Math.ceil(track.clientWidth / Math.max(step, 200)) + 2;
    let k = Math.ceil(perScreen / n);
    return Math.max(3, 2 * k + 1);
  }

  function build() {
    rail.innerHTML = '';
    if (!n) return;
    // First pass with one copy to measure the card width, then the full row
    rail.innerHTML = shown.map((w, i) => cardHTML(w, i, false)).join('');
    measure();
    looping = n >= MIN_LOOP;
    sets = looping ? setsNeeded() : 1;
    const mid = Math.floor(sets / 2);
    let html = '';
    for (let s = 0; s < sets; s++) html += shown.map((w, i) => cardHTML(w, i, s !== mid)).join('');
    rail.innerHTML = html;
    measure();
    pos = mid * n;
    checkFit();
    place(false);
  }

  // A short list: does the whole row fit on screen? Then it just sits there, centred.
  function checkFit() {
    const c = cardEls();
    fitsAll = !looping && n > 0 && (c[n - 1].offsetLeft + c[n - 1].offsetWidth - c[0].offsetLeft) <= track.clientWidth - 24;
    track.classList.toggle('is-static', fitsAll);
    dotsEl.hidden = n < 2 || fitsAll;
    if (prevBtn) prevBtn.hidden = n < 2 || fitsAll;
    if (nextBtn) nextBtn.hidden = n < 2 || fitsAll;
  }

  function place(animate) {
    const all = cardEls();
    const c = all[pos];
    if (!c) return;
    offset = fitsAll
      ? track.clientWidth / 2 - (all[0].offsetLeft + all[n - 1].offsetLeft + all[n - 1].offsetWidth) / 2
      : track.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2);
    rail.style.transition = animate && !reduceMotion ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.7, 0.2, 1)` : 'none';
    rail.style.transform = `translate3d(${offset}px, 0, 0)`;
    [...cardEls()].forEach((el, i) => el.classList.toggle('is-current', i === pos));
    showActive();
    if (!animate) settle();
  }

  function showActive() {
    const active = n ? ((pos % n) + n) % n : 0;
    dotsEl.querySelectorAll('.works-dot').forEach((d, i) => d.classList.toggle('is-active', i === active));
    const count = dotsEl.querySelector('.works-count');
    if (count) count.textContent = `${active + 1} / ${n}`;
  }

  // Where the row is on screen right now (also part-way through a slide)
  function currentX() {
    const t = getComputedStyle(rail).transform;
    if (!t || t === 'none') return offset;
    return new DOMMatrixReadOnly(t).m41;
  }

  // Move the counter back into the middle copy without any visible jump: the row is shifted
  // by whole copies, which look identical, keeping its exact on-screen position
  function recentre() {
    if (!looping) return;
    const mid = Math.floor(sets / 2);
    const real = ((pos % n) + n) % n;
    const target = mid * n + real;
    if (pos === target) return;
    const x = currentX() + (pos - target) * step;
    pos = target;
    const c = cardEls()[pos];
    offset = track.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2);
    rail.style.transition = 'none';
    rail.style.transform = `translate3d(${x}px, 0, 0)`;
    void rail.offsetWidth; // apply before the next slide starts
    [...cardEls()].forEach((el, i) => el.classList.toggle('is-current', i === pos));
  }
  const settle = recentre;
  rail.addEventListener('transitionend', e => { if (e.target === rail) recentre(); });

  function go(delta) {
    if (!n) return;
    if (!looping) {
      if (fitsAll) return;
      // Short list: step through once; the auto-slide goes back to the first card at the end
      pos = Math.min(n - 1, Math.max(0, pos + delta));
      place(true);
      return;
    }
    recentre();
    const max = sets * n - 1;
    pos = Math.min(max, Math.max(0, pos + delta));
    place(true);
  }

  function goTo(realIndex) {
    if (!looping) { if (!fitsAll) { pos = realIndex; place(true); } return; }
    const realNow = ((pos % n) + n) % n;
    let d = realIndex - realNow;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    go(d);
  }

  function render() {
    shown = works.filter(w => w.category === current);
    n = shown.length;
    if (emptyEl) emptyEl.hidden = n > 0;
    // Every tab uses the "3 / 24" counter between the arrows
    dotsEl.innerHTML = `<span class="works-count" aria-live="polite">1 / ${n}</span>`;
    build();
    restartAuto();
  }

  // ---------- Controls ----------
  if (prevBtn) prevBtn.addEventListener('click', () => { go(-1); restartAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { go(1); restartAuto(); });
  dotsEl.addEventListener('click', e => {
    const d = e.target.closest('.works-dot');
    if (!d) return;
    goTo(Number(d.dataset.index));
    restartAuto();
  });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); restartAuto(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); restartAuto(); }
  });

  // Drag (mouse) and swipe (touch): the row follows the finger, then settles on a card
  let drag = null;
  let suppressClick = false;
  track.addEventListener('pointerdown', e => {
    if (!n || fitsAll || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, horizontal: null, base: offset };
  });
  track.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (drag.horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      drag.horizontal = Math.abs(dx) > Math.abs(dy);
      if (drag.horizontal) {
        drag.moved = true;
        // Catch the row where it is (even mid-slide) and follow the finger from there
        recentre();
        drag.base = currentX();
        drag.x = e.clientX;
        rail.style.transition = 'none';
        rail.style.transform = `translate3d(${drag.base}px, 0, 0)`;
        track.classList.add('is-dragging');
        try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        stopAuto();
      } else {
        drag = null; // vertical: let the page scroll
        return;
      }
    }
    if (drag.moved) {
      rail.style.transform = `translate3d(${drag.base + (e.clientX - drag.x)}px, 0, 0)`;
    }
  });
  const endDrag = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag;
    drag = null;
    track.classList.remove('is-dragging');
    if (!d.moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 50);
    // Settle on the card nearest the centre; a short flick still moves one card
    const dragged = (d.base + (e.clientX - d.x)) - offset;   // how far from the centred card
    let cardsMoved = Math.round(-dragged / Math.max(step, 1));
    const flick = e.clientX - d.x;
    if (cardsMoved === 0 && Math.abs(flick) > 40) cardsMoved = flick < 0 ? 1 : -1;
    const max = sets * n - 1;
    pos = Math.min(max, Math.max(0, pos + cardsMoved));
    place(true);
    restartAuto();
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // ---------- Auto-slide ----------
  let timer = null;
  let hovering = false;
  // Pause only for keyboard focus (a mouse click on a card should not stop the slider)
  const keyboardFocusInside = () => !!track.querySelector(':focus-visible') || track.matches(':focus-visible');
  const canAuto = () => n > 1 && !fitsAll && !reduceMotion && !hovering && !keyboardFocusInside() && !drag &&
    !(dialog && dialog.open) && document.visibilityState === 'visible';
  function stopAuto() { clearInterval(timer); timer = null; }
  function restartAuto() {
    stopAuto();
    if (n < 2 || reduceMotion) return;
    timer = setInterval(() => {
      if (!canAuto()) return;
      if (!looping && pos >= n - 1) { pos = 0; place(true); } else go(1);
    }, AUTO_MS);
  }
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    track.addEventListener('mouseenter', () => { hovering = true; });
    track.addEventListener('mouseleave', () => { hovering = false; });
  }

  // ---------- Detail view ----------
  let lastCard = null;
  track.addEventListener('click', e => {
    const card = e.target.closest('.work-card');
    if (!card || suppressClick || !dialog || typeof dialog.showModal !== 'function') return;
    const w = shown[Number(card.dataset.index)];
    if (!w) return;
    lastCard = card;
    if (w.kind === 'brand') { openBrand(w); return; }
    openWork(Number(card.dataset.index));
  });

  // Posters open in a dark viewer: the poster at full height on a soft blurred copy of itself,
  // details beside it, and arrows to flip through the other posters without closing.
  let workIndex = -1;
  const isPoster = w => w && !w.placeholder && w.image && (w.category === 'posters' || !!w.site);
  function openWork(i) {
    const w = shown[i];
    if (!w) return;
    workIndex = i;
    const poster = isPoster(w);
    const posters = poster ? shown.filter(isPoster) : [];
    dialog.classList.toggle('is-site', !!w.site);
    dialog.classList.remove('is-brand', 'has-designs');
    dialog.classList.toggle('is-poster', poster);
    dialog.setAttribute('aria-labelledby', 'workDialogTitle');
    dialog.querySelector('.work-dialog__gallery').hidden = true;
    dialog.querySelector('.work-dialog__media').innerHTML = w.site
      ? `<span class="poster-view__glow" aria-hidden="true" style="background-image:url('${esc(w.thumb || w.image)}')"></span>
         ${deviceMockup(w, true, false)}`
      : poster
      ? `<span class="poster-view__glow" aria-hidden="true" style="background-image:url('${esc(w.thumb || w.image)}')"></span>
         <span class="poster-view__frame">${media(w, true)}</span>`
      : media(w, true);
    dialog.querySelector('.work-dialog__cat').textContent = label(w.category);
    dialog.querySelector('.work-dialog__title').textContent = w.placeholder ? `${SINGULAR[w.category] || label(w.category)}: coming soon` : w.title;
    const client = dialog.querySelector('.work-dialog__client');
    client.textContent = w.client ? `Client: ${w.client}` : '';
    client.hidden = !w.client;
    const desc = dialog.querySelector('.work-dialog__desc');
    desc.textContent = w.placeholder ? 'This piece of work will be added soon.' : (w.description || '');
    desc.hidden = !desc.textContent;
    const link = dialog.querySelector('.work-dialog__link');
    link.hidden = !w.url;
    if (w.url) link.href = w.url;
    const body = dialog.querySelector('.work-dialog__body');
    body.querySelectorAll('.poster-view__extra').forEach(el => el.remove());
    if (poster) {
      const n = posters.indexOf(w) + 1;
      body.insertAdjacentHTML('beforeend', `<div class="poster-view__extra">
        ${posters.length > 1 ? `<div class="poster-view__nav">
          <button type="button" class="poster-view__btn" data-step="-1" aria-label="Previous ${w.site ? 'website' : 'poster'}">←</button>
          <span class="poster-view__count">${n} <span>/ ${posters.length}</span></span>
          <button type="button" class="poster-view__btn" data-step="1" aria-label="Next ${w.site ? 'website' : 'poster'}">→</button>
        </div>` : ''}
        <div class="poster-view__cta">
          <p>Want a ${w.site ? 'website' : 'poster'} like this for your brand?</p>
          <a href="/contact" class="btn btn-primary">Get in Touch <span class="btn-arrow-icon">↗</span></a>
        </div>
      </div>`);
    }
    if (!dialog.open) dialog.showModal();
  }
  function stepPoster(d) {
    const list = shown.map((w, i) => isPoster(w) ? i : -1).filter(i => i >= 0);
    const at = list.indexOf(workIndex);
    if (at < 0 || list.length < 2) return;
    openWork(list[(at + d + list.length) % list.length]);
  }
  if (dialog) {
    dialog.addEventListener('click', e => {
      const b = e.target.closest('.poster-view__btn');
      if (b && dialog.classList.contains('is-poster')) stepPoster(Number(b.dataset.step));
    });
    dialog.addEventListener('keydown', e => {
      if (!dialog.classList.contains('is-poster')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); stepPoster(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepPoster(-1); }
    });
    // Swipe left/right on the poster to flip
    let sx = null, sy = 0;
    dialog.addEventListener('pointerdown', e => { if (dialog.classList.contains('is-poster') && e.target.closest('.work-dialog__media')) { sx = e.clientX; sy = e.clientY; } });
    dialog.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) stepPoster(dx < 0 ? 1 : -1);
    });
    dialog.addEventListener('close', () => {
      dialog.classList.remove('is-poster', 'is-site');
      dialog.querySelectorAll('.poster-view__extra').forEach(el => el.remove());
    });
  }
  // ---------- Brand gallery (slideshow) ----------
  // Top: the brand's designs, one at a time, sliding (auto, arrows, swipe, keys).
  // Below: the brand name, description and a strip of thumbnails to jump to any design.
  // A brand without designs shows its logo and a "coming soon" note instead.
  const BRAND_AUTO_MS = 4000;
  let brand = null;
  let slide = 0;
  let brandTimer = null;
  let brandHover = false;

  const slidesEl = () => dialog.querySelector('.brand-slides');

  function showSlide(i, animate = true) {
    if (!brand || !brand.designs.length) return;
    const total = brand.designs.length;
    slide = ((i % total) + total) % total;
    const s = slidesEl();
    if (s) {
      s.style.transition = animate && !reduceMotion ? 'transform 0.55s cubic-bezier(0.22, 0.7, 0.2, 1)' : 'none';
      s.style.transform = `translate3d(${-slide * 100}%, 0, 0)`;
      s.querySelectorAll('.brand-slide').forEach((el, k) => el.setAttribute('aria-hidden', String(k !== slide)));
    }
    const d = brand.designs[slide];
    const cap = dialog.querySelector('.brand-slider__caption');
    if (cap) cap.innerHTML = `<span>${esc(d.title || '')}</span>${total > 1 ? `<span>${slide + 1} / ${total}</span>` : ''}`;
    // Restart the thin progress line that shows the auto-slide timing
    const bar = dialog.querySelector('.brand-progress');
    if (bar) { bar.classList.remove('is-running'); void bar.offsetWidth; if (brandTimer || !animate) bar.classList.add('is-running'); }
    dialog.querySelectorAll('.brand-thumb').forEach((t, k) => {
      const on = k === slide;
      t.setAttribute('aria-current', String(on));
      // Keep the active thumbnail in view inside the strip (not the page)
      if (on) {
        const strip = t.parentElement;
        const left = t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2;
        strip.scrollTo({ left: Math.max(0, left), behavior: animate && !reduceMotion ? 'smooth' : 'auto' });
      }
    });
  }

  function stopBrandAuto() {
    clearInterval(brandTimer); brandTimer = null;
    const bar = dialog && dialog.querySelector('.brand-progress');
    if (bar) bar.classList.remove('is-running');
  }
  function startBrandAuto() {
    stopBrandAuto();
    if (reduceMotion || !brand || brand.designs.length < 2) return;
    const bar = dialog.querySelector('.brand-progress');
    if (bar) { void bar.offsetWidth; bar.classList.add('is-running'); }
    brandTimer = setInterval(() => {
      const focusIn = dialog.querySelector('.brand-slider :focus-visible, .brand-strip :focus-visible');
      if (dialog.open && !brandHover && !bdrag && !focusIn && document.visibilityState === 'visible') showSlide(slide + 1);
    }, BRAND_AUTO_MS);
  }
  // Pausing on hover also pauses the progress line
  function setBrandHover(on) {
    if (on === brandHover) return;
    brandHover = on;
    const bar = dialog.querySelector('.brand-progress');
    if (!bar) return;
    if (on) bar.classList.remove('is-running');
    else if (brandTimer) startBrandAuto();
  }

  function openBrand(b) {
    brand = b;
    slide = 0;
    dialog.classList.remove('is-poster', 'is-site');
    dialog.classList.add('is-brand');
    dialog.querySelector('.work-dialog__cat').textContent = 'Branding';
    dialog.querySelector('.work-dialog__title').textContent = b.title;
    dialog.querySelector('.work-dialog__client').hidden = true;
    const desc = dialog.querySelector('.work-dialog__desc');
    desc.textContent = b.description || (b.designs.length ? `Brand identity and design work for ${b.title} by Takees Marketing.` : '');
    desc.hidden = !desc.textContent;
    dialog.querySelector('.work-dialog__link').hidden = true;

    const box = dialog.querySelector('.work-dialog__media');
    const gallery = dialog.querySelector('.work-dialog__gallery');
    const many = b.designs.length > 1;
    const logoImg = b.logo ? `<img src="${esc(b.logo)}" alt="${esc(b.title)} logo">` : `<span class="work-card__logo-name">${esc(b.title)}</span>`;

    if (!b.designs.length) {
      // No designs yet: logo banner + "coming soon" note in the normal light layout
      dialog.classList.remove('has-designs');
      dialog.setAttribute('aria-labelledby', 'workDialogTitle');
      gallery.hidden = false;
      box.innerHTML = `<span class="brand-hero">${logoImg}</span>`;
      gallery.innerHTML = `<p class="brand-gallery__empty">The designs we made for ${esc(b.title)} will be added here soon.</p>`;
    } else {
      // Designs: a dark, full-height viewer (header, stage, thumbnails) that fits the screen
      dialog.classList.add('has-designs');
      dialog.setAttribute('aria-labelledby', 'brandViewerTitle');
      gallery.hidden = true;
      gallery.innerHTML = '';
      box.innerHTML = `<div class="brand-lb">
          <header class="brand-lb__head">
            <span class="brand-lb__logo">${logoImg}</span>
            <div class="brand-lb__text">
              <span class="brand-lb__kicker">Branding · ${esc(designCount(b))}</span>
              <h2 class="brand-lb__title" id="brandViewerTitle">${esc(b.title)}</h2>
              ${desc.textContent ? `<p class="brand-lb__desc">${esc(desc.textContent)}</p>` : ''}
            </div>
          </header>
          <div class="brand-slider" role="region" aria-roledescription="carousel" aria-label="${esc(b.title)} designs" tabindex="0">
            <div class="brand-slides">${b.designs.map((d, i) => `
              <div class="brand-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${b.designs.length}">
                <img src="${esc(d.image)}" alt="${esc(d.alt || `${d.title || 'Design'} for ${b.title} by Takees Marketing`)}" ${i < 2 ? '' : 'loading="lazy"'} decoding="async" draggable="false">
              </div>`).join('')}
            </div>
            ${many ? `<button type="button" class="brand-view__nav brand-view__prev" aria-label="Previous design">←</button>
            <button type="button" class="brand-view__nav brand-view__next" aria-label="Next design">→</button>` : ''}
            <p class="brand-slider__caption" aria-live="polite"></p>
            ${many ? '<span class="brand-progress" aria-hidden="true"></span>' : ''}
          </div>
          ${many ? `<div class="brand-strip" role="group" aria-label="All ${esc(b.title)} designs">${b.designs.map((d, i) => `
            <button type="button" class="brand-thumb" data-design="${i}" aria-current="false" aria-label="Show ${esc(d.title || `design ${i + 1}`)}">
              <img src="${esc(d.thumb || d.image)}" alt="" loading="lazy" decoding="async" draggable="false">
            </button>`).join('')}
          </div>` : ''}
        </div>`;
    }
    dialog.scrollTop = 0;
    dialog.showModal();
    showSlide(0, false);
    startBrandAuto();
  }

  // Swipe / drag the large design
  let bdrag = null;
  if (dialog) {
    dialog.addEventListener('pointerdown', e => {
      const slider = e.target.closest('.brand-slider');
      if (!slider || e.target.closest('.brand-view__nav') || !brand || brand.designs.length < 2) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      bdrag = { id: e.pointerId, x: e.clientX, y: e.clientY, w: slider.clientWidth, horizontal: null };
    });
    dialog.addEventListener('pointermove', e => {
      if (!bdrag || e.pointerId !== bdrag.id) return;
      const dx = e.clientX - bdrag.x, dy = e.clientY - bdrag.y;
      if (bdrag.horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        bdrag.horizontal = Math.abs(dx) > Math.abs(dy);
        if (!bdrag.horizontal) { bdrag = null; return; }
        try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      if (bdrag.horizontal) {
        const s = slidesEl();
        s.style.transition = 'none';
        s.style.transform = `translate3d(calc(${-slide * 100}% + ${dx}px), 0, 0)`;
      }
    });
    const endBdrag = e => {
      if (!bdrag || e.pointerId !== bdrag.id) return;
      const d = bdrag; bdrag = null;
      if (!d.horizontal) return;
      const dx = e.clientX - d.x;
      showSlide(Math.abs(dx) > Math.min(80, d.w * 0.15) ? slide + (dx < 0 ? 1 : -1) : slide);
      startBrandAuto();
    };
    dialog.addEventListener('pointerup', endBdrag);
    dialog.addEventListener('pointercancel', endBdrag);

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      dialog.addEventListener('mouseover', e => { setBrandHover(!!e.target.closest('.brand-slider')); });
      dialog.addEventListener('mouseleave', () => { setBrandHover(false); });
    }

    dialog.addEventListener('click', e => {
      if (!dialog.classList.contains('is-brand') || !brand) return;
      const thumb = e.target.closest('.brand-thumb');
      if (thumb) { showSlide(Number(thumb.dataset.design)); startBrandAuto(); return; }
      if (e.target.closest('.brand-view__prev')) { showSlide(slide - 1); startBrandAuto(); }
      if (e.target.closest('.brand-view__next')) { showSlide(slide + 1); startBrandAuto(); }
    });
    dialog.addEventListener('keydown', e => {
      if (!dialog.classList.contains('is-brand') || !brand || brand.designs.length < 2) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(slide + 1); startBrandAuto(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(slide - 1); startBrandAuto(); }
    });
    dialog.addEventListener('close', () => {
      stopBrandAuto();
      brandHover = false;
      dialog.classList.remove('is-brand', 'has-designs');
      dialog.setAttribute('aria-labelledby', 'workDialogTitle');
    });
    dialog.querySelector('.work-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { if (lastCard && lastCard.getAttribute('aria-hidden') !== 'true') lastCard.focus({ preventScroll: true }); });
  }

  // Re-centre on resize (rebuild if more copies are needed to fill the wider screen)
  let resizeT = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const real = n ? ((pos % n) + n) % n : 0;
      measure();
      if (looping && setsNeeded() > sets) build();
      if (looping) pos = Math.floor(sets / 2) * n + real;
      checkFit();
      place(false);
      restartAuto();
    }, 150);
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') settle(); });

  render();
})();
