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

  function renderActiveLorries(outlets) {
    var active = outlets.filter(function (o) { return o.status === 'active'; });
    var html = active.map(function (o) { return lorryCardHtml(o, true); }).join('');
    setHtml('active-lorries-grid', html || '<p class="empty-state">No lorries active right now.</p>');
  }

  function renderAllLorries(outlets) {
    var html = outlets.map(function (o) {
      return lorryCardHtml(o, o.status === 'active');
    }).join('');
    setHtml('all-lorries-grid', html);
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
    renderActiveLorries(SAMPLE_DATA.outlets || []);
    renderAllLorries(SAMPLE_DATA.outlets || []);
    renderMenuPreview(SAMPLE_DATA.products || []);
    renderWeekRoute(SAMPLE_DATA.outlets || []);
    renderCartBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
