/* alnyx — index · theme toggle (the only JS on the page) */
(function () {
  'use strict';
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');
  if (!btn) return;

  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var label = btn.querySelector('.theme-label');

  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return media.matches ? 'dark' : 'light';
  }

  function sync() {
    var c = current();
    if (label) label.textContent = c === 'dark' ? 'Dark' : 'Light';
    btn.setAttribute('aria-label', 'Switch to ' + (c === 'dark' ? 'light' : 'dark') + ' theme');
    btn.setAttribute('title', 'Theme: ' + c);
  }

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });

  // keep label in step with the OS when the user has not chosen explicitly
  media.addEventListener && media.addEventListener('change', function () {
    if (!root.getAttribute('data-theme')) sync();
  });

  sync();
})();
