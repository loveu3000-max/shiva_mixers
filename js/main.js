/* ============================================================
   SHIVA CONCRETE MIXERS — MAIN JAVASCRIPT
   GSAP ScrollTrigger + Custom Interactions
   ============================================================ */

'use strict';

/* ── LOADER ───────────────────────────────────────────────── */
window.addEventListener('load', function () {
  setTimeout(function () {
    var loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
    initAll();
  }, 1600);
});

document.body.style.overflow = 'hidden';

/* ── INIT ALL ─────────────────────────────────────────────── */
function initAll() {
  initHeroCarousel();    /* ← auto-play carousel hero (must be first) */
  initThemeToggle();
  initGSAP();
  initNavbar();
  initMobileMenu();
  initScrollProgress();
  initParticles();
  initCounters();
  initTestimonialCarousel();
  initFAQ();
  initContactForm();
  initMagneticButtons();
  initScrollTop();
}

/* ── HERO CAROUSEL ───────────────────────────────────────────
   Auto-play full-bleed image carousel with Ken Burns,
   crossfade transitions, dot nav, arrows & progress bar.

   To add more slides: drop images in assets/images/carousel/
   and add the filename to CAROUSEL_IMAGES below.
   ─────────────────────────────────────────────────────────── */
function initHeroCarousel() {

  /* ── IMAGE LIST — add filenames here to extend the carousel ── */
  var CAROUSEL_IMAGES = [
    'assets/images/carousel/shiva_mixture.png',
    'assets/images/carousel/tanker.png'
  ];

  var INTERVAL_MS   = 5500;   /* ms between auto-advances   */
  var TRANSITION_MS = 1100;   /* must match CSS transition   */

  /* ── DOM refs ── */
  var track    = document.getElementById('hcar-track');
  var dotsWrap = document.getElementById('hcar-dots');
  var curEl    = document.getElementById('hcar-cur');
  var totEl    = document.getElementById('hcar-tot');
  var prevBtn  = document.getElementById('hcar-prev');
  var nextBtn  = document.getElementById('hcar-next');
  var bar      = document.getElementById('hcar-progress-bar');

  if (!track) return;

  var total   = CAROUSEL_IMAGES.length;
  var current = 0;
  var timer   = null;
  var barTimer = null;
  var slides  = [];
  var dots    = [];
  var busy    = false;

  /* ── Build slides ── */
  CAROUSEL_IMAGES.forEach(function (src, i) {
    var slide = document.createElement('div');
    slide.className = 'hcar-slide' + (i === 0 ? ' is-active' : '');
    slide.setAttribute('role', 'img');

    var img = document.createElement('img');
    img.src   = src;
    img.className = 'hcar-slide-img';
    img.alt   = '';
    img.draggable = false;
    if (i === 0) img.setAttribute('fetchpriority', 'high');
    else         img.setAttribute('loading', 'lazy');

    slide.appendChild(img);
    track.appendChild(slide);
    slides.push(slide);
  });

  /* ── Build dots ── */
  CAROUSEL_IMAGES.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'hcar-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  /* ── Update counter ── */
  if (totEl) totEl.textContent = pad(total);
  if (curEl) curEl.textContent = pad(1);

  /* ── Go to slide ── */
  function goTo(idx) {
    if (busy || idx === current) return;
    busy = true;

    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');

    current = (idx + total) % total;

    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    if (curEl) curEl.textContent = pad(current + 1);

    resetProgress();
    startProgress();

    setTimeout(function () { busy = false; }, TRANSITION_MS);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ── Auto-play timer ── */
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL_MS);
  }

  /* ── Progress bar ── */
  function resetProgress() {
    if (!bar) return;
    clearInterval(barTimer);
    bar.style.transition = 'none';
    bar.style.width = '0%';
  }
  function startProgress() {
    if (!bar) return;
    var step  = 50;              /* update every 50 ms   */
    var elapsed = 0;
    setTimeout(function () {
      barTimer = setInterval(function () {
        elapsed += step;
        var pct = Math.min((elapsed / INTERVAL_MS) * 100, 100);
        bar.style.transition = 'none';
        bar.style.width = pct + '%';
        if (pct >= 100) clearInterval(barTimer);
      }, step);
    }, 20);
  }

  /* ── Arrow buttons ── */
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); startTimer(); });

  /* ── Keyboard navigation ── */
  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('home')) return;
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
    if (e.key === 'ArrowRight') { next(); startTimer(); }
  });

  /* ── Pause on hover ── */
  var section = document.querySelector('.hero-carousel');
  if (section) {
    section.addEventListener('mouseenter', function () { clearInterval(timer); clearInterval(barTimer); });
    section.addEventListener('mouseleave', function () { startTimer(); startProgress(); });
  }

  /* ── Touch / swipe support ── */
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next(); else prev();
      startTimer();
    }
  }, { passive: true });

  /* ── Content reveal with GSAP ── */
  if (typeof gsap !== 'undefined') {
    var tl = gsap.timeline({ delay: 0.3 });
    tl.to('#hcar-badge',   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('#hcar-title',   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.35')
      .to('#hcar-sub',     { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45')
      .to('#hcar-actions', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.40');
  } else {
    /* Fallback — just make content visible */
    ['hcar-badge','hcar-title','hcar-sub','hcar-actions'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
  }

  /* ── Kick it off ── */
  startTimer();
  startProgress();
}

/* ── THEME TOGGLE ─────────────────────────────────────────── */
function initThemeToggle() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Listen to OS preference changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    if (!localStorage.getItem('scm-theme')) {
      setTheme(e.matches ? 'light' : 'dark');
    }
  });

  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next    = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('scm-theme', next);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* ── GSAP SCROLL ANIMATIONS ───────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Animate all [data-gsap] elements
  document.querySelectorAll('[data-gsap]').forEach(function (el) {
    var type   = el.getAttribute('data-gsap') || 'fade-up';
    var delay  = parseFloat(el.getAttribute('data-delay') || '0');

    var fromVars = { opacity: 0, duration: 0.8, delay: delay, ease: 'power3.out' };
    if (type === 'fade-up')    { fromVars.y = 40; }
    if (type === 'fade-left')  { fromVars.x = -40; fromVars.y = 0; }
    if (type === 'fade-right') { fromVars.x = 40;  fromVars.y = 0; }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.fromTo(el, { opacity: 0, y: fromVars.y || 0, x: fromVars.x || 0 }, {
          opacity: 1, y: 0, x: 0,
          duration: fromVars.duration,
          delay:    fromVars.delay,
          ease:     fromVars.ease
        });
      }
    });
  });

  // Parallax blobs in hero
  var blobs = document.querySelectorAll('.hero-blob');
  blobs.forEach(function (blob, i) {
    gsap.to(blob, {
      y: (i % 2 === 0 ? -80 : 80),
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  // Hero image subtle parallax
  var heroImg = document.querySelector('.hero-image-wrap');
  if (heroImg) {
    gsap.to(heroImg, {
      y: 60,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Active nav link highlighting
  var sections = document.querySelectorAll('section[id], div[id]');
  sections.forEach(function (section) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: function ()     { setActiveLink(section.id); },
      onEnterBack: function () { setActiveLink(section.id); }
    });
  });
}

function setActiveLink(id) {
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + id) {
      link.classList.add('active');
    }
  });
}

