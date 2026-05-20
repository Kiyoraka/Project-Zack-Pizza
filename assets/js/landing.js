// Zack Pizza - Landing page renderer (vanilla JS, reads global SAMPLE_DATA)
(function () {
  'use strict';

  // ---------- Helpers ----------
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(num) {
    var n = Number(num) || 0;
    return 'RM ' + n.toFixed(2);
  }

  function formatTodayDate(d) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate();
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // ---------- Lorry card builder ----------
  function lorryCardHtml(outlet, isActive) {
    var loc = outlet.todayLocation || {};
    var badge = isActive
      ? '<span class="badge badge-active">ACTIVE NOW</span>'
      : '<span class="badge badge-cancelled">CLOSED TODAY</span>';
    var action = isActive
      ? '<a class="btn btn-primary" href="outlet.html?id=' + encodeURIComponent(outlet.id) + '">Order &rarr;</a>'
      : '<button class="btn btn-secondary" disabled>Closed</button>';

    return [
      '<div class="lorry-card">',
        '<div class="lorry-card-header">',
          '<span class="lorry-emoji">&#128666;</span>',
          '<h3 class="lorry-name">' + escapeHtml(outlet.name) + '</h3>',
        '</div>',
        '<div class="lorry-card-row lorry-location">',
          '<span class="lorry-icon">&#128205;</span>',
          '<div class="lorry-location-text">',
            '<div class="lorry-location-name">' + escapeHtml(loc.name || '—') + '</div>',
            '<div class="lorry-location-address">' + escapeHtml(loc.address || '') + '</div>',
          '</div>',
        '</div>',
        '<div class="lorry-card-row lorry-hours">',
          '<span class="lorry-icon">&#128340;</span>',
          '<span>' + escapeHtml(loc.hoursStart || '--:--') + ' &ndash; ' + escapeHtml(loc.hoursEnd || '--:--') + '</span>',
        '</div>',
        '<div class="lorry-card-footer">',
          badge,
          action,
        '</div>',
      '</div>'
    ].join('');
  }

  function getFilteredOutlets(outlets, query) {
    if (!query) return outlets;
    var q = query.toLowerCase().trim();
    if (!q) return outlets;
    return outlets.filter(function (o) {
      var loc = o.todayLocation || {};
      var weekLocs = (o.weekSchedule || []).map(function (s) { return s.location || ''; }).join(' ');
      var hay = [o.name, loc.name, loc.address, weekLocs].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function emptyStateHtml(query) {
    var msg = query
      ? 'No lorries match &ldquo;' + escapeHtml(query) + '&rdquo;.'
      : 'No lorries active right now.';
    return '<p class="empty-state">' + msg + '</p>';
  }

  function renderActiveLorries(outlets, query) {
    var active = outlets.filter(function (o) { return o.status === 'active'; });
    var html = active.map(function (o) { return lorryCardHtml(o, true); }).join('');
    setHtml('active-lorries-grid', html || emptyStateHtml(query));
    renderDots('active-lorries-grid', 'active-lorries-dots', active.length);
  }

  function renderAllLorries(outlets, query) {
    var html = outlets.map(function (o) {
      return lorryCardHtml(o, o.status === 'active');
    }).join('');
    setHtml('all-lorries-grid', html || emptyStateHtml(query));
    renderDots('all-lorries-grid', 'all-lorries-dots', outlets.length);
  }

  // ---------- Carousel dots (mobile) ----------
  function renderDots(gridId, dotsId, count) {
    var dots = document.getElementById(dotsId);
    var grid = document.getElementById(gridId);
    if (!dots || !grid) return;

    if (count <= 1) {
      dots.innerHTML = '';
      return;
    }

    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<button type="button" class="carousel-dot' + (i === 0 ? ' active' : '') +
              '" data-index="' + i + '" aria-label="Go to lorry ' + (i + 1) + '"></button>';
    }
    dots.innerHTML = html;

    // Tap-to-jump
    dots.querySelectorAll('.carousel-dot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-index')) || 0;
        var card = grid.children[idx];
        if (card && typeof card.scrollIntoView === 'function') {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    });

    // Sync active dot on scroll (mobile only — desktop hides dots via CSS)
    var syncing = false;
    grid.addEventListener('scroll', function () {
      if (syncing) return;
      syncing = true;
      window.requestAnimationFrame(function () {
        syncing = false;
        var first = grid.children[0];
        if (!first) return;
        var cardWidth = first.getBoundingClientRect().width + 16; // gap
        var active = Math.round(grid.scrollLeft / cardWidth);
        var btns = dots.querySelectorAll('.carousel-dot');
        btns.forEach(function (b, i) {
          b.classList.toggle('active', i === active);
        });
      });
    });
  }

  // ---------- Search wiring ----------
  function wireLorrySearch(outlets) {
    var input = document.getElementById('lorry-search-input');
    var clear = document.getElementById('lorry-search-clear');
    if (!input) return;

    function rerender() {
      var q = input.value;
      var filtered = getFilteredOutlets(outlets, q);
      renderActiveLorries(filtered, q);
      renderAllLorries(filtered, q);
      if (clear) clear.hidden = !q;
    }

    input.addEventListener('input', rerender);
    if (clear) {
      clear.addEventListener('click', function () {
        input.value = '';
        clear.hidden = true;
        rerender();
        input.focus();
      });
    }
  }

  // ---------- Menu preview ----------
  function menuItemHtml(p) {
    var soft = 'linear-gradient(135deg, #ffd7d2, #ffe9b0)';
    var imageStyle = p.image
      ? 'background-image:url(\'' + escapeHtml(p.image) + '\'); background-size:cover; background-position:center;'
      : 'background:' + soft + ';';
    return [
      '<div class="menu-item">',
        '<div class="menu-item-image" style="' + imageStyle + '"></div>',
        '<div class="menu-item-body">',
          '<h3 class="menu-item-name">' + escapeHtml(p.name) + '</h3>',
          '<div class="menu-item-meta">',
            '<span class="menu-item-price">' + formatPrice(p.price) + '</span>',
            '<span class="badge badge-muted">' + escapeHtml(p.category) + '</span>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderMenuPreview(products) {
    // Catalog is pizza-only (Classic + Signature). No filter needed - all products are pizza.
    var groups = {};
    var order = [];
    products.forEach(function (p) {
      if (!groups[p.category]) {
        groups[p.category] = [];
        order.push(p.category);
      }
      groups[p.category].push(p);
    });

    var html = order.map(function (cat) {
      var items = groups[cat].slice(0, 4).map(menuItemHtml).join('');
      return [
        '<section class="menu-category">',
          '<h3 class="menu-category-heading">' + escapeHtml(cat) + '</h3>',
          '<div class="menu-grid">' + items + '</div>',
        '</section>'
      ].join('');
    }).join('');

    setHtml('menu-preview', html);
  }

  // ---------- Week route: today hero + week drawer ----------
  var DAYS_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var LORRY_EMOJI = {
    'lorry-1': '&#129472;',  // cheese wedge
    'lorry-2': '&#127798;',  // hot pepper
    'lorry-3': '&#129382;',  // leafy green
    'lorry-4': '&#127829;',  // pizza
    'lorry-5': '&#129749;',  // canned food
    'lorry-6': '&#127956;',  // beach with umbrella
    'lorry-7': '&#127754;',  // water wave
    'lorry-8': '&#128679;',  // construction
    'lorry-9': '&#9968;&#65039;' // mountain
  };

  var todayIdx = new Date().getDay();
  var activeIdx = todayIdx;
  var weekStartDate = (function () {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  })();

  function dateForDayIdx(idx) {
    var d = new Date(weekStartDate);
    d.setDate(d.getDate() + idx);
    return d;
  }

  function formatHourLabel(hhmm) {
    if (!hhmm) return '';
    var parts = String(hhmm).split(':');
    var h = parseInt(parts[0], 10);
    if (isNaN(h)) return hhmm;
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    if (h === 24) return '12 AM';
    if (h > 12) return (h - 12) + ' PM';
    return h + ' AM';
  }

  function formatHoursRange(outlet) {
    var loc = outlet.todayLocation || {};
    if (!loc.hoursStart || !loc.hoursEnd) return '';
    return formatHourLabel(loc.hoursStart) + ' &ndash; ' + formatHourLabel(loc.hoursEnd);
  }

  function todayHeroCardHtml(outlet, locationName) {
    var emoji = LORRY_EMOJI[outlet.id] || '&#128666;';
    var hours = formatHoursRange(outlet);
    var encodedLoc = encodeURIComponent(locationName);
    return [
      '<article class="lorry-card">',
        '<header class="lorry-card__header">',
          '<span class="lorry-card__emoji" aria-hidden="true">' + emoji + '</span>',
          '<h3 class="lorry-card__title">' + escapeHtml(outlet.name) + '</h3>',
        '</header>',
        '<p class="lorry-card__location"><span aria-hidden="true">&#128205;</span> ' + escapeHtml(locationName) + '</p>',
        (hours ? '<p class="lorry-card__hours"><span aria-hidden="true">&#128340;</span> ' + hours + '</p>' : ''),
        '<button type="button" class="btn btn-primary lorry-card__cta" data-location="' + encodedLoc + '">Directions &rarr;</button>',
      '</article>'
    ].join('');
  }

  function renderTodayHero(dayIdx) {
    var outlets = (SAMPLE_DATA && SAMPLE_DATA.outlets) || [];
    var dayKey = DAYS_ABBR[dayIdx];
    var html = outlets.map(function (o) {
      var slot = (o.weekSchedule || []).filter(function (s) { return s.day === dayKey; })[0];
      var loc = slot ? slot.location : '—';
      return todayHeroCardHtml(o, loc);
    }).join('');
    setHtml('today-hero-grid', html);

    var heading = document.getElementById('today-hero-heading');
    var dateEl = document.getElementById('today-hero-date');
    var backLink = document.getElementById('back-to-today');
    var d = dateForDayIdx(dayIdx);
    var dateLabel = DAYS_FULL[dayIdx] + ' &middot; ' + MONTHS_SHORT[d.getMonth()] + ' ' + d.getDate();

    if (heading) {
      heading.textContent = dayIdx === todayIdx
        ? "Where's Pizza Today?"
        : "Where's Pizza on " + DAYS_FULL[dayIdx] + '?';
    }
    if (dateEl) dateEl.innerHTML = dateLabel;
    if (backLink) backLink.hidden = (dayIdx === todayIdx);
  }

  function renderWeekDrawer() {
    var html = DAYS_ABBR.map(function (abbr, i) {
      var d = dateForDayIdx(i);
      var classes = ['day-pill'];
      if (i === activeIdx) classes.push('day-pill--active');
      if (i === todayIdx) classes.push('day-pill--today');
      return [
        '<button type="button" class="' + classes.join(' ') + '" data-day-idx="' + i + '">',
          '<span class="day-pill__abbr">' + abbr.toUpperCase() + '</span>',
          '<span class="day-pill__date">' + MONTHS_SHORT[d.getMonth()] + ' ' + d.getDate() + '</span>',
          (i === todayIdx ? '<span class="day-pill__today-dot" aria-hidden="true"></span>' : ''),
        '</button>'
      ].join('');
    }).join('');
    setHtml('day-pill-strip', html);
  }

  function attachDayPillHandlers() {
    var strip = document.getElementById('day-pill-strip');
    if (strip) {
      strip.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.day-pill') : null;
        if (!btn) return;
        var idx = parseInt(btn.getAttribute('data-day-idx'), 10);
        if (isNaN(idx) || idx === activeIdx) return;
        activeIdx = idx;
        renderTodayHero(activeIdx);
        renderWeekDrawer();
      });
    }

    var backLink = document.getElementById('back-to-today');
    if (backLink) {
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (activeIdx === todayIdx) return;
        activeIdx = todayIdx;
        renderTodayHero(activeIdx);
        renderWeekDrawer();
      });
    }

    var grid = document.getElementById('today-hero-grid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.lorry-card__cta') : null;
        if (!btn) return;
        var loc = btn.getAttribute('data-location') || '';
        if (!loc) return;
        var url = 'https://www.google.com/maps/search/?api=1&query=' + loc;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  }

  // ---------- Cart badge ----------
  function renderCartBadge() {
    var badge = document.getElementById('cart-count-badge');
    if (!badge) return;
    var count = 0;
    try {
      var raw = localStorage.getItem('zackpizza.cart.items');
      if (raw) {
        var items = JSON.parse(raw);
        if (Array.isArray(items)) {
          items.forEach(function (it) {
            count += Number(it && it.qty) || 0;
          });
        }
      }
    } catch (e) {
      count = 0;
    }

    if (count > 0) {
      badge.textContent = String(count);
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }

  // ---------- Boot ----------
  function init() {
    if (typeof SAMPLE_DATA === 'undefined') {
      console.error('SAMPLE_DATA missing — ensure data.js is loaded before landing.js');
      return;
    }

    setText('today-date', formatTodayDate(new Date()));
    var outlets = SAMPLE_DATA.outlets || [];
    renderActiveLorries(outlets, '');
    renderAllLorries(outlets, '');
    renderMenuPreview(SAMPLE_DATA.products || []);
    renderTodayHero(activeIdx);
    renderWeekDrawer();
    attachDayPillHandlers();
    renderCartBadge();
    wireLorrySearch(outlets);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
