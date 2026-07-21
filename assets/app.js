/* VU1 Field Handbook — nav, language toggle, mobile drawer, filter.
   No dependencies, no build step. Safe to open from file:// or serve statically. */
(function () {
  'use strict';
  var SV = window.SV || {};
  var main = document.querySelector('main');
  var toc = document.getElementById('toc');
  var list = document.getElementById('toclist');
  var scrim = document.getElementById('scrim');
  var menubtn = document.getElementById('menubtn');
  var items = [];

  /* ---- collect translatable leaf nodes ---- */
  var SEL = 'p,li,th,td,h1,h2,h3,h4,summary,figcaption,text';
  var INLINE = /^(STRONG|EM|SPAN|CODE|A|TSPAN|BR|SUP|SUB|I|B)$/;
  var nodes = [].filter.call(main.querySelectorAll(SEL), function (el) {
    return [].every.call(el.children, function (c) {
      return INLINE.test(c.tagName.toUpperCase());
    });
  });
  nodes.forEach(function (el) {
    el.__en = el.innerHTML;
    el.__key = el.getAttribute('data-t') || el.textContent.replace(/\s+/g, ' ').trim();
  });

  /* ---- table of contents ---- */
  function add(href, label, lvl, num) {
    var a = document.createElement('a');
    a.href = '#' + href;
    a.className = 'lvl' + lvl;
    if (lvl === 2) a.innerHTML = '<span class="n">' + (num || '') + '</span>' + label;
    else a.textContent = label;
    list.appendChild(a);
    items.push({ a: a, el: document.getElementById(href) });
  }

  function buildTOC() {
    list.innerHTML = '';
    items = [];
    add('top', document.querySelector('#top h1').textContent, 2, '');
    [].forEach.call(main.querySelectorAll('section'), function (sec) {
      if (sec.id === 'top') return;
      var h2 = sec.querySelector('h2');
      if (!h2) return;
      var parts = h2.textContent.split('·');
      var num = parts.shift().trim();
      var lab = parts.join('·').trim();
      var g = document.createElement('div');
      g.className = 'grp';
      list.appendChild(g);
      add(sec.id, lab, 2, num);
      [].forEach.call(sec.querySelectorAll('h3'), function (h3) {
        if (!h3.id) {
          h3.id = sec.id + '-' + h3.textContent.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 40);
        }
        var t = h3.textContent.replace(/\s*[—–-]\s.*$/, '').trim();
        add(h3.id, t.length > 32 ? t.slice(0, 31) + '…' : t, 3);
      });
    });
  }

  /* ---- language ---- */
  var banner = document.getElementById('svnote');
  function setLang(L) {
    nodes.forEach(function (el) {
      if (L === 'sv' && SV[el.__key] !== undefined) el.innerHTML = SV[el.__key];
      else if (el.innerHTML !== el.__en) el.innerHTML = el.__en;
    });
    if (banner) banner.hidden = (L !== 'sv');
    document.documentElement.lang = L;
    [].forEach.call(document.querySelectorAll('#langbar button'), function (b) {
      b.classList.toggle('on', b.dataset.lang === L);
      b.setAttribute('aria-pressed', b.dataset.lang === L);
    });
    try { localStorage.setItem('vu1lang', L); } catch (e) {}
    buildTOC();
    spy();
  }
  [].forEach.call(document.querySelectorAll('#langbar button'), function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  /* ---- mobile drawer ---- */
  function drawer(open) {
    toc.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('on', open);
    if (menubtn) menubtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open && matchMedia('(max-width:900px)').matches ? 'hidden' : '';
  }
  if (menubtn) menubtn.addEventListener('click', function () {
    drawer(!toc.classList.contains('open'));
  });
  if (scrim) scrim.addEventListener('click', function () { drawer(false); });
  list.addEventListener('click', function (e) {
    if (e.target.closest('a') && matchMedia('(max-width:900px)').matches) drawer(false);
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') drawer(false); });
  addEventListener('resize', function () {
    if (!matchMedia('(max-width:900px)').matches) drawer(false);
  });

  /* ---- scrollspy ---- */
  var ticking = false;
  function spy() {
    ticking = false;
    var best = null, bt = -1e9;
    items.forEach(function (it) {
      if (!it.el) return;
      var t = it.el.getBoundingClientRect().top - 90;
      if (t <= 0 && t > bt) { bt = t; best = it; }
    });
    items.forEach(function (it) { it.a.classList.toggle('active', it === best); });
    if (best && !matchMedia('(max-width:900px)').matches) {
      var r = best.a.getBoundingClientRect(), n = toc.getBoundingClientRect();
      if (r.top < n.top + 8 || r.bottom > n.bottom - 8) best.a.scrollIntoView({ block: 'nearest' });
    }
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });

  /* ---- filter ---- */
  var box = document.getElementById('search');
  box.addEventListener('input', function () {
    var q = box.value.trim().toLowerCase();
    [].forEach.call(main.querySelectorAll('section'), function (sec) {
      sec.classList.toggle('hidden', !(!q || sec.textContent.toLowerCase().indexOf(q) > -1));
    });
    items.forEach(function (it) {
      if (!it.el) return;
      var sec = it.el.closest('section') || it.el;
      it.a.classList.toggle('hidden',
        !(!q || it.a.textContent.toLowerCase().indexOf(q) > -1 || !sec.classList.contains('hidden')));
    });
  });

  var saved = 'en';
  try { saved = localStorage.getItem('vu1lang') || 'en'; } catch (e) {}
  setLang(saved);
})();