/* ── NAVBAR ───────────────────────────────────────────────── */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = 76;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH;

      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, { duration: 0.9, scrollTo: top, ease: 'power3.inOut' });
      } else {
        window.scrollTo({ top: top, behavior: 'smooth' });
      }

      // Close mobile menu
      closeMobileMenu();
    });
  });
}

/* ── MOBILE MENU ──────────────────────────────────────────── */
function initMobileMenu() {
  var ham  = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', function () {
    var isOpen = ham.classList.toggle('open');
    ham.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      menu.classList.add('open');
      menu.style.display = 'flex';
    } else {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  var ham  = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
}

/* ── SCROLL PROGRESS ──────────────────────────────────────── */
function initScrollProgress() {
  var bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, progress) + '%';
  }, { passive: true });
}

/* ── PARTICLES ────────────────────────────────────────────── */
function initParticles() {
  var container = document.getElementById('particles');
  if (!container) return;

  var count = window.innerWidth < 640 ? 12 : 24;
  for (var i = 0; i < count; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  var p     = document.createElement('div');
  p.className = 'particle';

  var size  = Math.random() * 3 + 2;
  var left  = Math.random() * 100;
  var dur   = Math.random() * 12 + 8;
  var delay = Math.random() * 15;

  p.style.cssText =
    'left:' + left + '%;' +
    'bottom:' + (Math.random() * 30) + '%;' +
    'width:' + size + 'px;height:' + size + 'px;' +
    'animation-duration:' + dur + 's;' +
    'animation-delay:' + delay + 's;' +
    'opacity:' + (Math.random() * 0.5 + 0.1) + ';';

  container.appendChild(p);
}

/* ── COUNTERS ─────────────────────────────────────────────── */
function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el     = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start  = 0;
      var dur    = 2200;
      var step   = 16;
      var steps  = Math.ceil(dur / step);
      var inc    = target / steps;
      var current = start;

      var timer = setInterval(function () {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.round(current).toLocaleString('en-IN') + suffix;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
}

/* ── TESTIMONIAL CAROUSEL ─────────────────────────────────── */
function initTestimonialCarousel() {
  var track     = document.getElementById('testimonial-track');
  var dotsWrap  = document.getElementById('carousel-dots');
  var prevBtn   = document.getElementById('prev-btn');
  var nextBtn   = document.getElementById('next-btn');
  if (!track) return;

  var cards     = track.querySelectorAll('.testimonial-card');
  var total     = cards.length;
  var current   = 0;
  var perPage   = getPerPage();
  var autoTimer;

  function getPerPage() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    var pages = Math.ceil(total / perPage);
    for (var i = 0; i < pages; i++) {
      var dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-index')) * perPage); });
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - perPage));
    var cardWidth = cards[0].offsetWidth + 24; // gap: 1.5rem = 24px
    track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';

    // Update dots
    var activePage = Math.floor(current / perPage);
    document.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === activePage);
    });
  }

  function next() { goTo(current + perPage >= total ? 0 : current + perPage); }
  function prev() { goTo(current - perPage < 0 ? Math.max(0, total - perPage) : current - perPage); }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  // Touch/swipe
  var startX = 0;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); resetAuto(); }
  }, { passive: true });

  window.addEventListener('resize', function () {
    perPage = getPerPage();
    buildDots();
    goTo(0);
  });

  buildDots();
  startAuto();
}

