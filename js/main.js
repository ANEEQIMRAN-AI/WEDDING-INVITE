(function () {
  'use strict';
  var E = window.EVENT;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(hover: none)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- derived values ---------- */
  var d = E.date;
  var dateLabel = d.year ? d.display + ' ' + d.year : d.display;
  var weekday = '';
  if (d.year) try { weekday = new Date(Date.UTC(d.year, d.month - 1, d.day)).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' }); } catch (e) {}
  var timeLabel = 'To be announced';
if (E.time) {
  var tp = E.time.split(':'), th = +tp[0];
  timeLabel = ((th % 12) || 12) + ':' + tp[1] + ' ' + (th >= 12 ? 'PM' : 'AM');
}
  var mapsUrl = E.mapUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(E.mapQuery));
  var vals = { bride: E.bride, groom: E.groom, title: E.title, titleUrdu: E.titleUrdu, dateLabel: dateLabel, venue: E.venue, area: E.area, closingSignature: E.closingSignature };
  $$('[data-bind]').forEach(function (el) { el.textContent = vals[el.getAttribute('data-bind')] || ''; });

  /* ---------- gold dust (CSS-animated) ---------- */
  $$('.particles').forEach(function (box) {
    if (reduce) return;
    var n = window.innerWidth < 640 ? 8 : 16;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span'), size = 3 + ((i * 7) % 5);
      s.style.cssText = 'left:' + ((i * 53 + 17) % 100) + '%;width:' + size + 'px;height:' + size + 'px;animation-duration:' + (14 + ((i * 5) % 12)) + 's;animation-delay:-' + ((i * 3) % 14) + 's;--dx:' + (((i % 5) - 2) * 14) + 'px';
      box.appendChild(s);
    }
  });

  /* ---------- invitation image ---------- */
  var inv = $('#invImg'); inv.src = E.invitation.src; inv.alt = E.invitation.alt;

  /* ---------- gallery ---------- */
  var items = E.gallery;
  $('#gal').innerHTML = items.map(function (g, i) {
    return '<li class="g g' + (i + 1) + ' reveal reveal-clip" style="--d:' + (i * 0.12) + 's"><button type="button" class="tile" data-i="' + i + '" aria-label="View larger: ' + g.caption + '">' +
      '<img src="' + g.thumb + '" alt="' + g.alt + '" width="' + g.w + '" height="' + g.h + '" loading="lazy" decoding="async"><span class="cap">' + g.caption + '</span></button></li>';
  }).join('');

  /* ---------- details ---------- */
  var rows = [['✦', 'Event', E.title], ['❀', 'Bride', E.bride], ['♕', 'Groom', E.groom],
    ['❖', 'Date', (weekday ? weekday + ', ' : '') + dateLabel], ['◔', 'Time', timeLabel], ['⌂', 'Venue', E.venue], ['⚲', 'Location', E.address]];
  $('#cards').innerHTML = rows.map(function (r, i) {
    return '<div class="card reveal" style="--d:' + ((i % 2) * 0.1) + 's"><span class="ic" aria-hidden="true">' + r[0] + '</span><dt>' + r[1] + '</dt><dd>' + r[2] + '</dd></div>';
  }).join('');
  $('#mapLink').href = mapsUrl;
 var rsvpBox = $('#rsvpList');
(E.contact.rsvp || []).forEach(function (r) {
  var a = document.createElement('a');
  a.className = 'btn btn-ghost';
  a.textContent = r.label || 'RSVP';
  a.href = r.whatsapp ? 'https://wa.me/' + r.whatsapp.replace(/\D/g, '')
                      : 'tel:' + r.phone;
  if (r.whatsapp) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  rsvpBox.appendChild(a);
});

  /* ---------- scroll reveals ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  $$('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- parallax + progress bar (transform only, rAF-throttled) ---------- */
  var par = $$('[data-parallax]'), bar = $('#progress'), ticking = false;
  function paint() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
    if (!reduce) par.forEach(function (el) { el.style.transform = 'translate3d(0,' + (Math.min(y, 900) * parseFloat(el.dataset.parallax)).toFixed(1) + 'px,0)'; });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });

  /* ---------- 3D tilt on the invitation (desktop pointer only) ---------- */
  var tilt = $('#tilt'), frame = $('#invBtn');
  if (!reduce && !coarse) {
    frame.addEventListener('pointermove', function (e) {
      var r = frame.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = 'perspective(900px) rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
    });
    frame.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
  }

  /* ---------- intro: envelope → text → site ---------- */
  var intro = $('#intro'), opened = false;
  function closeIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    document.body.classList.remove('locked');
    el.classList.add('out');
    document.removeEventListener('keydown', introKey);
    setTimeout(function () { el.remove(); window.scrollTo(0, 0); }, reduce ? 0 : 1000);
  }
  function breakSeal() {
    if (opened || !intro) return; opened = true;
    intro.classList.add('opening');
    setTimeout(function () { if (intro) { intro.dataset.stage = 'b'; $('#open').focus({ preventScroll: true }); } }, reduce ? 0 : 1300);
  }
  function introKey(e) { if (e.key === 'Escape') closeIntro(); }
  $('#seal').addEventListener('click', breakSeal);
  $('#open').addEventListener('click', closeIntro);
  $('#skip').addEventListener('click', closeIntro);
  document.addEventListener('keydown', introKey);
  $('#seal').focus({ preventScroll: true });

  /* ---------- share ---------- */
  $$('[data-share]').forEach(function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var done = function () { b.textContent = 'Link copied'; setTimeout(function () { b.textContent = label; }, 2200); };
      var fallback = function () {
        var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) {} t.remove();
      };
      if (navigator.share) navigator.share({ title: E.bride + ' weds ' + E.groom + ' — ' + E.title, text: 'You are invited to the ' + E.title + ' of ' + E.bride + ' and ' + E.groom + '.', url: url }).catch(function () {});
      else if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, fallback);
      else fallback();
    });
  });

  /* ---------- countdown ---------- */
  function getTarget() {
    if (d.year == null) return { s: 'unconfigured' };
    var t = new Date(Date.UTC(d.year, d.month - 1, d.day));
    var ok = Number.isInteger(d.year) && d.year >= 2024 && d.year <= 2100 && t.getUTCFullYear() === d.year && t.getUTCMonth() === d.month - 1 && t.getUTCDate() === d.day;
    if (!ok || (E.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(E.time))) return { s: 'invalid' };
    var start = Date.parse(d.year + '-' + pad(d.month) + '-' + pad(d.day) + 'T' + (E.time || '00:00') + ':00' + E.utcOffset);
    return isNaN(start) ? { s: 'invalid' } : { s: 'ok', start: start, end: start + 864e5 };
  }
  var box = $('#cdBox'), T = getTarget(), cells = null;
  function msg(html, cls) { box.innerHTML = '<p class="cd-msg ' + (cls || '') + '">' + html + '</p>'; }
  function build() {
    box.innerHTML = '<div class="cd" role="timer">' + ['Days', 'Hours', 'Minutes', 'Seconds'].map(function (l) {
      return '<div class="cd-cell"><div class="cd-num" aria-hidden="true">0</div><span class="cd-label">' + l + '</span></div>';
    }).join('') + '</div>' + (E.time ? '' : '<p class="cd-note">Counting down to the start of ' + dateLabel + ' (Pakistan time) until the ceremony time is confirmed.</p>');
    cells = $$('.cd-num', box); cells.forEach(function (c) { c.dataset.v = ''; });
  }
  function setNum(el, v) {
    if (el.dataset.v === v) return; el.dataset.v = v; el.textContent = v;
    if (!reduce) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
  }
  function tick() {
    var now = Date.now();
    if (now >= T.end) { msg('Thank you for being part of this beautiful celebration.', 'cd-thanks'); return false; }
    if (now >= T.start) { msg('Today is the day — the ' + E.title + ' is here.', 'cd-thanks'); return false; }
    if (!cells) build();
    var s = Math.floor((T.start - now) / 1000);
    setNum(cells[0], String(Math.floor(s / 86400))); setNum(cells[1], pad(Math.floor((s % 86400) / 3600)));
    setNum(cells[2], pad(Math.floor((s % 3600) / 60))); setNum(cells[3], pad(s % 60));
    $('.cd', box).setAttribute('aria-label', Math.floor(s / 86400) + ' days, ' + Math.floor((s % 86400) / 3600) + ' hours, ' + Math.floor((s % 3600) / 60) + ' minutes remaining');
    return true;
  }
  if (T.s === 'unconfigured') msg('The countdown will appear once the date is confirmed.<br><strong>' + dateLabel + '</strong>');
  else if (T.s === 'invalid') msg('The countdown is unavailable. Please check the event date in <code>js/config.js</code>.');
  else if (tick()) {
    var id = setInterval(function () { if (!tick()) clearInterval(id); }, 1000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), stage = $('#lbStage'), cur = 0, list = [], opener = null, zoom = false, sx = null, sy = null;
  function setZoom(z) { zoom = z; stage.classList.toggle('zoomed', z); var b = $('#lbZoom'); b.textContent = z ? '−' : '+'; b.setAttribute('aria-label', z ? 'Zoom out' : 'Zoom in'); }
  function show(i) {
    cur = (i + list.length) % list.length; var it = list[cur];
    setZoom(false); lbImg.classList.add('fading');
    var n = new Image(); n.onload = n.onerror = function () { lbImg.src = it.src; lbImg.alt = it.alt; lbImg.width = it.w; lbImg.height = it.h; lbImg.classList.remove('fading'); }; n.src = it.src;
    $('#lbCap').textContent = it.caption || '';
    $('#lbCount').textContent = list.length > 1 ? (cur + 1) + ' / ' + list.length : '';
    $('#lbPrev').hidden = $('#lbNext').hidden = list.length < 2;
  }
  function openLb(l, i) {
    list = l; opener = document.activeElement; lb.hidden = false; document.body.classList.add('locked');
    requestAnimationFrame(function () { lb.classList.add('open'); }); show(i); $('#lbClose').focus();
  }
  function closeLb() {
    lb.classList.remove('open'); document.body.classList.remove('locked');
    setTimeout(function () { lb.hidden = true; }, reduce ? 0 : 300);
    if (opener && opener.focus) opener.focus();
  }
  frame.addEventListener('click', function () { openLb([{ src: E.invitation.src, alt: E.invitation.alt, w: E.invitation.w, h: E.invitation.h, caption: 'Barat Invitation' }], 0); });
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) openLb(items, +b.dataset.i); });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbZoom').addEventListener('click', function () { setZoom(!zoom); });
  $('#lbPrev').addEventListener('click', function () { show(cur - 1); });
  $('#lbNext').addEventListener('click', function () { show(cur + 1); });
  lbImg.addEventListener('dblclick', function () { setZoom(!zoom); });
  stage.addEventListener('click', function (e) { if (e.target === stage) closeLb(); });
  lb.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; });
  lb.addEventListener('pointerup', function (e) {
    if (sx === null || zoom || list.length < 2) { sx = null; return; }
    var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight' && list.length > 1) show(cur + 1);
    else if (e.key === 'ArrowLeft' && list.length > 1) show(cur - 1);
    else if (e.key === 'Tab') {
      var fs = $$('button', lb).filter(function (b) { return !b.hidden; }), a = document.activeElement;
      if (e.shiftKey && a === fs[0]) { e.preventDefault(); fs[fs.length - 1].focus(); }
      else if (!e.shiftKey && a === fs[fs.length - 1]) { e.preventDefault(); fs[0].focus(); }
    }
  });
})();
