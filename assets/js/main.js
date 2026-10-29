/* ==========================================================================
   Pilot Preparation Academy — behaviour and motion
   Lenis drives the scroll; GSAP + ScrollTrigger read from it on one ticker.

   Motion rules for the colour-chapter design:
   - The signature move: chapters change colour at hard edges, and the header takes
     the colour of the chapter beneath it.
   - On the home page the headline rises out of the orange ground as you scroll,
     changing ink where it crosses the horizon.
   - Every section's parts arrive once: heading lines, then text, then pictures.
   - Everything works without the libraries; reveals never leave content hidden.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var motion = root.classList.contains('anim');
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var desktop = window.matchMedia('(min-width: 901px)');
  window.__ppaReady = true;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap && window.Flip) gsap.registerPlugin(Flip);

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  var header = $('.header');
  var headerH = function () { return header ? header.offsetHeight : 0; };

  function scrollToTarget(el) {
    var y = el.getBoundingClientRect().top + window.scrollY - headerH() - 8;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: motion ? 'smooth' : 'auto' });
  }

  /* ---------- header: colour of the chapter beneath, hidden while reading down ---------- */
  function parseRGB(c) {
    var m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(',').map(parseFloat);
    if (p.length === 4 && p[3] === 0) return null;
    return p;
  }
  function luminance(p) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]);
  }
  var lastBg = '';
  function tintHeader() {
    if (!header) return;
    var el = document.elementFromPoint(12, headerH() + 2);
    var bg = null;
    while (el && el !== document.documentElement) {
      if (el !== header && !header.contains(el)) {
        var c = getComputedStyle(el).backgroundColor;
        if (parseRGB(c)) { bg = c; break; }
      }
      el = el.parentElement;
    }
    if (!bg) bg = getComputedStyle(document.body).backgroundColor;
    if (bg === lastBg) return;
    lastBg = bg;
    var rgb = parseRGB(bg);
    var dark = luminance(rgb) < 0.18;
    header.style.setProperty('--h-bg', bg);
    header.style.setProperty('--h-fg', dark ? '#eef0ec' : '#161a1d');
    header.setAttribute('data-tone', dark ? 'light' : 'dark');
    // The action button is orange; on an orange chapter it turns ink so it stays visible.
    header.toggleAttribute('data-flame', Math.abs(rgb[0] - 230) < 6 && Math.abs(rgb[1] - 93) < 6);
  }

  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      if (header && !menuOpen) header.classList.toggle('is-hidden', y > 480 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove('is-hidden');
      root.classList.toggle('header-hidden', header.classList.contains('is-hidden'));
      lastY = y;
      tintHeader();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { lastBg = ''; tintHeader(); });
  tintHeader();

  /* ---------- full-screen menu ---------- */
  var menu = $('#menu');
  var menuBtn = $('.header .menu-word');
  var menuOpen = false;
  function setMenu(open) {
    if (!menu) return;
    menuOpen = open;
    menuBtn.setAttribute('aria-expanded', String(open));
    clearTimeout(menu._t);
    if (open) {
      menu.hidden = false;
      void menu.offsetWidth;
      menu.classList.add('is-open');
      header.classList.remove('is-hidden');
      if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
      setTimeout(function () { var first = $('.menu__main a', menu); if (first) first.focus(); }, 60);
    } else {
      menu.classList.remove('is-open');
      menu._t = setTimeout(function () { menu.hidden = true; }, motion ? 620 : 0);
      if (lenis) lenis.start(); else document.body.style.overflow = '';
    }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); menuBtn.focus(); }); });
  document.addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { setMenu(false); menuBtn.focus(); }
    if (e.key === 'Tab') {
      var f = $$('a, button', menu), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- same-page anchors ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var url = new URL(a.getAttribute('href'), window.location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    var t = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!t) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    scrollToTarget(t);
    history.pushState(null, '', url.hash);
  });
  window.addEventListener('load', function () {
    if (!location.hash) return;
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) setTimeout(function () { scrollToTarget(t); }, 120);
  });

  /* ---------- reveals: once, as each part enters ---------- */
  if (motion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    $$('[data-rise], [data-lines], [data-shutter]').forEach(function (el) { io.observe(el); });
  } else {
    root.classList.remove('anim');
  }

  /* ---------- accordion of steps ---------- */
  $$('[data-acc]').forEach(function (acc) {
    var panels = $$('.acc__panel', acc);
    panels.forEach(function (p) {
      $('.acc__btn', p).addEventListener('click', function () {
        panels.forEach(function (o) {
          var open = o === p;
          o.classList.toggle('is-open', open);
          $('.acc__btn', o).setAttribute('aria-expanded', String(open));
        });
        var heading = $('h3', p);
        if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
        if (hasGsap) setTimeout(function () { ScrollTrigger.refresh(); }, 480);
      });
    });
  });

  /* ---------- live clocks ---------- */
  var clockEls = $$('[data-clock]');
  var diffEls = $$('[data-diff]');
  function partsIn(tz, d) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute);
  }
  function tickClocks() {
    var now = new Date();
    var home = partsIn('Asia/Kolkata', now);
    clockEls.forEach(function (el) {
      var tz = el.getAttribute('data-clock');
      var t = new Intl.DateTimeFormat('en-IN', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(now).replace(/\s?(am|pm)/i, function (m) { return ' ' + m.trim().toLowerCase(); });
      var there = partsIn(tz, now);
      var dayShift = Math.round((Math.floor(there / 864e5) - Math.floor(home / 864e5)));
      var day = dayShift === 1 ? 'tomorrow' : dayShift === -1 ? 'yesterday' : '';
      var html = t + (day ? ', ' + day : '');
      if (el.innerHTML !== html) el.innerHTML = html;
    });
    diffEls.forEach(function (el) {
      var mins = Math.round((partsIn(el.getAttribute('data-diff'), now) - home) / 60000);
      var txt;
      if (mins === 0) txt = 'Same time';
      else {
        var a = Math.abs(mins), h = Math.floor(a / 60), m = a % 60;
        txt = (mins > 0 ? '+' : '−') + h + ' h' + (m ? ' ' + m + ' min' : '');
      }
      if (el.textContent !== txt) el.textContent = txt;
    });
  }
  if (clockEls.length || diffEls.length) { tickClocks(); setInterval(tickClocks, 15000); }

  /* ---------- destinations index: picture anchored to the row ---------- */
  $$('[data-index]').forEach(function (list) {
    var preview = $('.index__preview', list);
    if (!preview) return;
    var imgs = $$('img', preview);
    var moveY = hasGsap && motion ? gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'expo.out' }) : function (v) { preview.style.transform = 'translateY(' + v + 'px)'; };
    function show(row) {
      if (!desktop.matches) return;
      var slug = row.getAttribute('data-slug');
      imgs.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-for') === slug); });
      var y = row.offsetTop + row.offsetHeight / 2 - preview.offsetHeight / 2;
      y = Math.max(0, Math.min(y, list.offsetHeight - preview.offsetHeight));
      moveY(y);
      preview.classList.add('is-on');
    }
    $$('.irow', list).forEach(function (row) {
      row.addEventListener('mouseenter', function () { show(row); });
      row.addEventListener('focus', function () { show(row); });
    });
    list.addEventListener('mouseleave', function () { preview.classList.remove('is-on'); });
    list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) preview.classList.remove('is-on'); });
  });

  /* ---------- courses filter ---------- */
  (function initCourses() {
    var grid = $('[data-courses]');
    if (!grid) return;
    var buttons = $$('[data-filter]');
    var cards = $$('.course', grid);
    function apply(id, animate) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === id)); });
      var state = animate && motion && window.Flip ? Flip.getState(cards) : null;
      cards.forEach(function (c) { c.classList.toggle('is-hidden', id !== 'all' && c.dataset.cat !== id); });
      if (state) {
        Flip.from(state, {
          duration: 0.6, ease: 'expo.out', absolute: true,
          onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', delay: 0.15 }); },
          onLeave: function (els) { return gsap.to(els, { opacity: 0, duration: 0.25 }); },
          onComplete: function () { if (hasGsap) ScrollTrigger.refresh(); },
        });
      }
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter, true); }); });
    var initial = location.hash.slice(1);
    if (buttons.some(function (b) { return b.dataset.filter === initial; })) apply(initial, false);
  })();

  /* ---------- gallery lightbox ---------- */
  (function initLightbox() {
    var lb = $('[data-lightbox]');
    if (!lb) return;
    var items = $$('[data-gallery] .masonry__item');
    var view = $('img', lb);
    var count = $('[data-lb-count]', lb);
    var closeBtn = $('.lightbox__close', lb);
    var idx = 0, lastFocus = null;
    function load(i, dir) {
      idx = (i + items.length) % items.length;
      view.src = items[idx].dataset.full;
      view.alt = $('img', items[idx]).alt;
      count.textContent = (idx + 1) + ' of ' + items.length;
      if (motion && hasGsap) gsap.fromTo(view, { opacity: 0, x: (dir || 0) * 40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' });
    }
    function open(i) {
      lastFocus = document.activeElement;
      lb.classList.add('is-open');
      if (lenis) lenis.stop();
      load(i, 0);
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('is-open');
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (it, i) { it.addEventListener('click', function () { open(i); }); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    closeBtn.addEventListener('click', close);
    $('.lightbox__nav--prev', lb).addEventListener('click', function () { load(idx - 1, -1); });
    $('.lightbox__nav--next', lb).addEventListener('click', function () { load(idx + 1, 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') load(idx + 1, 1);
      else if (e.key === 'ArrowLeft') load(idx - 1, -1);
      else if (e.key === 'Tab') {
        var f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  /* ---------- video ---------- */
  $$('[data-video]').forEach(function (v) {
    v.addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.className = 'video';
      wrap.style.gridColumn = getComputedStyle(v).gridColumn;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.dataset.video) + '?autoplay=1&rel=0';
      f.title = 'Pilot Preparation Academy video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      wrap.appendChild(f);
      v.replaceWith(wrap);
    });
  });

  /* ---------- enquiry forms → WhatsApp ---------- */
  $$('[data-enquiry]').forEach(function (form) {
    var status = form.parentElement.querySelector('[data-status]') || $('[data-status]', form);
    var field = function (n) { return form.elements.namedItem(n); };
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field');
      if (f) f.classList.remove('is-invalid');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = field('name'), phone = field('phone'), email = field('email');
      var checks = [
        [name, name.value.trim().length >= 2],
        [phone, phone.value.replace(/\D/g, '').length >= 8],
      ];
      if (email) checks.push([email, !email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())]);
      var firstBad = null;
      checks.forEach(function (c) {
        c[0].closest('.field').classList.toggle('is-invalid', !c[1]);
        if (!c[1] && !firstBad) firstBad = c[0];
      });
      if (firstBad) {
        firstBad.focus();
        status.textContent = firstBad === name ? 'Please tell us your name.' : firstBad === phone ? 'Please enter a phone number we can reach.' : 'Please check your email address.';
        return;
      }
      var interest = field('interest'), message = field('message');
      var text = [
        'Hello Pilot Preparation Academy, I would like to enquire.',
        'Name: ' + name.value.trim(),
        'Phone: ' + phone.value.trim(),
        email && email.value.trim() ? 'Email: ' + email.value.trim() : '',
        interest ? 'Interested in: ' + interest.value : 'Interested in: Free counselling',
        message && message.value.trim() ? 'Message: ' + message.value.trim() : '',
      ].filter(Boolean).join('\n');
      var url = 'https://wa.me/919301657163?text=' + encodeURIComponent(text);
      // 'noopener' as a feature makes window.open return null, so detach the opener by hand instead.
      var win = window.open(url, '_blank');
      if (win) win.opener = null;
      status.textContent = win === null
        ? 'Your browser blocked the pop-up. Please call +91-9301657163.'
        : 'WhatsApp is open with your message. Just press send.';
    });
  });

  /* ======================================================================
     Motion that needs GSAP
     ====================================================================== */
  if (!motion || !hasGsap) return;

  // Home: the headline rises out of the ground and changes ink as it crosses the horizon.
  var hero = $('[data-hero]');
  if (hero) {
    gsap.to($('[data-hero-title]', hero), {
      '--rise': function () { return -window.innerHeight * 0.3 + 'px'; },
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
    gsap.to($('.hero__intro', hero), {
      y: function () { return -window.innerHeight * 0.12; }, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  }

  // Destinations: the photograph holds while the cards cross it.
  var mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', function () {
    $$('[data-held]').forEach(function (held) {
      var stage = $('.held__stage', held);
      var track = $('[data-held-track]', held);
      var cards = $$('.card', track);
      var count = $('[data-held-count]', held);
      var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = gsap.to(track, {
        x: function () { return -distance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: stage, start: 'top top', end: function () { return '+=' + distance(); },
          pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function () {
            var mid = window.innerWidth / 2, best = 0, bestD = Infinity;
            cards.forEach(function (c, i) {
              var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid);
              if (d < bestD) { bestD = d; best = i; }
            });
            if (count) count.textContent = (best + 1) + ' of ' + cards.length;
          },
        },
      });
      gsap.fromTo($('.held__bg img', held), { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: stage, start: 'top top', end: function () { return '+=' + distance(); }, scrub: true } });
      // Keyboard: bring a focused card into view by scrolling to its place in the run.
      cards.forEach(function (c) {
        c.addEventListener('focus', function () {
          var st = tween.scrollTrigger;
          var p = Math.min(1, Math.max(0, (c.offsetLeft - window.innerWidth / 2 + c.offsetWidth / 2) / distance()));
          var y = st.start + p * (st.end - st.start);
          if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
        });
      });
    });
  });

  // Country chapters: each held photograph settles as its sheet arrives.
  $$('.sheets__group').forEach(function (g) {
    gsap.fromTo($('.sheets__pic img', g), { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom bottom', scrub: true } });
  });

  // The strip of photographs drifts, quickens with the scroll, and rests when off screen or hovered.
  $$('[data-marquee]').forEach(function (track) {
    var x = 0, half = 0, speed = 40, running = false, hovered = false;
    var measure = function () { half = track.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);
    var setX = gsap.quickSetter(track, 'x', 'px');
    var tick = function (t, dt) {
      if (hovered) return;
      var boost = lenis ? Math.min(Math.abs(lenis.velocity) * 6, 400) : 0;
      x -= (speed + boost) * (dt / 1000);
      if (half && -x >= half) x += half;
      setX(x);
    };
    new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { gsap.ticker.add(tick); running = true; }
      else if (!vis && running) { gsap.ticker.remove(tick); running = false; }
    }).observe(track);
    track.parentElement.addEventListener('mouseenter', function () { hovered = true; });
    track.parentElement.addEventListener('mouseleave', function () { hovered = false; });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