/* ── FAQ ACCORDION ────────────────────────────────────────── */
function initFAQ() {
  var questions = document.querySelectorAll('.faq-question');
  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (open) {
        open.classList.remove('open');
        open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── CONTACT FORM ─────────────────────────────────────────── */
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name  = form.querySelector('#name').value.trim();
    var phone = form.querySelector('#phone').value.trim();
    var loc   = form.querySelector('#location').value.trim();
    var req   = form.querySelector('#requirement').value.trim();

    if (!name || !phone || !loc || !req) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    // WhatsApp redirect with pre-filled message
    var msg = encodeURIComponent(
      'Hello, I am ' + name + ' from ' + loc + '.\n\n' +
      'Requirement: ' + req + '\n\n' +
      'Phone: ' + phone
    );
    var waUrl = 'https://wa.me/919123282007?text=' + msg;

    showFormMessage(form, '✓ Redirecting to WhatsApp...', 'success');
    setTimeout(function () { window.open(waUrl, '_blank'); }, 800);
  });
}

function showFormMessage(form, msg, type) {
  var existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  var el = document.createElement('div');
  el.className = 'form-message';
  el.textContent = msg;
  el.style.cssText =
    'padding:.75rem 1rem;border-radius:8px;font-size:.85rem;font-weight:600;margin-top:.75rem;text-align:center;' +
    (type === 'error'
      ? 'background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#f87171;'
      : 'background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#86efac;');
  form.appendChild(el);
  setTimeout(function () { el.remove(); }, 4000);
}

/* ── MAGNETIC BUTTONS ─────────────────────────────────────── */
function initMagneticButtons() {
  if (window.innerWidth < 900) return; // desktop only

  document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect   = btn.getBoundingClientRect();
      var cx     = rect.left + rect.width / 2;
      var cy     = rect.top  + rect.height / 2;
      var dx     = (e.clientX - cx) * 0.25;
      var dy     = (e.clientY - cy) * 0.25;
      btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
}

/* ── SCROLL TO TOP ────────────────────────────────────────── */
function initScrollTop() {
  var topBtn = document.querySelector('.fab-top');
  if (!topBtn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });
}

/* ── LAZY LOAD IMAGES ─────────────────────────────────────── */
(function () {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  var imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var img = e.target;
        if (img.dataset.src) img.src = img.dataset.src;
        io.unobserve(img);
      }
    });
  });

  imgs.forEach(function (img) { io.observe(img); });
})();
