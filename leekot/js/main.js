/* LEEKOT — interactions */
(function () {
  document.documentElement.classList.remove('no-js');

  var WA_NUMBER = '972547520431';

  /* Nav: transparent → opaque on scroll */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll-triggered reveals */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Events: category filter */
  var filters = document.querySelectorAll('.filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('.event').forEach(function (ev) {
        ev.hidden = !(cat === 'all' || ev.getAttribute('data-cat') === cat);
      });
    });
  });

  /* Events: registration modal → sends to WhatsApp */
  var modal = document.getElementById('register-modal');
  if (modal) {
    var titleEl = modal.querySelector('[data-modal-title]');
    var metaEl = modal.querySelector('[data-modal-meta]');
    var form = modal.querySelector('form');
    var current = null;
    var lastFocus = null;

    function openModal(ev) {
      current = ev;
      titleEl.textContent = ev.getAttribute('data-title');
      metaEl.textContent = ev.getAttribute('data-when');
      lastFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(function () { form.querySelector('input').focus(); }, 50);
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-register]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn.closest('.event')); });
    });
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'שלום LEEKOT, אשמח להירשם ל: ' + current.getAttribute('data-title') +
        ' (' + current.getAttribute('data-when') + ')\n' +
        'שם: ' + d.get('name') + '\n' +
        'טלפון: ' + d.get('phone') + '\n' +
        'מספר משתתפים: ' + d.get('count');
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      form.reset();
      closeModal();
    });
  }

  /* Contact form → WhatsApp */
  var contact = document.getElementById('contact-form');
  if (contact) {
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(contact);
      var msg = 'שלום LEEKOT,\n' + d.get('message') + '\n\n— ' + d.get('name') +
        (d.get('email') ? ' (' + d.get('email') + ')' : '');
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      contact.querySelector('.form-note').textContent = 'תודה! ההודעה נפתחה ב-WhatsApp — נחזור אליכם בקרוב.';
      contact.reset();
    });
  }

  /* Footer year */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
