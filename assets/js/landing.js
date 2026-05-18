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

  // ---------- Week route grid ----------
  function renderWeekRoute(outlets) {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    var header = [
      '<div class="week-route-row week-route-header">',
        '<div class="week-route-cell week-route-label">Lorry</div>',
        days.map(function (d) {
          return '<div class="week-route-cell week-route-day-label">' + d + '</div>';
        }).join(''),
      '</div>'
    ].join('');

    var rows = outlets.map(function (o) {
      var scheduleByDay = {};
      (o.weekSchedule || []).forEach(function (s) { scheduleByDay[s.day] = s.location; });

      var cells = days.map(function (d) {
        var loc = scheduleByDay[d] || '—';
        return [
          '<div class="week-route-cell">',
            '<span class="day-pill">' + escapeHtml(loc) + '</span>',
          '</div>'
        ].join('');
      }).join('');

      return [
        '<div class="week-route-row">',
          '<div class="week-route-cell week-route-label">' + escapeHtml(o.name) + '</div>',
          cells,
        '</div>'
      ].join('');
    }).join('');

    setHtml('week-route-grid', header + rows);
  }

  // ---------- Week route mobile cards (day-first, accordion) ----------
  function renderWeekRouteCards(outlets) {
    var days = [
      { abbr: 'Mon', full: 'Monday' },
      { abbr: 'Tue', full: 'Tuesday' },
      { abbr: 'Wed', full: 'Wednesday' },
      { abbr: 'Thu', full: 'Thursday' },
      { abbr: 'Fri', full: 'Friday' },
      { abbr: 'Sat', full: 'Saturday' },
      { abbr: 'Sun', full: 'Sunday' }
    ];

    // Today expanded by default; JS Date.getDay() returns 0=Sun..6=Sat
    var todayIdx = (new Date().getDay() + 6) % 7; // shift so 0=Mon..6=Sun
    var todayAbbr = days[todayIdx].abbr;

    var html = days.map(function (d) {
      var rows = outlets.map(function (o) {
        var entry = (o.weekSchedule || []).filter(function (s) { return s.day === d.abbr; })[0];
        var loc = entry ? entry.location : '—';
        return [
          '<li class="day-card-row">',
            '<span class="day-card-lorry">&#128666; ' + escapeHtml(o.name) + '</span>',
            '<span class="day-card-location">&#128205; ' + escapeHtml(loc) + '</span>',
          '</li>'
        ].join('');
      }).join('');

      var isOpen = d.abbr === todayAbbr;
      var isToday = isOpen;

      return [
        '<details class="day-card"' + (isOpen ? ' open' : '') + '>',
          '<summary class="day-card-head">',
            '<span class="day-card-title">' + d.full + (isToday ? ' <span class="day-card-today">TODAY</span>' : '') + '</span>',
            '<span class="day-card-meta">' + outlets.length + ' lorries</span>',
            '<span class="day-card-chevron" aria-hidden="true">&#x25BE;</span>',
          '</summary>',
          '<ul class="day-card-list">', rows, '</ul>',
        '</details>'
      ].join('');
    }).join('');

    setHtml('week-route-cards', html);
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
    renderWeekRoute(outlets);
    renderWeekRouteCards(outlets);
    renderCartBadge();
    wireLorrySearch(outlets);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
