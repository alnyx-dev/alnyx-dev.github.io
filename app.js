/* ===== alnyx portfolio — interactions ===== */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- THEME ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }
  function syncMeta() {
    const dark = root.getAttribute('data-theme') !== 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#08080f' : '#f5f5f7');
  }
  syncMeta();
  themeToggle && themeToggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncMeta();
  });

  /* ---------- YEAR ---------- */
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- SCROLL PROGRESS + TO-TOP ---------- */
  const bar = document.getElementById('progressBar');
  const toTop = document.getElementById('toTop');
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.width = (scrolled * 100).toFixed(2) + '%';
    if (toTop) toTop.classList.toggle('show', h.scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          const el = e.target;
          setTimeout(function () { el.classList.add('in'); }, Math.min(i * 40, 160));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- STAT COUNT-UP ---------- */
  const stats = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); sio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (s) { sio.observe(s); });
  } else {
    stats.forEach(animateCount);
  }

  /* ---------- POINTER GLOW + TILT ---------- */
  const tiltCards = document.querySelectorAll('a.card');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !reduceMotion) {
    tiltCards.forEach(function (card) {
      card.addEventListener('pointermove', function (ev) {
        const r = card.getBoundingClientRect();
        const x = ev.clientX - r.left;
        const y = ev.clientY - r.top;
        card.style.setProperty('--mx', (x / r.width * 100) + '%');
        card.style.setProperty('--my', (y / r.height * 100) + '%');
        const rx = ((y / r.height) - 0.5) * -5;
        const ry = ((x / r.width) - 0.5) * 5;
        card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- FILTER ---------- */
  const chips = document.querySelectorAll('.filter-chip');
  const items = document.querySelectorAll('.bento [data-category]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      items.forEach(function (el) {
        const show = f === 'all' || el.getAttribute('data-category') === f;
        el.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- SMOOTH ANCHOR (respect reduced motion handled by CSS) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      }
    });
  });
})();
